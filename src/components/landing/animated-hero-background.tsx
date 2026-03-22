"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

/**
 * AnimatedHeroBackground — Stylized SVG silhouette crowd with cinematic depth.
 *
 * 3 depth layers of abstract human silhouettes:
 *   Far  — dim, blurred, slow drift left
 *   Mid  — medium opacity, gentle drift right
 *   Near — subtle, slightly sharper, drift left
 *
 * A center "hero" figure on the mid layer is taller, brighter, and has a
 * violet spotlight + warm glow, creating the "stand out" focal point.
 *
 * Floating particles add atmosphere between layers.
 * All motion is Framer Motion CSS transforms — zero canvas/video.
 */

/* ─────────────────────── SVG SILHOUETTE PATH ─────────────────────── */
// Simplified human form: head + shoulders/torso. Designed to be scaled.
// viewBox is 0 0 40 80 — width 40, height 80.
const SILHOUETTE_PATH =
  "M20 0 C26 0 31 5 31 12 C31 19 26 24 20 24 C14 24 9 19 9 12 C9 5 14 0 20 0 Z " +
  "M4 80 C4 52 10 38 20 36 C30 38 36 52 36 80 Z";

/* ─────────────────────── FIGURE TYPES ─────────────────────── */
interface Figure {
  x: number;        // % from left
  y: number;        // % from top (bottom-anchored)
  scale: number;
  opacity: number;
  swayAmount: number;
  swayDuration: number;
  delay: number;
}

/* ─────────────────────── LAYER CONFIGS ─────────────────────── */
// Far layer: small, dim, many figures — atmospheric depth
const farFigures: Figure[] = [
  { x: 5,  y: 62, scale: 0.5, opacity: 0.06, swayAmount: 3,  swayDuration: 14, delay: 0 },
  { x: 14, y: 58, scale: 0.55, opacity: 0.05, swayAmount: 2,  swayDuration: 16, delay: 1.2 },
  { x: 22, y: 60, scale: 0.48, opacity: 0.07, swayAmount: 2.5, swayDuration: 13, delay: 0.5 },
  { x: 32, y: 56, scale: 0.52, opacity: 0.06, swayAmount: 3,  swayDuration: 15, delay: 2.0 },
  { x: 42, y: 59, scale: 0.5,  opacity: 0.05, swayAmount: 2,  swayDuration: 17, delay: 0.8 },
  { x: 52, y: 57, scale: 0.53, opacity: 0.06, swayAmount: 2.5, swayDuration: 14, delay: 1.5 },
  { x: 62, y: 61, scale: 0.49, opacity: 0.05, swayAmount: 3,  swayDuration: 16, delay: 0.3 },
  { x: 72, y: 58, scale: 0.54, opacity: 0.07, swayAmount: 2,  swayDuration: 13, delay: 1.8 },
  { x: 82, y: 60, scale: 0.5,  opacity: 0.06, swayAmount: 2.5, swayDuration: 15, delay: 0.7 },
  { x: 92, y: 57, scale: 0.52, opacity: 0.05, swayAmount: 3,  swayDuration: 14, delay: 2.2 },
];

// Mid layer: medium figures — the main crowd
const midFigures: Figure[] = [
  { x: 8,  y: 68, scale: 0.7, opacity: 0.10, swayAmount: 2,  swayDuration: 11, delay: 0.3 },
  { x: 18, y: 65, scale: 0.75, opacity: 0.09, swayAmount: 1.5, swayDuration: 13, delay: 1.0 },
  { x: 28, y: 67, scale: 0.72, opacity: 0.11, swayAmount: 2,  swayDuration: 10, delay: 0.6 },
  { x: 38, y: 64, scale: 0.68, opacity: 0.10, swayAmount: 1.8, swayDuration: 12, delay: 1.4 },
  // Center hero figure — handled separately
  { x: 58, y: 66, scale: 0.73, opacity: 0.10, swayAmount: 1.5, swayDuration: 11, delay: 0.9 },
  { x: 68, y: 63, scale: 0.70, opacity: 0.09, swayAmount: 2,  swayDuration: 13, delay: 1.7 },
  { x: 78, y: 67, scale: 0.74, opacity: 0.11, swayAmount: 1.8, swayDuration: 10, delay: 0.2 },
  { x: 88, y: 65, scale: 0.69, opacity: 0.10, swayAmount: 2,  swayDuration: 12, delay: 1.1 },
];

// Near layer: fewer, larger, subtle — closest depth
const nearFigures: Figure[] = [
  { x: 2,  y: 78, scale: 0.9, opacity: 0.05, swayAmount: 1.5, swayDuration: 12, delay: 0.5 },
  { x: 20, y: 75, scale: 0.85, opacity: 0.04, swayAmount: 1,  swayDuration: 14, delay: 1.2 },
  { x: 75, y: 76, scale: 0.88, opacity: 0.05, swayAmount: 1.2, swayDuration: 13, delay: 0.8 },
  { x: 93, y: 78, scale: 0.92, opacity: 0.04, swayAmount: 1.5, swayDuration: 11, delay: 1.6 },
];

// The standout center figure
const heroFigure: Figure = {
  x: 48, y: 70, scale: 0.9, opacity: 0.25,
  swayAmount: 1.2, swayDuration: 8, delay: 0,
};

/* ─────────────────────── PARTICLES ─────────────────────── */
interface Particle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  dx: number;
  dy: number;
}

function generateParticles(count: number): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * 100,
      y: 40 + Math.random() * 50,
      size: 1 + Math.random() * 2,
      opacity: 0.08 + Math.random() * 0.12,
      duration: 15 + Math.random() * 20,
      delay: Math.random() * 10,
      dx: -8 + Math.random() * 16,
      dy: -12 + Math.random() * 8,
    });
  }
  return particles;
}

/* ─────────────────────── SILHOUETTE COMPONENT ─────────────────────── */
function Silhouette({
  figure,
  noMotion,
  color = "white",
  glow = false,
}: {
  figure: Figure;
  noMotion: boolean;
  color?: string;
  glow?: boolean;
}) {
  const size = 40 * figure.scale;
  const height = 80 * figure.scale;

  return (
    <motion.div
      animate={noMotion ? {} : {
        x: [-figure.swayAmount, figure.swayAmount, -figure.swayAmount * 0.5, figure.swayAmount * 0.7, -figure.swayAmount],
        y: [0, -figure.swayAmount * 0.4, figure.swayAmount * 0.2, -figure.swayAmount * 0.3, 0],
      }}
      transition={{
        duration: figure.swayDuration,
        repeat: Infinity,
        ease: "easeInOut",
        delay: figure.delay,
      }}
      className="absolute"
      style={{
        left: `${figure.x}%`,
        bottom: `${100 - figure.y - height * 0.15}%`,
        width: size,
        height: height,
      }}
    >
      <svg
        viewBox="0 0 40 80"
        fill={color}
        opacity={figure.opacity}
        className="h-full w-full"
        style={glow ? { filter: "drop-shadow(0 0 12px rgba(139,92,246,0.4))" } : undefined}
      >
        <path d={SILHOUETTE_PATH} />
      </svg>
    </motion.div>
  );
}

/* ─────────────────────── MAIN COMPONENT ─────────────────────── */
export function AnimatedHeroBackground() {
  const reducedMotion = useReducedMotion();
  const noMotion = !!reducedMotion;
  const particles = useMemo(() => generateParticles(18), []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">

      {/* ── Base gradient ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background" />

      {/* ── Ambient gradient orbs ── */}
      <div className="absolute left-1/2 top-[10%] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-primary/[0.04] blur-[180px]" />
      <div className="absolute bottom-[5%] right-[-5%] h-[300px] w-[300px] rounded-full bg-accent/[0.03] blur-[140px]" />

      {/* ━━━━━━━━━━ FAR LAYER — atmospheric depth ━━━━━━━━━━ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.3 }}
        className="absolute inset-0"
      >
        <motion.div
          animate={noMotion ? {} : { x: [0, -15, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0"
          style={{ filter: "blur(3px)" }}
        >
          {farFigures.map((fig, i) => (
            <Silhouette key={`far-${i}`} figure={fig} noMotion={noMotion} color="rgb(200,200,220)" />
          ))}
        </motion.div>
      </motion.div>

      {/* ━━━━━━━━━━ MID LAYER — main crowd ━━━━━━━━━━ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.6 }}
        className="absolute inset-0"
      >
        <motion.div
          animate={noMotion ? {} : { x: [0, 10, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0"
          style={{ filter: "blur(1px)" }}
        >
          {midFigures.map((fig, i) => (
            <Silhouette key={`mid-${i}`} figure={fig} noMotion={noMotion} color="rgb(180,180,200)" />
          ))}
        </motion.div>
      </motion.div>

      {/* ━━━━━━━━━━ HERO FIGURE — the standout character ━━━━━━━━━━ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2.5, delay: 1.0 }}
        className="absolute inset-0"
      >
        <Silhouette
          figure={heroFigure}
          noMotion={noMotion}
          color="rgb(220,210,255)"
          glow
        />
      </motion.div>

      {/* ━━━━━━━━━━ NEAR LAYER — closest depth ━━━━━━━━━━ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.9 }}
        className="absolute inset-0"
      >
        <motion.div
          animate={noMotion ? {} : { x: [0, -8, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {nearFigures.map((fig, i) => (
            <Silhouette key={`near-${i}`} figure={fig} noMotion={noMotion} color="rgb(160,160,180)" />
          ))}
        </motion.div>
      </motion.div>

      {/* ━━━━━━━━━━ SPOTLIGHT on center figure ━━━━━━━━━━ */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(
            ellipse 18% 35% at 50% 68%,
            rgba(139,92,246,0.08) 0%,
            transparent 100%
          )`,
        }}
      />
      {/* Warm accent */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(
            ellipse 12% 20% at 50% 72%,
            rgba(251,191,36,0.03) 0%,
            transparent 100%
          )`,
        }}
      />

      {/* ━━━━━━━━━━ FLOATING PARTICLES ━━━━━━━━━━ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 3, delay: 1.5 }}
        className="absolute inset-0"
      >
        {particles.map((p, i) => (
          <motion.div
            key={`particle-${i}`}
            animate={noMotion ? {} : {
              x: [0, p.dx, 0],
              y: [0, p.dy, 0],
              opacity: [p.opacity, p.opacity * 1.5, p.opacity],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: p.delay,
            }}
            className="absolute rounded-full bg-violet-300"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              opacity: p.opacity,
            }}
          />
        ))}
      </motion.div>

      {/* ━━━━━━━━━━ GROUND FADE ━━━━━━━━━━ */}
      <div
        className="absolute inset-x-0 bottom-0 h-[35%]"
        style={{
          background: "linear-gradient(to top, var(--color-background) 0%, transparent 100%)",
        }}
      />

      {/* ━━━━━━━━━━ VIGNETTE ━━━━━━━━━━ */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,transparent_30%,var(--color-background)_78%)]" />

      {/* ━━━━━━━━━━ TOP + SIDE FADES ━━━━━━━━━━ */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60" />

      {/* ━━━━━━━━━━ MOBILE: slightly stronger overlay ━━━━━━━━━━ */}
      <div className="absolute inset-0 bg-background/10 sm:bg-transparent" />
    </div>
  );
}
