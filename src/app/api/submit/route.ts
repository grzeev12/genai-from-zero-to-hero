import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

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
  const existing = JSON.parse(fs.readFileSync(submissionsFile, "utf-8"));
  existing.push({
    id: crypto.randomUUID(),
    moduleId,
    track,
    name,
    deliverable,
    submittedAt: new Date().toISOString(),
    score: null,
  });
  fs.writeFileSync(submissionsFile, JSON.stringify(existing, null, 2));

  return NextResponse.json({ ok: true });
}
