export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import TrackLevelList from "@/components/track/TrackLevelList";
import UserMenu from "@/components/auth/UserMenu";
import { getTrackProgress } from "@/lib/track-progress";

const LEVEL_LABELS: Record<number, { desc: string; hours: string }> = {
  1: { desc: "מתחיל ב-AI", hours: "20-30 שעות" },
  2: { desc: "משתמש בקיא", hours: "40-50 שעות" },
  3: { desc: "בונה AI", hours: "60-80 שעות" },
  4: { desc: "מומחה AI", hours: "100+ שעות" },
};

export default async function DevOpsTrackPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const p = await getTrackProgress(session.user.id, "devops");

  return (
    <main className="min-h-screen px-6 py-16" style={{ background: "var(--cream)" }}>
      <div className="max-w-2xl mx-auto space-y-10">

        <div className="flex justify-start">
          <UserMenu />
        </div>

        <div className="text-right">
          <Link href="/" className="text-sm transition-colors"
            style={{ color: "var(--text-muted)" }}>
            ‹ חזרה לדף הבית
          </Link>
          <h1 className="text-4xl font-bold mt-5" style={{ color: "var(--mocha-dark)" }}>
            מסלול DevOps
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
            4 רמות - DevOps Engineers
          </p>
          <div className="mt-5 h-px" style={{ background: "var(--border)" }} />
        </div>

        <TrackLevelList
          track="devops"
          modules={p.modules}
          completedIds={p.completedIds}
          byLevel={p.byLevel}
          levelLabels={LEVEL_LABELS}
          percent={p.percent}
          completedCount={p.completedCount}
          totalModules={p.totalModules}
        />
      </div>
    </main>
  );
}
