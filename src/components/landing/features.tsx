"use client";

import {
  Target,
  Search,
  AlertTriangle,
  TrendingUp,
  MessageSquare,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Target,
    title: "Match Score",
    description:
      "Instant compatibility score between your resume and the target job description.",
    color: "from-emerald-500/20 to-emerald-500/5",
    iconColor: "text-emerald-400",
  },
  {
    icon: Search,
    title: "Missing Keywords",
    description:
      "The exact keywords and skills recruiters want that you're missing.",
    color: "from-blue-500/20 to-blue-500/5",
    iconColor: "text-blue-400",
  },
  {
    icon: AlertTriangle,
    title: "Weak Sections",
    description:
      "Pinpoint which parts of your resume need the most improvement.",
    color: "from-amber-500/20 to-amber-500/5",
    iconColor: "text-amber-400",
  },
  {
    icon: TrendingUp,
    title: "Rejection Risk",
    description:
      "Know your rejection probability and what factors are hurting you.",
    color: "from-red-500/20 to-red-500/5",
    iconColor: "text-red-400",
  },
  {
    icon: Zap,
    title: "AI Rewriter",
    description:
      "AI-powered rewrite options to strengthen weak bullet points instantly.",
    color: "from-primary/20 to-primary/5",
    iconColor: "text-primary",
  },
  {
    icon: MessageSquare,
    title: "Outreach Helper",
    description:
      "Personalized recruiter outreach messages tailored to each job.",
    color: "from-violet-500/20 to-violet-500/5",
    iconColor: "text-violet-400",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export function Features() {
  return (
    <section id="features" className="relative px-4 py-28">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
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
            A complete breakdown of how your resume stacks up — and exactly how to fix it.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.04] bg-card/40 p-6 transition-all duration-300 hover:border-white/[0.08] hover:bg-card/70"
            >
              {/* Subtle gradient glow on hover */}
              <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />

              <div className="relative">
                <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] ${feature.iconColor} transition-colors group-hover:bg-white/[0.06]`}>
                  <feature.icon size={20} />
                </div>
                <h3 className="mb-1.5 text-[15px] font-semibold">{feature.title}</h3>
                <p className="text-[13px] leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
