"use client";

import { motion } from "framer-motion";

/**
 * 3D floating geometric shapes background for the Features section.
 * Uses CSS perspective + Framer Motion for depth parallax.
 */
export function FeaturesBg() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ perspective: "1200px" }}>
      {/* Large rotating hexagonal ring — top-right */}
      <motion.div
        animate={{ rotateX: 360, rotateY: 180 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute -right-20 -top-10 h-[400px] w-[400px] rounded-full border border-primary/[0.06] opacity-40"
        style={{ transformStyle: "preserve-3d" }}
      />

      {/* Small rotating cube frame — bottom-left */}
      <motion.div
        animate={{ rotateX: -360, rotateZ: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-16 -left-16 h-32 w-32"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute inset-0 rounded-xl border border-violet-500/[0.08]" style={{ transform: "translateZ(40px)" }} />
        <div className="absolute inset-0 rounded-xl border border-violet-500/[0.05]" style={{ transform: "translateZ(-40px)" }} />
        <div className="absolute inset-0 rounded-xl border border-violet-500/[0.04]" style={{ transform: "rotateY(90deg) translateZ(40px)" }} />
        <div className="absolute inset-0 rounded-xl border border-violet-500/[0.03]" style={{ transform: "rotateY(90deg) translateZ(-40px)" }} />
      </motion.div>

      {/* Floating diamond — mid-left */}
      <motion.div
        animate={{ y: [-20, 20, -20], rotateZ: [0, 180, 360] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[10%] top-[30%] h-16 w-16"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="h-full w-full rotate-45 rounded-lg border border-emerald-500/[0.1] bg-emerald-500/[0.02]" />
      </motion.div>

      {/* Floating triangle wireframe — top-left */}
      <motion.div
        animate={{ rotateY: 360, y: [0, -15, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute left-[15%] top-[8%] opacity-30"
        style={{ transformStyle: "preserve-3d" }}
      >
        <svg width="80" height="70" viewBox="0 0 80 70" fill="none">
          <path d="M40 5L75 65H5L40 5Z" stroke="currentColor" strokeWidth="0.5" className="text-primary/40" />
          <path d="M40 15L65 60H15L40 15Z" stroke="currentColor" strokeWidth="0.3" className="text-primary/20" />
        </svg>
      </motion.div>

      {/* Orbiting dot — right side */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute right-[15%] top-[40%] h-40 w-40"
        style={{ transformStyle: "preserve-3d" }}
      >
        <motion.div
          className="absolute left-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-primary/20 shadow-[0_0_12px_rgba(139,92,246,0.3)]"
        />
        <div className="absolute inset-0 rounded-full border border-primary/[0.04]" />
      </motion.div>

      {/* Large slow-spinning ring — center-bottom */}
      <motion.div
        animate={{ rotateX: 75, rotateZ: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[5%] left-1/2 h-[300px] w-[300px] -translate-x-1/2"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute inset-0 rounded-full border border-white/[0.03]" />
        <div className="absolute inset-4 rounded-full border border-white/[0.02]" />
      </motion.div>

      {/* Floating dots — scattered */}
      {[
        { left: "70%", top: "15%", size: 3, delay: 0, dur: 12, color: "bg-cyan-400/20" },
        { left: "85%", top: "55%", size: 2, delay: 2, dur: 15, color: "bg-primary/15" },
        { left: "5%", top: "65%", size: 4, delay: 4, dur: 10, color: "bg-amber-400/15" },
        { left: "50%", top: "5%", size: 2, delay: 1, dur: 14, color: "bg-emerald-400/20" },
        { left: "30%", top: "80%", size: 3, delay: 3, dur: 11, color: "bg-blue-400/15" },
      ].map((dot, i) => (
        <motion.div
          key={i}
          animate={{ y: [-10, 10, -10], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: dot.dur, repeat: Infinity, ease: "easeInOut", delay: dot.delay }}
          className={`absolute rounded-full ${dot.color}`}
          style={{ left: dot.left, top: dot.top, width: dot.size, height: dot.size }}
        />
      ))}

      {/* Gradient overlays for depth fade */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
