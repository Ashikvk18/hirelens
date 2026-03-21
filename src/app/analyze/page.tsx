import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AnalyzerForm } from "@/components/analyzer/analyzer-form";

export default function AnalyzePage() {
  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
              <span className="text-xs font-bold text-white">H</span>
            </div>
            <span className="text-sm font-semibold hidden sm:inline">HireLens Analyzer</span>
          </div>
          <div className="w-[100px]" />
        </div>
      </header>

      {/* Page heading */}
      <div className="mx-auto max-w-7xl px-4 pt-8 pb-2">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Resume Analyzer
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Paste your resume and a job description to get instant match analysis.
        </p>
      </div>

      {/* Analyzer */}
      <AnalyzerForm />
    </div>
  );
}
