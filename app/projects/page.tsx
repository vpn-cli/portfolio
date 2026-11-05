import { siteConfig } from "@/content/site";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { ProjectListingCard } from "@/components/projects/ProjectListingCard";
import { TransitionLink } from "@/components/motion/RouteTransition";

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
  appforge: {
    index: "01",
    stackLine: "Next.js · React · Groq",
    description:
      "Describe an app in plain English and get a working React UI.",
  },
  sockets: {
    index: "02",
    stackLine: "Node.js · WebSockets · PostgreSQL",
    description:
      "A push server broadcasting live match scores and commentary to connected spectators over WebSockets.",
  },
  "stream-mart": {
    index: "03",
    stackLine: "Node.js · Apache Kafka · PostgreSQL",
    description:
      "An event-driven backend using Apache Kafka and the transactional outbox pattern to decouple store services.",
  },
};

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col items-center">
      <div className="w-full max-w-[var(--layout-max-width)]">
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          <TransitionLink
            href="/"
            className="min-h-[40px] px-4 py-2 rounded-full bg-[var(--surface-tile)] hover:bg-[var(--surface-tile-hover)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-white/40 active:scale-95"
            title="Back to home"
            aria-label="Back to home"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Home</span>
          </TransitionLink>
        </div>

        {/* Hero Section */}
        <header className="mb-10 sm:mb-14 text-left space-y-3">
          <h1 className="type-h1 font-display font-medium text-[var(--text-primary)] tracking-tight">
            Selected work
          </h1>
          <p className="type-body2 text-[var(--text-secondary)] max-w-2xl leading-relaxed">
            Three projects: an AI app builder, a live sports engine, and an event-driven store.
          </p>
        </header>

        {/* Projects Showcase List */}
        <section aria-label="Selected work" className="flex flex-col">
          {siteConfig.projects.map((project, idx) => {
            const meta = PROJECT_WORK_META[project.slug] || {
              index: `0${idx + 1}`,
              stackLine: project.stack.slice(0, 3).join(" · "),
              description: project.tagline,
            };

            return (
              <ProjectListingCard
                key={project.slug}
                project={project}
                idx={idx}
                meta={meta}
              />
            );
          })}
        </section>
      </div>
    </main>
  );
}
