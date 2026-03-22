"use client";

import { useEffect, useRef } from "react";
import { useMotionValue, useSpring, useTransform, MotionValue } from "framer-motion";

/**
 * Tracks mouse position relative to a container element and returns
 * smoothed motion values for 3D parallax effects.
 *
 * Returns rotateX / rotateY (for tilting the whole scene toward the cursor)
 * and normalized x/y values (-1 to 1) for per-element offsets.
 */
export function useMouseParallax(containerRef: React.RefObject<HTMLElement | null>) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring for fluid feel
  const springConfig = { stiffness: 50, damping: 30, mass: 1 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Scene tilt: subtle rotation toward the mouse
  const rotateX = useTransform(smoothY, [-1, 1], [8, -8]);
  const rotateY = useTransform(smoothX, [-1, 1], [-8, 8]);

  // Per-layer parallax offsets (multiply by depth factor in components)
  const offsetX = useTransform(smoothX, [-1, 1], [-30, 30]);
  const offsetY = useTransform(smoothY, [-1, 1], [-30, 30]);

  // Deeper parallax for foreground elements
  const deepOffsetX = useTransform(smoothX, [-1, 1], [-50, 50]);
  const deepOffsetY = useTransform(smoothY, [-1, 1], [-50, 50]);

  // Subtle parallax for far background elements
  const shallowOffsetX = useTransform(smoothX, [-1, 1], [-12, 12]);
  const shallowOffsetY = useTransform(smoothY, [-1, 1], [-12, 12]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      // Normalize to -1 → 1
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      mouseX.set(nx);
      mouseY.set(ny);
    };

    const handleLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, [containerRef, mouseX, mouseY]);

  return {
    rotateX,
    rotateY,
    offsetX,
    offsetY,
    deepOffsetX,
    deepOffsetY,
    shallowOffsetX,
    shallowOffsetY,
    smoothX,
    smoothY,
  };
}

export type MouseParallax = ReturnType<typeof useMouseParallax>;
