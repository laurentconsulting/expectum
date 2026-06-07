"use client";

import { useEffect, useState } from "react";
import { EXPECTUM_STORAGE } from "@/lib/expectumStorage";

type JourneyReflection = {
  text: string;
  createdAt: string;
  historyCount?: number;
  landmarksCount?: number;
  sessionsCount?: number;
};

function extractSection(text: string, title: string) {
  const lines = text.split("\n");

  const start = lines.findIndex((line) =>
    line.toLowerCase().includes(title.toLowerCase())
  );

  if (start === -1) return "";

  const next = lines.findIndex(
    (line, index) =>
      index > start &&
      line.trim().match(/^#+\s|^\d+\.\s/)
  );

  return lines
    .slice(start + 1, next === -1 ? lines.length : next)
    .join("\n")
    .trim();
}

export default function MovementMap() {
  const [reflections, setReflections] = useState<JourneyReflection[]>([]);

  useEffect(() => {
    const saved: JourneyReflection[] = JSON.parse(
      localStorage.getItem(EXPECTUM_STORAGE.journeyReflections) || "[]"
    );

    setReflections(saved);
  }, []);

  function clearMap() {
    const confirmed = window.confirm(
      "Kas soovid liikumise kaardi märkamised eemaldada?"
    );

    if (!confirmed) return;

    localStorage.removeItem(EXPECTUM_STORAGE.journeyReflections);
    setReflections([]);
  }

  return (
    <main className="relative min-h-screen bg-[#f8f3eb] text-[#2d2a26] px-6 py-16">
      <a
        href="/settings"
        className="absolute right-6 top-6 text-xs uppercase tracking-[0.25em] text-[#9b7a45]"
      >
        Mälu
      </a>

      <section className="max-w-4xl mx-auto">
        <p className="tracking-[0.4em] text-xs uppercase text-[#b78a4a] mb-10">
          Minu liikumine
        </p>

        <h1 className="text-4xl md:text-6xl font-light mb-6">
          Liikumise kaart
        </h1>

        <p className="text-lg leading-relaxed text-[#5f574f] mb-12">
          Siin ei ole kogu liikumine uuesti, vaid jäljed sellest,
          kuidas liikumine ajas nähtavaks muutub.
        </p>

        {reflections.length === 0 ? (
          <div className="rounded-3xl border border-[#d7b985] bg-white/45 p-8">
            Liikumise kaardi jaoks ei ole veel salvestatud märkamisi.
          </div>
        ) : (
          <div className="space-y-8">
            {reflections.map((item, index) => {
              const change =
                extractSection(item.text, "Mis on muutunud") ||
                "Selget muutust ei ole veel eraldi nähtavale toodud.";

              const landmark =
                extractSection(item.text, "Võimalik maamärk") ||
                "Maamärki ei ole eraldi välja toodud.";

              return (
                <div
                  key={`${item.createdAt}-${index}`}
                  className="rounded-3xl border border-[#d7b985] bg-white/45 p-8"
                >
                  <p className="text-sm text-[#8a8278] mb-3">
                    {new Date(item.createdAt).toLocaleDateString("et-EE")}
                  </p>

                  <p className="text-xs uppercase tracking-[0.25em] text-[#b78a4a] mb-6">
                    Jälg {reflections.length - index}
                  </p>

                  <div className="mb-6">
                    <p className="text-xs uppercase tracking-[0.25em] text-[#b78a4a] mb-3">
                      Mis on muutunud
                    </p>

                    <p className="whitespace-pre-line text-lg leading-relaxed text-[#4f4942]">
                      {change}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-[#b78a4a] mb-3">
                      Maamärk
                    </p>

                    <p className="whitespace-pre-line text-lg leading-relaxed text-[#4f4942]">
                      {landmark}
                    </p>
                  </div>

                  <p className="mt-6 text-sm text-[#8a8278]">
                    Kohtumised: {item.historyCount || 0}
                    {" · "}
                    Maamärgid: {item.landmarksCount || 0}
                    {typeof item.sessionsCount === "number"
                      ? ` · Kohtumisi eraldi: ${item.sessionsCount}`
                      : ""}
                  </p>

                  <details className="mt-6">
                    <summary className="cursor-pointer text-sm text-[#8b642f] underline underline-offset-4">
                      Ava kogu märkamine
                    </summary>

                    <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-[#5f574f]">
                      {item.text}
                    </p>
                  </details>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-12 flex flex-col md:flex-row gap-4">
          <a
            href="/journey"
            className="rounded-full border border-[#c9a36a] px-8 py-4 text-sm uppercase tracking-[0.25em] text-[#8b642f] text-center"
          >
            Minu liikumine
          </a>

          <a
            href="/journey-reflections"
            className="rounded-full border border-[#d8d1c7] px-8 py-4 text-sm uppercase tracking-[0.25em] text-[#6d655d] text-center"
          >
            Kohtumiste ajalugu
          </a>

          <button
            onClick={clearMap}
            className="rounded-full border border-[#d8d1c7] px-8 py-4 text-sm uppercase tracking-[0.25em] text-[#6d655d]"
          >
            Tühjenda kaart
          </button>

          <a
            href="/settings"
            className="rounded-full border border-[#d8d1c7] px-8 py-4 text-sm uppercase tracking-[0.25em] text-[#6d655d] text-center"
          >
            Tagasi mällu
          </a>
        </div>
      </section>
    </main>
  );
}