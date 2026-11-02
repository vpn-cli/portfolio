"use client";

import Image from "next/image";
import { Download, ArrowUpRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface AboutHeroProps {
  status: string;
}

export function AboutHero({ status }: AboutHeroProps) {
  return (
    <section aria-labelledby="about-intro-heading" className="w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[var(--border-subtle)]">
        {/* Profile Lockup */}
        <div className="flex items-center gap-5 sm:gap-6">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] shrink-0 shadow-sm">
            <Image
              src="/avatar.jpg"
              alt="Portrait of Vipin Kaushik"
              width={96}
              height={96}
              priority
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 id="about-intro-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                Vipin Kaushik
              </h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-medium bg-[var(--surface-tile-hover)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" aria-hidden="true" />
                {status}
              </span>
            </div>

            <p className="text-sm sm:text-base text-[var(--text-secondary)] font-medium">
              Software Engineer <span className="text-[var(--text-tertiary)] font-normal">(full-stack, backend-leaning)</span>
            </p>

            <p className="text-xs sm:text-sm text-[var(--text-tertiary)] tabular-nums">
              IIT Kharagpur · B.Tech + M.Tech Dual Degree, Chemical Engineering (2022 – 2027)
            </p>
          </div>
        </div>

        {/* Primary Action: Immediate Résumé Download */}
        <div className="w-full md:w-auto shrink-0 pt-2 md:pt-0">
          <a
            href="/resume.pdf"
            download="Vipin_Kaushik_Resume.pdf"
            onClick={() => trackEvent("download_resume_click")}
            className="inline-flex items-center justify-center gap-2 w-full md:w-auto px-5 py-2.5 rounded-xl bg-[var(--text-primary)] text-[var(--bg-canvas)] text-sm font-medium hover:opacity-90 active:scale-98 transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-400 cursor-pointer"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            <span>Download Résumé</span>
          </a>
        </div>
      </div>

      {/* Narrative: 2-3 Plain Sentences Owning the Switch */}
      <div className="pt-8 max-w-3xl">
        <p className="text-lg sm:text-xl text-[var(--text-primary)] font-normal leading-relaxed">
          I study chemical engineering at IIT Kharagpur. Somewhere along the way I started building software, and now I build full-stack apps and the backend systems behind them.
        </p>
      </div>
    </section>
  );
}
