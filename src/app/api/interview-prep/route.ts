import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { jobTitle, company, skills } = await req.json();

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

    const prompt = `You are an expert career coach and interview preparation specialist.

Generate a comprehensive interview preparation guide for a "${jobTitle}" position${company ? ` at ${company}` : ""}.
The candidate's skills include: ${skillsList}.

Return a JSON object with this EXACT structure (no markdown, just pure JSON):
{
  "behavioral": [
    {
      "question": "the interview question",
      "tip": "a concise tip on how to answer well",
      "sampleAnswer": "a brief example answer framework (2-3 sentences)"
    }
  ],
  "technical": [
    {
      "question": "the technical question",
      "tip": "how to approach this",
      "sampleAnswer": "key points to cover"
    }
  ],
  "situational": [
    {
      "question": "the situational question",
      "tip": "how to structure the answer",
      "sampleAnswer": "example using STAR method"
    }
  ],
  "roleSpecific": [
    {
      "question": "role-specific question",
      "tip": "what interviewer is looking for",
      "sampleAnswer": "key points"
    }
  ],
  "questionsToAsk": [
    {
      "question": "smart question to ask the interviewer",
      "why": "why this question impresses"
    }
  ],
  "tips": [
    "general interview tip 1",
    "general interview tip 2"
  ]
}

Generate exactly:
- 5 behavioral questions (STAR method focused)
- 5 technical questions (specific to the role and required skills)
- 4 situational questions
- 4 role-specific questions (about the company/industry)
- 5 smart questions to ask the interviewer
- 5 general tips

Make all questions realistic — the kind actually asked at top companies for this role.`;

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
