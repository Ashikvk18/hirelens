"use client";

import { AnalysisResult } from "@/lib/types";
import { ScoreRing } from "./score-ring";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AISuggestions } from "./ai-suggestions";
import { ResumeRewriter } from "./resume-rewriter";
import { OutreachGenerator } from "./outreach-generator";
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Lightbulb,
  TrendingDown,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

interface ResultsPanelProps {
  result: AnalysisResult;
  resume: string;
  jobDescription: string;
}

const fadeUp = {
  initial: { opacity: 0, y: 16, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export function ResultsPanel({ result, resume, jobDescription }: ResultsPanelProps) {
  const riskColor =
    result.rejectionRisk.level === "high"
      ? "text-red-400"
      : result.rejectionRisk.level === "medium"
        ? "text-amber-400"
        : "text-emerald-400";

  const riskBg =
    result.rejectionRisk.level === "high"
      ? "bg-red-500/10"
      : result.rejectionRisk.level === "medium"
        ? "bg-amber-500/10"
        : "bg-emerald-500/10";

  const riskBarColor =
    result.rejectionRisk.level === "high"
      ? "bg-red-500"
      : result.rejectionRisk.level === "medium"
        ? "bg-amber-500"
        : "bg-emerald-500";

  return (
    <div className="space-y-6">
      {/* Match Score */}
      <motion.div
        {...fadeUp}
        transition={{ delay: 0.1 }}
        className="rounded-xl border border-border bg-card/50 p-6 text-center"
      >
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Match Score
        </h3>
        <ScoreRing score={result.matchScore} />
      </motion.div>

      {/* Keywords */}
      <motion.div
        {...fadeUp}
        transition={{ delay: 0.2 }}
        className="rounded-xl border border-border bg-card/50 p-6"
      >
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Keyword Analysis
        </h3>

        {result.presentKeywords.length > 0 && (
          <div className="mb-4">
            <div className="mb-2 flex items-center gap-2 text-sm text-emerald-400">
              <CheckCircle2 size={14} />
              <span className="font-medium">
                Found ({result.presentKeywords.length})
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {result.presentKeywords.map((kw) => (
                <Badge key={kw} variant="success" className="text-xs">
                  {kw}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {result.missingKeywords.length > 0 && (
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-red-400">
              <XCircle size={14} />
              <span className="font-medium">
                Missing ({result.missingKeywords.length})
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {result.missingKeywords.map((kw) => (
                <Badge key={kw} variant="destructive" className="text-xs">
                  {kw}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Rejection Risk */}
      <motion.div
        {...fadeUp}
        transition={{ delay: 0.3 }}
        className={`rounded-xl border border-border p-6 ${riskBg}`}
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Rejection Risk
          </h3>
          <div className={`flex items-center gap-1.5 text-sm font-semibold ${riskColor}`}>
            <TrendingDown size={14} />
            {result.rejectionRisk.level.toUpperCase()}
          </div>
        </div>
        <Progress
          value={result.rejectionRisk.score}
          indicatorClassName={riskBarColor}
          className="mb-3"
        />
        <ul className="space-y-1.5">
          {result.rejectionRisk.reasons.map((reason, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm text-muted-foreground"
            >
              <AlertTriangle size={13} className={`mt-0.5 shrink-0 ${riskColor}`} />
              {reason}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Weak Sections */}
      {result.weakSections.length > 0 && (
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.4 }}
          className="rounded-xl border border-border bg-card/50 p-6"
        >
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Weak Sections
          </h3>
          <div className="space-y-3">
            {result.weakSections.map((ws, i) => (
              <div
                key={i}
                className="rounded-lg border border-border bg-secondary/30 p-3"
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-semibold">{ws.section}</span>
                  <Badge
                    variant={
                      ws.severity === "high"
                        ? "destructive"
                        : ws.severity === "medium"
                          ? "warning"
                          : "secondary"
                    }
                  >
                    {ws.severity}
                  </Badge>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {ws.issue}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Suggestions */}
      <motion.div
        {...fadeUp}
        transition={{ delay: 0.5 }}
        className="rounded-xl border border-primary/20 bg-primary/5 p-6"
      >
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary">
          <Sparkles size={14} />
          Improvement Suggestions
        </h3>
        <ul className="space-y-2.5">
          {result.suggestions.map((s, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm text-muted-foreground"
            >
              <Lightbulb size={13} className="mt-0.5 shrink-0 text-primary" />
              {s}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* AI Resume Rewriter */}
      <ResumeRewriter
        resume={resume}
        jobDescription={jobDescription}
        missingKeywords={result.missingKeywords}
      />

      {/* AI-Powered Suggestions */}
      <AISuggestions
        resume={resume}
        jobDescription={jobDescription}
        missingKeywords={result.missingKeywords}
        weakSections={result.weakSections}
      />

      {/* Outreach Message Generator */}
      <OutreachGenerator
        resume={resume}
        jobDescription={jobDescription}
        matchScore={result.matchScore}
      />
    </div>
  );
}
