/**
 * Shared motion variants and utilities for consistent animations across all pages.
 * Import these in any page/component for a unified motion language.
 */

// ── Reveal Variants ──

/** Fade + slide up with subtle blur (for headings, hero sections) */
export const blurUp = {
  initial: { opacity: 0, y: 20, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
};

/** Simple fade + slide up (for cards, sections) */
export const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

/** Fade in only (for backgrounds, overlays) */
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

/** Scale up from slightly smaller (for modals, badges) */
export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
};

/** Fade + slide from left */
export const fadeLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
};

/** Fade + slide from right */
export const fadeRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
};

// ── Shared ease curve ──
const ease4: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

// ── Scroll-triggered Variants (for whileInView) ──

/** Scroll reveal: fade + slide up */
export const scrollFadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: ease4 } },
};

/** Scroll reveal: fade + slide up with blur (premium feel) */
export const scrollBlurUp = {
  hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.55, ease: ease4 } },
};

/** Scroll reveal: scale in */
export const scrollScaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: ease4 } },
};

/** Scroll reveal: fade from left */
export const scrollFadeLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: ease4 } },
};

/** Scroll reveal: fade from right */
export const scrollFadeRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: ease4 } },
};

// ── Stagger Containers ──

/** Parent container that staggers children on viewport entry */
export const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
};

/** Fast stagger for lists with many items */
export const staggerContainerFast = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.04 },
  },
};

/** Scroll-triggered stagger container */
export const scrollStagger = (staggerDelay = 0.08, delayChildren = 0) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: staggerDelay, delayChildren },
  },
});

// ── Stagger Children ──

/** Child item: fade + slide up */
export const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

/** Child item: fade + slide up with blur */
export const staggerItemBlur = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.4 } },
};

/** Scroll-triggered stagger child: fade + slide up */
export const scrollStaggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: ease4 } },
};

/** Scroll-triggered stagger child: fade + slide up with blur */
export const scrollStaggerItemBlur = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.45, ease: ease4 } },
};

/** Scroll-triggered stagger child: scale in */
export const scrollStaggerItemScale = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: ease4 } },
};

// ── Transition Presets ──

export const springBounce = { type: "spring" as const, stiffness: 300, damping: 20 };
export const springGentle = { type: "spring" as const, stiffness: 200, damping: 25 };
export const easeSmooth = { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] };
export const easeSlow = { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] };

// ── Hover presets (for whileHover) ──

export const hoverLift = { y: -3, transition: { duration: 0.2 } };
export const hoverScale = { scale: 1.02, transition: { duration: 0.2 } };
export const hoverGlow = { y: -2, scale: 1.01, transition: { duration: 0.2 } };

// ── Viewport defaults ──

/** Standard viewport options for scroll-triggered animations */
export const viewportOnce = { once: true, margin: "-60px" as const };
export const viewportOnceEarly = { once: true, margin: "-30px" as const };
export const viewportOnceDeep = { once: true, margin: "-100px" as const };
