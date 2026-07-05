"use client";

import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "brain_a11y";

type A11yState = {
  fs?: 0 | 1 | 2;
  contrast?: boolean;
  links?: boolean;
  nomotion?: boolean;
  font?: boolean;
};

const MODES: { key: keyof Omit<A11yState, "fs">; label: string }[] = [
  { key: "contrast", label: "ניגודיות מוגברת" },
  { key: "links", label: "הדגשת קישורים" },
  { key: "nomotion", label: "עצירת אנימציות" },
  { key: "font", label: "גופן קריא" },
];

function readState(): A11yState {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function applyState(s: A11yState) {
  const html = document.documentElement;
  html.classList.toggle("a11y-fs1", s.fs === 1);
  html.classList.toggle("a11y-fs2", s.fs === 2);
  html.classList.toggle("a11y-contrast", !!s.contrast);
  html.classList.toggle("a11y-links", !!s.links);
  html.classList.toggle("a11y-nomotion", !!s.nomotion);
  html.classList.toggle("a11y-font", !!s.font);
}

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<A11yState>(() => (typeof window === "undefined" ? {} : readState()));
  const menuRef = useRef<HTMLDivElement>(null);
  const skipLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    applyState(state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const target = document.querySelector("main") ?? document.querySelector("h1");
    if (target && skipLinkRef.current) {
      if (!target.id) target.id = "brain-main";
      skipLinkRef.current.href = `#${target.id}`;
    }
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  function update(next: A11yState) {
    setState(next);
    applyState(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function toggleFontSize() {
    const next = { ...state, fs: (((state.fs ?? 0) + 1) % 3) as 0 | 1 | 2 };
    update(next);
  }

  function toggleMode(key: keyof Omit<A11yState, "fs">) {
    update({ ...state, [key]: !state[key] });
  }

  function reset() {
    update({});
  }

  return (
    <>
      <a ref={skipLinkRef} href="#brain-main" className="brain-skip">
        דילוג לתוכן
      </a>

      <button
        id="brain-a11y-btn"
        aria-label="פתיחת תפריט נגישות"
        aria-expanded={open}
        aria-controls="brain-a11y-menu"
        onClick={() => setOpen((o) => !o)}
        style={{
          position: "fixed",
          bottom: 18,
          left: 18,
          zIndex: 99999,
          width: 44,
          height: 44,
          borderRadius: "50%",
          border: "none",
          cursor: "pointer",
          background: "#1e1b4b",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 10px rgba(30,27,75,.35)",
          padding: 0,
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="4.5" r="2.2" fill="currentColor" />
          <path
            d="M12 8c-3 0-5.5-.6-7-1l.5 2c1.5.5 3.5.8 5 .9v3.1l-2.3 6.2 1.9.8 2-5.5h-.2 2.2l2 5.5 1.9-.8L15.5 13V9.9c1.5-.1 3.5-.4 5-.9l.5-2c-1.5.4-4 1-7 1h-2z"
            fill="currentColor"
          />
        </svg>
      </button>

      {open && (
        <div
          id="brain-a11y-menu"
          ref={menuRef}
          role="dialog"
          aria-label="אפשרויות נגישות"
          dir="rtl"
          style={{
            position: "fixed",
            bottom: 72,
            left: 18,
            zIndex: 99999,
            background: "#fff",
            color: "#1e1b4b",
            borderRadius: 14,
            boxShadow: "0 6px 30px rgba(30,27,75,.25)",
            padding: 14,
            width: 230,
            textAlign: "right",
            fontFamily: "Arial, sans-serif",
            fontSize: 14,
          }}
        >
          <h2 style={{ fontSize: 15, margin: "0 0 10px" }}>נגישות</h2>

          <button
            onClick={toggleFontSize}
            aria-pressed={!!state.fs}
            className="brain-a11y-menu-btn"
            style={menuButtonStyle(!!state.fs)}
          >
            הגדלת טקסט
          </button>

          {MODES.map((m) => (
            <button
              key={m.key}
              onClick={() => toggleMode(m.key)}
              aria-pressed={!!state[m.key]}
              style={menuButtonStyle(!!state[m.key])}
            >
              {m.label}
            </button>
          ))}

          <button onClick={reset} style={menuButtonStyle(false)}>
            איפוס
          </button>

          <a
            href="/accessibility"
            style={{ display: "block", marginTop: 10, fontSize: 12, color: "#4f46e5" }}
          >
            הצהרת נגישות
          </a>
        </div>
      )}
    </>
  );
}

function menuButtonStyle(pressed: boolean): React.CSSProperties {
  return {
    display: "block",
    width: "100%",
    margin: "4px 0",
    padding: "8px 10px",
    borderRadius: 8,
    border: `1px solid ${pressed ? "#4f46e5" : "#e0e7ff"}`,
    background: pressed ? "#4f46e5" : "#f8fafc",
    color: pressed ? "#fff" : "#1e1b4b",
    cursor: "pointer",
    fontSize: 13,
    textAlign: "right",
  };
}
