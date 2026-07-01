"use client";

import { useState } from "react";

interface ModuleRow {
  id: string;
  title: string;
  level: number;
}

interface Props {
  track: string;
  modules: ModuleRow[];
  savedThresholds: Record<string, number>;
  defaultScore: number;
}

export default function ModuleThresholdEditor({ track, modules, savedThresholds, defaultScore }: Props) {
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(modules.map((m) => [m.id, savedThresholds[m.id] ?? defaultScore]))
  );
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  async function save(moduleId: string) {
    setSaving(moduleId);
    await fetch("/api/module-threshold", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ moduleId, track, minScore: values[moduleId] }),
    });
    setSaving(null);
    setSaved((prev) => ({ ...prev, [moduleId]: true }));
    setTimeout(() => setSaved((prev) => ({ ...prev, [moduleId]: false })), 2000);
  }

  return (
    <details className="rounded-2xl overflow-hidden" style={{ border: "1.5px solid var(--border)" }}>
      <summary className="px-5 py-3 cursor-pointer text-right text-xs font-semibold tracking-widest uppercase"
        style={{ background: "var(--cream-dark)", color: "var(--mocha)" }}>
        {track === "managers" ? "מסלול מנהלים" : "מסלול DevOps"} · {modules.length} מודולים
      </summary>
      {modules.map((mod) => (
        <div key={mod.id}
          className="flex items-center gap-4 px-5 py-3.5 flex-row-reverse"
          style={{ borderTop: "1px solid var(--border)", background: "var(--surface)" }}>

          <div className="flex-1 text-right">
            <p className="font-semibold text-sm" style={{ color: "var(--mocha-dark)" }}>{mod.title}</p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }} dir="ltr">{mod.id} · רמה {mod.level}</p>
          </div>

          <div className="flex items-center gap-3" dir="ltr">
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={values[mod.id]}
              onChange={(e) => setValues((prev) => ({ ...prev, [mod.id]: Number(e.target.value) }))}
              className="w-28 accent-[var(--mocha)]"
            />
            <span className="text-sm font-bold w-8 text-center" style={{ color: "var(--mocha)" }}>
              {values[mod.id]}
            </span>
          </div>

          <button
            onClick={() => save(mod.id)}
            disabled={saving === mod.id}
            className="text-xs px-3 py-1.5 rounded-xl font-medium transition-all shrink-0"
            style={{
              background: saved[mod.id] ? "#f0f7f0" : "var(--cream-dark)",
              color: saved[mod.id] ? "#4a8f4a" : "var(--mocha)",
              border: `1px solid ${saved[mod.id] ? "#b8dab8" : "var(--border-dark)"}`,
            }}>
            {saved[mod.id] ? "✓ נשמר" : saving === mod.id ? "..." : "שמור"}
          </button>
        </div>
      ))}
    </details>
  );
}
