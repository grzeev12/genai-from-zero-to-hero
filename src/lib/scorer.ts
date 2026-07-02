import { AzureOpenAI } from "openai";
import type { RubricItem, QuizQuestion } from "./modules";

function getClient() {
  return new AzureOpenAI({
    apiKey: process.env.AZURE_OPENAI_KEY!,
    endpoint: process.env.AZURE_OPENAI_ENDPOINT!,
    apiVersion: "2024-08-01-preview",
    deployment: process.env.AZURE_OPENAI_DEPLOYMENT!,
  });
}

export interface ScoreResult {
  total: number;
  breakdown: { criterion: string; score: number; weight: number; feedback: string }[];
  summary: string;
}

export async function scoreSubmission(
  deliverable: string,
  rubric: RubricItem[]
): Promise<ScoreResult> {
  const rubricText = rubric
    .map((r) => `- ${r.criterion} (${r.weight}%): ${r.description}`)
    .join("\n");

  const prompt = `אתה מעריך מטלת למידה של מנהל ענן בקורס AWARE על GenAI.

קריטריוני הערכה:
${rubricText}

מטלת הלומד:
"""
${deliverable}
"""

הערך את המטלה לפי כל קריטריון. החזר JSON בדיוק בפורמט הזה:
{
  "breakdown": [
    {
      "criterion": "שם הקריטריון",
      "score": ציון מ-0 עד 100,
      "weight": משקל באחוזים,
      "feedback": "משפט אחד קצר בעברית על החוזקות והחולשות"
    }
  ],
  "summary": "משפט אחד מסכם בעברית"
}

הציון הכולל יחושב אוטומטית. היה ביקורתי אבל הוגן.`;

  const client = getClient();
  const response = await client.chat.completions.create({
    model: process.env.AZURE_OPENAI_DEPLOYMENT!,
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.3,
  });

  const parsed = JSON.parse(response.choices[0].message.content!);

  const total = Math.round(
    parsed.breakdown.reduce(
      (sum: number, item: { score: number; weight: number }) =>
        sum + (item.score * item.weight) / 100,
      0
    )
  );

  return { total, breakdown: parsed.breakdown, summary: parsed.summary };
}

export interface QuizScoreResult {
  total: number;
  answers: { question: string; score: number; feedback: string }[];
  summary: string;
}

export async function scoreQuiz(
  answers: { question: string; answer: string }[],
  moduleTitle: string
): Promise<QuizScoreResult> {
  const answersText = answers
    .map((a, i) => `שאלה ${i + 1}: ${a.question}\nתשובה: ${a.answer}`)
    .join("\n\n");

  const prompt = `אתה מעריך מבחן של מנהל ענן שסיים מודול לימוד בנושא "${moduleTitle}".

הלומד ענה על 10 שאלות. הערך כל תשובה בנפרד בסולם 0-10:
- 0-3: תשובה כללית שלא מוכיחה ניסיון אמיתי
- 4-6: ניסיון ניכר אבל חסר עומק או ספציפיות
- 7-9: תשובה מלאה שמוכיחה ניסוי ממשי ולמידה
- 10: תשובה יוצאת דופן עם insight אמיתי

${answersText}

החזר JSON:
{
  "answers": [
    { "question": "השאלה", "score": 0-10, "feedback": "משפט קצר בעברית" }
  ],
  "summary": "משפט מסכם אחד בעברית"
}`;

  const client = getClient();
  const response = await client.chat.completions.create({
    model: process.env.AZURE_OPENAI_DEPLOYMENT!,
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.2,
  });

  const parsed = JSON.parse(response.choices[0].message.content!);
  const total = Math.round(
    parsed.answers.reduce((sum: number, a: { score: number }) => sum + a.score, 0)
  );

  return { total, answers: parsed.answers, summary: parsed.summary };
}
