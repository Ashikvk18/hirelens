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

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    }
  }, [authLoading, user, router]);

  // Load profile
  useEffect(() => {
    if (!user) return;
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data.profile) {
          setProfile(data.profile);
          // Pre-fill search from profile
          const roles = data.profile.preferred_roles || [];
          const locs = data.profile.preferred_locations || [];
          if (roles.length > 0) setSearchQuery(roles[0]);
          else if (data.profile.major) setSearchQuery(data.profile.major + " jobs");
          if (locs.length > 0) setSearchLocation(locs[0]);
        }
      })
      .catch(() => {})
      .finally(() => setProfileLoaded(true));
  }, [user]);

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
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
            Home
          </Link>
          <div className="flex items-center gap-2">
            <Briefcase size={16} className="text-primary" />
            <span className="text-sm font-semibold">Job Board</span>
          </div>
          <Link
            href="/profile"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <User size={14} />
            Profile
          </Link>
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
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 size={28} className="mb-3 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Searching jobs...</p>
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
                {jobs.map((job, i) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <a
                      href={job.applyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block rounded-xl border border-border bg-card/50 p-4 transition-all hover:border-primary/40 hover:bg-card/80 sm:p-5"
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
                              <h3 className="font-semibold text-sm sm:text-base group-hover:text-primary transition-colors line-clamp-1">
                                {job.title}
                              </h3>
                              <p className="text-sm text-muted-foreground">{job.company}</p>
                            </div>
                            <ExternalLink
                              size={14}
                              className="mt-1 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                            />
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
                        </div>
                      </div>
                    </a>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
