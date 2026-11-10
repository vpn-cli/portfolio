"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/content/site";
import { BentoTile } from "./BentoTile";
import { useTheme } from "@/components/motion/ThemeProvider";
import { Sun, Moon } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export function IntroTile({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const isDark = mounted ? theme === "dark" : false;

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

          {/* Compact Integrated Theme Switch: 44x44 target, accent focus ring */}
          <button
            onClick={toggleTheme}
            type="button"
            suppressHydrationWarning
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="w-11 h-11 rounded-full bg-[var(--surface-tile-elevated)] hover:bg-[var(--surface-tile-hover)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:ring-offset-2 active:scale-95"
          >
            <Sun className="w-4 h-4 text-amber-400 hidden dark:block" aria-hidden="true" />
            <Moon className="w-4 h-4 text-slate-700 block dark:hidden" aria-hidden="true" />
          </button>
        </div>

        {/* Bottom Bar: Availability Status Badge + Primary CTA */}
        <div className="mt-auto pt-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-[13px] font-medium text-[var(--text-secondary)]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 motion-safe:animate-pulse shrink-0" aria-hidden="true" />
            <span className="text-pretty">
              <span className="inline-block">Graduating April 2027,</span>{" "}
              <span className="inline-block">looking for SDE roles</span>
            </span>
          </div>

          {/* Primary Action CTA: Accent fill, white text */}
          <a
            href={`mailto:${siteConfig.email}?subject=Opportunity%20Inquiry`}
            data-cta="primary"
            data-ph-capture-attribute-location="intro_tile"
            onClick={() =>
              trackEvent("outbound_click", {
                destination: "email",
                url: `mailto:${siteConfig.email}?subject=Opportunity%20Inquiry`,
                location: "intro_tile",
                label: "Get in touch",
              })
            }
            className="btn-primary text-[13px] min-h-[44px] px-4 py-2 rounded-xl"
          >
            Get in touch
          </a>
        </div>
      </div>
    </BentoTile>
  );
}
