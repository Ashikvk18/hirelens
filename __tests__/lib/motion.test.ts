import {
  blurUp,
  fadeUp,
  fadeIn,
  scaleIn,
  fadeLeft,
  fadeRight,
  scrollFadeUp,
  scrollBlurUp,
  scrollScaleIn,
  scrollFadeLeft,
  scrollFadeRight,
  staggerContainer,
  staggerContainerFast,
  scrollStagger,
  staggerItem,
  staggerItemBlur,
  scrollStaggerItem,
  scrollStaggerItemBlur,
  scrollStaggerItemScale,
  springBounce,
  springGentle,
  easeSmooth,
  easeSlow,
  hoverLift,
  hoverScale,
  hoverGlow,
  viewportOnce,
  viewportOnceEarly,
  viewportOnceDeep,
} from "@/lib/motion";

describe("Motion Variants", () => {
  describe("Reveal Variants", () => {
    it("blurUp has correct initial and animate states", () => {
      expect(blurUp.initial).toHaveProperty("opacity", 0);
      expect(blurUp.initial).toHaveProperty("y", 20);
      expect(blurUp.initial).toHaveProperty("filter");
      expect(blurUp.animate).toHaveProperty("opacity", 1);
      expect(blurUp.animate).toHaveProperty("y", 0);
    });

    it("fadeUp has correct initial and animate states", () => {
      expect(fadeUp.initial.opacity).toBe(0);
      expect(fadeUp.initial.y).toBe(16);
      expect(fadeUp.animate.opacity).toBe(1);
      expect(fadeUp.animate.y).toBe(0);
    });

    it("fadeIn only affects opacity", () => {
      expect(fadeIn.initial).toEqual({ opacity: 0 });
      expect(fadeIn.animate).toEqual({ opacity: 1 });
    });

    it("scaleIn starts scaled down", () => {
      expect(scaleIn.initial.scale).toBe(0.95);
      expect(scaleIn.animate.scale).toBe(1);
    });

    it("fadeLeft slides from negative x", () => {
      expect(fadeLeft.initial.x).toBeLessThan(0);
      expect(fadeLeft.animate.x).toBe(0);
    });

    it("fadeRight slides from positive x", () => {
      expect(fadeRight.initial.x).toBeGreaterThan(0);
      expect(fadeRight.animate.x).toBe(0);
    });
  });

  describe("Scroll-triggered Variants", () => {
    it("scrollFadeUp has hidden and visible states", () => {
      expect(scrollFadeUp).toHaveProperty("hidden");
      expect(scrollFadeUp).toHaveProperty("visible");
      expect(scrollFadeUp.hidden.opacity).toBe(0);
      expect(scrollFadeUp.visible.opacity).toBe(1);
    });

    it("scrollBlurUp includes blur filter", () => {
      expect(scrollBlurUp.hidden.filter).toContain("blur");
      expect(scrollBlurUp.visible.filter).toBe("blur(0px)");
    });

    it("scrollScaleIn starts smaller", () => {
      expect(scrollScaleIn.hidden.scale).toBeLessThan(1);
      expect(scrollScaleIn.visible.scale).toBe(1);
    });

    it("scrollFadeLeft/Right have opposite x directions", () => {
      expect(scrollFadeLeft.hidden.x).toBeLessThan(0);
      expect(scrollFadeRight.hidden.x).toBeGreaterThan(0);
    });
  });

  describe("Stagger Containers", () => {
    it("staggerContainer has staggerChildren", () => {
      expect(staggerContainer.show.transition.staggerChildren).toBeGreaterThan(0);
    });

    it("staggerContainerFast has shorter stagger than regular", () => {
      expect(staggerContainerFast.show.transition.staggerChildren).toBeLessThan(
        staggerContainer.show.transition.staggerChildren
      );
    });

    it("scrollStagger returns a function with configurable delay", () => {
      const result = scrollStagger(0.1, 0.2);
      expect(result.visible.transition.staggerChildren).toBe(0.1);
      expect(result.visible.transition.delayChildren).toBe(0.2);
    });

    it("scrollStagger uses default values", () => {
      const result = scrollStagger();
      expect(result.visible.transition.staggerChildren).toBe(0.08);
      expect(result.visible.transition.delayChildren).toBe(0);
    });
  });

  describe("Stagger Children", () => {
    it("staggerItem animates from hidden to visible", () => {
      expect(staggerItem.hidden.opacity).toBe(0);
      expect(staggerItem.show.opacity).toBe(1);
    });

    it("staggerItemBlur includes blur", () => {
      expect(staggerItemBlur.hidden.filter).toContain("blur");
    });

    it("scrollStaggerItem has hidden and visible states", () => {
      expect(scrollStaggerItem.hidden.opacity).toBe(0);
      expect(scrollStaggerItem.visible.opacity).toBe(1);
    });

    it("scrollStaggerItemBlur includes blur transition", () => {
      expect(scrollStaggerItemBlur.hidden.filter).toContain("blur");
      expect(scrollStaggerItemBlur.visible.filter).toBe("blur(0px)");
    });

    it("scrollStaggerItemScale starts scaled down", () => {
      expect(scrollStaggerItemScale.hidden.scale).toBeLessThan(1);
      expect(scrollStaggerItemScale.visible.scale).toBe(1);
    });
  });

  describe("Transition Presets", () => {
    it("springBounce has correct spring config", () => {
      expect(springBounce.type).toBe("spring");
      expect(springBounce.stiffness).toBe(300);
      expect(springBounce.damping).toBe(20);
    });

    it("springGentle has lower stiffness than bounce", () => {
      expect(springGentle.stiffness).toBeLessThan(springBounce.stiffness);
    });

    it("easeSmooth has a duration", () => {
      expect(easeSmooth.duration).toBe(0.4);
      expect(easeSmooth.ease).toHaveLength(4);
    });

    it("easeSlow is slower than easeSmooth", () => {
      expect(easeSlow.duration).toBeGreaterThan(easeSmooth.duration);
    });
  });

  describe("Hover Presets", () => {
    it("hoverLift moves element up", () => {
      expect(hoverLift.y).toBeLessThan(0);
    });

    it("hoverScale increases size", () => {
      expect(hoverScale.scale).toBeGreaterThan(1);
    });

    it("hoverGlow combines lift and scale", () => {
      expect(hoverGlow.y).toBeLessThan(0);
      expect(hoverGlow.scale).toBeGreaterThan(1);
    });
  });

  describe("Viewport Defaults", () => {
    it("all viewport configs have once: true", () => {
      expect(viewportOnce.once).toBe(true);
      expect(viewportOnceEarly.once).toBe(true);
      expect(viewportOnceDeep.once).toBe(true);
    });

    it("viewport margins are in correct order (early < default < deep)", () => {
      const parseMargin = (m: string) => Math.abs(parseInt(m));
      expect(parseMargin(viewportOnceEarly.margin)).toBeLessThan(
        parseMargin(viewportOnce.margin)
      );
      expect(parseMargin(viewportOnce.margin)).toBeLessThan(
        parseMargin(viewportOnceDeep.margin)
      );
    });
  });
});
