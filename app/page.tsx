"use client";

import { useEffect, useState } from "react";
import ExpectumPage from "@/components/ExpectumPage";
import ExpectumSection from "@/components/ExpectumSection";
import ExpectumMemoryCard from "@/components/ExpectumMemoryCard";
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
          label: "Tutvu Expectumiga",
          symbol: "aim",
        },
        {
          href: "/expectum-language",
          label: "Keel",
          symbol: "theme",
        },
        {
          href: "/symbols",
          label: "Sümbolid",
          symbol: "echo",
        },
      ]}
    >
      <ExpectumSection
        symbol="aim"
        label="Expectum"
        title="Sa ei pea siin kiirustama."
        intro="Expectum on kohtumise ruum."
        className="max-w-5xl"
      >
        <ExpectumMemoryCard className="mx-auto mb-14 max-w-2xl">
          Siin võib avaneda küsimus.
          <br />
          Siin võib jääda kõlama Kaja.
          <br />
          Siin võib nähtavale tulla Suund.
          <br />
          Aim ei määra tähendust. Ta hoiab ruumi kohtumisele.
        </ExpectumMemoryCard>

        <div className="flex flex-col flex-wrap justify-center gap-4 md:flex-row">
          {signedIn ? (
            <>
              <ExpectumButton href="/attunement">
                Ava kohtumine
              </ExpectumButton>

              <ExpectumButton href="/question?mode=exploration">
                Ava avardamine
              </ExpectumButton>

              <ExpectumButton href="/path" variant="soft">
                Vaata teekonda
              </ExpectumButton>
            </>
          ) : (
            <>
              <ExpectumButton href="/enter">
                Ava kohtumine
              </ExpectumButton>

              <ExpectumButton href="/enter" variant="soft">
                Sisene
              </ExpectumButton>
            </>
          )}
        </div>

        <ExpectumMemoryCard className="mx-auto mt-20 max-w-xl border-transparent bg-transparent px-0 py-0 shadow-none">
          Alustada võib sellest, mis Sind puudutab.
        </ExpectumMemoryCard>
      </ExpectumSection>
    </ExpectumPage>
  );
}