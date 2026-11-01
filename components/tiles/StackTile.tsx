"use client";

import React from "react";
import type { IconType } from "react-icons";
import {
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiNodedotjs,
  SiTailwindcss,
  SiThreedotjs,
  SiGsap,
  SiPostgresql,
  SiDocker,
  SiFigma,
  SiGit,
  SiGithub,
} from "react-icons/si";
import { BentoTile } from "./BentoTile";
import { siteConfig } from "@/content/site";

// Map each technology name to its official Simple Icons component
const techIconMap: Record<string, IconType> = {
  "next.js": SiNextdotjs,
  "nextjs": SiNextdotjs,
  "react": SiReact,
  "typescript": SiTypescript,
  "node.js": SiNodedotjs,
  "nodejs": SiNodedotjs,
  "tailwind": SiTailwindcss,
  "tailwind css": SiTailwindcss,
  "tailwindcss": SiTailwindcss,
  "three.js": SiThreedotjs,
  "threejs": SiThreedotjs,
  "gsap": SiGsap,
  "postgresql": SiPostgresql,
  "postgres": SiPostgresql,
  "docker": SiDocker,
  "figma": SiFigma,
  "git": SiGit,
  "github": SiGithub,
};

// Official brand colors shown on hover (Next.js and Three.js adapt to current theme)
const getBrandColor = (name: string, fallbackColor?: string): string => {
  const key = name.toLowerCase();
  switch (key) {
    case "next.js":
    case "nextjs":
    case "three.js":
    case "threejs":
      return "var(--text-primary)";
    case "react":
      return "#61DAFB";
    case "typescript":
      return "#3178C6";
    case "node.js":
    case "nodejs":
      return "#5FA04E";
    case "tailwind":
    case "tailwind css":
    case "tailwindcss":
      return "#06B6D4";
    case "gsap":
      return "#88CE02";
    case "postgresql":
    case "postgres":
      return "#4169E1";
    case "docker":
      return "#2496ED";
    case "figma":
      return "#F24E1E";
    case "git":
      return "#F05032";
    default:
      return fallbackColor || "var(--text-primary)";
  }
};

export function StackTile({ className = "" }: { className?: string }) {
  // Duplicate for seamless infinite loop with accessibility flags
  const primaryItems = siteConfig.techStack.map((tech) => ({
    ...tech,
    isDuplicate: false,
  }));
  const duplicateItems = siteConfig.techStack.map((tech) => ({
    ...tech,
    isDuplicate: true,
  }));
  const marqueeItems = [...primaryItems, ...duplicateItems];

  return (
    <BentoTile className={className} noPadding>
      <div className="w-full h-full flex flex-col justify-between p-5 sm:p-6 overflow-hidden">
        {/* Header */}
        <h3 className="text-[20px] sm:text-[22px] font-medium text-[var(--text-primary)] tracking-tight">
          Stack I use
        </h3>

        {/* Visually hidden list for screen readers */}
        <div className="sr-only">
          <h4>Technologies and engineering toolchain</h4>
          <ul>
            {siteConfig.techStack.map((tech) => (
              <li key={tech.name}>
                {tech.name}: {tech.category}
              </li>
            ))}
          </ul>
        </div>

        {/* Logo squares overflowing into infinite marquee with edge fade mask */}
        <div className="relative w-full overflow-hidden my-auto py-2 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="animate-marquee motion-reduce:animate-none flex items-center gap-3">
            {marqueeItems.map((tech, idx) => {
              const IconComponent = techIconMap[tech.name.toLowerCase()];
              const brandColor = getBrandColor(tech.name, tech.color);

              return (
                <div
                  key={`${tech.name}-${idx}`}
                  role={tech.isDuplicate ? undefined : "img"}
                  aria-label={tech.isDuplicate ? undefined : tech.name}
                  aria-hidden={tech.isDuplicate ? "true" : undefined}
                  title={tech.name}
                  data-cursor="pointer"
                  data-cursor-text={tech.name}
                  style={{ "--brand-color": brandColor } as React.CSSProperties}
                  className="w-[52px] h-[52px] sm:w-[56px] sm:h-[56px] 2xl:w-[64px] 2xl:h-[64px] rounded-[16px] bg-neutral-100 hover:bg-neutral-200/80 border border-black/[0.08] hover:border-black/20 dark:bg-[var(--surface-tile)] dark:border-white/[0.08] dark:hover:border-white/25 dark:hover:bg-[var(--surface-tile-hover)] flex items-center justify-center shrink-0 transition-colors duration-200 group relative"
                >
                  <div className="motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover:scale-110 motion-reduce:transform-none flex items-center justify-center">
                    {IconComponent ? (
                      <IconComponent
                        className="w-[24px] h-[24px] sm:w-[26px] sm:h-[26px] text-[var(--text-secondary)] group-hover:text-[var(--brand-color)] transition-colors duration-200 shrink-0"
                        aria-hidden="true"
                      />
                    ) : (
                      <span className="text-neutral-800 dark:text-neutral-300 font-bold text-[13px]">
                        {tech.name.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </BentoTile>
  );
}
