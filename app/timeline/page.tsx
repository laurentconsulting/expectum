"use client";

import { useEffect, useState } from "react";
import ExpectumPage from "@/components/ExpectumPage";
import ExpectumSymbol from "@/components/ExpectumSymbol";
import ExpectumAuthGate from "@/components/ExpectumAuthGate";
import ExpectumCard from "@/components/ExpectumCard";
import { supabase } from "@/lib/supabaseClient";
import {
  getMeetingEncounterSummaries,
  type NormalizableThreadMessage,
} from "@/lib/expectumMemoryNormalize";

type TimelineItem = {
  type: "meeting" | "echo" | "notice" | "direction";
  title: string;
  text: string;
  createdAt: string;
};

type MeetingRow = {
  id: string;
  question: string | null;
  thread: NormalizableThreadMessage[] | null;
  mode: string | null;
  created_at: string;
};

type EchoRow = {
  id: string;
  text: string;
  created_at: string;
};

type NoticeRow = {
  id: string;
  text: string;
  created_at: string;
};

type DirectionRow = {
  id: string;
  text: string;
  created_at: string;
};

export default function Timeline() {
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTimeline();
  }, []);

  async function loadTimeline() {
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      setItems([]);
      setLoading(false);
      return;
    }

    const userId = userData.user.id;

    const { data: meetingsData, error: meetingsError } = await supabase
      .from("meetings")
      .select("id, question, thread, mode, created_at")
      .eq("user_id", userId);

    const { data: echoesData, error: echoesError } = await supabase
      .from("echoes")
      .select("id, text, created_at")
      .eq("user_id", userId);

    const { data: noticesData, error: noticesError } = await supabase
      .from("journey_notices")
      .select("id, text, created_at")
      .eq("user_id", userId);

    const { data: directionsData, error: directionsError } = await supabase
      .from("directions")
      .select("id, text, created_at")
      .eq("user_id", userId);

    if (meetingsError || echoesError || noticesError || directionsError) {
      console.error("Ajajoone jälgi ei saanud avada.", {
        meetingsError,
        echoesError,
        noticesError,
        directionsError,
      });

      setItems([]);
      setLoading(false);
      return;
    }

    const meetings = (meetingsData || []) as MeetingRow[];
    // Read-time only: cumulative meeting rows are grouped into encounter
    // summaries. Source records and non-meeting Timeline items stay unchanged.
    const meetingEncounters = getMeetingEncounterSummaries(meetings);
    const echoes = (echoesData || []) as EchoRow[];
    const notices = (noticesData || []) as NoticeRow[];
    const directions = (directionsData || []) as DirectionRow[];

    const timelineItems: TimelineItem[] = [
      ...meetingEncounters.map((item) => ({
        type: "meeting" as const,
        title: item.mode === "thought" ? "Mõttekohtumine" : "Kohtumine",
        text: item.text,
        createdAt: item.createdAt,
      })),

      ...echoes.map((item) => ({
        type: "echo" as const,
        title: "Kaja",
        text: item.text,
        createdAt: item.created_at,
      })),

      ...notices.map((item) => ({
        type: "notice" as const,
        title: "Liikumise märkamine",
        text: item.text,
        createdAt: item.created_at,
      })),

      ...directions.map((item) => ({
        type: "direction" as const,
        title: "Nähtavale tulnud suund",
        text: item.text,
        createdAt: item.created_at,
      })),
    ];

    const sorted = timelineItems.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    setItems(sorted);
    setLoading(false);
  }

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

          {loading ? (
            <ExpectumCard className="rounded-3xl border-[#d7b985] bg-white/45 p-8 backdrop-blur-none">
              Ajajoone jälgede avamine...
            </ExpectumCard>
          ) : items.length === 0 ? (
            <ExpectumCard className="rounded-3xl border-[#d7b985] bg-white/45 p-8 backdrop-blur-none">
              Ajajoone jaoks ei ole veel piisavalt jälgi.
            </ExpectumCard>
          ) : (
            <div className="space-y-8 text-left">
              {items.map((item, index) => (
                <ExpectumCard
                  key={`${item.createdAt}-${item.type}-${index}`}
                  className="rounded-3xl border-[#d7b985] bg-white/45 p-8 backdrop-blur-none"
                  contentClassName="leading-relaxed"
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
                </ExpectumCard>
              ))}
            </div>
          )}
        </section>
      </ExpectumPage>
    </ExpectumAuthGate>
  );
}
