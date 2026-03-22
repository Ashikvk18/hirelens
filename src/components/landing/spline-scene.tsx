"use client";

import { useEffect, useState, useRef } from "react";

/**
 * SplineScene — Lazy-loaded 3D hero visual for the landing page.
 *
 * SETUP INSTRUCTIONS:
 * 1. Install: npm install @splinetool/react-spline
 * 2. Create a Spline scene at https://app.spline.design that represents:
 *    - An abstract intelligence network / career graph
 *    - Floating interconnected data nodes with subtle glow
 *    - Purple/violet color scheme matching #7c3aed / #8b5cf6
 *    - Slowly rotating or pulsing to feel alive
 *    - Transparent background
 * 3. Publish the scene and get the public URL
 * 4. Replace the placeholder below with:
 *    import Spline from '@splinetool/react-spline';
 *    <Spline scene="YOUR_SPLINE_SCENE_URL" />
 *
 * For now, this renders a beautiful animated CSS fallback that looks premium
 * and can be swapped for real Spline with a single line change.
 */
export function SplineScene() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative h-full w-full"
      aria-hidden="true"
    >
      {visible && (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Animated orbital rings */}
          <div className="relative h-[320px] w-[320px] sm:h-[400px] sm:w-[400px] lg:h-[480px] lg:w-[480px]">
            {/* Core glow */}
            <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/40 blur-[40px] animate-glow-pulse" />
            <div className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80 blur-[2px]" />

            {/* Ring 1 — inner */}
            <div className="absolute inset-[15%] animate-spin-slow rounded-full border border-primary/20" style={{ animationDuration: '20s' }}>
              <div className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-primary shadow-lg shadow-primary/50" />
              <div className="absolute -bottom-1 right-[20%] h-2 w-2 rounded-full bg-accent/80 shadow-lg shadow-accent/40" />
            </div>

            {/* Ring 2 — mid */}
            <div className="absolute inset-[5%] animate-spin-slow rounded-full border border-accent/10" style={{ animationDuration: '30s', animationDirection: 'reverse' }}>
              <div className="absolute -right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-emerald-400/80 shadow-lg shadow-emerald-400/40" />
              <div className="absolute -left-1 top-[30%] h-2 w-2 rounded-full bg-primary/60 shadow-lg shadow-primary/30" />
              <div className="absolute bottom-[15%] -right-1 h-2.5 w-2.5 rounded-full bg-amber-400/70 shadow-lg shadow-amber-400/30" />
            </div>

            {/* Ring 3 — outer */}
            <div className="absolute inset-0 animate-spin-slow rounded-full border border-white/[0.04]" style={{ animationDuration: '40s' }}>
              <div className="absolute -top-1 left-[25%] h-2 w-2 rounded-full bg-blue-400/60 shadow-lg shadow-blue-400/30" />
              <div className="absolute -bottom-1.5 right-[30%] h-3 w-3 rounded-full bg-violet-400/70 shadow-lg shadow-violet-400/40" />
            </div>

            {/* Floating data nodes */}
            <div className="absolute left-[10%] top-[20%] animate-float">
              <div className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 backdrop-blur-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="text-[10px] text-white/50">Skills</span>
              </div>
            </div>

            <div className="absolute right-[5%] top-[35%] animate-float-delay">
              <div className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 backdrop-blur-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span className="text-[10px] text-white/50">Match</span>
              </div>
            </div>

            <div className="absolute bottom-[15%] left-[15%] animate-float-slow">
              <div className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 backdrop-blur-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                <span className="text-[10px] text-white/50">Jobs</span>
              </div>
            </div>

            {/* Connection lines (SVG) */}
            <svg className="absolute inset-0 h-full w-full opacity-20" viewBox="0 0 100 100">
              <line x1="50" y1="50" x2="20" y2="25" stroke="url(#line-grad)" strokeWidth="0.3" />
              <line x1="50" y1="50" x2="85" y2="40" stroke="url(#line-grad)" strokeWidth="0.3" />
              <line x1="50" y1="50" x2="25" y2="80" stroke="url(#line-grad)" strokeWidth="0.3" />
              <defs>
                <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
