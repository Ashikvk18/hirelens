/**
 * Shared motion variants and utilities for consistent animations across internal pages.
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

// ── Transition Presets ──

export const springBounce = { type: "spring" as const, stiffness: 300, damping: 20 };
export const springGentle = { type: "spring" as const, stiffness: 200, damping: 25 };
export const easeSmooth = { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] };
export const easeSlow = { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] };

// ── Hover presets (for whileHover) ──

export const hoverLift = { y: -3, transition: { duration: 0.2 } };
export const hoverScale = { scale: 1.02, transition: { duration: 0.2 } };
export const hoverGlow = { y: -2, scale: 1.01, transition: { duration: 0.2 } };
