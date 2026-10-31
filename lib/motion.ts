import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import { Flip } from "gsap/Flip";
import { Observer } from "gsap/Observer";
import { SplitText } from "gsap/SplitText";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

let isRegistered = false;

export function registerGSAPPlugins() {
  if (typeof window === "undefined" || isRegistered) return;
  
  gsap.registerPlugin(ScrollTrigger, CustomEase, Flip, Observer, SplitText, ScrollToPlugin);

  // Register Custom Eases
  try {
    CustomEase.create("apple-spring", "M0,0 C0.16, 1, 0.3, 1 1,1");
    CustomEase.create("snappy-micro", "M0,0 C0.2, 0, 0, 1 1,1");
    CustomEase.create("cinematic-expo", "M0,0 C0.22, 1, 0.36, 1 1,1");
  } catch {
    // Eases already registered or defined
  }

  isRegistered = true;
}

export const MOTION = {
  durations: {
    micro: 0.25,
    standard: 0.45,
    entrance: 0.85,
    flip: 0.9,
    portal: 0.8,
  },
  eases: {
    spring: "apple-spring",
    snappy: "snappy-micro",
    cinematic: "cinematic-expo",
    linear: "none",
  },
};

/**
 * Executes animation callback strictly within matchMedia reduced-motion condition.
 */
export function withReducedMotionCheck(
  activeAnimation: (mm: gsap.MatchMedia) => void,
  reducedAnimation?: (mm: gsap.MatchMedia) => void
) {
  if (typeof window === "undefined") return;
  registerGSAPPlugins();

  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    activeAnimation(mm);
  });

  if (reducedAnimation) {
    mm.add("(prefers-reduced-motion: reduce)", () => {
      reducedAnimation(mm);
    });
  }

  return mm;
}

