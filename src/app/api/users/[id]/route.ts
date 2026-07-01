import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { deleteUser, updateUserRole, updateUserPassword, updateUserTrack } from "@/lib/db";

async function requireAdmin() {
  const session = await auth();
  return session;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const { role, password, track } = await req.json();

  if (role) {
    if (role !== "admin" && role !== "employee") {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }
    if (id === session.user.id && role !== "admin") {
      return NextResponse.json({ error: "לא ניתן להסיר הרשאת מנהל מעצמך" }, { status: 400 });
    }
    await updateUserRole(id, role);
  }

  if (track) {
    if (track !== "managers" && track !== "devops") {
      return NextResponse.json({ error: "Invalid track" }, { status: 400 });
    }
    await updateUserTrack(id, track);
  }

  if (password) {
    await updateUserPassword(id, password);
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  if (id === session.user.id) {
    return NextResponse.json({ error: "לא ניתן למחוק את המשתמש שלך" }, { status: 400 });
  }

  await deleteUser(id);
  return NextResponse.json({ ok: true });
}
