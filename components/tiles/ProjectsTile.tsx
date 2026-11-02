"use client";
/* Hallmark · answered 49 · footer link carries explicit whitespace-nowrap */

import { useState } from "react";
import Image from "next/image";
import { BentoTile } from "./BentoTile";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { usePageTransition } from "@/components/motion/RouteTransition";

interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  tags: string[];
  image: string;
  videoUrl?: string;
  videoPoster?: string;
  repoUrl: string;
  liveUrl: string;
}

const projectsList: ProjectItem[] = [
  {
    id: "appforge",
    slug: "appforge",
    title: "AppForge",
    category: "Generative AI · App Engine",
    summary: "Instant full-stack apps from natural prompts",
    tags: ["Next.js 15", "Groq", "PostgreSQL"],
    image: "/videos/appforge/brag.jpg",
    videoUrl: "/videos/appforge/brag.webm",
    videoPoster: "/videos/appforge/brag.jpg",
    repoUrl: "https://github.com/vpn-cli/appforge",
    liveUrl: "https://appforge-studios.vercel.app",
  },
  {
    id: "stream-mart",
    slug: "stream-mart",
    title: "StreamMart",
    category: "Microservices · Kafka",
    summary: "Event-driven e-commerce services on Kafka",
    tags: ["Kafka", "Node.js", "Docker"],
    image: "/projects/stream-mart.png",
    repoUrl: "https://github.com/vpn-cli/StreamMart",
    liveUrl: "https://github.com/vpn-cli/StreamMart#architecture--workflow",
  },
  {
    id: "sportz",
    slug: "sockets",
    title: "Sportz",
    category: "Real-time · WebSockets",
    summary: "Push-based live sports engine via WebSockets",
    tags: ["WebSockets", "Neon Postgres", "Arcjet"],
    image: "/videos/sockets/brag.jpg",
    videoUrl: "/videos/sockets/brag.webm",
    videoPoster: "/videos/sockets/brag.jpg",
    repoUrl: "https://github.com/vpn-cli/sockets",
    liveUrl: "https://sportz-rho.vercel.app",
  },
];

export function ProjectsTile({ className = "" }: { className?: string }) {
  const { navigateWithWipe } = usePageTransition();
  const [activeIdx, setActiveIdx] = useState(0);
  const [isHoveringRow, setIsHoveringRow] = useState(false);

  const activeProject = projectsList[activeIdx] || projectsList[0];

  return (
    <BentoTile className={className} cursorText="View work" noPadding>
      <div className="w-full h-full max-w-full flex flex-col justify-between p-4 sm:p-5 lg:p-5 xl:p-6 overflow-hidden">
        {/* Header row: "Selected work" (left) and "3 flagship systems" (right, muted) */}
        <div className="flex items-center justify-between mb-2.5 sm:mb-3 shrink-0">
          <h2 className="text-[18px] sm:text-[20px] font-bold text-[var(--text-primary)] leading-tight tracking-tight">
            Selected work
          </h2>
          <span className="text-[12.5px] sm:text-[13px] text-[var(--text-tertiary)] font-medium">
            3 flagship systems
          </span>
        </div>

        {/* Preview area (~55% of the tile height): shows ONE project at a time with smooth crossfade */}
        <div
          onClick={() => navigateWithWipe(`/work/${activeProject.slug}`)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              navigateWithWipe(`/work/${activeProject.slug}`);
            }
          }}
          tabIndex={0}
          role="link"
          aria-label={`View ${activeProject.title} case study`}
          className="relative w-full aspect-[16/9] min-h-[160px] sm:min-h-[185px] lg:min-h-[195px] xl:min-h-[215px] 2xl:min-h-[235px] max-h-[245px] shrink-0 rounded-xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--surface-tile-elevated)] cursor-pointer group/preview focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400 dark:focus-visible:ring-white/40"
        >
          {/* Overlay chip in corner naming the active project */}
          <div className="absolute top-2.5 left-2.5 z-20 px-2.5 py-1 rounded-md bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-[11px] font-medium tracking-wide flex items-center gap-1.5 shadow-md pointer-events-none">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>{activeProject.title}</span>
          </div>

          {/* Crossfading previews: video loop on hover if available, otherwise poster / Stageshow visual */}
          {projectsList.map((project, idx) => {
            const isCurrent = idx === activeIdx;

            return (
              <div
                key={project.id}
                className={`absolute inset-0 w-full h-full transition-opacity duration-250 ease-out ${
                  isCurrent ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                {project.videoUrl ? (
                  <video
                    ref={(el) => {
                      if (el) {
                        if (isCurrent && isHoveringRow) {
                          el.play().catch(() => {});
                        } else {
                          el.pause();
                          el.currentTime = 0;
                        }
                      }
                    }}
                    src={project.videoUrl}
                    poster={project.videoPoster || project.image}
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <Image
                    src={project.image}
                    alt={`${project.title} preview`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 550px"
                    className="object-cover object-top"
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Project list: 3 scannable rows with equal heights, dividers, and active accent bar */}
        <div className="my-2 flex-1 min-h-0 flex flex-col justify-between divide-y divide-[var(--border-subtle)]">
          {projectsList.map((project, idx) => {
            const isActive = idx === activeIdx;

            return (
              <div
                key={project.id}
                onMouseEnter={() => {
                  setActiveIdx(idx);
                  setIsHoveringRow(true);
                }}
                onMouseLeave={() => setIsHoveringRow(false)}
                onFocus={() => setActiveIdx(idx)}
                onClick={() => navigateWithWipe(`/work/${project.slug}`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    navigateWithWipe(`/work/${project.slug}`);
                  }
                }}
                tabIndex={0}
                role="link"
                aria-label={`View ${project.title} case study`}
                className={`relative flex-1 min-h-[50px] sm:min-h-[54px] pl-3 sm:pl-3.5 pr-2 sm:pr-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-between gap-2.5 sm:gap-3 group/row focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400 dark:focus-visible:ring-white/40 ${
                  isActive
                    ? "bg-[var(--surface-tile-elevated)]"
                    : "bg-transparent hover:bg-[var(--surface-tile-hover)]"
                }`}
              >
                {/* 2px accent bar on the left for active row */}
                <div
                  className={`absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-full transition-opacity duration-200 ${
                    isActive ? "bg-[var(--text-primary)] opacity-100" : "bg-transparent opacity-0"
                  }`}
                />

                {/* Mobile/tablet thumbnail poster at left */}
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg overflow-hidden shrink-0 relative border border-[var(--border-subtle)] lg:hidden">
                  <Image
                    src={project.image}
                    alt=""
                    fill
                    sizes="48px"
                    className="object-cover object-top"
                  />
                </div>

                {/* Text column: Line 1 (Name + Category), Line 2 (Summary <= 60 chars), Line 3 (Tags) */}
                <div className="min-w-0 flex-1 flex flex-col justify-center gap-0.5">
                  {/* Line 1: project name (medium weight) + category label muted */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[13.5px] sm:text-[14px] font-medium leading-tight ${
                        isActive
                          ? "text-[var(--text-primary)]"
                          : "text-[var(--text-secondary)] group-hover/row:text-[var(--text-primary)]"
                      }`}
                    >
                      {project.title}
                    </span>
                    <span className="text-[11.5px] text-[var(--text-tertiary)] leading-tight">
                      · {project.category}
                    </span>
                  </div>

                  {/* Line 2: one-line summary written to FIT (<= 60 chars max, no ellipses) */}
                  <p className="text-[12px] sm:text-[12.5px] text-[var(--text-secondary)] whitespace-nowrap overflow-hidden leading-tight">
                    {project.summary}
                  </p>

                  {/* Line 3: max 3 tags, smaller and quieter (muted outline style, not filled pills) */}
                  <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap pt-0.5">
                    {project.tags.map((tech) => (
                      <span
                        key={tech}
                        className="text-[11px] px-1.5 py-0.2 border border-[var(--border-subtle)] text-[var(--text-tertiary)] rounded leading-normal bg-transparent"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Direct Links (GitHub & Live demo): right-aligned, 18px icons, always visible, tooltips, stopPropagation */}
                <div
                  className="flex items-center gap-1 shrink-0"
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                >
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`${project.title} GitHub repository`}
                    aria-label={`${project.title} GitHub repository`}
                    className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-tile)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400"
                  >
                    <SiGithub className="w-[18px] h-[18px]" />
                  </a>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`${project.title} live demo`}
                    aria-label={`${project.title} live demo`}
                    className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-tile)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400"
                  >
                    <ExternalLink className="w-[18px] h-[18px]" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer: "All projects ↗" at bottom-left linking to /projects */}
        <div className="pt-2 mt-auto flex items-center justify-between shrink-0">
          <button
            onClick={() => navigateWithWipe("/projects")}
            type="button"
            className="text-[12.5px] sm:text-[13px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-[0.99] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400"
          >
            <span className="whitespace-nowrap">All projects</span>
            <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>
      </div>
    </BentoTile>
  );
}
