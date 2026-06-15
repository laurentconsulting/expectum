"use client";

import { useEffect, useState } from "react";
import ExpectumPage from "@/components/ExpectumPage";
import ExpectumAuthGate from "@/components/ExpectumAuthGate";
import ExpectumMemoryCard from "@/components/ExpectumCard";
import ExpectumSection from "@/components/ExpectumSection";
import ExpectumButton from "@/components/ExpectumButton";
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
        <ExpectumSection symbol="echo" label="Kaja" title="Minu kaja">
          {loading ? (
            <ExpectumMemoryCard className="border-[#d7b985] bg-white/45 p-8">
              Kaja avanemine...
            </ExpectumMemoryCard>
          ) : echoes.length === 0 ? (
            <ExpectumMemoryCard className="border-[#d7b985] bg-white/45 p-8">
              Ühtegi kaja ei ole veel salvestatud.
            </ExpectumMemoryCard>
          ) : (
            <div className="space-y-8 text-left">
              {echoes.map((item) => (
                <ExpectumMemoryCard
                  key={item.id}
                  className="border-[#d7b985] bg-white/45 p-8"
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

                  <ExpectumButton
                    type="button"
                    onClick={() => removeEcho(item.id)}
                    variant="soft"
                    className="mt-6 px-6 py-3"
                  >
                    Eemalda kaja
                  </ExpectumButton>
                </ExpectumMemoryCard>
              ))}
            </div>
          )}
        </ExpectumSection>
      </ExpectumPage>
    </ExpectumAuthGate>
  );
}