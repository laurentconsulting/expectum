"use client";

import { useEffect, useState } from "react";
import ExpectumPage from "@/components/ExpectumPage";
import ExpectumSymbol from "@/components/ExpectumSymbol";
import { EXPECTUM_STORAGE } from "@/lib/expectumStorage";

type Landmark = {
  id: string;
  text: string;
  question: string;
  createdAt: string;
};

export default function Landmarks() {
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);

  useEffect(() => {
    const saved: Landmark[] = JSON.parse(
      localStorage.getItem(EXPECTUM_STORAGE.landmarks) || "[]"
    );

    setLandmarks(saved);
  }, []);

  function removeLandmark(index: number) {
    const removedLandmark = landmarks[index];
    const updated = [...landmarks];

    updated.splice(index, 1);

    localStorage.setItem(EXPECTUM_STORAGE.landmarks, JSON.stringify(updated));

    const sharedInsights = JSON.parse(
      localStorage.getItem(EXPECTUM_STORAGE.sharedInsights) || "[]"
    );

    const updatedSharedInsights = sharedInsights.filter(
      (item: { id?: string }) => item.id !== removedLandmark.id
    );

    localStorage.setItem(
      EXPECTUM_STORAGE.sharedInsights,
      JSON.stringify(updatedSharedInsights)
    );

    setLandmarks(updated);
  }

  return (
    <ExpectumPage
      footerLinks={[
        {
          href: "/history",
          label: "Kohtumised",
          symbol: "meeting",
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
          <ExpectumSymbol name="echo" size="header" />
          <span>Kaja</span>
        </p>

        <h1 className="mb-12 text-4xl font-light md:text-6xl">
          Minu kaja
        </h1>

        {landmarks.length === 0 ? (
          <div className="rounded-3xl border border-[#d7b985] bg-white/45 p-8 text-left">
            Ühtegi kaja ei ole veel salvestatud.
          </div>
        ) : (
          <div className="space-y-8 text-left">
            {landmarks.map((item, index) => (
              <div
                key={item.id || index}
                className="rounded-3xl border border-[#d7b985] bg-white/45 p-8"
              >
                <p className="mb-6 text-xl leading-relaxed">
                  {item.text}
                </p>

                <p className="mb-6 text-sm text-[#6d655d]">
                  {new Date(item.createdAt).toLocaleDateString("et-EE")}
                </p>

                <details>
                  <summary className="cursor-pointer">
                    Algne küsimus
                  </summary>

                  <p className="mt-4 text-[#5f574f]">
                    {item.question}
                  </p>
                </details>

                <button
                  type="button"
                  onClick={() => removeLandmark(index)}
                  className="mt-6 rounded-full border border-[#d8d1c7] px-6 py-3 text-sm uppercase tracking-[0.25em] text-[#6d655d] transition hover:bg-[#f1ebe3]"
                >
                  Eemalda kaja
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </ExpectumPage>
  );
}