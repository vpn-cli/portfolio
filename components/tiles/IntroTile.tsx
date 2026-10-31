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
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = containerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll(".stagger-fade"), {
        y: 16,
        opacity: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: "apple-spring",
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <BentoTile className={className}>
      <div ref={containerRef} className="w-full h-full flex flex-col justify-between py-1">
        {/* Main Heading & Bio */}
        <div className="space-y-4">
          <h1 className="stagger-fade type-h1 font-display tracking-tight text-[var(--text-primary)]">
            Hi, I'm {siteConfig.firstName} —
          </h1>

          <p className="stagger-fade type-body3 text-[var(--text-secondary)] font-light leading-relaxed max-w-xl">
            {siteConfig.role}, currently engineering scalable cloud architectures and interactive web applications based in{" "}
            <span className="text-[var(--text-primary)] font-normal">{siteConfig.city}</span>.
          </p>
        </div>

        {/* Live Availability Status */}
        <div className="stagger-fade pt-4 mt-auto flex items-center gap-2 text-xs font-mono text-[var(--text-secondary)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>{siteConfig.status}</span>
        </div>
      </div>
    </BentoTile>
  );
}
