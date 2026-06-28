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
        {
          href: "/symbols",
          label: "Sümbolid",
          symbol: "echo",
        },
        {
          href: "/aim",
          label: "Aim",
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
          Kohtumine võib korraks puhata.
        </h1>

        <p className="mb-12 text-lg leading-relaxed text-[#5f574f] md:text-2xl">
          Ruum jääb avatuks. Küsimus võib vaikselt edasi kõlada.
        </p>

        <div className="rounded-3xl border border-[#d7b985] bg-white/45 p-8 text-lg leading-relaxed text-[#4f4942]">
          <p className="mb-6">Jäljed jäävad teekonda toetama.</p>

          <p>
            Kui hetk on õige, saab kohtumise uuesti avada.
          </p>
        </div>

        <p className="mt-20 text-sm text-[#8a8278]">
          Kõik ei pea avanema korraga. Tagasi võib tulla aeglaselt.
        </p>
      </section>
    </ExpectumPage>
  );
}
