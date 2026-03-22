"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Target, Briefcase, Shield, Zap, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { SplineScene } from "./spline-scene";

const blurUp = {
  initial: { opacity: 0, y: 24, filter: "blur(10px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const chips = [
  { icon: Target, label: "Match Scoring", color: "text-emerald-400", delay: 0 },
  { icon: Shield, label: "AI Analysis", color: "text-primary", delay: 0.8 },
  { icon: Briefcase, label: "Smart Jobs", color: "text-amber-400", delay: 1.6 },
  { icon: Zap, label: "Resume Rewriter", color: "text-blue-400", delay: 2.4 },
  { icon: BookOpen, label: "Interview Prep", color: "text-pink-400", delay: 3.2 },
];

export function Hero() {
  return (
    <section className="relative flex min-h-[100vh] items-center overflow-hidden px-4 pt-16 pb-8">
      {/* ── Animated Background Layer ── */}
      <div className="pointer-events-none absolute inset-0">
        {/* Dot grid */}
        <div className="absolute inset-0 bg-grid opacity-40" />

        {/* Moving gradient orbs */}
        <div className="absolute left-1/2 top-[-8%] h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-primary/12 blur-[160px] animate-gradient-shift" />
        <div className="absolute bottom-[-5%] right-[-8%] h-[400px] w-[400px] rounded-full bg-accent/10 blur-[140px] animate-gradient-shift-alt" />
        <div className="absolute bottom-[25%] left-[-5%] h-[300px] w-[300px] rounded-full bg-violet-500/8 blur-[120px] animate-gradient-shift-slow" />

        {/* Subtle radial vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--color-background)_70%)]" />
      </div>

      {/* Top fade for navbar blend */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background via-background/80 to-transparent" />

      {/* ── Main Content: Text + Spline ── */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center gap-8 lg:flex-row lg:items-center lg:gap-4">

        {/* Left: Text Content */}
        <div className="flex-1 text-center lg:text-left">
          {/* Badge */}
          <motion.div
            variants={blurUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.06] px-4 py-1.5 text-[13px] text-primary/90 backdrop-blur-sm animate-border-glow">
              <Sparkles size={13} className="animate-pulse" />
              Built for Truman State University Students
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={blurUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl"
          >
            Stop guessing why
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-purple-300 bg-clip-text text-transparent">
              you get rejected
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={blurUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0"
          >
            AI-powered resume analysis, personalized job matching, interview prep,
            and career intelligence — everything you need to land the interview.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={blurUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col items-center gap-3 sm:flex-row lg:justify-start"
          >
            <Link href="/analyze">
              <Button
                size="lg"
                className="group gap-2 text-base shadow-xl shadow-primary/25 transition-all duration-300 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98]"
              >
                Analyze My Resume
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button
                variant="outline"
                size="lg"
                className="text-base transition-all duration-300 hover:bg-white/[0.04] hover:scale-[1.02] active:scale-[0.98]"
              >
                See How It Works
              </Button>
            </Link>
          </motion.div>

          {/* Floating stat chips — horizontal scroll on mobile, flex-wrap on desktop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 lg:justify-start"
          >
            {chips.map((chip, i) => (
              <motion.div
                key={chip.label}
                initial={{ opacity: 0, y: 12, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.8 + i * 0.08 }}
                className="animate-float-slow flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.02] px-3.5 py-1.5 backdrop-blur-sm transition-colors hover:border-white/[0.12] hover:bg-white/[0.04]"
                style={{ animationDelay: `${chip.delay}s` }}
              >
                <chip.icon size={13} className={chip.color} />
                <span className="text-[12px] text-muted-foreground">{chip.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Right: Spline 3D Visual — hidden on small screens */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="hidden w-full max-w-[480px] lg:block lg:flex-shrink-0"
        >
          <div className="aspect-square w-full">
            <SplineScene />
          </div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background via-background/60 to-transparent" />
    </section>
  );
}
