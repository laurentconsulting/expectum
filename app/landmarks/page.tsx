"use client";

import { useEffect, useState } from "react";
import ExpectumPage from "@/components/ExpectumPage";
import ExpectumSymbol from "@/components/ExpectumSymbol";
import ExpectumAuthGate from "@/components/ExpectumAuthGate";
import { supabase } from "@/lib/supabaseClient";

type Echo = {
  id: string;
  text: string;
  question: string | null;
  created_at: string;
};

export default function Landmarks() {
  const [echoes, setEchoes] = useState<Echo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEchoes();
  }, []);

  async function loadEchoes() {
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      setEchoes([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("echoes")
      .select("id, text, question, created_at")
      .eq("user_id", userData.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Kaja ei saanud Supabase'ist avada.", error);
      setEchoes([]);
      setLoading(false);
      return;
    }

    setEchoes((data || []) as Echo[]);
    setLoading(false);
  }

  async function removeEcho(id: string) {
    const confirmed = window.confirm("Kas soovid selle kaja eemaldada?");

    if (!confirmed) return;

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) return;

    const { error } = await supabase
      .from("echoes")
      .delete()
      .eq("id", id)
      .eq("user_id", userData.user.id);

    if (error) {
      console.error("Kaja ei saanud Supabase'is eemaldada.", error);
      return;
    }

    setEchoes((current) => current.filter((item) => item.id !== id));
  }

  return (
    <ExpectumAuthGate>
      <ExpectumPage
        footerLinks={[
          {
            href: "/history",
            label: "Kohtumised",
            symbol: "meeting",
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
            <ExpectumSymbol name="echo" size="header" />
            <span>Kaja</span>
          </p>

          <h1 className="mb-12 text-4xl font-light md:text-6xl">
            Minu kaja
          </h1>

          {loading ? (
            <div className="rounded-3xl border border-[#d7b985] bg-white/45 p-8 text-left">
              Kaja avanemine...
            </div>
          ) : echoes.length === 0 ? (
            <div className="rounded-3xl border border-[#d7b985] bg-white/45 p-8 text-left">
              Ühtegi kaja ei ole veel salvestatud.
            </div>
          ) : (
            <div className="space-y-8 text-left">
              {echoes.map((item) => (
                <div
                  key={item.id}
                  className="rounded-3xl border border-[#d7b985] bg-white/45 p-8"
                >
                  <p className="mb-6 text-xl leading-relaxed">
                    {item.text}
                  </p>

                  <p className="mb-6 text-sm text-[#6d655d]">
                    {new Date(item.created_at).toLocaleDateString("et-EE")}
                  </p>

                  {item.question && (
                    <details>
                      <summary className="cursor-pointer">
                        Algne küsimus
                      </summary>

                      <p className="mt-4 text-[#5f574f]">
                        {item.question}
                      </p>
                    </details>
                  )}

                  <button
                    type="button"
                    onClick={() => removeEcho(item.id)}
                    className="mt-6 rounded-full border border-[#d8d1c7] px-6 py-3 text-sm uppercase tracking-[0.25em] text-[#6d655d] transition hover:bg-[#f1ebe3]"
                  >
                    Eemalda kaja
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </ExpectumPage>
    </ExpectumAuthGate>
  );
}