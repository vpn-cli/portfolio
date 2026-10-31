"use client";

import { BentoTile } from "./BentoTile";
import { ArrowUpRight } from "lucide-react";
import { usePageTransition } from "@/components/motion/RouteTransition";

export function ResourcesTile({ className = "" }: { className?: string }) {
  const { navigateWithWipe } = usePageTransition();

  return (
    <BentoTile className={className} cursorText="View Templates">
      <div
        onClick={() => navigateWithWipe("/resources")}
        className="w-full h-full flex flex-col justify-between cursor-pointer group"
      >
        <div>
          <span className="type-label2 text-[var(--text-tertiary)] block mb-3 font-semibold">
            RESOURCES
          </span>

          <p className="type-body4 text-[var(--text-secondary)] font-normal leading-relaxed group-hover:text-[var(--text-primary)] transition-colors duration-200">
            Open-source boilerplates and templates to speed your development workflow.
          </p>
        </div>

        <div className="pt-4 mt-auto flex justify-start">
          <div className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[var(--text-secondary)] group-hover:text-accent group-hover:border-accent/40 group-hover:bg-accent/10 transition-all duration-300">
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>
      </div>
    </BentoTile>
  );
}
