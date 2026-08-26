import { NextRequest, NextResponse } from "next/server";

function normalizeMatchedPoints(aiMatched: string[], specPoints: string[]): string[] {
  const exactMatched: string[] = [];

  for (const aiPoint of aiMatched) {
    const aiLower = aiPoint.toLowerCase().trim();

    let match = specPoints.find((sp) => sp.toLowerCase().trim() === aiLower);

    if (!match) {
      match = specPoints.find(
        (sp) =>
          aiLower.includes(sp.toLowerCase().trim()) ||
          sp.toLowerCase().trim().includes(aiLower)
      );
    }

    if (!match) {
      const aiWords = new Set(aiLower.split(/\s+/).filter((w) => w.length > 3));
      let bestOverlap = 0;
      for (const sp of specPoints) {
        const spWords = new Set(
          sp
            .toLowerCase()
            .trim()
            .split(/\s+/)
            .filter((w) => w.length > 3)
        );
        const common = [...aiWords].filter((w) => spWords.has(w)).length;
        const total = Math.max(aiWords.size, spWords.size);
        const overlap = total > 0 ? common / total : 0;
        if (overlap > bestOverlap && overlap >= 0.6) {
          bestOverlap = overlap;
          match = sp;
        }
      }
    }

    if (match && !exactMatched.includes(match)) {
      exactMatched.push(match);
    }
  }

  return exactMatched;
}

export async function POST(req: NextRequest) {
  try {
    const { userText, specPoints, topic, subtopic } = await req.json();

    if (!userText || !specPoints?.length) {
      return NextResponse.json(
        { error: "Missing text or spec points" },
        { status: 400 }
      );
    }

    const prompt = `You are an AQA A-Level Biology examiner. A student has just done a "blurt" — they wrote everything they could recall from memory about a topic.

Topic: ${topic}
Subtopic: ${subtopic}

Specification Points (these are the exact marking criteria):
${specPoints.map((p: string, i: number) => `${i + 1}. ${p}`).join("\n")}

Student's Blurt:
"""${userText}"""

Grade this blurt 0-100. Consider:
- Accuracy of biological facts
- Completeness against the spec points above
- Use of correct terminology
- Clarity of explanation

Respond ONLY in this exact JSON format (no markdown, no extra text):
{
  "score": number,
  "feedback": "2-3 sentences of specific, constructive feedback",
  "matchedPoints": ["spec point strings they covered well — try to copy them exactly from the list above"],
  "missedPoints": ["spec point strings they missed — try to copy them exactly from the list above"],
  "rag": "Red" | "Amber" | "Green"
}

RAG rules:
- Red: score < 40 or major factual errors
- Amber: 40-64 or partial understanding
- Green: >= 65 and solid understanding`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-5.6-luna",
        messages: [{ role: "user", content: prompt }],
        max_completion_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json(
        { error: "AI service error: " + err },
        { status: 502 }
      );
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    const cleanJson = content.replace(/```json\n?|\n?```/g, "").trim();
    const parsed = JSON.parse(cleanJson);

    parsed.matchedPoints = normalizeMatchedPoints(
      parsed.matchedPoints || [],
      specPoints
    );

    return NextResponse.json(parsed);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Grading failed" },
      { status: 500 }
    );
  }
}