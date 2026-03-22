import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function buildTechnicalPrompt(jobTitle: string, company: string, skillsList: string) {
  return `You are a senior technical interviewer at a top tech company.

Generate a deep technical interview preparation guide for a "${jobTitle}" position${company ? ` at ${company}` : ""}.
The candidate's skills include: ${skillsList}.

Return a JSON object with this EXACT structure (no markdown, just pure JSON):
{
  "codingChallenges": [
    {
      "question": "the coding/algorithm question",
      "difficulty": "easy" | "medium" | "hard",
      "tip": "approach and data structures to consider",
      "sampleAnswer": "pseudocode or solution outline"
    }
  ],
  "systemDesign": [
    {
      "question": "the system design question",
      "tip": "key components and trade-offs to discuss",
      "sampleAnswer": "high-level architecture outline"
    }
  ],
  "conceptual": [
    {
      "question": "deep conceptual/theory question about the tech stack",
      "tip": "what the interviewer wants to hear",
      "sampleAnswer": "concise but thorough answer"
    }
  ],
  "debugging": [
    {
      "question": "debugging or troubleshooting scenario",
      "tip": "systematic approach to follow",
      "sampleAnswer": "step-by-step debugging approach"
    }
  ],
  "toolsAndTech": [
    {
      "question": "question about specific tools, frameworks, or technologies",
      "tip": "how to demonstrate hands-on experience",
      "sampleAnswer": "key points with real-world examples"
    }
  ],
  "tips": [
    "technical interview tip 1",
    "technical interview tip 2"
  ]
}

Generate exactly:
- 6 coding/algorithm challenges (2 easy, 2 medium, 2 hard) specific to the role
- 4 system design questions relevant to the position
- 5 deep conceptual questions about the technologies used
- 3 debugging scenarios
- 4 tools/framework questions based on the required skills
- 6 tips for acing technical interviews

Make questions realistic — the kind asked at FAANG and top companies for this exact role.`;
}

function buildBehavioralPrompt(jobTitle: string, company: string) {
  return `You are an expert career coach specializing in behavioral interview preparation.

Generate a comprehensive behavioral interview preparation guide for a "${jobTitle}" position${company ? ` at ${company}` : ""}.

Return a JSON object with this EXACT structure (no markdown, just pure JSON):
{
  "starQuestions": [
    {
      "question": "behavioral question using STAR method",
      "category": "leadership" | "teamwork" | "conflict" | "failure" | "achievement" | "adaptability",
      "tip": "what the interviewer is evaluating",
      "sampleAnswer": "example STAR response framework (Situation, Task, Action, Result)"
    }
  ],
  "situational": [
    {
      "question": "hypothetical workplace scenario",
      "tip": "how to structure your response",
      "sampleAnswer": "ideal approach and reasoning"
    }
  ],
  "cultureFit": [
    {
      "question": "company culture and values question",
      "tip": "what they want to see",
      "sampleAnswer": "how to align your answer with company values"
    }
  ],
  "questionsToAsk": [
    {
      "question": "smart question to ask the interviewer",
      "why": "why this question impresses and what you learn"
    }
  ],
  "tips": [
    "behavioral interview tip 1",
    "behavioral interview tip 2"
  ]
}

Generate exactly:
- 8 STAR method questions (mix of categories: leadership, teamwork, conflict, failure, achievement, adaptability)
- 5 situational/hypothetical questions
- 4 culture fit questions${company ? ` tailored to ${company}'s values` : ""}
- 5 smart questions to ask the interviewer
- 6 tips for acing behavioral interviews

Make questions realistic — the kind asked at top companies. For STAR answers, provide a clear Situation → Task → Action → Result framework.`;
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { jobTitle, company, skills, type } = await req.json();

    if (!jobTitle) {
      return NextResponse.json(
        { error: "Job title is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Groq API key not configured" },
        { status: 500 }
      );
    }

    const skillsList = skills?.length ? skills.join(", ") : "not specified";

    const prompt =
      type === "technical"
        ? buildTechnicalPrompt(jobTitle, company || "", skillsList)
        : buildBehavioralPrompt(jobTitle, company || "");

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 4000,
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      const errData = await res.json();
      return NextResponse.json(
        { error: errData.error?.message || "AI generation failed" },
        { status: 500 }
      );
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "No response from AI" },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(content);
    return NextResponse.json({ prep: parsed });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate interview prep" },
      { status: 500 }
    );
  }
}
