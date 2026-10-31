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
        y: 12,
        opacity: 0,
        stagger: 0.08,
        duration: 0.6,
        ease: "apple-spring",
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <BentoTile className={className}>
      <div ref={containerRef} className="w-full h-full flex flex-col justify-between py-1">
        <div className="space-y-3">
          <h1 className="stagger-fade type-h1 font-display tracking-tight text-[var(--text-primary)]">
            Hi, I'm {siteConfig.firstName} —
          </h1>

          <p className="stagger-fade text-[15px] sm:text-[16px] text-[var(--text-secondary)] font-normal leading-relaxed">
            {siteConfig.role}, currently engineering scalable cloud architectures and interactive web applications based in{" "}
            <span className="text-[var(--text-primary)] font-medium">{siteConfig.city}</span>.
          </p>
        </div>

        {/* Quiet availability notice */}
        <div className="stagger-fade pt-3 mt-auto flex items-center gap-2 text-[12px] font-mono text-[var(--text-tertiary)]">
          <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
          <span>{siteConfig.status}</span>
        </div>
      </div>
    </BentoTile>
  );
}
