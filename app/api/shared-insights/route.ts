import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("shared_insights")
    .select("id, question, text, question_count, created_at")
    .eq("approved", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Jagatud Kaja ei saanud avada.", error);

    return Response.json(
      {
        insights: [],
        error: "Jagatud Kaja ei saanud avada.",
      },
      { status: 500 }
    );
  }

  return Response.json({
    insights: data || [],
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const question = body.question || "";
    const text = body.text || "";
    const questionCount = Number(body.questionCount || 1);

    if (!question.trim() || !text.trim()) {
      return Response.json(
        {
          error: "Kaja või küsimus puudub.",
        },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin.from("shared_insights").insert({
      question,
      text,
      question_count: questionCount,
      approved: false,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Kaja ei saanud ühisesse ruumi liikuda.", error);

      return Response.json(
        {
          error: "Kaja ei saanud ühisesse ruumi liikuda.",
        },
        { status: 500 }
      );
    }

    return Response.json({
      ok: true,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Kaja ei saanud ühisesse ruumi liikuda.",
      },
      { status: 500 }
    );
  }
}