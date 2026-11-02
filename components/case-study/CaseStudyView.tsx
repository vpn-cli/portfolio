"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CaseStudy } from "@/data/projects";
import { siteConfig } from "@/content/site";
import { TransitionLink } from "@/components/motion/RouteTransition";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
  FileText,
  Mail,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import { SiGithub } from "react-icons/si";

import { TableOfContents } from "./TableOfContents";
import { CaseStudyHero } from "./CaseStudyHero";
import { ProblemSplitVisual } from "./ProblemSplitVisual";
import { InteractiveArchitecture } from "./InteractiveArchitecture";
import { DecisionRows } from "./DecisionRows";
import { BugCards } from "./BugCards";
import { NextStepsSection } from "./NextStepsSection";

export function CaseStudyView({ project }: { project: CaseStudy }) {
  const router = useRouter();
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);

  // Filter out all TODO (unsourced) metrics and configuration values.
  // Only verified outcome/result metrics render. If none exist, render no metric row.
  const verifiedMetrics = (project.metrics || []).filter(
    (m) => !m.isTodo && !m.isConfig
  );
  const [showMetaDetails, setShowMetaDetails] = useState(false);

  // Esc key navigates back to /projects
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        router.push("/projects");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  // Compute Prev & Next projects from siteConfig
  const currentIndex = siteConfig.projects.findIndex((p) => p.slug === project.slug);
  const prevProject =
    siteConfig.projects[(currentIndex - 1 + siteConfig.projects.length) % siteConfig.projects.length];
  const nextProject = siteConfig.projects[(currentIndex + 1) % siteConfig.projects.length];

  const liveUrl = project.links.demo || project.liveUrl;
  const githubUrl = project.links.repo || project.githubUrl;

  return (
    <main className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex flex-col items-center">
      <div className="w-full max-w-[var(--layout-max-width)] space-y-10 sm:space-y-12">
        {/* ━━━ TOP BAR NAVIGATION ━━━ */}
        <nav
          aria-label="Case study navigation"
          className="w-full flex items-center justify-between py-3 border-b border-[var(--border-subtle)]"
        >
          {/* Left: ← All work + Category Badge */}
          <div className="flex items-center gap-3">
            <TransitionLink
              href="/projects"
              className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
            >
              <ArrowLeft
                className="w-4 h-4 transition-transform motion-reduce:transform-none group-hover:-translate-x-1"
                aria-hidden="true"
              />
              <span>All work</span>
            </TransitionLink>

            <span className="text-[var(--border-subtle)] hidden sm:inline" aria-hidden="true">
              |
            </span>

            <span className="hidden sm:inline-flex text-xs font-normal text-[var(--text-secondary)] px-2.5 py-0.5 rounded-full bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)]">
              {project.category}
            </span>
          </div>

          {/* Right: Prev / Next project links */}
          <div className="flex items-center gap-3 sm:gap-5 text-sm">
            <TransitionLink
              href={`/work/${prevProject.slug}`}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors hidden sm:inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
              title={`Previous project: ${prevProject.title}`}
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{prevProject.title}</span>
            </TransitionLink>

            <span className="text-[var(--border-subtle)] hidden sm:inline" aria-hidden="true">
              |
            </span>

            <TransitionLink
              href={`/work/${nextProject.slug}`}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors inline-flex items-center gap-1.5 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
              title={`Next project: ${nextProject.title}`}
            >
              <span>{nextProject.title}</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </TransitionLink>
          </div>
        </nav>

        {/* ━━━ MAIN GRID: STICKY TOC (DESKTOP) + 6 STORY SECTIONS (RIGHT) ━━━ */}
        <div className="w-full flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">
          <TableOfContents />

          <div className="flex-1 min-w-0 w-full space-y-20 sm:space-y-28">
            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                1. HOOK (REPLACES TL;DR + CONTEXT + RESULTS)
                ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <section id="hook" aria-label="Project overview" className="space-y-8">
              {/* Plain Title & One Sentence Pitch (≤20 words, first-person, no résumé verbs) */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-[var(--text-tertiary)]">
                    {project.year}
                  </span>
                  <span className="text-[var(--border-subtle)]" aria-hidden="true">
                    ·
                  </span>
                  <span className="text-xs text-[var(--text-secondary)]">
                    {project.category}
                  </span>
                </div>

                <h1 className="type-h1 font-display font-medium text-[var(--text-primary)] tracking-tight">
                  {project.title}
                </h1>

                <p className="type-body2 text-[var(--text-primary)] font-medium leading-relaxed max-w-[65ch]">
                  {project.hookPitch}
                </p>
              </div>

              {/* Hero Visual: Real Application Clip / Pipeline (Dominates >50% Viewport) */}
              <div className="w-full">
                <CaseStudyHero project={project} />
              </div>

              {/* Metric Chips with Measurement Tooltips (only verified result metrics; no row if empty) */}
              {verifiedMetrics.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {verifiedMetrics.slice(0, 3).map((metric, idx) => (
                    <div
                      key={idx}
                      className="relative rounded-xl p-4 bg-[var(--surface-tile)] border border-[var(--border-subtle)] flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-lg sm:text-xl font-medium text-[var(--text-primary)]">
                            {metric.value}
                          </span>
                        </div>

                        {/* Tooltip trigger button */}
                        <button
                          type="button"
                          onClick={() => setActiveTooltip(activeTooltip === idx ? null : idx)}
                          onMouseEnter={() => setActiveTooltip(idx)}
                          onMouseLeave={() => setActiveTooltip(null)}
                          className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] p-1 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
                          aria-label={`How ${metric.label} was measured`}
                        >
                          <HelpCircle className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </div>

                      <span className="text-xs text-[var(--text-secondary)] mt-1 block">
                        {metric.label}
                      </span>

                      {/* Measurement Tooltip Box */}
                      {activeTooltip === idx && (
                        <div className="absolute left-2 right-2 bottom-full mb-2 p-3 rounded-lg bg-[var(--surface-tile-elevated)] border border-[var(--border-hover)] text-[11px] text-[var(--text-secondary)] shadow-lg z-30 animate-in fade-in duration-150">
                          <span className="font-medium text-[var(--text-primary)] block mb-0.5">
                            How measured:
                          </span>
                          {metric.howMeasured}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Meta Row: Role · Timeline · Stack Details Expander */}
              <div className="pt-3 border-t border-[var(--border-subtle)] text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                    <span className="font-medium text-[var(--text-primary)]">{project.role}</span>
                    <span className="text-[var(--border-subtle)]" aria-hidden="true">·</span>
                    <span>{project.timeline}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowMetaDetails(!showMetaDetails)}
                    aria-expanded={showMetaDetails}
                    aria-controls="hook-meta-details"
                    className="min-h-[36px] text-xs font-mono text-[var(--text-tertiary)] hover:text-[var(--text-primary)] inline-flex items-center gap-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
                  >
                    <span>{showMetaDetails ? "Hide stack" : `Stack (${project.stack.length})`}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        showMetaDetails ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                </div>

                {showMetaDetails && (
                  <div id="hook-meta-details" className="pt-3 mt-3 border-t border-[var(--border-subtle)] flex flex-wrap gap-1.5 animate-in fade-in duration-150">
                    {project.stack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-[var(--surface-tile)] border border-[var(--border-subtle)] text-[var(--text-secondary)]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* CTAs on ONE row + Cold Start Note */}
              <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)]">
                <div className="flex flex-wrap items-center gap-3">
                  {liveUrl && (
                    <a
                      href={liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[44px] inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--text-primary)] text-[var(--bg-canvas)] hover:opacity-90 font-medium text-sm transition-opacity shadow-sm motion-safe:active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-white/40"
                    >
                      <ExternalLink className="w-4 h-4" aria-hidden="true" />
                      <span>Live demo</span>
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-80" aria-hidden="true" />
                    </a>
                  )}

                  {githubUrl && (
                    <a
                      href={githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--surface-tile)] hover:bg-[var(--surface-tile-hover)] border border-[var(--border-subtle)] text-sm font-medium text-[var(--text-primary)] transition-colors shadow-sm motion-safe:active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
                    >
                      <SiGithub className="w-4 h-4" aria-hidden="true" />
                      <span>GitHub</span>
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-60" aria-hidden="true" />
                    </a>
                  )}

                  {project.links.readme && (
                    <a
                      href={project.links.readme}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors underline decoration-[var(--border-subtle)] underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
                    >
                      <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>README</span>
                    </a>
                  )}
                </div>
              </div>
            </section>

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                2. THE PROBLEM (CLAIM + ≤50 WORDS + SPLIT VISUAL)
                ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <section id="problem" aria-label="The problem" className="space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-tertiary)]">
                  02 · The Problem
                </span>
                <h2 className="type-h2 font-display font-medium text-[var(--text-primary)] tracking-tight max-w-[65ch]">
                  {project.problemClaim}
                </h2>
                <p className="type-body4 text-[var(--text-secondary)] leading-relaxed max-w-[65ch]">
                  {project.problemText}
                </p>
              </div>

              <ProblemSplitVisual
                before={project.problemComparison.before}
                after={project.problemComparison.after}
                slug={project.slug}
                caption={project.problemVisualCaption}
              />
            </section>

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                3. HOW IT WORKS (CLAIM + ≤50 WORDS + INTERACTIVE ARCHITECTURE)
                ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <section id="architecture" aria-label="Architecture and data flow" className="space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-tertiary)]">
                  03 · How It Works
                </span>
                <h2 className="type-h2 font-display font-medium text-[var(--text-primary)] tracking-tight max-w-[65ch]">
                  {project.architectureClaim}
                </h2>
                <p className="type-body4 text-[var(--text-secondary)] leading-relaxed max-w-[65ch]">
                  {project.architectureText}
                </p>
              </div>

              <InteractiveArchitecture nodes={project.architectureNodes} />
            </section>

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                4. DECISIONS I MADE (CLAIM + 4 COMPACT ROWS)
                ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <section id="decisions" aria-label="Key engineering decisions" className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-tertiary)]">
                  04 · Decisions I Made
                </span>
                <h2 className="type-h2 font-display font-medium text-[var(--text-primary)] tracking-tight max-w-[65ch]">
                  {project.decisionsClaim}
                </h2>
              </div>

              <DecisionRows decisions={project.decisions} />
            </section>

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                5. BUGS I HIT (CLAIM + 3 COMPACT CARDS WITH COMMITS)
                ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <section id="bugs" aria-label="Bugs and fixes" className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-tertiary)]">
                  05 · Bugs I Fixed
                </span>
                <h2 className="type-h2 font-display font-medium text-[var(--text-primary)] tracking-tight max-w-[65ch]">
                  {project.bugsClaim}
                </h2>
              </div>

              <BugCards bugs={project.bugs} />
            </section>

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                6. WHAT I'D DO NEXT + TRY IT (FOLDED LEARNING + DEMO CTA)
                ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <section id="next" aria-label="Next steps and live verification" className="space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-tertiary)]">
                  06 · Try It
                </span>
                <h2 className="type-h2 font-display font-medium text-[var(--text-primary)] tracking-tight max-w-[65ch]">
                  {project.nextStepsClaim}
                </h2>
              </div>

              <NextStepsSection
                claim={project.nextStepsClaim}
                nextSteps={[project.nextStepsText]}
                learningStatement={project.learningStatement}
                tryItSteps={project.tryItSteps}
                demoUrl={liveUrl}
                repoUrl={githubUrl}
                coldStartNote={project.links.coldStartNote}
              />
            </section>

            {/* ━━━ FOOTER: NEXT PROJECT + CONTACT ━━━ */}
            <footer className="space-y-8 pt-10 border-t border-[var(--border-subtle)]">
              <TransitionLink
                href={`/work/${nextProject.slug}`}
                className="group block w-full rounded-[var(--card-radius)] bg-[var(--surface-tile)] border border-[var(--border-subtle)] p-6 sm:p-8 hover:border-[var(--border-hover)] transition-colors shadow-sm"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div className="space-y-1.5">
                    <span className="text-xs text-[var(--text-tertiary)] block">
                      Next Case Study
                    </span>
                    <h3 className="type-h2 font-display font-medium text-[var(--text-primary)] group-hover:underline">
                      {nextProject.title}
                    </h3>
                    <p className="type-body4 text-[var(--text-secondary)] max-w-xl">
                      {nextProject.tagline}
                    </p>
                  </div>

                  <div className="w-12 h-12 rounded-full bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] group-hover:border-[var(--border-hover)] flex items-center justify-center shrink-0 transition-transform motion-reduce:transform-none group-hover:translate-x-1 shadow-sm">
                    <ArrowRight className="w-5 h-5 text-[var(--text-primary)]" aria-hidden="true" />
                  </div>
                </div>
              </TransitionLink>

              <div className="w-full rounded-[var(--card-radius)] bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="space-y-1.5">
                  <h3 className="type-h3 font-display font-medium text-[var(--text-primary)]">
                    Interested in this architecture?
                  </h3>
                  <p className="type-body4 text-[var(--text-secondary)]">
                    Available for backend, distributed systems, and real-time engineering roles.
                  </p>
                </div>

                <a
                  href={`mailto:${siteConfig.email}`}
                  className="min-h-[44px] inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--text-primary)] text-[var(--bg-canvas)] hover:opacity-90 font-medium text-sm transition-opacity shadow-sm motion-safe:active:scale-95 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-white/40"
                >
                  <Mail className="w-4 h-4" aria-hidden="true" />
                  <span>Send email</span>
                </a>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}
