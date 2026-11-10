"use client";

import { BentoTile } from "./BentoTile";
import { ArrowUpRight } from "lucide-react";
import { TransitionLink } from "@/components/motion/RouteTransition";

export function ResourcesTile({ className = "" }: { className?: string }) {
  return (
    <BentoTile className={className} cursorText="View Resources">
      <TransitionLink
        href="/resources"
        trackLocation="resources_tile"
        trackLabel="Resources tile"
        className="w-full h-full flex flex-col justify-between cursor-pointer group py-0.5 no-underline text-inherit"
      >
        <div>
          <span className="text-[13px] text-[var(--text-tertiary)] block mb-2 font-medium">
            Resources
          </span>

          <p className="text-[19px] sm:text-[22px] xl:text-[24px] 2xl:text-[30px] text-[var(--text-primary)] font-normal leading-[1.35] tracking-tight group-hover:text-[var(--text-primary)] transition-colors duration-200">
            Resources to speed your workflow
          </p>
        </div>

        <div className="pt-2 mt-auto flex justify-end">
          <div className="w-10 h-10 rounded-full bg-[var(--surface-tile)] group-hover:bg-[var(--surface-tile-hover)] border border-[var(--border-subtle)] group-hover:border-[var(--border-hover)] text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] flex items-center justify-center transition-colors duration-200">
            <ArrowUpRight className="w-4 h-4 transition-transform duration-200 motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5 motion-reduce:transform-none" aria-hidden="true" />
          </div>
        </div>
      </TransitionLink>
    </BentoTile>
  );
}
