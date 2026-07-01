"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Module, Level, Track } from "@/lib/modules";
import { getProgress } from "@/lib/progress";

interface LevelLabel {
  name: string;
  desc: string;
  hours: string;
}

interface Props {
  track: Track;
  byLevel: Record<Level, Module[]>;
  levelLabels: Record<Level, LevelLabel>;
}

const LEVELS = [1, 2, 3, 4] as const;

export default function TrackLevelList({ track, byLevel, levelLabels }: Props) {
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Reads localStorage (client-only external source), not derivable during render/SSR.
    const progress = getProgress();
    const trackProgress = progress.find((p) => p.track === track);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCompleted(new Set(trackProgress?.modules.map((m) => m.moduleId) ?? []));
  }, [track]);

  const totalModules = LEVELS.reduce((sum, lv) => sum + byLevel[lv].length, 0);
  const totalCompleted = LEVELS.reduce(
    (sum, lv) => sum + byLevel[lv].filter((m) => completed.has(m.id)).length,
    0
  );
  const overallPct = totalModules > 0 ? Math.round((totalCompleted / totalModules) * 100) : 0;

  return (
    <>
      <div>
        <div className="flex items-center justify-between text-xs mb-1.5" style={{ color: "var(--text-muted)" }}>
          <span>{totalCompleted} מתוך {totalModules} מודולים</span>
          <span className="font-semibold" style={{ color: "var(--mocha-dark)" }}>{overallPct}% הושלם</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--cream-dark)" }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${overallPct}%`, background: "var(--mocha)" }} />
        </div>
      </div>

      {LEVELS.map((lv) => {
        const mods = byLevel[lv];
        const label = levelLabels[lv];
        const levelCompleted = mods.filter((m) => completed.has(m.id)).length;
        const levelPct = mods.length > 0 ? Math.round((levelCompleted / mods.length) * 100) : 0;
        const levelDone = mods.length > 0 && levelCompleted === mods.length;

        return (
          <div key={lv} className="space-y-3">
            <div className="flex items-center gap-3 flex-row-reverse">
              <div className="text-right flex-1">
                <div className="flex items-center gap-2 flex-row-reverse">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{
                      background: levelDone ? "#dff0d8" : "var(--cream-dark)",
                      color: levelDone ? "#3c7a3c" : "var(--mocha)",
                    }}>
                    {levelDone ? "✓ " : ""}רמה {lv}
                  </span>
                  <span className="font-bold text-lg" style={{ color: "var(--mocha-dark)" }}>
                    {label.name}
                  </span>
                </div>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                  {label.desc} - {label.hours} - {mods.length} מודולים
                  {mods.length > 0 ? ` - ${levelPct}% הושלם` : ""}
                </p>
                {mods.length > 0 && (
                  <div className="h-1.5 rounded-full overflow-hidden mt-1.5" style={{ background: "var(--cream-dark)" }}>
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${levelPct}%`, background: levelDone ? "#5ea15e" : "var(--mocha-light)" }} />
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
                {mods.map((mod, index) => {
                  const isDone = completed.has(mod.id);
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
                      <div className="text-base transition-colors" style={{ color: "var(--border-dark)" }}>&larr;</div>
                      <div className="flex-1 text-right">
                        <h2 className="font-semibold text-sm" style={{ color: isDone ? "#3c7a3c" : "var(--mocha-dark)" }}>
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
                        {isDone ? "✓" : index + 1}
                      </div>
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
