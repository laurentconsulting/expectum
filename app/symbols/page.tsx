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

type SymbolItem = {
  id: SymbolId;
  name: string;
  description: string;
};

const symbols: SymbolItem[] = [
  {
    id: "meeting",
    name: "Kohtumine",
    description: "Kohtumine loob ruumi, kus küsimus võib avaneda.",
  },
  {
    id: "echo",
    name: "Kaja",
    description: "Kaja on see, mis jääb kohtumisest kõlama.",
  },
  {
    id: "theme",
    name: "Teema",
    description: "Teema võib kordumistes nähtavale tulla.",
  },
  {
    id: "direction",
    name: "Suund",
    description: "Suund on nähtavale tulnud võimalik liikumine.",
  },
  {
    id: "path",
    name: "Teekond",
    description: "Teekond tuleb nähtavale varasemate sammude jälgedes.",
  },
  {
    id: "memory",
    name: "Mälu",
    description: "Mälu aitab hoida kohtumiste ja teekonna järjepidevust.",
  },
  {
    id: "aim",
    name: "Aim",
    description: "Aim hoiab ruumi kohtumisele, vaikusele ja liikumisele.",
  },
];

export default function Symbols() {
  return (
    <ExpectumPage
      footerLinks={[
        {
          href: "/expectum-language",
          label: "Vormiraamat",
          symbol: "theme",
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
          <span>Expectumi sümbolid</span>
        </p>

        <h1 className="mb-6 text-4xl font-light md:text-6xl">
          Keel ja kuju
        </h1>

        <p className="mx-auto mb-16 max-w-2xl text-lg leading-relaxed text-[#5f574f]">
          Mõnikord kannab üks sümbol rohkem kui pikk seletus.
          Need kujundid tähistavad Expectumi keskseid mõisteid.
        </p>

        <div className="space-y-8 text-left">
          {symbols.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl border border-[#d7b985] bg-white/45 p-8"
            >
              <div className="flex flex-col gap-6 md:flex-row md:items-center">
                <ExpectumSymbol name={item.id} size="card" />

                <div>
                  <h2 className="mb-3 text-2xl font-light">
                    {item.name}
                  </h2>

                  <p className="leading-relaxed text-[#5f574f]">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </ExpectumPage>
  );
}