"use client";

import { BentoTile } from "./BentoTile";
import { ArrowUpRight } from "lucide-react";
import { usePageTransition } from "@/components/motion/RouteTransition";

export function ProjectsTile({ className = "" }: { className?: string }) {
  const { navigateWithWipe } = usePageTransition();

  return (
    <BentoTile className={className} cursorText="View projects">
      <div
        onClick={() => navigateWithWipe("/projects")}
        className="w-full h-full flex flex-col justify-between cursor-pointer group select-none relative overflow-hidden"
      >
        {/* Top Header */}
        <div className="z-20 relative">
          <span className="text-[12px] sm:text-[13px] tracking-wider uppercase text-[var(--text-tertiary)] block mb-1 font-medium font-mono">
            PROJECTS
          </span>
          <h2 className="text-[20px] sm:text-[23px] xl:text-[25px] 2xl:text-[28px] font-medium text-[var(--text-primary)] leading-[1.2] tracking-tight group-hover:text-black dark:group-hover:text-white transition-colors duration-200">
            Selected work
          </h2>
        </div>

        {/* Fanned / Layered Mockups Showcase */}
        <div className="relative w-full flex-1 flex items-center justify-center my-auto min-h-[150px] sm:min-h-[180px] xl:min-h-[200px] 2xl:min-h-[240px] overflow-hidden py-1">
          {/* 1. Laptop (Back layer, centered) */}
          <div className="relative z-10 w-[72%] sm:w-[75%] max-w-[400px] aspect-[16/10] rounded-lg sm:rounded-xl overflow-hidden shadow-xl border border-black/15 dark:border-white/10 bg-neutral-900 transition-all duration-500 ease-out group-hover:scale-[1.03] group-hover:-translate-y-1.5">
            <img
              src="/projects/appforge.jpg"
              alt="AppForge SaaS dashboard mockup"
              className="w-full h-full object-cover object-top transition-transform duration-500 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* 2. Left Phone (Overlapping in front on the left, angled -6deg) */}
          <div className="absolute z-20 left-[6%] sm:left-[10%] bottom-0 sm:bottom-1 w-[26%] sm:w-[28%] max-w-[95px] sm:max-w-[130px] xl:max-w-[145px] aspect-[9/16] rounded-md sm:rounded-xl overflow-hidden shadow-2xl border border-black/25 dark:border-white/15 bg-neutral-950 transition-all duration-500 ease-out -rotate-6 group-hover:-rotate-12 group-hover:-translate-x-3.5 group-hover:-translate-y-1.5 group-hover:scale-105">
            <img
              src="/projects/llms-txt.jpg"
              alt="LLMS.txt mobile preview"
              className="w-full h-full object-cover object-center transition-transform duration-500 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* 3. Right Phone (Overlapping in front on the right, angled +6deg) */}
          <div className="absolute z-30 right-[6%] sm:right-[10%] bottom-0 sm:bottom-1 w-[26%] sm:w-[28%] max-w-[95px] sm:max-w-[130px] xl:max-w-[145px] aspect-[9/16] rounded-md sm:rounded-xl overflow-hidden shadow-2xl border border-black/25 dark:border-white/15 bg-neutral-950 transition-all duration-500 ease-out rotate-6 group-hover:rotate-12 group-hover:translate-x-3.5 group-hover:-translate-y-1.5 group-hover:scale-105">
            <img
              src="/projects/sockets.jpg"
              alt="Sockets mobile preview"
              className="w-full h-full object-cover object-center transition-transform duration-500 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Bottom Bar matching About / Resources arrow button */}
        <div className="pt-2 mt-auto flex items-center justify-end gap-2.5 z-20 relative">
          <span className="text-xs sm:text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
            View projects
          </span>
          <div className="w-10 h-10 rounded-full bg-neutral-100 group-hover:bg-neutral-200/80 border border-black/[0.08] group-hover:border-black/20 text-neutral-700 group-hover:text-black dark:bg-white/[0.05] dark:group-hover:bg-white/[0.1] dark:border-white/[0.08] dark:group-hover:border-white/20 dark:text-neutral-300 dark:group-hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm shrink-0">
            <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>
      </div>
    </BentoTile>
  );
}
