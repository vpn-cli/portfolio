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
          <span className="text-[12px] sm:text-[13px] tracking-wider uppercase text-neutral-500 block mb-2 font-medium font-mono">
            RESOURCES
          </span>

          <p className="text-[19px] sm:text-[22px] xl:text-[24px] 2xl:text-[30px] text-[#f2f2f2] font-normal leading-[1.22] tracking-tight group-hover:text-white transition-colors duration-200">
            Resources to speed your workflow
          </p>
        </div>

        <div className="pt-2 mt-auto flex justify-end">
          <div className="w-10 h-10 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-neutral-300 group-hover:text-white group-hover:border-white/20 transition-all duration-200">
            <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>
      </div>
    </BentoTile>
  );
}
