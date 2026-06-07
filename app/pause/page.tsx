"use client";

import { EXPECTUM_STORAGE } from "@/lib/expectumStorage";
import ExpectumPage from "@/components/ExpectumPage";
import ExpectumSymbol from "@/components/ExpectumSymbol";

export default function Pause() {
  function restartRhythm() {
    const sessionId = crypto.randomUUID();

    localStorage.setItem(EXPECTUM_STORAGE.questionCount, "0");
    localStorage.setItem(EXPECTUM_STORAGE.currentSession, sessionId);
    localStorage.removeItem(EXPECTUM_STORAGE.thread);
    localStorage.removeItem(EXPECTUM_STORAGE.question);
    localStorage.setItem(EXPECTUM_STORAGE.reflectionPending, "false");

    window.location.href = "/question";
  }

  return (
    <ExpectumPage>
      <section className="mx-auto w-full max-w-3xl text-center">
        <p className="mb-10 inline-flex items-center justify-center gap-3 text-xs uppercase tracking-[0.4em] text-[#b78a4a]">
          <ExpectumSymbol name="meeting" size="header" />
          <span>Paus</span>
        </p>

        <h1 className="mb-10 text-4xl font-light leading-tight md:text-6xl">
          Peatu hetkeks.
        </h1>

        <p className="mb-10 text-lg leading-relaxed text-[#5f574f] md:text-2xl">
          Kõik ei avane järgmise küsimusega.
        </p>

        <div className="rounded-3xl border border-[#d7b985] bg-white/45 p-8 text-left text-lg leading-relaxed text-[#4f4942]">
          <p className="mb-6">Peatu ja hinga.</p>

          <p className="mb-6">Vahel avaneb midagi pausis.</p>

          <p>
            Küsimus võib Sinuga edasi liikuda ka siis,
            kui vastus veel ei ole kohal.
          </p>
        </div>

        <div className="mt-12 flex flex-col justify-center gap-4 md:flex-row">
          <button
            type="button"
            onClick={restartRhythm}
            className="rounded-full border border-[#c9a36a] px-8 py-4 text-sm uppercase tracking-[0.25em] text-[#8b642f] transition hover:bg-[#efe2ce]"
          >
            Ava uus kohtumine
          </button>

          <a
            href="/return"
            className="rounded-full border border-[#d8d1c7] px-8 py-4 text-sm uppercase tracking-[0.25em] text-[#6d655d] transition hover:bg-[#f1ebe3]"
          >
            Eemaldu
          </a>
        </div>

        <p className="mt-20 text-sm text-[#8a8278]">
          Kohtumine jääb avatuks.
        </p>
      </section>
    </ExpectumPage>
  );
}