"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

/**
 * AnimatedHeroBackground — Cinematic full-page background using the crowd image.
 *
 * A single image with three layered CSS transform animations:
 *   1. Slow zoom (scale 1.0 → 1.08 over ~30s)
 *   2. Gentle horizontal drift (±12px over ~35s)
 *   3. Subtle vertical movement (±6px over ~28s)
 *
 * Overlays:
 *   - Strong dark gradient for text readability
 *   - Radial spotlight centered on the gold-suited focal character
 *   - Edge gradient masks fading into the background
 *   - Optional depth blur on outer regions
 *
 * Single <Image>, zero clip-paths, pure CSS transforms = maximum performance.
 */

const IMAGE_SRC = "/images/hero-crowd.jpeg";

export function AnimatedHeroBackground() {
  const reducedMotion = useReducedMotion();
  const noMotion = !!reducedMotion;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">

      {/* ── THE IMAGE — single element, 3 independent motion axes ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.8 }}
        className="absolute inset-0"
      >
        {/*
          Nested motion divs for independent transform axes.
          Each loops at a different duration so the motion never
          feels repetitive — creates an organic, living feel.
        */}

        {/* Axis 1: Slow zoom / scale breathing */}
        <motion.div
          animate={noMotion ? {} : {
            scale: [1.0, 1.06, 1.02, 1.08, 1.0],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -inset-[8%]"
        >
          {/* Axis 2: Horizontal drift */}
          <motion.div
            animate={noMotion ? {} : {
              x: [0, 12, -6, 8, 0],
            }}
            transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {/* Axis 3: Vertical movement */}
            <motion.div
              animate={noMotion ? {} : {
                y: [0, -6, 4, -8, 0],
              }}
              transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={IMAGE_SRC}
                alt=""
                fill
                priority
                className="object-cover object-center"
                sizes="120vw"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ── DARK OVERLAY — strong readability layer ── */}
      <div className="absolute inset-0 bg-background/65" />

      {/* ── RADIAL SPOTLIGHT — illuminates the center character ──
          The focal character sits at ~50% horizontal, ~70% vertical.
          The spotlight creates a subtle bright window around them. */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(
            ellipse 35% 45% at 50% 65%,
            transparent 0%,
            rgba(0,0,0,0.35) 100%
          )`,
        }}
      />

      {/* ── WARM GLOW on focal character ── */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(
            ellipse 20% 30% at 50% 70%,
            rgba(251,191,36,0.06) 0%,
            transparent 100%
          )`,
        }}
      />

      {/* ── PURPLE COLOR GRADING ── */}
      <div className="absolute inset-0 bg-violet-950/15 mix-blend-color" />
      <div className="absolute inset-0 bg-primary/[0.03] mix-blend-soft-light" />

      {/* ── EDGE MASKS — fade image into background on all sides ── */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-transparent to-background/90" />

      {/* ── DEPTH BLUR — blurs the outer edges, keeps center sharper ──
          Uses a pseudo-frosted-glass ring around the viewport edges */}
      <div
        className="absolute inset-0"
        style={{
          backdropFilter: "blur(0.5px)",
          WebkitBackdropFilter: "blur(0.5px)",
          maskImage: "radial-gradient(ellipse 55% 50% at 50% 55%, transparent 40%, black 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 55% 50% at 50% 55%, transparent 40%, black 100%)",
        }}
      />

      {/* ── VIGNETTE ── */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,transparent_20%,var(--color-background)_75%)]" />

      {/* ── MOBILE: extra darkening for small-screen readability ── */}
      <div className="absolute inset-0 bg-background/15 sm:bg-transparent" />
    </div>
  );
}
