import { siteConfig } from "@/content/site";
import Link from "next/link";
import { X, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Selected Work — ${siteConfig.name}`,
  description: "Featured engineering projects and technical case studies.",
};

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] p-3 sm:p-4 lg:p-6 flex flex-col items-center">
      {/* Main Bento Shell matching Master Framer Spec */}
      <div className="w-full max-w-[1800px] min-h-[calc(100vh-48px)] rounded-[32px] sm:rounded-[36px] bg-[var(--bg-canvas-subtle)] border border-[var(--border-subtle)] p-6 sm:p-10 lg:p-14 shadow-2xl flex flex-col items-center">
        {/* Top Floating Close / Back Pill */}
        <div className="w-full flex justify-center mb-8 sm:mb-12">
          <Link
            href="/"
            className="w-10 h-10 rounded-full bg-neutral-200 hover:bg-neutral-300 border border-neutral-300 dark:bg-white/[0.06] dark:border-white/10 dark:hover:border-white/20 flex items-center justify-center transition-colors text-neutral-800 dark:text-white shadow-sm"
            title="Back to Home"
          >
            <X className="w-5 h-5 opacity-80" />
          </Link>
        </div>

        {/* Inner Content Column */}
        <div className="w-full max-w-5xl lg:max-w-6xl">
          <div className="mb-10 text-center sm:text-left">
            <span className="type-label2 text-[var(--text-tertiary)] block mb-2 font-semibold font-mono">
              PROJECTS & ARCHITECTURE
            </span>
            <h1 className="type-h1 font-display font-medium text-[var(--text-primary)] tracking-tight">
              Selected Work & Technical Case Studies
            </h1>
            <p className="text-[16px] sm:text-[18px] text-[var(--text-secondary)] mt-2 max-w-2xl leading-relaxed">
              High-concurrency systems, AST compiler runtimes, and real-time distributed pipelines engineered for speed, correctness, and scale.
            </p>
          </div>

          {/* Projects Showcase Grid */}
          <div className="grid grid-cols-1 gap-8 sm:gap-10">
            {siteConfig.projects.map((project) => (
              <div
                key={project.slug}
                className="group rounded-[30px] bento-surface p-6 sm:p-8 transition-all duration-300 flex flex-col lg:flex-row gap-8 items-center"
              >
                {/* Visual Device Preview */}
                <div className="w-full lg:w-1/2 aspect-[16/10] sm:aspect-[16/10] rounded-[22px] overflow-hidden bg-neutral-900 border border-black/10 dark:border-white/10 relative shadow-xl shrink-0 group-hover:scale-[1.01] transition-transform duration-300">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Details Column */}
                <div className="w-full lg:w-1/2 flex flex-col justify-between h-full space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-white/[0.08] text-neutral-700 dark:text-neutral-300 border border-black/5 dark:border-white/10">
                        {project.category}
                      </span>
                      <span className="text-[12px] font-mono text-[var(--text-tertiary)]">
                        {project.year}
                      </span>
                    </div>

                    <h2 className="text-[24px] sm:text-[28px] font-medium text-[var(--text-primary)] tracking-tight mb-2">
                      {project.title}
                    </h2>

                    <p className="text-[15px] sm:text-[16px] text-[var(--text-secondary)] leading-relaxed mb-4">
                      {project.tagline}
                    </p>

                    {/* Metrics / Deliverables Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.metrics.slice(0, 3).map((metric) => (
                        <span
                          key={metric}
                          className="text-[12px] font-medium px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-white/[0.04] text-neutral-700 dark:text-neutral-300 border border-black/5 dark:border-white/5"
                        >
                          {metric}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center gap-3">
                    <Link
                      href={`/work/${project.slug}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-900 hover:bg-black text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-black font-medium text-sm transition-all duration-200 shadow-md group/btn"
                    >
                      <span>Read Case Study</span>
                      <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                    </Link>

                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-neutral-100 hover:bg-neutral-200/80 border border-neutral-200 text-neutral-800 dark:bg-white/[0.06] dark:border-white/10 dark:text-neutral-200 dark:hover:bg-white/10 font-medium text-sm transition-all duration-200"
                      >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                        </svg>
                        <span>Source</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
