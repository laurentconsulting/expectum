import ExpectumPage from "@/components/ExpectumPage";
import ExpectumSymbol from "@/components/ExpectumSymbol";

export default function Attunement() {
  return (
    <ExpectumPage>
      <section className="mx-auto max-w-3xl text-center">
        <p className="mb-10 inline-flex items-center justify-center gap-3 text-xs uppercase tracking-[0.4em] text-[#b78a4a]">
          <ExpectumSymbol name="meeting" size="header" />
          <span>Kohtumine</span>
        </p>

        <h1 className="mb-10 text-4xl font-light leading-tight md:text-6xl">
          Peatu hetkeks.
        </h1>

        <p className="mb-12 text-lg leading-relaxed text-[#5f574f] md:text-2xl">
          Kes Sa oled siis, kui Sa ei pea midagi tõestama?
        </p>

        <a
          href="/question"
          className="inline-block rounded-full border border-[#c9a36a] px-8 py-4 text-sm uppercase tracking-[0.25em] text-[#8b642f] transition hover:bg-[#efe2ce]"
        >
          Ava küsimus
        </a>

        <p className="mt-20 text-sm text-[#8a8278]">
          Ka peatumine on osa liikumisest.
        </p>
      </section>
    </ExpectumPage>
  );
}