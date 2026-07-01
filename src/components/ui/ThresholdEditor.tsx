"use client";

import { useState } from "react";

interface Item {
  criterion: string;
  weight: number;
  minScore: number;
}

interface Props {
  moduleId: string;
  track: string;
  items: Item[];
}

export default function ThresholdEditor({ moduleId, track, items }: Props) {
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(items.map((i) => [i.criterion, i.minScore]))
  );
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  async function save(criterion: string) {
    setSaving(criterion);
    await fetch("/api/threshold", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ moduleId, track, criterion, minScore: values[criterion] }),
    });
    setSaving(null);
    setSaved((prev) => ({ ...prev, [criterion]: true }));
    setTimeout(() => setSaved((prev) => ({ ...prev, [criterion]: false })), 2000);
  }

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: "1.5px solid var(--border)" }}>
      <div className="px-5 py-3 text-right" style={{ background: "var(--cream-dark)", borderBottom: "1.5px solid var(--border)" }}>
        <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: "var(--mocha)" }}>
          ציון מינימום לכל קריטריון
        </p>
      </div>
      {items.map((item) => (
        <div key={item.criterion}
          className="flex items-center gap-4 px-5 py-3.5 flex-row-reverse"
          style={{ borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>

          {/* Criterion name + weight */}
          <div className="flex-1 text-right">
            <p className="font-semibold text-sm" style={{ color: "var(--mocha-dark)" }}>
              {item.criterion}
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>משקל {item.weight}%</p>
          </div>

          {/* Slider + value */}
          <div className="flex items-center gap-3" dir="ltr">
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={values[item.criterion]}
              onChange={(e) => setValues((prev) => ({ ...prev, [item.criterion]: Number(e.target.value) }))}
              className="w-28 accent-[var(--mocha)]"
            />
            <span className="text-sm font-bold w-8 text-center" style={{ color: "var(--mocha)" }}>
              {values[item.criterion]}
            </span>
          </div>

          {/* Save button */}
          <button
            onClick={() => save(item.criterion)}
            disabled={saving === item.criterion}
            className="text-xs px-3 py-1.5 rounded-xl font-medium transition-all shrink-0"
            style={{
              background: saved[item.criterion] ? "#f0f7f0" : "var(--cream-dark)",
              color: saved[item.criterion] ? "#4a8f4a" : "var(--mocha)",
              border: `1px solid ${saved[item.criterion] ? "#b8dab8" : "var(--border-dark)"}`,
            }}>
            {saved[item.criterion] ? "✓ נשמר" : saving === item.criterion ? "..." : "שמור"}
          </button>
        </div>
      ))}
    </div>
  );
}
