"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AnalyzerForm } from "@/components/analyzer/analyzer-form";
import { motion } from "framer-motion";
import { scrollBlurUp, scrollFadeUp, viewportOnce } from "@/lib/motion";

export default function AnalyzePage() {
  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-white/[0.04] bg-background/70 backdrop-blur-2xl backdrop-saturate-150">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">Home</span>
          </Link>
          <div className="flex items-center gap-1.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-primary to-accent">
              <span className="text-[10px] font-bold text-white">H</span>
            </div>
            <span className="text-[13px] font-bold tracking-tight">Analyzer</span>
          </div>
          <div className="w-16" />
        </div>
      </header>

      {/* Page heading */}
      <motion.div
        variants={scrollBlurUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mx-auto max-w-7xl px-4 pt-8 pb-2"
      >
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Resume Analyzer
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Paste your resume and a job description to get instant match analysis.
        </p>
      </motion.div>

      {/* Analyzer */}
      <motion.div
        variants={scrollFadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <AnalyzerForm />
      </motion.div>
    </div>
  );
}
