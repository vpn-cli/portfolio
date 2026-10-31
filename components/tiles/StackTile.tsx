"use client";

import { BentoTile } from "./BentoTile";
import { siteConfig } from "@/content/site";

export function StackTile({ className = "" }: { className?: string }) {
  const getBadgeSymbol = (name: string) => {
    switch (name.toLowerCase()) {
      case "next.js":
        return <span className="font-bold text-xs tracking-tighter text-white">N</span>;
      case "react":
        return <span className="text-neutral-300 font-bold text-xs">⚛</span>;
      case "typescript":
        return <span className="text-neutral-300 font-bold text-[10px]">TS</span>;
      case "node.js":
        return <span className="text-neutral-300 font-bold text-xs">⬢</span>;
      case "tailwind":
        return <span className="text-neutral-300 font-bold text-xs">≈</span>;
      case "three.js":
        return <span className="text-white font-mono text-[10px] font-bold">3D</span>;
      case "figma":
        return <span className="text-neutral-300 font-bold text-xs">❖</span>;
      default:
        return <span className="text-neutral-300 text-xs">●</span>;
    }
  };

  return (
    <BentoTile className={className}>
      <div className="w-full h-full flex flex-col justify-between py-0.5">
        <span className="type-label2 text-neutral-500 font-medium block">
          Stack I use
        </span>

        {/* Clean Row of Squircle App Badges (Exact match to Screenshot 2026-10-31 210314.png) */}
        <div className="flex items-center gap-2.5 my-auto">
          {siteConfig.techStack.slice(0, 4).map((tech) => (
            <div
              key={tech.name}
              title={tech.name}
              data-cursor="pointer"
              data-cursor-text={tech.name}
              className="w-10 h-10 rounded-[14px] bg-[#1A1B20] border border-white/[0.08] flex items-center justify-center hover:border-white/25 transition-all duration-200"
            >
              {getBadgeSymbol(tech.name)}
            </div>
          ))}
        </div>

        <span className="text-[11px] font-mono text-neutral-600">
          Core toolchain
        </span>
      </div>
    </BentoTile>
  );
}
