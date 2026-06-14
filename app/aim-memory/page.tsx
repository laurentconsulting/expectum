import ExpectumPage from "@/components/ExpectumPage";
import ExpectumCard from "@/components/ExpectumCard";
import ExpectumSection from "@/components/ExpectumSection";

const principles = [
  {
    label: "Mälu",
    text: "Aim võib kasutada seda, mida inimene on otsustanud hoida.",
  },
  {
    label: "Puhastamine",
    text: "Aim ei hoia seda, mille inimene on otsustanud puhastada.",
  },
  {
    label: "Ühine Kaja",
    text: "Ühine Kaja hoiab märkamisi, mis on kohtumistes nähtavale tulnud.",
  },
  {
    label: "Mitte määramine",
    text: "Ühine mälu ei määra inimest. Ta ei ütle, kes inimene on.",
  },
  {
    label: "Avardamine",
    text: "Mälu võib avardada vaadet. Ta ei asenda kohtumist.",
  },
  {
    label: "Aim",
    text: "Aim ei otsi mälust valmis vastuseid. Aim märkab seoseid, mis võivad kohtumist toetada.",
  },
];

export default function AimMemory() {
  return (
    <ExpectumPage
      footerLinks={[
        {
          href: "/aim",
          label: "Aim",
          symbol: "aim",
        },
        {
          href: "/expectum",
          label: "Expectum",
          symbol: "aim",
        },
        {
          href: "/expectum-language",
          label: "Vormiraamat",
          symbol: "theme",
        },
      ]}
    >
      <ExpectumSection
        symbol="memory"
        label="Aim Mälu"
        title="Aim hoiab märkamiste järjepidevust."
        intro="Aim ei kasva selleks, et rohkem teada. Aim kasvab selleks, et avaramalt märgata."
      >
        <div className="space-y-8">
          {principles.map((item) => (
            <ExpectumCard key={item.label} label={item.label}>
              {item.text}
            </ExpectumCard>
          ))}
        </div>
      </ExpectumSection>
    </ExpectumPage>
  );
}