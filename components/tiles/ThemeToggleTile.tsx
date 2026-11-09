"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/components/motion/ThemeProvider";
import { Moon, Sun } from "lucide-react";
import { BentoTile } from "./BentoTile";

export function ThemeToggleTile({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? theme === "dark" : false;
  // Track width is 80px (w-20), inner padding is 6px (p-1.5), thumb width is 32px (w-8).
  // Total travel distance: 80 - 12 - 32 = 36px.
  const targetX = isDark ? 0 : 36;

  return (
    <BentoTile className={className} cursorText="Switch Theme">
      <div
        onClick={toggleTheme}
        className="w-full h-full flex flex-col justify-between py-0.5 cursor-pointer select-none group"
      >
        {/* Top Eyebrow & Status */}
        <div className="flex items-center justify-between w-full">
          <span className="text-[12px] sm:text-[13px] text-[var(--text-tertiary)] font-medium">
            Theme
          </span>
          <span
            suppressHydrationWarning
            className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full bg-[var(--surface-tile-hover)] text-[var(--text-secondary)] border border-[var(--border-subtle)] transition-colors"
          >
            {isDark ? "Dark" : "Light"}
          </span>
        </div>

        {/* Center Pill Switch */}
        <div className="flex items-center justify-center my-auto py-2 sm:py-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleTheme();
            }}
            type="button"
            suppressHydrationWarning
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            title={`Switch to ${isDark ? "light" : "dark"} mode`}
            className="relative w-20 h-11 rounded-full p-1.5 flex items-center bg-[var(--bg-canvas-subtle)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] shadow-inner transition-[background-color,border-color] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-white/40 active:scale-95 cursor-pointer"
          >
            {/* Stationary In-Track Guide Icons */}
            <div
              aria-hidden="true"
              className="absolute inset-0 px-3 flex items-center justify-between pointer-events-none select-none"
            >
              <Moon
                className={`w-3.5 h-3.5 transition-opacity duration-300 ${
                  isDark ? "opacity-0" : "opacity-40 text-[var(--text-tertiary)]"
                }`}
              />
              <Sun
                className={`w-3.5 h-3.5 transition-opacity duration-300 ${
                  isDark ? "opacity-40 text-[var(--text-tertiary)]" : "opacity-0"
                }`}
              />
            </div>

            {/* Sliding Animated Thumb */}
            <div
              suppressHydrationWarning
              style={{ transform: `translateX(${targetX}px)` }}
              className="relative z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] bg-[var(--surface-tile)] text-[var(--text-primary)] border border-[var(--border-subtle)] shadow-sm motion-reduce:transition-none"
            >
              <div className="transition-transform duration-300 ease-out">
                {isDark ? (
                  <Moon className="w-4 h-4 text-[var(--text-primary)]" />
                ) : (
                  <Sun className="w-4 h-4 text-[var(--text-primary)]" />
                )}
              </div>
            </div>
          </button>
        </div>

        {/* Bottom Helper Bar on Desktop / Tablet */}
        <div className="hidden sm:flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
          <span>Appearance</span>
          <span suppressHydrationWarning>{isDark ? "Dark mode" : "Light default"}</span>
        </div>
      </div>
    </BentoTile>
  );
}
