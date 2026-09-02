import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { essay, answer, timeSpent } = await req.json();

    if (!answer || !essay) {
      return NextResponse.json({ error: "Missing essay or answer" }, { status: 400 });
    }

    const prompt = `You are a senior AQA A-Level Biology examiner marking a synoptic essay from Paper 3.

Essay Title: "${essay}"

Student's Essay:
"""${answer}"""

Mark this essay out of 25 using the official AQA levels:

21–25 Extended Abstract (A*–A):
- Holistic approach with multiple topics linked to the theme
- No irrelevant material
- Evidence of reading beyond the specification
- Clear, coherent, and well-structured

16–20 Relational (A–B):
- Several topics linked to the theme
- Clearly explained and interrelated
- Good structure but less depth than top band

11–15 Multistructural (C):
- Several aspects covered but not fully interrelated
- Some links to theme missing
- Mostly accurate but superficial in places

6–10 Unistructural (D–E):
- List-like / limited range
- Superficial coverage
- Some major errors or omissions

1–5 Unfocused (U):
- Irrelevant material / major factual errors
- Very limited understanding shown

Evaluate on:
1. BREADTH: How many different specification topics are covered? (Need 4+ for top marks)
2. SYNOPTIC LINKS: Does every paragraph clearly link back to the essay title?
3. ACCURACY: No major biological errors
4. DEPTH: A-level terminology and mechanisms, not GCSE-level
5. STRUCTURE: Clear introduction, body paragraphs, conclusion

Respond ONLY in this exact JSON format (no markdown, no extra text):
{
  "score": number,
  "band": "21-25 Extended Abstract" | "16-20 Relational" | "11-15 Multistructural" | "6-10 Unistructural" | "1-5 Unfocused",
  "feedback": "2-3 sentences of overall constructive feedback",
  "strengths": ["specific strength 1", "specific strength 2"],
  "improvements": ["specific improvement 1", "specific improvement 2", "specific improvement 3"]
}

Rules:
- Score must be an integer 0–25
- Be strict but fair — AQA examiners do not give easy marks
- If the essay is under 200 words, cap at 10 marks maximum
- If the essay contains major factual errors, drop at least one band
- Benefit of doubt only for borderline cases, not for missing content`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-5.6-luna",
        messages: [{ role: "user", content: prompt }],
        max_completion_tokens: 2000,
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

    result.score = Math.max(0, Math.min(25, Math.round(result.score)));

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Grading failed" }, { status: 500 });
  }
}