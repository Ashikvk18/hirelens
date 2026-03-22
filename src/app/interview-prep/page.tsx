"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import Link from "next/link";
import {
  Loader2,
  ArrowLeft,
  Code2,
  MessageCircle,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { scrollBlurUp, scrollFadeUp, scrollStagger, scrollStaggerItem, viewportOnce, viewportOnceEarly } from "@/lib/motion";

function InterviewPrepContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const jobTitle = searchParams.get("title") || "";
  const company = searchParams.get("company") || "";
  const skills = searchParams.get("skills") || "";

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    }
  }, [authLoading, user, router]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 size={24} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) return null;

  const params = new URLSearchParams();
  if (jobTitle) params.set("title", jobTitle);
  if (company) params.set("company", company);
  if (skills) params.set("skills", skills);
  const qs = params.toString() ? `?${params.toString()}` : "";

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
              <BookOpen size={11} className="text-white" />
            </div>
            <span className="text-[13px] font-bold tracking-tight">Interview Prep</span>
          </div>
          <div className="w-16" />
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <motion.div
          variants={scrollBlurUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnceEarly}
          className="text-center"
        >
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Interview Preparation
          </h1>
          {jobTitle && (
            <p className="mt-2 text-sm text-muted-foreground">
              {jobTitle}{company ? ` at ${company}` : ""}
            </p>
          )}
          <p className="mt-2 text-[14px] text-muted-foreground">
            Choose your focus area below
          </p>
        </motion.div>

        <motion.div
          variants={scrollStagger(0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-10 grid gap-5 sm:grid-cols-2"
        >
          {/* Technical */}
          <motion.div variants={scrollStaggerItem}>
            <Link
              href={`/interview-prep/technical${qs}`}
              className="group relative block overflow-hidden rounded-2xl border border-white/[0.04] bg-card/40 p-6 transition-all duration-300 hover:border-emerald-500/20 hover:bg-card/60"
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 transition-colors group-hover:bg-emerald-500/15">
                  <Code2 size={24} />
                </div>
                <h2 className="mb-2 text-lg font-bold">Technical Interview</h2>
                <p className="text-[13px] leading-relaxed text-muted-foreground">
                  Coding challenges, system design, conceptual questions, debugging scenarios, and tools/framework deep-dives.
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-[13px] font-medium text-emerald-400">
                  Start Practicing
                  <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Behavioral */}
          <motion.div variants={scrollStaggerItem}>
            <Link
              href={`/interview-prep/behavioral${qs}`}
              className="group relative block overflow-hidden rounded-2xl border border-white/[0.04] bg-card/40 p-6 transition-all duration-300 hover:border-blue-500/20 hover:bg-card/60"
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 transition-colors group-hover:bg-blue-500/15">
                  <MessageCircle size={24} />
                </div>
                <h2 className="mb-2 text-lg font-bold">Behavioral Interview</h2>
                <p className="text-[13px] leading-relaxed text-muted-foreground">
                  STAR method questions, situational scenarios, culture fit, and smart questions to ask the interviewer.
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-[13px] font-medium text-blue-400">
                  Start Practicing
                  <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default function InterviewPrepPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 size={24} className="animate-spin text-muted-foreground" />
        </div>
      }
    >
      <InterviewPrepContent />
    </Suspense>
  );
}
