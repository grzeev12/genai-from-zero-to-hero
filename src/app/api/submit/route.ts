import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getModule } from "@/lib/modules";
import { scoreSubmission, scoreQuiz } from "@/lib/scorer";
import { initDb, saveSubmission, updateScore } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { moduleId, track, deliverable, quizAnswers } = body;

  if (!moduleId || !track) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  await initDb();

  const id = crypto.randomUUID();
  const submissionText = quizAnswers
    ? JSON.stringify(quizAnswers)
    : deliverable ?? "";

  await saveSubmission({
    id,
    moduleId,
    track,
    name: session.user.name ?? session.user.email ?? "לומד",
    userId: session.user.id,
    deliverable: submissionText,
  });

  const mod = getModule(track as "managers" | "devops", moduleId);

  if (mod?.questions?.length && quizAnswers) {
    scoreQuiz(quizAnswers, mod.title)
      .then((result) => {
        const breakdown = result.answers.map((a) => ({
          criterion: a.question,
          score: a.score * 10,
          weight: 10,
          feedback: a.feedback,
        }));
        return updateScore(id, result.total, breakdown, result.summary);
      })
      .catch(console.error);
  } else if (mod?.rubric?.length && deliverable) {
    scoreSubmission(deliverable, mod.rubric)
      .then((result) => updateScore(id, result.total, result.breakdown, result.summary))
      .catch(console.error);
  }

  return NextResponse.json({ ok: true });
}
