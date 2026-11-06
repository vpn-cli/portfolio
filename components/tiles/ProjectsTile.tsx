"use client";
/* Hallmark · teaser redesign: preview-forward, restrained motion, clean scannable teaser rows */

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BentoTile } from "./BentoTile";
import { ArrowUpRight } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { usePageTransition, TransitionLink } from "@/components/motion/RouteTransition";
import { trackEvent } from "@/lib/analytics";

interface TeaserProject {
  id: string;
  slug: string;
  title: string;
  teaserLine: string;
  image: string;
  repoUrl: string;
  liveUrl: string;
}

const projectsList: TeaserProject[] = [
  {
    id: "appforge",
    slug: "appforge",
    title: "AppForge",
    teaserLine: "Apps from a sentence",
    // Crop of actual generated-app UI (2x WebP)
    image: "/projects/teaser-appforge.webp",
    repoUrl: "https://github.com/vpn-cli/appforge",
    liveUrl: "https://appforge-studios.vercel.app",
  },
  {
    id: "sportz",
    slug: "sockets",
    title: "Sportz",
    teaserLine: "Live scores, zero refresh",
    // Live dashboard UI telemetry & score cards (2x WebP)
    image: "/projects/teaser-sportz.webp",
    repoUrl: "https://github.com/vpn-cli/sockets",
    liveUrl: "https://sportz-rho.vercel.app",
  },
  {
    id: "stream-mart",
    slug: "stream-mart",
    title: "StreamMart",
    teaserLine: "Orders over Kafka",
    // Intentional event flow visual: Order → Kafka → Payment services (2x WebP)
    image: "/projects/teaser-stream-mart.webp",
    repoUrl: "https://github.com/vpn-cli/StreamMart",
    liveUrl: "https://github.com/vpn-cli/StreamMart#architecture--workflow",
  },
];

export function ProjectsTile({ className = "" }: { className?: string }) {
  const router = useRouter();
  const { navigateWithWipe } = usePageTransition();
  const cardRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Detect prefers-reduced-motion
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // IntersectionObserver to pause when card is off-screen
  useEffect(() => {
    const el = cardRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const isPaused = isHovered || isFocused || !isIntersecting || prefersReducedMotion;

  // Auto-advance every 4s unless paused or reduced motion
  useEffect(() => {
    if (isPaused) return;

    const timer = setTimeout(() => {
      setActiveIdx((prev) => (prev + 1) % projectsList.length);
    }, 4000);

    return () => clearTimeout(timer);
  }, [activeIdx, isPaused]);

  const activeProject = projectsList[activeIdx] || projectsList[0];

  return (
    <BentoTile className={className} cursorText="View work" enableTilt={false} noPadding>
      <div
        ref={cardRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => {
          if (!cardRef.current?.contains(e.relatedTarget as Node)) {
            setIsFocused(false);
          }
        }}
        className="w-full h-full max-w-full flex flex-col justify-between p-4 sm:p-5 lg:p-5 xl:p-6 overflow-hidden"
      >
        {/* Header row: "Selected work" (left) and "01 / 03" counter (right, following active project) */}
        <div className="flex items-center justify-between mb-2 sm:mb-2.5 shrink-0">
          <h2 className="text-[18px] sm:text-[20px] font-bold text-[var(--text-primary)] leading-tight tracking-tight">
            Selected work
          </h2>
          <span className="font-mono text-[12px] sm:text-[12.5px] font-medium text-[var(--text-tertiary)] tabular-nums">
            {`0${activeIdx + 1} / 0${projectsList.length}`}
          </span>
        </div>

        {/* Preview area (~60% of card height): fills area edge to edge with card's inner radius */}
        <div
          onMouseEnter={() => router.prefetch(`/work/${activeProject.slug}`)}
          onFocus={() => router.prefetch(`/work/${activeProject.slug}`)}
          onClick={() => {
            trackEvent("project_click", { project: activeProject.title, where: "teaser" });
            navigateWithWipe(`/work/${activeProject.slug}`);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              trackEvent("project_click", { project: activeProject.title, where: "teaser" });
              navigateWithWipe(`/work/${activeProject.slug}`);
            }
          }}
          tabIndex={0}
          role="link"
          aria-label={`View ${activeProject.title} project`}
          className="relative w-full flex-1 min-h-[140px] sm:min-h-[165px] lg:min-h-[180px] xl:min-h-[200px] 2xl:min-h-[220px] max-h-[240px] rounded-xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--surface-tile-elevated)] cursor-pointer group/preview focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400 dark:focus-visible:ring-white/40 select-none"
        >
          {projectsList.map((project, idx) => {
            const isCurrent = idx === activeIdx;

            return (
              <div
                key={project.id}
                className={`absolute inset-0 w-full h-full transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none ${isCurrent
                    ? "opacity-100 scale-100 z-10"
                    : "opacity-0 scale-[1.02] pointer-events-none z-0 motion-reduce:scale-100"
                  }`}
              >
                <Image
                  src={project.image}
                  alt={`${project.title} preview`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 600px"
                  className="object-cover object-top"
                  priority={idx === 0}
                />
                {project.id === "appforge" && (
                  <div className="absolute bottom-2 left-2 z-20 pointer-events-none">
                    <span className="inline-block px-2 py-0.5 rounded-md text-[11px] sm:text-[11.5px] font-medium bg-black/85 text-white border border-white/10 shadow-xs">
                      Generated by AppForge from one prompt
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Project list: 3 scannable rows with plain teaser copy, active bottom progress bar, and hover links */}
        <div className="my-2 sm:my-2.5 flex flex-col justify-between gap-1 sm:gap-1.5 shrink-0">
          {projectsList.map((project, idx) => {
            const isActive = idx === activeIdx;

            return (
              <div
                key={project.id}
                onMouseEnter={() => {
                  setActiveIdx(idx);
                  router.prefetch(`/work/${project.slug}`);
                }}
                onFocus={() => {
                  setActiveIdx(idx);
                  router.prefetch(`/work/${project.slug}`);
                }}
                onClick={() => {
                  trackEvent("project_click", { project: project.title, where: "teaser" });
                  navigateWithWipe(`/work/${project.slug}`);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    trackEvent("project_click", { project: project.title, where: "teaser" });
                    navigateWithWipe(`/work/${project.slug}`);
                  }
                }}
                tabIndex={0}
                role="link"
                aria-label={`View ${project.title} project`}
                className={`relative flex items-center justify-between pl-3 pr-2.5 py-1.5 sm:py-2 rounded-lg transition-colors cursor-pointer group/row focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400 dark:focus-visible:ring-white/40 select-none ${isActive
                    ? "bg-[var(--surface-tile-elevated)]"
                    : "bg-transparent hover:bg-[var(--surface-tile-hover)]"
                  }`}
              >
                {/* Left: Project title and short plain teaser line */}
                <div className="min-w-0 flex-1 flex flex-col justify-center">
                  <span
                    className={`text-[13.5px] sm:text-[14px] font-medium leading-tight transition-colors ${isActive
                        ? "text-[var(--text-primary)]"
                        : "text-[var(--text-secondary)] group-hover/row:text-[var(--text-primary)]"
                      }`}
                  >
                    {project.title}
                  </span>
                  <p className="text-[12px] sm:text-[12.5px] text-[var(--text-tertiary)] group-hover/row:text-[var(--text-secondary)] leading-tight mt-0.5 truncate transition-colors">
                    {project.teaserLine}
                  </p>
                </div>

                {/* Right: Direct links (GitHub & ArrowUpRight) - hidden by default, fade in on row hover/focus, always visible on touch */}
                <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover/row:opacity-100 group-focus-visible/row:opacity-100 [@media(pointer:coarse)]:opacity-100 transition-opacity duration-200">
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`${project.title} GitHub repository`}
                    aria-label={`${project.title} GitHub repository`}
                    onClick={(e) => {
                      e.stopPropagation();
                      trackEvent("source_click", { project: project.title });
                    }}
                    onKeyDown={(e) => e.stopPropagation()}
                    className="w-7 h-7 flex items-center justify-center rounded-md text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-tile)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400"
                  >
                    <SiGithub className="w-4 h-4" />
                  </a>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Open ${project.title}`}
                    aria-label={`Open ${project.title}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      trackEvent("demo_click", { project: project.title });
                    }}
                    onKeyDown={(e) => e.stopPropagation()}
                    className="w-7 h-7 flex items-center justify-center rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-tile)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400"
                  >
                    <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover/row:translate-x-0.5 group-hover/row:-translate-y-0.5" />
                  </a>
                </div>

                {/* Thin progress bar along bottom edge for active row (replaces left border) */}
                {isActive && (
                  <div className="absolute left-3 right-3 bottom-0 h-[2px] bg-[var(--border-subtle)] overflow-hidden rounded-full">
                    <div
                      key={`${project.id}-${activeIdx}`}
                      style={{
                        animation: prefersReducedMotion ? "none" : "teaser-progress 4s linear forwards",
                        animationPlayState: isPaused ? "paused" : "running",
                        transform: prefersReducedMotion ? "scaleX(1)" : undefined,
                      }}
                      className="w-full h-full bg-[var(--text-primary)] rounded-full origin-left motion-reduce:transform-none"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer: "All projects ↗" aligned with row text and matched font weight */}
        <div className="pt-1.5 mt-auto flex items-center justify-between shrink-0 pl-3">
          <TransitionLink
            href="/projects"
            className="group/btn text-[13.5px] sm:text-[14px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-[0.99] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400 no-underline"
          >
            <span className="whitespace-nowrap">All projects</span>
            <ArrowUpRight className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
          </TransitionLink>
        </div>
      </div>
    </BentoTile>
  );
}
