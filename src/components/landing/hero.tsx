"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Target, Briefcase, Shield } from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden px-4 pt-16">
      {/* Dot grid background */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-60" />

      {/* Gradient orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-10%] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-primary/15 blur-[140px]" />
        <div className="absolute bottom-[-5%] right-[-10%] h-[350px] w-[350px] rounded-full bg-accent/10 blur-[120px]" />
        <div className="absolute bottom-[20%] left-[-5%] h-[250px] w-[250px] rounded-full bg-primary/8 blur-[100px]" />
      </div>

      {/* Top fade for navbar blend */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent" />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.06] px-4 py-1.5 text-[13px] text-primary/90 backdrop-blur-sm">
            <Sparkles size={13} />
            Built for Truman State University Students
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Stop guessing why
          <br />
          <span className="bg-gradient-to-r from-primary via-accent to-purple-300 bg-clip-text text-transparent">
            you get rejected
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          HireLens analyzes your resume against any job description — match score,
          missing keywords, weak sections, and AI-powered suggestions to land the interview.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link href="/analyze">
            <Button size="lg" className="gap-2 text-base shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-shadow">
              Analyze My Resume
              <ArrowRight size={18} />
            </Button>
          </Link>
          <Link href="#how-it-works">
            <Button variant="outline" size="lg" className="text-base">
              See How It Works
            </Button>
          </Link>
        </motion.div>

        {/* Floating stat chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-14 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
        >
          {[
            { icon: Target, label: "Match Scoring", color: "text-emerald-400" },
            { icon: Shield, label: "AI-Powered Analysis", color: "text-primary" },
            { icon: Briefcase, label: "Personalized Jobs", color: "text-amber-400" },
          ].map((chip) => (
            <div
              key={chip.label}
              className="flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.02] px-4 py-2 backdrop-blur-sm"
            >
              <chip.icon size={14} className={chip.color} />
              <span className="text-[13px] text-muted-foreground">{chip.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
