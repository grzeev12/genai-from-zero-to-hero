import { AzureOpenAI } from "openai";
import type { RubricItem } from "./modules";

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
