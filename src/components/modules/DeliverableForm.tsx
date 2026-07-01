"use client";

import { useState } from "react";
import { markModuleComplete } from "@/lib/progress";

interface Props {
  moduleId: string;
  track: string;
  nextSlug: string | null;
}

export default function DeliverableForm({ moduleId, track, nextSlug }: Props) {
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || !name.trim()) return;
    setLoading(true);
    try {
      await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleId, track, name, deliverable: text }),
      });
      markModuleComplete(track, moduleId);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-3xl p-8 text-right"
        style={{
          background: "#f0f7f0",
          border: "1.5px solid #b8dab8",
          boxShadow: "0 4px 20px rgba(80,140,80,0.08)"
        }}>
        <div className="flex items-center gap-4 flex-row-reverse justify-end mb-5">
          <div>
            <h3 className="font-bold text-lg" style={{ color: "#2d6a2d" }}>Badge הושג! 🎉</h3>
            <p className="text-sm mt-1" style={{ color: "#4a8f4a" }}>סיימת את המודול הזה בהצלחה</p>
          </div>
          <span className="text-4xl">🏅</span>
        </div>
        {nextSlug && (
          <a href={`/track/${track}/${nextSlug}`}
            className="inline-block px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: "var(--mocha)",
              color: "white",
              boxShadow: "0 2px 8px rgba(124,92,62,0.3)"
            }}>
            ← המודול הבא
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-3xl p-8 text-right"
      style={{
        background: "var(--surface)",
        border: "1.5px solid var(--border)",
        boxShadow: "0 4px 24px rgba(124,92,62,0.07)"
      }}>
      <h3 className="text-xl font-bold mb-1" style={{ color: "var(--mocha-dark)" }}>
        הגשת מטלה
      </h3>
      <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
        לאחר ההגשה תקבל Badge עבור מודול זה
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="השם שלך"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-2xl px-4 py-3 text-right transition-all outline-none"
          style={{
            background: "var(--cream)",
            border: "1.5px solid var(--border)",
            color: "var(--text-primary)",
          }}
          required
        />
        <textarea
          placeholder="כתוב את המטלה שלך כאן — בשפה שלך, ללא פורמט מחייב..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          className="w-full rounded-2xl px-4 py-3 text-right resize-none transition-all outline-none"
          style={{
            background: "var(--cream)",
            border: "1.5px solid var(--border)",
            color: "var(--text-primary)",
          }}
          required
        />
        <button
          type="submit"
          disabled={loading || !text.trim() || !name.trim()}
          className="px-7 py-3 rounded-2xl font-semibold transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0"
          style={{
            background: "var(--mocha)",
            color: "white",
            boxShadow: "0 2px 8px rgba(124,92,62,0.3)"
          }}>
          {loading ? "שולח..." : "הגש וקבל Badge"}
        </button>
      </form>
    </div>
  );
}
