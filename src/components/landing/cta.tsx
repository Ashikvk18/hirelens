"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import { motion } from "framer-motion";

export function CTA() {
  return (
    <section className="px-4 py-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-4xl"
      >
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-card/50 p-10 text-center sm:p-14 md:p-20">
          {/* Gradient orbs */}
          <div className="pointer-events-none absolute left-1/2 top-0 h-48 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[100px]" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-32 w-64 translate-x-1/4 translate-y-1/4 rounded-full bg-accent/15 blur-[80px]" />

          {/* Grid overlay */}
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />

          <div className="relative">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-[13px] font-medium text-primary">
              <Zap size={13} />
              No sign-up required
            </div>

            <h2 className="mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Ready to improve your chances?
            </h2>
            <p className="mx-auto mb-8 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
              Paste your resume and a job description. Get instant, actionable
              feedback powered by AI — completely free.
            </p>
            <Link href="/analyze">
              <Button size="lg" className="gap-2 text-base shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-shadow">
                Start Analyzing
                <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
