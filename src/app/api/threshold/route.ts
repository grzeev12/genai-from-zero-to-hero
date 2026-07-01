import { NextRequest, NextResponse } from "next/server";
import { initThresholdsTable, upsertThreshold, getThresholds } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const moduleId = searchParams.get("moduleId");
  const track = searchParams.get("track");
  if (!moduleId || !track) return NextResponse.json({ error: "Missing params" }, { status: 400 });
  await initThresholdsTable();
  const rows = await getThresholds(moduleId, track);
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const { moduleId, track, criterion, minScore } = await req.json();
  if (!moduleId || !track || !criterion || minScore === undefined) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  await initThresholdsTable();
  await upsertThreshold(moduleId, track, criterion, Number(minScore));
  return NextResponse.json({ ok: true });
}
