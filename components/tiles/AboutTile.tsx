"use client";

import { BentoTile } from "./BentoTile";
import { ArrowUpRight } from "lucide-react";
import { usePageTransition } from "@/components/motion/RouteTransition";

export function AboutTile({ className = "" }: { className?: string }) {
  const { navigateWithWipe } = usePageTransition();

  return (
    <BentoTile className={className} cursorText="Read background">
      <div
        onClick={() => navigateWithWipe("/about")}
        className="w-full h-full flex flex-col justify-between cursor-pointer group py-0.5"
      >
        <div className="space-y-2">
          <span className="text-[13px] text-[var(--text-tertiary)] block font-medium">
            Background
          </span>

          <p className="text-[18px] xl:text-[20px] text-[var(--text-primary)] font-normal leading-[1.38] tracking-tight group-hover:text-[var(--text-primary)] transition-colors duration-200">
            On the backend, I focus on distributed systems and real-time data flow, particularly event-driven architectures with Kafka and WebSocket streaming.
          </p>
        </div>

        <div className="pt-2 mt-auto flex items-end justify-between">
          <span className="text-[13px] text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] transition-colors py-1 inline-flex items-center gap-1 font-medium">
            <span>Read background</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>

          <div className="w-10 h-10 rounded-full bg-[var(--surface-tile)] group-hover:bg-[var(--surface-tile-hover)] border border-transparent group-hover:border-[var(--border-hover)] text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] flex items-center justify-center transition-colors duration-200">
            <ArrowUpRight
              className="w-4 h-4 transition-transform duration-200 motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5 motion-reduce:transform-none"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </BentoTile>
  );
}
