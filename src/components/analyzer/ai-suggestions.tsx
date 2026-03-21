"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, ChevronDown, ChevronUp, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AISuggestion {
  title: string;
  detail: string;
}

interface AISuggestionsProps {
  resume: string;
  jobDescription: string;
  missingKeywords: string[];
  weakSections: { section: string; issue: string }[];
}

export function AISuggestions({
  resume,
  jobDescription,
  missingKeywords,
  weakSections,
}: AISuggestionsProps) {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [copied, setCopied] = useState<number | null>(null);

  const fetchSuggestions = async () => {
    setLoading(true);
    setError("");
    setSuggestions([]);

    try {
      const res = await fetch("/api/ai/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume,
          jobDescription,
          missingKeywords,
          weakSections,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to generate suggestions.");
        return;
      }

      setSuggestions(data.suggestions || []);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  if (suggestions.length === 0 && !loading && !error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-xl border border-dashed border-primary/30 bg-primary/5 p-6 text-center"
      >
        <Sparkles size={24} className="mx-auto mb-3 text-primary" />
        <h3 className="mb-1 font-semibold">AI-Powered Suggestions</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Get personalized resume improvement suggestions powered by Llama 3.
        </p>
        <Button onClick={fetchSuggestions} disabled={loading} className="gap-2">
          <Sparkles size={16} />
          Generate AI Suggestions
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="rounded-xl border border-primary/20 bg-primary/5 p-6"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary">
          <Sparkles size={14} />
          AI Suggestions
        </h3>
        {suggestions.length > 0 && (
          <Button
            size="sm"
            variant="ghost"
            onClick={fetchSuggestions}
            disabled={loading}
            className="text-xs"
          >
            Regenerate
          </Button>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 size={24} className="animate-spin text-primary" />
          <span className="ml-3 text-sm text-muted-foreground">
            AI is analyzing your resume...
          </span>
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
          {error}
          <Button
            size="sm"
            variant="ghost"
            onClick={fetchSuggestions}
            className="ml-2 text-xs text-red-400 hover:text-red-300"
          >
            Retry
          </Button>
        </div>
      )}

      <AnimatePresence>
        {suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2"
          >
            {suggestions.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="rounded-lg border border-border bg-card/50 overflow-hidden"
              >
                <button
                  onClick={() => setExpanded(expanded === i ? null : i)}
                  className="flex w-full items-center justify-between p-3 text-left hover:bg-secondary/30 transition-colors"
                >
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary/20 text-xs text-primary">
                      {i + 1}
                    </span>
                    {s.title}
                  </span>
                  {expanded === i ? (
                    <ChevronUp size={14} className="text-muted-foreground" />
                  ) : (
                    <ChevronDown size={14} className="text-muted-foreground" />
                  )}
                </button>
                <AnimatePresence>
                  {expanded === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-border px-3 py-3">
                        <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                          {s.detail}
                        </p>
                        <button
                          onClick={() => copyToClipboard(s.detail, i)}
                          className="mt-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {copied === i ? (
                            <>
                              <Check size={12} className="text-emerald-400" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy size={12} />
                              Copy suggestion
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
