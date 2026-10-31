"use client";

import { BentoTile } from "./BentoTile";
import { siteConfig } from "@/content/site";
import {
  Code2,
  Cpu,
  Layers,
  Terminal,
  Database,
  Globe,
  Palette,
  Sparkles,
} from "lucide-react";

export function StackTile({ className = "" }: { className?: string }) {
  // Map tech stack to curated visual badges matching references
  const getBadgeIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case "next.js":
        return <span className="font-bold text-xs tracking-tighter">N</span>;
      case "react":
        return <span className="text-cyan-400 font-bold text-xs">⚛</span>;
      case "typescript":
        return <span className="text-blue-400 font-bold text-[10px]">TS</span>;
      case "node.js":
        return <span className="text-emerald-400 font-bold text-xs">⬢</span>;
      case "tailwind":
        return <span className="text-teal-400 font-bold text-xs">≈</span>;
      case "three.js":
        return <span className="font-bold text-xs">3D</span>;
      case "figma":
        return <span className="text-amber-400 font-bold text-xs">❖</span>;
      default:
        return <Code2 className="w-4 h-4 text-accent" />;
    }
  };

  return (
    <BentoTile className={className}>
      <div className="w-full h-full flex flex-col justify-between py-1">
        <h3 className="type-h4 font-display font-medium text-[var(--text-primary)] mb-3">
          Stack I use
        </h3>

        {/* Row of Rounded App Icons (Matching Reference screenshot 210314.png) */}
        <div className="flex flex-wrap items-center gap-2.5 my-auto">
          {siteConfig.techStack.slice(0, 6).map((tech) => (
            <div
              key={tech.name}
              title={tech.name}
              data-cursor="pointer"
              data-cursor-text={tech.name}
              className="w-11 h-11 rounded-[16px] bg-white/[0.04] dark:bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[var(--text-primary)] hover:border-accent hover:scale-105 hover:bg-white/[0.08] transition-all duration-200 shadow-sm"
            >
              {getBadgeIcon(tech.name)}
            </div>
          ))}
        </div>

        <p className="text-[11px] font-mono text-[var(--text-tertiary)] pt-2 border-t border-white/[0.06]">
          Next.js 15 • TypeScript • Three.js
        </p>
      </div>
    </BentoTile>
  );
}
