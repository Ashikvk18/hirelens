import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not configured. Please add it to your .env.local file." },
        { status: 500 }
      );
    }

    const { resume, jobDescription, missingKeywords, weakSections } = await req.json();

    if (!resume || !jobDescription) {
      return NextResponse.json(
        { error: "Resume and job description are required." },
        { status: 400 }
      );
    }

    const prompt = `You are an expert career coach and resume optimization specialist. A student at Truman State University is applying for a job. Analyze the gap between their resume and the job description, then provide specific, actionable improvement suggestions.

## Resume:
${resume.slice(0, 3000)}

## Job Description:
${jobDescription.slice(0, 2000)}

## Missing Keywords:
${(missingKeywords || []).join(", ")}

## Weak Sections:
${(weakSections || []).map((ws: { section: string; issue: string }) => `- ${ws.section}: ${ws.issue}`).join("\n")}

Provide exactly 5 specific, actionable suggestions to improve this resume for this job. Each suggestion should:
1. Be specific (not generic advice)
2. Reference actual content from the resume or job description
3. Include example rewording where helpful

Format your response as a JSON array of objects with "title" and "detail" fields:
[
  {"title": "Short action title", "detail": "Detailed specific suggestion with examples"}
]

Return ONLY the JSON array, no other text.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1500,
    });

    const content = completion.choices[0]?.message?.content || "[]";

    // Parse JSON from response (handle potential markdown wrapping)
    let suggestions;
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      suggestions = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    } catch {
      suggestions = [{ title: "AI Analysis", detail: content }];
    }

    return NextResponse.json({ suggestions });
  } catch (error: unknown) {
    console.error("AI suggestions error:", error);
    const message = error instanceof Error ? error.message : "Failed to generate suggestions";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
