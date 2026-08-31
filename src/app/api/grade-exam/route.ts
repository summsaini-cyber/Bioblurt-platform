import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { answer, question, marks, markScheme, topic } = await req.json();

    if (!answer || !question || !markScheme?.length) {
      return NextResponse.json({ error: "Missing answer or question data" }, { status: 400 });
    }

    const prompt = `You are an AQA A-Level Biology examiner marking a student's exam answer.

Topic: ${topic}
Question: ${question}
Total marks available: ${marks}

Official Mark Scheme (each bullet = 1 mark):
${markScheme.map((m: string, i: number) => `${i + 1}. ${m}`).join("\n")}

Student's Answer:
"""${answer}"""

Mark this answer strictly out of ${marks} using the official mark scheme above, but be fair with benefit-of-doubt where the student's wording is close but not exact.

For each mark in the scheme, decide:
- AWARDED: student clearly earned it
- MISSED: student did not mention it or got it wrong  
- TENTATIVE: student's answer is close but not precise enough for a guaranteed mark (benefit of doubt)

Respond ONLY in this exact JSON format (no markdown, no extra text):
{
  "score": number,
  "feedback": "2-3 sentences of constructive examiner feedback. Be specific about what was good and what to improve.",
  "marksAwarded": ["description of each mark awarded and why"],
  "marksMissed": ["description of each mark missed and what the mark scheme wanted"],
  "tentativeMarks": ["description of any benefit-of-doubt marks given and why they were tentative"]
}

Rules:
- Score must be an integer between 0 and ${marks}
- If the student writes complete nonsense or leaves it blank, score 0
- If the student exceeds the mark cap, still only award up to ${marks}
- Be encouraging but honest — AQA examiners are strict but fair`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-5.6-luna",
        messages: [{ role: "user", content: prompt }],
        max_completion_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ error: "AI service error: " + err }, { status: 502 });
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    const cleanJson = content.replace(/```json\n?|\n?```/g, "").trim();
    const result = JSON.parse(cleanJson);

    // Ensure score is within bounds
    result.score = Math.max(0, Math.min(marks, Math.round(result.score)));

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Grading failed" }, { status: 500 });
  }
}