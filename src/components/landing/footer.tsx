"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { scrollFadeUp, viewportOnce } from "@/lib/motion";

const footerLinks = [
  { href: "/analyze", label: "Analyze" },
  { href: "/jobs", label: "Jobs" },
  { href: "https://github.com/Ashikvk18/hirelens", label: "GitHub", external: true },
];

export function Footer() {
  return (
    <motion.footer
      variants={scrollFadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="border-t border-white/[0.04] px-4 py-10"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent transition-shadow group-hover:shadow-lg group-hover:shadow-primary/20">
            <Sparkles size={12} className="text-white" />
          </div>
          <span className="text-sm font-bold tracking-tight">
            Hire<span className="text-primary">Lens</span>
          </span>
        </Link>

        <div className="flex items-center gap-6">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              {...(link.external ? { target: "_blank" } : {})}
              className="group relative text-[13px] text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-primary/60 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        <p className="text-[12px] text-muted-foreground/60">
          Built for Truman State University
        </p>
      </div>
    </motion.footer>
  );
}
