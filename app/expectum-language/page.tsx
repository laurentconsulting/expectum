import ExpectumPage from "@/components/ExpectumPage";

const words = [
  {
    symbol: "○",
    name: "Kohtumine",
    text: "Kohtumine loob ruumi, kus küsimus võib avaneda.",
  },
  {
    symbol: "◐",
    name: "Kaja",
    text: "Kaja on see, mis jääb pärast kohtumist kõlama.",
  },
  {
    symbol: "✦",
    name: "Teema",
    text: "Teema on see, mis hakkab korduma.",
  },
  {
    symbol: "△",
    name: "Suund",
    text: "Suund viitab liikumisele, mitte sihtkohale.",
  },
  {
    symbol: "∞",
    name: "Teekond",
    text: "Teekond on elav liikumine, mis muutub koos inimesega.",
  },
  {
    symbol: "□",
    name: "Mälu",
    text: "Mälu aitab hoida kohtumiste ja teekonna järjepidevust.",
  },
  {
    symbol: "✧",
    name: "Aim",
    text: "Aim hoiab ruumi, kus inimene saab kohtuda iseenda küsimustega.",
  },
];

export default function ExpectumLanguage() {
  return (
    <ExpectumPage
      footerLinks={[
        {
          href: "/symbols",
          label: "Sümbolid",
          symbol: "echo",
        },
        {
          href: "/expectum",
          label: "Expectum?",
          symbol: "aim",
        },
      ]}
    >
      <section className="mx-auto max-w-4xl text-center">
        <p className="mb-10 tracking-[0.4em] text-xs uppercase text-[#b78a4a]">
          ✧ Expectumi vormiraamat
        </p>

        <h1 className="mb-8 text-4xl font-light md:text-6xl">
          Keel, sümbolid ja ruum
        </h1>

        <p className="mx-auto mb-14 max-w-2xl text-lg leading-relaxed text-[#5f574f]">
          See leht kirjeldab põhimõtteid, mille järgi Expectum on kujunenud
          ja mille järgi ta edasi kasvab.
        </p>

        <div className="space-y-10 text-left">
          <section className="rounded-3xl border border-[#d7b985] bg-white/45 p-8 text-lg leading-relaxed text-[#4f4942]">
            <h2 className="mb-6 text-2xl font-light">
              Mida Expectum ei ole
            </h2>

            <p className="mb-4">Expectum ei ole mäng.</p>
            <p className="mb-4">Expectum ei ole tootlikkuse tööriist.</p>
            <p className="mb-4">Expectum ei ole enesearengu võistlus.</p>
            <p className="mb-6">Expectum ei mõõda inimese väärtust.</p>

            <p>
              Ta loob ruumi, kus inimene saab kohtuda iseenda küsimuste,
              kaja ja liikumisega.
            </p>
          </section>

          <section className="rounded-3xl border border-[#d7b985] bg-white/45 p-8">
            <h2 className="mb-8 text-2xl font-light">
              Expectumi sõnavara
            </h2>

            <div className="space-y-6">
              {words.map((item) => (
                <div key={item.name} className="flex gap-5">
                  <div className="w-10 text-3xl text-[#b78a4a]">
                    {item.symbol}
                  </div>

                  <div>
                    <p className="mb-2 text-xl font-light">
                      {item.name}
                    </p>

                    <p className="leading-relaxed text-[#5f574f]">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-[#d7b985] bg-white/45 p-8 text-lg leading-relaxed text-[#4f4942]">
            <h2 className="mb-6 text-2xl font-light">
              Keelehoid
            </h2>

            <p className="mb-4">
              Expectum eelistab sõnu, mis hoiavad ruumi avatuna.
            </p>

            <p className="mb-4">
              Ta ei ütle inimese eest, mida miski tähendab.
            </p>

            <p>
              Ta aitab märkama, mitte otsustama.
            </p>
          </section>
        </div>
      </section>
    </ExpectumPage>
  );
}