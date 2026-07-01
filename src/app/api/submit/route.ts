import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getModule } from "@/lib/modules";
import { scoreSubmission } from "@/lib/scorer";

const submissionsFile = path.join(process.cwd(), "data", "submissions.json");

function ensureDataDir() {
  const dir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(submissionsFile)) fs.writeFileSync(submissionsFile, "[]");
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { moduleId, track, name, deliverable } = body;

  if (!moduleId || !track || !name || !deliverable) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  ensureDataDir();

  // שמור הגשה מיד — לפני ה-scoring
  const submission = {
    id: crypto.randomUUID(),
    moduleId,
    track,
    name,
    deliverable,
    submittedAt: new Date().toISOString(),
    score: null as number | null,
    scoreBreakdown: null as unknown,
    scoreSummary: null as string | null,
  };

  const existing = JSON.parse(fs.readFileSync(submissionsFile, "utf-8"));
  existing.push(submission);
  fs.writeFileSync(submissionsFile, JSON.stringify(existing, null, 2));

  // Score באופן אסינכרוני — לא מחכים, הלומד מקבל badge מיד
  const mod = getModule(track as "managers" | "devops" | "cloud-pm", moduleId);
  if (mod?.rubric?.length) {
    scoreSubmission(deliverable, mod.rubric)
      .then((result) => {
        const all = JSON.parse(fs.readFileSync(submissionsFile, "utf-8"));
        const idx = all.findIndex((s: { id: string }) => s.id === submission.id);
        if (idx !== -1) {
          all[idx].score = result.total;
          all[idx].scoreBreakdown = result.breakdown;
          all[idx].scoreSummary = result.summary;
          fs.writeFileSync(submissionsFile, JSON.stringify(all, null, 2));
        }
      })
      .catch(console.error);
  }

  return NextResponse.json({ ok: true });
}
