"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

/**
 * AnimatedHeroBackground — Cinematic crowd image background for the landing hero.
 *
 * The image shows a crowd of suited figures with a small standout character
 * in gold at bottom-center. The animation creates the illusion of a living
 * scene through layered zones with independent subtle motion.
 *
 * Image zones (based on composition analysis):
 *   Zone 1 (left crowd):      0–30% horizontal — slow rightward drift
 *   Zone 2 (center-left):     25–55% — gentle vertical sway
 *   Zone 3 (center-right):    45–75% — subtle leftward drift
 *   Zone 4 (right crowd):     70–100% — slow vertical drift
 *   Zone 5 (focal character): ~38–62% h, ~50–95% v — gentle float + subtle scale
 *
 * Each zone is an absolutely-positioned copy of the full image with a CSS
 * clip-path that isolates its region. Framer Motion animates each with
 * different timing, creating parallax-like depth from a single flat image.
 */

const IMAGE_SRC = "/images/hero-crowd.jpeg";

/* ── Zone definitions ── */
interface Zone {
  id: string;
  clipPath: string;
  animate: Record<string, number[]>;
  duration: number;
  blur?: string;
}

const zones: Zone[] = [
  {
    id: "left-crowd",
    clipPath: "polygon(0% 0%, 32% 0%, 28% 100%, 0% 100%)",
    animate: { x: [0, 4, -2, 0], y: [0, 2, -1, 0] },
    duration: 14,
    blur: "blur(0.5px)",
  },
  {
    id: "center-left",
    clipPath: "polygon(25% 0%, 55% 0%, 52% 100%, 22% 100%)",
    animate: { y: [0, -3, 1, 0], x: [0, 1, -1, 0] },
    duration: 12,
    blur: "blur(0.3px)",
  },
  {
    id: "center-right",
    clipPath: "polygon(45% 0%, 78% 0%, 80% 100%, 48% 100%)",
    animate: { x: [0, -3, 2, 0], y: [0, 1, -2, 0] },
    duration: 16,
    blur: "blur(0.3px)",
  },
  {
    id: "right-crowd",
    clipPath: "polygon(70% 0%, 100% 0%, 100% 100%, 68% 100%)",
    animate: { x: [0, -3, 1, 0], y: [0, -2, 2, 0] },
    duration: 13,
    blur: "blur(0.5px)",
  },
];

/* Focal character zone — slightly more noticeable motion */
const focalZone = {
  clipPath: "polygon(36% 48%, 64% 48%, 64% 100%, 36% 100%)",
  animate: { y: [0, -3, 1, 0], scale: [1, 1.015, 0.995, 1] },
  duration: 10,
};

export function AnimatedHeroBackground() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* ── Layer 1: Base dark gradient ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />

      {/* ── Layer 2: Full image base (static, low opacity) ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="absolute inset-0"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative h-full w-full max-w-[1400px]">
            <Image
              src={IMAGE_SRC}
              alt=""
              fill
              priority
              className="object-contain object-center opacity-[0.06]"
              sizes="100vw"
            />
          </div>
        </div>
      </motion.div>

      {/* ── Layer 3: Animated crowd zones ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.6 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="relative h-full w-full max-w-[1400px]">
          {/* Crowd zones */}
          {zones.map((zone) => (
            <motion.div
              key={zone.id}
              animate={reducedMotion ? {} : zone.animate}
              transition={{
                duration: zone.duration,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              }}
              className="absolute inset-0"
              style={{
                clipPath: zone.clipPath,
                filter: zone.blur,
              }}
            >
              <Image
                src={IMAGE_SRC}
                alt=""
                fill
                className="object-contain object-center opacity-[0.12]"
                sizes="100vw"
              />
            </motion.div>
          ))}

          {/* Focal character — slightly brighter, more motion */}
          <motion.div
            animate={reducedMotion ? {} : focalZone.animate}
            transition={{
              duration: focalZone.duration,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
            className="absolute inset-0"
            style={{ clipPath: focalZone.clipPath }}
          >
            <Image
              src={IMAGE_SRC}
              alt=""
              fill
              className="object-contain object-center opacity-[0.22]"
              sizes="100vw"
            />
            {/* Subtle warm glow on focal character */}
            <div className="absolute inset-0 bg-amber-500/[0.04]" style={{ clipPath: focalZone.clipPath }} />
          </motion.div>
        </div>
      </motion.div>

      {/* ── Layer 4: Purple/violet color grading ── */}
      <div className="absolute inset-0 bg-violet-950/30 mix-blend-color" />
      <div className="absolute inset-0 bg-primary/[0.06] mix-blend-overlay" />

      {/* ── Layer 5: Edge gradient masks (fade image into background) ── */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--color-background)_75%)]" />

      {/* ── Layer 6: Subtle noise/grain texture ── */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      {/* ── Layer 7: Dark glass overlay for text readability ── */}
      <div className="absolute inset-0 bg-background/40 backdrop-blur-[0.5px]" />

      {/* ── Mobile: reduce complexity via higher overlay opacity ── */}
      <div className="absolute inset-0 bg-background/20 sm:bg-transparent" />
    </div>
  );
}
