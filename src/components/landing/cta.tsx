"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import { motion } from "framer-motion";

export function CTA() {
  return (
    <section className="px-4 py-28">
      <motion.div
        initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-4xl"
      >
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-card/50 p-10 text-center sm:p-14 md:p-20 animate-border-glow">
          {/* Animated gradient orbs */}
          <div className="pointer-events-none absolute left-1/2 top-0 h-48 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[100px] animate-gradient-shift" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-32 w-64 translate-x-1/4 translate-y-1/4 rounded-full bg-accent/15 blur-[80px] animate-gradient-shift-alt" />

          {/* Grid overlay */}
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />

          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-[13px] font-medium text-primary"
            >
              <Zap size={13} className="animate-pulse" />
              No sign-up required
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl"
            >
              Ready to improve your chances?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mx-auto mb-8 max-w-lg text-[15px] leading-relaxed text-muted-foreground"
            >
              Paste your resume and a job description. Get instant, actionable
              feedback powered by AI — completely free.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Link href="/analyze">
                <Button
                  size="lg"
                  className="group gap-2 text-base shadow-xl shadow-primary/25 transition-all duration-300 hover:shadow-primary/40 hover:scale-[1.03] active:scale-[0.97] animate-glow-pulse"
                >
                  Start Analyzing
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
