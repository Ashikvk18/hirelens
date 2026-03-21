import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    // Auth check
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const company = searchParams.get("company") || "";

    if (!company) {
      return NextResponse.json(
        { error: "Company name is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.HUNTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Hunter.io API key not configured" },
        { status: 500 }
      );
    }

    // Step 1: Find the company domain using Hunter.io domain search
    // First try company name as domain guess
    const domain = guessDomain(company);

    const hunterUrl = new URL("https://api.hunter.io/v2/domain-search");
    hunterUrl.searchParams.set("domain", domain);
    hunterUrl.searchParams.set("api_key", apiKey);
    hunterUrl.searchParams.set("limit", "10");
    // Look for hiring-related roles
    hunterUrl.searchParams.set(
      "department",
      "human_resources"
    );

    const res = await fetch(hunterUrl.toString());
    const data = await res.json();

    if (!res.ok || data.errors) {
      // Fallback: try without department filter
      hunterUrl.searchParams.delete("department");
      const fallbackRes = await fetch(hunterUrl.toString());
      const fallbackData = await fallbackRes.json();

      if (!fallbackRes.ok || fallbackData.errors) {
        return NextResponse.json({
          contacts: [],
          domain,
          company,
          message: "Could not find contacts for this company. The company might not have a matching domain.",
        });
      }

      return NextResponse.json({
        contacts: transformContacts(fallbackData.data?.emails || []),
        domain: fallbackData.data?.domain || domain,
        company,
        organization: fallbackData.data?.organization || company,
        totalAvailable: fallbackData.data?.emails?.length || 0,
      });
    }

    return NextResponse.json({
      contacts: transformContacts(data.data?.emails || []),
      domain: data.data?.domain || domain,
      company,
      organization: data.data?.organization || company,
      totalAvailable: data.data?.emails?.length || 0,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to find contacts" },
      { status: 500 }
    );
  }
}

function guessDomain(company: string): string {
  // Clean company name and guess domain
  const cleaned = company
    .toLowerCase()
    .replace(/[,.]?\s*(inc|llc|ltd|corp|corporation|co|company|group|holdings|international|technologies|technology|tech|solutions|services|consulting)\.?$/gi, "")
    .trim()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9]/g, "");

  return `${cleaned}.com`;
}

interface HunterEmail {
  value: string;
  type: string;
  confidence: number;
  first_name: string | null;
  last_name: string | null;
  position: string | null;
  department: string | null;
  seniority: string | null;
  linkedin: string | null;
  twitter: string | null;
  phone_number: string | null;
}

interface Contact {
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  position: string;
  department: string;
  seniority: string;
  confidence: number;
  linkedin: string | null;
  twitter: string | null;
  phone: string | null;
}

function transformContacts(emails: HunterEmail[]): Contact[] {
  return emails
    .filter((e) => e.confidence >= 30)
    .sort((a, b) => {
      // Prioritize HR/hiring roles
      const aScore = getRelevanceScore(a);
      const bScore = getRelevanceScore(b);
      return bScore - aScore;
    })
    .map((e) => ({
      email: e.value,
      firstName: e.first_name || "",
      lastName: e.last_name || "",
      fullName: [e.first_name, e.last_name].filter(Boolean).join(" ") || "Unknown",
      position: e.position || "",
      department: e.department || "",
      seniority: e.seniority || "",
      confidence: e.confidence,
      linkedin: e.linkedin || null,
      twitter: e.twitter || null,
      phone: e.phone_number || null,
    }));
}

function getRelevanceScore(email: HunterEmail): number {
  let score = email.confidence;
  const pos = (email.position || "").toLowerCase();
  const dept = (email.department || "").toLowerCase();

  // Boost HR/recruiting contacts
  if (
    pos.includes("recruiter") ||
    pos.includes("recruiting") ||
    pos.includes("talent") ||
    pos.includes("hiring")
  )
    score += 50;
  if (
    pos.includes("human resources") ||
    pos.includes("hr ") ||
    dept.includes("human_resources") ||
    dept.includes("hr")
  )
    score += 40;
  if (pos.includes("manager") || pos.includes("director") || pos.includes("head"))
    score += 20;
  if (email.seniority === "senior" || email.seniority === "executive")
    score += 10;

  return score;
}
