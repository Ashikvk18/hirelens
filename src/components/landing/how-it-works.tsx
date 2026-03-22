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

const stepVariant = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.12 },
  }),
};

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative px-4 py-28">
      {/* Subtle background accent */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.04] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mb-14 text-center"
        >
          <p className="mb-3 text-[13px] font-semibold uppercase tracking-widest text-primary">
            How It Works
          </p>
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Three simple steps
          </h2>
          <p className="mx-auto max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            Understand exactly where you stand — in seconds.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              custom={i}
              variants={stepVariant}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group relative"
            >
              {/* Animated connector line */}
              {i < steps.length - 1 && (
                <div className="absolute right-0 top-9 hidden h-px w-full translate-x-1/2 md:block">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 + i * 0.15 }}
                    className="h-full w-full origin-left bg-gradient-to-r from-primary/30 via-primary/15 to-transparent"
                  />
                </div>
              )}

              <div className="relative rounded-2xl border border-white/[0.04] bg-card/30 p-6 text-center transition-all duration-300 hover:border-white/[0.1] hover:bg-card/50 hover:shadow-xl hover:shadow-primary/[0.03]">
                {/* Step number — animated entrance */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.2 + i * 0.15 }}
                  className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-[11px] font-bold text-white shadow-lg shadow-primary/30"
                >
                  {s.step}
                </motion.div>

                <div className="mx-auto mb-4 mt-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.03] text-primary transition-all duration-300 group-hover:bg-white/[0.06] group-hover:scale-110">
                  <s.icon size={24} />
                </div>
                <h3 className="mb-2 text-[15px] font-semibold">{s.title}</h3>
                <p className="text-[13px] leading-relaxed text-muted-foreground">
                  {s.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
