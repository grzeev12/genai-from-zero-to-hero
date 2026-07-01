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
      <div className="rounded-2xl border border-green-800 bg-green-950 p-6 space-y-4 text-right">
        <div className="flex items-center gap-3 flex-row-reverse justify-end">
          <div>
            <h3 className="font-bold text-green-300">!Badge הושג</h3>
            <p className="text-green-500 text-sm">סיימת את המודול הזה בהצלחה</p>
          </div>
          <span className="text-3xl">🏅</span>
        </div>
        {nextSlug && (
          <a
            href={`/track/${track}/${nextSlug}`}
            className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
          >
            ← מודול הבא
          </a>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border-t border-gray-800 pt-8 text-right">
      <h3 className="text-lg font-semibold">הגשת Deliverable</h3>
      <input
        type="text"
        placeholder="השם שלך"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors text-right"
        required
      />
      <textarea
        placeholder="כתוב את ה-deliverable שלך כאן..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none text-right"
        required
      />
      <button
        type="submit"
        disabled={loading || !text.trim() || !name.trim()}
        className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium transition-colors"
      >
        {loading ? "שולח..." : "הגש וקבל Badge"}
      </button>
    </form>
  );
}
