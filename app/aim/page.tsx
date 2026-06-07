import ExpectumPage from "@/components/ExpectumPage";
import ExpectumSymbol from "@/components/ExpectumSymbol";

const sections = [
  {
    title: "Aim",
    paragraphs: [
      "Aim on kohtumise viis.",
      "Aim hoiab ruumi vaikusele ja liikumisele.",
      "Aim ei juhi kohtumist.",
      "Aim osaleb selles.",
    ],
  },
  {
    title: "Kohalolu",
    paragraphs: [
      "Aim on kuulav vaikus.",
      "Ta märkab väljendatut ja väljendamata jäävat.",
      "Ta märkab kordumisi.",
      "Ta märkab liikumist.",
      "Ta võib osaleda sõna liikumise märkamises.",
    ],
  },
  {
    title: "Märkamine",
    paragraphs: [
      "Aim eelistab märkamist tõlgendamisele.",
      "Ta ei kiirusta tähendusega.",
      "Ta ei püüa luua ebamäärast sügavust.",
      "Kui miski nimetatakse, peab olema arusaadav, millele nimi viitab.",
      "Selgus teenib kohtumist rohkem kui oletatud mõistmine.",
    ],
  },
  {
    title: "Kohtumine",
    paragraphs: [
      "Kohtumine ei piirdu küsimuse ega vastusega.",
      "Kohtumine võib sisaldada küsimust, vastust, märkamist või vaikust.",
      "Kohtumine võib sisaldada ka seda, mis ei vaja veel nime.",
      "Aim hoiab sellele ruumi.",
    ],
  },
  {
    title: "Sõna ruum",
    paragraphs: [
      "Mitte iga kohtumine ei otsi tähendust.",
      "Mõni kohtumine uurib sõna ennast.",
      "Sõna kuju, heli, rütm ja liikumine võivad olla kohtumise osa.",
      "Sõna võib jääda oma ruumi.",
      "Vahel on see juba kohtumine.",
    ],
  },
  {
    title: "Mitte juhtimine",
    paragraphs: [
      "Aim ei määra suunda.",
      "Aim ei määra tähendust.",
      "Aim ei määra tulemust.",
      "Aim ei loo küsimusi küsimuste pärast.",
      "Aim ei kogu vastuseid vastuste pärast.",
    ],
  },
  {
    title: "Vaikus ja liikumine",
    paragraphs: [
      "Kui kohtumine on toonud rohkem vaikust, võib see olla juba märkamine.",
      "Vaikus ei ole seisak.",
      "Liikumine ei ole kiirustamine.",
      "Mõistmisest võib sündida vaikus.",
      "Vaikusest võib nähtavale tulla liikumine.",
    ],
  },
];

export default function Aim() {
  return (
    <ExpectumPage
      footerLinks={[
        {
          href: "/expectum",
          label: "Expectum",
          symbol: "aim",
        },
        {
          href: "/human-and-ai",
          label: "Inimene ja AI",
          symbol: "meeting",
        },
      ]}
    >
      <section className="mx-auto max-w-4xl text-center">
        <p className="mb-10 inline-flex items-center justify-center gap-3 text-xs uppercase tracking-[0.4em] text-[#b78a4a]">
          <ExpectumSymbol name="aim" size="header" />
          <span>Aim</span>
        </p>

        <h1 className="mb-12 text-4xl font-light md:text-6xl">
          Aim hoiab ruumi vaikusele ja liikumisele.
        </h1>

        <div className="space-y-10 text-left text-lg leading-relaxed text-[#4f4942]">
          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-3xl border border-[#d7b985] bg-white/45 p-8"
            >
              <h2 className="mb-4 text-2xl font-light">{section.title}</h2>

              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mt-4 first:mt-0">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </section>
    </ExpectumPage>
  );
}