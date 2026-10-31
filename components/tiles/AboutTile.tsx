"use client";

import { BentoTile } from "./BentoTile";
import { ArrowUpRight, Compass } from "lucide-react";
import { siteConfig } from "@/content/site";
import { usePageTransition } from "@/components/motion/RouteTransition";

export function AboutTile({ className = "" }: { className?: string }) {
  const { navigateWithWipe } = usePageTransition();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigateWithWipe("/about");
  };

  return (
    <div className={className}>
      <BentoTile
        cursorText="Read Bio"
        className="h-full group cursor-pointer"
        tabIndex={0}
      >
        <div
          onClick={handleClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              navigateWithWipe("/about");
            }
          }}
          className="w-full h-full flex flex-col justify-between"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/25 flex items-center justify-center text-accent">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-display group-hover:text-accent transition-colors">
                  Design Ethos & Craft
                </h3>
                <p className="text-xs text-white/50">Philosophy & Experience</p>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/10 group-hover:border-accent/40 group-hover:bg-accent/10 group-hover:text-accent flex items-center justify-center text-white/60 transition-all">
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>

          {/* Quote / Ethos */}
          <blockquote className="my-auto text-sm sm:text-base text-white/80 font-light italic leading-relaxed border-l-2 border-accent/40 pl-4 py-1">
            "{siteConfig.about.heroStatement}"
          </blockquote>

          {/* Footer stats */}
          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-white/40">
            <span>6+ Years Crafting Digital Products</span>
            <span className="text-accent group-hover:underline">Explore About →</span>
          </div>
        </div>
      </BentoTile>
    </div>
  );
}

