"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Loader2,
  ArrowLeft,
  MessageCircle,
  Code2,
  Users,
  Briefcase,
  HelpCircle,
  Lightbulb,
  ChevronDown,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface QA {
  question: string;
  tip: string;
  sampleAnswer: string;
}

interface AskQ {
  question: string;
  why: string;
}

interface PrepData {
  behavioral: QA[];
  technical: QA[];
  situational: QA[];
  roleSpecific: QA[];
  questionsToAsk: AskQ[];
  tips: string[];
}

const CATEGORIES = [
  { key: "behavioral", label: "Behavioral", icon: MessageCircle, color: "text-blue-400 bg-blue-400/10" },
  { key: "technical", label: "Technical", icon: Code2, color: "text-emerald-400 bg-emerald-400/10" },
  { key: "situational", label: "Situational", icon: Users, color: "text-amber-400 bg-amber-400/10" },
  { key: "roleSpecific", label: "Role-Specific", icon: Briefcase, color: "text-violet-400 bg-violet-400/10" },
  { key: "questionsToAsk", label: "Questions to Ask", icon: HelpCircle, color: "text-pink-400 bg-pink-400/10" },
  { key: "tips", label: "Tips", icon: Lightbulb, color: "text-yellow-400 bg-yellow-400/10" },
];

export default function InterviewPrepPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const jobTitle = searchParams.get("title") || "";
  const company = searchParams.get("company") || "";
  const skills = searchParams.get("skills")?.split(",").filter(Boolean) || [];

  const [prep, setPrep] = useState<PrepData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("behavioral");
  const [expandedQ, setExpandedQ] = useState<string | null>(null);
  const [customTitle, setCustomTitle] = useState(jobTitle);
  const [customCompany, setCustomCompany] = useState(company);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user && jobTitle) {
      generate(jobTitle, company, skills);
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const generate = async (title: string, comp: string, sk: string[]) => {
    setLoading(true);
    setError("");
    setPrep(null);
    try {
      const res = await fetch("/api/interview-prep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle: title, company: comp, skills: sk }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setPrep(data.prep);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to generate");
    } finally {
      setLoading(false);
    }
  };

  const handleCustomGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTitle.trim()) {
      generate(customTitle.trim(), customCompany.trim(), skills);
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
              <BookOpen size={11} className="text-white" />
            </div>
            <span className="text-[13px] font-bold tracking-tight">Interview Prep</span>
          </div>
          <div className="w-16" />
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        {/* Title */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Interview Preparation
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
            placeholder="Job title (e.g. Software Engineer)"
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
              Generating interview questions for {customTitle || jobTitle}...
            </p>
            <p className="mt-1 text-xs text-muted-foreground/60">This may take 10-15 seconds</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="mt-6 rounded-lg bg-red-500/10 p-4 text-sm text-red-400">
            {error}
            <Button size="sm" variant="ghost" onClick={() => generate(customTitle, customCompany, skills)} className="ml-2 text-xs">
              Retry
            </Button>
          </div>
        )}

        {/* Results */}
        {prep && !loading && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
            {/* Category tabs */}
            <div className="flex flex-wrap gap-1.5 rounded-xl border border-white/[0.04] bg-white/[0.02] p-1.5">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setActiveTab(cat.key)}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-medium transition-colors ${
                      activeTab === cat.key
                        ? "bg-white/[0.06] text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/[0.03]"
                    }`}
                  >
                    <Icon size={13} />
                    <span className="hidden sm:inline">{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Content */}
            <div className="mt-4 space-y-3">
              {/* Q&A Categories */}
              {["behavioral", "technical", "situational", "roleSpecific"].includes(activeTab) && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="space-y-3"
                  >
                    {(prep[activeTab as keyof PrepData] as QA[])?.map((qa, i) => {
                      const isOpen = expandedQ === `${activeTab}-${i}`;
                      const catInfo = CATEGORIES.find((c) => c.key === activeTab)!;
                      return (
                        <div
                          key={i}
                          className="overflow-hidden rounded-xl border border-white/[0.04] bg-card/40 transition-colors hover:border-white/[0.08]"
                        >
                          <button
                            onClick={() => setExpandedQ(isOpen ? null : `${activeTab}-${i}`)}
                            className="flex w-full items-start gap-3 p-4 text-left"
                          >
                            <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${catInfo.color} text-[11px] font-bold`}>
                              {i + 1}
                            </span>
                            <span className="flex-1 text-[14px] font-medium leading-relaxed">
                              {qa.question}
                            </span>
                            <ChevronDown
                              size={14}
                              className={`mt-1 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
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
                                <div className="border-t border-white/[0.04] px-4 py-4 pl-13 space-y-3">
                                  <div>
                                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
                                      Tip
                                    </p>
                                    <p className="text-[13px] leading-relaxed text-muted-foreground">
                                      {qa.tip}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
                                      Sample Answer
                                    </p>
                                    <p className="text-[13px] leading-relaxed text-foreground/80">
                                      {qa.sampleAnswer}
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </motion.div>
                </AnimatePresence>
              )}

              {/* Questions to Ask */}
              {activeTab === "questionsToAsk" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  {prep.questionsToAsk?.map((q, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-white/[0.04] bg-card/40 p-4 transition-colors hover:border-white/[0.08]"
                    >
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-pink-400/10 text-[11px] font-bold text-pink-400">
                          {i + 1}
                        </span>
                        <div>
                          <p className="text-[14px] font-medium">{q.question}</p>
                          <p className="mt-1.5 text-[12px] text-muted-foreground">{q.why}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* Tips */}
              {activeTab === "tips" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  {prep.tips?.map((tip, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 rounded-xl border border-white/[0.04] bg-card/40 p-4 transition-colors hover:border-white/[0.08]"
                    >
                      <Lightbulb size={14} className="mt-0.5 shrink-0 text-yellow-400" />
                      <p className="text-[13px] leading-relaxed text-foreground/80">{tip}</p>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Empty state */}
        {!loading && !prep && !error && !jobTitle && (
          <div className="mt-20 text-center">
            <BookOpen size={36} className="mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground">
              Enter a job title above to generate interview questions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
