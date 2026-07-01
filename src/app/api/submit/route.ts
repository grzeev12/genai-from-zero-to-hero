import { NextRequest, NextResponse } from "next/server";
import { getModule } from "@/lib/modules";
import { scoreSubmission } from "@/lib/scorer";
import { initDb, saveSubmission, updateScore } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { moduleId, track, name, deliverable } = body;

  if (!moduleId || !track || !name || !deliverable) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  await initDb();

  const id = crypto.randomUUID();
  await saveSubmission({ id, moduleId, track, name, deliverable });

  // ציון אסינכרוני — הלומד מקבל badge מיד
  const mod = getModule(track as "managers" | "devops" | "cloud-pm", moduleId);
  if (mod?.rubric?.length) {
    scoreSubmission(deliverable, mod.rubric)
      .then((result) => updateScore(id, result.total, result.breakdown, result.summary))
      .catch(console.error);
  }

  return NextResponse.json({ ok: true });
}
