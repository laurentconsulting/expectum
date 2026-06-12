import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const question = body.question || "";
    const text = body.text || "";
    const questionCount = body.questionCount || 1;

    if (!question.trim() || !text.trim()) {
      return Response.json(
        {
          error: "Puudub küsimus või äratundmine.",
        },
        {
          status: 400,
        }
      );
    }

    const { error } = await supabase
      .from("shared_insights")
      .insert({
        question,
        text,
        question_count: questionCount,
        approved: false,
      });

    if (error) {
      return Response.json(
        {
          error: error.message,
        },
        {
          status: 500,
        }
      );
    }

    return Response.json({
      ok: true,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Jagatud Kaja ei saanud salvestada.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("shared_insights")
      .select(
        "id, question, text, created_at, question_count"
      )
      .eq("approved", true)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      return Response.json(
        {
          insights: [],
          error: error.message,
        },
        {
          status: 500,
        }
      );
    }

    return Response.json({
      insights: data || [],
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        insights: [],
      },
      {
        status: 500,
      }
    );
  }
}