export interface CategoryCoverage {
  category: string;
  label: string;
  required: number;
  matched: number;
  coverage: number;
}

export interface SectionCheck {
  section: string;
  present: boolean;
}

export interface AnalysisResult {
  matchScore: number;
  missingKeywords: string[];
  presentKeywords: string[];
  weakSections: WeakSection[];
  rejectionRisk: RejectionRisk;
  suggestions: string[];
  categoryBreakdown: CategoryCoverage[];
  sectionChecks: SectionCheck[];
}

export interface WeakSection {
  section: string;
  issue: string;
  severity: "high" | "medium" | "low";
}

export interface RejectionRisk {
  level: "high" | "medium" | "low";
  score: number;
  reasons: string[];
}
