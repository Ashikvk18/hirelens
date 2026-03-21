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

    const { jobTitle, company, requiredSkills, userSkills } = await req.json();

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

    const reqSkills = requiredSkills?.length
      ? requiredSkills.join(", ")
      : "not specified";
    const usrSkills = userSkills?.length
      ? userSkills.join(", ")
      : "not specified";

    const prompt = `You are an expert career advisor and learning path designer.

A candidate wants to become a "${jobTitle}"${company ? ` at ${company}` : ""}.

Skills the job requires/mentions: ${reqSkills}
Skills the candidate currently has: ${usrSkills}

Analyze the gap and create a detailed learning roadmap.

Return a JSON object with this EXACT structure (no markdown, just pure JSON):
{
  "gapAnalysis": {
    "missingSkills": [
      {
        "skill": "skill name",
        "priority": "critical" | "important" | "nice-to-have",
        "reason": "why this skill is needed for the role"
      }
    ],
    "strongSkills": [
      {
        "skill": "skill name",
        "relevance": "how this helps in the role"
      }
    ]
  },
  "roadmap": [
    {
      "phase": "Phase 1: Foundation (Week 1-2)",
      "description": "what to focus on",
      "tasks": [
        {
          "task": "specific learning task",
          "resource": "recommended free resource (course/tutorial/docs URL or name)",
          "duration": "estimated time",
          "type": "course" | "project" | "practice" | "reading"
        }
      ]
    }
  ],
  "projects": [
    {
      "title": "portfolio project name",
      "description": "what to build",
      "skills": ["skills it demonstrates"],
      "difficulty": "beginner" | "intermediate" | "advanced"
    }
  ],
  "timeline": {
    "totalWeeks": 8,
    "hoursPerWeek": 10,
    "summary": "brief timeline summary"
  },
  "certifications": [
    {
      "name": "certification name",
      "provider": "provider",
      "cost": "free or price",
      "link": "URL if known",
      "relevance": "why it helps"
    }
  ]
}

Generate:
- A thorough gap analysis comparing required vs existing skills
- 3-4 learning phases spanning 6-10 weeks
- 3-4 tasks per phase with real, free learning resources
- 3 portfolio project ideas
- 2-3 relevant certifications
- Realistic timeline

Be specific with resource names — recommend real courses from freeCodeCamp, Coursera, Udemy, YouTube channels, official docs, etc.`;

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
    return NextResponse.json({ roadmap: parsed });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate skills roadmap" },
      { status: 500 }
    );
  }
}
