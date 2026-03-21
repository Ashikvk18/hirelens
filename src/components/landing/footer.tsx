import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.04] px-4 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
            <Sparkles size={12} className="text-white" />
          </div>
          <span className="text-sm font-bold tracking-tight">
            Hire<span className="text-primary">Lens</span>
          </span>
        </div>

        <div className="flex items-center gap-6">
          <Link
            href="/analyze"
            className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
          >
            Analyze
          </Link>
          <Link
            href="/jobs"
            className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
          >
            Jobs
          </Link>
          <Link
            href="https://github.com/Ashikvk18/hirelens"
            target="_blank"
            className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
          >
            GitHub
          </Link>
        </div>

        <p className="text-[12px] text-muted-foreground/60">
          Built for Truman State University
        </p>
      </div>
    </footer>
  );
}
