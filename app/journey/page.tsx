"use client";

import { useEffect, useRef, useState } from "react";
import { EXPECTUM_STORAGE } from "@/lib/expectumStorage";
import ExpectumPage from "@/components/ExpectumPage";
import ExpectumSymbol from "@/components/ExpectumSymbol";

type StoredMessage = {
  sessionId?: string;
  mode?: string;
  createdAt?: string;
};

type StoredHistoryItem = {
  mode?: string;
  thread?: StoredMessage[];
};

type SessionItem = {
  sessionId: string;
  mode: string;
  createdAt?: string;
  messages: StoredMessage[];
};

type JourneyReflectionItem = {
  text: string;
  createdAt: string;
  historyCount: number;
  landmarksCount: number;
  sessionsCount: number;
};

export default function Journey() {
  const [journey, setJourney] = useState("");
  const [loading, setLoading] = useState(false);

  const [historyCount, setHistoryCount] = useState(0);
  const [kajaCount, setKajaCount] = useState(0);
  const [previousReflectionsCount, setPreviousReflectionsCount] = useState(0);

  const hasOpenedRef = useRef(false);

  async function openJourney() {
    const history: StoredHistoryItem[] = JSON.parse(
      localStorage.getItem(EXPECTUM_STORAGE.history) || "[]"
    );

    const landmarks = JSON.parse(
      localStorage.getItem(EXPECTUM_STORAGE.landmarks) || "[]"
    );

    const previousReflections: JourneyReflectionItem[] = JSON.parse(
      localStorage.getItem(EXPECTUM_STORAGE.journeyReflections) || "[]"
    );

    setHistoryCount(history.length);
    setKajaCount(landmarks.length);
    setPreviousReflectionsCount(previousReflections.length);

    const sessionsMap = new Map<string, SessionItem>();

    history.forEach((item) => {
      const messages = item.thread || [];

      messages.forEach((message) => {
        const sessionId = message.sessionId || "legacy";

        if (!sessionsMap.has(sessionId)) {
          sessionsMap.set(sessionId, {
            sessionId,
            mode: message.mode || item.mode || "meeting",
            createdAt: message.createdAt,
            messages: [],
          });
        }

        sessionsMap.get(sessionId)?.messages.push(message);
      });
    });

    const sessions = Array.from(sessionsMap.values());

    if (history.length === 0 && landmarks.length === 0) {
      setJourney(
        "Liikumise märkamiseks ei ole veel piisavalt kohtumisi."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/journey", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          history,
          landmarks,
          sessions,
          previousReflections,
        }),
      });

      const data = await response.json();

      setJourney(data.journey);

      localStorage.setItem(EXPECTUM_STORAGE.journey, data.journey);

      const existingReflections: JourneyReflectionItem[] = JSON.parse(
        localStorage.getItem(EXPECTUM_STORAGE.journeyReflections) || "[]"
      );

      const latestReflection = existingReflections[0];

      const alreadySaved =
        latestReflection &&
        latestReflection.text === data.journey &&
        latestReflection.historyCount === history.length &&
        latestReflection.landmarksCount === landmarks.length;

      if (!alreadySaved) {
        const newReflection: JourneyReflectionItem = {
          text: data.journey,
          createdAt: new Date().toISOString(),
          historyCount: history.length,
          landmarksCount: landmarks.length,
          sessionsCount: sessions.length,
        };

        localStorage.setItem(
          EXPECTUM_STORAGE.journeyReflections,
          JSON.stringify([newReflection, ...existingReflections])
        );

        setPreviousReflectionsCount(existingReflections.length + 1);
      } else {
        setPreviousReflectionsCount(existingReflections.length);
      }
    } catch (error) {
      console.error(error);

      setJourney(
        "Praegu ei saanud liikumise märkamist avada. Peatu hetkeks ja proovi uuesti."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (hasOpenedRef.current) return;

    hasOpenedRef.current = true;
    openJourney();
  }, []);

  return (
    <ExpectumPage
      footerLinks={[
        {
          href: "/path",
          label: "Teekond",
          symbol: "path",
        },
        {
          href: "/attunement-question",
          label: "Vaikne küsimus",
          symbol: "meeting",
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
          <ExpectumSymbol name="path" size="header" />
          <span>Liikumise märkamine</span>
        </p>

        <h1 className="mb-6 text-4xl font-light md:text-6xl">
          Mis on jälgedes nähtavale tulnud?
        </h1>

        <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-[#5f574f]">
          Liikumise märkamine vaatab kohtumisi, kaja ja varasemaid jälgi.
          Ta ei määra teekonda. Ta aitab märgata, mis on nähtaval.
        </p>

        <p className="mb-12 text-sm text-[#8a8278]">
          Kohtumised: {historyCount} · Kaja: {kajaCount} · Liikumise
          märkamised: {previousReflectionsCount}
        </p>

        <div className="rounded-3xl border border-[#d7b985] bg-white/50 p-8 text-left text-lg leading-relaxed whitespace-pre-line text-[#4f4942]">
          {loading ? "Liikumise märkamine..." : journey}
        </div>

        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={openJourney}
            className="rounded-full border border-[#c9a36a] px-8 py-4 text-sm uppercase tracking-[0.25em] text-[#8b642f] transition hover:bg-[#efe2ce]"
          >
            Märka uuesti
          </button>
        </div>
      </section>
    </ExpectumPage>
  );
}