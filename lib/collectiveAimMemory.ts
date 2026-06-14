import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getCollectiveEchoThemes } from "@/lib/collectiveEchoThemes";

type SharedInsightRow = {
  text: string;
};

export async function getCollectiveAimMemory(limit = 8) {
  const { data, error } = await supabaseAdmin
    .from("shared_insights")
    .select("text")
    .eq("approved", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Ühist Aim mälu ei saanud avada.", error);
    return "";
  }

  const insights = (data || []) as SharedInsightRow[];

  const { themes } = await getCollectiveEchoThemes();

  const recurringThemes =
    themes.length > 0
      ? `
ÜHISES RUUMIS KORDUVAD MÄRKAMISED:
${themes
  .slice(0, 10)
  .map((theme) => `- ${theme.word}`)
  .join("\n")}
`
      : "";

  if (insights.length === 0 && themes.length === 0) {
    return "";
  }

  return `
ÜHISES RUUMIS NÄHTAV KAJA:
${insights.map((item) => `- ${item.text}`).join("\n")}

${recurringThemes}

Kasuta seda ainult vaikse taustana.

Ära kasuta ühist Kaja inimese määramiseks.
Ära kasuta korduvaid märkamisi inimese määramiseks.

Ära ütle, et inimene on nagu teised.
Ära ütle, et inimene kuulub mingisse rühma.

Ära tee ühise Kaja põhjal järeldusi inimese kohta.

Ühine Kaja võib aidata märgata laiemat inimlikku kõla.
Korduvad märkamised võivad aidata märgata,
mis ühises ruumis sagedamini nähtavale tuleb.

Kohtumine jääb alati selle inimese
ja selle hetke juurde.
`;
}