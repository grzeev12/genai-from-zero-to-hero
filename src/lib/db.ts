import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

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
  userId: string;
  deliverable: string;
}) {
  const sql = getDb();
  await sql`
    INSERT INTO submissions (id, module_id, track, name, user_id, deliverable)
    VALUES (${data.id}, ${data.moduleId}, ${data.track}, ${data.name}, ${data.userId}, ${data.deliverable})
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

/**
 * Latest score per module the user has ever submitted for, in this track.
 * A module present with value `null` means "submitted, score still pending"
 * (distinct from a module absent from the map, meaning never attempted).
 */
export async function getModuleScores(userId: string, track: string): Promise<Record<string, number | null>> {
  const sql = getDb();
  const rows = await sql`
    SELECT DISTINCT ON (module_id) module_id, score
    FROM submissions
    WHERE user_id = ${userId} AND track = ${track}
    ORDER BY module_id, submitted_at DESC
  `;
  return Object.fromEntries((rows as { module_id: string; score: number | null }[]).map((r) => [r.module_id, r.score]));
}

export interface OwnSubmission {
  deliverable: string;
  submitted_at: string;
  score: number | null;
  score_breakdown: { criterion: string; score: number; weight: number; feedback: string }[] | null;
  score_summary: string | null;
}

export async function getLatestSubmission(
  userId: string,
  moduleId: string,
  track: string
): Promise<OwnSubmission | null> {
  const sql = getDb();
  const rows = await sql`
    SELECT deliverable, submitted_at, score, score_breakdown, score_summary
    FROM submissions
    WHERE user_id = ${userId} AND module_id = ${moduleId} AND track = ${track}
    ORDER BY submitted_at DESC
    LIMIT 1
  `;
  return (rows[0] as OwnSubmission) ?? null;
}


// ── Module passing score (quiz model: one score 0-100 per module, default 70) ─

export async function initModuleThresholdsTable() {
  const sql = getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS module_thresholds (
      module_id TEXT NOT NULL,
      track     TEXT NOT NULL,
      min_score INTEGER NOT NULL DEFAULT 70,
      PRIMARY KEY (module_id, track)
    )
  `;
}

export async function getModuleThresholds(track: string): Promise<Record<string, number>> {
  const sql = getDb();
  const rows = await sql`
    SELECT module_id, min_score FROM module_thresholds WHERE track = ${track}
  `;
  return Object.fromEntries(
    (rows as { module_id: string; min_score: number }[]).map((r) => [r.module_id, r.min_score])
  );
}

export async function upsertModuleThreshold(moduleId: string, track: string, minScore: number) {
  const sql = getDb();
  await sql`
    INSERT INTO module_thresholds (module_id, track, min_score)
    VALUES (${moduleId}, ${track}, ${minScore})
    ON CONFLICT (module_id, track)
    DO UPDATE SET min_score = ${minScore}
  `;
}

// ── Users / Auth ────────────────────────────────────────────────────────────

export type UserRole = "admin" | "employee";

export type UserTrack = "managers" | "devops" | null;

export interface User {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  role: UserRole;
  track: UserTrack;
  created_at: string;
}

export async function initUsersTable() {
  const sql = getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id            TEXT PRIMARY KEY,
      email         TEXT UNIQUE NOT NULL,
      name          TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      role          TEXT NOT NULL DEFAULT 'employee',
      created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS track TEXT`;
  await sql`ALTER TABLE submissions ADD COLUMN IF NOT EXISTS user_id TEXT`;
}

// Bootstraps the first admin account from env vars, so there's a way in
// before any admin exists to create users through the UI. No-op once at
// least one user row exists.
export async function ensureBootstrapAdmin() {
  await initUsersTable();
  const sql = getDb();
  const existing = await sql`SELECT id FROM users LIMIT 1`;
  if (existing.length > 0) return;

  const email = process.env.BOOTSTRAP_ADMIN_EMAIL;
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;
  if (!email || !password) return;

  const passwordHash = await bcrypt.hash(password, 10);
  await sql`
    INSERT INTO users (id, email, name, password_hash, role)
    VALUES (${crypto.randomUUID()}, ${email}, ${"מנהל מערכת"}, ${passwordHash}, 'admin')
    ON CONFLICT (email) DO NOTHING
  `;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const sql = getDb();
  const rows = await sql`SELECT * FROM users WHERE email = ${email}`;
  return (rows[0] as User) ?? null;
}

export async function getUserById(id: string): Promise<User | null> {
  const sql = getDb();
  const rows = await sql`SELECT * FROM users WHERE id = ${id}`;
  return (rows[0] as User) ?? null;
}

export async function listUsers(): Promise<Omit<User, "password_hash">[]> {
  const sql = getDb();
  const rows = await sql`
    SELECT id, email, name, role, track, created_at FROM users ORDER BY created_at ASC
  `;
  return rows as Omit<User, "password_hash">[];
}

export async function createUser(data: {
  email: string;
  name: string;
  password: string;
  role: UserRole;
  track: UserTrack;
}) {
  const sql = getDb();
  const passwordHash = await bcrypt.hash(data.password, 10);
  const id = crypto.randomUUID();
  await sql`
    INSERT INTO users (id, email, name, password_hash, role, track)
    VALUES (${id}, ${data.email}, ${data.name}, ${passwordHash}, ${data.role}, ${data.track})
  `;
  return id;
}

export async function deleteUser(id: string) {
  const sql = getDb();
  await sql`DELETE FROM users WHERE id = ${id}`;
}

export async function updateUserRole(id: string, role: UserRole) {
  const sql = getDb();
  await sql`UPDATE users SET role = ${role} WHERE id = ${id}`;
}

export async function updateUserTrack(id: string, track: UserTrack) {
  const sql = getDb();
  await sql`UPDATE users SET track = ${track} WHERE id = ${id}`;
}

export async function updateUserPassword(id: string, password: string) {
  const sql = getDb();
  const passwordHash = await bcrypt.hash(password, 10);
  await sql`UPDATE users SET password_hash = ${passwordHash} WHERE id = ${id}`;
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
