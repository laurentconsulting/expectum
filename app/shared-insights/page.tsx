"use client";

import { useEffect, useState } from "react";
import ExpectumPage from "@/components/ExpectumPage";
import ExpectumSymbol from "@/components/ExpectumSymbol";
import ExpectumAuthGate from "@/components/ExpectumAuthGate";

type SharedInsight = {
  id: string;
  text: string;
  question: string;
  created_at: string;
  question_count?: number;
};

export default function SharedInsights() {
  const [insights, setInsights] = useState<SharedInsight[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadInsights() {
    setLoading(true);

    try {
      const response = await fetch("/api/shared-insights");
      const data = await response.json();

      setInsights(data.insights || []);
    } catch (error) {
      console.error(error);
      setInsights([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInsights();
  }, []);

  return (
    <ExpectumAuthGate>
      <ExpectumPage
        footerLinks={[
          {
            href: "/settings",
            label: "Mälu",
            symbol: "memory",
          },
          {
            href: "/expectum",
            label: "Expectum",
            symbol: "aim",
          },
        ]}
      >
        <section className="mx-auto max-w-4xl text-center">
          <p className="mb-10 inline-flex items-center justify-center gap-3 text-xs uppercase tracking-[0.4em] text-[#b78a4a]">
            <ExpectumSymbol name="echo" size="header" />
            <span>Jagatud Kaja</span>
          </p>

          <h1 className="mb-6 text-4xl font-light md:text-6xl">
            Kaja ühises ruumis
          </h1>

          <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-[#5f574f]">
            Siin on Kaja, mille osaline on lubanud ühisesse ruumi liikuda.
            Kaja ei ava inimese lugu. Ta võib aidata märgata, mis kohtumistes
            kõlama jääb.
          </p>

          {loading ? (
            <div className="rounded-3xl border border-[#d7b985] bg-white/45 p-8 text-left">
              Jagatud Kaja avanemine...
            </div>
          ) : insights.length === 0 ? (
            <div className="rounded-3xl border border-[#d7b985] bg-white/45 p-8 text-left">
              Ühtegi Kaja ei ole veel ühises ruumis nähtaval.
            </div>
          ) : (
            <div className="space-y-8 text-left">
              {insights.map((item) => (
                <div
                  key={item.id}
                  className="rounded-3xl border border-[#d7b985] bg-white/45 p-8"
                >
                  <p className="mb-3 text-sm text-[#8a8278]">
                    {new Date(item.created_at).toLocaleDateString("et-EE")}
                  </p>

                  <p className="mb-8 text-sm text-[#8a8278]">
                    Nähtavale tulnud {item.question_count || 1} küsimuse jooksul
                  </p>

                  <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[#b78a4a]">
                    Küsimus
                  </p>

                  <p className="mb-8 text-lg leading-relaxed">
                    {item.question}
                  </p>

                  <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[#b78a4a]">
                    Kaja
                  </p>

                  <p className="whitespace-pre-line text-xl leading-relaxed text-[#4f4942]">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </ExpectumPage>
    </ExpectumAuthGate>
  );
}