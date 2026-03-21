import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// Save a new analysis session
export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const {
      resumeText,
      jobDescription,
      matchScore,
      missingKeywords,
      presentKeywords,
      weakSections,
      rejectionRisk,
      suggestions,
    } = body;

    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        { error: "Resume and job description are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("analysis_sessions")
      .insert({
        user_id: user.id,
        resume_text: resumeText.slice(0, 10000),
        job_description: jobDescription.slice(0, 10000),
        match_score: matchScore,
        missing_keywords: missingKeywords || [],
        present_keywords: presentKeywords || [],
        weak_sections: weakSections || [],
        rejection_risk: rejectionRisk || {},
        suggestions: suggestions || [],
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ session: data });
  } catch (error: unknown) {
    console.error("Save session error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to save session";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Get user's analysis sessions
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("analysis_sessions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) throw error;

    return NextResponse.json({ sessions: data });
  } catch (error: unknown) {
    console.error("Get sessions error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to fetch sessions";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
