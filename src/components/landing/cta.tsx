"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { scrollScaleIn, scrollFadeUp, viewportOnce } from "@/lib/motion";

export function CTA() {
  return (
    <section className="px-4 py-28">
      <motion.div
        variants={scrollScaleIn}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mx-auto max-w-4xl"
      >
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-card/50 p-10 text-center sm:p-14 md:p-20">
          {/* Animated gradient orbs */}
          <div className="pointer-events-none absolute left-1/2 top-0 h-48 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[100px] animate-gradient-shift" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-32 w-64 translate-x-1/4 translate-y-1/4 rounded-full bg-accent/15 blur-[80px] animate-gradient-shift-alt" />

          {/* Grid overlay */}
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />

          <div className="relative">
            <motion.div
              variants={scrollFadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-[13px] font-medium text-primary"
            >
              <Zap size={13} className="animate-pulse" />
              No sign-up required
            </motion.div>

            <motion.h2
              variants={scrollFadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl"
            >
              Ready to improve your chances?
            </motion.h2>
            <motion.p
              variants={scrollFadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="mx-auto mb-8 max-w-lg text-[15px] leading-relaxed text-muted-foreground"
            >
              Paste your resume and a job description. Get instant, actionable
              feedback powered by AI — completely free.
            </motion.p>
            <motion.div
              variants={scrollFadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
            >
              <Link href="/analyze">
                <Button
                  size="lg"
                  className="group gap-2 text-base shadow-lg shadow-primary/20 transition-all duration-200 hover:shadow-xl hover:shadow-primary/30"
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
