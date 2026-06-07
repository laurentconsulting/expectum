import { supabaseAdmin } from "@/lib/supabaseAdmin";

function isAdmin(req: Request) {
  const key = req.headers.get("x-admin-key");
  return key && key === process.env.EXPECTUM_ADMIN_KEY;
}

export async function GET(req: Request) {
  if (!isAdmin(req)) {
    return Response.json({ error: "Puudub ligipääs." }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("shared_insights")
    .select("id, question, text, created_at, approved")
    .order("created_at", { ascending: false });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ insights: data || [] });
}

export async function PATCH(req: Request) {
  if (!isAdmin(req)) {
    return Response.json({ error: "Puudub ligipääs." }, { status: 401 });
  }

  const body = await req.json();
  const { id, approved } = body;

  const { error } = await supabaseAdmin
    .from("shared_insights")
    .update({ approved })
    .eq("id", id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true });
}

export async function DELETE(req: Request) {
  if (!isAdmin(req)) {
    return Response.json({ error: "Puudub ligipääs." }, { status: 401 });
  }

  const body = await req.json();
  const { id } = body;

  const { error } = await supabaseAdmin
    .from("shared_insights")
    .delete()
    .eq("id", id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true });
}