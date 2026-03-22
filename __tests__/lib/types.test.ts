/**
 * Tests to verify the type contracts and data structures
 * used throughout the application.
 */

import { AnalysisResult, WeakSection, RejectionRisk, CategoryCoverage, SectionCheck } from "@/lib/types";

describe("Type Contracts", () => {
  describe("WeakSection", () => {
    it("accepts valid severity values", () => {
      const high: WeakSection = { section: "Education", issue: "Missing", severity: "high" };
      const medium: WeakSection = { section: "Skills", issue: "Weak", severity: "medium" };
      const low: WeakSection = { section: "Format", issue: "Minor", severity: "low" };

      expect(high.severity).toBe("high");
      expect(medium.severity).toBe("medium");
      expect(low.severity).toBe("low");
    });
  });

  describe("RejectionRisk", () => {
    it("accepts valid risk levels", () => {
      const risk: RejectionRisk = {
        level: "high",
        score: 75,
        reasons: ["Missing keywords", "No experience section"],
      };

      expect(risk.level).toBe("high");
      expect(risk.score).toBe(75);
      expect(risk.reasons).toHaveLength(2);
    });

    it("score is a number", () => {
      const risk: RejectionRisk = { level: "low", score: 15, reasons: [] };
      expect(typeof risk.score).toBe("number");
    });
  });

  describe("CategoryCoverage", () => {
    it("accepts valid coverage data", () => {
      const coverage: CategoryCoverage = {
        category: "programming",
        label: "Languages",
        required: 5,
        matched: 3,
        coverage: 60,
      };
      expect(coverage.coverage).toBe(60);
      expect(coverage.matched).toBeLessThanOrEqual(coverage.required);
    });
  });

  describe("SectionCheck", () => {
    it("accepts valid section check data", () => {
      const check: SectionCheck = { section: "Education", present: true };
      expect(typeof check.present).toBe("boolean");
      expect(check.section).toBeTruthy();
    });
  });

  describe("AnalysisResult", () => {
    it("has all required fields with correct types", () => {
      const result: AnalysisResult = {
        matchScore: 72,
        missingKeywords: ["kubernetes", "graphql"],
        presentKeywords: ["react", "typescript"],
        weakSections: [
          { section: "Impact", issue: "No metrics", severity: "medium" },
        ],
        rejectionRisk: {
          level: "medium",
          score: 40,
          reasons: ["Some keywords missing"],
        },
        suggestions: ["Add Kubernetes to your skills"],
        categoryBreakdown: [
          { category: "programming", label: "Languages", required: 3, matched: 2, coverage: 67 },
        ],
        sectionChecks: [
          { section: "Education", present: true },
        ],
      };

      expect(typeof result.matchScore).toBe("number");
      expect(Array.isArray(result.missingKeywords)).toBe(true);
      expect(Array.isArray(result.presentKeywords)).toBe(true);
      expect(Array.isArray(result.weakSections)).toBe(true);
      expect(typeof result.rejectionRisk).toBe("object");
      expect(Array.isArray(result.suggestions)).toBe(true);
      expect(Array.isArray(result.categoryBreakdown)).toBe(true);
      expect(Array.isArray(result.sectionChecks)).toBe(true);
    });
  });
});
