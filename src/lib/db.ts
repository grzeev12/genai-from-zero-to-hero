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

// ── Thresholds ──────────────────────────────────────────────────────────────

export async function initThresholdsTable() {
  const sql = getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS thresholds (
      module_id  TEXT NOT NULL,
      track      TEXT NOT NULL,
      criterion  TEXT NOT NULL,
      min_score  INTEGER NOT NULL DEFAULT 60,
      PRIMARY KEY (module_id, track, criterion)
    )
  `;
}

export async function getThresholds(moduleId: string, track: string) {
  const sql = getDb();
  return sql`
    SELECT criterion, min_score
    FROM thresholds
    WHERE module_id = ${moduleId} AND track = ${track}
  `;
}

export async function upsertThreshold(
  moduleId: string,
  track: string,
  criterion: string,
  minScore: number
) {
  const sql = getDb();
  await sql`
    INSERT INTO thresholds (module_id, track, criterion, min_score)
    VALUES (${moduleId}, ${track}, ${criterion}, ${minScore})
    ON CONFLICT (module_id, track, criterion)
    DO UPDATE SET min_score = ${minScore}
  `;
}
