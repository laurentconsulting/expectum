"use client";

import { useEffect, useState } from "react";
import ExpectumPage from "@/components/ExpectumPage";
import ExpectumAuthGate from "@/components/ExpectumAuthGate";
import ExpectumCard from "@/components/ExpectumCard";
import ExpectumSection from "@/components/ExpectumSection";

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
          { href: "/settings", label: "Mälu", symbol: "memory" },
          { href: "/expectum", label: "Expectum", symbol: "aim" },
        ]}
      >
        <ExpectumSection
          symbol="echo"
          label="Jagatud Kaja"
          title="Kaja ühises ruumis"
          intro="Siin on Kaja, mille osaline on lubanud ühisesse ruumi liikuda. Kaja ei ava inimese lugu. Ta võib aidata märgata, mis kohtumistes kõlama jääb."
        >
          {loading ? (
            <ExpectumCard>Jagatud Kaja avanemine...</ExpectumCard>
          ) : insights.length === 0 ? (
            <ExpectumCard>
              Ühtegi Kaja ei ole veel ühises ruumis nähtaval.
            </ExpectumCard>
          ) : (
            <div className="space-y-8">
              {insights.map((item) => (
                <ExpectumCard key={item.id} label="Jagatud Kaja">
                  <p className="mb-3 text-sm text-[#8a8278]">
                    {new Date(item.created_at).toLocaleDateString("et-EE")}
                  </p>

                  <p className="mb-8 text-sm text-[#8a8278]">
                    Nähtavale tulnud {item.question_count || 1} küsimuse jooksul
                  </p>

                  <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[#b78a4a]">
                    Küsimus
                  </p>

                  <p className="mb-8">{item.question}</p>

                  <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[#b78a4a]">
                    Kaja
                  </p>

                  <p className="text-xl leading-relaxed">{item.text}</p>
                </ExpectumCard>
              ))}
            </div>
          )}
        </ExpectumSection>
      </ExpectumPage>
    </ExpectumAuthGate>
  );
}