"use client";

import { siteConfig } from "@/content/site";
import { TransitionLink } from "@/components/motion/RouteTransition";
import { X } from "lucide-react";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutExperience } from "@/components/about/AboutExperience";
import { AboutTimeline } from "@/components/about/AboutTimeline";
import { AboutPrinciples } from "@/components/about/AboutPrinciples";
import { AboutGallery } from "@/components/about/AboutGallery";
import { AboutCurrentFocus } from "@/components/about/AboutCurrentFocus";
import { AboutContact } from "@/components/about/AboutContact";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] p-3 sm:p-4 lg:p-6 flex flex-col items-center">
      {/* Shell Container */}
      <div className="w-full max-w-[1280px] min-h-[calc(100vh-48px)] rounded-[32px] sm:rounded-[36px] bg-[var(--bg-canvas-subtle)] border border-[var(--border-subtle)] p-6 sm:p-10 lg:p-14 shadow-sm flex flex-col items-center">
        {/* Top Floating Close Pill */}
        <div className="w-full flex justify-between items-center mb-8 sm:mb-12">
          <span className="text-sm font-medium text-[var(--text-secondary)]">
            About
          </span>

          <TransitionLink
            href="/"
            className="w-10 h-10 rounded-full bg-[var(--surface-tile)] hover:bg-[var(--surface-tile-hover)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] flex items-center justify-center transition-colors text-[var(--text-primary)] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-white/40 active:scale-95"
            title="Back to home"
            aria-label="Back to home"
          >
            <X className="w-5 h-5 opacity-80" aria-hidden="true" />
          </TransitionLink>
        </div>

        {/* Structured Content Column */}
        <div className="w-full max-w-4xl space-y-14 sm:space-y-16">
          {/* 1. OPENING */}
          <AboutHero status={siteConfig.status} />

          {/* 2. EXPERIENCE */}
          <AboutExperience />

          {/* 3. HOW I GOT HERE */}
          <AboutTimeline />

          {/* 4. HOW I WORK */}
          <AboutPrinciples />

          {/* 5. DESIGN & ART */}
          <AboutGallery />

          {/* 6. RIGHT NOW */}
          <AboutCurrentFocus />

          {/* 7. CLOSE */}
          <AboutContact />
        </div>
      </div>
    </main>
  );
}
