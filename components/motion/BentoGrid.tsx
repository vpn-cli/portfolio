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

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const grid = gridRef.current;
    if (!grid) return;

    const tiles = grid.querySelectorAll(".bento-tile");

    const ctx = gsap.context(() => {
      gsap.from(tiles, {
        y: 30,
        opacity: 0,
        scale: 0.97,
        stagger: 0.05,
        duration: 0.7,
        ease: "apple-spring",
        clearProps: "transform,opacity",
      });
    }, grid);

    return () => ctx.revert();
  }, []);

  const [projectCashless, projectMono, projectNexus] = siteConfig.projects;

  return (
    <div
      ref={gridRef}
      className="p-3 sm:p-5 lg:p-6 rounded-[36px] bg-[#0E0F12]/80 dark:bg-[#0E0F12]/80 border border-white/[0.06] shadow-2xl backdrop-blur-sm"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 sm:gap-4 lg:gap-5">
        {/* ================= ROW 1 ================= */}
        {/* Intro Tile (Hi, I'm Vipin) */}
        <div className="md:col-span-12 lg:col-span-4 min-h-[300px] flex">
          <IntroTile className="w-full h-full" />
        </div>

        {/* Phone 1: Cashless */}
        <div className="md:col-span-6 lg:col-span-3 min-h-[300px] flex">
          <ProjectTile project={projectCashless} className="w-full h-full" />
        </div>

        {/* Phone 2: Mono Pay */}
        <div className="md:col-span-6 lg:col-span-3 min-h-[300px] flex">
          <ProjectTile project={projectMono} className="w-full h-full" />
        </div>

        {/* Social Icons 3x2 Grid */}
        <div className="md:col-span-12 lg:col-span-2 min-h-[160px] lg:min-h-[300px] flex">
          <SocialTile className="w-full h-full" />
        </div>

        {/* ================= ROW 2 ================= */}
        {/* Avatar / Portrait Card */}
        <div className="md:col-span-4 lg:col-span-2 min-h-[220px] flex">
          <AvatarTile className="w-full h-full" />
        </div>

        {/* About Statement Card */}
        <div className="md:col-span-8 lg:col-span-3 min-h-[220px] flex">
          <AboutTile className="w-full h-full" />
        </div>

        {/* Laptop Mockup: Nexus DevFlow */}
        <div className="md:col-span-12 lg:col-span-5 min-h-[280px] lg:min-h-[220px] flex">
          <ProjectTile project={projectNexus} className="w-full h-full" />
        </div>

        {/* Resources Card */}
        <div className="md:col-span-6 lg:col-span-2 min-h-[220px] flex">
          <ResourcesTile className="w-full h-full" />
        </div>

        {/* ================= ROW 3 ================= */}
        {/* Newsletter / Dev Tips Card */}
        <div className="md:col-span-12 lg:col-span-5 min-h-[200px] flex">
          <NewsletterTile className="w-full h-full" />
        </div>

        {/* Stack I use */}
        <div className="md:col-span-8 lg:col-span-3 min-h-[200px] flex">
          <StackTile className="w-full h-full" />
        </div>

        {/* Theme Toggle Pill Switch */}
        <div className="md:col-span-4 lg:col-span-1 min-h-[140px] lg:min-h-[200px] flex">
          <ThemeToggleTile className="w-full h-full" />
        </div>

        {/* Have a project in mind? (Contact) */}
        <div className="md:col-span-12 lg:col-span-3 min-h-[200px] flex">
          <ContactTile className="w-full h-full" />
        </div>
      </div>
    </div>
  );
}
