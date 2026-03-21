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

    const { resume, jobDescription, matchScore } = await req.json();

    if (!resume || !jobDescription) {
      return NextResponse.json(
        { error: "Resume and job description are required." },
        { status: 400 }
      );
    }

    const prompt = `You are an expert networking and career coach. A student at Truman State University wants to reach out to a recruiter or hiring manager about a job they're interested in.

## Student's Resume (summary):
${resume.slice(0, 2000)}

## Job Description:
${jobDescription.slice(0, 1500)}

## Match Score: ${matchScore || "N/A"}/100

Generate 2 personalized outreach messages:

1. **LinkedIn Connection Request** (max 300 characters): Short, professional, personalized to the specific role. Should mention a specific skill or experience from the resume that relates to the job.

2. **Email to Recruiter** (3-4 sentences): Professional cold email expressing interest. Should highlight 1-2 specific qualifications from the resume that match the job requirements. Include a clear call-to-action.

Format your response as a JSON object:
{
  "linkedin": "The LinkedIn message text",
  "email": "The email body text"
}

Return ONLY the JSON object, no other text.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.8,
      max_tokens: 800,
    });

    const content = completion.choices[0]?.message?.content || "{}";

    let messages;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      messages = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    } catch {
      messages = { linkedin: content, email: content };
    }

    return NextResponse.json({ messages });
  } catch (error: unknown) {
    console.error("AI outreach error:", error);
    const message = error instanceof Error ? error.message : "Failed to generate outreach messages";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
