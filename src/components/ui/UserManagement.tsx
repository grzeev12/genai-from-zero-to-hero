"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Track = "managers" | "devops";

interface UserRow {
  id: string;
  email: string;
  name: string;
  role: "admin" | "employee";
  track: Track | null;
  created_at: string;
}

interface Props {
  users: UserRow[];
  currentUserId: string;
}

function trackLabel(track: Track | null): string {
  if (track === "managers") return "מנהלים";
  if (track === "devops") return "DevOps";
  return "לא הוגדר";
}

export default function UserManagement({ users, currentUserId }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "employee">("employee");
  const [track, setTrack] = useState<Track>("managers");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, password, role, track }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "שגיאה ביצירת משתמש");
        return;
      }
      setEmail("");
      setName("");
      setPassword("");
      setRole("employee");
      setTrack("managers");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function handleRoleChange(id: string, newRole: "admin" | "employee") {
    await fetch(`/api/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    router.refresh();
  }

  async function handleTrackChange(id: string, newTrack: Track) {
    await fetch(`/api/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ track: newTrack }),
    });
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("למחוק את המשתמש הזה?")) return;
    await fetch(`/api/users/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="text-right">
        <h2 className="text-xl font-bold" style={{ color: "var(--mocha-dark)" }}>ניהול משתמשים</h2>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          יצירת חשבונות עובדים/מנהלים. רק מנהל יכול ליצור משתמשים. עובד רואה ונכנס רק למסלול שהוקצה לו.
        </p>
      </div>

      {/* Create user form */}
      <form onSubmit={handleCreate}
        className="rounded-3xl p-5 space-y-3"
        style={{ background: "var(--surface)", border: "1.5px solid var(--border)" }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            dir="auto"
            placeholder="שם מלא"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl px-3 py-2 text-right text-sm outline-none"
            style={{ background: "var(--cream)", border: "1.5px solid var(--border)", color: "var(--text-primary)" }}
            required
          />
          <input
            type="email"
            dir="ltr"
            placeholder="אימייל"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl px-3 py-2 text-right text-sm outline-none"
            style={{ background: "var(--cream)", border: "1.5px solid var(--border)", color: "var(--text-primary)" }}
            required
          />
          <input
            type="password"
            dir="ltr"
            placeholder="סיסמה זמנית"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-xl px-3 py-2 text-right text-sm outline-none"
            style={{ background: "var(--cream)", border: "1.5px solid var(--border)", color: "var(--text-primary)" }}
            required
            minLength={8}
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as "admin" | "employee")}
            className="rounded-xl px-3 py-2 text-right text-sm outline-none"
            style={{ background: "var(--cream)", border: "1.5px solid var(--border)", color: "var(--text-primary)" }}>
            <option value="employee">עובד</option>
            <option value="admin">מנהל</option>
          </select>
          <select
            value={track}
            onChange={(e) => setTrack(e.target.value as Track)}
            className="rounded-xl px-3 py-2 text-right text-sm outline-none sm:col-span-2"
            style={{ background: "var(--cream)", border: "1.5px solid var(--border)", color: "var(--text-primary)" }}>
            <option value="managers">מסלול: מנהלים</option>
            <option value="devops">מסלול: DevOps</option>
          </select>
        </div>
        {error && <p className="text-sm text-right" style={{ color: "#c04a4a" }}>{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-40"
          style={{ background: "var(--mocha)", color: "white" }}>
          {loading ? "יוצר..." : "צור משתמש"}
        </button>
      </form>

      {/* User list */}
      <div className="rounded-3xl overflow-hidden" style={{ border: "1.5px solid var(--border)" }}>
        {users.map((u) => (
          <div key={u.id}
            className="flex items-center gap-3 px-5 py-3.5 flex-row-reverse flex-wrap"
            style={{ borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
            <div className="flex-1 text-right min-w-[140px]">
              <p className="font-semibold text-sm" style={{ color: "var(--mocha-dark)" }}>{u.name}</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }} dir="ltr">{u.email}</p>
            </div>
            <select
              value={u.role}
              onChange={(e) => handleRoleChange(u.id, e.target.value as "admin" | "employee")}
              disabled={u.id === currentUserId}
              className="text-xs px-2 py-1.5 rounded-lg outline-none disabled:opacity-50"
              style={{ background: "var(--cream-dark)", color: "var(--mocha)", border: "1px solid var(--border-dark)" }}>
              <option value="employee">עובד</option>
              <option value="admin">מנהל</option>
            </select>
            <select
              value={u.track ?? ""}
              onChange={(e) => handleTrackChange(u.id, e.target.value as Track)}
              className="text-xs px-2 py-1.5 rounded-lg outline-none"
              style={{ background: "var(--cream-dark)", color: "var(--mocha)", border: "1px solid var(--border-dark)" }}>
              <option value="" disabled>{trackLabel(u.track)}</option>
              <option value="managers">מנהלים</option>
              <option value="devops">DevOps</option>
            </select>
            <button
              onClick={() => handleDelete(u.id)}
              disabled={u.id === currentUserId}
              className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ background: "#fdf0ee", color: "#c04a4a", border: "1px solid #eec9c2" }}>
              מחק
            </button>
          </div>
        ))}
        {users.length === 0 && (
          <div className="py-8 text-center text-sm" style={{ color: "var(--text-muted)" }}>
            אין משתמשים עדיין
          </div>
        )}
      </div>
    </div>
  );
}
