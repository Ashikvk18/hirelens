"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Loader2,
  ArrowLeft,
  Target,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  FolderGit2,
  Clock,
  Award,
  ExternalLink,
  Sparkles,
  Route,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MissingSkill {
  skill: string;
  priority: "critical" | "important" | "nice-to-have";
  reason: string;
}

interface StrongSkill {
  skill: string;
  relevance: string;
}

interface Task {
  task: string;
  resource: string;
  duration: string;
  type: "course" | "project" | "practice" | "reading";
}

interface Phase {
  phase: string;
  description: string;
  tasks: Task[];
}

interface Project {
  title: string;
  description: string;
  skills: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
}

interface Certification {
  name: string;
  provider: string;
  cost: string;
  link: string;
  relevance: string;
}

interface RoadmapData {
  gapAnalysis: {
    missingSkills: MissingSkill[];
    strongSkills: StrongSkill[];
  };
  roadmap: Phase[];
  projects: Project[];
  timeline: {
    totalWeeks: number;
    hoursPerWeek: number;
    summary: string;
  };
  certifications: Certification[];
}

const PRIORITY_STYLES: Record<string, string> = {
  critical: "text-red-400 bg-red-400/10 border-red-400/20",
  important: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  "nice-to-have": "text-blue-400 bg-blue-400/10 border-blue-400/20",
};

const DIFFICULTY_STYLES: Record<string, string> = {
  beginner: "text-emerald-400 bg-emerald-400/10",
  intermediate: "text-amber-400 bg-amber-400/10",
  advanced: "text-red-400 bg-red-400/10",
};

const TYPE_ICONS: Record<string, string> = {
  course: "📚",
  project: "🛠️",
  practice: "💪",
  reading: "📖",
};

export default function SkillsRoadmapPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const jobTitle = searchParams.get("title") || "";
  const company = searchParams.get("company") || "";
  const requiredSkills = searchParams.get("skills")?.split(",").filter(Boolean) || [];

  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [customTitle, setCustomTitle] = useState(jobTitle);
  const [customCompany, setCustomCompany] = useState(company);
  const [expandedPhase, setExpandedPhase] = useState<number | null>(0);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    }
  }, [authLoading, user, router]);

  // Load user skills from profile
  useEffect(() => {
    if (!user) return;
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data.profile?.skills) {
          setUserSkills(data.profile.skills);
        }
        if (jobTitle) {
          generate(jobTitle, company, requiredSkills, data.profile?.skills || []);
        }
      })
      .catch(() => {
        if (jobTitle) generate(jobTitle, company, requiredSkills, []);
      });
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const generate = async (title: string, comp: string, reqSkills: string[], usrSkills: string[]) => {
    setLoading(true);
    setError("");
    setRoadmap(null);
    try {
      const res = await fetch("/api/skills-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: title,
          company: comp,
          requiredSkills: reqSkills,
          userSkills: usrSkills,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setRoadmap(data.roadmap);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to generate");
    } finally {
      setLoading(false);
    }
  };

  const handleCustomGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTitle.trim()) {
      generate(customTitle.trim(), customCompany.trim(), requiredSkills, userSkills);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 size={24} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.04] bg-background/70 backdrop-blur-2xl backdrop-saturate-150">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/jobs"
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground"
          >
            <ArrowLeft size={14} />
            Jobs
          </Link>
          <div className="flex items-center gap-1.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-primary to-accent">
              <Route size={11} className="text-white" />
            </div>
            <span className="text-[13px] font-bold tracking-tight">Skills Roadmap</span>
          </div>
          <div className="w-16" />
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        {/* Title */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Skills Gap & Learning Roadmap
          </h1>
          {jobTitle && (
            <p className="mt-1 text-sm text-muted-foreground">
              {jobTitle}{company ? ` at ${company}` : ""}
            </p>
          )}
        </motion.div>

        {/* Custom search */}
        <motion.form
          onSubmit={handleCustomGenerate}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mt-5 flex flex-col gap-2 sm:flex-row"
        >
          <input
            type="text"
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            placeholder="Job title (e.g. Data Scientist)"
            className="flex-1 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            type="text"
            value={customCompany}
            onChange={(e) => setCustomCompany(e.target.value)}
            placeholder="Company (optional)"
            className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring sm:w-48"
          />
          <Button type="submit" disabled={loading || !customTitle.trim()} className="gap-2">
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            Generate
          </Button>
        </motion.form>

        {/* Loading */}
        {loading && (
          <div className="mt-16 flex flex-col items-center justify-center">
            <Loader2 size={28} className="mb-3 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Analyzing skills gap and building your roadmap...
            </p>
            <p className="mt-1 text-xs text-muted-foreground/60">This may take 10-15 seconds</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="mt-6 rounded-lg bg-red-500/10 p-4 text-sm text-red-400">
            {error}
            <Button size="sm" variant="ghost" onClick={() => generate(customTitle, customCompany, requiredSkills, userSkills)} className="ml-2 text-xs">
              Retry
            </Button>
          </div>
        )}

        {/* Results */}
        {roadmap && !loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 space-y-6">

            {/* Timeline summary */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.02] px-4 py-2">
                <Clock size={13} className="text-primary" />
                <span className="text-[13px] text-muted-foreground">
                  {roadmap.timeline.totalWeeks} weeks &middot; {roadmap.timeline.hoursPerWeek} hrs/week
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.02] px-4 py-2">
                <Target size={13} className="text-red-400" />
                <span className="text-[13px] text-muted-foreground">
                  {roadmap.gapAnalysis.missingSkills.length} skills to learn
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.02] px-4 py-2">
                <CheckCircle2 size={13} className="text-emerald-400" />
                <span className="text-[13px] text-muted-foreground">
                  {roadmap.gapAnalysis.strongSkills.length} strong skills
                </span>
              </div>
            </div>

            {/* Gap Analysis */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Missing Skills */}
              <div className="rounded-2xl border border-white/[0.04] bg-card/40 p-5">
                <h3 className="mb-3 flex items-center gap-2 text-[14px] font-semibold">
                  <AlertTriangle size={15} className="text-amber-400" />
                  Skills to Learn
                </h3>
                <div className="space-y-2">
                  {roadmap.gapAnalysis.missingSkills.map((s, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className={`mt-0.5 shrink-0 rounded-md border px-1.5 py-0.5 text-[10px] font-bold ${PRIORITY_STYLES[s.priority] || PRIORITY_STYLES.important}`}>
                        {s.priority}
                      </span>
                      <div>
                        <p className="text-[13px] font-medium">{s.skill}</p>
                        <p className="text-[11px] text-muted-foreground">{s.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strong Skills */}
              <div className="rounded-2xl border border-white/[0.04] bg-card/40 p-5">
                <h3 className="mb-3 flex items-center gap-2 text-[14px] font-semibold">
                  <CheckCircle2 size={15} className="text-emerald-400" />
                  Your Strengths
                </h3>
                <div className="space-y-2">
                  {roadmap.gapAnalysis.strongSkills.map((s, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 size={12} className="mt-0.5 shrink-0 text-emerald-400" />
                      <div>
                        <p className="text-[13px] font-medium">{s.skill}</p>
                        <p className="text-[11px] text-muted-foreground">{s.relevance}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Learning Roadmap Phases */}
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-[15px] font-semibold">
                <BookOpen size={16} className="text-primary" />
                Learning Roadmap
              </h3>
              <div className="space-y-3">
                {roadmap.roadmap.map((phase, i) => {
                  const isOpen = expandedPhase === i;
                  return (
                    <div key={i} className="overflow-hidden rounded-2xl border border-white/[0.04] bg-card/40 transition-colors hover:border-white/[0.08]">
                      <button
                        onClick={() => setExpandedPhase(isOpen ? null : i)}
                        className="flex w-full items-center gap-3 p-4 text-left"
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-[12px] font-bold text-primary">
                          {i + 1}
                        </span>
                        <div className="flex-1">
                          <p className="text-[14px] font-semibold">{phase.phase}</p>
                          <p className="text-[12px] text-muted-foreground">{phase.description}</p>
                        </div>
                        <ChevronDown
                          size={14}
                          className={`shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="border-t border-white/[0.04] p-4 space-y-2.5">
                              {phase.tasks.map((task, j) => (
                                <div key={j} className="flex items-start gap-3 rounded-lg bg-white/[0.02] p-3">
                                  <span className="mt-0.5 text-base">{TYPE_ICONS[task.type] || "📌"}</span>
                                  <div className="flex-1">
                                    <p className="text-[13px] font-medium">{task.task}</p>
                                    <p className="mt-0.5 text-[11px] text-primary">{task.resource}</p>
                                    <p className="mt-0.5 text-[11px] text-muted-foreground">{task.duration}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Projects */}
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-[15px] font-semibold">
                <FolderGit2 size={16} className="text-emerald-400" />
                Portfolio Projects
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {roadmap.projects.map((p, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-2xl border border-white/[0.04] bg-card/40 p-4 transition-colors hover:border-white/[0.08]"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <h4 className="text-[13px] font-semibold">{p.title}</h4>
                      <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${DIFFICULTY_STYLES[p.difficulty] || DIFFICULTY_STYLES.intermediate}`}>
                        {p.difficulty}
                      </span>
                    </div>
                    <p className="text-[12px] leading-relaxed text-muted-foreground">{p.description}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {p.skills.map((s) => (
                        <span key={s} className="rounded-md bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-muted-foreground">
                          {s}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            {roadmap.certifications?.length > 0 && (
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-[15px] font-semibold">
                  <Award size={16} className="text-amber-400" />
                  Recommended Certifications
                </h3>
                <div className="space-y-2">
                  {roadmap.certifications.map((c, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-xl border border-white/[0.04] bg-card/40 p-4 transition-colors hover:border-white/[0.08]">
                      <Award size={16} className="mt-0.5 shrink-0 text-amber-400" />
                      <div className="flex-1">
                        <p className="text-[13px] font-semibold">{c.name}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {c.provider} &middot; {c.cost}
                        </p>
                        <p className="mt-1 text-[11px] text-muted-foreground">{c.relevance}</p>
                      </div>
                      {c.link && c.link !== "N/A" && (
                        <a
                          href={c.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground"
                        >
                          <ExternalLink size={13} />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Empty state */}
        {!loading && !roadmap && !error && !jobTitle && (
          <div className="mt-20 text-center">
            <Route size={36} className="mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground">
              Enter a job title to analyze your skills gap and get a learning roadmap.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
