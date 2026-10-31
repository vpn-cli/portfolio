"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { registerGSAPPlugins } from "@/lib/motion";
import { siteConfig } from "@/content/site";
import { IntroTile } from "@/components/tiles/IntroTile";
import { ProjectTile } from "@/components/tiles/ProjectTile";
import { SocialTile } from "@/components/tiles/SocialTile";
import { AvatarTile } from "@/components/tiles/AvatarTile";
import { AboutTile } from "@/components/tiles/AboutTile";
import { ResourcesTile } from "@/components/tiles/ResourcesTile";
import { NewsletterTile } from "@/components/tiles/NewsletterTile";
import { StackTile } from "@/components/tiles/StackTile";
import { ThemeToggleTile } from "@/components/tiles/ThemeToggleTile";
import { ContactTile } from "@/components/tiles/ContactTile";

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

  const [projectCashless, projectMono, projectNexus] = siteConfig.projects;

  return (
    <div className="bento-outer-container">
      <div ref={gridRef} className="bento-grid-root">
        {/* ================= ROW 1 ================= */}
        {/* 1. Intro 5x1 */}
        <div className="tile-intro h-full w-full">
          <IntroTile className="w-full h-full" />
        </div>

        {/* 2. Project A 3x1 */}
        <div className="tile-project-a h-full w-full">
          <ProjectTile project={projectCashless} className="w-full h-full" />
        </div>

        {/* 3. Project B 2x1 */}
        <div className="tile-project-b h-full w-full">
          <ProjectTile project={projectMono} className="w-full h-full" />
        </div>

        {/* 4. Socials 2x1 (inner 3x2 icon grid) */}
        <div className="tile-socials h-full w-full">
          <SocialTile className="w-full h-full" />
        </div>

        {/* ================= ROW 2 ================= */}
        {/* 5. Portrait 2x1 */}
        <div className="tile-portrait h-full w-full">
          <AvatarTile className="w-full h-full" />
        </div>

        {/* 6. About 4x1 */}
        <div className="tile-about h-full w-full">
          <AboutTile className="w-full h-full" />
        </div>

        {/* 7. Project C 4x1 */}
        <div className="tile-project-c h-full w-full">
          <ProjectTile project={projectNexus} className="w-full h-full" />
        </div>

        {/* 8. Resources 2x1 */}
        <div className="tile-resources h-full w-full">
          <ResourcesTile className="w-full h-full" />
        </div>

        {/* ================= ROW 3 ================= */}
        {/* 9. Newsletter 5x1 */}
        <div className="tile-newsletter h-full w-full">
          <NewsletterTile className="w-full h-full" />
        </div>

        {/* 10. Stack 3x1 */}
        <div className="tile-stack h-full w-full">
          <StackTile className="w-full h-full" />
        </div>

        {/* 11. Theme toggle 2x1 */}
        <div className="tile-theme h-full w-full">
          <ThemeToggleTile className="w-full h-full" />
        </div>

        {/* 12. Contact 2x1 */}
        <div className="tile-contact h-full w-full">
          <ContactTile className="w-full h-full" />
        </div>
      </div>
    </div>
  );
}
