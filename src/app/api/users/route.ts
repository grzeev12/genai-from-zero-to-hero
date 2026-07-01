import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { initUsersTable, createUser, listUsers, getUserByEmail } from "@/lib/db";

async function requireAdmin() {
  const session = await auth();
  return session?.user?.role === "admin";
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await initUsersTable();
  const users = await listUsers();
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { email, name, password, role, track } = await req.json();
  if (!email || !name || !password || !role || !track) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  if (role !== "admin" && role !== "employee") {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }
  if (track !== "managers" && track !== "devops") {
    return NextResponse.json({ error: "Invalid track" }, { status: 400 });
  }

  await initUsersTable();
  const normalizedEmail = String(email).trim().toLowerCase();
  const existing = await getUserByEmail(normalizedEmail);
  if (existing) {
    return NextResponse.json({ error: "משתמש עם אימייל זה כבר קיים" }, { status: 409 });
  }

  const id = await createUser({ email: normalizedEmail, name, password, role, track });
  return NextResponse.json({ ok: true, id });
}
