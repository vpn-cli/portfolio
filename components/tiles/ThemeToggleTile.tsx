"use client";

import { BentoTile } from "./BentoTile";
import { useTheme } from "@/components/motion/ThemeProvider";
import { Moon, Sun } from "lucide-react";

export function ThemeToggleTile({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <BentoTile className={className} cursorText="Switch Theme">
      <div className="w-full h-full flex items-center justify-center">
        <button
          onClick={toggleTheme}
          type="button"
          aria-label="Toggle theme"
          className="relative w-14 h-8 rounded-full bg-black/60 border border-white/[0.08] flex items-center px-1 transition-colors hover:border-white/20 focus:outline-none"
        >
          {/* Animated Switch Thumb with Moon / Sun */}
          <div
            className={`w-6 h-6 rounded-full bg-[#1F2026] border border-white/20 flex items-center justify-center text-neutral-300 shadow-md transition-transform duration-300 ${
              theme === "light" ? "translate-x-6 bg-white text-black border-neutral-300" : "translate-x-0"
            }`}
          >
            {theme === "light" ? (
              <Sun className="w-3.5 h-3.5 text-black" />
            ) : (
              <Moon className="w-3 h-3 text-white" />
            )}
          </div>
        </button>
      </div>
    </BentoTile>
  );
}
