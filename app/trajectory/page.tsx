"use client";

import { useEffect, useState } from "react";
import ExpectumPage from "@/components/ExpectumPage";
import ExpectumSymbol from "@/components/ExpectumSymbol";
import { EXPECTUM_STORAGE } from "@/lib/expectumStorage";
import ExpectumAuthGate from "@/components/ExpectumAuthGate";

type StoredTextItem = {
  question?: string;
  reflection?: string;
  text?: string;
};

type TrajectoryHistoryItem = {
  text: string;
  createdAt: string;
};

export default function Trajectory() {
  const [trajectory, setTrajectory] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  async function openTrajectory() {
    const history: StoredTextItem[] = JSON.parse(
      localStorage.getItem(EXPECTUM_STORAGE.history) || "[]"
    );

    const landmarks: StoredTextItem[] = JSON.parse(
      localStorage.getItem(EXPECTUM_STORAGE.landmarks) || "[]"
    );

    const journeyReflections: StoredTextItem[] = JSON.parse(
      localStorage.getItem(EXPECTUM_STORAGE.journeyReflections) || "[]"
    );

    const themes = JSON.parse(
      localStorage.getItem(EXPECTUM_STORAGE.detectedThemes) || "[]"
    );

    if (
      history.length === 0 &&
      landmarks.length === 0 &&
      journeyReflections.length === 0
    ) {
      setTrajectory(
        "Liikumise suuna märkamiseks ei ole veel piisavalt kohtumisi."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/trajectory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          history: history.slice(-5),
          landmarks: landmarks.slice(-5),
          journeyReflections: journeyReflections.slice(-3),
          themes,
        }),
      });

      const data = await response.json();
      const text = data.trajectory || "";

      setTrajectory(text);
      localStorage.setItem(EXPECTUM_STORAGE.trajectory, text);
    } catch (error) {
      console.error(error);

      setTrajectory(
        "Praegu ei saanud liikumise suunda avada. Peatu hetkeks ja proovi uuesti."
      );
    } finally {
      setLoading(false);
    }
  }

  function saveTrajectory() {
    if (!trajectory.trim()) return;

    const history: TrajectoryHistoryItem[] = JSON.parse(
      localStorage.getItem(EXPECTUM_STORAGE.trajectoryHistory) || "[]"
    );

    const item: TrajectoryHistoryItem = {
      text: trajectory,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(
      EXPECTUM_STORAGE.trajectoryHistory,
      JSON.stringify([item, ...history])
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  }

  useEffect(() => {
    const existing = localStorage.getItem(EXPECTUM_STORAGE.trajectory);

    if (existing) {
      setTrajectory(existing);
    } else {
      openTrajectory();
    }
  }, []);

  return (
    <ExpectumAuthGate>
          <ExpectumPage
        footerLinks={[
          {
            href: "/themes",
            label: "Teema",
          symbol: "theme",
        },
        {
          href: "/path",
          label: "Teekond",
          symbol: "path",
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
          <ExpectumSymbol name="direction" size="header" />
          <span>Liikumise suund</span>
        </p>

        <h1 className="mb-6 text-4xl font-light md:text-6xl">
          Mis suund on nähtavale tulnud?
        </h1>

        <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-[#5f574f]">
          Suund ei ole ennustus ega sihtkoht. Ta on võimalik liikumine,
          mis võib kordumistes nähtavale tulla.
        </p>

        <div className="rounded-3xl border border-[#d7b985] bg-white/45 p-8 text-left">
          {loading ? (
            <p>Liikumise suuna märkamine...</p>
          ) : (
            <p className="whitespace-pre-line text-lg leading-relaxed text-[#4f4942]">
              {trajectory}
            </p>
          )}
        </div>

        {saved && <p className="mt-6 text-[#8b642f]">Suund salvestati.</p>}

        <div className="mt-12 flex flex-col flex-wrap justify-center gap-4 md:flex-row">
          <button
            type="button"
            onClick={openTrajectory}
            className="rounded-full border border-[#c9a36a] px-8 py-4 text-sm uppercase tracking-[0.25em] text-[#8b642f] transition hover:bg-[#efe2ce]"
          >
            Märka uuesti
          </button>

          <button
            type="button"
            onClick={saveTrajectory}
            className="rounded-full border border-[#c9a36a] px-8 py-4 text-sm uppercase tracking-[0.25em] text-[#8b642f] transition hover:bg-[#efe2ce]"
          >
            Salvesta suund
          </button>
        </div>
      </section>
    </ExpectumPage>
      </ExpectumAuthGate>
  );
}