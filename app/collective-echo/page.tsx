"use client";

import { useEffect, useState } from "react";
import ExpectumPage from "@/components/ExpectumPage";
import ExpectumCard from "@/components/ExpectumCard";
import ExpectumSection from "@/components/ExpectumSection";

type CollectiveEchoTheme = {
  word: string;
  count: number;
};

type CollectiveEchoItem = {
  id: string;
  question: string;
  text: string;
  created_at: string;
};

export default function CollectiveEcho() {
  const [themes, setThemes] = useState<CollectiveEchoTheme[]>([]);
  const [echoes, setEchoes] = useState<CollectiveEchoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCollectiveEcho();
  }, []);

  async function loadCollectiveEcho() {
    setLoading(true);

    try {
      const response = await fetch("/api/collective-echo");
      const data = await response.json();

      setThemes(data.themes || []);
      setEchoes(data.echoes || []);
    } catch (error) {
      console.error(error);
      setThemes([]);
      setEchoes([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ExpectumPage
      footerLinks={[
        {
          href: "/shared-insights",
          label: "Jagatud Kaja",
          symbol: "echo",
        },
        {
          href: "/aim-memory",
          label: "Aim Mälu",
          symbol: "memory",
        },
        {
          href: "/expectum",
          label: "Expectum",
          symbol: "aim",
        },
      ]}
    >
      <ExpectumSection
        symbol="echo"
        label="Ühine Kaja"
        title="Mida ühises ruumis märgatakse?"
        intro="Ühine Kaja ei ava inimeste lugusid. Ta hoiab märkamisi, mille osalised on lubanud ühisesse ruumi liikuda."
      >
        {loading ? (
          <ExpectumCard>Ühise Kaja avanemine...</ExpectumCard>
        ) : (
          <div className="space-y-8">
            <ExpectumCard label="Korduvad märkamised">
              {themes.length === 0 ? (
                <p>
                  Korduvaid märkamisi ei ole veel piisavalt nähtavale tulnud.
                </p>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {themes.map((theme) => (
                    <span
                      key={theme.word}
                      className="rounded-full border border-[#d8d1c7] px-4 py-2 text-sm text-[#6d655d]"
                    >
                      {theme.word} · {theme.count}
                    </span>
                  ))}
                </div>
              )}
            </ExpectumCard>

            {echoes.length === 0 ? (
              <ExpectumCard>
                Ühtegi kinnitatud Kaja ei ole veel ühises ruumis nähtaval.
              </ExpectumCard>
            ) : (
              echoes.map((item) => (
                <ExpectumCard key={item.id} label="Kaja ühises ruumis">
                  <p className="mb-4 text-sm text-[#8a8278]">
                    {new Date(item.created_at).toLocaleDateString("et-EE")}
                  </p>

                  <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[#b78a4a]">
                    Küsimus
                  </p>

                  <p className="mb-8">{item.question}</p>

                  <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[#b78a4a]">
                    Kaja
                  </p>

                  <p className="whitespace-pre-line text-xl leading-relaxed">
                    {item.text}
                  </p>
                </ExpectumCard>
              ))
            )}
          </div>
        )}
      </ExpectumSection>
    </ExpectumPage>
  );
}