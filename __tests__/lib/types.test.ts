/**
 * Tests to verify the type contracts and data structures
 * used throughout the application.
 */

import { AnalysisResult, WeakSection, RejectionRisk } from "@/lib/types";

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
      };

      expect(typeof result.matchScore).toBe("number");
      expect(Array.isArray(result.missingKeywords)).toBe(true);
      expect(Array.isArray(result.presentKeywords)).toBe(true);
      expect(Array.isArray(result.weakSections)).toBe(true);
      expect(typeof result.rejectionRisk).toBe("object");
      expect(Array.isArray(result.suggestions)).toBe(true);
    });
  });
});
