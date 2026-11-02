import { siteConfig } from "@/content/site";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import { ProjectCardPreview } from "@/components/projects/ProjectCardPreview";

export const metadata: Metadata = {
  title: `Selected Work | ${siteConfig.name}`,
  description: "Featured engineering projects and technical case studies.",
};

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] p-3 sm:p-5 lg:p-8 flex flex-col items-center">
      {/* Outer Bento Shell matching homepage container system */}
      <div className="w-full max-w-[var(--layout-outer-width)] rounded-[var(--card-radius-outer)] bg-[var(--bg-canvas-subtle)] border border-[var(--border-subtle)] p-6 sm:p-10 lg:p-12 shadow-md flex flex-col items-center">
        
        {/* Top Navigation Bar */}
        <div className="w-full max-w-[var(--layout-max-width)] flex items-center justify-between mb-8 sm:mb-10">
          <Link
            href="/"
            className="min-h-[40px] px-4 py-2 rounded-full bg-[var(--surface-tile)] hover:bg-[var(--surface-tile-hover)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-white/40 active:scale-95"
            title="Back to home"
            aria-label="Back to home"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Home</span>
          </Link>

          <span className="text-xs text-[var(--text-tertiary)]">
            <span className="font-mono">{siteConfig.projects.length}</span> engineering projects
          </span>
        </div>

        {/* Content Column */}
        <div className="w-full max-w-[var(--layout-max-width)]">
          {/* Hero Section */}
          <header className="mb-10 sm:mb-12 text-left space-y-3">
            <h1 className="type-h1 font-display font-medium text-[var(--text-primary)] tracking-tight">
              Selected work & technical case studies
            </h1>
            <p className="type-body2 text-[var(--text-secondary)] max-w-2xl leading-relaxed">
              Three projects: a live sports engine, an event-driven store, and an AI app builder.
            </p>
          </header>

          {/* Projects Showcase List */}
          <section aria-label="Projects list" className="grid grid-cols-1 gap-8 sm:gap-10">
            {siteConfig.projects.map((project, idx) => (
              <article
                key={project.slug}
                className="rounded-[var(--card-radius)] bento-surface p-6 sm:p-8 transition-[background-color,border-color] duration-300 flex flex-col lg:flex-row gap-8 items-center"
              >
                {/* Visual Device Preview with optional hover video preview */}
                <ProjectCardPreview
                  slug={project.slug}
                  title={project.title}
                  image={project.image}
                  priority={idx === 0}
                />

                {/* Details Column */}
                <div className="w-full lg:w-1/2 flex flex-col justify-between h-full space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2.5">
                      <span className="text-xs font-normal px-2.5 py-1 rounded-full bg-[var(--surface-tile-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                        {project.category}
                      </span>
                      <span className="text-xs font-mono text-[var(--text-tertiary)]">
                        {project.year}
                      </span>
                    </div>

                    <h2 className="type-h2 font-display font-medium text-[var(--text-primary)] tracking-tight mb-2">
                      {project.title}
                    </h2>

                    <p className="type-body4 text-[var(--text-secondary)] leading-relaxed mb-4">
                      {project.tagline}
                    </p>

                    {/* Metrics Badges */}
                    <div className="flex items-center gap-2 flex-wrap mb-4">
                      {project.metrics.slice(0, 2).map((m, mIdx) => (
                        <span
                          key={mIdx}
                          className="text-xs font-mono font-medium px-2.5 py-1 rounded-md bg-[var(--surface-tile-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)]"
                        >
                          {m.value} · {m.label}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions (44px Minimum Touch Target) */}
                  <div className="pt-2 flex items-center gap-3">
                    <Link
                      href={`/work/${project.slug}`}
                      className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-canvas)] hover:opacity-90 font-medium text-sm transition-opacity shadow-md group/btn active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-white/40"
                    >
                      <span>Read case study</span>
                      <ArrowUpRight className="w-4 h-4 transition-transform motion-safe:group-hover/btn:translate-x-0.5 motion-safe:group-hover/btn:-translate-y-0.5 motion-reduce:transform-none" aria-hidden="true" />
                    </Link>

                    {(project.links.repo || project.githubUrl) && (
                      <a
                        href={project.links.repo || project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[var(--surface-tile-elevated)] hover:bg-[var(--surface-tile-hover)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] text-[var(--text-primary)] font-medium text-sm transition-colors active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-white/40"
                      >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                        </svg>
                        <span>Source</span>
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </section>
        </div>
      </div>
    </main>
  );
}
