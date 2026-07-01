import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { initModuleThresholdsTable, upsertModuleThreshold } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { moduleId, track, minScore } = await req.json();
  if (!moduleId || !track || minScore === undefined) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  await initModuleThresholdsTable();
  await upsertModuleThreshold(moduleId, track, Number(minScore));
  return NextResponse.json({ ok: true });
}
