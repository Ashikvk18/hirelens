export interface AnalysisResult {
  matchScore: number;
  missingKeywords: string[];
  presentKeywords: string[];
  weakSections: WeakSection[];
  rejectionRisk: RejectionRisk;
  suggestions: string[];
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
