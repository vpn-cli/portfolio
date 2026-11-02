import { siteConfig } from "@/content/site";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import { ProjectCardPreview } from "@/components/projects/ProjectCardPreview";

export const metadata: Metadata = {
  title: `Selected Work | ${siteConfig.name}`,
  description: "Featured engineering projects and technical case studies.",
};

const PROJECT_WORK_META: Record<
  string,
  {
    index: string;
    stackLine: string;
    description: string;
  }
> = {
  sockets: {
    index: "01",
    stackLine: "Node.js · WebSockets · PostgreSQL",
    description:
      "A push server broadcasting live match scores and commentary to connected spectators over WebSockets.",
  },
  "stream-mart": {
    index: "02",
    stackLine: "Node.js · Apache Kafka · PostgreSQL",
    description:
      "An event-driven backend using Apache Kafka and the transactional outbox pattern to decouple store services.",
  },
  appforge: {
    index: "03",
    stackLine: "Next.js · React 19 · Groq LPU",
    description:
      "An AI tool streaming natural language prompts into typed React components without runtime code evaluation.",
  },
};

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col items-center">
      <div className="w-full max-w-[var(--layout-max-width)]">
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          <Link
            href="/"
            prefetch={false}
            className="min-h-[40px] px-4 py-2 rounded-full bg-[var(--surface-tile)] hover:bg-[var(--surface-tile-hover)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-white/40 active:scale-95"
            title="Back to home"
            aria-label="Back to home"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Home</span>
          </Link>
        </div>

        {/* Hero Section */}
        <header className="mb-10 sm:mb-14 text-left space-y-3">
          <h1 className="type-h1 font-display font-medium text-[var(--text-primary)] tracking-tight">
            Selected work
          </h1>
          <p className="type-body2 text-[var(--text-secondary)] max-w-2xl leading-relaxed">
            Three projects: a live sports engine, an event-driven store, and an AI app builder.
          </p>
        </header>

        {/* Projects Showcase List */}
        <section aria-label="Selected engineering projects" className="flex flex-col gap-8 sm:gap-10">
          {siteConfig.projects.map((project, idx) => {
            const meta = PROJECT_WORK_META[project.slug] || {
              index: `0${idx + 1}`,
              stackLine: project.stack.slice(0, 3).join(" · "),
              description: project.tagline,
            };
            const sourceUrl = project.links.repo || project.githubUrl;

            return (
              <article
                key={project.slug}
                className="group relative rounded-[var(--card-radius)] bg-[var(--surface-tile)] hover:bg-[var(--surface-tile-hover)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] p-5 sm:p-7 lg:p-8 transition-[background-color,border-color,box-shadow] duration-200 shadow-sm hover:shadow-md flex flex-col lg:flex-row items-center gap-6 sm:gap-8 lg:gap-10"
              >
                {/* Visual Device Preview (Stageshow Presentation) */}
                <ProjectCardPreview
                  slug={project.slug}
                  title={project.title}
                  image={project.image}
                  priority={idx === 0}
                />

                {/* Details Column - Centered against preview in one unified group */}
                <div className="w-full lg:w-[42%] flex flex-col justify-center space-y-4">
                  {/* Index + Stack Line */}
                  <div className="flex items-center gap-2.5 font-mono text-xs text-[var(--text-tertiary)] select-none">
                    <span className="font-semibold text-[var(--text-secondary)]">
                      {meta.index}
                    </span>
                    <span className="text-[var(--border-subtle)]" aria-hidden="true">
                      /
                    </span>
                    <span className="tracking-wide">{meta.stackLine}</span>
                  </div>

                  {/* Project Title */}
                  <h2 className="type-h2 font-display font-medium text-[var(--text-primary)] tracking-tight">
                    {project.title}
                  </h2>

                  {/* Plain Language Honest Description (<=20 words) */}
                  <p className="type-body4 text-[var(--text-secondary)] leading-relaxed">
                    {meta.description}
                  </p>

                  {/* Unified CTA Row */}
                  <div className="pt-2 flex items-center gap-3">
                    {/* Primary CTA (Whole card clickable via stretched link) */}
                    <Link
                      href={`/work/${project.slug}`}
                      prefetch={false}
                      className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-canvas)] hover:opacity-90 font-medium text-sm transition-opacity shadow-sm active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-white/40"
                    >
                      <span
                        className="absolute inset-0 rounded-[var(--card-radius)]"
                        aria-hidden="true"
                      />
                      <span className="relative z-10">Read case study</span>
                      <ArrowUpRight
                        className="w-4 h-4 relative z-10 transition-transform motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5 motion-reduce:transform-none"
                        aria-hidden="true"
                      />
                    </Link>

                    {/* Secondary Link: Source (relative z-20, does not trigger card navigation) */}
                    {sourceUrl && (
                      <a
                        href={sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative z-20 min-h-[44px] inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[var(--surface-tile-elevated)] hover:bg-[var(--surface-tile-hover)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-medium text-sm transition-colors active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-white/40"
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
            );
          })}
        </section>
      </div>
    </main>
  );
}
