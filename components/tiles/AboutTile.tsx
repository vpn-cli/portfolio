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
        className="w-full h-full flex flex-col justify-between cursor-pointer group py-0.5"
      >
        <div>
          <span className="type-label2 text-neutral-500 block mb-2.5 font-medium">
            ABOUT
          </span>

          <p className="text-[15px] text-neutral-300 font-normal leading-relaxed group-hover:text-white transition-colors duration-200">
            Passionate about building resilient software and solving complex engineering challenges.
          </p>
        </div>

        <div className="pt-3 mt-auto flex justify-start">
          <div className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-neutral-400 group-hover:text-white group-hover:border-white/20 transition-all duration-200">
            <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>
      </div>
    </BentoTile>
  );
}
