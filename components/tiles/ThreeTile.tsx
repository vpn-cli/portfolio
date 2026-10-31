"use client";

import { BentoTile } from "./BentoTile";
import { DynamicPrism } from "@/components/three/DynamicPrism";
import { Box, Sparkles } from "lucide-react";

export function ThreeTile({ className = "" }: { className?: string }) {
  return (
    <BentoTile className={className} enableTilt={false}>
      <div className="w-full h-full flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between z-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/25 flex items-center justify-center text-accent">
              <Box className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white/90">Prismatic Core</h3>
              <p className="text-[11px] text-white/40">Refraction & Inertia</p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-mono text-accent/80 px-2 py-0.5 rounded border border-accent/20 bg-accent/5">
            <Sparkles className="w-3 h-3 text-accent" />
            <span>Interactive 3D</span>
          </div>
        </div>

        {/* Dynamic 3D Scene */}
        <div className="relative w-full flex-1 my-2">
          <DynamicPrism />
        </div>

        {/* Footer */}
        <div className="z-20 pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-white/40">
          <span>Tilt & Drag to Refract Light</span>
          <span className="font-mono">R3F // Three.js</span>
        </div>
      </div>
    </BentoTile>
  );
}

