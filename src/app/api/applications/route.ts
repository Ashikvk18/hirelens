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

    const { data, error } = await supabase
      .from("job_applications")
      .select("*")
      .eq("user_id", user.id)
      .order("applied_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ applications: data });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch applications" },
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

    const applicationData = {
      user_id: user.id,
      job_id: body.jobId,
      job_title: body.jobTitle,
      company: body.company,
      company_logo: body.companyLogo || null,
      location: body.location || "",
      job_type: body.jobType || "",
      apply_link: body.applyLink,
      publisher: body.publisher || "",
      salary: body.salary || "",
      resume_text: body.resumeText || "",
      status: "applied",
      notes: body.notes || "",
    };

    const { data, error } = await supabase
      .from("job_applications")
      .insert(applicationData)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ application: data });
  } catch {
    return NextResponse.json(
      { error: "Failed to save application" },
      { status: 500 }
    );
  }
}
