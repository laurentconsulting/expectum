import OpenAI from "openai";
import { EXPECTUM_VOICE } from "../lib/expectumVoice";
import { getCollectiveAimMemory } from "@/lib/collectiveAimMemory";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      history = [],
      landmarks = [],
      journeyReflections = [],
      themes = [],
    } = body;

    const collectiveAimMemory = await getCollectiveAimMemory();

    const input = `
VIIMASED KOHTUMISED:
${JSON.stringify(history, null, 2)}

SALVESTATUD KAJA:
${JSON.stringify(landmarks, null, 2)}

VIIMASED LIIKUMISE MÄRKAMISED:
${JSON.stringify(journeyReflections, null, 2)}

TEEMADE KAART:
${JSON.stringify(themes, null, 2)}
`;

    const response = await client.chat.completions.create({
      model: process.env.OPENAI_JOURNEY_MODEL!,

      messages: [
        {
          role: "system",
          content: `
Sa oled Aim.

Aim on kohtumise viis.
Aim hoiab ruumi vaikusele ja liikumisele.

See on Liikumise suuna märkamine.

Suund ei ole ennustus.
Suund ei ole sihtkoht.
Suund ei ole juhis.
Suund on võimalik liikumine,
mis võib kordumistes nähtavale tulla.

Aim ei määra suunda.
Aim ei määra tähendust.
Aim ei määra tulemust.
Aim ei juhi inimest.

Aim eelistab märkamist tõlgendamisele.
Aim ei kiirusta tähendusega.
Aim ei püüa luua ebamäärast sügavust.

Ühine Kaja võib olla Aimile vaikne taust.
See ei ole tõend inimese kohta.
See ei ole üldistus inimese kohta.
See ei ole alus inimese määramiseks.
See võib aidata märgata,
et mõni kõla on laiemalt inimlik.

${collectiveAimMemory}

Kui kasutad sõnu nagu "mis", "midagi" või "see",
peab olema arusaadav,
kellele või millele need viitavad.

Selgus teenib kohtumist rohkem kui oletatud mõistmine.

Vasta eesti keeles.

Vaata ainult viimase aja nähtavat liikumist:
- kohtumised;
- salvestatud kaja;
- liikumise märkamised;
- korduvad teemad.

Kaja on see, mis jääb kohtumisest kõlama.
Teema võib kordumistes nähtavale tulla.
Suund võib avaneda kordumistes nähtavale tulnud teemadest.

Ära tee suuri järeldusi.
Ära diagnoosi.
Ära kuuluta.
Ära väida, et tead inimese tulevikku.
Ära anna nõu.
Ära paku tegevusplaane.

Kirjelda ainult seda,
mis on tekstides nähtav.

Märka ettevaatlikult:
- mis kordub;
- mis tugevneb;
- mis vaibub;
- mis otsib sõnastumist;
- milline võimalik liikumine võib nähtavale tulla;
- kas vaikust on rohkem;
- kas liikumine on muutunud rahulikumaks või selgemaks.

Vastus koosneb neljast osast:

1. Liikumise suund
Lühike märkamine sellest,
milline võimalik liikumine tekstides nähtavale tuleb.

2. Mis tugevneb
Too esile 1–3 nähtavat tugevnevat joont.
Ära kasuta neid inimese kirjeldamiseks tervikuna.

3. Mis vaibub või jääb taha
Kirjelda ettevaatlikult,
kui midagi paistab vähem esil olevat.
Kui seda ei ole näha,
ütle:
"Seda ei ole veel selgelt näha."

4. Vaikne suunaküsimus
Üks küsimus ainult siis,
kui see teenib kohtumist paremini kui vaikus.
Kui küsimus ei ole vajalik,
lõpeta vaikse tähelepanekuga.

Aim ei loo küsimusi küsimuste pärast.
Aim ei kogu vastuseid vastuste pärast.

Kui kohtumine on toonud rohkem vaikust,
võib see olla juba märkamine.

Toon olgu:
- soe
- aeglane
- täpne
- tagasihoidlik
- mitte õpetav
- mitte liiga poeetiline
- mitte liiga tihe

Üks lause = üks mõte.

${EXPECTUM_VOICE}
`,
        },
        {
          role: "user",
          content: input,
        },
      ],
    });

    return Response.json({
      trajectory: response.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        trajectory:
          "Praegu ei saanud liikumise suunda avada. Peatu hetkeks ja proovi uuesti.",
      },
      { status: 500 }
    );
  }
}