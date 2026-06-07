"use client";

import { useEffect, useState } from "react";
import { EXPECTUM_STORAGE } from "@/lib/expectumStorage";
import { EXPECTUM_THEMES } from "@/lib/expectumThemes";

type ThemeEvolution = {
  name: string;
  total: number;
  last90: number;
  last30: number;
  trend: "up" | "down" | "stable";
};

export default function ThemeEvolution() {
  const [themes, setThemes] = useState<ThemeEvolution[]>([]);

  useEffect(() => {
    const history = JSON.parse(
      localStorage.getItem(EXPECTUM_STORAGE.history) || "[]"
    );

    const landmarks = JSON.parse(
      localStorage.getItem(EXPECTUM_STORAGE.landmarks) || "[]"
    );

    const reflections = JSON.parse(
      localStorage.getItem(EXPECTUM_STORAGE.journeyReflections) || "[]"
    );

    const allItems = [
      ...history.map((item: any) => ({
        text: `${item.question || ""} ${item.reflection || ""}`,
        createdAt: item.createdAt,
      })),

      ...landmarks.map((item: any) => ({
        text: `${item.question || ""} ${item.text || ""}`,
        createdAt: item.createdAt,
      })),

      ...reflections.map((item: any) => ({
        text: item.text || "",
        createdAt: item.createdAt,
      })),
    ];

    const now = Date.now();

    const result: ThemeEvolution[] = Object.entries(
      EXPECTUM_THEMES
    ).map(([themeName, keywords]) => {
      let total = 0;
      let last90 = 0;
      let last30 = 0;

      allItems.forEach((item) => {
        const text = (item.text || "").toLowerCase();

        const found = keywords.some((keyword) =>
          text.includes(keyword.toLowerCase())
        );

        if (!found) return;

        total++;

        const createdAt = new Date(
          item.createdAt || Date.now()
        ).getTime();

        const days =
          (now - createdAt) / (1000 * 60 * 60 * 24);

        if (days <= 90) {
          last90++;
        }

        if (days <= 30) {
          last30++;
        }
      });

      let trend: "up" | "down" | "stable" = "stable";

      if (last30 > last90 / 3) {
        trend = "up";
      } else if (last30 < last90 / 6) {
        trend = "down";
      }

      return {
        name: themeName.replaceAll("_", " "),
        total,
        last90,
        last30,
        trend,
      };
    });

    setThemes(
      result
        .filter((item) => item.total > 0)
        .sort((a, b) => b.total - a.total)
    );
  }, []);

  function trendLabel(trend: string) {
    switch (trend) {
      case "up":
        return "↑ tugevneb";

      case "down":
        return "↓ vaibub";

      default:
        return "→ stabiilne";
    }
  }

  return (
    <main className="min-h-screen bg-[#f8f3eb] text-[#2d2a26] px-6 py-16">
      <section className="max-w-5xl mx-auto">
        <p className="tracking-[0.4em] text-xs uppercase text-[#b78a4a] mb-10">
          Teemade areng
        </p>

        <h1 className="text-4xl md:text-6xl font-light mb-6">
          Teemade liikumine ajas
        </h1>

        <p className="text-lg leading-relaxed text-[#5f574f] mb-12">
          Siin ei vaadata ainult seda, millised teemad
          on nähtavad, vaid kuidas need ajas liiguvad.
        </p>

        {themes.length === 0 ? (
          <div className="rounded-3xl border border-[#d7b985] bg-white/45 p-8">
            Teemade arengut ei ole veel võimalik näidata.
          </div>
        ) : (
          <div className="space-y-8">
            {themes.map((theme) => (
              <div
                key={theme.name}
                className="rounded-3xl border border-[#d7b985] bg-white/45 p-8"
              >
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="text-2xl font-light mb-4">
                      {theme.name}
                    </p>

                    <div className="space-y-2 text-[#5f574f]">
                      <p>Kogu aeg: {theme.total}</p>
                      <p>Viimased 90 päeva: {theme.last90}</p>
                      <p>Viimased 30 päeva: {theme.last30}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-lg text-[#b78a4a]">
                      {trendLabel(theme.trend)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 flex flex-col md:flex-row gap-4 flex-wrap">
          <a
            href="/themes"
            className="rounded-full border border-[#c9a36a] px-8 py-4 text-sm uppercase tracking-[0.25em] text-[#8b642f] text-center"
          >
            Teemade kaart
          </a>

          <a
            href="/path"
            className="rounded-full border border-[#d8d1c7] px-8 py-4 text-sm uppercase tracking-[0.25em] text-[#6d655d] text-center"
          >
            Minu teekond
          </a>

          <a
            href="/settings"
            className="rounded-full border border-[#d8d1c7] px-8 py-4 text-sm uppercase tracking-[0.25em] text-[#6d655d] text-center"
          >
            Mälu
          </a>
        </div>
      </section>
    </main>
  );
}