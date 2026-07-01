import Link from "next/link";
import { getModulesByLevel } from "@/lib/modules";

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

        {([1, 2, 3, 4] as const).map((lv) => {
          const mods = byLevel[lv];
          const label = LEVEL_LABELS[lv];
          return (
            <div key={lv} className="space-y-3">
              <div className="flex items-center gap-3 flex-row-reverse">
                <div className="text-right">
                  <div className="flex items-center gap-2 flex-row-reverse">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{ background: "var(--cream-dark)", color: "var(--mocha)" }}>
                      רמה {lv}
                    </span>
                    <span className="font-bold text-lg" style={{ color: "var(--mocha-dark)" }}>
                      {label.name}
                    </span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                    {label.desc} - {label.hours} - {mods.length} מודולים
                  </p>
                </div>
              </div>

              {mods.length === 0 ? (
                <div className="p-4 rounded-2xl text-right text-sm"
                  style={{ background: "var(--surface)", border: "1.5px dashed var(--border)", color: "var(--text-muted)" }}>
                  בפיתוח
                </div>
              ) : (
                <div className="space-y-2">
                  {mods.map((mod, index) => (
                    <Link
                      key={mod.id}
                      href={`/track/managers/${mod.slug}`}
                      className="group flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 hover:-translate-y-0.5"
                      style={{
                        background: "var(--surface)",
                        border: "1.5px solid var(--border)",
                        boxShadow: "0 1px 6px rgba(124,92,62,0.05)"
                      }}
                    >
                      <div className="text-base transition-colors" style={{ color: "var(--border-dark)" }}>&larr;</div>
                      <div className="flex-1 text-right">
                        <h2 className="font-semibold text-sm" style={{ color: "var(--mocha-dark)" }}>
                          {mod.title}
                        </h2>
                        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                          {mod.estimatedTime}
                        </p>
                      </div>
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                        style={{ background: "var(--cream-dark)", color: "var(--mocha)" }}>
                        {index + 1}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
