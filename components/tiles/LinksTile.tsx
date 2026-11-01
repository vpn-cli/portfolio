"use client";

import { BentoTile } from "./BentoTile";
import { SiGithub, SiLinkedin } from "react-icons/si";
import { FileText, ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/content/site";

interface LinkRowItem {
  id: string;
  label: string;
  subtext: string;
  url: string;
  ariaLabel: string;
  renderIcon: (props: { className: string }) => React.ReactNode;
}

export function LinksTile({ className = "" }: { className?: string }) {
  const ghConfig = siteConfig.socials.find((s) => s.icon === "github");
  const liConfig = siteConfig.socials.find((s) => s.icon === "linkedin");

  const links: LinkRowItem[] = [
    {
      id: "github",
      label: ghConfig?.label || "GitHub",
      subtext: `@${ghConfig?.handle || "vpn-cli"}`,
      url: ghConfig?.url || "https://github.com/vpn-cli",
      ariaLabel: "GitHub profile",
      renderIcon: ({ className }) => (
        <SiGithub className={className} aria-hidden="true" />
      ),
    },
    {
      id: "linkedin",
      label: liConfig?.label || "LinkedIn",
      subtext: `/in/${liConfig?.handle || "vpnk2003"}`,
      url: liConfig?.url || "https://www.linkedin.com/in/vpnk2003",
      ariaLabel: "LinkedIn profile",
      renderIcon: ({ className }) => (
        <SiLinkedin className={className} aria-hidden="true" />
      ),
    },
    {
      id: "resume",
      label: "Résumé",
      subtext: "PDF",
      url: "/resume.pdf",
      ariaLabel: "View résumé PDF",
      renderIcon: ({ className }) => (
        <FileText className={className} strokeWidth={2.2} aria-hidden="true" />
      ),
    },
  ];

  return (
    <BentoTile className={className} noPadding enableTilt={false}>
      <nav
        aria-label="Profiles and Résumé Links"
        className="w-full h-full flex flex-col justify-between gap-1.5 p-1.5 sm:p-2 select-none"
      >
        {links.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.ariaLabel}
            style={{
              gridTemplateColumns: "24px 1fr 32px",
              columnGap: "12px",
              alignItems: "center",
            }}
            className="group/row min-h-0 w-full flex-1 grid px-5 sm:px-6 rounded-xl bg-[var(--surface-tile-elevated)] hover:bg-[var(--surface-tile-hover)] border border-transparent transition-[background-color,transform] duration-150 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400 dark:focus-visible:ring-white/40"
          >
            {/* 1. Icon column (24px wide, optically centered, balanced weight) */}
            <div className="w-6 h-6 flex items-center justify-center shrink-0 text-[var(--text-primary)] transition-transform duration-200 motion-safe:group-hover/row:scale-105 motion-reduce:transform-none">
              {item.renderIcon({ className: "w-5 h-5 text-current shrink-0" })}
            </div>

            {/* 2. Text column (min-width: 0 so it never pushes into or under arrow; title on top, subtitle below; truncated) */}
            <div className="min-w-0 flex flex-col justify-center">
              <span className="text-[16px] font-medium text-[var(--text-primary)] leading-tight truncate">
                {item.label}
              </span>
              <span className="text-[13px] text-[var(--text-tertiary)] leading-tight mt-0.5 truncate">
                {item.subtext}
              </span>
            </div>

            {/* 3. Arrow button (32px wide, vertically centered against the whole row, same distance from right edge) */}
            <div
              className="w-8 h-8 rounded-full bg-[var(--surface-tile)] group-hover/row:bg-[var(--surface-tile-hover)] border border-transparent text-[var(--text-secondary)] group-hover/row:text-[var(--text-primary)] flex items-center justify-center transition-colors duration-200 shrink-0"
              aria-hidden="true"
            >
              <ArrowUpRight
                className="w-4 h-4 transition-transform duration-200 motion-safe:group-hover/row:translate-x-0.5 motion-safe:group-hover/row:-translate-y-0.5 motion-reduce:transform-none"
                aria-hidden="true"
              />
            </div>
          </a>
        ))}
      </nav>
    </BentoTile>
  );
}
