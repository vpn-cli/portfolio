"use client";

import { Project, siteConfig } from "@/content/site";
import { TransitionLink } from "@/components/motion/RouteTransition";
import { X, ArrowUpRight, Check, Sparkles } from "lucide-react";

export function CaseStudyView({ project }: { project: Project }) {
  return (
    <main className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col items-center">
      {/* Top Floating Close Pill (Matches Screenshot 2026-10-31 210353.png) */}
      <div className="w-full max-w-4xl flex justify-center mb-8">
        <TransitionLink
          href="/"
          className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/10 hover:border-accent hover:text-accent flex items-center justify-center transition-colors"
          title="Back to Home"
        >
          <X className="w-5 h-5 text-white/70" />
        </TransitionLink>
      </div>

      {/* Main Case Study Bento Shell */}
      <div className="w-full max-w-4xl rounded-[36px] bg-[#0E0F12] border border-white/[0.06] p-6 sm:p-10 lg:p-12 shadow-2xl space-y-16">
        {/* Header Block */}
        <header className="space-y-8">
          <div>
            <h1 className="type-h1 font-display font-medium text-white tracking-tight mb-1">
              {project.title}
            </h1>
            <span className="type-label2 text-[var(--text-tertiary)] font-semibold">
              {project.category}
            </span>
          </div>

          {/* Two-Column Metadata & Overview Grid (Exact Match to Screenshot 2026-10-31 210353.png) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Left Metadata Column */}
            <div className="md:col-span-5 rounded-[24px] bg-[#141519] border border-white/[0.08] p-6 space-y-4 text-xs font-mono">
              <div>
                <span className="text-zinc-500 block mb-1 uppercase tracking-wider">Client</span>
                <span className="text-white font-medium">{project.client}</span>
              </div>
              <div>
                <span className="text-zinc-500 block mb-1 uppercase tracking-wider">Role</span>
                <span className="text-white font-medium">{project.role}</span>
              </div>
              <div>
                <span className="text-zinc-500 block mb-1 uppercase tracking-wider">Timeline</span>
                <span className="text-white font-medium">{project.timeline}</span>
              </div>
              <div>
                <span className="text-zinc-500 block mb-1 uppercase tracking-wider">Year</span>
                <span className="text-accent font-medium">{project.year}</span>
              </div>
            </div>

            {/* Right Brief & Description Column */}
            <div className="md:col-span-7 rounded-[24px] bg-[#141519] border border-white/[0.08] p-6 space-y-4">
              <h3 className="type-h4 font-display font-medium text-white">
                {project.tagline}
              </h3>
              <p className="type-body4 text-zinc-300 font-light leading-relaxed">
                {project.overview}
              </p>
              {project.liveUrl && (
                <div className="pt-2">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-accent hover:underline font-semibold"
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
        <section className="rounded-[28px] overflow-hidden border border-white/[0.08] bg-gradient-to-br from-neutral-900 via-stone-900 to-black p-8 sm:p-14 flex flex-col items-center justify-center relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative z-10 w-full max-w-md aspect-[16/10] rounded-2xl bg-black border-[6px] border-zinc-800 p-4 shadow-2xl flex flex-col justify-between">
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
              <span className="text-accent">{project.metrics[1]}</span>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="space-y-4">
          <span className="type-label2 text-[var(--text-tertiary)] font-semibold block">
            PROBLEM
          </span>
          <p className="type-body3 text-zinc-300 font-light leading-relaxed">
            {project.problem}
          </p>
        </section>

        {/* Process Section with Numbered Steps (Exact Match to Screenshot 210353.png) */}
        <section className="space-y-6">
          <span className="type-label2 text-[var(--text-tertiary)] font-semibold block">
            PROCESS
          </span>
          <p className="type-body4 text-zinc-400 font-light">
            We adopted an agile, user-centric engineering process and rigorous performance profiling:
          </p>
          <div className="space-y-4">
            {project.process.map((step, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#141519] border border-white/[0.06] flex items-start gap-4"
              >
                <div className="w-7 h-7 rounded-full bg-accent/10 border border-accent/25 flex items-center justify-center text-accent text-xs font-mono font-bold shrink-0">
                  {idx + 1}
                </div>
                <p className="text-sm text-zinc-300 font-light leading-relaxed">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Solution Section */}
        <section className="space-y-4">
          <span className="type-label2 text-[var(--text-tertiary)] font-semibold block">
            SOLUTION
          </span>
          <p className="type-body3 text-zinc-300 font-light leading-relaxed">
            {project.solution}
          </p>
        </section>

        {/* Key Insights Section */}
        <section className="space-y-6 pt-6 border-t border-white/[0.08]">
          <span className="type-label2 text-[var(--text-tertiary)] font-semibold block">
            KEY INSIGHTS & IMPACT
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {project.keyInsights.map((insight, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#141519] border border-white/[0.06] flex flex-col justify-between"
              >
                <div className="w-2 h-2 rounded-full bg-accent mb-3" />
                <p className="text-xs text-zinc-300 font-light leading-relaxed">
                  {insight}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
