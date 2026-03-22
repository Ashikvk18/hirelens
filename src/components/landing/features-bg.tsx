"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useMouseParallax } from "@/hooks/use-mouse-parallax";

/**
 * 3D floating geometric shapes background for the Features section.
 * All elements react to mouse movement with multi-depth parallax.
 */
export function FeaturesBg() {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    rotateX,
    rotateY,
    offsetX,
    offsetY,
    deepOffsetX,
    deepOffsetY,
    shallowOffsetX,
    shallowOffsetY,
  } = useMouseParallax(containerRef);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden" style={{ perspective: "1200px" }}>
      {/* ── Scene wrapper: entire scene tilts toward mouse ── */}
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="absolute inset-0"
      >
        {/* ═══ DEEP LAYER (slow, far background) ═══ */}
        <motion.div style={{ x: shallowOffsetX, y: shallowOffsetY }} className="pointer-events-none absolute inset-0">
          {/* Large rotating ring — top-right */}
          <motion.div
            animate={{ rotateX: 360, rotateY: 180 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute -right-20 -top-10 h-[420px] w-[420px] rounded-full border border-primary/[0.07] opacity-50"
            style={{ transformStyle: "preserve-3d" }}
          />

          {/* Giant tilted ring — center-bottom */}
          <motion.div
            animate={{ rotateZ: 360 }}
            transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[2%] left-1/2 h-[350px] w-[350px] -translate-x-1/2"
            style={{ transformStyle: "preserve-3d", transform: "translateX(-50%) rotateX(72deg)" }}
          >
            <div className="absolute inset-0 rounded-full border border-white/[0.04]" />
            <div className="absolute inset-6 rounded-full border border-white/[0.025]" />
            <div className="absolute inset-12 rounded-full border border-white/[0.015]" />
          </motion.div>

          {/* Faint grid of dots — creates depth texture */}
          <svg className="absolute inset-0 h-full w-full opacity-[0.025]">
            <defs>
              <pattern id="feat-dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="0.8" fill="currentColor" className="text-white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#feat-dots)" />
          </svg>
        </motion.div>

        {/* ═══ MID LAYER (moderate parallax) ═══ */}
        <motion.div style={{ x: offsetX, y: offsetY }} className="pointer-events-none absolute inset-0">
          {/* Wireframe cube — bottom-left */}
          <motion.div
            animate={{ rotateX: -360, rotateZ: 360 }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-10 -left-10 h-36 w-36"
            style={{ transformStyle: "preserve-3d" }}
          >
            {[40, -40].map((z) => (
              <div key={`fz${z}`} className="absolute inset-0 rounded-xl border border-violet-500/[0.1]" style={{ transform: `translateZ(${z}px)` }} />
            ))}
            {[40, -40].map((z) => (
              <div key={`fy${z}`} className="absolute inset-0 rounded-xl border border-violet-500/[0.06]" style={{ transform: `rotateY(90deg) translateZ(${z}px)` }} />
            ))}
            {[40, -40].map((z) => (
              <div key={`fx${z}`} className="absolute inset-0 rounded-xl border border-violet-500/[0.04]" style={{ transform: `rotateX(90deg) translateZ(${z}px)` }} />
            ))}
          </motion.div>

          {/* Triangle wireframe — top-left */}
          <motion.div
            animate={{ rotateY: 360, y: [0, -18, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
            className="absolute left-[12%] top-[6%] opacity-40"
            style={{ transformStyle: "preserve-3d" }}
          >
            <svg width="90" height="80" viewBox="0 0 90 80" fill="none">
              <path d="M45 5L85 75H5L45 5Z" stroke="currentColor" strokeWidth="0.6" className="text-primary/50" />
              <path d="M45 18L72 68H18L45 18Z" stroke="currentColor" strokeWidth="0.4" className="text-primary/25" />
              <path d="M45 30L60 62H30L45 30Z" stroke="currentColor" strokeWidth="0.25" className="text-primary/15" />
            </svg>
          </motion.div>

          {/* Orbiting ring with glowing node — right side */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="absolute right-[12%] top-[35%] h-44 w-44"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="absolute inset-0 rounded-full border border-primary/[0.06]" />
            <div className="absolute inset-3 rounded-full border border-primary/[0.03]" />
            <div className="absolute left-0 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/30 shadow-[0_0_18px_4px_rgba(139,92,246,0.3)]" />
          </motion.div>

          {/* Horizontal light streak — mid */}
          <motion.div
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", repeatDelay: 4 }}
            className="absolute left-0 top-[45%] h-px w-1/3 bg-gradient-to-r from-transparent via-primary/20 to-transparent"
          />
        </motion.div>

        {/* ═══ FRONT LAYER (strong parallax, closest to viewer) ═══ */}
        <motion.div style={{ x: deepOffsetX, y: deepOffsetY }} className="pointer-events-none absolute inset-0">
          {/* Floating diamond — mid-left */}
          <motion.div
            animate={{ y: [-22, 22, -22], rotateZ: [0, 180, 360] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-[8%] top-[28%] h-20 w-20"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="h-full w-full rotate-45 rounded-lg border border-emerald-500/[0.15] bg-emerald-500/[0.03] shadow-[0_0_30px_rgba(52,211,153,0.08)]" />
          </motion.div>

          {/* Glowing sphere — top center */}
          <motion.div
            animate={{ y: [-10, 10, -10], scale: [1, 1.08, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-[48%] top-[5%] h-6 w-6"
          >
            <div className="h-full w-full rounded-full bg-cyan-400/15 shadow-[0_0_25px_8px_rgba(34,211,238,0.12)]" />
          </motion.div>

          {/* Small floating hexagon — bottom-right */}
          <motion.div
            animate={{ rotateZ: [0, 360], y: [-8, 8, -8] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[15%] right-[10%] opacity-40"
          >
            <svg width="40" height="36" viewBox="0 0 40 36" fill="none">
              <path d="M20 1L38 10V26L20 35L2 26V10L20 1Z" stroke="currentColor" strokeWidth="0.5" className="text-amber-400/50" />
            </svg>
          </motion.div>

          {/* Floating glowing particles */}
          {[
            { left: "72%", top: "12%", size: 4, delay: 0, dur: 11, color: "bg-cyan-400/25", glow: "shadow-[0_0_10px_rgba(34,211,238,0.2)]" },
            { left: "88%", top: "58%", size: 3, delay: 2, dur: 14, color: "bg-primary/20", glow: "shadow-[0_0_10px_rgba(139,92,246,0.2)]" },
            { left: "3%", top: "68%", size: 5, delay: 4, dur: 9, color: "bg-amber-400/20", glow: "shadow-[0_0_12px_rgba(251,191,36,0.15)]" },
            { left: "52%", top: "3%", size: 3, delay: 1, dur: 13, color: "bg-emerald-400/25", glow: "shadow-[0_0_10px_rgba(52,211,153,0.2)]" },
            { left: "28%", top: "82%", size: 4, delay: 3, dur: 10, color: "bg-blue-400/20", glow: "shadow-[0_0_10px_rgba(96,165,250,0.2)]" },
            { left: "42%", top: "55%", size: 2, delay: 5, dur: 16, color: "bg-rose-400/15", glow: "shadow-[0_0_8px_rgba(251,113,133,0.15)]" },
            { left: "18%", top: "45%", size: 3, delay: 2.5, dur: 12, color: "bg-violet-400/20", glow: "shadow-[0_0_10px_rgba(167,139,250,0.2)]" },
          ].map((dot, i) => (
            <motion.div
              key={i}
              animate={{ y: [-12, 12, -12], opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: dot.dur, repeat: Infinity, ease: "easeInOut", delay: dot.delay }}
              className={`absolute rounded-full ${dot.color} ${dot.glow}`}
              style={{ left: dot.left, top: dot.top, width: dot.size, height: dot.size }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Gradient overlays for depth fade */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
