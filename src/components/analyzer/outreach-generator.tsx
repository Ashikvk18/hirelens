"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Loader2,
  Copy,
  Check,
  Linkedin,
  Mail,
} from "lucide-react";
import { motion } from "framer-motion";

interface OutreachMessages {
  linkedin: string;
  email: string;
}

interface OutreachGeneratorProps {
  resume: string;
  jobDescription: string;
  matchScore: number;
}

export function OutreachGenerator({
  resume,
  jobDescription,
  matchScore,
}: OutreachGeneratorProps) {
  const [messages, setMessages] = useState<OutreachMessages | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const fetchOutreach = async () => {
    setLoading(true);
    setError("");
    setMessages(null);

    try {
      const res = await fetch("/api/ai/outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, jobDescription, matchScore }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to generate outreach messages.");
        return;
      }

      setMessages(data.messages || null);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (!messages && !loading && !error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="rounded-xl border border-dashed border-border bg-card/30 p-6 text-center"
      >
        <MessageSquare size={24} className="mx-auto mb-3 text-muted-foreground" />
        <h3 className="mb-1 font-semibold">Recruiter Outreach</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Generate personalized LinkedIn and email messages to reach out to recruiters.
        </p>
        <Button
          onClick={fetchOutreach}
          disabled={loading}
          variant="secondary"
          className="gap-2"
        >
          <MessageSquare size={16} />
          Generate Outreach Messages
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="rounded-xl border border-border bg-card/50 p-6"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          <MessageSquare size={14} />
          Recruiter Outreach
        </h3>
        {messages && (
          <Button
            size="sm"
            variant="ghost"
            onClick={fetchOutreach}
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
            Crafting personalized messages...
          </span>
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
          {error}
          <Button
            size="sm"
            variant="ghost"
            onClick={fetchOutreach}
            className="ml-2 text-xs text-red-400 hover:text-red-300"
          >
            Retry
          </Button>
        </div>
      )}

      {messages && (
        <div className="space-y-4">
          {/* LinkedIn Message */}
          <div className="rounded-lg border border-border bg-secondary/30 p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Linkedin size={14} className="text-blue-400" />
                LinkedIn Connection Request
              </div>
              <button
                onClick={() => copyToClipboard(messages.linkedin, "linkedin")}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {copiedField === "linkedin" ? (
                  <>
                    <Check size={12} className="text-emerald-400" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    Copy
                  </>
                )}
              </button>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
              {messages.linkedin}
            </p>
          </div>

          {/* Email Message */}
          <div className="rounded-lg border border-border bg-secondary/30 p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Mail size={14} className="text-amber-400" />
                Email to Recruiter
              </div>
              <button
                onClick={() => copyToClipboard(messages.email, "email")}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {copiedField === "email" ? (
                  <>
                    <Check size={12} className="text-emerald-400" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    Copy
                  </>
                )}
              </button>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
              {messages.email}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
