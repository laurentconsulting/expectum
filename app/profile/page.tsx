"use client";

import { useEffect, useState } from "react";
import { EXPECTUM_STORAGE } from "@/lib/expectumStorage";
import ExpectumPage from "@/components/ExpectumPage";
import ExpectumSymbol from "@/components/ExpectumSymbol";
import ExpectumAuthGate from "@/components/ExpectumAuthGate";


import type {
  Landmark,
  ThemeItem,
  TrajectoryItem,
} from "@/lib/expectumTypes";

type ProfileData = {
  topTheme: string;
  latestEcho: string;
  latestTrajectory: string;
  summary: string;
};

export default function Profile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    const landmarks: Landmark[] = JSON.parse(
      localStorage.getItem(EXPECTUM_STORAGE.landmarks) || "[]"
    );

    const themes: ThemeItem[] = JSON.parse(
      localStorage.getItem(EXPECTUM_STORAGE.detectedThemes) || "[]"
    );

    const trajectories: TrajectoryItem[] = JSON.parse(
      localStorage.getItem(EXPECTUM_STORAGE.trajectoryHistory) || "[]"
    );

    const topTheme =
      themes.length > 0
        ? themes[0].name
        : "Teema ei ole veel nähtavale tulnud.";

    const latestEcho =
      landmarks.length > 0
        ? landmarks[0].text
        : "Kaja ei ole veel salvestatud.";

    const latestTrajectory =
      trajectories.length > 0
        ? trajectories[0].text
        : "Liikumise suunda ei ole veel salvestatud.";

    const summary =
      themes.length > 0
        ? `Seni nähtavas teekonnas kordub kõige enam teema "${themes[0].name}".`
        : "Teekond alles kujuneb ja nähtavad mustrid vajavad veel aega.";

    setProfile({
      topTheme,
      latestEcho,
      latestTrajectory,
      summary,
    });
  }, []);

  return (
    <ExpectumAuthGate>
    <ExpectumPage>
      <section className="mx-auto max-w-4xl text-center">
        <p className="mb-10 inline-flex items-center justify-center gap-3 text-xs uppercase tracking-[0.4em] text-[#b78a4a]">
          <ExpectumSymbol name="path" size="header" />
          <span>Teekonna profiil</span>
        </p>

        <h1 className="mb-6 text-4xl font-light md:text-6xl">
          Seni nähtavale tulnud
        </h1>

        <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-[#5f574f]">
          See ei ole hinnang ega kirjeldus Sinust.
          See on märkamine sellest, mis on teekonnal seni nähtavaks saanud.
        </p>

        {profile && (
          <div className="space-y-8 text-left">
            <div className="rounded-3xl border border-[#d7b985] bg-white/45 p-8">
              <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[#b78a4a]">
                Tugevaim teema
              </p>

              <p className="text-2xl font-light">
                {profile.topTheme}
              </p>
            </div>

            <div className="rounded-3xl border border-[#d7b985] bg-white/45 p-8">
              <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[#b78a4a]">
                Viimane kaja
              </p>

              <p className="whitespace-pre-line leading-relaxed">
                {profile.latestEcho}
              </p>
            </div>

            <div className="rounded-3xl border border-[#d7b985] bg-white/45 p-8">
              <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[#b78a4a]">
                Viimane suund
              </p>

              <p className="whitespace-pre-line leading-relaxed">
                {profile.latestTrajectory}
              </p>
            </div>

            <div className="rounded-3xl border border-[#d7b985] bg-white/45 p-8">
              <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[#b78a4a]">
                Liikumise märkamine
              </p>

              <p className="leading-relaxed">
                {profile.summary}
              </p>
            </div>
          </div>
        )}

        <div className="mt-12 flex flex-col flex-wrap justify-center gap-4 md:flex-row">
          <a
            href="/path"
            className="rounded-full border border-[#c9a36a] px-8 py-4 text-center text-sm uppercase tracking-[0.25em] text-[#8b642f]"
          >
            Minu teekond
          </a>

          <a
            href="/timeline"
            className="rounded-full border border-[#d8d1c7] px-8 py-4 text-center text-sm uppercase tracking-[0.25em] text-[#6d655d]"
          >
            Liikumise ajajoon
          </a>

          <a
            href="/settings"
            className="rounded-full border border-[#d8d1c7] px-8 py-4 text-center text-sm uppercase tracking-[0.25em] text-[#6d655d]"
          >
            Mälu
          </a>
        </div>
      </section>
    </ExpectumPage>
    </ExpectumAuthGate>
  );
}