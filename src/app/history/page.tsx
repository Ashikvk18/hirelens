"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { UserMenu } from "@/components/auth/user-menu";
import Link from "next/link";
import { ArrowLeft, Clock, Target, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface Session {
  id: string;
  match_score: number;
  missing_keywords: string[];
  present_keywords: string[];
  rejection_risk: { level: string; score: number };
  job_description: string;
  created_at: string;
}

export default function HistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchSessions = async () => {
      try {
        const res = await fetch("/api/sessions");
        const data = await res.json();
        if (res.ok) {
          setSessions(data.sessions || []);
        }
      } catch {
        // Silent fail
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [user, authLoading]);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      const res = await fetch(`/api/sessions/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSessions((prev) => prev.filter((s) => s.id !== id));
      }
    } catch {
      // Silent fail
    } finally {
      setDeleting(null);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-emerald-400";
    if (score >= 45) return "text-amber-400";
    return "text-red-400";
  };

  const getRiskVariant = (level: string) => {
    if (level === "high") return "destructive" as const;
    if (level === "medium") return "warning" as const;
    return "success" as const;
  };

  // Extract a short job title from the JD
  const extractJobTitle = (jd: string) => {
    const firstLine = jd.split("\n").find((l) => l.trim().length > 0) || "";
    return firstLine.slice(0, 60) + (firstLine.length > 60 ? "..." : "");
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link
            href="/analyze"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft size={16} />
            Back to Analyzer
          </Link>
          <UserMenu />
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="mb-1 text-2xl font-bold tracking-tight sm:text-3xl">
          Analysis History
        </h1>
        <p className="mb-8 text-sm text-muted-foreground">
          Your saved resume analysis sessions.
        </p>

        {authLoading || loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="animate-spin text-primary" />
          </div>
        ) : !user ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/30 py-20 text-center">
            <Clock size={32} className="mb-4 text-muted-foreground" />
            <p className="mb-1 font-medium">Sign in to view history</p>
            <p className="mb-4 text-sm text-muted-foreground">
              You need to be signed in to save and view analysis sessions.
            </p>
            <Link href="/analyze">
              <Button size="sm">Go to Analyzer</Button>
            </Link>
          </div>
        ) : sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/30 py-20 text-center">
            <Clock size={32} className="mb-4 text-muted-foreground" />
            <p className="mb-1 font-medium">No sessions yet</p>
            <p className="mb-4 text-sm text-muted-foreground">
              Run an analysis and click Save to see it here.
            </p>
            <Link href="/analyze">
              <Button size="sm">Start Analyzing</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session, i) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-border bg-card/50 p-5 transition-colors hover:border-border/80"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="mb-2 truncate text-sm font-medium">
                      {extractJobTitle(session.job_description)}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <div className="flex items-center gap-1.5">
                        <Target size={13} className="text-muted-foreground" />
                        <span className={`font-semibold ${getScoreColor(session.match_score)}`}>
                          {session.match_score}%
                        </span>
                        <span className="text-muted-foreground">match</span>
                      </div>
                      <Badge variant={getRiskVariant(session.rejection_risk?.level || "low")}>
                        {session.rejection_risk?.level || "low"} risk
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {session.present_keywords?.length || 0} keywords found
                        {" · "}
                        {session.missing_keywords?.length || 0} missing
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-muted-foreground">
                      {new Date(session.created_at).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleDelete(session.id)}
                      disabled={deleting === session.id}
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-red-500/10 hover:text-red-400 transition-colors"
                    >
                      {deleting === session.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
