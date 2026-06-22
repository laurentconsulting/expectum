"use client";

import { useEffect, useRef, useState } from "react";
import { EXPECTUM_STORAGE } from "@/lib/expectumStorage";
import ExpectumPage from "@/components/ExpectumPage";
import ExpectumSymbol from "@/components/ExpectumSymbol";
import ExpectumAuthGate from "@/components/ExpectumAuthGate";
import ExpectumButton from "@/components/ExpectumButton";
import { supabase } from "@/lib/supabaseClient";

import type {
  ThreadMessage,
  Landmark,
  HistoryItem,
  SharedInsight,
  ReflectionMode,
} from "@/lib/expectumTypes";

function getModeLabel(mode?: string) {
  if (mode === "thought") return "Mõttekohtumine";
  if (mode === "exploration") return "Avardamine";
  return "Kohtumine";
}

export default function Reflection() {
  const [question, setQuestion] = useState("Aim");
  const [thread, setThread] = useState<ThreadMessage[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [followUp, setFollowUp] = useState("");
  const [landmarkIds, setLandmarkIds] = useState<string[]>([]);
  const [sharedIds, setSharedIds] = useState<string[]>([]);

  const hasGeneratedRef = useRef(false);
  const meetingEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const savedQuestion =
      localStorage.getItem(EXPECTUM_STORAGE.question) || "";

    const savedCount = Number(
      localStorage.getItem(EXPECTUM_STORAGE.questionCount) || "0"
    );

    const savedThread: ThreadMessage[] = JSON.parse(
      localStorage.getItem(EXPECTUM_STORAGE.thread) || "[]"
    );

    const savedLandmarks: Landmark[] = JSON.parse(
      localStorage.getItem(EXPECTUM_STORAGE.landmarks) || "[]"
    );

    const sharedInsights: SharedInsight[] = JSON.parse(
      localStorage.getItem(EXPECTUM_STORAGE.sharedInsights) || "[]"
    );

    const pending = localStorage.getItem(EXPECTUM_STORAGE.reflectionPending);

    setQuestion(savedQuestion);
    setCount(savedCount);
    setThread(savedThread);
    setLandmarkIds(savedLandmarks.map((item) => item.id));
    setSharedIds(sharedInsights.map((item) => item.id));

    if (savedQuestion && pending === "true" && !hasGeneratedRef.current) {
      hasGeneratedRef.current = true;
      generateReflection(savedQuestion, savedThread);
    }
  }, []);

  useEffect(() => {
    if (thread.length === 0 && !loading) return;

    meetingEndRef.current?.scrollIntoView({
      block: "end",
      behavior: "smooth",
    });
  }, [thread, loading]);

  function getCurrentMode(): ReflectionMode {
  if (typeof window === "undefined") {
    return "meeting";
  }

  return (
    (localStorage.getItem(
      EXPECTUM_STORAGE.reflectionMode
    ) as ReflectionMode) || "meeting"
  );
}

  async function saveMeetingToSupabase(historyItem: HistoryItem) {
    const { data } = await supabase.auth.getUser();

    if (!data.user) return;

    const { error } = await supabase.from("meetings").insert({
      user_id: data.user.id,
      question: historyItem.question,
      reflection: historyItem.reflection,
      thread: historyItem.thread || [],
      mode: historyItem.mode || "meeting",
      created_at: historyItem.createdAt,
    });

    if (error) {
      console.error("Kohtumist ei saanud Supabase'i salvestada.", error);
    }
  }

  async function generateReflection(
    questionText: string,
    currentThread: ThreadMessage[]
  ) {
    setLoading(true);

    const sessionId =
      currentThread[currentThread.length - 1]?.sessionId ||
      localStorage.getItem(EXPECTUM_STORAGE.currentSession) ||
      "default";

    const mode = getCurrentMode();

    try {
      const response = await fetch("/api/reflect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: questionText,
          thread: currentThread.slice(-8),
          mode,
        }),
      });

      const data = await response.json();

      const assistantMessage: ThreadMessage = {
        role: "assistant",
        text: data.reflection,
        createdAt: new Date().toISOString(),
        sessionId,
        mode,
      };

      const updatedThread = [...currentThread, assistantMessage];

      localStorage.setItem(
        EXPECTUM_STORAGE.thread,
        JSON.stringify(updatedThread)
      );
      localStorage.setItem(EXPECTUM_STORAGE.reflectionPending, "false");

      setThread(updatedThread);

      const historyItem: HistoryItem = {
        question: questionText,
        reflection: data.reflection,
        thread: updatedThread,
        mode,
        createdAt: new Date().toISOString(),
      };

      const existingHistory: HistoryItem[] = JSON.parse(
        localStorage.getItem(EXPECTUM_STORAGE.history) || "[]"
      );

      localStorage.setItem(
        EXPECTUM_STORAGE.history,
        JSON.stringify([historyItem, ...existingHistory])
      );

      await saveMeetingToSupabase(historyItem);
    } catch (error) {
      console.error(error);

      const fallback =
        "Praegu ei saanud märkamist avada. Peatu hetkeks ja proovi uuesti.";

      const assistantMessage: ThreadMessage = {
        role: "assistant",
        text: fallback,
        createdAt: new Date().toISOString(),
        sessionId,
        mode,
      };

      const updatedThread = [...currentThread, assistantMessage];

      localStorage.setItem(
        EXPECTUM_STORAGE.thread,
        JSON.stringify(updatedThread)
      );
      localStorage.setItem(EXPECTUM_STORAGE.reflectionPending, "false");

      setThread(updatedThread);
    } finally {
      setLoading(false);
    }
  }

  function sendFollowUp() {
    if (!followUp.trim()) return;
    if (count >= 3) return;

    const currentThread: ThreadMessage[] = JSON.parse(
      localStorage.getItem(EXPECTUM_STORAGE.thread) || "[]"
    );

    let sessionId = localStorage.getItem(EXPECTUM_STORAGE.currentSession);

    if (!sessionId) {
      sessionId =
        currentThread[currentThread.length - 1]?.sessionId ||
        crypto.randomUUID();

      localStorage.setItem(EXPECTUM_STORAGE.currentSession, sessionId);
    }

    const mode = getCurrentMode();

    const userMessage: ThreadMessage = {
      role: "user",
      text: followUp,
      createdAt: new Date().toISOString(),
      sessionId,
      mode,
    };

    const updatedThread = [...currentThread, userMessage];
    const nextCount = count + 1;

    localStorage.setItem(
      EXPECTUM_STORAGE.thread,
      JSON.stringify(updatedThread)
    );
    localStorage.setItem(EXPECTUM_STORAGE.question, followUp);
    localStorage.setItem(EXPECTUM_STORAGE.questionCount, String(nextCount));
    localStorage.setItem(EXPECTUM_STORAGE.reflectionPending, "true");

    setThread(updatedThread);
    setQuestion(followUp);
    setCount(nextCount);
    setFollowUp("");

    generateReflection(followUp, updatedThread);
  }

  async function toggleLandmark(message: ThreadMessage, index: number) {
    const existing: Landmark[] = JSON.parse(
      localStorage.getItem(EXPECTUM_STORAGE.landmarks) || "[]"
    );

    const id = message.createdAt;
    const isSaved = existing.some((item) => item.id === id);

    if (isSaved) {
      const updated = existing.filter((item) => item.id !== id);

      localStorage.setItem(
        EXPECTUM_STORAGE.landmarks,
        JSON.stringify(updated)
      );

      setLandmarkIds(updated.map((item) => item.id));
      return;
    }

    const previousUserMessage = [...thread]
      .slice(0, index)
      .reverse()
      .find((item) => item.role === "user");

    const newLandmark: Landmark = {
      id,
      text: message.text,
      question: previousUserMessage?.text || question,
      thread,
      createdAt: new Date().toISOString(),
    };

    const updated = [newLandmark, ...existing];

    localStorage.setItem(EXPECTUM_STORAGE.landmarks, JSON.stringify(updated));
    setLandmarkIds(updated.map((item) => item.id));

    const { data } = await supabase.auth.getUser();

    if (!data.user) return;

    const { error } = await supabase.from("echoes").insert({
      user_id: data.user.id,
      text: newLandmark.text,
      question: newLandmark.question,
      created_at: newLandmark.createdAt,
    });

    if (error) {
      console.error("Kaja ei saanud Supabase'i salvestada.", error);
    }
  }

  async function toggleSharedInsight(message: ThreadMessage, index: number) {
    const existing: SharedInsight[] = JSON.parse(
      localStorage.getItem(EXPECTUM_STORAGE.sharedInsights) || "[]"
    );

    const id = message.createdAt;
    const isShared = existing.some((item) => item.id === id);

    if (isShared) return;

    const confirmed = window.confirm(
      "Kas lubad sellel Kajal ühisesse ruumi liikuda?"
    );

    if (!confirmed) return;

    const previousUserMessage = [...thread]
      .slice(0, index)
      .reverse()
      .find((item) => item.role === "user");

    const newInsight: SharedInsight = {
      id,
      text: message.text,
      question: previousUserMessage?.text || question,
      createdAt: new Date().toISOString(),
      questionCount: count,
    };

    const response = await fetch("/api/shared-insights", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: newInsight.question,
        text: newInsight.text,
        questionCount: newInsight.questionCount,
      }),
    });

    if (!response.ok) {
      console.error("Kaja ei saanud ühisesse ruumi liikuda.");
      return;
    }

    const updated = [newInsight, ...existing];

    localStorage.setItem(
      EXPECTUM_STORAGE.sharedInsights,
      JSON.stringify(updated)
    );
    setSharedIds(updated.map((item) => item.id));
  }

  const currentMode = getCurrentMode();

  return (
    <ExpectumAuthGate>
      <ExpectumPage className="bg-[#f7f1e8]">
        <section className="mx-auto w-full max-w-4xl">
          <div className="text-center">
            <p className="mb-10 inline-flex items-center justify-center gap-3 text-xs uppercase tracking-[0.4em] text-[#b78a4a]">
              <ExpectumSymbol name="meeting" size="header" />
              <span>{getModeLabel(currentMode)}</span>
            </p>

            <h1 className="mb-12 text-4xl font-light leading-tight md:text-6xl">
              Mõni küsimus kujuneb alles siis, kui talle antakse aega.
            </h1>
          </div>

          <div className="mb-8 text-left">
            <p className="mb-10 text-center text-xs uppercase tracking-[0.25em] text-[#b78a4a]">
              {getModeLabel(currentMode)}
            </p>

            <div className="space-y-12">
              {thread.map((message, index) => {
                const isAssistant = message.role === "assistant";
                const isSaved = landmarkIds.includes(message.createdAt);
                const isShared = sharedIds.includes(message.createdAt);

                return (
                  <div
                    key={`${message.createdAt}-${index}`}
                    className="border-l border-[#efe6d9] pl-6 md:pl-8"
                  >
                    <p className="mb-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#b78a4a]">
                      <ExpectumSymbol
                        name={message.role === "user" ? "meeting" : "aim"}
                        size="footer"
                      />
                      <span>{message.role === "user" ? "Kohtumine" : "Aim"}</span>
                    </p>

                    <p className="whitespace-pre-line text-lg leading-loose text-[#4f4942]">
                      {message.text}
                    </p>

                    {isAssistant && (
                      <div className="mt-6 flex flex-col gap-3 opacity-80 md:flex-row md:flex-wrap">
                        <ExpectumButton
                          onClick={() => toggleLandmark(message, index)}
                          variant="soft"
                          className="px-5 py-2 text-xs tracking-[0.2em]"
                        >
                          {isSaved
                            ? "✓ Kaja salvestatud — eemalda"
                            : "☆ Salvesta Kaja"}
                        </ExpectumButton>

                        {isSaved && (
                          <ExpectumButton
                            onClick={() =>
                              toggleSharedInsight(message, index)
                            }
                            variant="soft"
                            className="px-5 py-2 text-xs tracking-[0.2em]"
                          >
                            {isShared
                              ? "✓ Kaja liigub kinnitamise ootele"
                              : "Luba Kajal liikuda"}
                          </ExpectumButton>
                        )}

                        {isShared && (
                          <p className="basis-full text-sm leading-relaxed text-[#8a8278]">
                            ✓ Kaja liigub kinnitamise ootel.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {loading && (
                <div className="border-l border-[#efe6d9] pl-6 md:pl-8">
                  <p className="text-lg leading-relaxed text-[#4f4942]">
                    Kohtumine avaneb...
                  </p>
                </div>
              )}

              {!loading && count < 3 && (
                <div className="pt-4">
                  <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[#b78a4a]">
                    Kohtumine jätkub
                  </p>

                  <textarea
                    value={followUp}
                    onChange={(event) => setFollowUp(event.target.value)}
                    className="min-h-36 w-full rounded-[1.75rem] border border-[#efe6d9] bg-white/55 p-6 text-lg leading-loose text-[#4f4942] outline-none transition duration-500 placeholder:text-[#a7a097] focus:border-[#eadcc7] focus:bg-white/70"
                    placeholder="Kirjuta siia, kui kohtumine jätkub..."
                  />

                  <div className="mt-6">
                    <ExpectumButton onClick={sendFollowUp}>
                      Jätka kohtumist
                    </ExpectumButton>
                  </div>
                </div>
              )}

              {!loading && count >= 3 && (
                <div className="pt-4">
                  <p className="mb-4 text-lg leading-relaxed text-[#4f4942]">
                    Kõik ei avane järgmise küsimusega. Vahel avaneb midagi
                    pausis.
                  </p>

                  <p className="text-base leading-relaxed text-[#6d655d]">
                    Kohtumise saad hiljem uuesti avada Mälu, Kohtumised alt.
                    Oluline ei ole küsimuste hulk, vaid see, mida küsimus avab.
                  </p>
                </div>
              )}

              <div ref={meetingEndRef} />
            </div>
          </div>

          <div className="mt-12 flex flex-col justify-center gap-4 md:flex-row">
            {count >= 3 && (
              <ExpectumButton href="/pause">
                Peatu hetkeks
              </ExpectumButton>
            )}

            <ExpectumButton href="/pause" variant="soft">
              Jäta kohtumine puhkama
            </ExpectumButton>
          </div>
        </section>
      </ExpectumPage>
    </ExpectumAuthGate>
  );
}
