"use client";

import { useRef } from "react";
import { Project } from "@/content/site";
import { BentoTile } from "./BentoTile";
import { ArrowUpRight } from "lucide-react";
import { usePageTransition } from "@/components/motion/RouteTransition";
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { registerGSAPPlugins } from "@/lib/motion";

interface ProjectTileProps {
  project: Project;
  className?: string;
  isFeatured?: boolean;
}

export function ProjectTile({ project, className = "", isFeatured = false }: ProjectTileProps) {
  const { navigateWithWipe } = usePageTransition();
  const cardRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    registerGSAPPlugins();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      navigateWithWipe(`/work/${project.slug}`);
      return;
    }

    const card = cardRef.current;
    if (!card) {
      navigateWithWipe(`/work/${project.slug}`);
      return;
    }

    // Capture initial layout state for GSAP Flip feel
    const state = Flip.getState(card);

    // Create a clone overlay to expand into full viewport
    const rect = card.getBoundingClientRect();
    const clone = card.cloneNode(true) as HTMLElement;
    clone.style.position = "fixed";
    clone.style.top = `${rect.top}px`;
    clone.style.left = `${rect.left}px`;
    clone.style.width = `${rect.width}px`;
    clone.style.height = `${rect.height}px`;
    clone.style.zIndex = "9999";
    clone.style.margin = "0";
    clone.style.borderRadius = "32px";
    clone.style.pointerEvents = "none";
    document.body.appendChild(clone);

    // Expand clone to full viewport
    gsap.to(clone, {
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      borderRadius: "0px",
      duration: 0.75,
      ease: "cinematic-expo",
      onComplete: () => {
        navigateWithWipe(`/work/${project.slug}`);
        setTimeout(() => {
          clone.remove();
        }, 300);
      },
    });
  };

  return (
    <div ref={cardRef} className={className}>
      <BentoTile
        cursorText="Explore"
        className="h-full group cursor-pointer"
        tabIndex={0}
      >
        <div
          onClick={handleClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              navigateWithWipe(`/work/${project.slug}`);
            }
          }}
          className="w-full h-full flex flex-col justify-between"
        >
          {/* Top Info Bar */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-accent font-mono font-medium block mb-1">
                {project.category}
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white group-hover:text-accent transition-colors duration-300 font-display">
                {project.title}
              </h3>
            </div>

            {/* Corner Arrow with hover shift */}
            <div className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-white/70 group-hover:text-accent group-hover:border-accent/40 group-hover:bg-accent/10 transition-all duration-300 shrink-0">
              <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </div>
          </div>

          {/* Interactive Visual Canvas / Thumbnail */}
          <div
            ref={mediaRef}
            className={`relative w-full rounded-2xl overflow-hidden border border-white/[0.06] bg-gradient-to-br ${project.accentGradient} p-6 sm:p-8 flex flex-col justify-end transition-transform duration-500 group-hover:scale-[1.02] ${
              isFeatured ? "min-h-[260px] sm:min-h-[320px]" : "min-h-[180px] sm:min-h-[220px]"
            }`}
          >
            {/* Atmospheric light glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-accent/35 transition-colors duration-500" />

            {/* Mockup / Abstract Wireframe UI Element */}
            <div className="relative z-10 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-accent/80 animate-ping" />
                <span className="text-xs font-mono uppercase tracking-widest text-white/80">
                  {project.client} // {project.year}
                </span>
              </div>
              <p className="text-sm text-white/90 line-clamp-2 max-w-lg font-light">
                {project.tagline}
              </p>
            </div>

            {/* Metrics Chips */}
            <div className="relative z-10 flex flex-wrap gap-2 mt-4 pt-3 border-t border-white/10">
              {project.metrics.slice(0, 2).map((metric, i) => (
                <span
                  key={i}
                  className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-black/40 border border-white/10 text-white/75 backdrop-blur-md"
                >
                  {metric}
                </span>
              ))}
            </div>
          </div>
        </div>
      </BentoTile>
    </div>
  );
}

