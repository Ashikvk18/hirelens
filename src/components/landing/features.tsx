"use client";

import Link from "next/link";
import {
  Target,
  Briefcase,
  BookOpen,
  Route,
  FileText,
  ClipboardList,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { scrollBlurUp, scrollStagger, scrollStaggerItem, viewportOnce } from "@/lib/motion";

const features = [
  {
    icon: Target,
    title: "Resume Analyzer",
    description:
      "Get instant match scores, missing keywords, weak sections, rejection risk, and AI-powered rewrite suggestions.",
    color: "from-emerald-500/20 to-emerald-500/5",
    iconColor: "text-emerald-400",
    glowColor: "group-hover:shadow-emerald-500/10",
    href: "/analyze",
  },
  {
    icon: Briefcase,
    title: "Smart Job Board",
    description:
      "Personalized job listings based on your profile, skills, and preferred roles — with one-click apply.",
    color: "from-blue-500/20 to-blue-500/5",
    iconColor: "text-blue-400",
    glowColor: "group-hover:shadow-blue-500/10",
    href: "/jobs",
  },
  {
    icon: FileText,
    title: "Cover Letter Generator",
    description:
      "AI-crafted cover letters tailored to each job description, with tone control and instant download.",
    color: "from-cyan-500/20 to-cyan-500/5",
    iconColor: "text-cyan-400",
    glowColor: "group-hover:shadow-cyan-500/10",
    href: "/cover-letter",
  },
  {
    icon: BookOpen,
    title: "Interview Prep",
    description:
      "Technical and behavioral interview questions generated for the specific role you're targeting.",
    color: "from-amber-500/20 to-amber-500/5",
    iconColor: "text-amber-400",
    glowColor: "group-hover:shadow-amber-500/10",
    href: "/interview-prep",
  },
  {
    icon: Route,
    title: "Skills Roadmap",
    description:
      "Personalized learning roadmap showing skill gaps, study phases, projects, and certifications to pursue.",
    color: "from-violet-500/20 to-violet-500/5",
    iconColor: "text-violet-400",
    glowColor: "group-hover:shadow-violet-500/10",
    href: "/skills-roadmap",
  },
  {
    icon: ClipboardList,
    title: "Application Tracker",
    description:
      "Track every application you've submitted — status updates, notes, and progress all in one place.",
    color: "from-primary/20 to-primary/5",
    iconColor: "text-primary",
    glowColor: "group-hover:shadow-primary/10",
    href: "/applications",
  },
];

const container = scrollStagger(0.08);
const item = scrollStaggerItem;

export function Features() {
  return (
    <section id="features" className="relative px-4 py-28">
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-primary/[0.03] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          variants={scrollBlurUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mb-14 text-center"
        >
          <p className="mb-3 text-[13px] font-semibold uppercase tracking-widest text-primary">
            Features
          </p>
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              land the job
            </span>
          </h2>
          <p className="mx-auto max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            Six powerful tools — from resume analysis to interview prep — all powered by AI.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <Link
                href={feature.href}
                className={`group relative block overflow-hidden rounded-2xl border border-white/[0.04] bg-card/40 p-6 transition-all duration-300 hover:border-white/[0.1] hover:bg-card/70 hover:shadow-2xl ${feature.glowColor}`}
              >
                {/* Subtle gradient glow on hover */}
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />

                <div className="relative">
                  <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] ${feature.iconColor} transition-all duration-300 group-hover:bg-white/[0.08] group-hover:scale-110`}>
                    <feature.icon size={20} />
                  </div>
                  <h3 className="mb-1.5 text-[15px] font-semibold">{feature.title}</h3>
                  <p className="text-[13px] leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                  <div className={`mt-3 flex items-center gap-1 text-[12px] font-medium ${feature.iconColor} opacity-0 transition-all duration-300 group-hover:opacity-100`}>
                    Try it now
                    <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
