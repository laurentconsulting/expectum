"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EXPECTUM_STORAGE } from "@/lib/expectumStorage";
import ExpectumPage from "@/components/ExpectumPage";
import ExpectumSymbol from "@/components/ExpectumSymbol";
import ExpectumAuthGate from "@/components/ExpectumAuthGate";

type QuestionMode = "meeting" | "thought" | "exploration";

function QuestionContent() {
  const [question, setQuestion] = useState("");
  const [mode, setMode] = useState<QuestionMode>("meeting");

  const router = useRouter();
  const searchParams = useSearchParams();

  const continueMeeting = searchParams.get("continue") === "1";

  function sendQuestion() {
    if (!question.trim()) return;

    let sessionId = localStorage.getItem(EXPECTUM_STORAGE.currentSession);

    let currentCount = Number(
      localStorage.getItem(EXPECTUM_STORAGE.questionCount) || "0"
    );

    if (!continueMeeting || !sessionId) {
      currentCount = 0;
      sessionId = crypto.randomUUID();

      localStorage.setItem(EXPECTUM_STORAGE.currentSession, sessionId);
      localStorage.removeItem(EXPECTUM_STORAGE.thread);
    }

    const nextCount = currentCount + 1;

    const thread = JSON.parse(
      localStorage.getItem(EXPECTUM_STORAGE.thread) || "[]"
    );

    const userMessage = {
      role: "user",
      text: question,
      createdAt: new Date().toISOString(),
      sessionId,
      mode,
    };

    localStorage.setItem(
      EXPECTUM_STORAGE.thread,
      JSON.stringify([...thread, userMessage])
    );

    localStorage.setItem(EXPECTUM_STORAGE.question, question);
    localStorage.setItem(EXPECTUM_STORAGE.reflectionMode, mode);
    localStorage.setItem(EXPECTUM_STORAGE.questionCount, String(nextCount));
    localStorage.setItem(EXPECTUM_STORAGE.reflectionPending, "true");

    router.push("/reflection");
  }

  return (
    <ExpectumAuthGate>
      <ExpectumPage>
        <section className="mx-auto max-w-3xl text-center">
          <p className="mb-10 inline-flex items-center justify-center gap-3 text-xs uppercase tracking-[0.4em] text-[#b78a4a]">
            <ExpectumSymbol name="meeting" size="header" />
            <span>Küsimuse avamine</span>
          </p>

          <h1 className="mb-8 text-4xl font-light leading-tight md:text-6xl">
            Kirjuta küsimus, mis ootab Sinus vastust.
          </h1>

          <p className="mb-10 text-lg leading-relaxed text-[#5f574f]">
            Küsimus ei pea olema valmis. Ta võib alles avaneda.
          </p>

          <div className="mb-4 flex flex-col justify-center gap-4 md:flex-row">
            <button
              type="button"
              onClick={() => setMode("meeting")}
              className={`rounded-full border px-6 py-3 text-xs uppercase tracking-[0.25em] transition ${
                mode === "meeting"
                  ? "border-[#c9a36a] bg-[#efe2ce] text-[#8b642f]"
                  : "border-[#d8d1c7] text-[#6d655d]"
              }`}
            >
              Kohtumine
            </button>

            <button
              type="button"
              onClick={() => setMode("thought")}
              className={`rounded-full border px-6 py-3 text-xs uppercase tracking-[0.25em] transition ${
                mode === "thought"
                  ? "border-[#c9a36a] bg-[#efe2ce] text-[#8b642f]"
                  : "border-[#d8d1c7] text-[#6d655d]"
              }`}
            >
              Mõttekohtumine
            </button>

            <button
              type="button"
              onClick={() => setMode("exploration")}
              className={`rounded-full border px-6 py-3 text-xs uppercase tracking-[0.25em] transition ${
                mode === "exploration"
                  ? "border-[#c9a36a] bg-[#efe2ce] text-[#8b642f]"
                  : "border-[#d8d1c7] text-[#6d655d]"
              }`}
            >
              Avardamine
            </button>
          </div>

          <p className="mb-8 text-sm leading-relaxed text-[#8a8278]">
            Kohtumine vastab lihtsamalt ja vahetumalt. Mõttekohtumine liigub
            vabamalt mõtete ja tähenduste vahel. Avardamine loob ruumi
            küsimuste, vaatenurkade ja koosmõtlemise jaoks.
          </p>

          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            className="min-h-48 w-full rounded-3xl border border-[#d7b985] bg-white/45 p-6 text-lg leading-relaxed outline-none transition focus:border-[#b78a4a] focus:bg-white/65"
            placeholder="Minu küsimus..."
          />

          <button
            type="button"
            onClick={sendQuestion}
            className="mt-8 inline-block rounded-full border border-[#c9a36a] px-8 py-4 text-sm uppercase tracking-[0.25em] text-[#8b642f] transition hover:bg-[#efe2ce]"
          >
            Saada Aimile
          </button>

          <p className="mt-16 text-sm text-[#8a8278]">
            Peatu ja hinga. Liikumine jätkub.
          </p>
        </section>
      </ExpectumPage>
    </ExpectumAuthGate>
  );
}

export default function Question() {
  return (
    <Suspense fallback={null}>
      <QuestionContent />
    </Suspense>
  );
}