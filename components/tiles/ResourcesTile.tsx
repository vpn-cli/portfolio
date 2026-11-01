"use client";

import { BentoTile } from "./BentoTile";
import { ArrowUpRight } from "lucide-react";
import { usePageTransition } from "@/components/motion/RouteTransition";

export function ResourcesTile({ className = "" }: { className?: string }) {
  const { navigateWithWipe } = usePageTransition();

  return (
    <BentoTile className={className} cursorText="View Resources">
      <div
        onClick={() => navigateWithWipe("/resources")}
        className="w-full h-full flex flex-col justify-between cursor-pointer group py-0.5"
      >
        <div>
          <span className="text-[12px] sm:text-[13px] tracking-wider uppercase text-[var(--text-tertiary)] block mb-2 font-medium font-mono">
            RESOURCES
          </span>

          <p className="text-[19px] sm:text-[22px] xl:text-[24px] 2xl:text-[30px] text-[var(--text-primary)] font-normal leading-[1.22] tracking-tight group-hover:text-black dark:group-hover:text-white transition-colors duration-200">
            Resources to speed your workflow
          </p>
        </div>

        <div className="pt-2 mt-auto flex justify-end">
          <div className="w-10 h-10 rounded-full bg-neutral-100 group-hover:bg-neutral-200/80 border border-black/[0.08] group-hover:border-black/20 text-neutral-700 group-hover:text-black dark:bg-white/[0.05] dark:group-hover:bg-white/[0.1] dark:border-white/[0.08] dark:group-hover:border-white/20 dark:text-neutral-300 dark:group-hover:text-white flex items-center justify-center transition-all duration-200">
            <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>
      </div>
    </BentoTile>
  );
}
