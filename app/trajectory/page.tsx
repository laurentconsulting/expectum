"use client";

import { useEffect, useState } from "react";
import ExpectumPage from "@/components/ExpectumPage";
import ExpectumAuthGate from "@/components/ExpectumAuthGate";
import ExpectumCard from "@/components/ExpectumCard";
import ExpectumSection from "@/components/ExpectumSection";
import ExpectumButton from "@/components/ExpectumButton";
import { EXPECTUM_STORAGE } from "@/lib/expectumStorage";
import { supabase } from "@/lib/supabaseClient";
import {
  normalizeMeetingThreadSnapshots,
  type NormalizableThreadMessage,
} from "@/lib/expectumMemoryNormalize";

type MeetingItem = {
  id: string;
  question: string | null;
  reflection: string | null;
  thread: NormalizableThreadMessage[] | null;
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
      .select(
        "id, text, history_count, echoes_count, sessions_count, created_at"
      )
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

    // Read-time only: repeated snapshot messages are removed from the
    // trajectory context without changing or deleting stored meeting rows.
    const history = normalizeMeetingThreadSnapshots(
      (meetingsData || []) as MeetingItem[]
    );
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
          { href: "/themes", label: "Teema", symbol: "theme" },
          { href: "/path", label: "Teekond", symbol: "path" },
          { href: "/settings", label: "Mälu", symbol: "memory" },
        ]}
      >
        <ExpectumSection
          symbol="direction"
          label="Suund"
          title="Mis on liikumises nähtavale tulnud?"
          intro="Suund ei ole ennustus, sihtkoht ega juhis. Ta on võimalik liikumine, mis võib kordumistes nähtavale tulla."
        >
          <ExpectumCard label="Nähtavale tulnud suund">
            {loading ? "Suuna märkamine..." : trajectory}
          </ExpectumCard>

          {saved && (
            <p className="mt-6 text-[#8b642f]">Suund on salvestatud.</p>
          )}

          <div className="mt-12 flex flex-col flex-wrap justify-center gap-4 md:flex-row">
            <ExpectumButton onClick={openTrajectory}>
              Märka uuesti
            </ExpectumButton>

            <ExpectumButton onClick={saveTrajectory} variant="soft">
              Salvesta suund
            </ExpectumButton>
          </div>
        </ExpectumSection>
      </ExpectumPage>
    </ExpectumAuthGate>
  );
}
