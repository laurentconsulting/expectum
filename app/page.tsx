"use client";

import { useEffect, useState } from "react";
import ExpectumPage from "@/components/ExpectumPage";
import ExpectumSymbol from "@/components/ExpectumSymbol";
import ExpectumButton from "@/components/ExpectumButton";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    async function checkUser() {
      const { data } = await supabase.auth.getUser();
      setSignedIn(!!data.user);
    }

    checkUser();
  }, []);

  return (
    <ExpectumPage
      footerLinks={[
        {
          href: "/expectum",
          label: "Expectum",
          symbol: "aim",
        },
      ]}
    >
      <section className="mx-auto flex min-h-full max-w-5xl flex-col items-center justify-center text-center">
        <p className="expectum-arrival-step expectum-arrival-delay-1 mb-10 inline-flex items-center justify-center gap-3 text-xs uppercase tracking-[0.4em] text-[#b78a4a]">
          <ExpectumSymbol name="aim" size="header" />
          <span>Expectum</span>
        </p>

        <h1 className="expectum-arrival-step expectum-arrival-delay-2 mb-8 text-5xl font-light leading-tight md:text-7xl">
          Sa ei pea siin kiirustama.
        </h1>

        <p className="expectum-arrival-step expectum-arrival-delay-3 mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-[#5f574f] md:text-2xl">
          Expectum on kohtumise ruum.
        </p>

        <p className="mx-auto mb-14 max-w-2xl text-base leading-relaxed text-[#6d655d] md:text-lg">
          <span className="expectum-arrival-step expectum-arrival-delay-4 block">
            Siin võib avaneda küsimus.
          </span>
          <span className="expectum-arrival-step expectum-arrival-delay-5 block">
            Siin võib jääda kõlama Kaja.
          </span>
          <span className="expectum-arrival-step expectum-arrival-delay-6 block">
            Siin võib nähtavale tulla Suund.
          </span>
          <span className="expectum-arrival-step expectum-arrival-delay-7 block">
            Aim ei määra tähendust. Ta hoiab ruumi kohtumisele.
          </span>
        </p>

        {signedIn && (
          <div className="flex flex-col flex-wrap justify-center gap-4 md:flex-row">
            <ExpectumButton href="/attunement">
              Ava kohtumine
            </ExpectumButton>

            <ExpectumButton href="/question?mode=exploration">
              Ava avardamine
            </ExpectumButton>

            <ExpectumButton href="/path" variant="soft">
              Vaata teekonda
            </ExpectumButton>
          </div>
        )}

        <p className="mt-20 text-sm text-[#8a8278]">
          Alustada võib sellest, mis Sind puudutab.
        </p>
      </section>
    </ExpectumPage>
  );
}
