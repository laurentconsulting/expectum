"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EXPECTUM_STORAGE } from "@/lib/expectumStorage";
import { supabase } from "@/lib/supabaseClient";
import ExpectumPage from "@/components/ExpectumPage";
import ExpectumSymbol from "@/components/ExpectumSymbol";
import ExpectumAuthGate from "@/components/ExpectumAuthGate";
import ExpectumButton from "@/components/ExpectumButton";

type MeetingMode = "meeting" | "thought" | "exploration";

type ThreadMessage = {
  role: "user" | "assistant";
  text: string;
  createdAt: string;
  sessionId?: string;
  mode?: MeetingMode;
};

type MeetingRow = {
  id: string;
  question: string | null;
  reflection: string | null;
  thread: ThreadMessage[] | null;
  mode: MeetingMode | null;
  created_at: string;
};

type SessionGroup = {
  sessionId: string;
  date: string;
  messages: ThreadMessage[];
};

function getModeLabel(mode?: string) {
  if (mode === "thought") return "Mõttekohtumine";
  if (mode === "exploration") return "Avardamine";
  return "Kohtumine";
}

function getSessionModeValue(session: SessionGroup): MeetingMode {
  if (session.messages.some((message) => message.mode === "exploration")) {
    return "exploration";
  }

  if (session.messages.some((message) => message.mode === "thought")) {
    return "thought";
  }

  return "meeting";
}

export default function History() {
  const [sessions, setSessions] = useState<SessionGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("meetings")
      .select("id, question, reflection, thread, mode, created_at")
      .eq("user_id", userData.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Kohtumisi ei saanud Supabase'ist avada.", error);
      setSessions([]);
      setLoading(false);
      return;
    }

    const meetings = (data || []) as MeetingRow[];
    const sessionMap = new Map<string, SessionGroup>();

    meetings.forEach((item) => {
      const fallbackThread: ThreadMessage[] = [
        {
          role: "user",
          text: item.question || "",
          createdAt: item.created_at,
          sessionId: item.id,
          mode: item.mode || "meeting",
        },
        {
          role: "assistant",
          text: item.reflection || "",
          createdAt: item.created_at,
          sessionId: item.id,
          mode: item.mode || "meeting",
        },
      ];

      const messages =
        Array.isArray(item.thread) && item.thread.length > 0
          ? item.thread
          : fallbackThread;

      messages.forEach((message) => {
        const sessionId = message.sessionId || item.id;
        const date = new Date(
          message.createdAt || item.created_at
        ).toLocaleDateString("et-EE");

        if (!sessionMap.has(sessionId)) {
          sessionMap.set(sessionId, {
            sessionId,
            date,
            messages: [],
          });
        }

        const group = sessionMap.get(sessionId);

        if (!group) return;

        const alreadyExists = group.messages.some(
          (existing) =>
            existing.role === message.role &&
            existing.text === message.text &&
            existing.createdAt === message.createdAt
        );

        if (!alreadyExists) {
          group.messages.push({
            ...message,
            mode: message.mode || item.mode || "meeting",
          });
        }
      });
    });

    const groupedSessions = Array.from(sessionMap.values())
      .map((session) => ({
        ...session,
        messages: session.messages.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() -
            new Date(b.createdAt).getTime()
        ),
      }))
      .sort(
        (a, b) =>
          new Date(b.messages[0]?.createdAt || "").getTime() -
          new Date(a.messages[0]?.createdAt || "").getTime()
      );

    setSessions(groupedSessions);
    setLoading(false);
  }

  function continueSession(session: SessionGroup) {
    const mode = getSessionModeValue(session);

    localStorage.setItem(EXPECTUM_STORAGE.currentSession, session.sessionId);
    localStorage.setItem(
      EXPECTUM_STORAGE.thread,
      JSON.stringify(
        session.messages.map((message) => ({
          ...message,
          mode: message.mode || mode,
        }))
      )
    );

    localStorage.setItem(EXPECTUM_STORAGE.reflectionMode, mode);
    localStorage.setItem(EXPECTUM_STORAGE.questionCount, "0");
    localStorage.removeItem(EXPECTUM_STORAGE.question);
    localStorage.setItem(EXPECTUM_STORAGE.reflectionPending, "false");

    router.push("/reflection");
  }

  function getSessionMode(session: SessionGroup) {
    return getModeLabel(getSessionModeValue(session));
  }

  async function clearHistory() {
    const confirmed = window.confirm(
      "Kas soovid kohtumiste jäljed puhastada?"
    );

    if (!confirmed) return;

    const { data: userData } = await supabase.auth.getUser();

    if (userData.user) {
      const { error } = await supabase
        .from("meetings")
        .delete()
        .eq("user_id", userData.user.id);

      if (error) {
        console.error("Kohtumisi ei saanud Supabase'is puhastada.", error);
      }
    }

    localStorage.removeItem(EXPECTUM_STORAGE.history);
    setSessions([]);
  }

  return (
    <ExpectumAuthGate>
      <ExpectumPage
        footerLinks={[
          {
            href: "/settings",
            label: "Mälu",
            symbol: "memory",
          },
          {
            href: "/landmarks",
            label: "Kaja",
            symbol: "echo",
          },
          {
            href: "/expectum",
            label: "Expectum",
            symbol: "aim",
          },
        ]}
      >
        <section className="mx-auto max-w-4xl text-center">
          <p className="mb-10 inline-flex items-center justify-center gap-3 text-xs uppercase tracking-[0.4em] text-[#b78a4a]">
            <ExpectumSymbol name="memory" size="header" />
            <span>Mälu</span>
          </p>

          <h1 className="mb-12 text-4xl font-light md:text-6xl">
            Minu kohtumised
          </h1>

          {loading ? (
            <div className="rounded-3xl border border-[#d7b985] bg-white/45 p-8 text-left">
              Kohtumiste jälgede avamine...
            </div>
          ) : sessions.length === 0 ? (
            <div className="rounded-3xl border border-[#d7b985] bg-white/45 p-8 text-left">
              Mälus ei ole veel kohtumisi.
            </div>
          ) : (
            <div className="space-y-12 text-left">
              {sessions.map((session, index) => (
                <div key={session.sessionId}>
                  <p className="mb-3 text-sm text-[#8a8278]">
                    {session.date}
                  </p>

                  <h2 className="mb-2 text-2xl font-light">
                    Kohtumine {sessions.length - index}
                  </h2>

                  <p className="mb-6 text-xs uppercase tracking-[0.25em] text-[#b78a4a]">
                    {getSessionMode(session)}
                  </p>

                  <div className="max-h-[620px] overflow-y-auto rounded-3xl border border-[#d7b985] bg-white/45 p-6">
                    <div className="space-y-8">
                      {session.messages.map((message, messageIndex) => (
                        <div key={`${message.createdAt}-${messageIndex}`}>
                          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[#b78a4a]">
                            {message.role === "user" ? "Sina" : "Aim"}
                          </p>

                          <p className="whitespace-pre-line text-lg leading-relaxed text-[#4f4942]">
                            {message.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                 <div className="mt-6">
  <ExpectumButton
    onClick={() => continueSession(session)}
  >
    Ava kohtumine
  </ExpectumButton>
</div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-12 flex justify-center">
            <ExpectumButton
  onClick={clearHistory}
  variant="soft"
>
  Puhasta kohtumised
</ExpectumButton>
          </div>
        </section>
      </ExpectumPage>
    </ExpectumAuthGate>
  );
}