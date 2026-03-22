"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Target, Briefcase, Shield, Zap, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { HeroSpline } from "./spline-scene";
import { AnimatedHeroBackground } from "./animated-hero-background";

/* ── Animation config ── */
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const fadeSlide = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
};

const chips = [
  { icon: Target, label: "Match Scoring", color: "text-emerald-400" },
  { icon: Shield, label: "AI Analysis", color: "text-primary" },
  { icon: Briefcase, label: "Smart Jobs", color: "text-amber-400" },
  { icon: Zap, label: "AI Rewriter", color: "text-blue-400" },
  { icon: BookOpen, label: "Interview Prep", color: "text-pink-400" },
];

export function Hero() {
  return (
    <section className="relative flex min-h-[100dvh] items-center overflow-hidden px-5 pt-14 pb-10 sm:px-6">

      {/* ── Animated crowd background ── */}
      <AnimatedHeroBackground />

      {/* Top fade for navbar blend */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent z-[2]" />

      {/* ── Two-column layout ── */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-8 xl:gap-12">

        {/* ── Left: Copy ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="flex-1 text-center lg:text-left"
        >
          {/* Badge */}
          <motion.div variants={fadeSlide}>
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/[0.05] px-3.5 py-1 text-[12px] font-medium text-primary/80 backdrop-blur-sm">
              <Sparkles size={12} />
              Built for Truman State University
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeSlide}
            className="mb-5 text-[2.25rem] font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.5rem] xl:text-6xl"
          >
            Stop guessing why
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-purple-300 bg-clip-text text-transparent">
              you get rejected
            </span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            variants={fadeSlide}
            className="mx-auto mb-8 max-w-lg text-[15px] leading-relaxed text-muted-foreground sm:text-base lg:mx-0 lg:max-w-xl"
          >
            AI-powered resume analysis, personalized job matching, interview prep,
            and career intelligence — everything you need to land the interview.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeSlide}
            className="flex flex-col items-center gap-3 sm:flex-row lg:justify-start"
          >
            <Link href="/analyze">
              <Button
                size="lg"
                className="group gap-2 text-[15px] shadow-lg shadow-primary/20 transition-all duration-200 hover:shadow-xl hover:shadow-primary/30"
              >
                Analyze My Resume
                <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button variant="outline" size="lg" className="text-[15px]">
                See How It Works
              </Button>
            </Link>
          </motion.div>

          {/* Credibility chips */}
          <motion.div variants={fadeSlide} className="mt-9 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
            {chips.map((chip, i) => (
              <motion.div
                key={chip.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.7 + i * 0.07 }}
                className="flex items-center gap-1.5 rounded-full border border-white/[0.05] bg-white/[0.02] px-3 py-1 backdrop-blur-sm transition-colors duration-200 hover:border-white/[0.1] hover:bg-white/[0.04]"
              >
                <chip.icon size={12} className={chip.color} />
                <span className="text-[11px] text-muted-foreground">{chip.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Right: Spline / Fallback ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
          className="relative w-full max-w-[280px] flex-shrink-0 sm:max-w-[320px] lg:max-w-[420px] xl:max-w-[460px]"
        >
          <div className="relative aspect-square w-full">
            <HeroSpline />
          </div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
