"use client";

import { useState } from "react";
import { EXPECTUM_STORAGE } from "@/lib/expectumStorage";
import { supabase } from "@/lib/supabaseClient";
import ExpectumPage from "@/components/ExpectumPage";
import ExpectumSymbol from "@/components/ExpectumSymbol";
import ExpectumAuthGate from "@/components/ExpectumAuthGate";

export default function Settings() {
  const [message, setMessage] = useState("");
  const [clearing, setClearing] = useState(false);

  function clearLocalMemory() {
    localStorage.removeItem(EXPECTUM_STORAGE.question);
    localStorage.removeItem(EXPECTUM_STORAGE.questionCount);
    localStorage.removeItem(EXPECTUM_STORAGE.thread);
    localStorage.removeItem(EXPECTUM_STORAGE.history);
    localStorage.removeItem(EXPECTUM_STORAGE.landmarks);
    localStorage.removeItem(EXPECTUM_STORAGE.journey);
    localStorage.removeItem(EXPECTUM_STORAGE.journeyReflections);
    localStorage.removeItem(EXPECTUM_STORAGE.trajectory);
    localStorage.removeItem(EXPECTUM_STORAGE.trajectoryHistory);
    localStorage.removeItem(EXPECTUM_STORAGE.detectedThemes);
    localStorage.removeItem(EXPECTUM_STORAGE.sharedInsights);
    localStorage.removeItem(EXPECTUM_STORAGE.reflectionPending);
    localStorage.removeItem(EXPECTUM_STORAGE.currentSession);
    localStorage.removeItem(EXPECTUM_STORAGE.reflectionMode);
  }

  async function clearMemory() {
    const confirmed = window.confirm(
      "Kas soovid teekonna jäljed puhastada? See puhastab sinu kohtumised, kaja, liikumise märkamised ja hoitud suunad."
    );

    if (!confirmed) return;

    setClearing(true);
    setMessage("");

    const { data: userData } = await supabase.auth.getUser();

    if (userData.user) {
      const userId = userData.user.id;

      const results = await Promise.all([
        supabase.from("directions").delete().eq("user_id", userId),
        supabase.from("journey_notices").delete().eq("user_id", userId),
        supabase.from("echoes").delete().eq("user_id", userId),
        supabase.from("meetings").delete().eq("user_id", userId),
      ]);

      const hasError = results.some((result) => result.error);

      if (hasError) {
        console.error("Mälu puhastamisel tekkis tõrge.", results);
        setMessage(
          "Kõiki jälgi ei saanud praegu puhastada. Peatu hetkeks ja proovi uuesti."
        );
        setClearing(false);
        return;
      }
    }

    clearLocalMemory();

    setMessage("Teekonna jäljed on puhastatud. Ruumi on jälle rohkem.");
    setClearing(false);
  }

  const memoryLinks = [
    {
      href: "/history",
      title: "Kohtumised",
      text: "Kohtumised ja nende jäljed.",
    },
    {
      href: "/landmarks",
      title: "Kaja",
      text: "See, mis kohtumisest kõlama jäi.",
    },
    {
      href: "/timeline",
      title: "Liikumise ajajoon",
      text: "Kohtumiste ja jälgede rahulik järjestus ajas.",
    },
    {
      href: "/journey-reflections",
      title: "Liikumise märkamised",
      text: "Salvestatud märkamised sellest, mis liikumises nähtavale tuli.",
    },
    {
      href: "/themes",
      title: "Teema",
      text: "See, mis võib kordumistes nähtavale tulla.",
    },
    {
      href: "/trajectory-history",
      title: "Salvestatud suunad",
      text: "Suunad, mida oled soovinud alles hoida.",
    },
    {
      href: "/shared-insights",
      title: "Jagatud Kaja",
      text: "Kaja, mille osaline on lubanud ühisesse ruumi liikuda.",
    },
    {
      href: "/statistics",
      title: "Koond",
      text: "Vaikne ülevaade sellest, mida Mälu hoiab.",
      wide: true,
    },
  ];

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
            label: "Expectum",
            symbol: "aim",
          },
        ]}
      >
        <section className="mx-auto w-full max-w-4xl text-center">
          <p className="mb-10 inline-flex items-center justify-center gap-3 text-xs uppercase tracking-[0.4em] text-[#b78a4a]">
            <ExpectumSymbol name="memory" size="header" />
            <span>Mälu</span>
          </p>

          <h1 className="mb-10 text-4xl font-light leading-tight md:text-6xl">
            Mälu hoiab jälgi.
          </h1>

          <div className="rounded-3xl border border-[#d7b985] bg-white/45 p-8 text-left text-lg leading-relaxed text-[#4f4942]">
            <p className="mb-6">Expectum ei asenda inimese sisemist tööd.</p>

            <p className="mb-6">
              Ta loob ruumi, kus inimene saab seda tööd ise teha.
            </p>

            <p className="mb-6">
              Mälu aitab hoida kohtumiste ja teekonna järjepidevust.
            </p>

            <p>
              Ta võib aidata märkama liikumist.
              <br />
              Ta ei määra selle tähendust.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {memoryLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`rounded-3xl border border-[#d7b985] bg-white/45 p-6 text-left transition hover:bg-white/65 ${
                  item.wide ? "md:col-span-2" : ""
                }`}
              >
                <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[#b78a4a]">
                  {item.title}
                </p>

                <p className="text-[#5f574f]">{item.text}</p>
              </a>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={clearMemory}
              disabled={clearing}
              className="rounded-full border border-[#d8d1c7] px-8 py-4 text-sm uppercase tracking-[0.25em] text-[#6d655d] transition hover:bg-[#f1ebe3] disabled:opacity-50"
            >
              {clearing ? "Mälu puhastamine..." : "Puhasta mälu"}
            </button>
          </div>

          {message && <p className="mt-8 text-[#8b642f]">{message}</p>}
        </section>
      </ExpectumPage>
    </ExpectumAuthGate>
  );
}