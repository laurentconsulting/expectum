import { getCollectiveEchoThemes } from "@/lib/collectiveEchoThemes";

export async function GET() {
  try {
    const { echoes, themes } = await getCollectiveEchoThemes();

    return Response.json({
      echoes,
      themes,
    });
  } catch (error) {
    console.error("Ühist Kaja ei saanud avada.", error);

    return Response.json(
      {
        echoes: [],
        themes: [],
        error: "Ühist Kaja ei saanud avada.",
      },
      { status: 500 }
    );
  }
}