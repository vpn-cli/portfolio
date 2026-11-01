"use client";

import { BentoTile } from "./BentoTile";
import { SiGithub, SiLinkedin } from "react-icons/si";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/content/site";

interface SocialItem {
  key: "github" | "linkedin";
  label: string;
  handle: string;
  url: string;
  ariaLabel: string;
  cursorText: string;
  Icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
}

export function SocialTile({ className = "" }: { className?: string }) {
  const ghConfig = siteConfig.socials.find((s) => s.icon === "github");
  const liConfig = siteConfig.socials.find((s) => s.icon === "linkedin");

  const items: SocialItem[] = [
    {
      key: "github",
      label: ghConfig?.label || "GitHub",
      handle: ghConfig?.handle || "vpn-cli",
      url: ghConfig?.url || "https://github.com/vpn-cli",
      ariaLabel: "GitHub profile",
      cursorText: "GitHub",
      Icon: SiGithub,
    },
    {
      key: "linkedin",
      label: liConfig?.label || "LinkedIn",
      handle: liConfig?.handle || "vpnk2003",
      url: liConfig?.url || "https://www.linkedin.com/in/vpnk2003",
      ariaLabel: "LinkedIn profile",
      cursorText: "LinkedIn",
      Icon: SiLinkedin,
    },
  ];

  return (
    <div className={`grid grid-cols-2 gap-2 sm:gap-3 xl:gap-2.5 2xl:gap-3 w-full h-full ${className}`}>
      {items.map((item) => {
        const IconComponent = item.Icon;
        return (
          <BentoTile
            key={item.key}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            ariaLabel={item.ariaLabel}
            cursorText={item.cursorText}
            noPadding
            className="w-full h-full p-3.5 sm:p-4 2xl:p-5 flex flex-col justify-between"
          >
            {/* Top-Left Logo */}
            <div className="flex items-start justify-start w-full">
              <div className="text-[var(--text-primary)] transition-transform duration-200 motion-safe:group-hover:scale-105 motion-reduce:transform-none">
                <IconComponent className="w-6 h-6 sm:w-6.5 sm:h-6.5 2xl:w-7 2xl:h-7 text-current" aria-hidden="true" />
              </div>
            </div>

            {/* Bottom: Label at bottom-left with handle underneath, and arrow at bottom-right */}
            <div className="w-full mt-auto pt-4 flex flex-col justify-end">
              <span className="text-[14px] sm:text-[15px] 2xl:text-[16px] font-medium text-[var(--text-primary)] block leading-tight tracking-tight">
                {item.label}
              </span>

              <div className="flex items-end justify-between w-full mt-1 sm:mt-1.5 gap-1">
                <span className="text-[10.5px] sm:text-[11.5px] 2xl:text-[12px] text-[var(--text-tertiary)] block truncate font-normal leading-tight min-w-0 flex-1">
                  {item.handle}
                </span>

                <div
                  className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-full bg-[var(--surface-tile)] group-hover:bg-[var(--surface-tile-hover)] border border-[var(--border-subtle)] group-hover:border-[var(--border-hover)] text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] flex items-center justify-center transition-colors duration-200"
                  aria-hidden="true"
                >
                  <ArrowUpRight
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5 motion-reduce:transform-none"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
          </BentoTile>
        );
      })}
    </div>
  );
}
