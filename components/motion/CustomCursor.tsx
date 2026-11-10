"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const [cursorText, setCursorText] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable on desktop fine pointer devices and if reduced motion is disabled
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    setIsVisible(true);

    const xToCursor = gsap.quickTo(cursor, "x", { duration: 0.1, ease: "power3" });
    const yToCursor = gsap.quickTo(cursor, "y", { duration: 0.1, ease: "power3" });
    const xToFollower = gsap.quickTo(follower, "x", { duration: 0.35, ease: "power2.out" });
    const yToFollower = gsap.quickTo(follower, "y", { duration: 0.35, ease: "power2.out" });

    const onMouseMove = (e: MouseEvent) => {
      xToCursor(e.clientX);
      yToCursor(e.clientY);
      xToFollower(e.clientX);
      yToFollower(e.clientY);

      // Check hovered element
      const target = e.target as HTMLElement | null;
      const interactiveEl = target?.closest("[data-cursor], a, button, input, [role='button']");

      if (interactiveEl) {
        setIsHovered(true);
        const text = interactiveEl.getAttribute("data-cursor-text");
        setCursorText(text || "");
      } else {
        setIsHovered(false);
        setCursorText("");
      }
    };

    const onMouseEnter = () => setIsVisible(true);
    const onMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseenter", onMouseEnter);
    document.addEventListener("mouseleave", onMouseLeave);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Central pinpoint dot */}
      <div
        ref={cursorRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9999] -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[oklch(0.99_0.004_var(--tint-hue))] mix-blend-difference transition-opacity duration-200"
      />

      {/* Kinetic follower morph ring */}
      <div
        ref={followerRef}
        aria-hidden="true"
        className={`pointer-events-none fixed top-0 left-0 z-[9998] -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center transition-opacity motion-safe:transition-transform motion-safe:duration-300 motion-reduce:transform-none ${
          isHovered
            ? "w-12 h-12 bg-[var(--text-primary)]/5 dark:bg-[var(--text-primary)]/10 border border-[var(--border-hover)] shadow-md scale-100"
            : "w-7 h-7 border border-[var(--border-subtle)] scale-75 opacity-40"
        }`}
      >
        {cursorText && (
          <span className="text-[13px] font-medium text-[var(--text-primary)] transition-opacity duration-200">
            {cursorText}
          </span>
        )}
      </div>
    </>
  );
}

