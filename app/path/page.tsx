"use client";

import { useEffect, useState } from "react";
import ExpectumPage from "@/components/ExpectumPage";
import ExpectumSymbol from "@/components/ExpectumSymbol";
import { EXPECTUM_STORAGE } from "@/lib/expectumStorage";
import ExpectumAuthGate from "@/components/ExpectumAuthGate";

import type {
  HistoryItem,
  JourneyReflection,
  Landmark,
  SharedInsight,
  ThemeItem,
  TrajectoryItem,
} from "@/lib/expectumTypes";

export default function Path() {
  const [latestMeeting, setLatestMeeting] = useState<HistoryItem | null>(null);
  const [latestLandmark, setLatestLandmark] = useState<Landmark | null>(null);
  const [topTheme, setTopTheme] = useState<ThemeItem | null>(null);
  const [latestReflection, setLatestReflection] =
    useState<JourneyReflection | null>(null);
  const [latestTrajectory, setLatestTrajectory] =
    useState<TrajectoryItem | null>(null);
  const [latestSharedInsight, setLatestSharedInsight] =
    useState<SharedInsight | null>(null);

  const [stats, setStats] = useState({
    history: 0,
    landmarks: 0,
    reflections: 0,
    trajectories: 0,
    sharedInsights: 0,
  });

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

    const themes: ThemeItem[] = JSON.parse(
      localStorage.getItem(EXPECTUM_STORAGE.detectedThemes) || "[]"
    );

    const trajectories: TrajectoryItem[] = JSON.parse(
      localStorage.getItem(EXPECTUM_STORAGE.trajectoryHistory) || "[]"
    );

    const latestOpenTrajectory = localStorage.getItem(
      EXPECTUM_STORAGE.trajectory
    );

    const sharedInsights: SharedInsight[] = JSON.parse(
      localStorage.getItem(EXPECTUM_STORAGE.sharedInsights) || "[]"
    );

    setLatestMeeting(history[0] || null);
    setLatestLandmark(landmarks[0] || null);
    setTopTheme(themes[0] || null);
    setLatestReflection(reflections[0] || null);

    if (trajectories.length > 0) {
      setLatestTrajectory(trajectories[0]);
    } else if (latestOpenTrajectory) {
      setLatestTrajectory({
        text: latestOpenTrajectory,
        createdAt: new Date().toISOString(),
      });
    }

    setLatestSharedInsight(sharedInsights[0] || null);

    setStats({
      history: history.length,
      landmarks: landmarks.length,
      reflections: reflections.length,
      trajectories: trajectories.length,
      sharedInsights: sharedInsights.length,
    });
  }, []);

  return (
    <ExpectumAuthGate>
    <ExpectumPage
      footerLinks={[
        {
          href: "/journey",
          label: "Liikumise märkamine",
          symbol: "path",
        },
        {
          href: "/expectum",
          label: "Expectum?",
          symbol: "aim",
        },
        {
          href: "/attunement-question",
          label: "Vaikne küsimus",
          symbol: "meeting",
        },
      ]}
    >
      <section className="mx-auto max-w-5xl text-center">
        <p className="mb-10 inline-flex items-center justify-center gap-3 text-xs uppercase tracking-[0.4em] text-[#b78a4a]">
          <ExpectumSymbol name="path" size="header" />
          <span>Minu teekond</span>
        </p>

        <h1 className="mb-6 text-4xl font-light md:text-6xl">
          Teekonnal nähtavale tulnud
        </h1>

        <p className="mx-auto mb-12 max-w-3xl text-lg leading-relaxed text-[#5f574f]">
          Liikumine toimub kohtumises. Mälu hoiab jälgi. Teekond tuleb
          nähtavale varasemate sammude jälgedes.
        </p>

        <div className="mb-12 grid gap-6 text-left md:grid-cols-2">
          <div className="rounded-3xl border border-[#d7b985] bg-white/45 p-8">
            <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[#b78a4a]">
              Jälgede märkamine
            </p>
            <p className="leading-relaxed text-[#5f574f]">
              Mis on kohtumistest alles jäänud ja soovinud nähtavale tulla.
            </p>
          </div>

          <div className="rounded-3xl border border-[#d7b985] bg-white/45 p-8">
            <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[#b78a4a]">
              Liikumise märkamine
            </p>
            <p className="leading-relaxed text-[#5f574f]">
              Kuidas kaja, teema ja nähtavale tulnud suund hakkavad ajas
              omavahel kõnelema.
            </p>
          </div>

          <div className="rounded-3xl border border-[#d7b985] bg-white/45 p-8">
            <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[#b78a4a]">
              Muutuse märkamine
            </p>
            <p className="leading-relaxed text-[#5f574f]">
              Mis on esile kerkinud, vaibunud või teise valgusesse liikunud.
            </p>
          </div>

          <div className="rounded-3xl border border-[#d7b985] bg-white/45 p-8">
            <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[#b78a4a]">
              Märkamiste märkamine
            </p>
            <p className="leading-relaxed text-[#5f574f]">
              Kuidas märkamine ise võib teekonna jooksul muutuda.
            </p>
          </div>
        </div>

        <div className="space-y-8 text-left">
          <div className="rounded-3xl border border-[#d7b985] bg-white/45 p-8">
            <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[#b78a4a]">
              Viimane kohtumine
            </p>

            <p className="whitespace-pre-line text-lg leading-relaxed">
              {latestMeeting?.question ||
                "Ühtegi kohtumist ei ole veel salvestatud."}
            </p>
          </div>

          <div className="rounded-3xl border border-[#d7b985] bg-white/45 p-8">
            <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[#b78a4a]">
              Viimane kaja
            </p>

            <p className="whitespace-pre-line text-lg leading-relaxed">
              {latestLandmark?.text || "Ühtegi kaja ei ole veel salvestatud."}
            </p>
          </div>

          <div className="rounded-3xl border border-[#d7b985] bg-white/45 p-8">
            <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[#b78a4a]">
              Nähtavale tulnud teema
            </p>

            <p className="text-2xl font-light">
              {topTheme?.name || "Teema ei ole veel nähtavale tulnud."}
            </p>

            {topTheme && (
              <p className="mt-3 text-sm text-[#8a8278]">
                {topTheme.count} kohtumises nähtavale tulnud
              </p>
            )}
          </div>

          <div className="rounded-3xl border border-[#d7b985] bg-white/45 p-8">
            <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[#b78a4a]">
              Viimane liikumise märkamine
            </p>

            <p className="whitespace-pre-line leading-relaxed">
              {latestReflection?.text ||
                "Liikumise märkamist ei ole veel salvestatud."}
            </p>
          </div>

          <div className="rounded-3xl border border-[#d7b985] bg-white/45 p-8">
            <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[#b78a4a]">
              Viimane nähtavale tulnud suund
            </p>

            <p className="whitespace-pre-line leading-relaxed">
              {latestTrajectory?.text ||
                "Nähtavale tulnud suunda ei ole veel hoitud."}
            </p>
          </div>

          <div className="rounded-3xl border border-[#d7b985] bg-white/45 p-8">
            <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[#b78a4a]">
              Viimane jagatud kaja
            </p>

            <p className="whitespace-pre-line leading-relaxed">
              {latestSharedInsight?.text ||
                "Ühtegi kaja ei ole veel jagamiseks esitatud."}
            </p>
          </div>

          <div className="rounded-3xl border border-[#d7b985] bg-white/45 p-8">
            <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[#b78a4a]">
              Nähtavad jäljed
            </p>

            <div className="space-y-4">
  <p>{stats.history} kohtumist</p>
  <p>{stats.landmarks} salvestatud kaja</p>
  <p>{stats.reflections} liikumise märkamist</p>
  <p>{stats.trajectories} hoitud suunda</p>
  <p>{stats.sharedInsights} jagatud kaja</p>
</div>
          </div>
        </div>
      </section>
    </ExpectumPage>
    </ExpectumAuthGate>
  );
}