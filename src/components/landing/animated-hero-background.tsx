"use client";

import { motion } from "framer-motion";
import { useCallback, useRef } from "react";

/**
 * AnimatedHeroBackground — Looping video background blended into the dark UI.
 *
 * Uses the user-provided bgHirelens.mp4 as a fullscreen hero background.
 * The video autoplays muted, loops infinitely, and is blended with:
 *   - Dark overlay for text readability
 *   - Purple/violet color grading
 *   - Edge gradient masks (all 4 sides)
 *   - Radial vignette
 *   - Smooth fade-in on load
 */

const VIDEO_SRC = "/videos/bgHirelens.mp4";

export function AnimatedHeroBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleCanPlay = useCallback(() => {
    videoRef.current?.play().catch(() => {});
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">

      {/* ── VIDEO ELEMENT ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          autoPlay
          muted
          loop
          playsInline
          onCanPlay={handleCanPlay}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: "center 40%" }}
        />
      </motion.div>

      {/* ── DARK OVERLAY — primary readability layer ── */}
      <div className="absolute inset-0 bg-background/55" />

      {/* ── PURPLE COLOR GRADING ── */}
      <div className="absolute inset-0 bg-violet-950/20 mix-blend-multiply" />
      <div className="absolute inset-0 bg-primary/[0.04] mix-blend-soft-light" />

      {/* ── EDGE MASKS — fade video into background on all sides ── */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-background/70" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background/80" />

      {/* ── VIGNETTE ── */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,transparent_25%,var(--color-background)_75%)]" />

      {/* ── MOBILE: extra darkening for small-screen readability ── */}
      <div className="absolute inset-0 bg-background/15 sm:bg-transparent" />
    </div>
  );
}
