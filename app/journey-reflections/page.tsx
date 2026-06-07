"use client";

import { useEffect, useState } from "react";
import { EXPECTUM_STORAGE } from "@/lib/expectumStorage";
import ExpectumPage from "@/components/ExpectumPage";
import ExpectumSymbol from "@/components/ExpectumSymbol";

type JourneyReflection = {
  text: string;
  createdAt: string;
  historyCount: number;
  landmarksCount: number;
  sessionsCount?: number;
};

export default function JourneyReflections() {
  const [reflections, setReflections] = useState<JourneyReflection[]>([]);

  useEffect(() => {
    const saved: JourneyReflection[] = JSON.parse(
      localStorage.getItem(EXPECTUM_STORAGE.journeyReflections) || "[]"
    );

    setReflections(saved);
  }, []);

  function clearReflections() {
    const confirmed = window.confirm(
      "Kas soovid salvestatud liikumise märkamised puhastada?"
    );

    if (!confirmed) return;

    localStorage.removeItem(EXPECTUM_STORAGE.journeyReflections);
    setReflections([]);
  }

  return (
    <ExpectumPage
      footerLinks={[
        {
          href: "/journey",
          label: "Liikumise märkamine",
          symbol: "path",
        },
        {
          href: "/settings",
          label: "Mälu",
          symbol: "memory",
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
          Liikumise märkamised
        </h1>

        {reflections.length === 0 ? (
          <div className="rounded-3xl border border-[#d7b985] bg-white/45 p-8 text-left">
            Liikumise märkamisi ei ole veel salvestatud.
          </div>
        ) : (
          <div className="space-y-10 text-left">
            {reflections.map((item, index) => (
              <div
                key={`${item.createdAt}-${index}`}
                className="rounded-3xl border border-[#d7b985] bg-white/45 p-8"
              >
                <p className="mb-6 text-sm text-[#8a8278]">
                  {new Date(item.createdAt).toLocaleDateString("et-EE")}
                </p>

                <p className="whitespace-pre-line text-lg leading-relaxed text-[#4f4942]">
                  {item.text}
                </p>

                <p className="mt-6 text-sm text-[#8a8278]">
                  Kohtumised: {item.historyCount} · Salvestatud kaja:{" "}
                  {item.landmarksCount}
                  {typeof item.sessionsCount === "number"
                    ? ` · Kohtumisi eraldi: ${item.sessionsCount}`
                    : ""}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={clearReflections}
            className="rounded-full border border-[#d8d1c7] px-8 py-4 text-sm uppercase tracking-[0.25em] text-[#6d655d] transition hover:bg-[#f1ebe3]"
          >
            Puhasta salvestatud märkamised
          </button>
        </div>
      </section>
    </ExpectumPage>
  );
}