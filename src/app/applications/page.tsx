"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Loader2,
  ArrowLeft,
  Briefcase,
  MapPin,
  Clock,
  ExternalLink,
  Trash2,
  ChevronDown,
  FileText,
  Building2,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Send,
  Award,
  Ban,
  ClipboardList,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { scrollBlurUp, scrollFadeUp, scrollStagger, scrollStaggerItem, scrollStaggerItemBlur, viewportOnce, viewportOnceEarly } from "@/lib/motion";

interface Application {
  id: string;
  job_id: string;
  job_title: string;
  company: string;
  company_logo: string | null;
  location: string;
  job_type: string;
  apply_link: string;
  publisher: string;
  salary: string;
  resume_text: string;
  status: string;
  notes: string;
  applied_at: string;
  updated_at: string;
}

const STATUS_OPTIONS = [
  { value: "applied", label: "Applied", icon: Send, color: "text-blue-400 bg-blue-400/10" },
  { value: "interviewing", label: "Interviewing", icon: MessageSquare, color: "text-yellow-400 bg-yellow-400/10" },
  { value: "offered", label: "Offered", icon: Award, color: "text-emerald-400 bg-emerald-400/10" },
  { value: "rejected", label: "Rejected", icon: XCircle, color: "text-red-400 bg-red-400/10" },
  { value: "withdrawn", label: "Withdrawn", icon: Ban, color: "text-muted-foreground bg-secondary/50" },
];

export default function ApplicationsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;
    fetchApplications();
  }, [user]);

  const fetchApplications = async () => {
    try {
      const res = await fetch("/api/applications");
      const data = await res.json();
      if (data.applications) {
        setApplications(data.applications);
      }
    } catch {
      setError("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setApplications((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
        );
      }
    } catch {
      // silent fail
    }
  };

  const updateNotes = async (id: string, notes: string) => {
    try {
      await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, notes } : a))
      );
    } catch {
      // silent fail
    }
  };

  const deleteApplication = async (id: string) => {
    try {
      const res = await fetch(`/api/applications/${id}`, { method: "DELETE" });
      if (res.ok) {
        setApplications((prev) => prev.filter((a) => a.id !== id));
      }
    } catch {
      // silent fail
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const filtered =
    statusFilter === "all"
      ? applications
      : applications.filter((a) => a.status === statusFilter);

  // Stats
  const stats = {
    total: applications.length,
    applied: applications.filter((a) => a.status === "applied").length,
    interviewing: applications.filter((a) => a.status === "interviewing").length,
    offered: applications.filter((a) => a.status === "offered").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  if (authLoading || loading) {
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
              <ClipboardList size={11} className="text-white" />
            </div>
            <span className="text-[13px] font-bold tracking-tight">Applications</span>
          </div>
          <div className="w-16" />
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-6">
        {/* Title + Stats */}
        <motion.div
          variants={scrollBlurUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnceEarly}
        >
          <h1 className="text-2xl font-bold tracking-tight">Application Tracker</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track your job applications and their progress.
          </p>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          variants={scrollStagger(0.06)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnceEarly}
          className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5"
        >
          {[
            { label: "Total", value: stats.total, color: "text-foreground" },
            { label: "Applied", value: stats.applied, color: "text-blue-400" },
            { label: "Interviewing", value: stats.interviewing, color: "text-yellow-400" },
            { label: "Offered", value: stats.offered, color: "text-emerald-400" },
            { label: "Rejected", value: stats.rejected, color: "text-red-400" },
          ].map((s) => (
            <motion.div
              key={s.label}
              variants={scrollStaggerItem}
              className="rounded-lg border border-border bg-card/50 p-3 text-center"
            >
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Filter tabs */}
        <div className="mt-6 flex flex-wrap gap-2">
          {[{ value: "all", label: "All" }, ...STATUS_OPTIONS].map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                statusFilter === f.value
                  ? "bg-primary text-white"
                  : "bg-secondary/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{error}</div>
        )}

        {/* Empty state */}
        {filtered.length === 0 && !error && (
          <div className="mt-16 text-center">
            <Briefcase size={36} className="mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground">
              {applications.length === 0
                ? "No applications yet. Apply to jobs from the job board!"
                : "No applications match this filter."}
            </p>
            {applications.length === 0 && (
              <Link href="/jobs">
                <Button size="sm" className="mt-4">
                  Browse Jobs
                </Button>
              </Link>
            )}
          </div>
        )}

        {/* Applications list */}
        <div className="mt-4 space-y-3">
          <AnimatePresence>
            {filtered.map((app) => {
              const statusOpt = STATUS_OPTIONS.find((s) => s.value === app.status) || STATUS_OPTIONS[0];
              const StatusIcon = statusOpt.icon;
              const isExpanded = expandedId === app.id;

              return (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4 }}
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                  className="rounded-xl border border-border bg-card/50 overflow-hidden transition-all duration-300 hover:border-white/[0.1] hover:shadow-lg hover:shadow-primary/[0.02]"
                >
                  {/* Main row */}
                  <div className="flex items-center gap-3 p-4">
                    {/* Logo */}
                    <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary/50 overflow-hidden">
                      {app.company_logo ? (
                        <img
                          src={app.company_logo}
                          alt={app.company}
                          className="h-full w-full object-contain p-1"
                        />
                      ) : (
                        <Building2 size={16} className="text-muted-foreground" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm line-clamp-1">{app.job_title}</h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground mt-0.5">
                        <span>{app.company}</span>
                        {app.location && (
                          <span className="flex items-center gap-1">
                            <MapPin size={10} />
                            {app.location}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock size={10} />
                          {formatDate(app.applied_at)}
                        </span>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusOpt.color}`}
                      >
                        <StatusIcon size={10} />
                        {statusOpt.label}
                      </span>
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : app.id)}
                        className="rounded-md p-1 hover:bg-secondary/50 transition-colors"
                      >
                        <ChevronDown
                          size={14}
                          className={`text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Expanded details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t border-border"
                      >
                        <div className="p-4 space-y-4">
                          {/* Status changer */}
                          <div>
                            <p className="text-xs text-muted-foreground mb-2">Update Status</p>
                            <div className="flex flex-wrap gap-1.5">
                              {STATUS_OPTIONS.map((s) => (
                                <button
                                  key={s.value}
                                  onClick={() => updateStatus(app.id, s.value)}
                                  className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs transition-colors ${
                                    app.status === s.value
                                      ? s.color + " ring-1 ring-current"
                                      : "bg-secondary/30 text-muted-foreground hover:text-foreground"
                                  }`}
                                >
                                  <s.icon size={10} />
                                  {s.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Resume used */}
                          {app.resume_text && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1">
                                <FileText size={10} />
                                Resume Used
                              </p>
                              <div className="max-h-32 overflow-auto rounded-lg bg-secondary/30 p-3 text-xs text-muted-foreground whitespace-pre-wrap">
                                {app.resume_text.slice(0, 500)}
                                {app.resume_text.length > 500 && "..."}
                              </div>
                            </div>
                          )}

                          {/* Notes */}
                          <div>
                            <p className="text-xs text-muted-foreground mb-1.5">Notes</p>
                            <textarea
                              defaultValue={app.notes}
                              onBlur={(e) => {
                                if (e.target.value !== app.notes) {
                                  updateNotes(app.id, e.target.value);
                                }
                              }}
                              placeholder="Add notes about this application..."
                              className="w-full rounded-lg border border-border bg-secondary/30 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring min-h-[60px] resize-y"
                            />
                          </div>

                          {/* Actions */}
                          <div className="flex items-center justify-between">
                            <a
                              href={app.apply_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                            >
                              <ExternalLink size={11} />
                              View Job Posting
                            </a>
                            <button
                              onClick={() => {
                                if (confirm("Remove this application?")) {
                                  deleteApplication(app.id);
                                }
                              }}
                              className="inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors"
                            >
                              <Trash2 size={11} />
                              Remove
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
