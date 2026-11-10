"use client";

import { BentoTile } from "./BentoTile";
import { DynamicPrism } from "@/components/three/DynamicPrism";

export function ThreeTile({ className = "" }: { className?: string }) {
  return (
    <BentoTile className={className} enableTilt={false} noPadding>
      <div className="w-full h-full relative overflow-hidden flex flex-col justify-between p-4">
        {/* Subtle Header */}
        <div className="flex items-center justify-between z-20">
          <span className="text-[13px] text-[var(--text-secondary)] font-medium">
            Interactive 3D
          </span>
          <span className="text-[13px] text-[var(--text-tertiary)]">
            R3F / Glass
          </span>
        </div>

        {/* 3D Scene */}
        <div className="absolute inset-0 flex items-center justify-center">
          <DynamicPrism />
        </div>

        {/* Footer */}
        <div className="z-20 pt-1 text-[13px] text-[var(--text-tertiary)] flex items-center justify-between">
          <span>Drag to refract</span>
          <span>512px / HDR</span>
        </div>
      </div>
    </BentoTile>
  );
}
