"use client";

import { useEffect, useState, useRef } from "react";

/**
 * HeroSpline — Reusable Spline 3D integration for the landing hero.
 *
 * ┌──────────────────────────────────────────────────────────┐
 * │  TO ACTIVATE REAL SPLINE 3D:                             │
 * │                                                          │
 * │  1. npm install @splinetool/react-spline                 │
 * │  2. Create/find a scene at https://app.spline.design     │
 * │     Suggested: abstract network graph, career pathway,   │
 * │     floating data nodes. Purple palette #7c3aed/#8b5cf6. │
 * │     Transparent background. Slowly rotating.             │
 * │  3. Publish → copy the public scene URL                  │
 * │  4. Pass it as: <HeroSpline sceneUrl="https://..." />    │
 * │                                                          │
 * │  The component will dynamically import the Spline viewer │
 * │  and render it. No sceneUrl = CSS fallback is shown.     │
 * └──────────────────────────────────────────────────────────┘
 */

interface HeroSplineProps {
  sceneUrl?: string;
}

export function HeroSpline({ sceneUrl }: HeroSplineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [SplineComponent, setSplineComponent] = useState<React.ComponentType<{ scene: string }> | null>(null);

  // Lazy visibility detection
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // NOTE: Spline dynamic import is disabled until the package is installed.
  // To enable:
  //   1. npm install @splinetool/react-spline
  //   2. Uncomment the useEffect below
  //
  // useEffect(() => {
  //   if (!sceneUrl || !inView) return;
  //   let cancelled = false;
  //   import("@splinetool/react-spline")
  //     .then((mod) => { if (!cancelled) setSplineComponent(() => mod.default); })
  //     .catch(() => {});
  //   return () => { cancelled = true; };
  // }, [sceneUrl, inView]);

  return (
    <div ref={containerRef} className="relative h-full w-full" aria-hidden="true">
      {/* Real Spline scene (if available) */}
      {SplineComponent && sceneUrl && (
        <div className="absolute inset-0">
          <SplineComponent scene={sceneUrl} />
        </div>
      )}

      {/* CSS fallback — always shown until Spline loads, or permanently if no sceneUrl */}
      {(!SplineComponent || !sceneUrl) && inView && <SplineFallback />}
    </div>
  );
}

/* ── Animated CSS Fallback ── */
function SplineFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative h-full w-full max-h-[520px] max-w-[520px]">

        {/* Ambient glow */}
        <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[80px]" />

        {/* Core */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="h-3 w-3 rounded-full bg-white/90 shadow-[0_0_20px_rgba(124,58,237,0.6)]" />
        </div>

        {/* Ring 1 */}
        <div
          className="absolute inset-[22%] rounded-full border border-primary/15 animate-spin-slow"
          style={{ animationDuration: "25s" }}
        >
          <div className="absolute -top-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-primary shadow-md shadow-primary/50" />
          <div className="absolute -bottom-0.5 right-[25%] h-1.5 w-1.5 rounded-full bg-accent/70" />
        </div>

        {/* Ring 2 */}
        <div
          className="absolute inset-[10%] rounded-full border border-white/[0.06] animate-spin-slow"
          style={{ animationDuration: "35s", animationDirection: "reverse" }}
        >
          <div className="absolute -right-1 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-emerald-400/70 shadow-md shadow-emerald-400/30" />
          <div className="absolute -left-0.5 top-[30%] h-1.5 w-1.5 rounded-full bg-primary/50" />
          <div className="absolute bottom-[20%] -right-0.5 h-2 w-2 rounded-full bg-amber-400/60 shadow-md shadow-amber-400/25" />
        </div>

        {/* Ring 3 */}
        <div
          className="absolute inset-0 rounded-full border border-white/[0.03] animate-spin-slow"
          style={{ animationDuration: "45s" }}
        >
          <div className="absolute -top-0.5 left-[30%] h-1.5 w-1.5 rounded-full bg-blue-400/50" />
          <div className="absolute -bottom-1 right-[25%] h-2.5 w-2.5 rounded-full bg-violet-400/60 shadow-md shadow-violet-400/30" />
        </div>

        {/* Floating labels */}
        <div className="absolute left-[5%] top-[18%] animate-float">
          <div className="flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] px-2.5 py-1 backdrop-blur-sm">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="text-[9px] font-medium text-white/40">Skills</span>
          </div>
        </div>
        <div className="absolute right-[3%] top-[38%] animate-float-delay">
          <div className="flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] px-2.5 py-1 backdrop-blur-sm">
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-[9px] font-medium text-white/40">Match</span>
          </div>
        </div>
        <div className="absolute bottom-[12%] left-[12%] animate-float-slow">
          <div className="flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] px-2.5 py-1 backdrop-blur-sm">
            <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            <span className="text-[9px] font-medium text-white/40">Jobs</span>
          </div>
        </div>

        {/* Connection lines */}
        <svg className="absolute inset-0 h-full w-full opacity-[0.12]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
          <line x1="50" y1="50" x2="15" y2="22" stroke="url(#lg)" strokeWidth="0.25" />
          <line x1="50" y1="50" x2="88" y2="42" stroke="url(#lg)" strokeWidth="0.25" />
          <line x1="50" y1="50" x2="22" y2="82" stroke="url(#lg)" strokeWidth="0.25" />
          <line x1="50" y1="50" x2="75" y2="18" stroke="url(#lg)" strokeWidth="0.2" />
          <line x1="50" y1="50" x2="80" y2="78" stroke="url(#lg)" strokeWidth="0.2" />
          <defs>
            <linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
