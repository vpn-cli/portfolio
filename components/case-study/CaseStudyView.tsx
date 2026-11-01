"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CaseStudy } from "@/data/projects";
import { siteConfig } from "@/content/site";
import { TransitionLink } from "@/components/motion/RouteTransition";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Clock,
  ExternalLink,
  FileText,
  Mail,
  Sparkles,
} from "lucide-react";
import { SiGithub } from "react-icons/si";

import { TableOfContents } from "./TableOfContents";
import { CaseStudyHero } from "./CaseStudyHero";
import { ProblemComparison } from "./ProblemComparison";
import { JourneyTimeline } from "./JourneyTimeline";
import { FlowStepper } from "./FlowStepper";

export function CaseStudyView({ project }: { project: CaseStudy }) {
  const router = useRouter();

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
      {/* Capped and Centered Max Content Width Container */}
      <div className="w-full max-w-[var(--layout-max-width)] space-y-12 sm:space-y-16">
        {/* ━━━ TOP BAR (← All work · category · prev/next) ━━━ */}
        <nav
          aria-label="Case study navigation"
          className="w-full flex items-center justify-between py-3 border-b border-[var(--border-subtle)]"
        >
          {/* Left: ← All work + Category Badge */}
          <div className="flex items-center gap-3">
            <TransitionLink
              href="/projects"
              className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-white/40"
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

        {/* ━━━ MAIN GRID: STICKY TOC ON LEFT (DESKTOP) + NARRATIVE CONTENT ON RIGHT ━━━ */}
        <div className="w-full flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">
          {/* Table of contents (sticky sidebar on desktop / collapsible drawer on mobile) */}
          <TableOfContents />

          {/* Narrative Core Column */}
          <div className="flex-1 min-w-0 w-full space-y-16 sm:space-y-20">
            {/* ━━━ 0. TL;DR CARD (THE 30-SECOND RECRUITER LAYER) ━━━ */}
            <section
              id="tldr"
              aria-label="30-second summary"
              className="rounded-[var(--card-radius)] bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] p-6 sm:p-8 space-y-6 shadow-sm"
            >
              {/* Header: Title + Reading Time */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-[var(--surface-tile)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                      30-Second Recruiter Brief
                    </span>
                    <span className="text-xs font-mono text-[var(--text-tertiary)]">
                      {project.year}
                    </span>
                  </div>
                  <h1 className="type-h1 font-display font-medium text-[var(--text-primary)] tracking-tight">
                    {project.title}
                  </h1>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-[var(--text-tertiary)] self-start sm:self-auto shrink-0">
                  <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                  <span className="font-mono">{project.tldr.readingTime}</span>
                </div>
              </div>

              {/* Pitch */}
              <p className="type-body2 text-[var(--text-primary)] font-medium leading-relaxed max-w-[70ch]">
                {project.tldr.pitch}
              </p>

              {/* 3-Bullet Summary (Problem · What I built · Outcome) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="rounded-xl bg-[var(--surface-tile)] p-4 border border-[var(--border-subtle)] space-y-1.5">
                  <span className="text-xs font-medium text-[var(--text-tertiary)] block">
                    Problem
                  </span>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {project.tldr.summary.problem}
                  </p>
                </div>

                <div className="rounded-xl bg-[var(--surface-tile)] p-4 border border-[var(--border-subtle)] space-y-1.5">
                  <span className="text-xs font-medium text-[var(--text-tertiary)] block">
                    What I built
                  </span>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {project.tldr.summary.built}
                  </p>
                </div>

                <div className="rounded-xl bg-[var(--surface-tile)] p-4 border border-[var(--border-subtle)] space-y-1.5">
                  <span className="text-xs font-medium text-[var(--text-tertiary)] block">
                    Outcome
                  </span>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {project.tldr.summary.outcome}
                  </p>
                </div>
              </div>

              {/* Meta Grid: Role · Timeline · Stack */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[var(--border-subtle)]">
                <div>
                  <span className="text-xs text-[var(--text-tertiary)] block mb-1">Role</span>
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    {project.tldr.role}
                  </span>
                </div>

                <div>
                  <span className="text-xs text-[var(--text-tertiary)] block mb-1">Timeline</span>
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    {project.tldr.timeline}
                  </span>
                </div>

                <div>
                  <span className="text-xs text-[var(--text-tertiary)] block mb-1.5">Stack</span>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tldr.stack.slice(0, 5).map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-mono px-2 py-0.5 rounded-md bg-[var(--surface-tile)] border border-[var(--border-subtle)] text-[var(--text-secondary)]"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.tldr.stack.length > 5 && (
                      <span className="text-xs font-mono text-[var(--text-tertiary)] self-center">
                        +{project.tldr.stack.length - 5}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons: Live Demo · GitHub · README */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[var(--border-subtle)]">
                {liveUrl && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <a
                      href={project.liveUrl || liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--text-primary)] text-[var(--bg-canvas)] hover:opacity-90 text-sm font-medium transition-opacity shadow-sm motion-safe:active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-white/40"
                    >
                      <ExternalLink className="w-4 h-4" aria-hidden="true" />
                      <span>Live demo</span>
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-80" aria-hidden="true" />
                    </a>

                    {project.links.coldStartNote && (
                      <span className="text-xs text-[var(--text-tertiary)] italic">
                        ({project.links.coldStartNote})
                      </span>
                    )}
                  </div>
                )}

                {githubUrl && (
                  <a
                    href={project.githubUrl || githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--surface-tile)] hover:bg-[var(--surface-tile-hover)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] text-sm font-medium text-[var(--text-primary)] transition-colors shadow-sm motion-safe:active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-white/40"
                  >
                    <SiGithub className="w-4 h-4" aria-hidden="true" />
                    <span>View GitHub</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-60" aria-hidden="true" />
                  </a>
                )}

                {project.links.readme && (
                  <a
                    href={project.links.readme}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--surface-tile)] hover:bg-[var(--surface-tile-hover)] border border-[var(--border-subtle)] text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
                  >
                    <FileText className="w-4 h-4" aria-hidden="true" />
                    <span>README</span>
                  </a>
                )}
              </div>
            </section>

            {/* ━━━ 1. HERO DEMO VISUAL (STAGESHOW) ━━━ */}
            <section id="hero" aria-label="Interactive demo showcase" className="w-full space-y-3">
              <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)]">
                <span className="text-xs font-normal">Interactive product showcase</span>
                <span className="text-xs text-[var(--text-tertiary)]">Live simulation</span>
              </div>
              <CaseStudyHero project={project} />
            </section>

            {/* ━━━ 2. CONTEXT: WHY THIS EXISTS ━━━ */}
            <section id="context" className="space-y-4">
              <h2 className="type-h2 font-display font-medium text-[var(--text-primary)] tracking-tight">
                {project.context.takeaway}
              </h2>
              <p className="type-body2 text-[var(--text-secondary)] leading-relaxed max-w-[70ch]">
                {project.context.description}
              </p>
            </section>

            {/* ━━━ 3. THE PROBLEM ━━━ */}
            <section id="problem" className="space-y-6">
              <div className="space-y-3">
                <h2 className="type-h2 font-display font-medium text-[var(--text-primary)] tracking-tight">
                  {project.problem.takeaway}
                </h2>
                <p className="type-body4 text-[var(--text-secondary)] leading-relaxed max-w-[70ch]">
                  {project.problem.description}
                </p>
              </div>

              {/* Visual Comparison: Before vs After */}
              <ProblemComparison
                before={project.problem.comparison.before}
                after={project.problem.comparison.after}
                coreChallenge={project.problem.coreChallenge}
              />
            </section>

            {/* ━━━ 4. GOALS AND CONSTRAINTS ━━━ */}
            <section id="goals" className="space-y-6">
              <h2 className="type-h2 font-display font-medium text-[var(--text-primary)] tracking-tight">
                {project.goals.takeaway}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {project.goals.items.map((g, idx) => (
                  <div
                    key={idx}
                    className="rounded-[var(--card-radius)] bg-[var(--surface-tile)] border border-[var(--border-subtle)] p-5 sm:p-6 space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] flex items-center justify-center font-mono text-[11px] text-[var(--text-primary)] shrink-0">
                        0{idx + 1}
                      </span>
                      <h3 className="text-sm font-medium text-[var(--text-primary)]">
                        {g.label}
                      </h3>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed pl-8">
                      {g.detail}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* ━━━ 5. THE JOURNEY: HOW I BUILT IT ━━━ */}
            <section id="journey" className="space-y-6">
              <div className="space-y-3">
                <h2 className="type-h2 font-display font-medium text-[var(--text-primary)] tracking-tight">
                  The engineering timeline: How the system evolved
                </h2>
                <p className="type-body4 text-[var(--text-secondary)] max-w-[70ch]">
                  Every architectural decision grounded in actual git commits, chronologically
                  tackling problems as they emerged during development and stress-testing.
                </p>
              </div>

              <JourneyTimeline journey={project.journey} />
            </section>

            {/* ━━━ 6. HOW IT WORKS: THE FLOW ━━━ */}
            <section id="flow" className="space-y-6">
              <div className="space-y-3">
                <h2 className="type-h2 font-display font-medium text-[var(--text-primary)] tracking-tight">
                  Tracing one real event through the end-to-end pipeline
                </h2>
                <p className="type-body4 text-[var(--text-secondary)] max-w-[70ch]">
                  Step through how data flows across components in real time. Select a stage to
                  inspect its runtime role and exact code implementation.
                </p>
              </div>

              <FlowStepper steps={project.flowSteps} />
            </section>

            {/* ━━━ 7. HARD PARTS AND WHAT BROKE ━━━ */}
            <section id="challenges" className="space-y-6">
              <div className="space-y-3">
                <h2 className="type-h2 font-display font-medium text-[var(--text-primary)] tracking-tight">
                  Real bugs from production and how I debugged them
                </h2>
                <p className="type-body4 text-[var(--text-secondary)] max-w-[70ch]">
                  Sourced directly from real git commit logs and debug investigations.
                </p>
              </div>

              <div className="space-y-4">
                {project.challenges.map((c, idx) => (
                  <div
                    key={idx}
                    className="rounded-[var(--card-radius)] bg-[var(--surface-tile)] border border-[var(--border-subtle)] p-6 space-y-3 shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-3">
                      <h3 className="text-sm sm:text-base font-medium text-[var(--text-primary)]">
                        {idx + 1}. {c.title}
                      </h3>
                      {c.commitOrPr && (
                        <span className="text-[11px] font-mono text-[var(--text-tertiary)] bg-[var(--surface-tile-elevated)] px-2 py-0.5 rounded border border-[var(--border-subtle)] truncate max-w-xs">
                          {c.commitOrPr}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-1">
                      <div>
                        <span className="text-[11px] font-medium text-[var(--text-tertiary)] block mb-1">
                          Symptom:
                        </span>
                        <p className="text-[var(--text-secondary)] leading-relaxed">{c.symptom}</p>
                      </div>

                      <div>
                        <span className="text-[11px] font-medium text-[var(--text-tertiary)] block mb-1">
                          Root Cause:
                        </span>
                        <p className="text-[var(--text-secondary)] leading-relaxed">{c.rootCause}</p>
                      </div>

                      <div>
                        <span className="text-[11px] font-medium text-[var(--text-tertiary)] block mb-1">
                          Solution:
                        </span>
                        <p className="text-[var(--text-primary)] font-medium leading-relaxed">
                          {c.solution}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ━━━ 8. RESULTS & VERIFIED METRICS ━━━ */}
            <section id="results" className="space-y-6">
              <h2 className="type-h2 font-display font-medium text-[var(--text-primary)] tracking-tight">
                {project.results.takeaway}
              </h2>

              {/* Numerical Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {project.results.metrics.map((m, idx) => (
                  <div
                    key={idx}
                    className="rounded-[var(--card-radius)] bg-[var(--surface-tile)] border border-[var(--border-subtle)] p-5 flex flex-col justify-between min-h-[140px]"
                  >
                    <div>
                      <span className="type-h2 font-mono font-medium text-[var(--text-primary)] block">
                        {m.value}
                      </span>
                      <span className="text-xs font-medium text-[var(--text-secondary)] mt-1.5 block">
                        {m.label}
                      </span>
                    </div>
                    <span className="text-[11px] text-[var(--text-tertiary)] pt-3 border-t border-[var(--border-subtle)] block truncate">
                      Source: {m.source}
                    </span>
                  </div>
                ))}
              </div>

              {/* Qualitative Results List */}
              <div className="rounded-[var(--card-radius)] bg-[var(--surface-tile)] border border-[var(--border-subtle)] p-6 space-y-3">
                <h3 className="text-xs font-medium text-[var(--text-tertiary)]">
                  Qualitative outcomes
                </h3>
                <ul className="space-y-2">
                  {project.results.qualitative.map((q, idx) => (
                    <li
                      key={idx}
                      className="text-xs sm:text-sm text-[var(--text-secondary)] flex items-start gap-2.5 leading-relaxed"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[var(--text-primary)] mt-1 shrink-0" aria-hidden="true" />
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* ━━━ 9. WHAT I LEARNED / WHAT'S NEXT ━━━ */}
            <section id="learnings" className="space-y-6">
              <h2 className="type-h2 font-display font-medium text-[var(--text-primary)] tracking-tight">
                {project.learnings.takeaway}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {project.learnings.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-[var(--card-radius)] bg-[var(--surface-tile)] border border-[var(--border-subtle)] p-5 space-y-2 flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="text-sm font-medium text-[var(--text-primary)] mb-2">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ━━━ 10. TRY IT YOURSELF ━━━ */}
            <section
              id="try-it"
              className="rounded-[var(--card-radius)] bg-[var(--surface-tile-elevated)] border border-[var(--border-hover)] p-6 sm:p-8 space-y-6 shadow-sm"
            >
              <div className="space-y-2">
                <h2 className="type-h2 font-display font-medium text-[var(--text-primary)] tracking-tight">
                  Try it yourself
                </h2>
                <p className="type-body4 text-[var(--text-secondary)] max-w-[70ch]">
                  {project.tryIt.takeaway}
                </p>
              </div>

              {/* Numbered Testing Steps */}
              <div className="rounded-xl bg-[var(--surface-tile)] p-5 border border-[var(--border-subtle)] space-y-3">
                <span className="text-xs font-medium text-[var(--text-tertiary)] block">
                  How to test:
                </span>
                <ol className="space-y-2">
                  {project.tryIt.steps.map((st, idx) => (
                    <li
                      key={idx}
                      className="text-xs sm:text-sm text-[var(--text-secondary)] flex items-start gap-2.5 leading-relaxed"
                    >
                      <span className="font-mono text-xs text-[var(--text-primary)] font-medium shrink-0">
                        0{idx + 1}.
                      </span>
                      <span>{st}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {liveUrl && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <a
                      href={project.liveUrl || liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[44px] inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--text-primary)] text-[var(--bg-canvas)] hover:opacity-90 font-medium text-sm transition-opacity shadow-sm motion-safe:active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-white/40"
                    >
                      <ExternalLink className="w-4 h-4" aria-hidden="true" />
                      <span>Launch live demo</span>
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-80" aria-hidden="true" />
                    </a>

                    {project.links.coldStartNote && (
                      <span className="text-xs text-[var(--text-tertiary)] italic">
                        ({project.links.coldStartNote})
                      </span>
                    )}
                  </div>
                )}

                {githubUrl && (
                  <a
                    href={project.githubUrl || githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--surface-tile)] hover:bg-[var(--surface-tile-hover)] border border-[var(--border-subtle)] text-sm font-medium text-[var(--text-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
                  >
                    <SiGithub className="w-4 h-4" aria-hidden="true" />
                    <span>View GitHub</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-60" aria-hidden="true" />
                  </a>
                )}
              </div>
            </section>

            {/* ━━━ 11. FOOTER: NEXT PROJECT + CONTACT CTA ━━━ */}
            <footer className="space-y-8 pt-8 border-t border-[var(--border-subtle)]">
              {/* Next Project Card */}
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

              {/* Contact CTA Banner */}
              <div className="w-full rounded-[var(--card-radius)] bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="space-y-1.5">
                  <h3 className="type-h3 font-display font-medium text-[var(--text-primary)]">
                    Have a project in mind?
                  </h3>
                  <p className="type-body4 text-[var(--text-secondary)]">
                    Available for select backend, distributed systems, and real-time engineering work.
                  </p>
                </div>

                <a
                  href="mailto:vipinkaushik20771041@gmail.com"
                  className="min-h-[44px] inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--text-primary)] text-[var(--bg-canvas)] hover:opacity-90 font-medium text-sm transition-opacity shadow-sm motion-safe:active:scale-95 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-white/40"
                >
                  <Mail className="w-4 h-4" aria-hidden="true" />
                  <span>Send mail</span>
                </a>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}
