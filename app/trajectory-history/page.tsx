"use client";

import { useEffect, useState } from "react";
import ExpectumPage from "@/components/ExpectumPage";
import ExpectumSymbol from "@/components/ExpectumSymbol";
import ExpectumAuthGate from "@/components/ExpectumAuthGate";
import { supabase } from "@/lib/supabaseClient";

type DirectionItem = {
  id: string;
  text: string;
  created_at: string;
};

export default function TrajectoryHistory() {
  const [items, setItems] = useState<DirectionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      setItems([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("directions")
      .select("id, text, created_at")
      .eq("user_id", userData.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Hoitud suundi ei saanud avada.", error);
      setItems([]);
      setLoading(false);
      return;
    }

    setItems((data || []) as DirectionItem[]);
    setLoading(false);
  }

  async function removeItem(id: string) {
    const confirmed = window.confirm(
      "Kas soovid selle hoitud suuna puhastada?"
    );

    if (!confirmed) return;

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) return;

    const { error } = await supabase
      .from("directions")
      .delete()
      .eq("id", id)
      .eq("user_id", userData.user.id);

    if (error) {
      console.error("Hoitud suunda ei saanud puhastada.", error);
      return;
    }

    setItems((current) => current.filter((item) => item.id !== id));
  }

  async function clearHistory() {
    const confirmed = window.confirm(
      "Kas soovid kõik hoitud suunad puhastada?"
    );

    if (!confirmed) return;

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) return;

    const { error } = await supabase
      .from("directions")
      .delete()
      .eq("user_id", userData.user.id);

    if (error) {
      console.error("Hoitud suundi ei saanud puhastada.", error);
      return;
    }

    setItems([]);
  }

  return (
    <ExpectumAuthGate>
      <ExpectumPage
        footerLinks={[
          {
            href: "/trajectory",
            label: "Suund",
            symbol: "direction",
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
            <ExpectumSymbol name="direction" size="header" />
            <span>Hoitud suunad</span>
          </p>

          <h1 className="mb-6 text-4xl font-light md:text-6xl">
            Hoitud suunad
          </h1>

          <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-[#5f574f]">
            Siin on suunad, mida oled soovinud teekonnal alles hoida.
          </p>

          {loading ? (
            <div className="rounded-3xl border border-[#d7b985] bg-white/45 p-8 text-left">
              Hoitud suundade avamine...
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-3xl border border-[#d7b985] bg-white/45 p-8 text-left">
              Ühtegi hoitud suunda ei ole veel.
            </div>
          ) : (
            <div className="space-y-8 text-left">
              {items.map((item) => (
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

                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="mt-8 rounded-full border border-[#d8d1c7] px-6 py-3 text-sm uppercase tracking-[0.25em] text-[#6d655d] transition hover:bg-[#f1ebe3]"
                  >
                    Puhasta suund
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={clearHistory}
              className="rounded-full border border-[#d8d1c7] px-8 py-4 text-sm uppercase tracking-[0.25em] text-[#6d655d] transition hover:bg-[#f1ebe3]"
            >
              Puhasta hoitud suunad
            </button>
          </div>
        </section>
      </ExpectumPage>
    </ExpectumAuthGate>
  );
}