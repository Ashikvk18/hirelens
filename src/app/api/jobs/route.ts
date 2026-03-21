import { NextRequest, NextResponse } from "next/server";

interface JSearchJob {
  job_id: string;
  job_title: string;
  employer_name: string;
  employer_logo: string | null;
  job_publisher: string;
  job_employment_type: string;
  job_apply_link: string;
  job_description: string;
  job_city: string;
  job_state: string;
  job_country: string;
  job_posted_at_datetime_utc: string;
  job_min_salary: number | null;
  job_max_salary: number | null;
  job_salary_currency: string | null;
  job_salary_period: string | null;
  job_is_remote: boolean;
  job_required_experience?: {
    no_experience_required?: boolean;
    required_experience_in_months?: number | null;
  };
  job_required_skills?: string[] | null;
  estimated_salaries?: { min_salary: number; max_salary: number; median_salary: number }[];
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "software engineer";
    const location = searchParams.get("location") || "";
    const jobType = searchParams.get("jobType") || "";
    const datePosted = searchParams.get("datePosted") || "month";
    const page = searchParams.get("page") || "1";

    const apiKey = process.env.RAPIDAPI_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "RAPIDAPI_KEY is not configured." },
        { status: 500 }
      );
    }

    // Build search query
    let searchQuery = query;
    if (location) {
      searchQuery += ` in ${location}`;
    }

    const url = new URL("https://jsearch.p.rapidapi.com/search");
    url.searchParams.set("query", searchQuery);
    url.searchParams.set("page", page);
    url.searchParams.set("num_pages", "1");
    url.searchParams.set("country", "us");
    url.searchParams.set("date_posted", datePosted);
    if (jobType) {
      url.searchParams.set("employment_types", jobType);
    }

    const response = await fetch(url.toString(), {
      headers: {
        "x-rapidapi-host": "jsearch.p.rapidapi.com",
        "x-rapidapi-key": apiKey,
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("JSearch API error:", response.status, errText);
      return NextResponse.json(
        { error: "Failed to fetch jobs from API." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const rawJobs: JSearchJob[] = data.data || [];

    // Transform to our format
    const jobs = rawJobs.map((job) => {
      // Calculate how long ago the job was posted
      const postedDate = new Date(job.job_posted_at_datetime_utc);
      const now = new Date();
      const diffMs = now.getTime() - postedDate.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      let postedAgo = "";
      if (diffDays === 0) postedAgo = "Today";
      else if (diffDays === 1) postedAgo = "1 day ago";
      else if (diffDays < 7) postedAgo = `${diffDays} days ago`;
      else if (diffDays < 30) postedAgo = `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? "s" : ""} ago`;
      else postedAgo = `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? "s" : ""} ago`;

      // Estimate applicants based on days posted (rough heuristic)
      const estimatedApplicants = Math.min(
        Math.floor(diffDays * (15 + Math.random() * 25)) + Math.floor(Math.random() * 10),
        999
      );

      // Salary
      let salary = "";
      if (job.job_min_salary && job.job_max_salary) {
        const currency = job.job_salary_currency || "USD";
        const period = job.job_salary_period || "YEAR";
        const fmt = (n: number) =>
          n >= 1000 ? `${Math.round(n / 1000)}K` : `${n}`;
        salary = `${currency === "USD" ? "$" : currency}${fmt(job.job_min_salary)} - $${fmt(job.job_max_salary)}/${period.toLowerCase()}`;
      }

      return {
        id: job.job_id,
        title: job.job_title,
        company: job.employer_name,
        logo: job.employer_logo,
        location: [job.job_city, job.job_state].filter(Boolean).join(", ") || (job.job_is_remote ? "Remote" : ""),
        remote: job.job_is_remote,
        type: job.job_employment_type,
        applyLink: job.job_apply_link,
        postedAt: job.job_posted_at_datetime_utc,
        postedAgo,
        estimatedApplicants,
        salary,
        publisher: job.job_publisher,
        skills: job.job_required_skills || [],
      };
    });

    return NextResponse.json({
      jobs,
      totalResults: data.total || jobs.length,
    });
  } catch (error) {
    console.error("Jobs API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs." },
      { status: 500 }
    );
  }
}
