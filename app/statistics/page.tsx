"use client";

import { useEffect, useState } from "react";
import { EXPECTUM_STORAGE } from "@/lib/expectumStorage";
import { supabase } from "@/lib/supabaseClient";
import ExpectumPage from "@/components/ExpectumPage";
import ExpectumSymbol from "@/components/ExpectumSymbol";
import ExpectumAuthGate from "@/components/ExpectumAuthGate";
import ExpectumCard from "@/components/ExpectumCard";
import {
  getMeetingCountSummary,
  type NormalizableThreadMessage,
} from "@/lib/expectumMemoryNormalize";

type MeetingItem = {
  id: string;
  thread: NormalizableThreadMessage[] | null;
  mode: string | null;
  created_at: string;
};

export default function Statistics() {
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    history: 0,
    meetings: 0,
    thoughts: 0,
    explorations: 0,
    echoes: 0,
    journeyNotices: 0,
    themes: 0,
    directions: 0,
    sharedInsights: 0,
    firstDate: "",
    lastDate: "",
  });

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      setLoading(false);
      return;
    }

    const userId = userData.user.id;

    const { data: meetingsData, error: meetingsError } = await supabase
      .from("meetings")
      .select("id, thread, mode, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    const { count: echoesCount, error: echoesError } = await supabase
      .from("echoes")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId);

    const { count: journeyNoticesCount, error: noticesError } = await supabase
      .from("journey_notices")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId);

    const { count: directionsCount, error: directionsError } = await supabase
      .from("directions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId);

    if (meetingsError || echoesError || noticesError || directionsError) {
      console.error("Mälu koondit ei saanud avada.", {
        meetingsError,
        echoesError,
        noticesError,
        directionsError,
      });

      setLoading(false);
      return;
    }

    const meetings = (meetingsData || []) as MeetingItem[];
    const meetingCounts = getMeetingCountSummary(meetings);

    const themes = JSON.parse(
      localStorage.getItem(EXPECTUM_STORAGE.detectedThemes) || "[]"
    );

    const sharedInsights = JSON.parse(
      localStorage.getItem(EXPECTUM_STORAGE.sharedInsights) || "[]"
    );

    setStats({
      history: meetingCounts.encounterCount,
      meetings: meetingCounts.meetingCount,
      thoughts: meetingCounts.thoughtCount,
      explorations: meetingCounts.explorationCount,
      echoes: echoesCount || 0,
      journeyNotices: journeyNoticesCount || 0,
      themes: themes.length,
      directions: directionsCount || 0,
      sharedInsights: sharedInsights.length,
      firstDate: meetings[0]?.created_at || "",
      lastDate: meetings[meetings.length - 1]?.created_at || "",
    });

    setLoading(false);
  }

  return (
    <ExpectumAuthGate>
      <ExpectumPage
        footerLinks={[
          {
            href: "/settings",
            label: "Mälu",
            symbol: "memory",
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
            <ExpectumSymbol name="memory" size="header" />
            <span>Koond</span>
          </p>

          <h1 className="mb-10 text-4xl font-light md:text-6xl">
            Mälu hoiab
          </h1>

          <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-[#5f574f]">
            See ei ole hinnang ega mõõtmine. See on vaikne ülevaade jälgedest,
            mida mälu hoiab.
          </p>

          <ExpectumCard
            className="rounded-3xl border-[#d7b985] bg-white/45 p-8 backdrop-blur-none"
            contentClassName="leading-relaxed"
          >
            {loading ? (
              <p>Mälu jälgede avamine...</p>
            ) : (
              <div className="space-y-4">
                <p>{stats.history} kohtumist</p>
                <p>{stats.meetings} tavalist kohtumist</p>
                <p>{stats.thoughts} mõttekohtumist</p>
                <p>{stats.explorations} avardamist</p>
                <p>{stats.echoes} salvestatud kaja</p>
                <p>{stats.journeyNotices} liikumise märkamist</p>
                <p>{stats.themes} nähtavale tulnud teemat</p>
                <p>{stats.directions} hoitud suunda</p>
                <p>{stats.sharedInsights} jagatud kaja</p>

                {stats.firstDate && (
                  <p>
                    Esimene kohtumine:{" "}
                    {new Date(stats.firstDate).toLocaleDateString("et-EE")}
                  </p>
                )}

                {stats.lastDate && (
                  <p>
                    Viimane kohtumine:{" "}
                    {new Date(stats.lastDate).toLocaleDateString("et-EE")}
                  </p>
                )}
              </div>
            )}
          </ExpectumCard>
        </section>
      </ExpectumPage>
    </ExpectumAuthGate>
  );
}
