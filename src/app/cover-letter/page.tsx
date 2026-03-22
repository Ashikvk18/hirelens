"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Loader2,
  Copy,
  Check,
  Download,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  scrollBlurUp,
  scrollFadeUp,
  scrollStagger,
  scrollStaggerItem,
  viewportOnce,
  viewportOnceEarly,
} from "@/lib/motion";

type Tone = "professional" | "confident" | "enthusiastic";

interface CoverLetterResult {
  coverLetter: string;
  highlights: string[];
  wordCount: number;
}

export default function CoverLetterPage() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [tone, setTone] = useState<Tone>("professional");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<CoverLetterResult | null>(null);
  const [copied, setCopied] = useState(false);

  const generate = useCallback(async () => {
    if (!resume.trim() || !jobDescription.trim()) {
      setError("Please paste both your resume and the job description.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/ai/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, jobDescription, tone }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate cover letter");
      }

      setResult(data.result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [resume, jobDescription, tone]);

  const handleCopy = useCallback(() => {
    if (!result?.coverLetter) return;
    navigator.clipboard.writeText(result.coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [result]);

  const handleDownload = useCallback(() => {
    if (!result?.coverLetter) return;
    const blob = new Blob([result.coverLetter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cover-letter.txt";
    a.click();
    URL.revokeObjectURL(url);
  }, [result]);

  const toneOptions: { value: Tone; label: string; desc: string }[] = [
    { value: "professional", label: "Professional", desc: "Polished & warm" },
    { value: "confident", label: "Confident", desc: "Bold & assertive" },
    { value: "enthusiastic", label: "Enthusiastic", desc: "Passionate & energetic" },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.04] bg-background/70 backdrop-blur-2xl backdrop-saturate-150">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">Home</span>
          </Link>
          <div className="flex items-center gap-1.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-primary to-accent">
              <FileText size={11} className="text-white" />
            </div>
            <span className="text-[13px] font-bold tracking-tight">Cover Letter</span>
          </div>
          <div className="w-16" />
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {/* Title */}
        <motion.div
          variants={scrollBlurUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnceEarly}
        >
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Cover Letter Generator
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Paste your resume and a job description — get a tailored, professional cover letter in seconds.
          </p>
        </motion.div>

        {/* Input Section */}
        <motion.div
          variants={scrollFadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnceEarly}
          className="mt-6 grid gap-4 lg:grid-cols-2"
        >
          {/* Resume */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Your Resume
            </label>
            <textarea
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              placeholder="Paste your resume text here..."
              rows={10}
              className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          {/* Job Description */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the target job description here..."
              rows={10}
              className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>
        </motion.div>

        {/* Tone Selector + Generate Button */}
        <motion.div
          variants={scrollFadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnceEarly}
          className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          {/* Tone */}
          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">
              Tone
            </label>
            <div className="flex gap-2">
              {toneOptions.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTone(t.value)}
                  className={`rounded-lg border px-3 py-2 text-left transition-all duration-200 ${
                    tone === t.value
                      ? "border-primary/50 bg-primary/10 text-foreground"
                      : "border-white/[0.06] bg-white/[0.02] text-muted-foreground hover:border-white/[0.1] hover:bg-white/[0.04]"
                  }`}
                >
                  <p className="text-xs font-semibold">{t.label}</p>
                  <p className="text-[10px] text-muted-foreground">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Generate */}
          <Button
            onClick={generate}
            disabled={loading || !resume.trim() || !jobDescription.trim()}
            className="gap-2 shadow-lg shadow-primary/20"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Generate Cover Letter
              </>
            )}
          </Button>
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-4 rounded-lg bg-red-500/10 p-4 text-sm text-red-400"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Skeleton */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-6 space-y-3"
            >
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-4 animate-pulse rounded-lg bg-white/[0.04]"
                  style={{ width: `${85 - i * 8}%` }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result */}
        <AnimatePresence>
          {result && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5 }}
              className="mt-6 space-y-4"
            >
              {/* Cover Letter Card */}
              <div className="rounded-2xl border border-white/[0.06] bg-card/50 p-6 sm:p-8">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-primary" />
                    <h3 className="text-sm font-semibold">Your Cover Letter</h3>
                    <span className="rounded-md bg-white/[0.04] px-2 py-0.5 text-[10px] text-muted-foreground">
                      {result.wordCount} words
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopy}
                      className="gap-1.5 text-xs"
                    >
                      {copied ? (
                        <>
                          <Check size={13} className="text-emerald-400" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          Copy
                        </>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDownload}
                      className="gap-1.5 text-xs"
                    >
                      <Download size={13} />
                      Download
                    </Button>
                  </div>
                </div>

                {/* Cover Letter Text */}
                <div className="whitespace-pre-wrap rounded-xl border border-white/[0.04] bg-white/[0.02] p-5 text-[14px] leading-relaxed text-foreground/90">
                  {result.coverLetter}
                </div>
              </div>

              {/* Highlights */}
              {result.highlights?.length > 0 && (
                <motion.div
                  variants={scrollStagger(0.08)}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportOnce}
                >
                  <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
                    Key Points Used From Your Resume
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.highlights.map((h, i) => (
                      <motion.span
                        key={i}
                        variants={scrollStaggerItem}
                        className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs text-primary"
                      >
                        {h}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Regenerate */}
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={generate}
                  disabled={loading}
                  className="gap-2"
                >
                  <RefreshCw size={14} />
                  Regenerate
                </Button>
                <Link href="/analyze">
                  <Button variant="ghost" className="gap-2 text-xs">
                    <ArrowLeft size={13} />
                    Back to Analyzer
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
