"use client";

import { useEffect, useState } from "react";
import { EXPECTUM_STORAGE } from "@/lib/expectumStorage";
import { supabase } from "@/lib/supabaseClient";
import ExpectumPage from "@/components/ExpectumPage";
import ExpectumSymbol from "@/components/ExpectumSymbol";
import ExpectumAuthGate from "@/components/ExpectumAuthGate";

type MeetingRow = {
  id: string;
  question: string | null;
  reflection: string | null;
  thread: unknown[] | null;
  mode: string | null;
  created_at: string;
};

type EchoRow = {
  id: string;
  text: string;
  question: string | null;
  created_at: string;
};

type JourneyNoticeRow = {
  id: string;
  text: string;
  created_at: string;
};

export default function AttunementQuestion() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(true);

  async function openQuestion() {
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      setQuestion("Mis vajab praegu rohkem vaikust kui vastust?");
      setLoading(false);
      return;
    }

    const userId = userData.user.id;

    const { data: meetingsData, error: meetingsError } = await supabase
      .from("meetings")
      .select("id, question, reflection, thread, mode, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10);

    const { data: echoesData, error: echoesError } = await supabase
      .from("echoes")
      .select("id, text, question, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10);

    const { data: noticesData, error: noticesError } = await supabase
      .from("journey_notices")
      .select("id, text, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1);

    if (meetingsError || echoesError || noticesError) {
      console.error("Vaikse küsimuse andmeid ei saanud avada.", {
        meetingsError,
        echoesError,
        noticesError,
      });

      setQuestion("Mis vajab praegu rohkem vaikust kui vastust?");
      setLoading(false);
      return;
    }

    const history = (meetingsData || []) as MeetingRow[];
    const landmarks = (echoesData || []) as EchoRow[];
    const latestJourney = ((noticesData || []) as JourneyNoticeRow[])[0];

    try {
      const response = await fetch("/api/attunement-question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          history,
          landmarks,
          journey: latestJourney?.text || "",
        }),
      });

      const data = await response.json();
      setQuestion(data.question || "Mis vajab praegu rohkem vaikust kui vastust?");
    } catch (error) {
      console.error(error);
      setQuestion("Mis vajab praegu rohkem vaikust kui vastust?");
    } finally {
      setLoading(false);
    }
  }

  function useThisQuestion() {
    localStorage.setItem(EXPECTUM_STORAGE.question, question);
    localStorage.setItem(EXPECTUM_STORAGE.reflectionPending, "true");

    window.location.href = "/reflection";
  }

  useEffect(() => {
    openQuestion();
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
        <section className="mx-auto w-full max-w-3xl text-center">
          <p className="mb-10 inline-flex items-center justify-center gap-3 text-xs uppercase tracking-[0.4em] text-[#b78a4a]">
            <ExpectumSymbol name="meeting" size="header" />
            <span>Vaikne küsimus</span>
          </p>

          <h1 className="mb-12 text-4xl font-light leading-tight md:text-6xl">
            Mis vajab praegu rohkem vaikust kui vastust?
          </h1>

          <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-[#5f574f]">
            Vaikne küsimus ei sunni edasi. Ta võib aidata märgata,
            kus kohtumine vajab veel ruumi.
          </p>

          <div className="rounded-3xl border border-[#d7b985] bg-white/50 p-8 text-left text-2xl leading-relaxed text-[#4f4942]">
            {loading ? "Vaikse küsimuse avanemine..." : question}
          </div>

          <div className="mt-12 flex flex-col justify-center gap-4 md:flex-row">
            <button
              type="button"
              onClick={openQuestion}
              className="rounded-full border border-[#d8d1c7] px-8 py-4 text-sm uppercase tracking-[0.25em] text-[#6d655d] transition hover:bg-[#f1ebe3]"
            >
              Ava uus küsimus
            </button>

            <button
              type="button"
              onClick={useThisQuestion}
              className="rounded-full border border-[#c9a36a] px-8 py-4 text-sm uppercase tracking-[0.25em] text-[#8b642f] transition hover:bg-[#efe2ce]"
            >
              Vii kohtumisse
            </button>
          </div>

          <p className="mt-20 text-sm text-[#8a8278]">
            Küsimus võib olla ka kutse vaikusele.
          </p>
        </section>
      </ExpectumPage>
    </ExpectumAuthGate>
  );
}