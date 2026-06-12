"use client";

import { useEffect, useState } from "react";
import ExpectumPage from "@/components/ExpectumPage";
import ExpectumAuthGate from "@/components/ExpectumAuthGate";
import ExpectumCard from "@/components/ExpectumCard";
import ExpectumSection from "@/components/ExpectumSection";
import { EXPECTUM_STORAGE } from "@/lib/expectumStorage";
import { EXPECTUM_THEMES } from "@/lib/expectumThemes";
import { supabase } from "@/lib/supabaseClient";

type ThemeItem = {
  name: string;
  count: number;
  matches: string[];
};

type MeetingRow = {
  question: string | null;
  reflection: string | null;
};

type EchoRow = {
  question: string | null;
  text: string;
};

type JourneyNoticeRow = {
  text: string;
};

export default function Themes() {
  const [themes, setThemes] = useState<ThemeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadThemes();
  }, []);

  async function loadThemes() {
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      setThemes([]);
      setLoading(false);
      return;
    }

    const userId = userData.user.id;

    const { data: meetingsData, error: meetingsError } = await supabase
      .from("meetings")
      .select("question, reflection")
      .eq("user_id", userId);

    const { data: echoesData, error: echoesError } = await supabase
      .from("echoes")
      .select("question, text")
      .eq("user_id", userId);

    const { data: noticesData, error: noticesError } = await supabase
      .from("journey_notices")
      .select("text")
      .eq("user_id", userId);

    if (meetingsError || echoesError || noticesError) {
      console.error("Teemasid ei saanud avada.", {
        meetingsError,
        echoesError,
        noticesError,
      });

      setThemes([]);
      setLoading(false);
      return;
    }

    const meetings = (meetingsData || []) as MeetingRow[];
    const echoes = (echoesData || []) as EchoRow[];
    const notices = (noticesData || []) as JourneyNoticeRow[];

    const text = [
      ...meetings.map(
        (item) => `${item.question || ""} ${item.reflection || ""}`
      ),
      ...echoes.map((item) => `${item.question || ""} ${item.text || ""}`),
      ...notices.map((item) => item.text || ""),
    ]
      .join(" ")
      .toLowerCase();

    const calculatedThemes: ThemeItem[] = Object.entries(EXPECTUM_THEMES)
      .map(([name, keywords]) => {
        const matches: string[] = [];

        keywords.forEach((keyword) => {
          const keywordLower = keyword.toLowerCase();

          if (text.includes(keywordLower)) {
            matches.push(keyword);
          }
        });

        return {
          name: name.replaceAll("_", " "),
          count: matches.length,
          matches,
        };
      })
      .filter((theme) => theme.count > 0)
      .sort((a, b) => b.count - a.count);

    localStorage.setItem(
      EXPECTUM_STORAGE.detectedThemes,
      JSON.stringify(calculatedThemes)
    );

    setThemes(calculatedThemes);
    setLoading(false);
  }

  return (
    <ExpectumAuthGate>
      <ExpectumPage
        footerLinks={[
          { href: "/trajectory", label: "Suund", symbol: "direction" },
          { href: "/path", label: "Teekond", symbol: "path" },
          { href: "/settings", label: "Mälu", symbol: "memory" },
        ]}
      >
        <ExpectumSection
          symbol="theme"
          label="Teema"
          title="Mis kordumistes nähtavale tuleb?"
          intro="Teema ei ütle, kes inimene on. Ta aitab märgata, mis kohtumistes uuesti kõlama hakkab ja võib avada nähtavale tulnud suuna."
        >
          {loading ? (
            <ExpectumCard>Teema avanemine...</ExpectumCard>
          ) : themes.length === 0 ? (
            <ExpectumCard>
              Teemat ei ole veel piisavalt nähtavale tulnud.
            </ExpectumCard>
          ) : (
            <div className="space-y-8">
              {themes.map((theme) => (
                <ExpectumCard key={theme.name} label="Teema">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="mb-3 text-2xl font-light">{theme.name}</p>

                      <p className="text-sm leading-relaxed text-[#8a8278]">
                        See teema on kohtumiste jälgedes nähtavale tulnud.
                      </p>
                    </div>

                    <p className="text-sm uppercase tracking-[0.25em] text-[#b78a4a]">
                      {theme.count} märkamist
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    {theme.matches.map((match) => (
                      <span
                        key={match}
                        className="rounded-full border border-[#d8d1c7] px-4 py-2 text-sm text-[#6d655d]"
                      >
                        {match}
                      </span>
                    ))}
                  </div>
                </ExpectumCard>
              ))}
            </div>
          )}
        </ExpectumSection>
      </ExpectumPage>
    </ExpectumAuthGate>
  );
}