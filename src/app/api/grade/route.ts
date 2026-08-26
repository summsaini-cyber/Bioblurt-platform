import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userText, specPoints, topic, subtopic } = await req.json();

    if (!userText || !specPoints?.length) {
      return NextResponse.json({ error: "Missing text or spec points" }, { status: 400 });
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
  "matchedPoints": ["exact spec point strings they covered well"],
  "missedPoints": ["exact spec point strings they missed or got wrong"],
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
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ error: "AI service error: " + err }, { status: 502 });
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Strip any markdown code blocks just in case
    const cleanJson = content.replace(/```json\n?|\n?```/g, "").trim();
    const result = JSON.parse(cleanJson);

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Grading failed" }, { status: 500 });
  }
}