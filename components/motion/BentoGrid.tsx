"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { registerGSAPPlugins, MOTION } from "@/lib/motion";
import { siteConfig } from "@/content/site";
import { IntroTile } from "@/components/tiles/IntroTile";
import { ThreeTile } from "@/components/tiles/ThreeTile";
import { ProjectTile } from "@/components/tiles/ProjectTile";
import { LiveTile } from "@/components/tiles/LiveTile";
import { AboutTile } from "@/components/tiles/AboutTile";
import { StackTile } from "@/components/tiles/StackTile";
import { SocialTile } from "@/components/tiles/SocialTile";
import { ContactTile } from "@/components/tiles/ContactTile";

export function BentoGrid() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGSAPPlugins();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const grid = gridRef.current;
    if (!grid) return;

    const tiles = grid.querySelectorAll(".bento-tile");

    // Staggered entrance animation using our "apple-spring" custom ease
    const ctx = gsap.context(() => {
      gsap.from(tiles, {
        y: 40,
        opacity: 0,
        scale: 0.96,
        stagger: {
          amount: 0.7,
          from: "start",
        },
        duration: MOTION.durations.entrance,
        ease: "apple-spring",
        clearProps: "transform,opacity", // Crucial for hover tilt to function without conflicting
      });
    }, grid);

    return () => ctx.revert();
  }, []);

  const [project1, project2, project3] = siteConfig.projects;

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5 lg:gap-6 auto-rows-[minmax(180px,auto)]"
    >
      {/* TILE 1: Intro Narrative (Col Span: 7, Row Span: 2) */}
      <div className="lg:col-span-7 lg:row-span-2">
        <IntroTile className="h-full" />
      </div>

      {/* TILE 2: 3D Prismatic Core (Col Span: 5, Row Span: 2) */}
      <div className="lg:col-span-5 lg:row-span-2">
        <ThreeTile className="h-full min-h-[380px]" />
      </div>

      {/* TILE 3: Flagship Project Alpha (Col Span: 8, Row Span: 2) */}
      <div className="lg:col-span-8 lg:row-span-2">
        <ProjectTile project={project1} isFeatured={true} className="h-full" />
      </div>

      {/* TILE 4: Live Time & Sound Wave (Col Span: 4, Row Span: 1) */}
      <div className="lg:col-span-4 lg:row-span-1">
        <LiveTile className="h-full" />
      </div>

      {/* TILE 5: About / Ethos (Col Span: 4, Row Span: 1) */}
      <div className="lg:col-span-4 lg:row-span-1">
        <AboutTile className="h-full" />
      </div>

      {/* TILE 6: Project Beta (Col Span: 4, Row Span: 2) */}
      <div className="lg:col-span-4 lg:row-span-2">
        <ProjectTile project={project2} className="h-full" />
      </div>

      {/* TILE 7: Tech Stack Marquee (Col Span: 4, Row Span: 2) */}
      <div className="lg:col-span-4 lg:row-span-2">
        <StackTile className="h-full" />
      </div>

      {/* TILE 8: Project Gamma (Col Span: 4, Row Span: 2) */}
      <div className="lg:col-span-4 lg:row-span-2">
        <ProjectTile project={project3} className="h-full" />
      </div>

      {/* TILE 9: Social Orbit (Col Span: 6, Row Span: 1) */}
      <div className="lg:col-span-6 lg:row-span-1">
        <SocialTile className="h-full" />
      </div>

      {/* TILE 10: Contact Terminal (Col Span: 6, Row Span: 1) */}
      <div className="lg:col-span-6 lg:row-span-1">
        <ContactTile className="h-full" />
      </div>
    </div>
  );
}

