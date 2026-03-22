import { AnalysisResult, WeakSection, CategoryCoverage, SectionCheck } from "./types";

// Common technical skills and keywords grouped by category
export const SKILL_CATEGORIES: Record<string, string[]> = {
  programming: [
    "python", "java", "javascript", "typescript", "c++", "c#", "ruby", "go",
    "rust", "swift", "kotlin", "php", "scala", "r", "matlab", "sql", "html",
    "css", "bash", "shell", "powershell",
  ],
  frameworks: [
    "react", "angular", "vue", "next.js", "nextjs", "node.js", "nodejs",
    "express", "django", "flask", "spring", "rails", "laravel", ".net",
    "fastapi", "svelte", "tailwind", "bootstrap",
  ],
  cloud: [
    "aws", "azure", "gcp", "google cloud", "heroku", "vercel", "netlify",
    "docker", "kubernetes", "terraform", "ci/cd", "jenkins", "github actions",
  ],
  data: [
    "machine learning", "deep learning", "data science", "data analysis",
    "tensorflow", "pytorch", "pandas", "numpy", "scikit-learn", "nlp",
    "computer vision", "ai", "artificial intelligence", "statistics",
    "big data", "spark", "hadoop", "tableau", "power bi",
  ],
  databases: [
    "mysql", "postgresql", "mongodb", "redis", "elasticsearch", "dynamodb",
    "firebase", "supabase", "sqlite", "oracle", "cassandra",
  ],
  soft_skills: [
    "leadership", "communication", "teamwork", "problem-solving",
    "analytical", "project management", "agile", "scrum", "collaboration",
    "mentoring", "presentation",
  ],
  general: [
    "rest api", "graphql", "microservices", "testing", "unit testing",
    "integration testing", "git", "version control", "linux", "security",
    "performance", "optimization", "debugging", "documentation",
  ],
};

function extractKeywords(text: string): string[] {
  const lower = text.toLowerCase();
  const found: string[] = [];

  for (const category of Object.values(SKILL_CATEGORIES)) {
    for (const skill of category) {
      if (lower.includes(skill) && !found.includes(skill)) {
        found.push(skill);
      }
    }
  }

  // Also extract capitalized proper nouns / acronyms from the text
  const acronyms = text.match(/\b[A-Z]{2,}\b/g) || [];
  for (const acr of acronyms) {
    const lowerAcr = acr.toLowerCase();
    if (!found.includes(lowerAcr) && lowerAcr.length <= 6) {
      found.push(lowerAcr);
    }
  }

  return found;
}

function extractRequirements(jobDescription: string): string[] {
  const lines = jobDescription.split(/\n/);
  const requirements: string[] = [];
  let inRequirements = false;

  for (const line of lines) {
    const lower = line.toLowerCase().trim();
    if (
      lower.includes("requirement") ||
      lower.includes("qualification") ||
      lower.includes("must have") ||
      lower.includes("what we") ||
      lower.includes("you have") ||
      lower.includes("skills")
    ) {
      inRequirements = true;
      continue;
    }
    if (inRequirements && (lower.startsWith("-") || lower.startsWith("•") || lower.match(/^\d/))) {
      requirements.push(line.trim().replace(/^[-•\d.)\s]+/, ""));
    }
    if (inRequirements && lower === "") {
      inRequirements = false;
    }
  }

  return requirements;
}

interface SectionFlags {
  hasEducation: boolean;
  hasExperience: boolean;
  hasSkills: boolean;
  hasProjects: boolean;
  hasNumbers: boolean;
  hasActionVerbs: boolean;
}

function detectWeakSections(resume: string, jobKeywords: string[]): { weakSections: WeakSection[]; flags: SectionFlags } {
  const weakSections: WeakSection[] = [];
  const lower = resume.toLowerCase();
  const lines = resume.split("\n");
  const wordCount = resume.split(/\s+/).length;

  // Check for missing sections
  const hasEducation = lower.includes("education") || lower.includes("university") || lower.includes("degree");
  const hasExperience = lower.includes("experience") || lower.includes("intern") || lower.includes("work");
  const hasSkills = lower.includes("skills") || lower.includes("technologies") || lower.includes("proficient");
  const hasProjects = lower.includes("project") || lower.includes("portfolio");

  if (!hasEducation) {
    weakSections.push({
      section: "Education",
      issue: "No education section detected. Most entry-level jobs require this.",
      severity: "high",
    });
  }
  if (!hasExperience) {
    weakSections.push({
      section: "Experience",
      issue: "No work experience or internship section detected.",
      severity: "high",
    });
  }
  if (!hasSkills) {
    weakSections.push({
      section: "Skills",
      issue: "No dedicated skills section found. Add a clear technical skills section.",
      severity: "medium",
    });
  }
  if (!hasProjects && !hasExperience) {
    weakSections.push({
      section: "Projects",
      issue: "No projects section found. For students, projects are critical to showcase ability.",
      severity: "high",
    });
  }

  // Check for quantified achievements
  const hasNumbers = /\d+%|\d+\+|\$\d|increased|reduced|improved|achieved|generated/i.test(resume);
  if (!hasNumbers) {
    weakSections.push({
      section: "Impact Metrics",
      issue: "No quantified achievements found. Add numbers to demonstrate impact (e.g., 'Improved load time by 40%').",
      severity: "medium",
    });
  }

  // Check resume length
  if (wordCount < 150) {
    weakSections.push({
      section: "Overall Length",
      issue: "Resume appears too short. Most effective resumes have 300-600 words.",
      severity: "medium",
    });
  }

  // Check for action verbs
  const actionVerbs = ["developed", "built", "designed", "implemented", "led", "managed", "created", "optimized", "launched", "automated"];
  const hasActionVerbs = actionVerbs.some((verb) => lower.includes(verb));
  if (!hasActionVerbs) {
    weakSections.push({
      section: "Action Verbs",
      issue: "Weak use of action verbs. Start bullet points with strong verbs like 'Developed', 'Built', 'Optimized'.",
      severity: "low",
    });
  }

  return {
    weakSections,
    flags: { hasEducation, hasExperience, hasSkills, hasProjects, hasNumbers, hasActionVerbs },
  };
}

export function analyzeResume(resume: string, jobDescription: string): AnalysisResult {
  const resumeKeywords = extractKeywords(resume);
  const jobKeywords = extractKeywords(jobDescription);
  const requirements = extractRequirements(jobDescription);

  // Find present and missing keywords
  const presentKeywords = jobKeywords.filter((kw) => resumeKeywords.includes(kw));
  const missingKeywords = jobKeywords.filter((kw) => !resumeKeywords.includes(kw));

  // Calculate match score
  let matchScore = 0;
  if (jobKeywords.length > 0) {
    matchScore = Math.round((presentKeywords.length / jobKeywords.length) * 100);
  }

  // Boost score slightly if resume has good structure
  const resumeLower = resume.toLowerCase();
  const structureBonus =
    (resumeLower.includes("education") ? 3 : 0) +
    (resumeLower.includes("experience") ? 3 : 0) +
    (resumeLower.includes("skills") ? 2 : 0) +
    (resumeLower.includes("project") ? 2 : 0);

  matchScore = Math.min(100, matchScore + structureBonus);

  // Detect weak sections
  const { weakSections, flags } = detectWeakSections(resume, jobKeywords);
  const { hasEducation, hasExperience, hasSkills, hasProjects, hasNumbers, hasActionVerbs } = flags;

  // Calculate rejection risk
  const highWeakSections = weakSections.filter((s) => s.severity === "high").length;
  const missingRatio = jobKeywords.length > 0 ? missingKeywords.length / jobKeywords.length : 0;

  let riskScore = Math.round(missingRatio * 60 + highWeakSections * 15);
  riskScore = Math.min(100, Math.max(0, riskScore));

  let riskLevel: "high" | "medium" | "low" = "low";
  if (riskScore >= 60) riskLevel = "high";
  else if (riskScore >= 35) riskLevel = "medium";

  const riskReasons: string[] = [];
  if (missingKeywords.length > 3) {
    riskReasons.push(`Missing ${missingKeywords.length} key skills/keywords from the job description`);
  }
  if (highWeakSections > 0) {
    riskReasons.push(`${highWeakSections} critical resume section(s) need attention`);
  }
  if (matchScore < 40) {
    riskReasons.push("Overall match score is below competitive threshold");
  }
  if (missingKeywords.length <= 3 && highWeakSections === 0 && matchScore >= 40) {
    riskReasons.push("Resume is reasonably well-matched to this role");
  }

  // Generate suggestions
  const suggestions: string[] = [];
  if (missingKeywords.length > 0) {
    suggestions.push(
      `Add these missing keywords to your resume: ${missingKeywords.slice(0, 5).join(", ")}${missingKeywords.length > 5 ? ` (+${missingKeywords.length - 5} more)` : ""}`
    );
  }
  for (const ws of weakSections.filter((s) => s.severity === "high").slice(0, 2)) {
    suggestions.push(ws.issue);
  }
  if (!(/\d+%|\d+\+/.test(resume))) {
    suggestions.push("Quantify your achievements with numbers and percentages to show measurable impact.");
  }
  if (suggestions.length === 0) {
    suggestions.push("Your resume is well-aligned! Consider tailoring bullet points to mirror the job description language more closely.");
  }

  // ── Category breakdown for radar chart ──
  const CATEGORY_LABELS: Record<string, string> = {
    programming: "Languages",
    frameworks: "Frameworks",
    cloud: "Cloud & DevOps",
    data: "Data & ML",
    databases: "Databases",
    soft_skills: "Soft Skills",
    general: "General",
  };

  const categoryBreakdown: CategoryCoverage[] = Object.entries(SKILL_CATEGORIES)
    .map(([key, skills]) => {
      const jobLower = jobDescription.toLowerCase();
      const resLower = resume.toLowerCase();
      const requiredInCategory = skills.filter((s) => jobLower.includes(s));
      const matchedInCategory = requiredInCategory.filter((s) => resLower.includes(s));
      return {
        category: key,
        label: CATEGORY_LABELS[key] || key,
        required: requiredInCategory.length,
        matched: matchedInCategory.length,
        coverage: requiredInCategory.length > 0
          ? Math.round((matchedInCategory.length / requiredInCategory.length) * 100)
          : 0,
      };
    })
    .filter((c) => c.required > 0);

  // ── Section checks for completeness bars ──
  const sectionChecks: SectionCheck[] = [
    { section: "Education", present: hasEducation },
    { section: "Experience", present: hasExperience },
    { section: "Skills", present: hasSkills },
    { section: "Projects", present: hasProjects },
    { section: "Metrics", present: hasNumbers },
    { section: "Action Verbs", present: hasActionVerbs },
  ];

  return {
    matchScore,
    missingKeywords,
    presentKeywords,
    weakSections,
    rejectionRisk: {
      level: riskLevel,
      score: riskScore,
      reasons: riskReasons,
    },
    suggestions,
    categoryBreakdown,
    sectionChecks,
  };
}
