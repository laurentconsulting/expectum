"use client";

import { useEffect, useRef, useState } from "react";
import { EXPECTUM_STORAGE } from "@/lib/expectumStorage";
import { supabase } from "@/lib/supabaseClient";
import ExpectumPage from "@/components/ExpectumPage";
import ExpectumSymbol from "@/components/ExpectumSymbol";
import ExpectumAuthGate from "@/components/ExpectumAuthGate";

type StoredMessage = {
  role?: "user" | "assistant";
  text?: string;
  sessionId?: string;
  mode?: string;
  createdAt?: string;
};

type MeetingItem = {
  id: string;
  question: string | null;
  reflection: string | null;
  thread: StoredMessage[] | null;
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

type SessionItem = {
  sessionId: string;
  mode: string;
  createdAt?: string;
  messages: StoredMessage[];
};

export default function Journey() {
  const [journey, setJourney] = useState("");
  const [loading, setLoading] = useState(false);

  const [historyCount, setHistoryCount] = useState(0);
  const [kajaCount, setKajaCount] = useState(0);
  const [previousNoticesCount, setPreviousNoticesCount] = useState(0);

  const hasOpenedRef = useRef(false);

  async function openJourney() {
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      setJourney("Liikumise märkamiseks tuleb esmalt siseneda.");
      setLoading(false);
      return;
    }

    const userId = userData.user.id;

    const { data: meetingsData, error: meetingsError } = await supabase
      .from("meetings")
      .select("id, question, reflection, thread, mode, created_at")
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

    if (meetingsError || echoesError || noticesError) {
      console.error("Liikumise märkamise andmeid ei saanud avada.", {
        meetingsError,
        echoesError,
        noticesError,
      });

      setJourney(
        "Praegu ei saanud liikumise märkamist avada. Peatu hetkeks ja proovi uuesti."
      );
      setLoading(false);
      return;
    }

    const meetings = (meetingsData || []) as MeetingItem[];
    const echoes = (echoesData || []) as EchoItem[];
    const previousNotices = (noticesData || []) as JourneyNoticeItem[];

    setHistoryCount(meetings.length);
    setKajaCount(echoes.length);
    setPreviousNoticesCount(previousNotices.length);

    const sessionsMap = new Map<string, SessionItem>();

    meetings.forEach((item) => {
      const fallbackMessages: StoredMessage[] = [
        {
          role: "user",
          text: item.question || "",
          sessionId: item.id,
          mode: item.mode || "meeting",
          createdAt: item.created_at,
        },
        {
          role: "assistant",
          text: item.reflection || "",
          sessionId: item.id,
          mode: item.mode || "meeting",
          createdAt: item.created_at,
        },
      ];

      const messages =
        Array.isArray(item.thread) && item.thread.length > 0
          ? item.thread
          : fallbackMessages;

      messages.forEach((message) => {
        const sessionId = message.sessionId || item.id;

        if (!sessionsMap.has(sessionId)) {
          sessionsMap.set(sessionId, {
            sessionId,
            mode: message.mode || item.mode || "meeting",
            createdAt: message.createdAt || item.created_at,
            messages: [],
          });
        }

        sessionsMap.get(sessionId)?.messages.push(message);
      });
    });

    const sessions = Array.from(sessionsMap.values());

    if (meetings.length === 0 && echoes.length === 0) {
      setJourney("Liikumise märkamiseks ei ole veel piisavalt kohtumisi.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/journey", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          history: meetings,
          landmarks: echoes,
          sessions,
          previousReflections: previousNotices,
        }),
      });

      const data = await response.json();
      const text = data.journey || "";

      setJourney(text);
      localStorage.setItem(EXPECTUM_STORAGE.journey, text);

      const latestNotice = previousNotices[0];

      const alreadySaved =
        latestNotice &&
        latestNotice.text === text &&
        latestNotice.history_count === meetings.length &&
        latestNotice.echoes_count === echoes.length;

      if (!alreadySaved) {
        const { error } = await supabase.from("journey_notices").insert({
          user_id: userId,
          text,
          history_count: meetings.length,
          echoes_count: echoes.length,
          sessions_count: sessions.length,
          created_at: new Date().toISOString(),
        });

        if (error) {
          console.error("Liikumise märkamist ei saanud salvestada.", error);
        } else {
          setPreviousNoticesCount(previousNotices.length + 1);
        }
      } else {
        setPreviousNoticesCount(previousNotices.length);
      }
    } catch (error) {
      console.error(error);

      setJourney(
        "Praegu ei saanud liikumise märkamist avada. Peatu hetkeks ja proovi uuesti."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (hasOpenedRef.current) return;

    hasOpenedRef.current = true;
    openJourney();
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
            href: "/attunement-question",
            label: "Vaikne küsimus",
            symbol: "meeting",
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
            <ExpectumSymbol name="path" size="header" />
            <span>Liikumise märkamine</span>
          </p>

          <h1 className="mb-6 text-4xl font-light md:text-6xl">
            Mis on jälgedes nähtavale tulnud?
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-[#5f574f]">
            Liikumise märkamine vaatab kohtumisi, kaja ja varasemaid jälgi.
            Ta ei määra teekonda. Ta aitab märgata, mis on nähtaval.
          </p>

          <p className="mb-12 text-sm text-[#8a8278]">
            Kohtumised: {historyCount} · Kaja: {kajaCount} · Liikumise
            märkamised: {previousNoticesCount}
          </p>

          <div className="rounded-3xl border border-[#d7b985] bg-white/50 p-8 text-left text-lg leading-relaxed whitespace-pre-line text-[#4f4942]">
            {loading ? "Liikumise märkamine..." : journey}
          </div>

          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={openJourney}
              className="rounded-full border border-[#c9a36a] px-8 py-4 text-sm uppercase tracking-[0.25em] text-[#8b642f] transition hover:bg-[#efe2ce]"
            >
              Märka uuesti
            </button>
          </div>
        </section>
      </ExpectumPage>
    </ExpectumAuthGate>
  );
}