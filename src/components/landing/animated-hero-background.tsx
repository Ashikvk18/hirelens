"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

/**
 * AnimatedCrowdScene — The crowd image as the hero's main visual element.
 *
 * The image is clearly visible with animated clip-path regions that give
 * each group of characters independent subtle motion, making the scene
 * feel alive. The focal gold-suited character at bottom-center gets the
 * most motion + a warm glow to "stand out from the crowd."
 *
 * This replaces the Spline fallback in the right column of the hero.
 */

const IMAGE_SRC = "/images/hero-crowd.jpeg";

/* ── Crowd region definitions ──
   Each region clips a part of the image and applies independent motion.
   The full image is rendered underneath as a base, then each animated
   region overlays on top with its own transform. */

interface CrowdRegion {
  id: string;
  clipPath: string;
  animate: Record<string, number[]>;
  duration: number;
}

const regions: CrowdRegion[] = [
  {
    id: "left-group",
    clipPath: "polygon(0% 0%, 35% 0%, 33% 100%, 0% 100%)",
    animate: { x: [0, 2, -1.5, 0], y: [0, -2, 1, 0] },
    duration: 10,
  },
  {
    id: "center-back",
    clipPath: "polygon(30% 0%, 70% 0%, 70% 50%, 30% 50%)",
    animate: { y: [0, -2.5, 1, 0], x: [0, 1, -0.5, 0] },
    duration: 8,
  },
  {
    id: "right-group",
    clipPath: "polygon(65% 0%, 100% 0%, 100% 100%, 67% 100%)",
    animate: { x: [0, -2, 1.5, 0], y: [0, 1.5, -1, 0] },
    duration: 11,
  },
];

/* Focal character — the small gold-suited figure at bottom center */
const focal = {
  clipPath: "polygon(33% 45%, 67% 45%, 67% 100%, 33% 100%)",
  animate: { y: [0, -4, 1.5, -2, 0], scale: [1, 1.015, 0.998, 1.01, 1] },
  duration: 7,
};

export function AnimatedCrowdScene() {
  const reducedMotion = useReducedMotion();
  const noMotion = !!reducedMotion;

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl" aria-hidden="true">

      {/* Glow behind the scene */}
      <div className="pointer-events-none absolute -inset-8 z-0">
        <div className="absolute inset-0 rounded-3xl bg-primary/[0.07] blur-[40px]" />
      </div>

      {/* Container */}
      <div className="relative z-10 h-full w-full overflow-hidden rounded-2xl border border-white/[0.06] bg-background/50">

        {/* ── BASE LAYER: full image, static ── */}
        <div className="absolute inset-0">
          <Image
            src={IMAGE_SRC}
            alt="Crowd of job seekers with one standout candidate"
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width: 1024px) 90vw, 500px"
          />
          {/* Purple color grading over the base */}
          <div className="absolute inset-0 bg-violet-950/20 mix-blend-multiply" />
        </div>

        {/* ── ANIMATED CROWD REGIONS ──
            Each region is the full image clipped to a zone,
            with independent subtle motion */}
        {regions.map((region) => (
          <motion.div
            key={region.id}
            animate={noMotion ? {} : region.animate}
            transition={{
              duration: region.duration,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
            className="absolute inset-0"
            style={{ clipPath: region.clipPath }}
          >
            <Image
              src={IMAGE_SRC}
              alt=""
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 90vw, 500px"
            />
            <div className="absolute inset-0 bg-violet-950/20 mix-blend-multiply" />
          </motion.div>
        ))}

        {/* ── FOCAL CHARACTER ──
            More pronounced motion + warm glow to stand out */}
        <motion.div
          animate={noMotion ? {} : focal.animate}
          transition={{
            duration: focal.duration,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
          className="absolute inset-0"
          style={{ clipPath: focal.clipPath }}
        >
          <Image
            src={IMAGE_SRC}
            alt=""
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 90vw, 500px"
          />
          {/* Warm spotlight on the focal character */}
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at 50% 70%, rgba(251,191,36,0.12) 0%, transparent 55%)",
            }}
          />
        </motion.div>

        {/* ── Dark gradient overlay — fade edges into container ── */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-background/40" />

        {/* ── Subtle vignette ── */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.3)_100%)]" />
      </div>
    </div>
  );
}

/**
 * AnimatedHeroBackground — Subtle ambient background for the full hero section.
 * Just gradient orbs and a grid, no crowd image here.
 */
export function AnimatedHeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <div className="absolute inset-0 bg-grid opacity-25" />

      {/* Ambient gradient orbs */}
      <div className="absolute left-1/2 top-[-6%] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-primary/8 blur-[180px] animate-gradient-shift" />
      <div className="absolute bottom-[-4%] right-[-6%] h-[300px] w-[300px] rounded-full bg-accent/6 blur-[140px] animate-gradient-shift-alt" />
      <div className="absolute bottom-[30%] left-[-4%] h-[220px] w-[220px] rounded-full bg-violet-500/5 blur-[120px] animate-gradient-shift-slow" />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--color-background)_72%)]" />
    </div>
  );
}
