"use client";

import { createContext, useContext, useEffect, useRef, useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useLenisInstance } from "./SmoothScrollProvider";
import { siteConfig } from "@/content/site";
import { trackEvent, OutboundDestination, getReferrerDomain } from "@/lib/analytics";

const WIPE_IN = 0.16;
const WIPE_OUT = 0.22;
export const MIN_VISIBLE: number = 0.42;

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
  navigateWithWipe: () => { },
  prefetch: () => { },
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

  // WAAPI animation refs
  const wipeInAnimationRef = useRef<Animation | null>(null);
  const innerAnimationRef = useRef<Animation | null>(null);
  const labelAnimationRef = useRef<Animation | null>(null);
  const fillAnimationRef = useRef<Animation | null>(null);
  const trackAnimationRef = useRef<Animation | null>(null);
  const wipeOutAnimationRef = useRef<Animation | null>(null);
  const wipeOutInnerAnimationRef = useRef<Animation | null>(null);
  const revealAnimationsRef = useRef<Animation[]>([]);

  const marksRef = useRef<{ name: string; time: number }[]>([]);

  const markTransition = (name: string) => {
    try {
      performance.mark(name);
    } catch { }
    marksRef.current.push({ name, time: performance.now() });
    if (isDebugEnabled()) {
      console.log(`[RouteTransition Mark] ${name} (+${(performance.now() - navStartRef.current).toFixed(1)}ms)`);
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
    if (wipeInAnimationRef.current) {
      try { wipeInAnimationRef.current.cancel(); } catch { }
      wipeInAnimationRef.current = null;
    }
    if (innerAnimationRef.current) {
      try { innerAnimationRef.current.cancel(); } catch { }
      innerAnimationRef.current = null;
    }
    if (labelAnimationRef.current) {
      try { labelAnimationRef.current.cancel(); } catch { }
      labelAnimationRef.current = null;
    }
    if (fillAnimationRef.current) {
      try { fillAnimationRef.current.cancel(); } catch { }
      fillAnimationRef.current = null;
    }
    if (trackAnimationRef.current) {
      try { trackAnimationRef.current.cancel(); } catch { }
      trackAnimationRef.current = null;
    }
    if (wipeOutAnimationRef.current) {
      try { wipeOutAnimationRef.current.cancel(); } catch { }
      wipeOutAnimationRef.current = null;
    }
    if (wipeOutInnerAnimationRef.current) {
      try { wipeOutInnerAnimationRef.current.cancel(); } catch { }
      wipeOutInnerAnimationRef.current = null;
    }
  };

  const resetState = (interrupted = false) => {
    isTransitioningRef.current = false;
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
        try { anim.cancel(); } catch { }
      });
      revealAnimationsRef.current = [];
    }

    if (overlayRef.current) {
      overlayRef.current.style.display = "none";
      overlayRef.current.style.willChange = "";
      overlayRef.current.style.transform = "translateY(-100%)";
    }
    if (innerRef.current) {
      innerRef.current.style.willChange = "";
      innerRef.current.style.transform = "translateY(100%)";
    }
    if (labelRef.current) {
      labelRef.current.style.transform = "translateY(100%)";
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

    // 1 frame for DOM paint & scroll reset
    requestAnimationFrame(() => {
      markTransition("wipe-out start");

      // Scroll reset
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

      // Content reveal on arrival
      // FIRST read all rects of "main [data-reveal]" in one loop (no style writes in between),
      // filter to above the fold, sort by data-reveal-order, cap at 7. THEN create animations.
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

      const toAnimate = visible.slice(0, 7);

      // Cancel previous reveal animations if any
      revealAnimationsRef.current.forEach((anim) => {
        try { anim.cancel(); } catch { }
      });
      revealAnimationsRef.current = [];

      // Create reveal animations in the same frame the wipe-out starts
      toAnimate.forEach((item, i) => {
        const anim = item.el.animate(
          [
            { opacity: 0, translate: "0 12px" },
            { opacity: 1, translate: "0 0" },
          ],
          {
            duration: 500,
            delay: 50 + i * 50,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            fill: "backwards",
          }
        );
        revealAnimationsRef.current.push(anim);
      });

      // Curtain Wipe-out:
      // outer translateY(0) -> translateY(100%), inner translateY(0) -> translateY(-100%).
      // 220ms, easing cubic-bezier(0.65, 0, 0.35, 1), fill "forwards".
      const outerOut = overlay.animate(
        [
          { transform: "translateY(0)" },
          { transform: "translateY(100%)" },
        ],
        {
          duration: 220,
          easing: "cubic-bezier(0.65, 0, 0.35, 1)",
          fill: "forwards",
        }
      );
      wipeOutAnimationRef.current = outerOut;

      const innerOut = inner.animate(
        [
          { transform: "translateY(0)" },
          { transform: "translateY(-100%)" },
        ],
        {
          duration: 220,
          easing: "cubic-bezier(0.65, 0, 0.35, 1)",
          fill: "forwards",
        }
      );
      wipeOutInnerAnimationRef.current = innerOut;

      // Label: translateY(0) -> translateY(-100%) plus opacity 1 -> 0, 200ms, easing cubic-bezier(0.55, 0, 1, 0.45)
      if (label) {
        labelAnimationRef.current = label.animate(
          [
            { transform: "translateY(0)", opacity: 1 },
            { transform: "translateY(-100%)", opacity: 0 },
          ],
          {
            duration: 200,
            easing: "cubic-bezier(0.55, 0, 1, 0.45)",
            fill: "forwards",
          }
        );
      }

      // Track: opacity 1 -> 0, 200ms
      if (track) {
        trackAnimationRef.current = track.animate(
          [
            { opacity: 1 },
            { opacity: 0 },
          ],
          {
            duration: 200,
            easing: "cubic-bezier(0.55, 0, 1, 0.45)",
            fill: "forwards",
          }
        );
      }

      // On finish: hide overlay, cancel its animations, reset
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
        .catch(() => { });
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

  // Synchronize: listen for the incoming route to mount before revealing
  useEffect(() => {
    if (!isTransitioningRef.current) return;

    const currentNormalized = normalizePath(pathname);
    if (isDebugEnabled()) {
      console.log(`[pathname effect] pathname=${pathname}, target=${targetPathRef.current}, routeCommitted=${routeCommittedRef.current}`);
    }
    if (targetPathRef.current && currentNormalized === targetPathRef.current) {
      markTransition("pathname committed");
      routeCommittedRef.current = true;

      // When the route is ready: commitStyles(), cancel(), then animate to scaleX(1) over 120ms. It must never gate the wipe-out.
      if (fillRef.current && fillAnimationRef.current) {
        try {
          fillAnimationRef.current.commitStyles();
        } catch { }
        fillAnimationRef.current.cancel();
        fillAnimationRef.current = fillRef.current.animate(
          [{ transform: "scaleX(1)" }],
          { duration: 120, fill: "forwards", easing: "ease-out" }
        );
      }

      checkTriggerWipeOut();
    }
  }, [pathname]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (minVisibleTimeoutRef.current) clearTimeout(minVisibleTimeoutRef.current);
      revealAnimationsRef.current.forEach((anim) => {
        try { anim.cancel(); } catch { }
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

    // Check reduced motion
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

    // Clean any residual props from a previous interrupted navigation
    resetState(true);

    isTransitioningRef.current = true;
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

    // Step 4: Stop Lenis when wipe-in starts
    if (lenisRef.current) {
      lenisRef.current.stop();
    }

    // Prefetch immediately so chunks are ready during wipe animation
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

    // Set destination label text BEFORE the wipe-in starts
    const labelText = getRouteLabel(href);
    if (label) {
      label.textContent = labelText;
      label.style.transform = "translateY(100%)";
      label.style.opacity = "1";
    }

    if (track) {
      track.style.opacity = "1";
    }
    if (fill) {
      fill.style.transform = "scaleX(0)";
    }

    overlay.style.display = "block";
    overlay.style.willChange = "transform";
    inner.style.willChange = "transform";

    // Safety timeout: if route doesn't swap within 1.5s, force wipe out so UI never blocks
    timeoutRef.current = setTimeout(() => {
      if (isTransitioningRef.current && !wipeOutStartedRef.current) {
        markTransition("safety timeout fired (1500ms)");
        completeWipeOut();
      }
    }, 1500);

    // Wipe-in: outer translateY(-100%) -> translateY(0) while inner translateY(100%) -> translateY(0) (counter-transform, so label stays still on screen).
    // 160ms, easing cubic-bezier(0.33, 1, 0.68, 1), fill "forwards"
    const outerAnim = overlay.animate(
      [
        { transform: "translateY(-100%)" },
        { transform: "translateY(0)" },
      ],
      {
        duration: 160,
        easing: "cubic-bezier(0.33, 1, 0.68, 1)",
        fill: "forwards",
      }
    );
    wipeInAnimationRef.current = outerAnim;

    innerAnimationRef.current = inner.animate(
      [
        { transform: "translateY(100%)" },
        { transform: "translateY(0)" },
      ],
      {
        duration: 160,
        easing: "cubic-bezier(0.33, 1, 0.68, 1)",
        fill: "forwards",
      }
    );

    // Label: in an overflow-hidden wrapper, the span animates translateY(100%) -> 0, 320ms, delay 60ms, easing cubic-bezier(0.22, 1, 0.36, 1)
    if (label) {
      labelAnimationRef.current = label.animate(
        [
          { transform: "translateY(100%)" },
          { transform: "translateY(0)" },
        ],
        {
          duration: 320,
          delay: 60,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "forwards",
        }
      );
    }

    // Progress line: one animation on the fill with keyframes
    // [{ transform: "scaleX(0)" }, { transform: "scaleX(0.7)", offset: 0.23 }, { transform: "scaleX(0.9)" }], 2600ms, fill "forwards"
    if (fill) {
      fillAnimationRef.current = fill.animate(
        [
          { transform: "scaleX(0)" },
          { transform: "scaleX(0.7)", offset: 0.23 },
          { transform: "scaleX(0.9)" },
        ],
        {
          duration: 2600,
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
      .catch(() => { });
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
      {/* Wipe overlay */}
      <div
        ref={overlayRef}
        aria-hidden="true"
        className="pointer-events-auto fixed inset-0 z-[10000] hidden overflow-hidden bg-[var(--bg-canvas)] border-b border-[var(--border-subtle)]"
        style={{ transform: "translateY(-100%)", display: "none" }}
      >
        <div
          ref={innerRef}
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ transform: "translateY(100%)" }}
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
            className="mt-6 h-[1px] w-[120px] bg-[var(--border-subtle)] overflow-hidden"
          >
            <div
              ref={fillRef}
              className="h-full w-full bg-[var(--text-primary)] origin-left"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
        </div>
      </div>
      {children}
    </TransitionContext.Provider>
  );
}

function getOutboundDestination(href: string, explicit?: OutboundDestination): OutboundDestination {
  if (explicit) return explicit;
  if (href.startsWith("mailto:")) return "email";
  if (href.includes("/resume.pdf") || href.includes("resume")) return "resume";
  if (href.includes("linkedin.com")) return "linkedin";
  if (href.includes("github.com")) {
    return href.includes("/blob/") || href.includes("/tree/") || href.split("/").length > 4
      ? "project_repo"
      : "github";
  }
  if (href.includes("vercel.app") || href.startsWith("http://") || href.startsWith("https://")) {
    return "project_live";
  }
  return "other";
}

/**
 * Resolves link label strictly by order of precedence:
 * trackLabel -> aria-label -> title -> text of first heading -> first text node only -> textContent (max 60 chars)
 */
export function resolveLinkLabel(el: HTMLElement, explicitTrackLabel?: string): string {
  // 1. trackLabel
  if (explicitTrackLabel && explicitTrackLabel.trim()) {
    return explicitTrackLabel.trim().slice(0, 60);
  }
  // 2. aria-label
  const ariaLabel = el.getAttribute("aria-label");
  if (ariaLabel && ariaLabel.trim()) {
    return ariaLabel.trim().slice(0, 60);
  }
  // 3. title
  const title = el.getAttribute("title");
  if (title && title.trim()) {
    return title.trim().slice(0, 60);
  }
  // 4. the text of the first heading (h1-h6) or first text node only
  const heading = el.querySelector("h1, h2, h3, h4, h5, h6");
  if (heading && heading.textContent && heading.textContent.trim()) {
    return heading.textContent.trim().slice(0, 60);
  }
  // First non-empty text node
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
        // Allow default behavior for modifier clicks (cmd/ctrl click to new tab)
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

        // Performance guardrail: defer nav_click capture after navigateWithWipe starts
        queueMicrotask(() => {
          const payload: { from_path: string; to_path: string; location: string; label: string; referrer_domain?: string } = {
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
