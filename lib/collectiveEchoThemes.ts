import { supabaseAdmin } from "@/lib/supabaseAdmin";

type SharedInsightRow = {
  id: string;
  text: string;
  question: string;
  created_at: string;
};

export type CollectiveEchoTheme = {
  word: string;
  count: number;
};

export type CollectiveEchoItem = {
  id: string;
  text: string;
  question: string;
  created_at: string;
};

const ignoredWords = new Set([
  "mina",
  "sina",
  "tema",
  "meie",
  "teie",
  "nad",
  "olen",
  "oled",
  "on",
  "oli",
  "olla",
  "olema",
  "see",
  "seda",
  "selle",
  "mis",
  "kus",
  "kui",
  "kas",
  "aga",
  "või",
  "ning",
  "ehk",
  "siis",
  "veel",
  "juba",
  "kõik",
  "väga",
  "nagu",
  "oma",
  "end",
  "enda",
  "sest",
  "et",
  "ja",
]);

function normalizeWord(word: string) {
  return word
    .toLowerCase()
    .replace(/[.,!?;:()"'„“”]/g, "")
    .trim();
}

function collectThemes(items: SharedInsightRow[]) {
  const counts = new Map<string, number>();

  items.forEach((item) => {
    const words = item.text
      .split(/\s+/)
      .map(normalizeWord)
      .filter((word) => word.length >= 5)
      .filter((word) => !ignoredWords.has(word));

    const uniqueWords = new Set(words);

    uniqueWords.forEach((word) => {
      counts.set(word, (counts.get(word) || 0) + 1);
    });
  });

  return Array.from(counts.entries())
    .map(([word, count]) => ({
      word,
      count,
    }))
    .filter((item) => item.count > 1)
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);
}

export async function getCollectiveEchoThemes(limit = 50) {
  const { data, error } = await supabaseAdmin
    .from("shared_insights")
    .select("id, question, text, created_at")
    .eq("approved", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Ühist Kaja ei saanud avada.", error);

    return {
      echoes: [] as CollectiveEchoItem[],
      themes: [] as CollectiveEchoTheme[],
    };
  }

  const echoes = (data || []) as SharedInsightRow[];

  return {
    echoes,
    themes: collectThemes(echoes),
  };
}