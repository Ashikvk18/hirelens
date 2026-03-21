"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Loader2,
  Copy,
  Check,
  FileText,
  Target,
  TrendingUp,
  Layers,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface RewriteVersion {
  label: string;
  description: string;
  resume: string;
}

interface ResumeRewriterProps {
  resume: string;
  jobDescription: string;
  missingKeywords: string[];
}

const versionIcons = [Target, TrendingUp, Layers];

export function ResumeRewriter({
  resume,
  jobDescription,
  missingKeywords,
}: ResumeRewriterProps) {
  const [versions, setVersions] = useState<RewriteVersion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(0);
  const [copied, setCopied] = useState(false);

  const fetchRewrites = async () => {
    setLoading(true);
    setError("");
    setVersions([]);
    setSelected(0);

    try {
      const res = await fetch("/api/ai/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, jobDescription, missingKeywords }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to generate rewrites.");
        return;
      }

      setVersions(data.versions || []);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (versions[selected]) {
      navigator.clipboard.writeText(versions[selected].resume);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Initial state — show button
  if (versions.length === 0 && !loading && !error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="rounded-xl border border-dashed border-accent/30 bg-accent/5 p-6 text-center"
      >
        <FileText size={24} className="mx-auto mb-3 text-accent" />
        <h3 className="mb-1 font-semibold">AI Resume Rewriter</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Generate 3 tailored versions of your resume optimized for this job.
        </p>
        <Button onClick={fetchRewrites} disabled={loading} className="gap-2">
          <Sparkles size={16} />
          Generate Rewritten Resumes
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55 }}
      className="rounded-xl border border-accent/20 bg-accent/5 p-6"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-accent">
          <Sparkles size={14} />
          AI Resume Rewriter
        </h3>
        {versions.length > 0 && (
          <Button
            size="sm"
            variant="ghost"
            onClick={fetchRewrites}
            disabled={loading}
            className="text-xs"
          >
            Regenerate
          </Button>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 size={28} className="mb-3 animate-spin text-accent" />
          <p className="text-sm text-muted-foreground">
            AI is rewriting your resume in 3 styles...
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            This may take 10-15 seconds
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
          {error}
          <Button
            size="sm"
            variant="ghost"
            onClick={fetchRewrites}
            className="ml-2 text-xs text-red-400 hover:text-red-300"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Version selector tabs */}
      <AnimatePresence>
        {versions.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Tabs */}
            <div className="mb-4 flex gap-2">
              {versions.map((v, i) => {
                const Icon = versionIcons[i] || Target;
                return (
                  <button
                    key={i}
                    onClick={() => setSelected(i)}
                    className={`flex-1 rounded-lg border p-3 text-left transition-all ${
                      selected === i
                        ? "border-accent bg-accent/10"
                        : "border-border bg-card/30 hover:border-muted-foreground"
                    }`}
                  >
                    <div className="mb-1 flex items-center gap-1.5">
                      <Icon
                        size={13}
                        className={
                          selected === i
                            ? "text-accent"
                            : "text-muted-foreground"
                        }
                      />
                      <span
                        className={`text-xs font-semibold ${
                          selected === i ? "text-accent" : "text-foreground"
                        }`}
                      >
                        {v.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-snug">
                      {v.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Resume content */}
            <div className="relative">
              <div className="max-h-[400px] overflow-y-auto rounded-lg border border-border bg-secondary/30 p-4">
                <pre className="whitespace-pre-wrap text-sm leading-relaxed text-foreground font-sans">
                  {versions[selected]?.resume}
                </pre>
              </div>

              {/* Copy button */}
              <div className="mt-3 flex justify-end">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={copyToClipboard}
                  className="gap-1.5"
                >
                  {copied ? (
                    <>
                      <Check size={14} className="text-emerald-400" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      Copy Resume
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
