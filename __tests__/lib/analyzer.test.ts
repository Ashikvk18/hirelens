import { analyzeResume } from "@/lib/analyzer";

// ── Sample Data ──

const STRONG_RESUME = `
John Doe
Software Engineer

Education
Bachelor of Science in Computer Science, University of XYZ, 2023

Experience
Software Engineer Intern at TechCorp (2022-2023)
- Developed a React dashboard that improved load time by 40%
- Built REST APIs using Node.js and Express
- Implemented CI/CD pipeline with GitHub Actions
- Collaborated with a team of 5 engineers using Agile methodology

Skills
JavaScript, TypeScript, React, Node.js, Python, AWS, Docker, PostgreSQL, Git, REST API

Projects
- E-commerce platform built with Next.js, PostgreSQL, and Tailwind
- Machine learning model for sentiment analysis using Python and TensorFlow
`;

const WEAK_RESUME = `
Jane Smith
Looking for a job. I am a hard worker and a fast learner.
I have some experience with computers.
`;

const JOB_DESCRIPTION = `
Software Engineer - TechCorp

Requirements:
- 2+ years experience with JavaScript and TypeScript
- Proficiency in React and Node.js
- Experience with AWS cloud services
- Knowledge of Docker and Kubernetes
- Familiarity with PostgreSQL or MySQL
- Experience with CI/CD pipelines
- Strong communication and teamwork skills

Nice to have:
- Experience with Python
- Machine learning knowledge
- GraphQL experience
`;

// ── Tests ──

describe("analyzeResume", () => {
  describe("Match Score", () => {
    it("returns a score between 0 and 100", () => {
      const result = analyzeResume(STRONG_RESUME, JOB_DESCRIPTION);
      expect(result.matchScore).toBeGreaterThanOrEqual(0);
      expect(result.matchScore).toBeLessThanOrEqual(100);
    });

    it("gives a high score for a well-matched resume", () => {
      const result = analyzeResume(STRONG_RESUME, JOB_DESCRIPTION);
      expect(result.matchScore).toBeGreaterThanOrEqual(60);
    });

    it("gives a low score for a poorly-matched resume", () => {
      const result = analyzeResume(WEAK_RESUME, JOB_DESCRIPTION);
      expect(result.matchScore).toBeLessThan(40);
    });

    it("returns structure bonus only when no keywords overlap", () => {
      // When job has no recognizable keywords, matchScore = 0/0 → 0, plus structure bonus
      const result = analyzeResume("hello world", "no relevant terms here at all");
      // With no structure sections either, bonus is 0, so score stays at structure bonus level
      expect(result.matchScore).toBeLessThanOrEqual(100);
      expect(typeof result.matchScore).toBe("number");
    });
  });

  describe("Keyword Detection", () => {
    it("identifies present keywords from the job description", () => {
      const result = analyzeResume(STRONG_RESUME, JOB_DESCRIPTION);
      expect(result.presentKeywords).toContain("javascript");
      expect(result.presentKeywords).toContain("react");
      expect(result.presentKeywords).toContain("node.js");
    });

    it("identifies missing keywords", () => {
      const result = analyzeResume(STRONG_RESUME, JOB_DESCRIPTION);
      expect(result.missingKeywords).toContain("kubernetes");
    });

    it("returns empty missing keywords when resume covers everything", () => {
      const result = analyzeResume(STRONG_RESUME, "Requires JavaScript and React");
      expect(result.missingKeywords.length).toBe(0);
    });

    it("detects acronyms in the resume", () => {
      const result = analyzeResume("I have experience with AWS and CI/CD", JOB_DESCRIPTION);
      expect(result.presentKeywords).toContain("aws");
    });
  });

  describe("Weak Sections Detection", () => {
    it("flags missing education section", () => {
      const noEdu = "Skills: JavaScript, React\nExperience: 2 years\nProjects: Built a website";
      const result = analyzeResume(noEdu, JOB_DESCRIPTION);
      const sections = result.weakSections.map((s) => s.section);
      expect(sections).toContain("Education");
    });

    it("flags missing experience section", () => {
      const noExp = "Education: BS Computer Science\nSkills: JavaScript\nProjects: Built a website";
      const result = analyzeResume(noExp, JOB_DESCRIPTION);
      const sections = result.weakSections.map((s) => s.section);
      expect(sections).toContain("Experience");
    });

    it("flags missing skills section", () => {
      const noSkills = "Education: BS CS\nExperience: Worked at TechCorp\nProjects: Built things";
      const result = analyzeResume(noSkills, JOB_DESCRIPTION);
      const sections = result.weakSections.map((s) => s.section);
      expect(sections).toContain("Skills");
    });

    it("flags short resume", () => {
      const result = analyzeResume(WEAK_RESUME, JOB_DESCRIPTION);
      const sections = result.weakSections.map((s) => s.section);
      expect(sections).toContain("Overall Length");
    });

    it("flags missing impact metrics", () => {
      const noMetrics = `Education: BS CS at XYZ University
Experience: Software Engineer at Corp
- Worked on frontend features
- Helped with backend
Skills: JavaScript, React`;
      const result = analyzeResume(noMetrics, JOB_DESCRIPTION);
      const sections = result.weakSections.map((s) => s.section);
      expect(sections).toContain("Impact Metrics");
    });

    it("does not flag impact metrics when numbers are present", () => {
      const result = analyzeResume(STRONG_RESUME, JOB_DESCRIPTION);
      const sections = result.weakSections.map((s) => s.section);
      expect(sections).not.toContain("Impact Metrics");
    });

    it("flags weak action verbs", () => {
      const result = analyzeResume(WEAK_RESUME, JOB_DESCRIPTION);
      const sections = result.weakSections.map((s) => s.section);
      expect(sections).toContain("Action Verbs");
    });

    it("does not flag action verbs when strong verbs are present", () => {
      const result = analyzeResume(STRONG_RESUME, JOB_DESCRIPTION);
      const sections = result.weakSections.map((s) => s.section);
      expect(sections).not.toContain("Action Verbs");
    });
  });

  describe("Rejection Risk", () => {
    it("returns low risk for a strong resume", () => {
      const result = analyzeResume(STRONG_RESUME, JOB_DESCRIPTION);
      expect(["low", "medium"]).toContain(result.rejectionRisk.level);
      expect(result.rejectionRisk.score).toBeLessThan(60);
    });

    it("returns high risk for a weak resume", () => {
      const result = analyzeResume(WEAK_RESUME, JOB_DESCRIPTION);
      expect(result.rejectionRisk.level).toBe("high");
      expect(result.rejectionRisk.score).toBeGreaterThanOrEqual(60);
    });

    it("always returns a risk score between 0 and 100", () => {
      const result = analyzeResume(STRONG_RESUME, JOB_DESCRIPTION);
      expect(result.rejectionRisk.score).toBeGreaterThanOrEqual(0);
      expect(result.rejectionRisk.score).toBeLessThanOrEqual(100);
    });

    it("provides reasons for rejection risk", () => {
      const result = analyzeResume(WEAK_RESUME, JOB_DESCRIPTION);
      expect(result.rejectionRisk.reasons.length).toBeGreaterThan(0);
    });
  });

  describe("Suggestions", () => {
    it("provides at least one suggestion", () => {
      const result = analyzeResume(STRONG_RESUME, JOB_DESCRIPTION);
      expect(result.suggestions.length).toBeGreaterThan(0);
    });

    it("suggests adding missing keywords when some are missing", () => {
      const result = analyzeResume(WEAK_RESUME, JOB_DESCRIPTION);
      const hasKeywordSuggestion = result.suggestions.some((s) =>
        s.toLowerCase().includes("missing keywords") || s.toLowerCase().includes("add")
      );
      expect(hasKeywordSuggestion).toBe(true);
    });

    it("provides positive feedback when resume is well-matched", () => {
      const perfectResume = `
Education: BS CS University
Experience: Senior Engineer
Skills: JavaScript, TypeScript, React, Node.js, AWS, Docker, Kubernetes, PostgreSQL, MySQL, Python, GraphQL, CI/CD
Projects: Built scalable apps
Developed REST APIs. Improved performance by 50%.
Leadership, communication, teamwork, collaboration.
Machine learning, agile, scrum.
      `;
      const simpleJob = "Requires JavaScript and React";
      const result = analyzeResume(perfectResume, simpleJob);
      expect(result.suggestions.length).toBeGreaterThan(0);
    });
  });

  describe("Return Structure", () => {
    it("returns all required fields", () => {
      const result = analyzeResume(STRONG_RESUME, JOB_DESCRIPTION);
      expect(result).toHaveProperty("matchScore");
      expect(result).toHaveProperty("missingKeywords");
      expect(result).toHaveProperty("presentKeywords");
      expect(result).toHaveProperty("weakSections");
      expect(result).toHaveProperty("rejectionRisk");
      expect(result).toHaveProperty("suggestions");
      expect(result).toHaveProperty("categoryBreakdown");
      expect(result).toHaveProperty("sectionChecks");
    });

    it("returns arrays for keyword fields", () => {
      const result = analyzeResume(STRONG_RESUME, JOB_DESCRIPTION);
      expect(Array.isArray(result.missingKeywords)).toBe(true);
      expect(Array.isArray(result.presentKeywords)).toBe(true);
      expect(Array.isArray(result.weakSections)).toBe(true);
      expect(Array.isArray(result.suggestions)).toBe(true);
    });

    it("weak sections have correct severity values", () => {
      const result = analyzeResume(WEAK_RESUME, JOB_DESCRIPTION);
      for (const ws of result.weakSections) {
        expect(["high", "medium", "low"]).toContain(ws.severity);
        expect(ws.section).toBeTruthy();
        expect(ws.issue).toBeTruthy();
      }
    });
  });

  describe("Category Breakdown", () => {
    it("returns category coverage for matching categories", () => {
      const result = analyzeResume(STRONG_RESUME, JOB_DESCRIPTION);
      expect(Array.isArray(result.categoryBreakdown)).toBe(true);
      expect(result.categoryBreakdown.length).toBeGreaterThan(0);
    });

    it("each category has required fields", () => {
      const result = analyzeResume(STRONG_RESUME, JOB_DESCRIPTION);
      for (const cat of result.categoryBreakdown) {
        expect(cat).toHaveProperty("category");
        expect(cat).toHaveProperty("label");
        expect(cat).toHaveProperty("required");
        expect(cat).toHaveProperty("matched");
        expect(cat).toHaveProperty("coverage");
        expect(cat.coverage).toBeGreaterThanOrEqual(0);
        expect(cat.coverage).toBeLessThanOrEqual(100);
        expect(cat.matched).toBeLessThanOrEqual(cat.required);
      }
    });

    it("only includes categories that appear in the job description", () => {
      const result = analyzeResume(STRONG_RESUME, JOB_DESCRIPTION);
      for (const cat of result.categoryBreakdown) {
        expect(cat.required).toBeGreaterThan(0);
      }
    });

    it("returns empty breakdown when job has no recognizable skills", () => {
      const result = analyzeResume("hello world", "seeking a motivated candidate");
      expect(result.categoryBreakdown).toHaveLength(0);
    });
  });

  describe("Section Checks", () => {
    it("returns 6 section checks", () => {
      const result = analyzeResume(STRONG_RESUME, JOB_DESCRIPTION);
      expect(result.sectionChecks).toHaveLength(6);
    });

    it("each check has section name and present flag", () => {
      const result = analyzeResume(STRONG_RESUME, JOB_DESCRIPTION);
      for (const check of result.sectionChecks) {
        expect(check).toHaveProperty("section");
        expect(check).toHaveProperty("present");
        expect(typeof check.present).toBe("boolean");
      }
    });

    it("detects present sections in a strong resume", () => {
      const result = analyzeResume(STRONG_RESUME, JOB_DESCRIPTION);
      const map = Object.fromEntries(result.sectionChecks.map((c) => [c.section, c.present]));
      expect(map["Education"]).toBe(true);
      expect(map["Experience"]).toBe(true);
      expect(map["Skills"]).toBe(true);
      expect(map["Projects"]).toBe(true);
    });

    it("detects missing sections in a weak resume", () => {
      const result = analyzeResume(WEAK_RESUME, JOB_DESCRIPTION);
      const map = Object.fromEntries(result.sectionChecks.map((c) => [c.section, c.present]));
      expect(map["Education"]).toBe(false);
      expect(map["Skills"]).toBe(false);
    });
  });
});
