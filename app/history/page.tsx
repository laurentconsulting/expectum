"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EXPECTUM_STORAGE } from "@/lib/expectumStorage";
import ExpectumPage from "@/components/ExpectumPage";
import ExpectumSymbol from "@/components/ExpectumSymbol";
import ExpectumAuthGate from "@/components/ExpectumAuthGate";

type ThreadMessage = {
  role: "user" | "assistant";
  text: string;
  createdAt: string;
  sessionId?: string;
  mode?: "meeting" | "thought";
};

type HistoryItem = {
  question: string;
  reflection: string;
  thread?: ThreadMessage[];
  createdAt: string;
};

type SessionGroup = {
  sessionId: string;
  date: string;
  messages: ThreadMessage[];
};

export default function History() {
  const [sessions, setSessions] = useState<SessionGroup[]>([]);
  const router = useRouter();

  useEffect(() => {
    const history: HistoryItem[] = JSON.parse(
      localStorage.getItem(EXPECTUM_STORAGE.history) || "[]"
    );

    const sessionMap = new Map<string, SessionGroup>();

    history.forEach((item) => {
      const messages = item.thread || [
        {
          role: "user",
          text: item.question,
          createdAt: item.createdAt,
          sessionId: "legacy",
        },
        {
          role: "assistant",
          text: item.reflection,
          createdAt: item.createdAt,
          sessionId: "legacy",
        },
      ];

      messages.forEach((message) => {
        const sessionId = message.sessionId || "legacy";
        const date = new Date(message.createdAt).toLocaleDateString("et-EE");

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
          group.messages.push(message);
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
  }, []);

  function continueSession(session: SessionGroup) {
    localStorage.setItem(EXPECTUM_STORAGE.currentSession, session.sessionId);
    localStorage.setItem(
      EXPECTUM_STORAGE.thread,
      JSON.stringify(session.messages)
    );

    const mode = session.messages.some((message) => message.mode === "thought")
      ? "thought"
      : "meeting";

    localStorage.setItem(EXPECTUM_STORAGE.reflectionMode, mode);
    localStorage.setItem(EXPECTUM_STORAGE.questionCount, "0");
    localStorage.removeItem(EXPECTUM_STORAGE.question);
    localStorage.setItem(EXPECTUM_STORAGE.reflectionPending, "false");

    router.push("/reflection");
  }

  function getSessionMode(session: SessionGroup) {
    const hasThought = session.messages.some(
      (message) => message.mode === "thought"
    );

    return hasThought ? "Mõttekohtumine" : "Kohtumine";
  }

  function clearHistory() {
    const confirmed = window.confirm(
      "Kas soovid kohtumiste jäljed puhastada?"
    );

    if (!confirmed) return;

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
          label: "Expectum?",
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

        {sessions.length === 0 ? (
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

                <button
                  type="button"
                  onClick={() => continueSession(session)}
                  className="mt-6 rounded-full border border-[#c9a36a] px-8 py-4 text-sm uppercase tracking-[0.25em] text-[#8b642f] transition hover:bg-[#efe2ce]"
                >
                  Ava kohtumine
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={clearHistory}
            className="rounded-full border border-[#d8d1c7] px-8 py-4 text-sm uppercase tracking-[0.25em] text-[#6d655d] transition hover:bg-[#f1ebe3]"
          >
            Puhasta kohtumised
          </button>
        </div>
      </section>
    </ExpectumPage>
    </ExpectumAuthGate>
  );
}