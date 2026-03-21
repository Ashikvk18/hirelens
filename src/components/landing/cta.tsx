"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function CTA() {
  return (
    <section className="px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-4xl"
      >
        <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-accent/10 p-8 text-center sm:p-12 md:p-16">
          {/* Glow */}
          <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[80px]" />

          <h2 className="relative mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to improve your chances?
          </h2>
          <p className="relative mx-auto mb-8 max-w-lg text-muted-foreground">
            Paste your resume and a job description. Get instant, actionable
            feedback powered by AI. No sign-up needed.
          </p>
          <Link href="/analyze">
            <Button size="lg" className="relative gap-2 text-base">
              Start Analyzing
              <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
