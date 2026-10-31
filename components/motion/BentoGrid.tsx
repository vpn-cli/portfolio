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
import { ThreeTile } from "@/components/tiles/ThreeTile";
import { LiveTile } from "@/components/tiles/LiveTile";

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

    const ctx = gsap.context(() => {
      gsap.fromTo(
        tiles,
        { y: 12, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.02,
          duration: 0.45,
          ease: "power2.out",
          clearProps: "opacity,transform",
        }
      );
    }, grid);

    return () => ctx.revert();
  }, []);

  const [projectCashless, projectMono, projectNexus] = siteConfig.projects;

  return (
    <div
      ref={gridRef}
      className="w-full max-w-[1360px] mx-auto p-3 sm:p-4 rounded-[32px] sm:rounded-[36px] bg-[#0E0F12] border border-white/[0.07] shadow-2xl transition-colors duration-300"
    >
      {/* 
        At lg (≥1024px, 1440px desktop):
        Single 12-column grid with exactly 3 calibrated rows: 245px, 245px, 195px.
        Total grid height = 713px. Fits in 1 viewport at 1440x900!
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-3.5 lg:grid-rows-[245px_245px_195px]">
        {/* ================= ROW 1 ================= */}
        {/* 1. Intro Tile */}
        <div className="md:col-span-2 lg:col-span-4 h-full min-h-[220px] lg:min-h-0">
          <IntroTile className="w-full h-full" />
        </div>

        {/* 2. Phone 1: Cashless */}
        <div className="md:col-span-1 lg:col-span-3 h-full min-h-[240px] lg:min-h-0">
          <ProjectTile project={projectCashless} className="w-full h-full" />
        </div>

        {/* 3. Phone 2: Mono Pay */}
        <div className="md:col-span-1 lg:col-span-3 h-full min-h-[240px] lg:min-h-0">
          <ProjectTile project={projectMono} className="w-full h-full" />
        </div>

        {/* 4. Social Cluster (3x2 of 1x1 buttons) */}
        <div className="md:col-span-2 lg:col-span-2 h-full min-h-[140px] lg:min-h-0">
          <SocialTile className="w-full h-full" />
        </div>

        {/* ================= ROW 2 ================= */}
        {/* 5. Avatar Photo Tile */}
        <div className="md:col-span-1 lg:col-span-2 h-full min-h-[200px] lg:min-h-0">
          <AvatarTile className="w-full h-full" />
        </div>

        {/* 6. About Tile */}
        <div className="md:col-span-1 lg:col-span-3 h-full min-h-[200px] lg:min-h-0">
          <AboutTile className="w-full h-full" />
        </div>

        {/* 7. Laptop Flagship Project */}
        <div className="md:col-span-2 lg:col-span-5 h-full min-h-[220px] lg:min-h-0">
          <ProjectTile project={projectNexus} className="w-full h-full" />
        </div>

        {/* 8. Resources Tile */}
        <div className="md:col-span-2 lg:col-span-2 h-full min-h-[160px] lg:min-h-0">
          <ResourcesTile className="w-full h-full" />
        </div>

        {/* ================= ROW 3 ================= */}
        {/* 9. Newsletter Tile */}
        <div className="md:col-span-1 lg:col-span-3 h-full min-h-[170px] lg:min-h-0">
          <NewsletterTile className="w-full h-full" />
        </div>

        {/* 10. Three.js Refractive Glass Monolith */}
        <div className="md:col-span-1 lg:col-span-2 h-full min-h-[170px] lg:min-h-0">
          <ThreeTile className="w-full h-full" />
        </div>

        {/* 11. Live Local-Time & Focus */}
        <div className="md:col-span-1 lg:col-span-2 h-full min-h-[170px] lg:min-h-0">
          <LiveTile className="w-full h-full" />
        </div>

        {/* 12. Stack I use */}
        <div className="md:col-span-1 lg:col-span-2 h-full min-h-[170px] lg:min-h-0">
          <StackTile className="w-full h-full" />
        </div>

        {/* 13. Theme Toggle Switch */}
        <div className="md:col-span-1 lg:col-span-1 h-full min-h-[100px] lg:min-h-0">
          <ThemeToggleTile className="w-full h-full" />
        </div>

        {/* 14. Contact / Copy Email Tile */}
        <div className="md:col-span-1 lg:col-span-2 h-full min-h-[170px] lg:min-h-0">
          <ContactTile className="w-full h-full" />
        </div>
      </div>
    </div>
  );
}
