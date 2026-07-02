import type { QuizQuestion } from "@/lib/modules";

interface Props {
  questions: QuizQuestion[];
}

export default function ReadOnlyQuestions({ questions }: Props) {
  return (
    <div className="rounded-3xl p-8 text-right"
      style={{ background: "var(--surface)", border: "1.5px solid var(--border)", boxShadow: "0 4px 24px rgba(124,92,62,0.07)" }}>
      <div className="mb-5 rounded-2xl p-4 text-sm"
        style={{ background: "var(--cream)", border: "1.5px dashed var(--border)", color: "var(--text-muted)" }}>
        צפייה בלבד: מודול זה עדיין נעול עבור לומד רגיל, מוצג לך כמנהל בלי אפשרות להגיש תשובות.
      </div>
      <h3 className="text-xl font-bold mb-4" style={{ color: "var(--mocha-dark)" }}>
        {questions.length} שאלות
      </h3>
      <ol className="space-y-3 list-none">
        {questions.map((q, i) => (
          <li key={i} className="rounded-2xl p-4 text-sm"
            style={{ background: "var(--cream)", border: "1.5px solid var(--border)", color: "var(--text-primary)" }}>
            <span className="font-bold ml-1" style={{ color: "var(--mocha)" }}>{i + 1}.</span> {q.text}
          </li>
        ))}
      </ol>
    </div>
  );
}
