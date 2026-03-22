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

    const { resume, jobDescription, tone } = await req.json();

    if (!resume || !jobDescription) {
      return NextResponse.json(
        { error: "Resume and job description are required." },
        { status: 400 }
      );
    }

    const toneInstruction =
      tone === "confident"
        ? "Use a confident, assertive tone that showcases achievements boldly."
        : tone === "enthusiastic"
        ? "Use an enthusiastic, passionate tone that conveys genuine excitement for the role."
        : "Use a professional, polished tone that is warm but not overly casual.";

    const prompt = `You are an expert cover letter writer with decades of experience helping candidates land interviews. Write a tailored cover letter for the following candidate and job.

## Candidate's Resume:
${resume.slice(0, 4000)}

## Target Job Description:
${jobDescription.slice(0, 2500)}

## Tone: ${toneInstruction}

Write a compelling, personalized cover letter that:
1. Opens with a strong hook — NOT "I am writing to apply for..." (use something engaging)
2. Connects 2-3 specific experiences/skills from the resume to requirements in the job description
3. Shows genuine knowledge of what the role entails
4. Quantifies achievements where the resume provides numbers
5. Closes with a confident call-to-action
6. Is 3-4 paragraphs, roughly 250-350 words
7. Does NOT invent experiences — only reference what's in the resume
8. Uses natural, human language — avoid corporate buzzwords

Format your response as a JSON object:
{
  "coverLetter": "The full cover letter text here",
  "highlights": ["Key point 1 used from resume", "Key point 2 used from resume", "Key point 3 used from resume"],
  "wordCount": 300
}

Return ONLY the JSON object, no other text.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.75,
      max_tokens: 2000,
    });

    const content = completion.choices[0]?.message?.content || "{}";

    let result;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      result = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    } catch {
      result = {
        coverLetter: content,
        highlights: [],
        wordCount: content.split(/\s+/).length,
      };
    }

    return NextResponse.json({ result });
  } catch (error: unknown) {
    console.error("Cover letter generation error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to generate cover letter";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
