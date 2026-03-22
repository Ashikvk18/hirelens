"use client";

import { SectionCheck } from "@/lib/types";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Briefcase,
  Wrench,
  FolderGit2,
  BarChart3,
  Zap,
  Check,
  X,
} from "lucide-react";

interface SectionCompletenessProps {
  checks: SectionCheck[];
}

const SECTION_ICONS: Record<string, React.ElementType> = {
  Education: GraduationCap,
  Experience: Briefcase,
  Skills: Wrench,
  Projects: FolderGit2,
  Metrics: BarChart3,
  "Action Verbs": Zap,
};

export function SectionCompleteness({ checks }: SectionCompletenessProps) {
  const presentCount = checks.filter((c) => c.present).length;
  const totalCount = checks.length;
  const percentage = Math.round((presentCount / totalCount) * 100);

  const barColor =
    percentage >= 80
      ? "bg-emerald-500"
      : percentage >= 50
        ? "bg-amber-500"
        : "bg-red-500";

  const textColor =
    percentage >= 80
      ? "text-emerald-400"
      : percentage >= 50
        ? "text-amber-400"
        : "text-red-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.5 }}
      className="rounded-xl border border-border bg-card/50 p-6"
    >
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Resume Completeness
        </h3>
        <span className={`text-sm font-bold ${textColor}`}>
          {presentCount}/{totalCount}
        </span>
      </div>
      <p className="mb-4 text-xs text-muted-foreground/60">
        Key sections and best practices detected in your resume
      </p>

      {/* Overall progress bar */}
      <div className="mb-5 h-2 w-full overflow-hidden rounded-full bg-white/[0.04]">
        <motion.div
          className={`h-full rounded-full ${barColor}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
        />
      </div>

      {/* Individual section checks */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {checks.map((check, i) => {
          const Icon = SECTION_ICONS[check.section] || Wrench;
          return (
            <motion.div
              key={check.section}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.06 }}
              className={`flex items-center gap-2.5 rounded-lg border px-3 py-2.5 transition-colors ${
                check.present
                  ? "border-emerald-500/20 bg-emerald-500/[0.06]"
                  : "border-red-500/20 bg-red-500/[0.06]"
              }`}
            >
              <Icon
                size={14}
                className={check.present ? "text-emerald-400" : "text-red-400/60"}
              />
              <span
                className={`flex-1 text-[12px] font-medium ${
                  check.present ? "text-foreground/80" : "text-muted-foreground"
                }`}
              >
                {check.section}
              </span>
              {check.present ? (
                <Check size={12} className="text-emerald-400" />
              ) : (
                <X size={12} className="text-red-400/60" />
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
