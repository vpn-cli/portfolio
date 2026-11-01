"use client";

import { Project } from "@/content/site";
import { BentoTile } from "./BentoTile";
import { usePageTransition } from "@/components/motion/RouteTransition";
import { ArrowUpRight } from "lucide-react";

export function ProjectTile({
  project,
  className = "",
}: {
  project: Project;
  className?: string;
}) {
  const { navigateWithWipe } = usePageTransition();

  return (
    <BentoTile className={className} noPadding cursorText={`View ${project.title}`}>
      <div
        onClick={() => navigateWithWipe(`/work/${project.slug}`)}
        className="w-full h-full relative cursor-pointer group overflow-hidden rounded-[24px]"
      >
        {/* Full-Bleed Image: absolute inset-0 prevents image from pushing grid cell height */}
        <img
          src={project.image}
          alt={project.title}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Subtle Vignette for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

        {/* Floating Circular Arrow Pill (Fades / moves in on hover) */}
        <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-[opacity,transform] duration-300 transform translate-y-1 group-hover:translate-y-0">
          <div className="w-9 h-9 rounded-full bg-[var(--surface-tile)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-primary)] shadow-md">
            <ArrowUpRight className="w-4 h-4 transition-transform duration-200 motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5 motion-reduce:transform-none" aria-hidden="true" />
          </div>
        </div>
      </div>
    </BentoTile>
  );
}
