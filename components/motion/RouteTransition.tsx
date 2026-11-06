"use client";

import { createContext, useContext, useEffect, useRef, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { gsap } from "gsap";
import { registerGSAPPlugins } from "@/lib/motion";
import { useLenisInstance } from "./SmoothScrollProvider";

const WIPE_IN = 0.16;
const WIPE_OUT = 0.2;

interface TransitionContextType {
  navigateWithWipe: (href: string) => void;
  prefetch: (href: string) => void;
  isPending: boolean;
}

const TransitionContext = createContext<TransitionContextType>({
  navigateWithWipe: () => { },
  prefetch: () => {},
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
  const isTransitioningRef = useRef(false);
  const targetPathRef = useRef<string | null>(null);
  const wipeInDoneRef = useRef(false);
  const routeChangedRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetState = () => {
    isTransitioningRef.current = false;
    targetPathRef.current = null;
    wipeInDoneRef.current = false;
    routeChangedRef.current = false;
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

    const overlay = overlayRef.current;
    if (!overlay) {
      resetState();
      return;
    }

    // Give browser 1 frame to paint the new route DOM under the curtain
    requestAnimationFrame(() => {
      const activeLenis = lenisRef.current || lenis;
      if (activeLenis) {
        activeLenis.scrollTo(0, { immediate: true, force: true });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      }

      gsap.to(overlay, {
        clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
        duration: WIPE_OUT,
        ease: "power2.inOut",
        onComplete: () => {
          gsap.set(overlay, { display: "none" });
          resetState();
        },
      });
    });
  };

  // Synchronize: listen for the incoming route to mount before revealing
  useEffect(() => {
    if (!isTransitioningRef.current) return;

    const currentNormalized = normalizePath(pathname);
    if (targetPathRef.current && currentNormalized === targetPathRef.current) {
      routeChangedRef.current = true;
      if (wipeInDoneRef.current) {
        completeWipeOut();
      }
    }
  }, [pathname]);

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
    isTransitioningRef.current = true;
    targetPathRef.current = targetPath;
    wipeInDoneRef.current = false;
    routeChangedRef.current = false;

    // Prefetch immediately so chunks are ready during wipe animation
    prefetch(href);

    const overlay = overlayRef.current;
    if (!overlay) {
      router.push(href);
      resetState();
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Safety timeout: if route doesn't swap within 1.5s, force wipe out so UI never blocks
    timeoutRef.current = setTimeout(() => {
      if (isTransitioningRef.current) {
        completeWipeOut();
      }
    }, 1500);

    // Fast, crisp wipe in animation
    gsap.set(overlay, {
      display: "block",
      clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
      opacity: 1,
    });

    gsap.to(overlay, {
      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
      duration: WIPE_IN,
      ease: "power2.out",
      onComplete: () => {
        wipeInDoneRef.current = true;

        startTransition(() => {
          router.push(href);
        });

        // If route already completed swap while curtain was wiping in
        if (routeChangedRef.current) {
          completeWipeOut();
        }
      },
    });
  };

  return (
    <TransitionContext.Provider value={{ navigateWithWipe, prefetch, isPending }}>
      {/* Wipe overlay */}
      <div
        ref={overlayRef}
        aria-hidden="true"
        className="pointer-events-auto fixed inset-0 z-[10000] hidden bg-[var(--bg-canvas)] border-b border-[var(--border-subtle)]"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }}
      />
      {children}
    </TransitionContext.Provider>
  );
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
  [key: string]: any;
}) {
  const { navigateWithWipe, prefetch: prefetchRoute } = usePageTransition();

  const isExternal =
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("#");

  if (isExternal) {
    return (
      <a
        href={href}
        className={className}
        onClick={onClick}
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
        if (onClick) {
          try {
            onClick(e);
          } catch (err) {
            console.error(err);
          }
        }
        navigateWithWipe(href);
      }}
      {...props}
    >
      {children}
    </Link>
  );
}
