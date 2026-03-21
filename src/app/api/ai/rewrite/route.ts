import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not configured." },
        { status: 500 }
      );
    }

    const { resume, jobDescription, missingKeywords } = await req.json();

    if (!resume || !jobDescription) {
      return NextResponse.json(
        { error: "Resume and job description are required." },
        { status: 400 }
      );
    }

    const prompt = `You are an expert resume writer. A student at Truman State University needs their resume rewritten to better match a job description.

## Current Resume:
${resume.slice(0, 4000)}

## Target Job Description:
${jobDescription.slice(0, 2500)}

## Missing Keywords to Incorporate:
${(missingKeywords || []).slice(0, 15).join(", ")}

Generate exactly 3 different rewritten versions of this resume. Each version should:
1. Keep all the student's real experiences and education — do NOT invent fake experience
2. Naturally incorporate the missing keywords where truthful
3. Use strong action verbs and quantify achievements where possible
4. Be ATS-friendly (clean formatting, standard section headers)
5. Be different in approach:
   - **Version A (Keyword-Optimized):** Maximizes keyword matches while keeping content authentic
   - **Version B (Achievement-Focused):** Rewrites bullets to emphasize measurable impact and results
   - **Version C (Skills-Forward):** Reorganizes to lead with a skills summary that mirrors the job requirements

For each version, output the FULL rewritten resume text (not just the changed parts).

Format your response as a JSON array of 3 objects:
[
  {
    "label": "Keyword-Optimized",
    "description": "Maximizes keyword matches with the job description",
    "resume": "Full rewritten resume text here..."
  },
  {
    "label": "Achievement-Focused",
    "description": "Emphasizes measurable impact and results",
    "resume": "Full rewritten resume text here..."
  },
  {
    "label": "Skills-Forward",
    "description": "Leads with a skills summary mirroring job requirements",
    "resume": "Full rewritten resume text here..."
  }
]

Return ONLY the JSON array, no other text.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 8000,
    });

    const content = completion.choices[0]?.message?.content || "[]";

    let versions;
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      versions = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    } catch {
      versions = [
        {
          label: "AI Rewrite",
          description: "AI-generated resume rewrite",
          resume: content,
        },
      ];
    }

    return NextResponse.json({ versions });
  } catch (error: unknown) {
    console.error("AI rewrite error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to generate rewrites";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
