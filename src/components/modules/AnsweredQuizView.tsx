"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/lib/modules";
import ScoringTable from "@/components/ui/ScoringTable";
import QuizForm from "@/components/modules/QuizForm";

interface Answer {
  question: string;
  answer: string;
}

type Status = "passed" | "failed" | "pending";

interface Props {
  moduleId: string;
  moduleTitle: string;
  questions: QuizQuestion[];
  deliverable: string;
  score: number | null;
  scoreBreakdown: { criterion: string; score: number; weight: number; feedback: string }[] | null;
  scoreSummary: string | null;
  status: Status;
  track: string;
  nextSlug: string | null;
}

const HEADER: Record<Status, { icon: string; color: string; title: string; subtitle: string }> = {
  passed: { icon: "✓", color: "#2d6a2d", title: "עברת את המודול הזה", subtitle: "אפשר להמשיך למודול הבא" },
  failed: { icon: "✗", color: "#8b3a3a", title: "לא עברת את סף המעבר", subtitle: "ערוך את התשובות ונסה שוב כדי להמשיך" },
  pending: { icon: "⏳", color: "var(--text-muted)", title: "כבר ענית על המודול הזה", subtitle: "הציון עדיין מחושב ברקע" },
};

export default function AnsweredQuizView({
  moduleId,
  moduleTitle,
  questions,
  deliverable,
  score,
  scoreBreakdown,
  scoreSummary,
  status,
  track,
  nextSlug,
}: Props) {
  const [editing, setEditing] = useState(false);

  let answers: Answer[] = [];
  try {
    answers = JSON.parse(deliverable);
  } catch {
    answers = [];
  }

  if (editing) {
    return (
      <QuizForm
        moduleId={moduleId}
        track={track}
        moduleTitle={moduleTitle}
        questions={questions}
        nextSlug={nextSlug}
        initialAnswers={questions.map((_, i) => answers[i]?.answer ?? "")}
      />
    );
  }

  const header = HEADER[status];

  return (
    <div className="rounded-3xl p-8 text-right"
      style={{ background: "var(--surface)", border: "1.5px solid var(--border)", boxShadow: "0 4px 24px rgba(124,92,62,0.07)" }}>

      <div className="flex items-center justify-between flex-row-reverse mb-5">
        <div className="flex items-center gap-4 flex-row-reverse justify-end">
          <div>
            <h3 className="font-bold text-lg" style={{ color: header.color }}>{header.title}</h3>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>{header.subtitle}</p>
          </div>
          <span className="text-3xl font-bold w-10 h-10 flex items-center justify-center rounded-full shrink-0"
            style={{ color: "white", background: header.color }}>
            {header.icon}
          </span>
        </div>
        <button
          onClick={() => setEditing(true)}
          className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all shrink-0"
          style={{ background: "var(--cream-dark)", color: "var(--mocha)", border: "1px solid var(--border-dark)" }}>
          ערוך תשובות
        </button>
      </div>

      <div className="space-y-3 mb-6">
        {(answers.length ? answers : questions.map((q) => ({ question: q.text, answer: "" }))).map((a, i) => (
          <div key={i} className="rounded-2xl p-4"
            style={{ background: "var(--cream)", border: "1.5px solid var(--border)" }}>
            <p className="text-sm font-semibold mb-1.5" style={{ color: "var(--mocha-dark)" }}>
              <span style={{ color: "var(--mocha-light)" }}>{i + 1}.</span> {a.question}
            </p>
            <p className="text-sm whitespace-pre-wrap" style={{ color: "var(--text-secondary)" }}>
              {a.answer || "(אין תשובה שמורה)"}
            </p>
          </div>
        ))}
      </div>

      {scoreBreakdown && score !== null && scoreSummary && (
        <ScoringTable breakdown={scoreBreakdown} total={score} summary={scoreSummary} />
      )}

      {status === "passed" && nextSlug && (
        <a href={`/track/${track}/${nextSlug}`}
          className="inline-block mt-6 px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
          style={{ background: "var(--mocha)", color: "white" }}>
          המודול הבא
        </a>
      )}

      {status === "failed" && (
        <button
          onClick={() => setEditing(true)}
          className="inline-block mt-6 px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
          style={{ background: "var(--mocha)", color: "white" }}>
          ערוך תשובות ונסה שוב
        </button>
      )}
    </div>
  );
}
