"use client";

import { useEffect, useState } from "react";
import { EXPECTUM_STORAGE } from "@/lib/expectumStorage";
import ExpectumPage from "@/components/ExpectumPage";
import ExpectumSymbol from "@/components/ExpectumSymbol";

export default function Statistics() {
  const [stats, setStats] = useState({
    history: 0,
    meetings: 0,
    thoughts: 0,
    landmarks: 0,
    journeyReflections: 0,
    themes: 0,
    trajectories: 0,
    sharedInsights: 0,
    firstDate: "",
    lastDate: "",
  });

  useEffect(() => {
    const history = JSON.parse(
      localStorage.getItem(EXPECTUM_STORAGE.history) || "[]"
    );

    const landmarks = JSON.parse(
      localStorage.getItem(EXPECTUM_STORAGE.landmarks) || "[]"
    );

    const journeyReflections = JSON.parse(
      localStorage.getItem(EXPECTUM_STORAGE.journeyReflections) || "[]"
    );

    const themes = JSON.parse(
      localStorage.getItem(EXPECTUM_STORAGE.detectedThemes) || "[]"
    );

    const trajectories = JSON.parse(
      localStorage.getItem(EXPECTUM_STORAGE.trajectoryHistory) || "[]"
    );

    const sharedInsights = JSON.parse(
      localStorage.getItem(EXPECTUM_STORAGE.sharedInsights) || "[]"
    );

    const thoughts = history.filter(
      (item: { mode?: string }) => item.mode === "thought"
    ).length;

    const meetings = history.filter(
      (item: { mode?: string }) => item.mode !== "thought"
    ).length;

    const dates = history
      .map((item: { createdAt?: string }) => item.createdAt)
      .filter(Boolean)
      .sort();

    setStats({
      history: history.length,
      meetings,
      thoughts,
      landmarks: landmarks.length,
      journeyReflections: journeyReflections.length,
      themes: themes.length,
      trajectories: trajectories.length,
      sharedInsights: sharedInsights.length,
      firstDate: dates[0] || "",
      lastDate: dates[dates.length - 1] || "",
    });
  }, []);

  return (
    <ExpectumPage
      footerLinks={[
        {
          href: "/settings",
          label: "Mälu",
          symbol: "memory",
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
          <ExpectumSymbol name="memory" size="header" />
          <span>Koond</span>
        </p>

        <h1 className="mb-10 text-4xl font-light md:text-6xl">
          Mälu hoiab
        </h1>

        <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-[#5f574f]">
          See ei ole hinnang ega mõõtmine. See on vaikne ülevaade jälgedest,
          mida mälu hoiab.
        </p>

        <div className="rounded-3xl border border-[#d7b985] bg-white/45 p-8 text-left text-lg leading-relaxed text-[#4f4942]">
          <div className="space-y-4">
            <p>{stats.history} kohtumist</p>
            <p>{stats.meetings} tavalist kohtumist</p>
            <p>{stats.thoughts} mõttekohtumist</p>
            <p>{stats.landmarks} salvestatud kaja</p>
            <p>{stats.journeyReflections} liikumise märkamist</p>
            <p>{stats.themes} nähtavale tulnud teemat</p>
            <p>{stats.trajectories} hoitud suunda</p>
            <p>{stats.sharedInsights} jagatud kohtumist</p>

            {stats.firstDate && (
              <p>
                Esimene kohtumine:{" "}
                {new Date(stats.firstDate).toLocaleDateString("et-EE")}
              </p>
            )}

            {stats.lastDate && (
              <p>
                Viimane kohtumine:{" "}
                {new Date(stats.lastDate).toLocaleDateString("et-EE")}
              </p>
            )}
          </div>
        </div>
      </section>
    </ExpectumPage>
  );
}