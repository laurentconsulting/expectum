"use client";

import { useEffect, useState } from "react";
import { EXPECTUM_STORAGE } from "@/lib/expectumStorage";
import ExpectumPage from "@/components/ExpectumPage";
import ExpectumSymbol from "@/components/ExpectumSymbol";

type TrajectoryItem = {
  text: string;
  createdAt: string;
};

export default function TrajectoryHistory() {
  const [items, setItems] = useState<TrajectoryItem[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  function loadHistory() {
    const saved: TrajectoryItem[] = JSON.parse(
      localStorage.getItem(EXPECTUM_STORAGE.trajectoryHistory) || "[]"
    );

    setItems(saved);
  }

  function removeItem(index: number) {
    const updated = [...items];

    updated.splice(index, 1);

    localStorage.setItem(
      EXPECTUM_STORAGE.trajectoryHistory,
      JSON.stringify(updated)
    );

    setItems(updated);
  }

  function clearHistory() {
    const confirmed = window.confirm(
      "Kas soovid kõik salvestatud suunad puhastada?"
    );

    if (!confirmed) return;

    localStorage.removeItem(EXPECTUM_STORAGE.trajectoryHistory);

    setItems([]);
  }

  return (
    <ExpectumPage
      footerLinks={[
        {
          href: "/trajectory",
          label: "Suund",
          symbol: "direction",
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
          <ExpectumSymbol name="direction" size="header" />
          <span>Salvestatud suunad</span>
        </p>

        <h1 className="mb-6 text-4xl font-light md:text-6xl">
          Salvestatud suunad
        </h1>

        <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-[#5f574f]">
          Siin on Suunad, mida oled soovinud alles hoida.
        </p>

        {items.length === 0 ? (
          <div className="rounded-3xl border border-[#d7b985] bg-white/45 p-8 text-left">
            Ühtegi salvestatud suunda ei ole veel.
          </div>
        ) : (
          <div className="space-y-8 text-left">
            {items.map((item, index) => (
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

                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="mt-8 rounded-full border border-[#d8d1c7] px-6 py-3 text-sm uppercase tracking-[0.25em] text-[#6d655d] transition hover:bg-[#f1ebe3]"
                >
                  Eemalda suund
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
            Puhasta salvestatud suunad
          </button>
        </div>
      </section>
    </ExpectumPage>
  );
}