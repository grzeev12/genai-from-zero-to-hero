import type { QuizQuestion } from "@/lib/modules";
import ScoringTable from "@/components/ui/ScoringTable";

interface Answer {
  question: string;
  answer: string;
}

interface Props {
  questions: QuizQuestion[];
  deliverable: string;
  score: number | null;
  scoreBreakdown: { criterion: string; score: number; weight: number; feedback: string }[] | null;
  scoreSummary: string | null;
  track: string;
  nextSlug: string | null;
}

export default function AnsweredQuizView({
  questions,
  deliverable,
  score,
  scoreBreakdown,
  scoreSummary,
  track,
  nextSlug,
}: Props) {
  let answers: Answer[] = [];
  try {
    answers = JSON.parse(deliverable);
  } catch {
    answers = [];
  }

  return (
    <div className="rounded-3xl p-8 text-right"
      style={{ background: "var(--surface)", border: "1.5px solid var(--border)", boxShadow: "0 4px 24px rgba(124,92,62,0.07)" }}>

      <div className="flex items-center gap-4 flex-row-reverse justify-end mb-5">
        <div>
          <h3 className="font-bold text-lg" style={{ color: "#2d6a2d" }}>כבר ענית על המודול הזה</h3>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            {score !== null ? "הציון מחושב ומוצג למטה" : "הציון עדיין מחושב ברקע"}
          </p>
        </div>
        <span className="text-4xl">🏅</span>
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

      {nextSlug && (
        <a href={`/track/${track}/${nextSlug}`}
          className="inline-block mt-6 px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
          style={{ background: "var(--mocha)", color: "white" }}>
          המודול הבא
        </a>
      )}
    </div>
  );
}
