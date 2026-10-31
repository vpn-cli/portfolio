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
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Subtle Vignette for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

        {/* Floating Circular Arrow Pill (Fades / moves in on hover) */}
        <div className="absolute top-3.5 right-3.5 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
          <div className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg">
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>

        {/* Minimal Bottom Label on Hover */}
        <div className="absolute bottom-3 left-3.5 right-3.5 z-20 flex items-center justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-[11px] font-mono text-white/90 drop-shadow">
            {project.title}
          </span>
          <span className="text-[10px] font-mono uppercase tracking-wider text-white/60 drop-shadow">
            {project.category}
          </span>
        </div>
      </div>
    </BentoTile>
  );
}
