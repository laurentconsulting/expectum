import ExpectumPage from "@/components/ExpectumPage";
import ExpectumSymbol from "@/components/ExpectumSymbol";

export default function Home() {
  return (
    <ExpectumPage
      footerLinks={[
        {
          href: "/expectum",
          label: "Tutvu Expectumiga",
          symbol: "aim",
        },
        {
          href: "/aim",
          label: "Aim",
          symbol: "aim",
        },
        {
          href: "/symbols",
          label: "Sümbolid",
          symbol: "echo",
        },
      ]}
    >
      <section className="mx-auto flex min-h-full max-w-5xl flex-col items-center justify-center text-center">
        <p className="mb-10 inline-flex items-center justify-center gap-3 text-xs uppercase tracking-[0.4em] text-[#b78a4a]">
          <ExpectumSymbol name="aim" size="header" />
          <span>Expectum</span>
        </p>

        <h1 className="mb-8 text-5xl font-light leading-tight md:text-7xl">
          Sa ei pea siin kiirustama.
        </h1>

        <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-[#5f574f] md:text-2xl">
          Expectum on kohtumise ruum.
          Siin saab inimene peatuda küsimuse, kaja, teekonna ja nähtavale tulnud suuna juures.
        </p>

        <p className="mx-auto mb-14 max-w-2xl text-base leading-relaxed text-[#6d655d] md:text-lg">
          Kohtumise alustamiseks loo konto või sisene.
          Mälu hoiab sinu kohtumiste jälgi ainult sinu teekonna jaoks.
        </p>

        <div className="flex flex-col flex-wrap justify-center gap-4 md:flex-row">
          <a
            href="/enter"
            className="rounded-full border border-[#c9a36a] px-8 py-4 text-center text-sm uppercase tracking-[0.25em] text-[#8b642f] transition hover:bg-[#efe2ce]"
          >
            Sisene
          </a>

          <a
            href="/enter?mode=create"
            className="rounded-full border border-[#c9a36a] px-8 py-4 text-center text-sm uppercase tracking-[0.25em] text-[#8b642f] transition hover:bg-[#efe2ce]"
          >
            Loo konto
          </a>

          <a
            href="/expectum"
            className="rounded-full border border-[#d8d1c7] px-8 py-4 text-center text-sm uppercase tracking-[0.25em] text-[#6d655d] transition hover:bg-[#f1ebe3]"
          >
            Tutvu
          </a>
        </div>

        <p className="mt-20 text-sm text-[#8a8278]">
          Alustada võib sellest, mis Sind puudutab.
        </p>
      </section>
    </ExpectumPage>
  );
}