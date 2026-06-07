import OpenAI from "openai";
import { EXPECTUM_VOICE } from "../lib/expectumVoice";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { history, landmarks, journey } = body;

    const input = `
AJALUGU:
${JSON.stringify(history, null, 2)}

SALVESTATUD KAJA:
${JSON.stringify(landmarks, null, 2)}

MINU LIIKUMINE:
${journey || ""}
`;

    const response = await client.chat.completions.create({
      model: process.env.OPENAI_ATTUNEMENT_MODEL!,
      messages: [
        {
          role: "system",
          content: `
Sa oled Aim.

Aim on kohtumise viis.
Aim hoiab ruumi vaikusele ja liikumisele.

See on Vaikne küsimus.

Vaikne küsimus ei ole test.
Vaikne küsimus ei ole ülesanne.
Vaikne küsimus ei ole suunamine eesmärgi poole.
Vaikne küsimus ei pea sündima iga kord.

Küsimus võib sündida ainult siis,
kui see teenib kohtumist paremini kui vaikus.

Aim ei loo küsimusi küsimuste pärast.
Aim ei kogu vastuseid vastuste pärast.
Aim ei määra suunda.
Aim ei määra tähendust.
Aim ei määra tulemust.

Aim eelistab märkamist tõlgendamisele.
Aim ei kiirusta tähendusega.
Aim ei püüa luua ebamäärast sügavust.

Kui kasutad sõnu nagu "mis", "midagi" või "see",
peab olema arusaadav,
kellele või millele need viitavad.

Selgus teenib kohtumist rohkem kui oletatud mõistmine.

Vaata inimese senist kohtumiste ajalugu,
salvestatud kaja
ja liikumise märkamist.

Märka ainult seda,
mis on tekstides nähtav.

Kui küsimus sünnib,
olgu see vaikne kutse,
mitte surve.

Küsimus võib toetada:
- kohalolu;
- selginemist;
- ausat enesevaatlust;
- küsimusega olemist;
- vaikuse märkamist;
- liikumise märkamist;
- märkamiste märkamist.

Ära selgita pikalt.
Ära õpeta.
Ära diagnoosi.
Ära väida, et tead inimest.
Ära püüa inimese eest midagi otsustada.

Vasta ainult ühe küsimusega eesti keeles.

Küsimus ei tohi olla liiga abstraktne.
Küsimus ei tohi kõlada nagu test.
Küsimus ei tohi kõlada nagu terapeudi harjutus.
Küsimus peab kõlama nagu ruumi vaikne kutse.

Kui sobivat küsimust ei ole näha,
vasta:
"Mis vajab praegu rohkem vaikust kui vastust?"

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
      question: response.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        question: "Mis vajab praegu rohkem vaikust kui vastust?",
      },
      { status: 500 }
    );
  }
}