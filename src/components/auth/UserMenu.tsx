"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function UserMenu() {
  const { data: session } = useSession();
  if (!session?.user) return null;

  return (
    <div className="flex items-center gap-3 flex-row-reverse text-sm" style={{ color: "var(--text-muted)" }}>
      <span>שלום, {session.user.name}</span>
      {session.user.role === "admin" && (
        <Link href="/admin" className="font-semibold transition-colors" style={{ color: "var(--mocha)" }}>
          ניהול
        </Link>
      )}
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="transition-colors"
        style={{ color: "var(--text-muted)" }}>
        התנתקות
      </button>
    </div>
  );
}
