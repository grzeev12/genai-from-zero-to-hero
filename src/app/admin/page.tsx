import fs from "fs";
import path from "path";

interface Submission {
  id: string;
  moduleId: string;
  track: string;
  name: string;
  deliverable: string;
  submittedAt: string;
  score: number | null;
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
    <main className="min-h-screen bg-gray-950 text-white px-6 py-16">
      <div className="max-w-4xl mx-auto space-y-10">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-400 mt-1">{submissions.length} הגשות סה"כ · {Object.keys(byPerson).length} לומדים</p>
        </div>

        <div className="space-y-6">
          {Object.entries(byPerson).map(([name, subs]) => (
            <div key={name} className="rounded-2xl border border-gray-800 bg-gray-900 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg">{name}</h2>
                <span className="text-sm text-gray-400">{subs.length} מודולים הושלמו</span>
              </div>

              <div className="flex gap-2 flex-wrap">
                {subs.map((s) => (
                  <span key={s.id} className="text-xs bg-blue-900 text-blue-300 px-3 py-1 rounded-full">
                    {s.moduleId}
                  </span>
                ))}
              </div>

              <div className="space-y-3">
                {subs.map((s) => (
                  <details key={s.id} className="group">
                    <summary className="cursor-pointer text-sm text-gray-400 hover:text-white transition-colors list-none flex items-center gap-2">
                      <span className="group-open:rotate-90 transition-transform">▶</span>
                      {s.moduleId} — {new Date(s.submittedAt).toLocaleDateString("he-IL")}
                      {s.score !== null && (
                        <span className="ml-auto text-green-400 font-medium">{s.score}/100</span>
                      )}
                    </summary>
                    <div className="mt-3 pl-5 text-gray-300 text-sm whitespace-pre-wrap border-l border-gray-700">
                      {s.deliverable}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}

          {submissions.length === 0 && (
            <p className="text-gray-600 text-center py-20">אין הגשות עדיין</p>
          )}
        </div>
      </div>
    </main>
  );
}
