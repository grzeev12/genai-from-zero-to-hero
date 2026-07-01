import fs from "fs";
import path from "path";
import ScoringTable from "@/components/ui/ScoringTable";

interface BreakdownItem {
  criterion: string;
  score: number;
  weight: number;
  feedback: string;
}

interface Submission {
  id: string;
  moduleId: string;
  track: string;
  name: string;
  deliverable: string;
  submittedAt: string;
  score: number | null;
  scoreBreakdown: BreakdownItem[] | null;
  scoreSummary: string | null;
}

function getSubmissions(): Submission[] {
  const file = path.join(process.cwd(), "data", "submissions.json");
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

export default function AdminPage() {
  const submissions = getSubmissions();
  const byPerson = submissions.reduce<Record<string, Submission[]>>((acc, s) => {
    if (!acc[s.name]) acc[s.name] = [];
    acc[s.name].push(s);
    return acc;
  }, {});

  return (
    <main className="min-h-screen px-6 py-16" style={{ background: "var(--cream)" }}>
      <div className="max-w-4xl mx-auto space-y-10">

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
                  {subs.length} מודולים הושלמו
                </span>
              </div>

              {/* Badges */}
              <div className="flex gap-2 flex-wrap flex-row-reverse">
                {subs.map((s) => (
                  <span key={s.id}
                    className="text-xs px-3 py-1 rounded-full font-medium"
                    style={{ background: "var(--cream-dark)", color: "var(--mocha-light)" }}
                    dir="ltr">
                    🏅 {s.moduleId}
                  </span>
                ))}
              </div>

              {/* Submissions */}
              <div className="space-y-2 pt-1">
                {subs.map((s) => (
                  <details key={s.id} className="group">
                    <summary className="cursor-pointer text-sm list-none flex items-center gap-3 flex-row-reverse py-2 transition-colors"
                      style={{ color: "var(--text-secondary)" }}>
                      <span className="transition-transform group-open:rotate-90">◀</span>
                      <span dir="ltr" className="font-medium" style={{ color: "var(--mocha)" }}>{s.moduleId}</span>
                      <span style={{ color: "var(--border-dark)" }}>·</span>
                      <span>{new Date(s.submittedAt).toLocaleDateString("he-IL")}</span>
                      {s.score !== null && (
                        <span className="mr-auto font-bold" style={{ color: "#4a8f4a" }}>{s.score}/100</span>
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
                      {s.scoreBreakdown && s.score !== null && s.scoreSummary && (
                        <ScoringTable
                          breakdown={s.scoreBreakdown}
                          total={s.score}
                          summary={s.scoreSummary}
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
