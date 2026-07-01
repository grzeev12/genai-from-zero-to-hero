import { neon } from "@neondatabase/serverless";

function getDb() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
  return neon(process.env.DATABASE_URL);
}

export async function initDb() {
  const sql = getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS submissions (
      id           TEXT PRIMARY KEY,
      module_id    TEXT NOT NULL,
      track        TEXT NOT NULL,
      name         TEXT NOT NULL,
      deliverable  TEXT NOT NULL,
      submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      score        INTEGER,
      score_breakdown JSONB,
      score_summary   TEXT
    )
  `;
}

export async function saveSubmission(data: {
  id: string;
  moduleId: string;
  track: string;
  name: string;
  deliverable: string;
}) {
  const sql = getDb();
  await sql`
    INSERT INTO submissions (id, module_id, track, name, deliverable)
    VALUES (${data.id}, ${data.moduleId}, ${data.track}, ${data.name}, ${data.deliverable})
  `;
}

export async function updateScore(id: string, score: number, breakdown: unknown, summary: string) {
  const sql = getDb();
  await sql`
    UPDATE submissions
    SET score = ${score},
        score_breakdown = ${JSON.stringify(breakdown)},
        score_summary = ${summary}
    WHERE id = ${id}
  `;
}

export async function getAllSubmissions() {
  const sql = getDb();
  return sql`SELECT * FROM submissions ORDER BY submitted_at DESC`;
}
