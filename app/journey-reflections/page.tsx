"use client";

import { useEffect, useState } from "react";
import ExpectumPage from "@/components/ExpectumPage";
import ExpectumSymbol from "@/components/ExpectumSymbol";
import ExpectumAuthGate from "@/components/ExpectumAuthGate";
import { supabase } from "@/lib/supabaseClient";

type JourneyNotice = {
  id: string;
  text: string;
  history_count: number | null;
  echoes_count: number | null;
  sessions_count: number | null;
  created_at: string;
};

export default function JourneyReflections() {
  const [notices, setNotices] = useState<JourneyNotice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotices();
  }, []);

  async function loadNotices() {
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      setNotices([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("journey_notices")
      .select("id, text, history_count, echoes_count, sessions_count, created_at")
      .eq("user_id", userData.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Liikumise märkamisi ei saanud avada.", error);
      setNotices([]);
      setLoading(false);
      return;
    }

    setNotices((data || []) as JourneyNotice[]);
    setLoading(false);
  }

  async function clearNotices() {
    const confirmed = window.confirm(
      "Kas soovid salvestatud liikumise märkamised puhastada?"
    );

    if (!confirmed) return;

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) return;

    const { error } = await supabase
      .from("journey_notices")
      .delete()
      .eq("user_id", userData.user.id);

    if (error) {
      console.error("Liikumise märkamisi ei saanud puhastada.", error);
      return;
    }

    setNotices([]);
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
            href: "/settings",
            label: "Mälu",
            symbol: "memory",
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
            <span>Mälu</span>
          </p>

          <h1 className="mb-12 text-4xl font-light md:text-6xl">
            Liikumise märkamised
          </h1>

          {loading ? (
            <div className="rounded-3xl border border-[#d7b985] bg-white/45 p-8 text-left">
              Liikumise märkamiste avamine...
            </div>
          ) : notices.length === 0 ? (
            <div className="rounded-3xl border border-[#d7b985] bg-white/45 p-8 text-left">
              Liikumise märkamisi ei ole veel salvestatud.
            </div>
          ) : (
            <div className="space-y-10 text-left">
              {notices.map((item) => (
                <div
                  key={item.id}
                  className="rounded-3xl border border-[#d7b985] bg-white/45 p-8"
                >
                  <p className="mb-6 text-sm text-[#8a8278]">
                    {new Date(item.created_at).toLocaleDateString("et-EE")}
                  </p>

                  <p className="whitespace-pre-line text-lg leading-relaxed text-[#4f4942]">
                    {item.text}
                  </p>

                  <p className="mt-6 text-sm text-[#8a8278]">
                    Kohtumised: {item.history_count || 0} · Salvestatud kaja:{" "}
                    {item.echoes_count || 0}
                    {typeof item.sessions_count === "number"
                      ? ` · Kohtumisi eraldi: ${item.sessions_count}`
                      : ""}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={clearNotices}
              className="rounded-full border border-[#d8d1c7] px-8 py-4 text-sm uppercase tracking-[0.25em] text-[#6d655d] transition hover:bg-[#f1ebe3]"
            >
              Puhasta salvestatud märkamised
            </button>
          </div>
        </section>
      </ExpectumPage>
    </ExpectumAuthGate>
  );
}