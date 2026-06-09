"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ExpectumPage from "@/components/ExpectumPage";
import ExpectumSymbol from "@/components/ExpectumSymbol";
import { supabase } from "@/lib/supabaseClient";

function EnterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [mode, setMode] = useState<"enter" | "create">("enter");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("mode") === "create") {
      setMode("create");
    }
  }, [searchParams]);

  async function enter() {
    if (!email.trim() || !password.trim()) {
      setMessage("Ava kohtumine vajab e-posti ja salasõna.");
      return;
    }

    setLoading(true);
    setMessage("");

    const result =
      mode === "enter"
        ? await supabase.auth.signInWithPassword({
            email,
            password,
          })
        : await supabase.auth.signUp({
            email,
            password,
          });

    if (result.error) {
      setMessage(result.error.message);
      setLoading(false);
      return;
    }

    const user = result.data.user;

    if (user) {
      await supabase.from("profiles").upsert({
        id: user.id,
        email: user.email,
      });
    }

    setLoading(false);

    if (mode === "create") {
      setMessage(
        "Oled saanud osaliseks. Kui e-posti kinnitamine on sisse lülitatud, kinnita kiri ja ava kohtumine seejärel uuesti."
      );
      return;
    }

    router.push("/attunement");
  }

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
      <section className="mx-auto w-full max-w-3xl text-center">
        <p className="mb-10 inline-flex items-center justify-center gap-3 text-xs uppercase tracking-[0.4em] text-[#b78a4a]">
          <ExpectumSymbol name="meeting" size="header" />
          <span>Osalemine</span>
        </p>

        <h1 className="mb-8 text-4xl font-light leading-tight md:text-6xl">
          Ava kohtumine.
        </h1>

        <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-[#5f574f]">
          Osaliseks saamine seob kohtumised, kaja ja teekonna jäljed ühe
          inimesega. Mälu hoiab järjepidevust ega määra tähendust.
        </p>

        <div className="rounded-3xl border border-[#d7b985] bg-white/45 p-8 text-left">
          <div className="mb-8 flex flex-col justify-center gap-4 md:flex-row">
            <button
              type="button"
              onClick={() => setMode("enter")}
              className={`rounded-full border px-6 py-3 text-xs uppercase tracking-[0.25em] transition ${
                mode === "enter"
                  ? "border-[#c9a36a] bg-[#efe2ce] text-[#8b642f]"
                  : "border-[#d8d1c7] text-[#6d655d]"
              }`}
            >
              Ava kohtumine
            </button>

            <button
              type="button"
              onClick={() => setMode("create")}
              className={`rounded-full border px-6 py-3 text-xs uppercase tracking-[0.25em] transition ${
                mode === "create"
                  ? "border-[#c9a36a] bg-[#efe2ce] text-[#8b642f]"
                  : "border-[#d8d1c7] text-[#6d655d]"
              }`}
            >
              Saa osaliseks
            </button>
          </div>

          <label className="mb-3 block text-sm text-[#6d655d]">
            E-post
          </label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mb-6 w-full rounded-2xl border border-[#d7b985] bg-white/60 p-4 outline-none transition focus:border-[#b78a4a] focus:bg-white"
          />

          <label className="mb-3 block text-sm text-[#6d655d]">
            Salasõna
          </label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mb-8 w-full rounded-2xl border border-[#d7b985] bg-white/60 p-4 outline-none transition focus:border-[#b78a4a] focus:bg-white"
          />

          <button
            type="button"
            onClick={enter}
            disabled={loading}
            className="w-full rounded-full border border-[#c9a36a] px-8 py-4 text-sm uppercase tracking-[0.25em] text-[#8b642f] transition hover:bg-[#efe2ce] disabled:opacity-50"
          >
            {loading
              ? "Hetk..."
              : mode === "enter"
              ? "Ava kohtumine"
              : "Saa osaliseks"}
          </button>

          {message && (
            <p className="mt-6 text-center text-sm text-[#8b642f]">
              {message}
            </p>
          )}
        </div>
      </section>
    </ExpectumPage>
  );
}

export default function Enter() {
  return (
    <Suspense fallback={null}>
      <EnterContent />
    </Suspense>
  );
}