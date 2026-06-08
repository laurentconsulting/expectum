"use client";

import { useEffect, useState } from "react";
import ExpectumPage from "@/components/ExpectumPage";
import ExpectumSymbol from "@/components/ExpectumSymbol";
import { EXPECTUM_STORAGE } from "@/lib/expectumStorage";
import { supabase } from "@/lib/supabaseClient";
import ExpectumAuthGate from "@/components/ExpectumAuthGate";

type MeetingItem = {
  id: string;
  question: string | null;
  reflection: string | null;
  thread: unknown[] | null;
  mode: string | null;
  created_at: string;
};

type EchoItem = {
  id: string;
  text: string;
  question: string | null;
  created_at: string;
};

type JourneyNoticeItem = {
  id: string;
  text: string;
  history_count: number | null;
  echoes_count: number | null;
  sessions_count: number | null;
  created_at: string;
};

type DirectionItem = {
  text: string;
  createdAt: string;
};

export default function Trajectory() {
  const [trajectory, setTrajectory] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  async function openTrajectory() {
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      setTrajectory("Nähtavale tulnud suuna märkamiseks tuleb esmalt siseneda.");
      setLoading(false);
      return;
    }

    const userId = userData.user.id;

    const { data: meetingsData, error: meetingsError } = await supabase
      .from("meetings")
      .select("id, question, reflection, thread, mode, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5);

    const { data: echoesData, error: echoesError } = await supabase
      .from("echoes")
      .select("id, text, question, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5);

    const { data: noticesData, error: noticesError } = await supabase
      .from("journey_notices")
      .select("id, text, history_count, echoes_count, sessions_count, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(3);

    if (meetingsError || echoesError || noticesError) {
      console.error("Nähtavale tulnud suuna andmeid ei saanud avada.", {
        meetingsError,
        echoesError,
        noticesError,
      });

      setTrajectory(
        "Praegu ei saanud nähtavale tulnud suunda avada. Peatu hetkeks ja proovi uuesti."
      );
      setLoading(false);
      return;
    }

    const history = (meetingsData || []) as MeetingItem[];
    const landmarks = (echoesData || []) as EchoItem[];
    const journeyReflections = (noticesData || []) as JourneyNoticeItem[];

    const themes = JSON.parse(
      localStorage.getItem(EXPECTUM_STORAGE.detectedThemes) || "[]"
    );

    if (
      history.length === 0 &&
      landmarks.length === 0 &&
      journeyReflections.length === 0
    ) {
      setTrajectory(
        "Nähtavale tulnud suuna märkamiseks ei ole veel piisavalt kohtumisi."
      );
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/trajectory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          history,
          landmarks,
          journeyReflections,
          themes,
        }),
      });

      const data = await response.json();
      const text = data.trajectory || "";

      setTrajectory(text);
      localStorage.setItem(EXPECTUM_STORAGE.trajectory, text);
      setSaved(false);
    } catch (error) {
      console.error(error);

      setTrajectory(
        "Praegu ei saanud nähtavale tulnud suunda avada. Peatu hetkeks ja proovi uuesti."
      );
    } finally {
      setLoading(false);
    }
  }

  async function saveTrajectory() {
    if (!trajectory.trim()) return;

    const item: DirectionItem = {
      text: trajectory,
      createdAt: new Date().toISOString(),
    };

    const history: DirectionItem[] = JSON.parse(
      localStorage.getItem(EXPECTUM_STORAGE.trajectoryHistory) || "[]"
    );

    localStorage.setItem(
      EXPECTUM_STORAGE.trajectoryHistory,
      JSON.stringify([item, ...history])
    );

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      console.error("Nähtavale tulnud suunda ei saanud hoida: kasutaja puudub.");
      return;
    }

    const { error } = await supabase.from("directions").insert({
      user_id: userData.user.id,
      text: trajectory,
      created_at: item.createdAt,
    });

    if (error) {
      console.error("Nähtavale tulnud suunda ei saanud hoida.", error);
      return;
    }

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  }

  useEffect(() => {
    const existing = localStorage.getItem(EXPECTUM_STORAGE.trajectory);

    if (existing) {
      setTrajectory(existing);
    } else {
      openTrajectory();
    }
  }, []);

  return (
    <ExpectumAuthGate>
      <ExpectumPage
        footerLinks={[
          {
            href: "/themes",
            label: "Teema",
            symbol: "theme",
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
            <ExpectumSymbol name="direction" size="header" />
            <span>Liikumise suund</span>
          </p>

          <h1 className="mb-6 text-4xl font-light md:text-6xl">
            Mis suund on nähtavale tulnud?
          </h1>

          <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-[#5f574f]">
            Suund ei ole ennustus ega sihtkoht. Ta on võimalik liikumine,
            mis võib kordumistes nähtavale tulla.
          </p>

          <div className="rounded-3xl border border-[#d7b985] bg-white/45 p-8 text-left">
            {loading ? (
              <p>Nähtavale tulnud suuna märkamine...</p>
            ) : (
              <p className="whitespace-pre-line text-lg leading-relaxed text-[#4f4942]">
                {trajectory}
              </p>
            )}
          </div>

          {saved && (
            <p className="mt-6 text-[#8b642f]">
              Nähtavale tulnud suund on hoitud.
            </p>
          )}

          <div className="mt-12 flex flex-col flex-wrap justify-center gap-4 md:flex-row">
            <button
              type="button"
              onClick={openTrajectory}
              className="rounded-full border border-[#c9a36a] px-8 py-4 text-sm uppercase tracking-[0.25em] text-[#8b642f] transition hover:bg-[#efe2ce]"
            >
              Märka uuesti
            </button>

            <button
              type="button"
              onClick={saveTrajectory}
              className="rounded-full border border-[#c9a36a] px-8 py-4 text-sm uppercase tracking-[0.25em] text-[#8b642f] transition hover:bg-[#efe2ce]"
            >
              Hoia suund
            </button>
          </div>
        </section>
      </ExpectumPage>
    </ExpectumAuthGate>
  );
}