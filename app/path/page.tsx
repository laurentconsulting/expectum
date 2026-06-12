"use client";

import { useEffect, useState } from "react";
import ExpectumPage from "@/components/ExpectumPage";
import ExpectumAuthGate from "@/components/ExpectumAuthGate";
import ExpectumCard from "@/components/ExpectumCard";
import ExpectumSection from "@/components/ExpectumSection";
import { EXPECTUM_STORAGE } from "@/lib/expectumStorage";
import { supabase } from "@/lib/supabaseClient";

import type { SharedInsight, ThemeItem } from "@/lib/expectumTypes";

type MeetingItem = {
  id: string;
  question: string | null;
  reflection: string | null;
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
  id: string;
  text: string;
  created_at: string;
};

export default function Path() {
  const [latestMeeting, setLatestMeeting] = useState<MeetingItem | null>(null);
  const [latestEcho, setLatestEcho] = useState<EchoItem | null>(null);
  const [topTheme, setTopTheme] = useState<ThemeItem | null>(null);
  const [latestNotice, setLatestNotice] = useState<JourneyNoticeItem | null>(
    null
  );
  const [latestDirection, setLatestDirection] =
    useState<DirectionItem | null>(null);
  const [latestSharedInsight, setLatestSharedInsight] =
    useState<SharedInsight | null>(null);

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    meetings: 0,
    echoes: 0,
    notices: 0,
    directions: 0,
    sharedInsights: 0,
  });

  useEffect(() => {
    loadPath();
  }, []);

  async function loadPath() {
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      setLoading(false);
      return;
    }

    const userId = userData.user.id;

    const { data: meetingsData, error: meetingsError } = await supabase
      .from("meetings")
      .select("id, question, reflection, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    const { data: echoesData, error: echoesError } = await supabase
      .from("echoes")
      .select("id, text, question, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    const { data: noticesData, error: noticesError } = await supabase
      .from("journey_notices")
      .select(
        "id, text, history_count, echoes_count, sessions_count, created_at"
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    const { data: directionsData, error: directionsError } = await supabase
      .from("directions")
      .select("id, text, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (meetingsError || echoesError || noticesError || directionsError) {
      console.error("Teekonna jälgi ei saanud avada.", {
        meetingsError,
        echoesError,
        noticesError,
        directionsError,
      });

      setLoading(false);
      return;
    }

    const meetings = (meetingsData || []) as MeetingItem[];
    const echoes = (echoesData || []) as EchoItem[];
    const notices = (noticesData || []) as JourneyNoticeItem[];
    const directions = (directionsData || []) as DirectionItem[];

    const themes: ThemeItem[] = JSON.parse(
      localStorage.getItem(EXPECTUM_STORAGE.detectedThemes) || "[]"
    );

    const sharedInsights: SharedInsight[] = JSON.parse(
      localStorage.getItem(EXPECTUM_STORAGE.sharedInsights) || "[]"
    );

    setLatestMeeting(meetings[0] || null);
    setLatestEcho(echoes[0] || null);
    setTopTheme(themes[0] || null);
    setLatestNotice(notices[0] || null);
    setLatestDirection(directions[0] || null);
    setLatestSharedInsight(sharedInsights[0] || null);

    setStats({
      meetings: meetings.length,
      echoes: echoes.length,
      notices: notices.length,
      directions: directions.length,
      sharedInsights: sharedInsights.length,
    });

    setLoading(false);
  }

  return (
    <ExpectumAuthGate>
      <ExpectumPage
        footerLinks={[
          { href: "/journey", label: "Liikumise märkamine", symbol: "path" },
          { href: "/settings", label: "Mälu", symbol: "memory" },
          {
            href: "/attunement-question",
            label: "Vaikne küsimus",
            symbol: "meeting",
          },
        ]}
      >
        <ExpectumSection
          symbol="path"
          label="Teekond"
          title="Mis on jälgedes nähtavale tulnud?"
          intro="Liikumine toimub kohtumises. Mälu hoiab jälgi. Teekond tuleb nähtavale varasemate sammude jälgedes."
          className="max-w-5xl"
        >
          <div className="mb-12 grid gap-6 text-left md:grid-cols-2">
            <ExpectumCard label="Jälgede märkamine">
              Mis on kohtumistest alles jäänud ja soovinud nähtavale tulla.
            </ExpectumCard>

            <ExpectumCard label="Liikumise märkamine">
              Kuidas Kaja, Teema ja nähtavale tulnud Suund võivad ajas
              omavahel kõnelema hakata.
            </ExpectumCard>

            <ExpectumCard label="Muutuse märkamine">
              Mis on nähtavale tulnud, vaibunud või teise valgusesse liikunud.
            </ExpectumCard>

            <ExpectumCard label="Märkamiste märkamine">
              Kuidas märkamine ise võib teekonna jooksul muutuda.
            </ExpectumCard>
          </div>

          <div className="space-y-8">
            {loading && <ExpectumCard>Teekonna jälgede avamine...</ExpectumCard>}

            {!loading && (
              <>
                <ExpectumCard label="Kohtumine">
                  {latestMeeting?.question ||
                    "Ühtegi kohtumist ei ole veel salvestatud."}
                </ExpectumCard>

                <ExpectumCard label="Kaja">
                  {latestEcho?.text || "Ühtegi kaja ei ole veel salvestatud."}
                </ExpectumCard>

                <ExpectumCard label="Teema">
                  <p className="text-2xl font-light">
                    {topTheme?.name || "Teema ei ole veel nähtavale tulnud."}
                  </p>

                  {topTheme && (
                    <p className="mt-3 text-sm text-[#8a8278]">
                      Teema on kohtumiste jälgedes kordunud.
                    </p>
                  )}
                </ExpectumCard>

                <ExpectumCard label="Liikumise märkamine">
                  {latestNotice?.text ||
                    "Liikumise märkamist ei ole veel salvestatud."}
                </ExpectumCard>

                <ExpectumCard label="Suund">
                  {latestDirection?.text ||
                    "Nähtavale tulnud suunda ei ole veel hoitud."}
                </ExpectumCard>

                <ExpectumCard label="Jagatud Kaja">
                  {latestSharedInsight?.text ||
                    "Ühtegi Kaja ei ole veel ühisesse ruumi liikunud."}
                </ExpectumCard>

                <ExpectumCard label="Mälu hoiab">
                  <div className="space-y-4">
                    <p>{stats.meetings} kohtumist</p>
                    <p>{stats.echoes} kaja</p>
                    <p>{stats.notices} liikumise märkamist</p>
                    <p>{stats.directions} salvestatud suunda</p>
                    <p>{stats.sharedInsights} jagatud Kaja</p>
                  </div>
                </ExpectumCard>
              </>
            )}
          </div>
        </ExpectumSection>
      </ExpectumPage>
    </ExpectumAuthGate>
  );
}