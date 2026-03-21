import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ profile: profile || null });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
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

    const body = await req.json();

    const profileData = {
      user_id: user.id,
      full_name: body.fullName || "",
      university: body.university || "",
      major: body.major || "",
      degree_level: body.degreeLevel || "bachelors",
      graduation_year: body.graduationYear || null,
      skills: body.skills || [],
      experience_level: body.experienceLevel || "entry",
      preferred_roles: body.preferredRoles || [],
      preferred_locations: body.preferredLocations || [],
      job_type: body.jobType || "fulltime",
      updated_at: new Date().toISOString(),
    };

    // Upsert: insert or update
    const { data, error } = await supabase
      .from("user_profiles")
      .upsert(profileData, { onConflict: "user_id" })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ profile: data });
  } catch {
    return NextResponse.json(
      { error: "Failed to save profile" },
      { status: 500 }
    );
  }
}
