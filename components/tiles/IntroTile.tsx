"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { siteConfig } from "@/content/site";
import { registerGSAPPlugins } from "@/lib/motion";
import { BentoTile } from "./BentoTile";

export function IntroTile({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGSAPPlugins();
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const el = containerRef.current;
      if (!el) return;

      gsap.from(el.querySelectorAll(".stagger-fade"), {
        y: 12,
        opacity: 0,
        stagger: 0.08,
        duration: 0.6,
        ease: "power3.out",
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <BentoTile className={className} noPadding>
      <div
        ref={containerRef}
        className="w-full h-full flex flex-col justify-between p-6 sm:p-7 xl:p-8 2xl:p-[56px] box-border"
      >
        <div className="space-y-2.5 2xl:space-y-4">
          <h1 className="stagger-fade text-[26px] sm:text-[32px] xl:text-[35px] 2xl:text-[40px] font-medium leading-[1.15] text-[var(--text-primary)] tracking-tight">
            Hi, I'm {siteConfig.firstName} —
          </h1>

          <p className="stagger-fade text-[15px] sm:text-[17px] xl:text-[19px] 2xl:text-[22px] text-[var(--text-secondary)] font-normal leading-[1.35]">
            {siteConfig.bio}
          </p>
        </div>

        {/* Availability badge pinned to the bottom */}
        <div className="stagger-fade mt-auto pt-2 2xl:pt-4 flex items-center gap-2 text-[12px] 2xl:text-[13px] font-mono text-[var(--text-secondary)]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{siteConfig.status}</span>
        </div>
      </div>
    </BentoTile>
  );
}
