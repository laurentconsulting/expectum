"use client";

import { useEffect, useState } from "react";
import { EXPECTUM_STORAGE } from "@/lib/expectumStorage";
import ExpectumPage from "@/components/ExpectumPage";
import ExpectumSymbol from "@/components/ExpectumSymbol";
import ExpectumAuthGate from "@/components/ExpectumAuthGate";

import type {
  HistoryItem,
  JourneyReflection,
  Landmark,
  TrajectoryItem,
} from "@/lib/expectumTypes";

type TimelineItem = {
  type: "meeting" | "echo" | "reflection" | "trajectory";
  title: string;
  text: string;
  createdAt: string;
};

export default function Timeline() {
  const [items, setItems] = useState<TimelineItem[]>([]);

  useEffect(() => {
    const history: HistoryItem[] = JSON.parse(
      localStorage.getItem(EXPECTUM_STORAGE.history) || "[]"
    );

    const landmarks: Landmark[] = JSON.parse(
      localStorage.getItem(EXPECTUM_STORAGE.landmarks) || "[]"
    );

    const reflections: JourneyReflection[] = JSON.parse(
      localStorage.getItem(EXPECTUM_STORAGE.journeyReflections) || "[]"
    );

    const trajectories: TrajectoryItem[] = JSON.parse(
      localStorage.getItem(EXPECTUM_STORAGE.trajectoryHistory) || "[]"
    );

    const timelineItems: TimelineItem[] = [
      ...history.map((item) => ({
        type: "meeting" as const,
        title: item.mode === "thought" ? "Mõttekohtumine" : "Kohtumine",
        text: item.question,
        createdAt: item.createdAt,
      })),

      ...landmarks.map((item) => ({
        type: "echo" as const,
        title: "Kaja",
        text: item.text,
        createdAt: item.createdAt,
      })),

      ...reflections.map((item) => ({
        type: "reflection" as const,
        title: "Liikumise märkamine",
        text: item.text,
        createdAt: item.createdAt,
      })),

      ...trajectories.map((item) => ({
        type: "trajectory" as const,
        title: "Nähtavale tulnud suund",
        text: item.text,
        createdAt: item.createdAt,
      })),
    ];

    const sorted = timelineItems.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );

    setItems(sorted);
  }, []);

  return (
    <ExpectumAuthGate>
    <ExpectumPage
      footerLinks={[
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

            {
          href: "/settings",
          label: "Mälu",
          symbol: "memory",
        },
      ]}
    >
      <section className="mx-auto max-w-4xl text-center">
        <p className="mb-10 inline-flex items-center justify-center gap-3 text-xs uppercase tracking-[0.4em] text-[#b78a4a]">
          <ExpectumSymbol name="path" size="header" />
          <span>Liikumise ajajoon</span>
        </p>

        <h1 className="mb-6 text-4xl font-light md:text-6xl">
          Teekonna jäljed ajas
        </h1>

        <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-[#5f574f]">
          Siin on kohtumised, kaja, liikumise märkamised ja nähtavale
          tulnud suunad ühes rahulikus ajajoones.
        </p>

        {items.length === 0 ? (
          <div className="rounded-3xl border border-[#d7b985] bg-white/45 p-8 text-left">
            Ajajoone jaoks ei ole veel piisavalt jälgi.
          </div>
        ) : (
          <div className="space-y-8 text-left">
            {items.map((item, index) => (
              <div
                key={`${item.createdAt}-${index}`}
                className="rounded-3xl border border-[#d7b985] bg-white/45 p-8"
              >
                <p className="mb-3 text-sm text-[#8a8278]">
                  {new Date(item.createdAt).toLocaleDateString("et-EE")}
                </p>

                <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[#b78a4a]">
                  {item.title}
                </p>

                <p className="whitespace-pre-line text-lg leading-relaxed text-[#4f4942]">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </ExpectumPage>
    </ExpectumAuthGate>
  );
}