"use client";

import { useState } from "react";
import { EXPECTUM_STORAGE } from "@/lib/expectumStorage";
import ExpectumPage from "@/components/ExpectumPage";
import ExpectumSymbol from "@/components/ExpectumSymbol";

export default function Settings() {
  const [message, setMessage] = useState("");

  function clearMemory() {
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

    setMessage("Teekonna jäljed on puhastatud. Ruumi on jälle rohkem.");
  }

  return (
    <ExpectumPage
      footerLinks={[
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
          <a
            href="/history"
            className="rounded-3xl border border-[#d7b985] bg-white/45 p-6 text-left transition hover:bg-white/65"
          >
            <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[#b78a4a]">
              Kohtumised
            </p>
            <p className="text-[#5f574f]">
              Kohtumised ja nende jäljed.
            </p>
          </a>

          <a
            href="/landmarks"
            className="rounded-3xl border border-[#d7b985] bg-white/45 p-6 text-left transition hover:bg-white/65"
          >
            <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[#b78a4a]">
              Kaja
            </p>
            <p className="text-[#5f574f]">
              See, mis kohtumisest kõlama jäi.
            </p>
          </a>

          <a
            href="/timeline"
            className="rounded-3xl border border-[#d7b985] bg-white/45 p-6 text-left transition hover:bg-white/65"
          >
            <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[#b78a4a]">
              Liikumise ajajoon
            </p>
            <p className="text-[#5f574f]">
              Kohtumiste ja jälgede rahulik järjestus ajas.
            </p>
          </a>

          <a
            href="/journey-reflections"
            className="rounded-3xl border border-[#d7b985] bg-white/45 p-6 text-left transition hover:bg-white/65"
          >
            <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[#b78a4a]">
              Liikumise märkamised
            </p>
            <p className="text-[#5f574f]">
              Salvestatud märkamised sellest, mis liikumises nähtavale tuli.
            </p>
          </a>

          <a
            href="/trajectory-history"
            className="rounded-3xl border border-[#d7b985] bg-white/45 p-6 text-left transition hover:bg-white/65"
          >
            <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[#b78a4a]">
              Salvestatud suunad
            </p>
            <p className="text-[#5f574f]">
              Suunad, mida oled soovinud alles hoida.
            </p>
          </a>

          <a
            href="/shared-insights"
            className="rounded-3xl border border-[#d7b985] bg-white/45 p-6 text-left transition hover:bg-white/65"
          >
            <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[#b78a4a]">
              Jagatud kohtumised
            </p>
            <p className="text-[#5f574f]">
              Teiste poolt jagatud ja kinnitatud Kaja.
            </p>
          </a>

          <a
            href="/statistics"
            className="rounded-3xl border border-[#d7b985] bg-white/45 p-6 text-left transition hover:bg-white/65 md:col-span-2"
          >
            <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[#b78a4a]">
              Koond
            </p>
            <p className="text-[#5f574f]">
              Vaikne ülevaade sellest, mida Mälu hoiab.
            </p>
          </a>
        </div>

        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={clearMemory}
            className="rounded-full border border-[#d8d1c7] px-8 py-4 text-sm uppercase tracking-[0.25em] text-[#6d655d] transition hover:bg-[#f1ebe3]"
          >
            Puhasta mälu
          </button>
        </div>

        {message && <p className="mt-8 text-[#8b642f]">{message}</p>}
      </section>
    </ExpectumPage>
  );
}