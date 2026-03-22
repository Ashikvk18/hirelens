"use client";

import { motion } from "framer-motion";

/**
 * 3D orbital rings + glowing nodes background for the How It Works section.
 * Evokes a "processing / AI engine" feel with rotating orbital paths.
 */
export function HowItWorksBg() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ perspective: "1000px" }}>
      {/* Primary orbital ring — tilted, center */}
      <motion.div
        animate={{ rotateZ: 360 }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2"
        style={{ transformStyle: "preserve-3d", transform: "translate(-50%, -50%) rotateX(65deg)" }}
      >
        <div className="absolute inset-0 rounded-full border border-primary/[0.07]" />
        {/* Orbiting node */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
        >
          <div className="absolute left-0 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/30 shadow-[0_0_20px_rgba(139,92,246,0.4)]" />
        </motion.div>
      </motion.div>

      {/* Secondary orbital ring — smaller, opposite tilt */}
      <motion.div
        animate={{ rotateZ: -360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        className="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2"
        style={{ transformStyle: "preserve-3d", transform: "translate(-50%, -50%) rotateX(70deg) rotateY(20deg)" }}
      >
        <div className="absolute inset-0 rounded-full border border-cyan-400/[0.06]" />
        {/* Orbiting node */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
        >
          <div className="absolute right-0 top-1/2 h-2 w-2 translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/25 shadow-[0_0_14px_rgba(34,211,238,0.3)]" />
        </motion.div>
      </motion.div>

      {/* Tertiary ring — large, very subtle */}
      <motion.div
        animate={{ rotateZ: 360 }}
        transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
        className="absolute left-1/2 top-1/2 h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 opacity-40"
        style={{ transformStyle: "preserve-3d", transform: "translate(-50%, -50%) rotateX(75deg)" }}
      >
        <div className="absolute inset-0 rounded-full border border-white/[0.03]" />
      </motion.div>

      {/* Floating 3D cube wireframe — top-right */}
      <motion.div
        animate={{ rotateX: 360, rotateY: -360, rotateZ: 180 }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        className="absolute right-[8%] top-[10%] h-20 w-20 opacity-30"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute inset-0 rounded-lg border border-primary/[0.12]" style={{ transform: "translateZ(28px)" }} />
        <div className="absolute inset-0 rounded-lg border border-primary/[0.06]" style={{ transform: "translateZ(-28px)" }} />
        <div className="absolute inset-0 rounded-lg border border-primary/[0.04]" style={{ transform: "rotateY(90deg) translateZ(28px)" }} />
      </motion.div>

      {/* Floating octahedron shape — bottom-left */}
      <motion.div
        animate={{ y: [-12, 12, -12], rotateZ: [0, 90, 180, 270, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[12%] left-[8%] opacity-25"
        style={{ transformStyle: "preserve-3d" }}
      >
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <path d="M30 5L55 30L30 55L5 30L30 5Z" stroke="currentColor" strokeWidth="0.5" className="text-emerald-400/50" />
          <path d="M30 5L55 30L30 55L5 30L30 5Z" stroke="currentColor" strokeWidth="0.3" className="text-emerald-400/30" style={{ transform: "rotateX(90deg)", transformOrigin: "center" }} />
        </svg>
      </motion.div>

      {/* Connection lines between step positions */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        {/* Pulsing center glow */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="h-4 w-4 rounded-full bg-primary/20 shadow-[0_0_40px_rgba(139,92,246,0.2)]"
        />
      </motion.div>

      {/* Floating particles */}
      {[
        { left: "20%", top: "20%", size: 2, dur: 13, delay: 0, color: "bg-primary/15" },
        { left: "75%", top: "70%", size: 3, dur: 11, delay: 2, color: "bg-cyan-400/15" },
        { left: "60%", top: "15%", size: 2, dur: 14, delay: 1, color: "bg-amber-400/10" },
        { left: "35%", top: "75%", size: 2, dur: 12, delay: 3, color: "bg-emerald-400/15" },
        { left: "88%", top: "40%", size: 3, dur: 10, delay: 1.5, color: "bg-violet-400/10" },
        { left: "10%", top: "50%", size: 2, dur: 15, delay: 4, color: "bg-blue-400/15" },
      ].map((p, i) => (
        <motion.div
          key={i}
          animate={{ y: [-8, 8, -8], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: p.dur, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
          className={`absolute rounded-full ${p.color}`}
          style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
        />
      ))}

      {/* Depth fade edges */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
