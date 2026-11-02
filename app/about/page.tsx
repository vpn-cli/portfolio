"use client";

import { TransitionLink } from "@/components/motion/RouteTransition";
import { X } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] p-3 sm:p-4 lg:p-6 flex flex-col items-center">
      <div className="w-full max-w-[1480px] min-h-[calc(100vh-48px)] rounded-[32px] sm:rounded-[36px] bg-[var(--bg-canvas-subtle)] border border-[var(--border-subtle)] p-6 sm:p-10 lg:p-14 shadow-md flex flex-col items-center">
        {/* Top Floating Close Pill */}
        <div className="w-full flex justify-center mb-8 sm:mb-12">
          <TransitionLink
            href="/"
            className="w-10 h-10 rounded-full bg-[var(--surface-tile)] hover:bg-[var(--surface-tile-hover)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] flex items-center justify-center transition-colors text-[var(--text-primary)] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-white/40 active:scale-95"
            title="Back to home"
            aria-label="Back to home"
          >
            <X className="w-5 h-5 opacity-80" aria-hidden="true" />
          </TransitionLink>
        </div>

        <div className="w-full max-w-5xl lg:max-w-6xl">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
            About
          </h1>
        </div>
      </div>
    </main>
  );
}
