"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { registerGSAPPlugins } from "@/lib/motion";
import { IntroTile } from "@/components/tiles/IntroTile";
import { ProjectsTile } from "@/components/tiles/ProjectsTile";
import { AboutTile } from "@/components/tiles/AboutTile";
import { AvatarTile } from "@/components/tiles/AvatarTile";
import { SocialTile } from "@/components/tiles/SocialTile";
import { StackTile } from "@/components/tiles/StackTile";
import { ResourcesTile } from "@/components/tiles/ResourcesTile";
import { ContactTile } from "@/components/tiles/ContactTile";
import { ThemeToggleTile } from "@/components/tiles/ThemeToggleTile";

export function BentoGrid() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGSAPPlugins();

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const grid = gridRef.current;
      if (!grid) return;

      const tiles = grid.querySelectorAll(".bento-tile");
      gsap.fromTo(
        tiles,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.04,
          clearProps: "opacity,transform",
        }
      );
    });

    return () => mm.revert();
  }, []);

  return (
    <div className="bento-outer-container">
      <div ref={gridRef} className="bento-grid-root">
        {/* 1. Hero (cols 1-3, row 1 on desktop) */}
        <div className="tile-intro h-full w-full">
          <IntroTile className="w-full h-full" />
        </div>

        {/* 2. Projects (cols 4-5, rows 1-2 on desktop) */}
        <div className="tile-projects h-full w-full">
          <ProjectsTile className="w-full h-full" />
        </div>

        {/* 3. About (cols 2-3, row 2 on desktop) */}
        <div className="tile-about h-full w-full">
          <AboutTile className="w-full h-full" />
        </div>

        {/* 4. Photo / Portrait (col 1, row 2 on desktop) */}
        <div className="tile-portrait h-full w-full">
          <AvatarTile className="w-full h-full" />
        </div>

        {/* 5. Socials 2x2 (col 6, row 1 on desktop) */}
        <div className="tile-socials h-full w-full">
          <SocialTile className="w-full h-full" />
        </div>

        {/* 6. Stack I use (cols 1-3, row 3 on desktop) */}
        <div className="tile-stack h-full w-full">
          <StackTile className="w-full h-full" />
        </div>

        {/* 7. Resources (col 6, row 2 on desktop) */}
        <div className="tile-resources h-full w-full">
          <ResourcesTile className="w-full h-full" />
        </div>

        {/* 8. Contact (cols 5-6, row 3 on desktop) */}
        <div className="tile-contact h-full w-full">
          <ContactTile className="w-full h-full" />
        </div>

        {/* 9. Theme toggle (col 4, row 3 on desktop) */}
        <div className="tile-theme h-full w-full">
          <ThemeToggleTile className="w-full h-full" />
        </div>
      </div>
    </div>
  );
}
