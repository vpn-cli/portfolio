"use client";

import { BentoTile } from "./BentoTile";
import { useTheme } from "@/components/motion/ThemeProvider";
import { Moon, Sun } from "lucide-react";

export function ThemeToggleTile({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <BentoTile className={className} cursorText="Switch Theme">
      <div className="w-full h-full flex flex-col items-center justify-center p-2">
        <button
          onClick={toggleTheme}
          type="button"
          aria-label="Toggle dark/light theme"
          className="relative w-16 h-9 rounded-full bg-white/[0.06] border border-white/10 flex items-center px-1 transition-colors hover:border-accent focus:outline-none"
        >
          {/* Animated Switch Thumb */}
          <div
            className={`w-7 h-7 rounded-full bg-[#18191E] border border-white/20 flex items-center justify-center text-white/80 shadow-md transition-transform duration-300 ${
              theme === "light" ? "translate-x-7 bg-amber-400 text-black border-amber-300" : "translate-x-0"
            }`}
          >
            {theme === "light" ? (
              <Sun className="w-4 h-4 text-black animate-spin" style={{ animationDuration: "12s" }} />
            ) : (
              <Moon className="w-3.5 h-3.5 text-white" />
            )}
          </div>
        </button>
        <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)] mt-2">
          {theme === "dark" ? "Dark Mode" : "Light Mode"}
        </span>
      </div>
    </BentoTile>
  );
}
