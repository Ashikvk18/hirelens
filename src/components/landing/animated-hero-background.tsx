"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

/**
 * AnimatedHeroBackground — Cinematic 3-layer parallax crowd background.
 *
 * Creates depth and life from a single flat image using three stacked layers,
 * each with different blur, opacity, scale, and motion speeds.
 *
 * Layer 1 (Far):   Blurred, scaled up, very slow drift      → atmospheric haze
 * Layer 2 (Mid):   Main crowd, medium opacity, gentle sway   → crowd presence
 * Layer 3 (Focal): Clip-path on center character, sharp,     → "stand out" emphasis
 *                  brighter, more pronounced motion
 *
 * Purple color grading + edge masks + grain ensure it blends into the dark UI.
 */

const IMAGE_SRC = "/images/hero-crowd.jpeg";

export function AnimatedHeroBackground() {
  const reducedMotion = useReducedMotion();
  const noMotion = !!reducedMotion;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          LAYER 1 — FAR BACKGROUND
          Heavily blurred, scaled up, very low opacity, slow drift.
          Creates atmospheric depth / haze behind everything.
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.2 }}
        className="absolute inset-0"
      >
        <motion.div
          animate={noMotion ? {} : {
            x: [0, 12, -8, 0],
            y: [0, -6, 4, 0],
            scale: [1.12, 1.15, 1.10, 1.12],
          }}
          transition={{ duration: 22, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
          className="absolute -inset-[10%]"
        >
          <Image
            src={IMAGE_SRC}
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="120vw"
            style={{ filter: "blur(10px)", opacity: 0.09 }}
          />
        </motion.div>
      </motion.div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          LAYER 2 — MID CROWD
          Main visible crowd layer. Medium opacity, slight blur,
          gentle horizontal sway + micro vertical movement.
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <motion.div
          animate={noMotion ? {} : {
            x: [0, -6, 4, -2, 0],
            y: [0, 3, -2, 1, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
          className="relative h-full w-full max-w-[1400px]"
        >
          <Image
            src={IMAGE_SRC}
            alt=""
            fill
            className="object-contain object-center"
            sizes="100vw"
            style={{ filter: "blur(1.5px)", opacity: 0.18 }}
          />
        </motion.div>
      </motion.div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          LAYER 3 — FOCAL CHARACTER
          Clip-path isolates the small gold-suited character at
          bottom-center. Sharper, brighter, with more pronounced
          motion to create the "stand out" effect.
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.8 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <motion.div
          animate={noMotion ? {} : {
            y: [0, -5, 2, -3, 0],
            scale: [1, 1.02, 0.995, 1.01, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
          className="relative h-full w-full max-w-[1400px]"
          style={{ clipPath: "polygon(32% 42%, 68% 42%, 68% 100%, 32% 100%)" }}
        >
          <Image
            src={IMAGE_SRC}
            alt=""
            fill
            className="object-contain object-center"
            sizes="100vw"
            style={{ opacity: 0.32 }}
          />
          {/* Warm glow on the focal character */}
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at 50% 75%, rgba(245,158,11,0.06) 0%, transparent 60%)",
            }}
          />
        </motion.div>
      </motion.div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          COLOR GRADING + BLENDING
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="absolute inset-0 bg-violet-950/25 mix-blend-color" />
      <div className="absolute inset-0 bg-primary/[0.05] mix-blend-soft-light" />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          EDGE MASKS — fade image into background on all sides
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/20 to-background" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-transparent to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,transparent_25%,var(--color-background)_70%)]" />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          GRAIN TEXTURE — very subtle film grain
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div
        className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          MOBILE EXTRA OVERLAY — ensure text readability on small screens
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="absolute inset-0 bg-background/25 sm:bg-background/10 lg:bg-transparent" />
    </div>
  );
}
