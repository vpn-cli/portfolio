"use client";

import { useEffect, useRef } from "react";
import { BentoTile } from "./BentoTile";
import { useTheme } from "@/components/motion/ThemeProvider";
import { Moon, Sun } from "lucide-react";
import { gsap } from "gsap";

export function ThemeToggleTile({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const thumbRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const isInitial = useRef(true);

  useEffect(() => {
    if (isInitial.current) {
      isInitial.current = false;
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (thumbRef.current && iconRef.current) {
      gsap.fromTo(
        thumbRef.current,
        { scale: 0.8 },
        { scale: 1, duration: 0.4, ease: "back.out(2)" }
      );
      gsap.fromTo(
        iconRef.current,
        { rotate: theme === "light" ? -180 : 180, opacity: 0 },
        { rotate: 0, opacity: 1, duration: 0.45, ease: "power2.out" }
      );
    }
  }, [theme]);

  return (
    <BentoTile className={className} cursorText="Switch Theme">
      <div className="w-full h-full flex items-center justify-center">
        <button
          onClick={toggleTheme}
          type="button"
          aria-label="Toggle theme"
          className="relative w-20 h-11 rounded-full bg-neutral-200 hover:border-neutral-400 border border-neutral-300 dark:bg-[#111113] dark:border-white/[0.08] dark:hover:border-white/20 flex items-center px-1.5 transition-colors focus:outline-none cursor-pointer"
        >
          {/* Animated Switch Thumb with Moon / Sun */}
          <div
            ref={thumbRef}
            className={`w-8 h-8 rounded-full border flex items-center justify-center shadow-lg transition-transform duration-300 ${theme === "light"
                ? "translate-x-9 bg-white text-neutral-900 border-neutral-300 shadow-md"
                : "translate-x-0 bg-[#222329] text-white border-white/20"
              }`}
          >
            <div ref={iconRef}>
              {theme === "light" ? (
                <Sun className="w-4 h-4 text-neutral-900" />
              ) : (
                <Moon className="w-4 h-4 text-white" />
              )}
            </div>
          </div>
        </button>
      </div>
    </BentoTile>
  );
}
