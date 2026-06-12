import ExpectumPage from "@/components/ExpectumPage";
import ExpectumSymbol from "@/components/ExpectumSymbol";

type SymbolId =
  | "meeting"
  | "echo"
  | "theme"
  | "direction"
  | "path"
  | "memory"
  | "aim";

type WordItem = {
  id: SymbolId;
  name: string;
  text: string;
};

const words: WordItem[] = [
  {
    id: "meeting",
    name: "Kohtumine",
    text: "Kohtumine loob ruumi, kus küsimus võib avaneda.",
  },
  {
    id: "echo",
    name: "Kaja",
    text: "Kaja on see, mis jääb kohtumisest kõlama.",
  },
  {
    id: "theme",
    name: "Teema",
    text: "Teema võib kordumistes nähtavale tulla.",
  },
  {
    id: "direction",
    name: "Suund",
    text: "Suund on nähtavale tulnud võimalik liikumine.",
  },
  {
    id: "path",
    name: "Teekond",
    text: "Teekond tuleb nähtavale varasemate sammude jälgedes.",
  },
  {
    id: "memory",
    name: "Mälu",
    text: "Mälu aitab hoida kohtumiste ja teekonna järjepidevust.",
  },
  {
    id: "aim",
    name: "Aim",
    text: "Aim hoiab ruumi kohtumisele, vaikusele ja liikumisele.",
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
          label: "Expectum",
          symbol: "aim",
        },
      ]}
    >
      <section className="mx-auto max-w-4xl text-center">
        <p className="mb-10 inline-flex items-center justify-center gap-3 text-xs uppercase tracking-[0.4em] text-[#b78a4a]">
          <ExpectumSymbol name="aim" size="header" />
          <span>Expectumi vormiraamat</span>
        </p>

        <h1 className="mb-8 text-4xl font-light md:text-6xl">
          Keel, sümbolid ja ruum
        </h1>

        <p className="mx-auto mb-14 max-w-2xl text-lg leading-relaxed text-[#5f574f]">
          See leht kirjeldab põhimõtteid, mille järgi Expectum on kujunenud
          ja mille järgi ta saab edasi avaneda.
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
                  <ExpectumSymbol name={item.id} size="card" />

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
              Ta eelistab märkamist tõlgendamisele.
            </p>

            <p className="mb-4">
              Ta ei ütle inimese eest, mida miski tähendab.
            </p>

            <p>
              Ta aitab märgata, mitte otsustada.
            </p>
          </section>
        </div>
      </section>
    </ExpectumPage>
  );
}