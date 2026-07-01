export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import ScoringTable from "@/components/ui/ScoringTable";
import ThresholdEditor from "@/components/ui/ThresholdEditor";
import UserManagement from "@/components/ui/UserManagement";
import UserMenu from "@/components/auth/UserMenu";
import {
  initDb,
  getAllSubmissions,
  initThresholdsTable,
  getThresholds,
  initUsersTable,
  listUsers,
} from "@/lib/db";
import { getModules } from "@/lib/modules";

interface BreakdownItem {
  criterion: string;
  score: number;
  weight: number;
  feedback: string;
}

interface Submission {
  id: string;
  module_id: string;
  track: string;
  name: string;
  deliverable: string;
  submitted_at: string;
  score: number | null;
  score_breakdown: BreakdownItem[] | null;
  score_summary: string | null;
}

export default async function AdminPage() {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    redirect("/");
  }

  await initDb();
  await initThresholdsTable();
  await initUsersTable();
  const rows = await getAllSubmissions();
  const submissions = rows as unknown as Submission[];
  const users = await listUsers();

  const totalModulesByTrack: Record<string, number> = {
    managers: getModules("managers").length,
    devops: getModules("devops").length,
  };

  // Load all manager modules and their current thresholds
  const managerModules = getModules("managers");
  const moduleThresholds = await Promise.all(
    managerModules.map(async (mod) => {
      const saved = await getThresholds(mod.id, "managers");
      const savedMap = Object.fromEntries(
        (saved as { criterion: string; min_score: number }[]).map((r) => [r.criterion, r.min_score])
      );
      return {
        module: mod,
        items: (mod.rubric ?? []).map((r) => ({
          criterion: r.criterion,
          weight: r.weight,
          minScore: savedMap[r.criterion] ?? 60,
        })),
      };
    })
  );

  const byPerson = submissions.reduce<Record<string, Submission[]>>((acc, s) => {
    if (!acc[s.name]) acc[s.name] = [];
    acc[s.name].push(s);
    return acc;
  }, {});

  function byTrack(subs: Submission[]): Record<string, Submission[]> {
    return subs.reduce<Record<string, Submission[]>>((acc, s) => {
      if (!acc[s.track]) acc[s.track] = [];
      acc[s.track].push(s);
      return acc;
    }, {});
  }

  function trackLabel(track: string): string {
    return track === "managers" ? "מסלול מנהלים" : track === "devops" ? "מסלול DevOps" : track;
  }

  return (
    <main className="min-h-screen px-6 py-16" style={{ background: "var(--cream)" }}>
      <div className="max-w-4xl mx-auto space-y-10">

        <div className="flex justify-start">
          <UserMenu />
        </div>

        {/* Header */}
        <div className="text-right">
          <p className="text-xs font-semibold tracking-widest uppercase mb-2"
            style={{ color: "var(--mocha-light)" }}>
            ניהול מערכת
          </p>
          <h1 className="text-4xl font-bold" style={{ color: "var(--mocha-dark)" }}>
            לוח בקרה
          </h1>
          <div className="flex gap-6 mt-3 flex-row-reverse">
            <span className="text-sm" style={{ color: "var(--text-muted)" }}>
              {submissions.length} הגשות סה״כ
            </span>
            <span className="text-sm" style={{ color: "var(--text-muted)" }}>
              {Object.keys(byPerson).length} לומדים פעילים
            </span>
          </div>
          <div className="mt-5 h-px" style={{ background: "var(--border)" }} />
        </div>

        {/* User management */}
        <UserManagement users={users} currentUserId={session.user.id} />

        <div className="h-px" style={{ background: "var(--border)" }} />

        {/* Threshold settings */}
        <div className="space-y-4">
          <div className="text-right">
            <h2 className="text-xl font-bold" style={{ color: "var(--mocha-dark)" }}>ספי ציון מינימום</h2>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
              הגדר את הציון המינימלי הנדרש לכל קריטריון בכל מודול
            </p>
          </div>
          {moduleThresholds.map(({ module, items }) => (
            <div key={module.id} className="rounded-3xl p-5 space-y-3"
              style={{ background: "var(--surface)", border: "1.5px solid var(--border)" }}>
              <div className="text-right">
                <p className="text-xs font-medium mb-0.5" style={{ color: "var(--mocha-light)" }} dir="ltr">{module.id}</p>
                <p className="font-semibold" style={{ color: "var(--mocha-dark)" }}>{module.title}</p>
              </div>
              <ThresholdEditor moduleId={module.id} track="managers" items={items} />
            </div>
          ))}
        </div>

        <div className="h-px" style={{ background: "var(--border)" }} />

        {/* Learners */}
        <div className="space-y-5">
          {Object.entries(byPerson).map(([name, subs]) => (
            <div key={name} className="rounded-3xl p-6 space-y-4 text-right"
              style={{
                background: "var(--surface)",
                border: "1.5px solid var(--border)",
                boxShadow: "0 2px 12px rgba(124,92,62,0.06)"
              }}>
              {/* Person header */}
              <div className="flex items-center justify-between flex-row-reverse">
                <h2 className="font-bold text-lg" style={{ color: "var(--mocha-dark)" }}>{name}</h2>
                <span className="text-xs px-3 py-1.5 rounded-full font-medium"
                  style={{ background: "var(--cream-dark)", color: "var(--mocha)" }}>
                  {subs.length} הגשות סה״כ
                </span>
              </div>

              {Object.entries(byTrack(subs)).map(([track, trackSubs]) => {
                const total = totalModulesByTrack[track] ?? 0;
                const completedCount = new Set(trackSubs.map((s) => s.module_id)).size;
                const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;

                return (
                  <div key={track} className="space-y-3 pt-1">
                    {/* Track completion bar */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span style={{ color: "var(--text-muted)" }}>
                          {completedCount} מתוך {total} מודולים
                        </span>
                        <span className="font-semibold" style={{ color: "var(--mocha-dark)" }}>
                          {trackLabel(track)} · {pct}%
                        </span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--cream-dark)" }}>
                        <div className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, background: pct === 100 ? "#5ea15e" : "var(--mocha)" }} />
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex gap-2 flex-wrap flex-row-reverse">
                      {trackSubs.map((s) => (
                        <span key={s.id}
                          className="text-xs px-3 py-1 rounded-full font-medium"
                          style={{ background: "var(--cream-dark)", color: "var(--mocha-light)" }}
                          dir="ltr">
                          🏅 {s.module_id}
                        </span>
                      ))}
                    </div>

                    {/* Submissions */}
                    <div className="space-y-2">
                      {trackSubs.map((s) => (
                        <details key={s.id} className="group">
                          <summary className="cursor-pointer text-sm list-none flex items-center gap-3 flex-row-reverse py-2 transition-colors"
                            style={{ color: "var(--text-secondary)" }}>
                            <span className="transition-transform group-open:rotate-90">◀</span>
                            <span dir="ltr" className="font-medium" style={{ color: "var(--mocha)" }}>{s.module_id}</span>
                            <span style={{ color: "var(--border-dark)" }}>·</span>
                            <span>{new Date(s.submitted_at).toLocaleDateString("he-IL")}</span>
                            {s.score !== null ? (
                              <span className="mr-auto flex items-center gap-2" dir="ltr">
                                <span className="font-bold" style={{ color: "#4a8f4a" }}>{s.score}/100</span>
                                <span className="h-1.5 w-16 rounded-full overflow-hidden" style={{ background: "var(--cream-dark)" }}>
                                  <span className="block h-full rounded-full"
                                    style={{ width: `${s.score}%`, background: s.score >= 60 ? "#5ea15e" : "#c97b5a" }} />
                                </span>
                              </span>
                            ) : (
                              <span className="mr-auto text-xs" style={{ color: "var(--text-muted)" }}>⏳</span>
                            )}
                          </summary>
                          <div className="mt-3 space-y-3">
                            <div className="pr-5 text-sm whitespace-pre-wrap leading-relaxed rounded-xl p-4"
                              style={{
                                borderRight: "3px solid var(--border-dark)",
                                background: "var(--cream)",
                                color: "var(--text-secondary)"
                              }}>
                              {s.deliverable}
                            </div>
                            {s.score_breakdown && s.score !== null && s.score_summary && (
                              <ScoringTable
                                breakdown={s.score_breakdown}
                                total={s.score}
                                summary={s.score_summary}
                              />
                            )}
                            {s.score === null && (
                              <p className="text-xs text-right" style={{ color: "var(--text-muted)" }}>
                                ⏳ בהמתנה לציון אוטומטי...
                              </p>
                            )}
                          </div>
                        </details>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          {submissions.length === 0 && (
            <div className="text-center py-24" style={{ color: "var(--text-muted)" }}>
              <p className="text-4xl mb-4">📭</p>
              <p>אין הגשות עדיין</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
