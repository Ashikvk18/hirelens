"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  User,
  GraduationCap,
  Briefcase,
  MapPin,
  Sparkles,
  ArrowLeft,
  Save,
  Check,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const DEGREE_OPTIONS = [
  { value: "bachelors", label: "Bachelor's" },
  { value: "masters", label: "Master's" },
  { value: "phd", label: "PhD" },
  { value: "associate", label: "Associate's" },
];

const EXPERIENCE_OPTIONS = [
  { value: "entry", label: "Entry Level / Student" },
  { value: "mid", label: "Mid Level (2-5 years)" },
  { value: "senior", label: "Senior (5+ years)" },
];

const JOB_TYPE_OPTIONS = [
  { value: "FULLTIME", label: "Full-time" },
  { value: "PARTTIME", label: "Part-time" },
  { value: "INTERN", label: "Internship" },
  { value: "CONTRACTOR", label: "Contract" },
];

const POPULAR_SKILLS = [
  "Python", "JavaScript", "TypeScript", "React", "Node.js", "Java", "C++",
  "SQL", "AWS", "Docker", "Git", "Machine Learning", "Data Analysis",
  "Excel", "Tableau", "R", "TensorFlow", "Figma", "Agile", "Scrum",
];

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [university, setUniversity] = useState("");
  const [major, setMajor] = useState("");
  const [degreeLevel, setDegreeLevel] = useState("bachelors");
  const [graduationYear, setGraduationYear] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("entry");
  const [preferredRoles, setPreferredRoles] = useState<string[]>([]);
  const [roleInput, setRoleInput] = useState("");
  const [preferredLocations, setPreferredLocations] = useState<string[]>([]);
  const [locationInput, setLocationInput] = useState("");
  const [jobType, setJobType] = useState("FULLTIME");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    }
  }, [authLoading, user, router]);

  // Load existing profile
  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();
        if (data.profile) {
          const p = data.profile;
          setFullName(p.full_name || "");
          setUniversity(p.university || "");
          setMajor(p.major || "");
          setDegreeLevel(p.degree_level || "bachelors");
          setGraduationYear(p.graduation_year?.toString() || "");
          setSkills(p.skills || []);
          setExperienceLevel(p.experience_level || "entry");
          setPreferredRoles(p.preferred_roles || []);
          setPreferredLocations(p.preferred_locations || []);
          setJobType(p.job_type || "FULLTIME");
        }
      } catch {
        // No profile yet
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    setError("");
    setSaving(true);
    setSaved(false);

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          university,
          major,
          degreeLevel,
          graduationYear: graduationYear ? parseInt(graduationYear) : null,
          skills,
          experienceLevel,
          preferredRoles,
          preferredLocations,
          jobType,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const addTag = (
    value: string,
    list: string[],
    setList: (v: string[]) => void,
    setInput: (v: string) => void
  ) => {
    const trimmed = value.trim();
    if (trimmed && !list.includes(trimmed)) {
      setList([...list, trimmed]);
    }
    setInput("");
  };

  const removeTag = (value: string, list: string[], setList: (v: string[]) => void) => {
    setList(list.filter((t) => t !== value));
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
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground"
          >
            <ArrowLeft size={14} />
            Back
          </Link>
          <div className="flex items-center gap-1.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-primary to-accent">
              <User size={11} className="text-white" />
            </div>
            <span className="text-[13px] font-bold tracking-tight">My Profile</span>
          </div>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={saving}
            className="h-8 gap-1.5 text-[13px]"
          >
            {saved ? (
              <><Check size={13} className="text-emerald-400" /> Saved</>
            ) : saving ? (
              <><Loader2 size={13} className="animate-spin" /> Saving</>
            ) : (
              <><Save size={13} /> Save</>
            )}
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold tracking-tight">Set Up Your Profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Tell us about yourself so we can find the best jobs for you.
          </p>
        </motion.div>

        {error && (
          <div className="mt-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{error}</div>
        )}

        <div className="mt-8 space-y-8">
          {/* Personal Info */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border border-border bg-card/50 p-5"
          >
            <div className="mb-4 flex items-center gap-2">
              <User size={16} className="text-primary" />
              <h2 className="text-sm font-semibold uppercase tracking-wider">Personal Info</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full rounded-lg border border-border bg-secondary/50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Email</label>
                <input
                  type="email"
                  value={user.email || ""}
                  disabled
                  className="w-full rounded-lg border border-border bg-secondary/30 px-3 py-2.5 text-sm text-muted-foreground"
                />
              </div>
            </div>
          </motion.section>

          {/* Education */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-xl border border-border bg-card/50 p-5"
          >
            <div className="mb-4 flex items-center gap-2">
              <GraduationCap size={16} className="text-primary" />
              <h2 className="text-sm font-semibold uppercase tracking-wider">Education</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">University</label>
                <input
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  placeholder="Truman State University"
                  className="w-full rounded-lg border border-border bg-secondary/50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Major</label>
                <input
                  type="text"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  placeholder="Computer Science"
                  className="w-full rounded-lg border border-border bg-secondary/50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Degree Level</label>
                <select
                  value={degreeLevel}
                  onChange={(e) => setDegreeLevel(e.target.value)}
                  className="w-full rounded-lg border border-border bg-secondary/50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {DEGREE_OPTIONS.map((d) => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Graduation Year</label>
                <input
                  type="number"
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(e.target.value)}
                  placeholder="2026"
                  min="2000"
                  max="2035"
                  className="w-full rounded-lg border border-border bg-secondary/50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          </motion.section>

          {/* Skills */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl border border-border bg-card/50 p-5"
          >
            <div className="mb-4 flex items-center gap-2">
              <Sparkles size={16} className="text-primary" />
              <h2 className="text-sm font-semibold uppercase tracking-wider">Skills</h2>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                >
                  {skill}
                  <button onClick={() => removeTag(skill, skills, setSkills)} className="hover:text-red-400">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag(skillInput, skills, setSkills, setSkillInput);
                  }
                }}
                placeholder="Type a skill and press Enter"
                className="flex-1 rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Button
                size="sm"
                variant="secondary"
                onClick={() => addTag(skillInput, skills, setSkills, setSkillInput)}
              >
                Add
              </Button>
            </div>
            <div className="mt-3">
              <p className="mb-1.5 text-xs text-muted-foreground">Popular skills:</p>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_SKILLS.filter((s) => !skills.includes(s)).slice(0, 12).map((s) => (
                  <button
                    key={s}
                    onClick={() => addTag(s, skills, setSkills, setSkillInput)}
                    className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                  >
                    + {s}
                  </button>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Job Preferences */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-xl border border-border bg-card/50 p-5"
          >
            <div className="mb-4 flex items-center gap-2">
              <Briefcase size={16} className="text-primary" />
              <h2 className="text-sm font-semibold uppercase tracking-wider">Job Preferences</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Experience Level</label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full rounded-lg border border-border bg-secondary/50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {EXPERIENCE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Job Type</label>
                <div className="flex flex-wrap gap-2">
                  {JOB_TYPE_OPTIONS.map((o) => (
                    <button
                      key={o.value}
                      onClick={() => setJobType(o.value)}
                      className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                        jobType === o.value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-muted-foreground"
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferred Roles */}
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Preferred Roles</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {preferredRoles.map((role) => (
                    <span
                      key={role}
                      className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
                    >
                      {role}
                      <button onClick={() => removeTag(role, preferredRoles, setPreferredRoles)} className="hover:text-red-400">
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={roleInput}
                    onChange={(e) => setRoleInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag(roleInput, preferredRoles, setPreferredRoles, setRoleInput);
                      }
                    }}
                    placeholder="e.g. Software Engineer, Data Analyst"
                    className="flex-1 rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => addTag(roleInput, preferredRoles, setPreferredRoles, setRoleInput)}
                  >
                    Add
                  </Button>
                </div>
              </div>

              {/* Preferred Locations */}
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Preferred Locations</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {preferredLocations.map((loc) => (
                    <span
                      key={loc}
                      className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400"
                    >
                      <MapPin size={10} />
                      {loc}
                      <button onClick={() => removeTag(loc, preferredLocations, setPreferredLocations)} className="hover:text-red-400">
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag(locationInput, preferredLocations, setPreferredLocations, setLocationInput);
                      }
                    }}
                    placeholder="e.g. Chicago, Remote, New York"
                    className="flex-1 rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => addTag(locationInput, preferredLocations, setPreferredLocations, setLocationInput)}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Save + Go to Jobs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-3"
          >
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Save Profile
            </Button>
            <Button
              variant="secondary"
              onClick={() => router.push("/jobs")}
              className="gap-2"
            >
              <Briefcase size={16} />
              View Jobs
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
