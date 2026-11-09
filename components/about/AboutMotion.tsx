"use client";

import { useEffect } from "react";

export function AboutMotion() {
  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("main section, main [data-reveal]")
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            observer.unobserve(el);

            if (typeof el.animate === "function") {
              el.animate(
                [
                  { opacity: 0.35, transform: "translateY(16px)" },
                  { opacity: 1, transform: "translateY(0)" },
                ],
                {
                  duration: 420,
                  easing: "cubic-bezier(0.16, 1, 0.3, 1)",
                  fill: "both",
                }
              );
            }
          }
        });
      },
      { rootMargin: "0px 0px -40px 0px", threshold: 0.05 }
    );

    targets.forEach((t) => observer.observe(t));

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}
