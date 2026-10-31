"use client";

import { BentoTile } from "./BentoTile";
import { ArrowUpRight } from "lucide-react";
import { usePageTransition } from "@/components/motion/RouteTransition";

export function AboutTile({ className = "" }: { className?: string }) {
  const { navigateWithWipe } = usePageTransition();

  return (
    <BentoTile className={className} cursorText="Read Bio">
      <div
        onClick={() => navigateWithWipe("/about")}
        className="w-full h-full flex flex-col justify-between cursor-pointer group"
      >
        {/* Eyebrow Label (Matches references: [LABEL 2] 14/1.2EM, 1.2px) */}
        <div>
          <span className="type-label2 text-[var(--text-tertiary)] block mb-3 font-semibold">
            ABOUT
          </span>

          <p className="type-body4 text-[var(--text-secondary)] font-normal leading-relaxed group-hover:text-[var(--text-primary)] transition-colors duration-200">
            Passionate about building resilient software and solving complex engineering challenges.
          </p>
        </div>

        {/* Circular Arrow Button (Matches Reference) */}
        <div className="pt-4 mt-auto flex justify-start">
          <div className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[var(--text-secondary)] group-hover:text-accent group-hover:border-accent/40 group-hover:bg-accent/10 transition-all duration-300">
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>
      </div>
    </BentoTile>
  );
}
