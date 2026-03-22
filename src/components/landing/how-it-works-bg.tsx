"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useMouseParallax } from "@/hooks/use-mouse-parallax";

/**
 * 3D orbital rings + glowing nodes background for the How It Works section.
 * All elements react to mouse movement with multi-depth parallax.
 */
export function HowItWorksBg() {
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
    <div ref={containerRef} className="absolute inset-0 overflow-hidden" style={{ perspective: "1000px" }}>
      {/* ── Scene wrapper: tilts toward mouse ── */}
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="absolute inset-0"
      >
        {/* ═══ DEEP LAYER ═══ */}
        <motion.div style={{ x: shallowOffsetX, y: shallowOffsetY }} className="pointer-events-none absolute inset-0">
          {/* Tertiary ring — large, very subtle */}
          <motion.div
            animate={{ rotateZ: 360 }}
            transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
            className="absolute left-1/2 top-1/2 h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 opacity-40"
            style={{ transformStyle: "preserve-3d", transform: "translate(-50%, -50%) rotateX(75deg)" }}
          >
            <div className="absolute inset-0 rounded-full border border-white/[0.035]" />
            <div className="absolute inset-8 rounded-full border border-white/[0.02]" />
          </motion.div>

          {/* Subtle dot grid texture */}
          <svg className="absolute inset-0 h-full w-full opacity-[0.02]">
            <defs>
              <pattern id="hiw-dots" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
                <circle cx="25" cy="25" r="0.7" fill="currentColor" className="text-white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hiw-dots)" />
          </svg>

          {/* Radial glow — center */}
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.03] blur-[100px]" />
        </motion.div>

        {/* ═══ MID LAYER ═══ */}
        <motion.div style={{ x: offsetX, y: offsetY }} className="pointer-events-none absolute inset-0">
          {/* Primary orbital ring — tilted, center */}
          <motion.div
            animate={{ rotateZ: 360 }}
            transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
            className="absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2"
            style={{ transformStyle: "preserve-3d", transform: "translate(-50%, -50%) rotateX(65deg)" }}
          >
            <div className="absolute inset-0 rounded-full border border-primary/[0.08]" />
            <div className="absolute inset-4 rounded-full border border-primary/[0.04]" />
            {/* Orbiting node */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            >
              <div className="absolute left-0 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/35 shadow-[0_0_24px_6px_rgba(139,92,246,0.35)]" />
            </motion.div>
          </motion.div>

          {/* Secondary orbital ring — smaller, counter-rotating */}
          <motion.div
            animate={{ rotateZ: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2"
            style={{ transformStyle: "preserve-3d", transform: "translate(-50%, -50%) rotateX(70deg) rotateY(25deg)" }}
          >
            <div className="absolute inset-0 rounded-full border border-cyan-400/[0.07]" />
            <div className="absolute inset-3 rounded-full border border-cyan-400/[0.035]" />
            {/* Orbiting node */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            >
              <div className="absolute right-0 top-1/2 h-2.5 w-2.5 translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/30 shadow-[0_0_18px_4px_rgba(34,211,238,0.3)]" />
            </motion.div>
          </motion.div>

          {/* Wireframe cube — top-right */}
          <motion.div
            animate={{ rotateX: 360, rotateY: -360, rotateZ: 180 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute right-[6%] top-[8%] h-24 w-24 opacity-35"
            style={{ transformStyle: "preserve-3d" }}
          >
            {[30, -30].map((z) => (
              <div key={`cz${z}`} className="absolute inset-0 rounded-lg border border-primary/[0.12]" style={{ transform: `translateZ(${z}px)` }} />
            ))}
            {[30, -30].map((z) => (
              <div key={`cy${z}`} className="absolute inset-0 rounded-lg border border-primary/[0.06]" style={{ transform: `rotateY(90deg) translateZ(${z}px)` }} />
            ))}
            {[30, -30].map((z) => (
              <div key={`cx${z}`} className="absolute inset-0 rounded-lg border border-primary/[0.04]" style={{ transform: `rotateX(90deg) translateZ(${z}px)` }} />
            ))}
          </motion.div>

          {/* Horizontal light streaks */}
          <motion.div
            animate={{ x: ["-120%", "250%"] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", repeatDelay: 5 }}
            className="absolute left-0 top-[38%] h-px w-1/4 bg-gradient-to-r from-transparent via-primary/15 to-transparent"
          />
          <motion.div
            animate={{ x: ["250%", "-120%"] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", repeatDelay: 6 }}
            className="absolute right-0 top-[62%] h-px w-1/4 bg-gradient-to-r from-transparent via-cyan-400/15 to-transparent"
          />
        </motion.div>

        {/* ═══ FRONT LAYER ═══ */}
        <motion.div style={{ x: deepOffsetX, y: deepOffsetY }} className="pointer-events-none absolute inset-0">
          {/* Octahedron / diamond — bottom-left */}
          <motion.div
            animate={{ y: [-14, 14, -14], rotateZ: [0, 90, 180, 270, 360] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[10%] left-[6%] opacity-35"
            style={{ transformStyle: "preserve-3d" }}
          >
            <svg width="70" height="70" viewBox="0 0 70 70" fill="none">
              <path d="M35 5L65 35L35 65L5 35L35 5Z" stroke="currentColor" strokeWidth="0.6" className="text-emerald-400/60" />
              <path d="M35 15L55 35L35 55L15 35L35 15Z" stroke="currentColor" strokeWidth="0.4" className="text-emerald-400/30" />
              <line x1="35" y1="5" x2="35" y2="65" stroke="currentColor" strokeWidth="0.3" className="text-emerald-400/20" />
              <line x1="5" y1="35" x2="65" y2="35" stroke="currentColor" strokeWidth="0.3" className="text-emerald-400/20" />
            </svg>
          </motion.div>

          {/* Pulsing center glow */}
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.12, 0.3, 0.12] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <div className="h-6 w-6 rounded-full bg-primary/25 shadow-[0_0_50px_15px_rgba(139,92,246,0.15)]" />
          </motion.div>

          {/* Small floating pentagon — top-left */}
          <motion.div
            animate={{ rotateZ: [0, -360], y: [-6, 6, -6] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-[10%] top-[12%] opacity-30"
          >
            <svg width="35" height="35" viewBox="0 0 35 35" fill="none">
              <path d="M17.5 2L33 13L27 30H8L2 13L17.5 2Z" stroke="currentColor" strokeWidth="0.5" className="text-amber-400/50" />
            </svg>
          </motion.div>

          {/* Glowing sphere — right */}
          <motion.div
            animate={{ y: [-8, 8, -8], scale: [1, 1.12, 1] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-[12%] top-[65%]"
          >
            <div className="h-5 w-5 rounded-full bg-cyan-400/15 shadow-[0_0_22px_6px_rgba(34,211,238,0.12)]" />
          </motion.div>

          {/* Floating glowing particles */}
          {[
            { left: "22%", top: "22%", size: 3, dur: 12, delay: 0, color: "bg-primary/20", glow: "shadow-[0_0_10px_rgba(139,92,246,0.2)]" },
            { left: "78%", top: "72%", size: 4, dur: 10, delay: 2, color: "bg-cyan-400/20", glow: "shadow-[0_0_10px_rgba(34,211,238,0.2)]" },
            { left: "62%", top: "12%", size: 3, dur: 13, delay: 1, color: "bg-amber-400/15", glow: "shadow-[0_0_8px_rgba(251,191,36,0.15)]" },
            { left: "38%", top: "78%", size: 3, dur: 11, delay: 3, color: "bg-emerald-400/20", glow: "shadow-[0_0_10px_rgba(52,211,153,0.2)]" },
            { left: "90%", top: "38%", size: 4, dur: 9, delay: 1.5, color: "bg-violet-400/15", glow: "shadow-[0_0_8px_rgba(167,139,250,0.15)]" },
            { left: "8%", top: "52%", size: 3, dur: 14, delay: 4, color: "bg-blue-400/20", glow: "shadow-[0_0_10px_rgba(96,165,250,0.2)]" },
            { left: "50%", top: "48%", size: 2, dur: 16, delay: 2.5, color: "bg-rose-400/15", glow: "shadow-[0_0_8px_rgba(251,113,133,0.15)]" },
          ].map((p, i) => (
            <motion.div
              key={i}
              animate={{ y: [-10, 10, -10], opacity: [0.2, 0.7, 0.2] }}
              transition={{ duration: p.dur, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
              className={`absolute rounded-full ${p.color} ${p.glow}`}
              style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Depth fade edges */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
