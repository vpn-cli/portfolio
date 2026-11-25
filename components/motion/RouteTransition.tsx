"use client";

import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useLenisInstance, LENIS_EXPO_EASING } from "./SmoothScrollProvider";
import { siteConfig } from "@/content/site";
import {
  trackEvent,
  OutboundDestination,
  getReferrerDomain,
  getOutboundDestination,
} from "@/lib/analytics";

const LENIS_CURVE = "cubic-bezier(0.16, 1, 0.3, 1)";
export const MIN_VISIBLE: number = 0.48;

const isDebugEnabled = () => {
  if (typeof window === "undefined") return false;
  return process.env.NODE_ENV !== "production" || Boolean((window as any).__debugTransitions);
};

interface TransitionContextType {
  navigateWithWipe: (href: string) => void;
  prefetch: (href: string) => void;
  isPending: boolean;
  previousPath: string | null;
  getPreviousPath: () => string | null;
}

const TransitionContext = createContext<TransitionContextType>({
  navigateWithWipe: () => {},
  prefetch: () => {},
  isPending: false,
  previousPath: null,
  getPreviousPath: () => null,
});

export const usePageTransition = () => useContext(TransitionContext);

const normalizePath = (path: string) => {
  const clean = path.split("?")[0].split("#")[0];
  if (clean.length > 1 && clean.endsWith("/")) {
    return clean.slice(0, -1);
  }
  return clean;
};

export function getRouteLabel(path: string): string {
  const clean = normalizePath(path);
  if (clean === "" || clean === "/") return "Home";
  if (clean === "/about") return "About";
  if (clean === "/projects") return "Projects";
  if (clean === "/work") return "Work";
  if (clean === "/resources") return "Resources";

  if (clean.startsWith("/work/")) {
    const slug = clean.slice("/work/".length);
    const project = siteConfig.projects.find((p) => p.slug === slug);
    if (project?.title) return project.title;
  }

  return "Loading";
}

function animateVisiblePageReveals(
  revealAnimationsRef: React.MutableRefObject<Animation[]>,
  durationMs = 780
) {
  const allReveals = Array.from(document.querySelectorAll<HTMLElement>("main [data-reveal]"));
  const windowH = window.innerHeight;
  const rects = allReveals.map((el) => ({
    el,
    top: el.getBoundingClientRect().top,
    order: el.getAttribute("data-reveal-order"),
  }));

  const visible = rects.filter((item) => item.top < windowH);

  visible.sort((a, b) => {
    if (a.order !== null && b.order !== null) {
      return parseFloat(a.order) - parseFloat(b.order);
    }
    if (a.order !== null) return -1;
    if (b.order !== null) return 1;
    return 0;
  });

  const toAnimate = visible.slice(0, 8);

  revealAnimationsRef.current.forEach((anim) => {
    try {
      anim.cancel();
    } catch {}
  });
  revealAnimationsRef.current = [];

  toAnimate.forEach((item, i) => {
    const anim = item.el.animate(
      [
        { opacity: 0, transform: "translate3d(0, 20px, 0)" },
        { opacity: 1, transform: "translate3d(0, 0, 0)" },
      ],
      {
        duration: durationMs,
        delay: 40 + i * 55,
        easing: LENIS_CURVE,
        fill: "backwards",
      }
    );
    revealAnimationsRef.current.push(anim);
  });
}

export function RouteTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [previousPath, setPreviousPath] = useState<string | null>(null);
  const currentPathRef = useRef<string>(pathname);
  const previousPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (currentPathRef.current !== pathname) {
      const prev = currentPathRef.current;
      previousPathRef.current = prev;
      setPreviousPath(prev);
      currentPathRef.current = pathname;
    }
  }, [pathname]);

  const [isPending, startTransition] = useTransition();
  const { lenis } = useLenisInstance();
  const lenisRef = useRef(lenis);

  useEffect(() => {
    lenisRef.current = lenis;
  }, [lenis]);

  // Initial load curtain refs
  const initOverlayRef = useRef<HTMLDivElement>(null);
  const initInnerRef = useRef<HTMLDivElement>(null);
  const initTitleRef = useRef<HTMLSpanElement>(null);
  const initSubRef = useRef<HTMLSpanElement>(null);
  const initFillRef = useRef<HTMLDivElement>(null);
  const initPctRef = useRef<HTMLSpanElement>(null);
  const initAnimationsRef = useRef<Animation[]>([]);
  const initRafRef = useRef<number | null>(null);
  const initDoneRef = useRef(false);

  // Route transition wipe refs
  const overlayRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  const isTransitioningRef = useRef(false);
  const targetPathRef = useRef<string | null>(null);
  const targetHashRef = useRef<string | null>(null);
  const wipeInDoneRef = useRef(false);
  const routeCommittedRef = useRef(false);
  const wipeOutStartedRef = useRef(false);
  const navStartRef = useRef<number>(0);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const minVisibleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const wipeInAnimationRef = useRef<Animation | null>(null);
  const innerAnimationRef = useRef<Animation | null>(null);
  const labelAnimationRef = useRef<Animation | null>(null);
  const fillAnimationRef = useRef<Animation | null>(null);
  const trackAnimationRef = useRef<Animation | null>(null);
  const wipeOutAnimationRef = useRef<Animation | null>(null);
  const wipeOutInnerAnimationRef = useRef<Animation | null>(null);
  const revealAnimationsRef = useRef<Animation[]>([]);

  const marksRef = useRef<{ name: string; time: number }[]>([]);

  const cancelInitialLoader = () => {
    initDoneRef.current = true;
    if (initRafRef.current !== null) {
      cancelAnimationFrame(initRafRef.current);
      initRafRef.current = null;
    }
    initAnimationsRef.current.forEach((a) => {
      try {
        a.cancel();
      } catch {}
    });
    initAnimationsRef.current = [];
    if (initOverlayRef.current) {
      initOverlayRef.current.style.display = "none";
      initOverlayRef.current.style.willChange = "";
    }
    if (initInnerRef.current) {
      initInnerRef.current.style.willChange = "";
    }
  };

  // Initial page-load animation with smooth Lenis-like exponential glide
  useLayoutEffect(() => {
    const overlay = initOverlayRef.current;
    const inner = initInnerRef.current;
    const titleEl = initTitleRef.current;
    const subEl = initSubRef.current;
    const fillEl = initFillRef.current;
    const pctEl = initPctRef.current;

    if (!overlay || !inner) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      cancelInitialLoader();
      return;
    }

    let cancelled = false;
    const routeText = getRouteLabel(pathname);
    if (subEl) {
      subEl.textContent = routeText === "Home" ? "Portfolio" : routeText;
    }

    overlay.style.willChange = "transform";
    inner.style.willChange = "transform, opacity";

    if (lenisRef.current) {
      lenisRef.current.stop();
    }

    // Keep wordmark immediately legible on first paint with a subtle settle
    if (titleEl) {
      const titleAnim = titleEl.animate(
        [
          { transform: "translate3d(0, 10px, 0)", opacity: 0.92 },
          { transform: "translate3d(0, 0, 0)", opacity: 1 },
        ],
        { duration: 480, easing: LENIS_CURVE, fill: "forwards" }
      );
      initAnimationsRef.current.push(titleAnim);
    }

    if (subEl) {
      const subAnim = subEl.animate(
        [
          { transform: "translate3d(0, 8px, 0)", opacity: 0.85 },
          { transform: "translate3d(0, 0, 0)", opacity: 1 },
        ],
        { duration: 480, easing: LENIS_CURVE, fill: "forwards" }
      );
      initAnimationsRef.current.push(subAnim);
    }

    // Progress hairline + tabular percentage anchored to first visual rAF frame
    const FILL_DURATION = 580;
    let startTime: number | null = null;
    let progressFinished = false;

    const stepProgress = (now: number) => {
      if (cancelled || initDoneRef.current) return;
      if (startTime === null) {
        startTime = now;
      }
      const rawT = Math.min(1, (now - startTime) / FILL_DURATION);
      const eased = LENIS_EXPO_EASING(rawT);

      if (fillEl) {
        fillEl.style.transform = `scaleX(${eased})`;
      }
      if (pctEl) {
        pctEl.textContent = `${Math.round(eased * 100)}%`;
      }

      if (rawT < 1) {
        initRafRef.current = requestAnimationFrame(stepProgress);
      } else if (!progressFinished) {
        progressFinished = true;
        initRafRef.current = null;
        onProgressComplete();
      }
    };

    const fontsReady =
      typeof document !== "undefined" && "fonts" in document
        ? Promise.race([
            document.fonts.ready.then(() => undefined),
            new Promise<void>((resolve) => setTimeout(resolve, 640)),
          ])
        : Promise.resolve();

    const onProgressComplete = () => {
      fontsReady.then(launchExitGlide);
    };

    initRafRef.current = requestAnimationFrame(stepProgress);

    const launchExitGlide = () => {
      if (cancelled || initDoneRef.current) return;
      initDoneRef.current = true;

      if (fillEl) fillEl.style.transform = "scaleX(1)";
      if (pctEl) pctEl.textContent = "100%";

      // Allow scrolling & clicking immediately as the curtain glides away
      overlay.style.pointerEvents = "none";
      if (lenisRef.current) {
        lenisRef.current.start();
      }

      requestAnimationFrame(() => {
        if (cancelled) return;

        animateVisiblePageReveals(revealAnimationsRef, 820);

        const outerExit = overlay.animate(
          [
            { transform: "translate3d(0, 0, 0)" },
            { transform: "translate3d(0, -100%, 0)" },
          ],
          { duration: 740, easing: LENIS_CURVE, fill: "forwards" }
        );
        initAnimationsRef.current.push(outerExit);

        const innerExit = inner.animate(
          [
            { transform: "translate3d(0, 0, 0)", opacity: 1 },
            { transform: "translate3d(0, 28%, 0)", opacity: 0 },
          ],
          { duration: 600, easing: LENIS_CURVE, fill: "forwards" }
        );
        initAnimationsRef.current.push(innerExit);

        outerExit.finished
          .then(() => {
            if (!cancelled) {
              cancelInitialLoader();
            }
          })
          .catch(() => {});
      });
    };

    const safetyHide = setTimeout(() => {
      if (!cancelled) {
        cancelInitialLoader();
        if (lenisRef.current) lenisRef.current.start();
      }
    }, 1850);

    return () => {
      cancelled = true;
      clearTimeout(safetyHide);
      if (initRafRef.current !== null) {
        cancelAnimationFrame(initRafRef.current);
        initRafRef.current = null;
      }
      if (!initDoneRef.current) {
        initAnimationsRef.current.forEach((a) => {
          try {
            a.cancel();
          } catch {}
        });
        initAnimationsRef.current = [];
      }
    };
    // Run once on initial mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const markTransition = (name: string) => {
    try {
      performance.mark(name);
    } catch {}
    marksRef.current.push({ name, time: performance.now() });
    if (isDebugEnabled()) {
      console.log(
        `[RouteTransition Mark] ${name} (+${(performance.now() - navStartRef.current).toFixed(1)}ms)`
      );
    }
  };

  const logTransitionTable = () => {
    if (!isDebugEnabled()) return;
    const marks = marksRef.current;
    if (marks.length === 0) return;
    const rows: { Step: string; "Duration (ms)": number; "Cumulative (ms)": number }[] = [];
    for (let i = 1; i < marks.length; i++) {
      const prev = marks[i - 1];
      const curr = marks[i];
      rows.push({
        Step: `${prev.name} -> ${curr.name}`,
        "Duration (ms)": Number((curr.time - prev.time).toFixed(2)),
        "Cumulative (ms)": Number((curr.time - marks[0].time).toFixed(2)),
      });
    }
    console.table(rows);
    if (typeof window !== "undefined") {
      (window as any).__lastTransitionTable = rows;
      (window as any).__allTransitionTables = (window as any).__allTransitionTables || [];
      (window as any).__allTransitionTables.push(rows);
    }
  };

  const cancelCurtainAnimations = () => {
    const refs = [
      wipeInAnimationRef,
      innerAnimationRef,
      labelAnimationRef,
      fillAnimationRef,
      trackAnimationRef,
      wipeOutAnimationRef,
      wipeOutInnerAnimationRef,
    ];
    for (const ref of refs) {
      if (ref.current) {
        try {
          ref.current.cancel();
        } catch {}
        ref.current = null;
      }
    }
  };

  const resetState = (interrupted = false) => {
    isTransitioningRef.current = false;
    if (typeof window !== "undefined") {
      (window as any).__isTransitioning = false;
    }
    targetPathRef.current = null;
    targetHashRef.current = null;
    wipeInDoneRef.current = false;
    routeCommittedRef.current = false;
    wipeOutStartedRef.current = false;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (minVisibleTimeoutRef.current) {
      clearTimeout(minVisibleTimeoutRef.current);
      minVisibleTimeoutRef.current = null;
    }

    cancelCurtainAnimations();

    if (interrupted) {
      revealAnimationsRef.current.forEach((anim) => {
        try {
          anim.cancel();
        } catch {}
      });
      revealAnimationsRef.current = [];
    }

    if (overlayRef.current) {
      overlayRef.current.style.display = "none";
      overlayRef.current.style.pointerEvents = "auto";
      overlayRef.current.style.willChange = "";
      overlayRef.current.style.transform = "translate3d(0, -100%, 0)";
    }
    if (innerRef.current) {
      innerRef.current.style.willChange = "";
      innerRef.current.style.transform = "translate3d(0, 40%, 0)";
    }
    if (labelRef.current) {
      labelRef.current.style.transform = "translate3d(0, 100%, 0)";
      labelRef.current.style.opacity = "1";
    }
    if (fillRef.current) {
      fillRef.current.style.transform = "scaleX(0)";
    }
    if (trackRef.current) {
      trackRef.current.style.opacity = "1";
    }

    if (lenisRef.current) {
      lenisRef.current.start();
    }
  };

  const prefetch = (href: string) => {
    if (!href.startsWith("http") && !href.startsWith("mailto:") && !href.startsWith("#")) {
      router.prefetch(href);
    }
  };

  const completeWipeOut = () => {
    if (wipeOutStartedRef.current) return;
    wipeOutStartedRef.current = true;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (minVisibleTimeoutRef.current) {
      clearTimeout(minVisibleTimeoutRef.current);
      minVisibleTimeoutRef.current = null;
    }

    const overlay = overlayRef.current;
    const inner = innerRef.current;
    const label = labelRef.current;
    const track = trackRef.current;

    if (!overlay || !inner) {
      resetState(true);
      return;
    }

    requestAnimationFrame(() => {
      markTransition("wipe-out start");

      const activeLenis = lenisRef.current;
      const targetHash = targetHashRef.current;
      const targetElement = targetHash ? document.getElementById(targetHash) : null;

      if (targetElement) {
        if (activeLenis) {
          activeLenis.scrollTo(targetElement, { immediate: true, force: true, offset: -24 });
        } else {
          window.scrollTo({
            top: targetElement.getBoundingClientRect().top + window.scrollY - 24,
            behavior: "instant",
          });
        }
      } else {
        if (activeLenis) {
          activeLenis.scrollTo(0, { immediate: true, force: true });
        } else {
          window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        }
      }

      // Reveal incoming content smoothly with Lenis curve
      animateVisiblePageReveals(revealAnimationsRef, 760);

      // Allow immediate interaction as curtain glides out
      overlay.style.pointerEvents = "none";

      const outerOut = overlay.animate(
        [
          { transform: "translate3d(0, 0, 0)" },
          { transform: "translate3d(0, 100%, 0)" },
        ],
        {
          duration: 620,
          easing: LENIS_CURVE,
          fill: "forwards",
        }
      );
      wipeOutAnimationRef.current = outerOut;

      const innerOut = inner.animate(
        [
          { transform: "translate3d(0, 0, 0)" },
          { transform: "translate3d(0, -32%, 0)" },
        ],
        {
          duration: 620,
          easing: LENIS_CURVE,
          fill: "forwards",
        }
      );
      wipeOutInnerAnimationRef.current = innerOut;

      if (label) {
        labelAnimationRef.current = label.animate(
          [
            { transform: "translate3d(0, 0, 0)", opacity: 1 },
            { transform: "translate3d(0, -100%, 0)", opacity: 0 },
          ],
          {
            duration: 380,
            easing: LENIS_CURVE,
            fill: "forwards",
          }
        );
      }

      if (track) {
        trackAnimationRef.current = track.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: 340,
          easing: LENIS_CURVE,
          fill: "forwards",
        });
      }

      outerOut.finished
        .then(() => {
          markTransition("wipe-out end");
          logTransitionTable();

          if (overlayRef.current) {
            overlayRef.current.style.display = "none";
            overlayRef.current.style.willChange = "";
          }
          if (innerRef.current) {
            innerRef.current.style.willChange = "";
          }

          cancelCurtainAnimations();

          if (lenisRef.current) {
            lenisRef.current.start();
          }

          resetState(false);
        })
        .catch(() => {});
    });
  };

  const checkTriggerWipeOut = () => {
    if (wipeOutStartedRef.current) return;
    if (!routeCommittedRef.current || !wipeInDoneRef.current) return;

    const currentMinVisible =
      typeof window !== "undefined" && typeof (window as any).__MIN_VISIBLE === "number"
        ? (window as any).__MIN_VISIBLE
        : MIN_VISIBLE;

    const elapsed = (performance.now() - navStartRef.current) / 1000;
    const remaining = Math.max(0, currentMinVisible - elapsed);

    if (remaining <= 0 || currentMinVisible === 0) {
      markTransition("MIN_VISIBLE elapsed");
      completeWipeOut();
    } else {
      if (minVisibleTimeoutRef.current) clearTimeout(minVisibleTimeoutRef.current);
      minVisibleTimeoutRef.current = setTimeout(() => {
        if (!isTransitioningRef.current || wipeOutStartedRef.current) return;
        markTransition("MIN_VISIBLE elapsed");
        completeWipeOut();
      }, remaining * 1000);
    }
  };

  useEffect(() => {
    if (!isTransitioningRef.current) return;

    const currentNormalized = normalizePath(pathname);
    if (isDebugEnabled()) {
      console.log(
        `[pathname effect] pathname=${pathname}, target=${targetPathRef.current}, routeCommitted=${routeCommittedRef.current}`
      );
    }
    if (targetPathRef.current && currentNormalized === targetPathRef.current) {
      markTransition("pathname committed");
      routeCommittedRef.current = true;

      if (fillRef.current && fillAnimationRef.current) {
        try {
          fillAnimationRef.current.commitStyles();
        } catch {}
        fillAnimationRef.current.cancel();
        fillAnimationRef.current = fillRef.current.animate([{ transform: "scaleX(1)" }], {
          duration: 180,
          fill: "forwards",
          easing: LENIS_CURVE,
        });
      }

      checkTriggerWipeOut();
    }
  }, [pathname]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (minVisibleTimeoutRef.current) clearTimeout(minVisibleTimeoutRef.current);
      revealAnimationsRef.current.forEach((anim) => {
        try {
          anim.cancel();
        } catch {}
      });
      revealAnimationsRef.current = [];
      cancelCurtainAnimations();
      resetState(true);
    };
  }, []);

  const navigateWithWipe = (href: string) => {
    if (isTransitioningRef.current) return;
    if (typeof window === "undefined") {
      router.push(href);
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      router.push(href);
      return;
    }

    const targetPath = normalizePath(href);
    const currentPath = normalizePath(pathname);

    if (targetPath === currentPath) {
      router.push(href);
      return;
    }

    cancelInitialLoader();
    resetState(true);

    isTransitioningRef.current = true;
    if (typeof window !== "undefined") {
      (window as any).__isTransitioning = true;
    }
    previousPathRef.current = pathname;
    setPreviousPath(pathname);
    targetPathRef.current = targetPath;
    const hashIndex = href.indexOf("#");
    const hash = hashIndex !== -1 && href.slice(hashIndex + 1) ? href.slice(hashIndex + 1) : null;
    targetHashRef.current = hash;
    wipeInDoneRef.current = false;
    routeCommittedRef.current = false;
    wipeOutStartedRef.current = false;
    navStartRef.current = performance.now();
    marksRef.current = [];
    markTransition("click");

    if (lenisRef.current) {
      lenisRef.current.stop();
    }

    prefetch(href);

    const overlay = overlayRef.current;
    const inner = innerRef.current;
    const label = labelRef.current;
    const fill = fillRef.current;
    const track = trackRef.current;

    if (!overlay || !inner) {
      router.push(href);
      resetState(true);
      return;
    }

    const labelText = getRouteLabel(href);
    if (label) {
      label.textContent = labelText;
      label.style.transform = "translate3d(0, 100%, 0)";
      label.style.opacity = "1";
    }

    if (track) {
      track.style.opacity = "1";
    }
    if (fill) {
      fill.style.transform = "scaleX(0)";
    }

    overlay.style.display = "block";
    overlay.style.pointerEvents = "auto";
    overlay.style.willChange = "transform";
    inner.style.willChange = "transform";

    timeoutRef.current = setTimeout(() => {
      if (isTransitioningRef.current && !wipeOutStartedRef.current) {
        markTransition("safety timeout fired (1800ms)");
        completeWipeOut();
      }
    }, 1800);

    const outerAnim = overlay.animate(
      [
        { transform: "translate3d(0, -100%, 0)" },
        { transform: "translate3d(0, 0, 0)" },
      ],
      {
        duration: 320,
        easing: LENIS_CURVE,
        fill: "forwards",
      }
    );
    wipeInAnimationRef.current = outerAnim;

    innerAnimationRef.current = inner.animate(
      [
        { transform: "translate3d(0, 40%, 0)" },
        { transform: "translate3d(0, 0, 0)" },
      ],
      {
        duration: 320,
        easing: LENIS_CURVE,
        fill: "forwards",
      }
    );

    if (label) {
      labelAnimationRef.current = label.animate(
        [
          { transform: "translate3d(0, 100%, 0)" },
          { transform: "translate3d(0, 0, 0)" },
        ],
        {
          duration: 440,
          delay: 70,
          easing: LENIS_CURVE,
          fill: "both",
        }
      );
    }

    if (fill) {
      fillAnimationRef.current = fill.animate(
        [
          { transform: "scaleX(0)" },
          { transform: "scaleX(0.72)", offset: 0.28 },
          { transform: "scaleX(0.92)" },
        ],
        {
          duration: 2400,
          easing: LENIS_CURVE,
          fill: "forwards",
        }
      );
    }

    outerAnim.finished
      .then(() => {
        if (!isTransitioningRef.current) return;
        markTransition("wipe-in done");
        wipeInDoneRef.current = true;

        startTransition(() => {
          markTransition("router.push called");
          router.push(href);
        });

        checkTriggerWipeOut();
      })
      .catch(() => {});
  };

  return (
    <TransitionContext.Provider
      value={{
        navigateWithWipe,
        prefetch,
        isPending,
        previousPath,
        getPreviousPath: () => previousPathRef.current,
      }}
    >
      {/* Initial Page Loading Curtain (smooth Lenis exponential reveal) */}
      <div
        ref={initOverlayRef}
        id="initial-loader"
        aria-hidden="true"
        className="pointer-events-auto fixed inset-0 z-[10001] overflow-hidden bg-[var(--bg-canvas)] border-b border-[var(--border-subtle)] flex items-center justify-center"
      >
        <div
          ref={initInnerRef}
          className="flex flex-col items-center justify-center px-6 text-center"
        >
          {/* Minimal V-mark emblem */}
          <div className="mb-5 w-9 h-9 rounded-xl bg-[var(--surface-tile)] border border-[var(--border-subtle)] flex items-center justify-center shadow-sm">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              className="text-[var(--accent-color)]"
            >
              <path
                d="M4.5 5.5L12 19L19.5 5.5"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="py-0.5">
            <span
              ref={initTitleRef}
              className="block font-display font-medium tracking-tight text-[var(--text-primary)] text-[clamp(1.75rem,4.5vw,2.75rem)] leading-snug select-none"
            >
              {siteConfig.name}
            </span>
          </div>

          <div className="py-0.5 mt-0.5">
            <span
              ref={initSubRef}
              className="block text-sm leading-normal text-[var(--text-secondary)] select-none"
            >
              Portfolio
            </span>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <div className="h-[2px] w-[140px] rounded-full bg-[var(--border-subtle)] overflow-hidden">
              <div
                ref={initFillRef}
                className="h-full w-full bg-[var(--accent-color)] origin-left"
                style={{ transform: "scaleX(0)" }}
              />
            </div>
            <span
              ref={initPctRef}
              className="w-9 text-right text-[13px] font-mono text-[var(--text-tertiary)] tabular-nums select-none"
            >
              0%
            </span>
          </div>
        </div>
      </div>

      {/* Route-to-Route Wipe Curtain */}
      <div
        ref={overlayRef}
        aria-hidden="true"
        className="pointer-events-auto fixed inset-0 z-[10000] hidden overflow-hidden bg-[var(--bg-canvas)] border-b border-[var(--border-subtle)]"
        style={{ transform: "translate3d(0, -100%, 0)", display: "none" }}
      >
        <div
          ref={innerRef}
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ transform: "translate3d(0, 40%, 0)" }}
        >
          <div className="overflow-hidden">
            <span
              ref={labelRef}
              className="block font-sans font-semibold tracking-tight text-[var(--text-primary)] text-[clamp(2.5rem,8vw,6rem)] leading-none select-none"
            >
              Loading
            </span>
          </div>
          <div
            ref={trackRef}
            className="mt-6 h-[1.5px] w-[140px] rounded-full bg-[var(--border-subtle)] overflow-hidden"
          >
            <div
              ref={fillRef}
              className="h-full w-full bg-[var(--accent-color)] origin-left"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
        </div>
      </div>
      {children}
    </TransitionContext.Provider>
  );
}

export { getOutboundDestination };

export function resolveLinkLabel(el: HTMLElement, explicitTrackLabel?: string): string {
  if (explicitTrackLabel && explicitTrackLabel.trim()) {
    return explicitTrackLabel.trim().slice(0, 60);
  }
  const ariaLabel = el.getAttribute("aria-label");
  if (ariaLabel && ariaLabel.trim()) {
    return ariaLabel.trim().slice(0, 60);
  }
  const title = el.getAttribute("title");
  if (title && title.trim()) {
    return title.trim().slice(0, 60);
  }
  const heading = el.querySelector("h1, h2, h3, h4, h5, h6");
  if (heading && heading.textContent && heading.textContent.trim()) {
    return heading.textContent.trim().slice(0, 60);
  }
  if (typeof document !== "undefined") {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    while (node) {
      const text = node.textContent?.trim();
      if (text) {
        return text.slice(0, 60);
      }
      node = walker.nextNode();
    }
  }
  return (el.textContent || "").trim().slice(0, 60);
}

export function TransitionLink({
  href,
  children,
  className,
  prefetch = true,
  onClick,
  onMouseEnter,
  onFocus,
  onPointerDown,
  trackLocation = "inline",
  trackDestination,
  trackLabel,
  ...props
}: {
  href: string;
  children?: React.ReactNode;
  className?: string;
  prefetch?: boolean;
  onClick?: (e?: any) => void;
  onMouseEnter?: (e?: any) => void;
  onFocus?: (e?: any) => void;
  onPointerDown?: (e?: any) => void;
  trackLocation?: string;
  trackDestination?: OutboundDestination;
  trackLabel?: string;
  [key: string]: any;
}) {
  const { navigateWithWipe, prefetch: prefetchRoute, previousPath } = usePageTransition();
  const pathname = usePathname();

  const isExternal =
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("#");

  const location = trackLocation || "inline";

  if (isExternal) {
    const destination = getOutboundDestination(href, trackDestination);
    return (
      <a
        href={href}
        className={className}
        data-ph-capture-attribute-location={location}
        onClick={(e) => {
          const label = resolveLinkLabel(e.currentTarget as HTMLElement, trackLabel);
          trackEvent("outbound_click", {
            destination,
            url: href,
            location,
            label,
          });
          if (onClick) onClick(e);
        }}
        onMouseEnter={onMouseEnter}
        onFocus={onFocus}
        onPointerDown={onPointerDown}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      prefetch={prefetch}
      className={className}
      data-ph-capture-attribute-location={location}
      onMouseEnter={(e) => {
        prefetchRoute(href);
        if (onMouseEnter) onMouseEnter(e);
      }}
      onFocus={(e) => {
        prefetchRoute(href);
        if (onFocus) onFocus(e);
      }}
      onPointerDown={(e) => {
        prefetchRoute(href);
        if (onPointerDown) onPointerDown(e);
      }}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
          return;
        }
        e.preventDefault();

        const label = resolveLinkLabel(e.currentTarget as HTMLElement, trackLabel);
        const from_path = pathname || "/";
        const to_path = href;

        if (onClick) {
          try {
            onClick(e);
          } catch (err) {
            console.error(err);
          }
        }

        navigateWithWipe(href);

        queueMicrotask(() => {
          const payload: {
            from_path: string;
            to_path: string;
            location: string;
            label: string;
            referrer_domain?: string;
          } = {
            from_path,
            to_path,
            location,
            label,
          };
          if (!previousPath) {
            payload.referrer_domain = getReferrerDomain();
          }
          trackEvent("nav_click", payload);
        });
      }}
      {...props}
    >
      {children}
    </Link>
  );
}
