import ExpectumPage from "@/components/ExpectumPage";
import ExpectumSymbol from "@/components/ExpectumSymbol";

export default function ReturnRoom() {
  return (
    <ExpectumPage
      className="bg-[#f7f1e8]"
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
          <span>Puhkus</span>
        </p>

        <h1 className="mb-10 text-4xl font-light leading-tight md:text-6xl">
          Kohtumine võib puhata.
        </h1>

        <p className="mb-12 text-lg leading-relaxed text-[#5f574f] md:text-2xl">
          Mõnikord vajab küsimus aega. Mõnikord vajab vaikust ka inimene.
        </p>

        <div className="rounded-3xl border border-[#d7b985] bg-white/45 p-8 text-lg leading-relaxed text-[#4f4942]">
          <p className="mb-6">Teekonna jäljed on hoitud.</p>

          <p>
            Kui soovid, võid kohtumise hiljem uuesti avada.
          </p>
        </div>

        <div className="mt-12 flex flex-col justify-center gap-4 md:flex-row">
          
          <a
            href="/"
            className="rounded-full border border-[#d8d1c7] px-8 py-4 text-sm uppercase tracking-[0.25em] text-[#6d655d] transition hover:bg-[#f1ebe3]"
          >
            Algusesse
          </a>
        </div>

        <p className="mt-20 text-sm text-[#8a8278]">
          Kõik ei pea avanema korraga.
        </p>
      </section>
    </ExpectumPage>
  );
}