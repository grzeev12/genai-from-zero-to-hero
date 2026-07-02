"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { QuizQuestion } from "@/lib/modules";

interface Props {
  moduleId: string;
  track: string;
  moduleTitle: string;
  questions: QuizQuestion[];
  nextSlug: string | null;
  initialAnswers?: string[];
}

export default function QuizForm({ moduleId, track, moduleTitle, questions, nextSlug, initialAnswers }: Props) {
  const router = useRouter();
  const [answers, setAnswers] = useState<string[]>(
    initialAnswers ?? Array(questions.length).fill("")
  );
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(0);

  function setAnswer(i: number, val: string) {
    setAnswers((prev) => { const next = [...prev]; next[i] = val; return next; });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (answers.some((a) => !a.trim())) return;
    setLoading(true);
    try {
      const quizAnswers = questions.map((q, i) => ({
        question: q.text,
        answer: answers[i],
      }));
      await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleId, track, quizAnswers }),
      });
      setSubmitted(true);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-3xl p-8 text-right"
        style={{ background: "#f0f7f0", border: "1.5px solid #b8dab8" }}>
        <div className="flex items-center gap-4 flex-row-reverse justify-end mb-5">
          <div>
            <h3 className="font-bold text-lg" style={{ color: "#2d6a2d" }}>Badge הושג!</h3>
            <p className="text-sm mt-1" style={{ color: "#4a8f4a" }}>
              תשובותיך נשלחו. הציון מחושב ברקע.
            </p>
          </div>
          <span className="text-4xl">🏅</span>
        </div>
        {nextSlug && (
          <a href={`/track/${track}/${nextSlug}`}
            className="inline-block px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
            style={{ background: "var(--mocha)", color: "white" }}>
            המודול הבא
          </a>
        )}
      </div>
    );
  }

  const answered = answers.filter((a) => a.trim()).length;
  const progress = Math.round((answered / questions.length) * 100);

  return (
    <div className="rounded-3xl p-8 text-right"
      style={{ background: "var(--surface)", border: "1.5px solid var(--border)", boxShadow: "0 4px 24px rgba(124,92,62,0.07)" }}>

      <div className="mb-6">
        <h3 className="text-xl font-bold mb-1" style={{ color: "var(--mocha-dark)" }}>
          10 שאלות - הוכחת ידע
        </h3>
        <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
          ענה על כל השאלות. תשובות ספציפיות מהניסיון שלך - לא מהאינטרנט.
        </p>
        <div className="flex items-center gap-3 flex-row-reverse">
          <span className="text-xs font-bold" style={{ color: "var(--mocha)" }}>
            {answered}/10
          </span>
          <div className="flex-1 h-1.5 rounded-full" style={{ background: "var(--cream-dark)" }}>
            <div className="h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%`, background: "var(--mocha)" }} />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex gap-2 flex-row-reverse flex-wrap">
          {questions.map((_, i) => (
            <button key={i} type="button" onClick={() => setCurrent(i)}
              className="w-8 h-8 rounded-full text-xs font-bold transition-all flex items-center justify-center"
              style={{
                background: current === i
                  ? "var(--mocha-dark)"
                  : answers[i]?.trim()
                  ? "var(--mocha)"
                  : "var(--cream)",
                color: current === i || answers[i]?.trim() ? "white" : "var(--mocha)",
                border: current === i ? "2px solid var(--mocha-dark)" : "1.5px solid var(--border)",
              }}>
              {i + 1}
            </button>
          ))}
        </div>

        <div className="rounded-2xl p-5" style={{ background: "var(--cream)", border: "1.5px solid var(--border)" }}>
          <p className="text-sm font-semibold mb-3" style={{ color: "var(--mocha-dark)" }}>
            <span style={{ color: "var(--mocha-light)" }}>שאלה {current + 1} מתוך 10</span>
            <br />
            {questions[current].text}
          </p>
          <textarea
            key={current}
            dir="auto"
            value={answers[current]}
            onChange={(e) => setAnswer(current, e.target.value)}
            onPaste={(e) => e.preventDefault()}
            rows={4}
            placeholder="תשובה מנסיון אישי..."
            className="w-full rounded-xl px-4 py-3 text-right resize-none outline-none text-sm"
            style={{ background: "white", border: "1.5px solid var(--border)", color: "var(--text-primary)" }}
          />
          <div className="flex gap-2 mt-3 flex-row-reverse">
            {current < questions.length - 1 && (
              <button type="button" onClick={() => setCurrent((c) => c + 1)}
                className="px-4 py-2 rounded-xl text-sm font-semibold"
                style={{ background: "var(--mocha-dark)", color: "white" }}>
                הבא
              </button>
            )}
            {current > 0 && (
              <button type="button" onClick={() => setCurrent((c) => c - 1)}
                className="px-4 py-2 rounded-xl text-sm font-semibold"
                style={{ background: "var(--cream-dark)", color: "var(--mocha)" }}>
                הקודם
              </button>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || answered < questions.length}
          className="px-7 py-3 rounded-2xl font-semibold transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: "var(--mocha)", color: "white" }}>
          {loading ? "שולח..." : `הגש ${answered < questions.length ? `(${answered}/10 הושלמו)` : "וקבל Badge"}`}
        </button>
      </form>
    </div>
  );
}
