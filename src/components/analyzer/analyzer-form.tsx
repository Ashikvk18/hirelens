"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ResultsPanel } from "./results-panel";
import { analyzeResume } from "@/lib/analyzer";
import { AnalysisResult } from "@/lib/types";
import { Loader2, FileText, Briefcase, RotateCcw, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function AnalyzerForm() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    setError("");

    if (!resume.trim()) {
      setError("Please paste your resume text.");
      return;
    }
    if (!jobDescription.trim()) {
      setError("Please paste the job description.");
      return;
    }
    if (resume.trim().length < 50) {
      setError("Resume seems too short. Please paste the full text.");
      return;
    }
    if (jobDescription.trim().length < 50) {
      setError("Job description seems too short. Please paste the full text.");
      return;
    }

    setLoading(true);
    setResult(null);

    // Simulate a brief processing delay for UX
    await new Promise((resolve) => setTimeout(resolve, 1200));

    try {
      const analysis = analyzeResume(resume, jobDescription);
      setResult(analysis);
    } catch {
      setError("Something went wrong during analysis. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResume("");
    setJobDescription("");
    setResult(null);
    setError("");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left: Input Panel */}
        <div className="space-y-6">
          {/* Resume Input */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border border-border bg-card/50 p-5"
          >
            <div className="mb-3 flex items-center gap-2">
              <FileText size={16} className="text-primary" />
              <h2 className="text-sm font-semibold">Your Resume</h2>
            </div>
            <Textarea
              placeholder="Paste your resume text here..."
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              className="min-h-[220px] text-sm leading-relaxed"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              {resume.split(/\s+/).filter(Boolean).length} words
            </p>
          </motion.div>

          {/* Job Description Input */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl border border-border bg-card/50 p-5"
          >
            <div className="mb-3 flex items-center gap-2">
              <Briefcase size={16} className="text-primary" />
              <h2 className="text-sm font-semibold">Job Description</h2>
            </div>
            <Textarea
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="min-h-[220px] text-sm leading-relaxed"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              {jobDescription.split(/\s+/).filter(Boolean).length} words
            </p>
          </motion.div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-sm text-red-400"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-3"
          >
            <Button
              size="lg"
              className="flex-1 gap-2"
              onClick={handleAnalyze}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap size={18} />
                  Analyze Match
                </>
              )}
            </Button>
            {result && (
              <Button
                size="lg"
                variant="secondary"
                onClick={handleReset}
                className="gap-2"
              >
                <RotateCcw size={16} />
                Reset
              </Button>
            )}
          </motion.div>
        </div>

        {/* Right: Results Panel */}
        <div>
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-border bg-card/50"
              >
                <Loader2 size={32} className="mb-4 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                  Analyzing your resume...
                </p>
              </motion.div>
            )}

            {!loading && result && (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ResultsPanel result={result} resume={resume} jobDescription={jobDescription} />
              </motion.div>
            )}

            {!loading && !result && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/30"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
                  <Zap size={24} className="text-muted-foreground" />
                </div>
                <p className="mb-1 font-medium">No analysis yet</p>
                <p className="text-sm text-muted-foreground">
                  Paste your resume and a job description, then hit Analyze.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
