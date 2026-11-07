"use client";

import { ArrowUpRight } from "lucide-react";
import { ProjectCardPreview } from "./ProjectCardPreview";
import { trackEvent } from "@/lib/analytics";
import { CaseStudy } from "@/data/projects";
import { TransitionLink } from "@/components/motion/RouteTransition";

interface ProjectListingCardProps {
  project: CaseStudy;
  idx: number;
  meta: {
    index: string;
    stackLine: string;
    description: string;
  };
  dataReveal?: boolean;
}

export function ProjectListingCard({ project, idx, meta, dataReveal }: ProjectListingCardProps) {
  const sourceUrl = project.links?.repo || project.githubUrl;

  const handleSourceClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (sourceUrl) {
      trackEvent("outbound_click", {
        destination: "project_repo",
        url: sourceUrl,
        location: "all_projects",
      });
    }
  };

  return (
    <article
      {...(dataReveal ? { "data-reveal": "" } : {})}
      className="group relative flex flex-col lg:flex-row items-center gap-8 lg:gap-12 py-10 sm:py-14 border-b border-[var(--border-subtle)] last:border-b-0"
    >
      <TransitionLink
        href={`/work/${project.slug}`}
        trackLocation="all_projects"
        className="absolute inset-0 z-10 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-white/40"
        aria-label={`View ${project.title} case study`}
      />

      <ProjectCardPreview
        slug={project.slug}
        title={project.title}
        image={project.image}
        priority={idx === 0}
      />

      <div className="w-full lg:w-[40%] flex flex-col justify-center space-y-4">
        <div className="flex items-center gap-2.5 font-mono text-xs text-[var(--text-tertiary)] select-none">
          <span className="font-semibold text-[var(--text-secondary)]">{meta.index}</span>
          <span className="text-[var(--border-subtle)]" aria-hidden="true">
            /
          </span>
          <span className="tracking-tight">{meta.stackLine}</span>
          <span className="text-[var(--border-subtle)]" aria-hidden="true">
            ·
          </span>
          <span>{project.year}</span>
        </div>

        <h2 className="type-h2 font-display font-medium text-[var(--text-primary)] tracking-tight">
          {project.title}
        </h2>

        <p className="type-body4 text-[var(--text-secondary)] leading-relaxed">
          {meta.description}
        </p>

        <div className="pt-2 flex items-center gap-3 relative z-20">
          <TransitionLink
            href={`/work/${project.slug}`}
            trackLocation="all_projects"
            className="min-h-[40px] inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--text-primary)] text-[var(--bg-canvas)] hover:opacity-90 font-medium text-xs sm:text-sm transition-opacity shadow-sm active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-white/40"
          >
            <span>Read case study</span>
            <ArrowUpRight
              className="w-3.5 h-3.5 transition-transform motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </TransitionLink>

          {sourceUrl && (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-ph-capture-attribute-location="all_projects"
              onClick={handleSourceClick}
              className="min-h-[40px] inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[var(--surface-tile)] hover:bg-[var(--surface-tile-hover)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-medium text-xs sm:text-sm transition-colors active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-white/40"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>Source</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
