"use client";

import { useEffect, useState } from "react";
import ExpectumPage from "@/components/ExpectumPage";
import ExpectumSymbol from "@/components/ExpectumSymbol";
import ExpectumAuthGate from "@/components/ExpectumAuthGate";
import { EXPECTUM_STORAGE } from "@/lib/expectumStorage";
import { supabase } from "@/lib/supabaseClient";

import type {
  SharedInsight,
  ThemeItem,
} from "@/lib/expectumTypes";

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
      .select("id, text, history_count, echoes_count, sessions_count, created_at")
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
            {loading && (
              <div className="rounded-3xl border border-[#d7b985] bg-white/45 p-8">
                Teekonna jälgede avamine...
              </div>
            )}

            {!loading && (
              <>
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
                    {latestEcho?.text || "Ühtegi kaja ei ole veel salvestatud."}
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
                    {latestNotice?.text ||
                      "Liikumise märkamist ei ole veel salvestatud."}
                  </p>
                </div>

                <div className="rounded-3xl border border-[#d7b985] bg-white/45 p-8">
                  <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[#b78a4a]">
                    Viimane nähtavale tulnud suund
                  </p>

                  <p className="whitespace-pre-line leading-relaxed">
                    {latestDirection?.text ||
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
                    <p>Kohtumised: {stats.meetings}</p>
                    <p>Salvestatud kaja: {stats.echoes}</p>
                    <p>Liikumise märkamised: {stats.notices}</p>
                    <p>Hoitud suunad: {stats.directions}</p>
                    <p>Jagatud kaja: {stats.sharedInsights}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </ExpectumPage>
    </ExpectumAuthGate>
  );
}