"use client";

import { useState, useEffect, useCallback } from "react";
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
  Users,
  ExternalLink,
  RefreshCw,
  Search,
  Building2,
  Wifi,
  DollarSign,
  User,
  SlidersHorizontal,
  FileText,
  CheckCircle2,
  X,
  ClipboardList,
  Mail,
  Linkedin,
  Phone,
  Shield,
  UserSearch,
  BookOpen,
  Route,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Job {
  id: string;
  title: string;
  company: string;
  logo: string | null;
  location: string;
  remote: boolean;
  type: string;
  applyLink: string;
  postedAt: string;
  postedAgo: string;
  estimatedApplicants: number;
  salary: string;
  publisher: string;
  skills: string[];
}

interface Contact {
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  position: string;
  department: string;
  seniority: string;
  confidence: number;
  linkedin: string | null;
  twitter: string | null;
  phone: string | null;
}

interface UserProfile {
  preferred_roles: string[];
  preferred_locations: string[];
  skills: string[];
  job_type: string;
  major: string;
}

export default function JobsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [dateFilter, setDateFilter] = useState("month");
  const [showFilters, setShowFilters] = useState(false);
  const [applyingJob, setApplyingJob] = useState<Job | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [applying, setApplying] = useState(false);
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());
  const [contactJob, setContactJob] = useState<Job | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [contactsError, setContactsError] = useState("");
  const [contactsDomain, setContactsDomain] = useState("");

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    }
  }, [authLoading, user, router]);

  // Load profile + existing applications
  useEffect(() => {
    if (!user) return;
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data.profile && data.profile.full_name) {
          setProfile(data.profile);
          const roles = data.profile.preferred_roles || [];
          const locs = data.profile.preferred_locations || [];
          if (roles.length > 0) setSearchQuery(roles[0]);
          else if (data.profile.major) setSearchQuery(data.profile.major + " jobs");
          if (locs.length > 0) setSearchLocation(locs[0]);
        } else {
          // No profile yet — redirect to set up
          router.push("/profile");
          return;
        }
      })
      .catch(() => {})
      .finally(() => setProfileLoaded(true));

    // Load applied job IDs
    fetch("/api/applications")
      .then((r) => r.json())
      .then((data) => {
        if (data.applications) {
          setAppliedJobIds(new Set(data.applications.map((a: { job_id: string }) => a.job_id)));
        }
      })
      .catch(() => {});
  }, [user]);

  const handleApply = async () => {
    if (!applyingJob) return;
    setApplying(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: applyingJob.id,
          jobTitle: applyingJob.title,
          company: applyingJob.company,
          companyLogo: applyingJob.logo,
          location: applyingJob.location,
          jobType: applyingJob.type,
          applyLink: applyingJob.applyLink,
          publisher: applyingJob.publisher,
          salary: applyingJob.salary,
          resumeText: resumeText,
        }),
      });
      if (res.ok) {
        setAppliedJobIds((prev) => new Set([...prev, applyingJob.id]));
        window.open(applyingJob.applyLink, "_blank");
        setApplyingJob(null);
        setResumeText("");
      }
    } catch {
      // still open the link even if tracking fails
      window.open(applyingJob.applyLink, "_blank");
    } finally {
      setApplying(false);
    }
  };

  const fetchContacts = async (job: Job) => {
    setContactJob(job);
    setContacts([]);
    setContactsError("");
    setContactsDomain("");
    setContactsLoading(true);
    try {
      const res = await fetch(`/api/contacts?company=${encodeURIComponent(job.company)}`);
      const data = await res.json();
      if (data.error) {
        setContactsError(data.error);
      } else {
        setContacts(data.contacts || []);
        setContactsDomain(data.domain || "");
        if ((data.contacts || []).length === 0) {
          setContactsError(
            data.message || "No contacts found for this company. Try a larger or more well-known company."
          );
        }
      }
    } catch {
      setContactsError("Failed to fetch contacts. Please try again.");
    } finally {
      setContactsLoading(false);
    }
  };

  const fetchJobs = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError("");

      try {
        const query = searchQuery || profile?.major || "software engineer";
        const location = searchLocation || (profile?.preferred_locations?.[0] || "");
        const jobType = profile?.job_type || "";

        const params = new URLSearchParams({
          query,
          location,
          jobType,
          datePosted: dateFilter,
        });

        const res = await fetch(`/api/jobs?${params}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch jobs");
        }

        setJobs(data.jobs || []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to fetch jobs");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [searchQuery, searchLocation, dateFilter, profile]
  );

  // Fetch jobs when profile fetch is done
  useEffect(() => {
    if (profileLoaded) {
      fetchJobs();
    }
  }, [profileLoaded, fetchJobs]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
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
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground"
          >
            <ArrowLeft size={14} />
            Home
          </Link>
          <div className="flex items-center gap-1.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-primary to-accent">
              <Briefcase size={11} className="text-white" />
            </div>
            <span className="text-[13px] font-bold tracking-tight">Job Board</span>
          </div>
          <div className="flex items-center gap-1">
            <Link
              href="/applications"
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground"
            >
              <ClipboardList size={13} />
              <span className="hidden sm:inline">Applications</span>
              {appliedJobIds.size > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary/20 px-1 text-[10px] font-bold text-primary">
                  {appliedJobIds.size}
                </span>
              )}
            </Link>
            <Link
              href="/profile"
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground"
            >
              <User size={13} />
              <span className="hidden sm:inline">Profile</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* Title */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Jobs For You
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {profile?.preferred_roles?.length
              ? `Personalized for: ${profile.preferred_roles.join(", ")}`
              : "Set up your profile for personalized results"}
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mt-6 flex flex-col gap-3 sm:flex-row"
        >
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Job title, keyword, or role..."
              className="w-full rounded-lg border border-border bg-secondary/50 py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="relative flex-1 sm:max-w-[220px]">
            <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              placeholder="City or Remote"
              className="w-full rounded-lg border border-border bg-secondary/50 py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={loading || refreshing} className="gap-1.5">
              <Search size={14} />
              Search
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-1.5"
            >
              <SlidersHorizontal size={14} />
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => fetchJobs(true)}
              disabled={refreshing}
              className="gap-1.5"
            >
              <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            </Button>
          </div>
        </motion.form>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 flex flex-wrap gap-2 rounded-lg border border-border bg-card/50 p-3">
                <span className="text-xs text-muted-foreground self-center mr-1">Posted:</span>
                {[
                  { value: "today", label: "Today" },
                  { value: "3days", label: "3 days" },
                  { value: "week", label: "This week" },
                  { value: "month", label: "This month" },
                  { value: "all", label: "All time" },
                ].map((f) => (
                  <button
                    key={f.value}
                    onClick={() => { setDateFilter(f.value); }}
                    className={`rounded-md px-3 py-1 text-xs transition-colors ${
                      dateFilter === f.value
                        ? "bg-primary text-white"
                        : "bg-secondary/50 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <div className="mt-6">
          {/* Loading */}
          {loading && (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-xl border border-border bg-card/30 p-5">
                  <div className="flex gap-4">
                    <div className="hidden sm:block h-12 w-12 rounded-lg bg-secondary/50 animate-shimmer" />
                    <div className="flex-1 space-y-3">
                      <div className="h-4 w-2/3 rounded bg-secondary/50 animate-shimmer" />
                      <div className="h-3 w-1/3 rounded bg-secondary/30 animate-shimmer" />
                      <div className="flex gap-3 mt-2">
                        <div className="h-3 w-16 rounded bg-secondary/30 animate-shimmer" />
                        <div className="h-3 w-20 rounded bg-secondary/30 animate-shimmer" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="rounded-lg bg-red-500/10 p-4 text-sm text-red-400">
              {error}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => fetchJobs()}
                className="ml-2 text-xs text-red-400 hover:text-red-300"
              >
                Retry
              </Button>
            </div>
          )}

          {/* No results */}
          {!loading && !error && jobs.length === 0 && (
            <div className="text-center py-20">
              <Briefcase size={32} className="mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground">No jobs found. Try different keywords or filters.</p>
            </div>
          )}

          {/* Job List */}
          {!loading && jobs.length > 0 && (
            <>
              <p className="mb-4 text-xs text-muted-foreground">
                {jobs.length} jobs found
                {refreshing && <Loader2 size={12} className="ml-1 inline animate-spin" />}
              </p>
              <div className="space-y-3">
                {jobs.map((job, i) => {
                  const isApplied = appliedJobIds.has(job.id);
                  return (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ duration: 0.35, delay: i * 0.04 }}
                      whileHover={{ y: -2, transition: { duration: 0.2 } }}
                    >
                      <div
                        className={`group rounded-xl border bg-card/50 p-4 transition-all duration-300 hover:bg-card/80 hover:shadow-lg hover:shadow-primary/[0.03] sm:p-5 ${
                          isApplied ? "border-emerald-500/30" : "border-border hover:border-white/[0.1]"
                        }`}
                      >
                        <div className="flex gap-4">
                          {/* Logo */}
                          <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary/50 overflow-hidden">
                            {job.logo ? (
                              <img
                                src={job.logo}
                                alt={job.company}
                                className="h-full w-full object-contain p-1"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = "none";
                                  (e.target as HTMLImageElement).parentElement!.innerHTML = `<span class="text-xs font-bold text-muted-foreground">${job.company.charAt(0)}</span>`;
                                }}
                              />
                            ) : (
                              <Building2 size={18} className="text-muted-foreground" />
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="font-semibold text-sm sm:text-base line-clamp-1">
                                  {job.title}
                                </h3>
                                <p className="text-sm text-muted-foreground">{job.company}</p>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  onClick={() => fetchContacts(job)}
                                  className="rounded-lg border border-border bg-secondary/50 p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                                  title="Find hiring contacts"
                                >
                                  <UserSearch size={14} />
                                </button>
                                {isApplied ? (
                                  <span className="flex items-center gap-1 rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-400">
                                    <CheckCircle2 size={10} />
                                    Applied
                                  </span>
                                ) : (
                                  <Button
                                    size="sm"
                                    onClick={() => setApplyingJob(job)}
                                    className="gap-1.5 text-xs"
                                  >
                                    <ExternalLink size={12} />
                                    Apply
                                  </Button>
                                )}
                              </div>
                            </div>

                            {/* Meta row */}
                            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                              {job.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin size={11} />
                                  {job.location}
                                </span>
                              )}
                              {job.remote && (
                                <span className="flex items-center gap-1 text-emerald-400">
                                  <Wifi size={11} />
                                  Remote
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Clock size={11} />
                                {job.postedAgo}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users size={11} />
                                ~{job.estimatedApplicants} applicants
                              </span>
                              {job.salary && (
                                <span className="flex items-center gap-1 text-emerald-400">
                                  <DollarSign size={11} />
                                  {job.salary}
                                </span>
                              )}
                            </div>

                            {/* Tags */}
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {job.type && (
                                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                                  {job.type.replace("FULLTIME", "Full-time").replace("PARTTIME", "Part-time").replace("INTERN", "Internship").replace("CONTRACTOR", "Contract")}
                                </span>
                              )}
                              <span className="rounded-md bg-secondary/80 px-2 py-0.5 text-[10px] text-muted-foreground">
                                via {job.publisher}
                              </span>
                              {job.skills.slice(0, 3).map((skill) => (
                                <span
                                  key={skill}
                                  className="rounded-md bg-secondary/80 px-2 py-0.5 text-[10px] text-muted-foreground"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>

                            {/* Action links */}
                            <div className="mt-2.5 flex flex-wrap gap-2">
                              <Link
                                href={`/interview-prep?title=${encodeURIComponent(job.title)}&company=${encodeURIComponent(job.company)}&skills=${encodeURIComponent(job.skills.join(","))}`}
                                className="inline-flex items-center gap-1.5 rounded-md bg-white/[0.03] px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
                              >
                                <BookOpen size={11} />
                                Interview Prep
                              </Link>
                              <Link
                                href={`/skills-roadmap?title=${encodeURIComponent(job.title)}&company=${encodeURIComponent(job.company)}&skills=${encodeURIComponent(job.skills.join(","))}`}
                                className="inline-flex items-center gap-1.5 rounded-md bg-white/[0.03] px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
                              >
                                <Route size={11} />
                                Skills Roadmap
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Apply Modal */}
      <AnimatePresence>
        {applyingJob && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm sm:p-4"
            onClick={() => { setApplyingJob(null); setResumeText(""); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-t-2xl sm:rounded-xl border border-border bg-background p-5 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold">Apply & Track</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {applyingJob.title} at {applyingJob.company}
                  </p>
                </div>
                <button
                  onClick={() => { setApplyingJob(null); setResumeText(""); }}
                  className="rounded-md p-1 hover:bg-secondary/50"
                >
                  <X size={16} className="text-muted-foreground" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <FileText size={12} />
                    Paste the resume you&apos;re using for this job (optional)
                  </label>
                  <textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste your resume text here so you can track which resume you used for this application..."
                    className="w-full rounded-lg border border-border bg-secondary/30 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring min-h-[120px] resize-y"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleApply}
                    disabled={applying}
                    className="flex-1 gap-2"
                  >
                    {applying ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <ExternalLink size={14} />
                    )}
                    {applying ? "Saving..." : "Apply & Open Job Page"}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      window.open(applyingJob.applyLink, "_blank");
                      setApplyingJob(null);
                      setResumeText("");
                    }}
                    className="gap-1.5"
                  >
                    Skip Tracking
                  </Button>
                </div>

                <p className="text-[11px] text-muted-foreground text-center">
                  This will save the job to your applications tracker and open the job posting.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contacts Modal */}
      <AnimatePresence>
        {contactJob && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm sm:p-4"
            onClick={() => { setContactJob(null); setContacts([]); setContactsError(""); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl max-h-[85vh] flex flex-col rounded-t-2xl sm:rounded-xl border border-border bg-background shadow-2xl"
            >
              {/* Modal header */}
              <div className="flex items-start justify-between p-5 pb-3 border-b border-border">
                <div>
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <UserSearch size={18} className="text-primary" />
                    Hiring Contacts
                  </h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {contactJob.company}
                    {contactsDomain && (
                      <span className="ml-1 text-xs opacity-60">({contactsDomain})</span>
                    )}
                  </p>
                </div>
                <button
                  onClick={() => { setContactJob(null); setContacts([]); setContactsError(""); }}
                  className="rounded-md p-1 hover:bg-secondary/50"
                >
                  <X size={16} className="text-muted-foreground" />
                </button>
              </div>

              {/* Modal body */}
              <div className="flex-1 overflow-y-auto p-5">
                {contactsLoading && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 size={24} className="mb-3 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">
                      Searching for contacts at {contactJob.company}...
                    </p>
                  </div>
                )}

                {contactsError && !contactsLoading && (
                  <div className="rounded-lg bg-yellow-500/10 p-4 text-sm text-yellow-400">
                    {contactsError}
                  </div>
                )}

                {!contactsLoading && contacts.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-xs text-muted-foreground mb-2">
                      {contacts.length} contact{contacts.length !== 1 ? "s" : ""} found — sorted by relevance to hiring
                    </p>
                    {contacts.map((c, i) => (
                      <motion.div
                        key={c.email}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="rounded-lg border border-border bg-card/50 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm">{c.fullName}</p>
                            {c.position && (
                              <p className="text-xs text-muted-foreground mt-0.5">{c.position}</p>
                            )}
                            {(c.department || c.seniority) && (
                              <p className="text-[11px] text-muted-foreground mt-0.5">
                                {[c.department?.replace(/_/g, " "), c.seniority].filter(Boolean).join(" · ")}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <Shield
                              size={12}
                              className={
                                c.confidence >= 80
                                  ? "text-emerald-400"
                                  : c.confidence >= 50
                                  ? "text-yellow-400"
                                  : "text-red-400"
                              }
                            />
                            <span className="text-[10px] text-muted-foreground">
                              {c.confidence}%
                            </span>
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <a
                            href={`mailto:${c.email}`}
                            className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
                          >
                            <Mail size={11} />
                            {c.email}
                          </a>
                          {c.linkedin && (
                            <a
                              href={c.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-md bg-blue-500/10 px-2.5 py-1.5 text-xs font-medium text-blue-400 hover:bg-blue-500/20 transition-colors"
                            >
                              <Linkedin size={11} />
                              LinkedIn
                            </a>
                          )}
                          {c.phone && (
                            <a
                              href={`tel:${c.phone}`}
                              className="inline-flex items-center gap-1.5 rounded-md bg-secondary/80 px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Phone size={11} />
                              {c.phone}
                            </a>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {!contactsLoading && contacts.length === 0 && !contactsError && (
                  <div className="text-center py-8">
                    <Mail size={28} className="mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Searching...</p>
                  </div>
                )}
              </div>

              {/* Modal footer */}
              <div className="border-t border-border px-5 py-3">
                <p className="text-[10px] text-muted-foreground text-center">
                  Contact data powered by Hunter.io. Confidence score indicates email verification likelihood.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
