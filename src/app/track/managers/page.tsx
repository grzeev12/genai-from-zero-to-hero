import Link from "next/link";
import { getModulesByLevel } from "@/lib/modules";
import TrackLevelList from "@/components/track/TrackLevelList";
import UserMenu from "@/components/auth/UserMenu";

const LEVEL_LABELS: Record<number, { name: string; desc: string; hours: string }> = {
  1: { name: "AI Aware", desc: "מסגרת מושגית + כלים", hours: "~20 שעות" },
  2: { name: "AI Practitioner", desc: "AI בשגרת העבודה", hours: "~40 שעות" },
  3: { name: "AI Builder", desc: "הובלת AI לצוות", hours: "~60 שעות" },
  4: { name: "AI Specialist", desc: "אסטרטגיה וטרנספורמציה", hours: "~100 שעות" },
};

export default function ManagersTrackPage() {
  const byLevel = getModulesByLevel("managers");

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
            מסלול מנהלים
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
            4 רמות - Cloud Managers
          </p>
          <div className="mt-5 h-px" style={{ background: "var(--border)" }} />
        </div>

        <TrackLevelList track="managers" byLevel={byLevel} levelLabels={LEVEL_LABELS} />
      </div>
    </main>
  );
}
