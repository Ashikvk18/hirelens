"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";

/**
 * HeroSpline — Reusable Spline 3D component for the landing hero.
 *
 * Usage:
 *   <HeroSpline sceneUrl="https://prod.spline.design/YOUR_SCENE/scene.splinecode" />
 *
 * If no sceneUrl is passed, a lightweight animated CSS fallback is shown.
 * The Spline viewer is loaded via next/dynamic (code-split, SSR disabled).
 * If Spline fails to load, the skeleton stays visible — layout is never broken.
 */

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => <SplineSkeleton />,
});

interface HeroSplineProps {
  sceneUrl?: string;
}

export function HeroSpline({ sceneUrl }: HeroSplineProps) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  const onSplineLoad = useCallback(() => setLoaded(true), []);
  const onSplineError = useCallback(() => setErrored(true), []);

  const showFallback = !sceneUrl || errored;
  const showSkeleton = sceneUrl && !loaded && !errored;

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl" aria-hidden="true">
      {/* ── Layered glow background ── */}
      <div className="pointer-events-none absolute -inset-4 z-0">
        <div className="absolute inset-0 rounded-3xl bg-primary/[0.06] blur-[50px]" />
        <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[60px]" />
      </div>

      {/* ── Container ── */}
      <div className="relative z-10 h-full w-full rounded-2xl border border-white/[0.04] bg-white/[0.01] backdrop-blur-sm">
        {/* Real Spline scene */}
        {sceneUrl && !errored && (
          <div className={`absolute inset-0 transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"}`}>
            <Spline
              scene={sceneUrl}
              onLoad={onSplineLoad}
              onError={onSplineError}
            />
          </div>
        )}

        {/* Loading skeleton — visible while Spline loads */}
        {showSkeleton && <SplineSkeleton />}

        {/* CSS fallback — shown if no URL or load error */}
        {showFallback && <SplineFallback />}
      </div>
    </div>
  );
}

/* ── Loading Skeleton ── */
function SplineSkeleton() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative h-3/4 w-3/4">
        {/* Pulsing core */}
        <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-[30px] animate-glow-pulse" />
        <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/50" />

        {/* Shimmer ring */}
        <div className="absolute inset-[15%] rounded-full border border-white/[0.04] animate-spin-slow" style={{ animationDuration: "20s" }}>
          <div className="absolute -top-0.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-primary/40" />
        </div>
        <div className="absolute inset-[5%] rounded-full border border-white/[0.02] animate-spin-slow" style={{ animationDuration: "30s", animationDirection: "reverse" }}>
          <div className="absolute -right-0.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-accent/30" />
        </div>

        {/* Shimmer bar */}
        <div className="absolute bottom-4 left-1/2 h-1 w-20 -translate-x-1/2 rounded-full bg-white/[0.03] overflow-hidden">
          <div className="h-full w-full animate-shimmer" />
        </div>
      </div>
    </div>
  );
}

/* ── Animated CSS Fallback ── */
function SplineFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative h-full w-full">

        {/* Ambient glow */}
        <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[70px]" />

        {/* Core */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="h-3 w-3 rounded-full bg-white/80 shadow-[0_0_20px_rgba(124,58,237,0.5)]" />
        </div>

        {/* Ring 1 — inner */}
        <div className="absolute inset-[22%] rounded-full border border-primary/15 animate-spin-slow" style={{ animationDuration: "25s" }}>
          <div className="absolute -top-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-primary shadow-md shadow-primary/40" />
          <div className="absolute -bottom-0.5 right-[25%] h-1.5 w-1.5 rounded-full bg-accent/60" />
        </div>

        {/* Ring 2 — mid */}
        <div className="absolute inset-[10%] rounded-full border border-white/[0.05] animate-spin-slow" style={{ animationDuration: "35s", animationDirection: "reverse" }}>
          <div className="absolute -right-1 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-emerald-400/60 shadow-md shadow-emerald-400/25" />
          <div className="absolute -left-0.5 top-[30%] h-1.5 w-1.5 rounded-full bg-primary/40" />
          <div className="absolute bottom-[20%] -right-0.5 h-2 w-2 rounded-full bg-amber-400/50 shadow-md shadow-amber-400/20" />
        </div>

        {/* Ring 3 — outer */}
        <div className="absolute inset-[2%] rounded-full border border-white/[0.03] animate-spin-slow" style={{ animationDuration: "45s" }}>
          <div className="absolute -top-0.5 left-[30%] h-1.5 w-1.5 rounded-full bg-blue-400/40" />
          <div className="absolute -bottom-1 right-[25%] h-2 w-2 rounded-full bg-violet-400/50 shadow-md shadow-violet-400/25" />
        </div>

        {/* Floating labels */}
        <div className="absolute left-[6%] top-[20%] animate-float">
          <div className="flex items-center gap-1.5 rounded-full border border-white/[0.05] bg-white/[0.02] px-2 py-0.5 backdrop-blur-sm">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="text-[8px] font-medium text-white/35">Skills</span>
          </div>
        </div>
        <div className="absolute right-[4%] top-[40%] animate-float-delay">
          <div className="flex items-center gap-1.5 rounded-full border border-white/[0.05] bg-white/[0.02] px-2 py-0.5 backdrop-blur-sm">
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-[8px] font-medium text-white/35">Match</span>
          </div>
        </div>
        <div className="absolute bottom-[14%] left-[14%] animate-float-slow">
          <div className="flex items-center gap-1.5 rounded-full border border-white/[0.05] bg-white/[0.02] px-2 py-0.5 backdrop-blur-sm">
            <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            <span className="text-[8px] font-medium text-white/35">Jobs</span>
          </div>
        </div>

        {/* Connection lines */}
        <svg className="absolute inset-0 h-full w-full opacity-[0.08]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
          <line x1="50" y1="50" x2="16" y2="24" stroke="url(#hero-lg)" strokeWidth="0.2" />
          <line x1="50" y1="50" x2="86" y2="44" stroke="url(#hero-lg)" strokeWidth="0.2" />
          <line x1="50" y1="50" x2="24" y2="80" stroke="url(#hero-lg)" strokeWidth="0.2" />
          <line x1="50" y1="50" x2="78" y2="20" stroke="url(#hero-lg)" strokeWidth="0.15" />
          <line x1="50" y1="50" x2="76" y2="76" stroke="url(#hero-lg)" strokeWidth="0.15" />
          <defs>
            <linearGradient id="hero-lg" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
