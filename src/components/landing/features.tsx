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
      "Get an instant compatibility score between your resume and the job description.",
  },
  {
    icon: Search,
    title: "Missing Keywords",
    description:
      "Discover the exact keywords and skills recruiters are looking for that you're missing.",
  },
  {
    icon: AlertTriangle,
    title: "Weak Sections",
    description:
      "Identify which parts of your resume need the most improvement.",
  },
  {
    icon: TrendingUp,
    title: "Rejection Risk",
    description:
      "Understand your rejection probability and what's driving it down.",
  },
  {
    icon: Zap,
    title: "AI Suggestions",
    description:
      "Get AI-powered rewrite suggestions to strengthen weak bullet points.",
  },
  {
    icon: MessageSquare,
    title: "Outreach Helper",
    description:
      "Generate personalized recruiter outreach messages based on the job.",
  },
];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function Features() {
  return (
    <section id="features" className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              land the job
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            HireLens gives you a complete breakdown of how your resume stacks up
            — and exactly how to fix it.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              className="group rounded-xl border border-border bg-card/50 p-6 transition-colors hover:border-primary/30 hover:bg-card"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                <feature.icon size={20} />
              </div>
              <h3 className="mb-2 font-semibold">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
