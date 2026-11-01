"use client";

import { Project, siteConfig } from "@/content/site";
import { TransitionLink } from "@/components/motion/RouteTransition";
import { X, ArrowUpRight, Check, Sparkles } from "lucide-react";

export function CaseStudyView({ project }: { project: Project }) {
  return (
    <main className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] p-3 sm:p-4 lg:p-6 flex flex-col items-center">
      {/* Main Case Study Bento Shell matching Master Framer Spec */}
      <div className="w-full max-w-[1800px] min-h-[calc(100vh-48px)] rounded-[32px] sm:rounded-[36px] bg-[var(--bg-canvas-subtle)] border border-[var(--border-subtle)] p-6 sm:p-10 lg:p-14 shadow-2xl flex flex-col items-center">
        {/* Top Floating Close Pill (Matches BentoX Framer Reference) */}
        <div className="w-full flex justify-center mb-8 sm:mb-12">
          <TransitionLink
            href="/"
            className="w-10 h-10 rounded-full bg-neutral-200 hover:bg-neutral-300 border border-neutral-300 dark:bg-white/[0.06] dark:border-white/10 dark:hover:border-white/20 flex items-center justify-center transition-colors text-neutral-800 dark:text-white"
            title="Back to Home"
          >
            <X className="w-5 h-5 opacity-80" />
          </TransitionLink>
        </div>

        {/* Inner Content Column */}
        <div className="w-full max-w-5xl lg:max-w-6xl space-y-16">
          {/* Header Block */}
          <header className="space-y-8">
            <div>
              <h1 className="type-h1 font-display font-medium text-[var(--text-primary)] tracking-tight mb-1">
                {project.title}
              </h1>
              <span className="type-label2 text-[var(--text-tertiary)] font-semibold font-mono">
                {project.category}
              </span>
            </div>

            {/* Two-Column Metadata & Overview Grid (Exact Match to Reference) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Left Metadata Column */}
              <div className="md:col-span-5 rounded-[24px] bento-surface p-6 space-y-4 text-xs font-mono">
                <div>
                  <span className="text-[var(--text-tertiary)] block mb-1 uppercase tracking-wider">Client</span>
                  <span className="text-[var(--text-primary)] font-medium">{project.client}</span>
                </div>
                <div>
                  <span className="text-[var(--text-tertiary)] block mb-1 uppercase tracking-wider">Role</span>
                  <span className="text-[var(--text-primary)] font-medium">{project.role}</span>
                </div>
                <div>
                  <span className="text-[var(--text-tertiary)] block mb-1 uppercase tracking-wider">Timeline</span>
                  <span className="text-[var(--text-primary)] font-medium">{project.timeline}</span>
                </div>
                <div>
                  <span className="text-[var(--text-tertiary)] block mb-1 uppercase tracking-wider">Year</span>
                  <span className="text-emerald-500 font-medium">{project.year}</span>
                </div>
              </div>

              {/* Right Brief & Description Column */}
              <div className="md:col-span-7 rounded-[24px] bento-surface p-6 space-y-4">
                <h3 className="type-h4 font-display font-medium text-[var(--text-primary)]">
                  {project.tagline}
                </h3>
                <p className="type-body4 text-[var(--text-secondary)] font-light leading-relaxed">
                  {project.overview}
                </p>
                {project.liveUrl && (
                  <div className="pt-2">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[var(--text-primary)] hover:underline font-semibold"
                    >
                      <span>Check live app</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Hero Device Mockup Banner */}
          <section className="rounded-[28px] overflow-hidden border border-black/10 dark:border-white/[0.08] bg-gradient-to-br from-neutral-900 via-stone-900 to-black p-8 sm:p-14 flex flex-col items-center justify-center relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />
            
            <div className="relative z-10 w-full max-w-lg aspect-[16/10] rounded-2xl bg-black border-[6px] border-zinc-800 p-6 shadow-2xl flex flex-col justify-between">
              <div className="flex items-center justify-between text-zinc-500 text-[10px] font-mono border-b border-zinc-800 pb-2">
                <span>{project.title} Interface</span>
                <span className="text-emerald-400">● 60 FPS</span>
              </div>
              <div className="my-auto py-4 text-center">
                <span className="text-2xl sm:text-3xl font-display font-bold text-white block mb-2">
                  {project.title}
                </span>
                <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                  {project.tagline}
                </p>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span>{project.metrics[0]}</span>
                <span className="text-emerald-400">{project.metrics[1]}</span>
              </div>
            </div>
          </section>

          {/* Problem Section */}
          <section className="space-y-4">
            <span className="type-label2 text-[var(--text-tertiary)] font-semibold block font-mono">
              PROBLEM
            </span>
            <p className="type-body3 text-[var(--text-secondary)] font-light leading-relaxed">
              {project.problem}
            </p>
          </section>

          {/* Process Section with Numbered Steps (Exact Match to Reference) */}
          <section className="space-y-6">
            <span className="type-label2 text-[var(--text-tertiary)] font-semibold block font-mono">
              PROCESS
            </span>
            <p className="type-body4 text-[var(--text-tertiary)] font-light">
              We adopted an agile, user-centric engineering process and rigorous performance profiling:
            </p>
            <div className="space-y-4">
              {project.process.map((step, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bento-surface flex items-start gap-4"
                >
                  <div className="w-7 h-7 rounded-full bg-neutral-200 dark:bg-white/10 border border-neutral-300 dark:border-white/20 flex items-center justify-center text-[var(--text-primary)] text-xs font-mono font-bold shrink-0">
                    {idx + 1}
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] font-light leading-relaxed">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Solution Section */}
          <section className="space-y-4">
            <span className="type-label2 text-[var(--text-tertiary)] font-semibold block font-mono">
              SOLUTION
            </span>
            <p className="type-body3 text-[var(--text-secondary)] font-light leading-relaxed">
              {project.solution}
            </p>
          </section>

          {/* Key Insights Section */}
          <section className="space-y-6 pt-6 border-t border-[var(--border-subtle)]">
            <span className="type-label2 text-[var(--text-tertiary)] font-semibold block font-mono">
              KEY INSIGHTS & IMPACT
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {project.keyInsights.map((insight, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bento-surface flex flex-col justify-between"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mb-3" />
                  <p className="text-xs text-[var(--text-secondary)] font-light leading-relaxed">
                    {insight}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
