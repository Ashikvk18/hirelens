"use client";

import { Upload, Cpu, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Paste Your Resume & Job Description",
    description:
      "Copy-paste your resume text and the target job description into HireLens.",
  },
  {
    icon: Cpu,
    step: "02",
    title: "AI Analyzes the Match",
    description:
      "Our engine compares keywords, skills, experience, and structure in seconds.",
  },
  {
    icon: BarChart3,
    step: "03",
    title: "Get Actionable Results",
    description:
      "See your match score, missing keywords, weak sections, and AI-powered fix suggestions.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-4 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            How it works
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            Three simple steps to understand exactly where you stand.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.12 }}
              className="relative text-center"
            >
              {/* Connector line (desktop only) */}
              {i < steps.length - 1 && (
                <div className="absolute right-0 top-10 hidden h-px w-full translate-x-1/2 bg-gradient-to-r from-border to-transparent md:block" />
              )}

              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card">
                <s.icon size={24} className="text-primary" />
              </div>
              <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-primary">
                Step {s.step}
              </span>
              <h3 className="mb-2 text-lg font-semibold">{s.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {s.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
