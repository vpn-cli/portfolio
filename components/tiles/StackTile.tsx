"use client";

import { BentoTile } from "./BentoTile";
import { siteConfig } from "@/content/site";

export function StackTile({ className = "" }: { className?: string }) {
  const getBadgeIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case "next.js":
        return (
          <svg className="w-8 h-8" viewBox="0 0 180 180">
            <mask height="180" id="mask0" maskUnits="userSpaceOnUse" width="180" x="0" y="0">
              <circle cx="90" cy="90" fill="white" r="90" />
            </mask>
            <g mask="url(#mask0)">
              <circle cx="90" cy="90" className="fill-black dark:fill-white" r="90" />
              <path d="M149.508 157.438L69.1478 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.137 149.508 157.438Z" className="fill-white dark:fill-black" />
              <rect height="72" width="12" className="fill-white dark:fill-black" x="115" y="54" />
            </g>
          </svg>
        );
      case "react":
        return (
          <svg className="w-8 h-8 text-neutral-800 dark:text-neutral-300 fill-none stroke-current stroke-[1.5]" viewBox="-11.5 -10.23174 23 20.46348">
            <circle cx="0" cy="0" r="2.05" fill="currentColor" />
            <g stroke="currentColor">
              <ellipse rx="11" ry="4.2" />
              <ellipse rx="11" ry="4.2" transform="rotate(60)" />
              <ellipse rx="11" ry="4.2" transform="rotate(120)" />
            </g>
          </svg>
        );
      case "typescript":
        return (
          <div className="w-8 h-8 rounded bg-neutral-200 border border-neutral-300 text-neutral-800 dark:bg-white/[0.08] dark:border-white/10 dark:text-neutral-200 flex items-center justify-center font-bold text-sm font-mono">
            TS
          </div>
        );
      case "node.js":
        return (
          <svg className="w-8 h-8 text-neutral-800 dark:text-neutral-300 fill-current" viewBox="0 0 24 24">
            <path d="M12 2.5l9 5.2v10.4l-9 5.2-9-5.2V7.7l9-5.2zm0 2.3L4.8 9v6.5l7.2 4.2 7.2-4.2V9L12 4.8z" />
          </svg>
        );
      case "tailwind":
        return (
          <svg className="w-8 h-8 text-neutral-800 dark:text-neutral-300 fill-current" viewBox="0 0 24 24">
            <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
          </svg>
        );
      case "three.js":
        return (
          <span className="text-neutral-900 dark:text-white font-mono text-sm font-bold tracking-tight">
            3D
          </span>
        );
      case "gsap":
        return (
          <span className="text-neutral-900 dark:text-neutral-200 font-bold text-xs tracking-wider">
            GSAP
          </span>
        );
      case "docker":
        return (
          <svg className="w-8 h-8 text-neutral-800 dark:text-neutral-300 fill-current" viewBox="0 0 24 24">
            <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.186.185.186zm0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.186.185.186zm-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.186.185.186zm-2.954 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.145a.185.185 0 00-.185.185v1.887c0 .102.083.186.185.186zm5.884 2.714h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185zm-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186H8.1a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185zm-2.954 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186H5.145a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185zm-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.082.185.184.185z" />
          </svg>
        );
      case "figma":
        return (
          <svg className="w-8 h-8 text-neutral-800 dark:text-neutral-300 fill-current" viewBox="0 0 24 24">
            <path d="M12 12a3 3 0 113-3 3 3 0 01-3 3zm0 0a3 3 0 103 3 3 3 0 00-3-3zm-6-6a3 3 0 103 3 3 3 0 00-3-3zm0 6a3 3 0 103 3 3 3 0 00-3-3zm0 6a3 3 0 103 3 3 3 0 00-3-3z" />
          </svg>
        );
      default:
        return <span className="text-neutral-800 dark:text-neutral-300 font-bold text-xs">{name.slice(0, 2).toUpperCase()}</span>;
    }
  };

  // Duplicate for seamless infinite loop
  const marqueeItems = [...siteConfig.techStack, ...siteConfig.techStack];

  return (
    <BentoTile className={className} noPadding>
      <div className="w-full h-full flex flex-col justify-between p-5 sm:p-6 overflow-hidden">
        <h3 className="text-[20px] sm:text-[22px] font-medium text-[var(--text-primary)] tracking-tight">
          Stack I use
        </h3>

        {/* 72px rounded logo squares overflowing into infinite marquee with edge fade mask */}
        <div className="relative w-full overflow-hidden my-auto py-1 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="animate-marquee flex items-center gap-3">
            {marqueeItems.map((tech, idx) => (
              <div
                key={`${tech.name}-${idx}`}
                title={tech.name}
                data-cursor="pointer"
                data-cursor-text={tech.name}
                className="w-[60px] h-[60px] 2xl:w-[72px] 2xl:h-[72px] rounded-[18px] bg-neutral-100 hover:bg-neutral-200/80 border border-black/[0.08] hover:border-black/20 dark:bg-[#1a1b20] dark:border-white/[0.08] dark:hover:border-white/25 dark:hover:bg-[#222329] flex items-center justify-center shrink-0 transition-all duration-200 group"
              >
                <div className="transition-transform duration-200 group-hover:scale-110">
                  {getBadgeIcon(tech.name)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <span className="text-[12px] font-mono text-[var(--text-secondary)]">
          Core engineering toolchain
        </span>
      </div>
    </BentoTile>
  );
}
