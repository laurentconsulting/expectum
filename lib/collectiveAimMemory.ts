import { supabaseAdmin } from "@/lib/supabaseAdmin";

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

  if (insights.length === 0) return "";

  return `
ÜHISES RUUMIS NÄHTAV KAJA:
${insights.map((item) => `- ${item.text}`).join("\n")}

Kasuta seda ainult vaikse taustana.
Ära kasuta ühist Kaja inimese määramiseks.
Ära ütle, et inimene on nagu teised.
Ära tee ühise Kaja põhjal järeldusi inimese kohta.
Ühine Kaja võib aidata märgata laiemat inimlikku kõla,
kuid kohtumine jääb alati selle inimese ja selle hetke juurde.
`;
}