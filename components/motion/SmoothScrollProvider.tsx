"use client";

import { useEffect, useRef, createContext, useContext, useState } from "react";
import Lenis from "lenis";

export const LENIS_EXPO_EASING = (t: number) =>
  t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

interface LenisContextValue {
  lenis: Lenis | null;
}

const LenisContext = createContext<LenisContextValue>({ lenis: null });

export const useLenisInstance = () => useContext(LenisContext);

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.25,
      easing: LENIS_EXPO_EASING,
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.4,
      autoRaf: true,
    });

    lenisRef.current = lenis;
    setLenisInstance(lenis);

    // Keep Lenis scroll bounds accurate as case-study accordions/tabs expand or collapse
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && document.body) {
      resizeObserver = new ResizeObserver(() => {
        lenis.resize();
      });
      resizeObserver.observe(document.body);
    }

    // Intercept in-page #anchor links so they glide with Lenis inertia
    const handleAnchorClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;
      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;
      const target = document.getElementById(hash.slice(1));
      if (!target) return;

      e.preventDefault();
      lenis.scrollTo(target, {
        offset: -32,
        duration: 1.25,
        easing: LENIS_EXPO_EASING,
      });
      if (window.location.hash !== hash) {
        window.history.pushState(null, "", hash);
      }
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
        setLenisInstance(null);
      }
    };
  }, []);

  return (
    <LenisContext.Provider value={{ lenis: lenisInstance }}>
      {children}
    </LenisContext.Provider>
  );
}
