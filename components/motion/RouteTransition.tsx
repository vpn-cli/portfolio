"use client";

import { createContext, useContext, useEffect, useRef, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { gsap } from "gsap";
import { registerGSAPPlugins } from "@/lib/motion";
import { useLenisInstance } from "./SmoothScrollProvider";
import { siteConfig } from "@/content/site";
import { trackEvent, OutboundDestination } from "@/lib/analytics";

const WIPE_IN = 0.16;
const WIPE_OUT = 0.2;
export const MIN_VISIBLE: number = 0.42;

const isDebugEnabled = () => {
  if (typeof window === "undefined") return false;
  return process.env.NODE_ENV !== "production" || Boolean((window as any).__debugTransitions);
};

interface TransitionContextType {
  navigateWithWipe: (href: string) => void;
  prefetch: (href: string) => void;
  isPending: boolean;
}

const TransitionContext = createContext<TransitionContextType>({
  navigateWithWipe: () => { },
  prefetch: () => { },
  isPending: false,
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
  const [isPending, startTransition] = useTransition();
  const { lenis } = useLenisInstance();
  const lenisRef = useRef(lenis);

  useEffect(() => {
    lenisRef.current = lenis;
  }, [lenis]);

  const overlayRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  const isTransitioningRef = useRef(false);
  const targetPathRef = useRef<string | null>(null);
  const targetHashRef = useRef<string | null>(null);
  const wipeInDoneRef = useRef(false);
  const routeChangedRef = useRef(false);
  const navStartRef = useRef<number>(0);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const minVisibleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const isRevealingRef = useRef(false);

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

  const resetState = (interrupted = false) => {
    isTransitioningRef.current = false;
    targetPathRef.current = null;
    targetHashRef.current = null;
    wipeInDoneRef.current = false;
    routeChangedRef.current = false;

    // Clear gsap props on [data-reveal] elements whenever resetState() runs.
    const reveals = document.querySelectorAll<HTMLElement>("main [data-reveal]");
    if (reveals.length > 0) {
      if (interrupted || !isRevealingRef.current) {
        gsap.killTweensOf(reveals);
        gsap.set(reveals, { clearProps: "opacity,transform" });
      } else {
        reveals.forEach((el) => {
          if (el.style.opacity === "0" && !gsap.isTweening(el)) {
            gsap.set(el, { clearProps: "opacity,transform" });
          }
        });
      }
    }
  };

  const prefetch = (href: string) => {
    if (!href.startsWith("http") && !href.startsWith("mailto:") && !href.startsWith("#")) {
      router.prefetch(href);
    }
  };

  const completeWipeOut = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (minVisibleTimeoutRef.current) {
      clearTimeout(minVisibleTimeoutRef.current);
      minVisibleTimeoutRef.current = null;
    }

    const overlay = overlayRef.current;
    if (!overlay) {
      resetState(true);
      return;
    }

    // Ensure progress fill is at 1
    if (fillRef.current) {
      gsap.to(fillRef.current, {
        scaleX: 1,
        duration: 0.12,
        ease: "power2.out",
        overwrite: "auto",
      });
    }

    // Give browser 1 frame to paint the new route DOM under the curtain
    requestAnimationFrame(() => {
      markTransition("wipe-out start");
      const activeLenis = lenisRef.current || lenis;
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
      const all = Array.from(document.querySelectorAll<HTMLElement>("main [data-reveal]"));
      const visible = all.filter((el) => el.getBoundingClientRect().top < window.innerHeight);

      visible.sort((a, b) => {
        const orderA = a.getAttribute("data-reveal-order");
        const orderB = b.getAttribute("data-reveal-order");
        if (orderA !== null && orderB !== null) {
          return parseFloat(orderA) - parseFloat(orderB);
        }
        if (orderA !== null) return -1;
        if (orderB !== null) return 1;
        return 0;
      });

      const toAnimate = visible.slice(0, 7);

      if (toAnimate.length > 0) {
        gsap.set(toAnimate, { opacity: 0, y: 14 });
        isRevealingRef.current = true;
      }

      // Wipe-out: as now (WIPE_OUT)
      gsap.to(overlay, {
        clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
        duration: WIPE_OUT,
        ease: "power2.inOut",
        onComplete: () => {
          gsap.set(overlay, { display: "none" });
          if (labelRef.current) {
            gsap.set(labelRef.current, { yPercent: 100, opacity: 1 });
          }
          if (fillRef.current) {
            gsap.set(fillRef.current, { scaleX: 0 });
          }
          if (trackRef.current) {
            gsap.set(trackRef.current, { opacity: 1 });
          }
          markTransition("wipe-out end");
          logTransitionTable();
          resetState(false);
          if (tlRef.current) {
            tlRef.current.kill();
            tlRef.current = null;
          }
        },
      });

      // At the same moment the label animates to yPercent: -100 and opacity 0
      if (labelRef.current) {
        gsap.to(labelRef.current, {
          yPercent: -100,
          opacity: 0,
          duration: 0.2,
          ease: "power2.in",
        });
      }

      // And the progress track fades out
      if (trackRef.current) {
        gsap.to(trackRef.current, {
          opacity: 0,
          duration: 0.2,
          ease: "power2.in",
        });
      }

      // Starting 0.05s after the wipe-out begins
      if (toAnimate.length > 0) {
        gsap.to(toAnimate, {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: "power3.out",
          stagger: 0.06,
          delay: 0.05,
          clearProps: "opacity,transform",
          onComplete: () => {
            isRevealingRef.current = false;
          },
        });
      }
    });
  };

  const triggerWipeOutWithMinVisible = () => {
    if (minVisibleTimeoutRef.current) {
      clearTimeout(minVisibleTimeoutRef.current);
      minVisibleTimeoutRef.current = null;
    }

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
      minVisibleTimeoutRef.current = setTimeout(() => {
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
      console.log(`[pathname effect] pathname=${pathname}, target=${targetPathRef.current}, routeChanged=${routeChangedRef.current}`);
    }
    if (targetPathRef.current && currentNormalized === targetPathRef.current) {
      markTransition("pathname committed");
      routeChangedRef.current = true;

      // When the route is ready, animate it to scaleX 1 over 0.12s. Do not delay wipe-out waiting for this to finish.
      if (fillRef.current) {
        gsap.to(fillRef.current, {
          scaleX: 1,
          duration: 0.12,
          ease: "power2.out",
          overwrite: "auto",
        });
      }

      if (wipeInDoneRef.current) {
        triggerWipeOutWithMinVisible();
      }
    }
  }, [pathname]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (minVisibleTimeoutRef.current) clearTimeout(minVisibleTimeoutRef.current);
      if (tlRef.current) tlRef.current.kill();
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

    registerGSAPPlugins();

    // Clean any residual props from a previous interrupted navigation
    resetState(true);

    isTransitioningRef.current = true;
    targetPathRef.current = targetPath;
    const hashIndex = href.indexOf("#");
    const hash = hashIndex !== -1 && href.slice(hashIndex + 1) ? href.slice(hashIndex + 1) : null;
    targetHashRef.current = hash;
    wipeInDoneRef.current = false;
    routeChangedRef.current = false;
    navStartRef.current = performance.now();
    marksRef.current = [];
    markTransition("click");

    // Prefetch immediately so chunks are ready during wipe animation
    prefetch(href);

    const overlay = overlayRef.current;
    if (!overlay) {
      router.push(href);
      resetState(true);
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (minVisibleTimeoutRef.current) {
      clearTimeout(minVisibleTimeoutRef.current);
      minVisibleTimeoutRef.current = null;
    }

    // Set destination label text BEFORE the wipe-in starts
    const label = getRouteLabel(href);
    if (labelRef.current) {
      labelRef.current.textContent = label;
      gsap.set(labelRef.current, { yPercent: 100, opacity: 1 });
    }

    if (trackRef.current) {
      gsap.set(trackRef.current, { opacity: 1 });
    }
    if (fillRef.current) {
      gsap.set(fillRef.current, { scaleX: 0, transformOrigin: "left center" });
    }

    // Fast, crisp wipe in animation
    gsap.set(overlay, {
      display: "flex",
      clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
      opacity: 1,
    });

    // Safety timeout: if route doesn't swap within 1.5s, force wipe out so UI never blocks
    timeoutRef.current = setTimeout(() => {
      if (isTransitioningRef.current) {
        markTransition("safety timeout fired (1500ms)");
        completeWipeOut();
      }
    }, 1500);

    const tl = gsap.timeline();
    tlRef.current = tl;

    // t=0: curtain wipe-in exactly as now (WIPE_IN)
    tl.to(
      overlay,
      {
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        duration: WIPE_IN,
        ease: "power2.out",
        onComplete: () => {
          markTransition("wipe-in done");
          wipeInDoneRef.current = true;

          startTransition(() => {
            markTransition("router.push called");
            router.push(href);
          });

          // If route already completed swap while curtain was wiping in
          if (routeChangedRef.current) {
            triggerWipeOutWithMinVisible();
          }
        },
      },
      0
    );

    // At t=0.06 the label <span> animates from yPercent: 100 to 0 (duration 0.32, ease "power3.out")
    if (labelRef.current) {
      tl.fromTo(
        labelRef.current,
        { yPercent: 100, opacity: 1 },
        { yPercent: 0, opacity: 1, duration: 0.32, ease: "power3.out" },
        0.06
      );
    }

    // Progress line: starts at scaleX 0. While waiting for the route, animate scaleX to 0.7 over 0.6s (ease "power2.out"), then creep toward 0.9 over 2s.
    if (fillRef.current) {
      tl.fromTo(
        fillRef.current,
        { scaleX: 0, transformOrigin: "left center" },
        { scaleX: 0.7, duration: 0.6, ease: "power2.out" },
        0
      );
      tl.to(
        fillRef.current,
        { scaleX: 0.9, duration: 2.0, ease: "none" },
        0.6
      );
    }
  };

  return (
    <TransitionContext.Provider value={{ navigateWithWipe, prefetch, isPending }}>
      {/* Wipe overlay */}
      <div
        ref={overlayRef}
        aria-hidden="true"
        className="pointer-events-auto fixed inset-0 z-[10000] hidden flex-col items-center justify-center bg-[var(--bg-canvas)] border-b border-[var(--border-subtle)]"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)", display: "none" }}
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
  [key: string]: any;
}) {
  const { navigateWithWipe, prefetch: prefetchRoute } = usePageTransition();
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
          trackEvent("outbound_click", {
            destination,
            url: href,
            location,
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

        const label = ((e.currentTarget as HTMLElement).textContent || "").trim().slice(0, 60);
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
          trackEvent("nav_click", {
            from_path,
            to_path,
            location,
            label,
          });
        });
      }}
      {...props}
    >
      {children}
    </Link>
  );
}
