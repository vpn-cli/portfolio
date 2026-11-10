"use client";

import { BentoTile } from "./BentoTile";
import { ArrowUpRight } from "lucide-react";
import { TransitionLink } from "@/components/motion/RouteTransition";

export function AboutTile({ className = "" }: { className?: string }) {
  return (
    <BentoTile className={className} cursorText="Read background">
      <TransitionLink
        href="/about"
        trackLocation="about_tile"
        trackLabel="About tile"
        className="w-full h-full flex flex-col justify-between cursor-pointer group py-0.5 no-underline text-inherit"
      >
        <div className="space-y-2">
          <span className="text-[13px] text-[var(--text-tertiary)] block font-medium">
            Background
          </span>

          <p className="text-[18px] xl:text-[20px] text-[var(--text-primary)] font-normal leading-[1.38] tracking-tight group-hover:text-[var(--text-primary)] transition-colors duration-200">
            On the backend, I focus on distributed systems and real-time data flow, particularly event-driven architectures with Kafka and WebSocket streaming.
          </p>
        </div>

        <div className="pt-2 mt-auto flex items-end">
          <span className="text-[13px] text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] transition-colors py-1 inline-flex items-center gap-1 font-medium">
            <span>Read background</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </TransitionLink>
    </BentoTile>
  );
}
