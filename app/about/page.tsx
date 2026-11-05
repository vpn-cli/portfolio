"use client";

import { siteConfig } from "@/content/site";
import { TransitionLink } from "@/components/motion/RouteTransition";
import { X, ArrowLeft } from "lucide-react";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutWorkbench } from "@/components/about/AboutWorkbench";
import { AboutExperience } from "@/components/about/AboutExperience";
import { AboutTimeline } from "@/components/about/AboutTimeline";
import { AboutPrinciples } from "@/components/about/AboutPrinciples";
import { AboutGallery } from "@/components/about/AboutGallery";
import { AboutCurrentFocus } from "@/components/about/AboutCurrentFocus";
import { AboutContact } from "@/components/about/AboutContact";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] p-3 sm:p-4 lg:p-6 flex flex-col items-center">
      {/* Outer Shell Container */}
      <div className="w-full max-w-[1280px] min-h-[calc(100vh-48px)] rounded-[32px] sm:rounded-[36px] bg-[var(--bg-canvas-subtle)] border border-[var(--border-subtle)] p-5 sm:p-8 lg:p-12 shadow-sm flex flex-col items-center">
        {/* Top Floating Navigation Bar */}
        <div className="w-full flex justify-between items-center mb-8 sm:mb-12">
          <TransitionLink
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Back to Home</span>
          </TransitionLink>

          <TransitionLink
            href="/"
            className="w-10 h-10 rounded-full bg-[var(--surface-tile)] hover:bg-[var(--surface-tile-hover)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] flex items-center justify-center transition-colors text-[var(--text-primary)] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-white/40 active:scale-95 cursor-pointer"
            title="Close and return to home"
            aria-label="Close and return to home"
          >
            <X className="w-5 h-5 opacity-80" aria-hidden="true" />
          </TransitionLink>
        </div>

        {/* Structured Content Column */}
        <div className="w-full max-w-5xl space-y-14 sm:space-y-18">
          {/* 1. ARCHITECTURAL HERO */}
          <AboutHero status={siteConfig.status} />

          {/* 2. INTERACTIVE STAGESHOW WORKBENCH */}
          <AboutWorkbench />

          {/* 3. PRODUCTION EXPERIENCE */}
          <AboutExperience />

          {/* 4. CHRONOLOGY & MILESTONES WITH STAGESHOW PREVIEWS */}
          <AboutTimeline />

          {/* 5. ARCHITECTURAL PRINCIPLES WITH INTERACTIVE BENCHMARKS */}
          <AboutPrinciples />

          {/* 6. DESIGN & ART EXHIBITION */}
          <AboutGallery />

          {/* 7. CURRENT FOCUS */}
          <AboutCurrentFocus />

          {/* 8. DESK STATION & CONTACT */}
          <AboutContact />
        </div>
      </div>
    </main>
  );
}