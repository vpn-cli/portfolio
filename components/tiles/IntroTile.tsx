"use client";

import { siteConfig } from "@/content/site";
import { BentoTile } from "./BentoTile";
import { useTheme } from "@/components/motion/ThemeProvider";
import { Sun, Moon } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export function IntroTile({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <BentoTile className={className} noPadding>
      <div className="w-full h-full flex flex-col justify-between p-5 sm:p-6 box-border relative">
        {/* Top Header: Name + Integrated Theme Toggle */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <h1 className="text-[38px] sm:text-[48px] xl:text-[66px] 2xl:text-[72px] font-bold leading-[1.05] text-[var(--text-primary)] tracking-[-0.03em]">
              Hi, I’m {siteConfig.firstName}.
            </h1>

            <p className="text-[18px] xl:text-[20px] text-[var(--text-secondary)] font-normal leading-[1.38] max-w-xl">
              {siteConfig.bio}
            </p>
          </div>

          {/* Compact Integrated Theme Switch */}
          <button
            onClick={toggleTheme}
            type="button"
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            title={`Switch to ${isDark ? "light" : "dark"} mode`}
            className="w-10 h-10 rounded-full bg-[var(--surface-tile-elevated)] hover:bg-[var(--surface-tile-hover)] border border-transparent flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-white/40 active:scale-95"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Bottom Bar: Availability Status Badge */}
        <div className="mt-auto pt-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-[13px] font-medium text-[var(--text-secondary)]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 motion-safe:animate-pulse shrink-0" aria-hidden="true" />
            {/* TODO: Customize exact job-seeker availability wording */}
            <span>{siteConfig.status}</span>
          </div>

          <a
            href={`mailto:${siteConfig.email}?subject=Opportunity%20Inquiry`}
            onClick={() => trackEvent("send_mail_click")}
            className="text-[13px] font-medium px-3.5 py-1.5 rounded-full bg-[var(--surface-tile)] hover:bg-[var(--surface-tile-hover)] border border-transparent text-[var(--text-primary)] transition-colors active:scale-95 cursor-pointer"
          >
            Get in touch
          </a>
        </div>
      </div>
    </BentoTile>
  );
}
