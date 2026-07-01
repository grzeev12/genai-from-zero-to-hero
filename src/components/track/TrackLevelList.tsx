import Link from "next/link";
import type { Module, Level, Track } from "@/lib/modules";
import LevelBadge from "@/components/badges/LevelBadge";
import { LEVEL_NAMES, type LevelProgress } from "@/lib/track-progress";

interface LevelLabel {
  desc: string;
  hours: string;
}

interface Props {
  track: Track;
  modules: Module[];
  completedIds: Set<string>;
  byLevel: LevelProgress[];
  levelLabels: Record<Level, LevelLabel>;
  percent: number;
  completedCount: number;
  totalModules: number;
  isAdmin?: boolean;
}

const LEVELS = [1, 2, 3, 4] as const;

export default function TrackLevelList({
  track,
  modules,
  completedIds,
  byLevel,
  levelLabels,
  percent,
  completedCount,
  totalModules,
  isAdmin = false,
}: Props) {
  const firstIncompleteIdx = modules.findIndex((m) => !completedIds.has(m.id));
  const nextIndex = isAdmin ? modules.length : (firstIncompleteIdx === -1 ? modules.length : firstIncompleteIdx);

  return (
    <>
      <div>
        <div className="flex items-center justify-between text-xs mb-1.5" style={{ color: "var(--text-muted)" }}>
          <span>{completedCount} מתוך {totalModules} מודולים</span>
          <span className="font-semibold" style={{ color: "var(--mocha-dark)" }}>{percent}% הושלם</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--cream-dark)" }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${percent}%`, background: "var(--mocha)" }} />
        </div>
      </div>

      {LEVELS.map((lv) => {
        const mods = modules.filter((m) => m.level === lv);
        const label = levelLabels[lv];
        const lp = byLevel.find((b) => b.level === lv)!;
        const levelDone = lp.status === "earned";

        return (
          <div key={lv} className="space-y-3">
            <div className="flex items-center gap-3 flex-row-reverse">
              <LevelBadge level={lv} name={LEVEL_NAMES[lv]} status={lp.status} percent={lp.percent} />
              <div className="text-right flex-1">
                <p className="font-bold text-lg" style={{ color: "var(--mocha-dark)" }}>
                  רמה {lv} · {LEVEL_NAMES[lv]}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                  {label.desc} - {label.hours} - {mods.length} מודולים
                  {mods.length > 0 ? ` - ${lp.percent}% הושלם` : ""}
                </p>
                {mods.length > 0 && (
                  <div className="h-1.5 rounded-full overflow-hidden mt-1.5" style={{ background: "var(--cream-dark)" }}>
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${lp.percent}%`, background: levelDone ? "#5ea15e" : "var(--mocha-light)" }} />
                  </div>
                )}
              </div>
            </div>

            {mods.length === 0 ? (
              <div className="p-4 rounded-2xl text-right text-sm"
                style={{ background: "var(--surface)", border: "1.5px dashed var(--border)", color: "var(--text-muted)" }}>
                בפיתוח
              </div>
            ) : (
              <div className="space-y-2">
                {mods.map((mod) => {
                  const globalIndex = modules.findIndex((m) => m.id === mod.id);
                  const isDone = completedIds.has(mod.id);
                  const isLocked = !isDone && globalIndex > nextIndex;
                  const levelIndex = modules.filter((m) => m.level === mod.level).indexOf(mod);

                  const content = (
                    <>
                      <div className="text-base transition-colors" style={{ color: "var(--border-dark)" }}>
                        {isLocked ? "🔒" : "‹"}
                      </div>
                      <div className="flex-1 text-right">
                        <h2 className="font-semibold text-sm" style={{ color: isDone ? "#3c7a3c" : isLocked ? "var(--text-muted)" : "var(--mocha-dark)" }}>
                          {mod.title}
                        </h2>
                        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                          {mod.estimatedTime}
                        </p>
                      </div>
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                        style={{
                          background: isDone ? "#5ea15e" : "var(--cream-dark)",
                          color: isDone ? "white" : "var(--mocha)",
                        }}>
                        {isDone ? "✓" : levelIndex + 1}
                      </div>
                    </>
                  );

                  if (isLocked) {
                    return (
                      <div key={mod.id}
                        className="flex items-center gap-4 p-4 rounded-2xl cursor-not-allowed"
                        style={{ background: "var(--cream)", border: "1.5px dashed var(--border)", opacity: 0.65 }}>
                        {content}
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={mod.id}
                      href={`/track/${track}/${mod.slug}`}
                      className="group flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 hover:-translate-y-0.5"
                      style={{
                        background: isDone ? "#f0f7f0" : "var(--surface)",
                        border: isDone ? "1.5px solid #b8dab8" : "1.5px solid var(--border)",
                        boxShadow: "0 1px 6px rgba(124,92,62,0.05)"
                      }}
                    >
                      {content}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
