"use client";

import { useEffect, useState } from "react";
import ExpectumPage from "@/components/ExpectumPage";
import ExpectumSymbol from "@/components/ExpectumSymbol";
import { EXPECTUM_STORAGE } from "@/lib/expectumStorage";
import { EXPECTUM_THEMES } from "@/lib/expectumThemes";

type ThemeItem = {
  name: string;
  count: number;
  matches: string[];
};

type StoredTextItem = {
  question?: string;
  reflection?: string;
  text?: string;
};

export default function Themes() {
  const [themes, setThemes] = useState<ThemeItem[]>([]);

  useEffect(() => {
    const history: StoredTextItem[] = JSON.parse(
      localStorage.getItem(EXPECTUM_STORAGE.history) || "[]"
    );

    const landmarks: StoredTextItem[] = JSON.parse(
      localStorage.getItem(EXPECTUM_STORAGE.landmarks) || "[]"
    );

    const journeyReflections: StoredTextItem[] = JSON.parse(
      localStorage.getItem(EXPECTUM_STORAGE.journeyReflections) || "[]"
    );

    const text = [
      ...history.map(
        (item) => `${item.question || ""} ${item.reflection || ""}`
      ),
      ...landmarks.map(
        (item) => `${item.question || ""} ${item.text || ""}`
      ),
      ...journeyReflections.map((item) => item.text || ""),
    ]
      .join(" ")
      .toLowerCase();

    const calculatedThemes: ThemeItem[] = Object.entries(EXPECTUM_THEMES)
      .map(([name, keywords]) => {
        const matches: string[] = [];

        keywords.forEach((keyword) => {
          const keywordLower = keyword.toLowerCase();

          if (text.includes(keywordLower)) {
            matches.push(keyword);
          }
        });

        return {
          name: name.replaceAll("_", " "),
          count: matches.length,
          matches,
        };
      })
      .filter((theme) => theme.count > 0)
      .sort((a, b) => b.count - a.count);

    localStorage.setItem(
      EXPECTUM_STORAGE.detectedThemes,
      JSON.stringify(calculatedThemes)
    );

    setThemes(calculatedThemes);
  }, []);

  return (
    <ExpectumPage
      footerLinks={[
        {
          href: "/trajectory",
          label: "Suund",
          symbol: "direction",
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
          <ExpectumSymbol name="theme" size="header" />
          <span>Teema</span>
        </p>

        <h1 className="mb-6 text-4xl font-light md:text-6xl">
          Kordumised tulevad nähtavale
        </h1>

        <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-[#5f574f]">
          Teema ei määratle inimest. Ta aitab märgata,
          mis kohtumistes kordub ja võib avada nähtavale tulnud suuna.
        </p>

        {themes.length === 0 ? (
          <div className="rounded-3xl border border-[#d7b985] bg-white/45 p-8 text-left">
            Teemat ei ole veel piisavalt nähtavale tulnud.
          </div>
        ) : (
          <div className="space-y-8 text-left">
            {themes.map((theme) => (
              <div
                key={theme.name}
                className="rounded-3xl border border-[#d7b985] bg-white/45 p-8"
              >
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="mb-3 text-2xl font-light">
                      {theme.name}
                    </p>

                    <p className="text-sm text-[#8a8278]">
                      {theme.count} kohtumises nähtavale tulnud
                    </p>
                  </div>

                  <div className="text-3xl font-light text-[#b78a4a]">
                    {theme.count}
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  {theme.matches.map((match) => (
                    <span
                      key={match}
                      className="rounded-full border border-[#d8d1c7] px-4 py-2 text-sm text-[#6d655d]"
                    >
                      {match}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </ExpectumPage>
  );
}