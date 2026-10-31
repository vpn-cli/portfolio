"use client";

import { useRef, useEffect } from "react";
import { siteConfig } from "@/content/site";
import { BentoTile } from "./BentoTile";
import { ArrowUpRight, Share2 } from "lucide-react";
import { gsap } from "gsap";

function MagneticSocialButton({
  label,
  handle,
  url,
}: {
  label: string;
  handle: string;
  url: string;
}) {
  const btnRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(pointer: coarse)").matches
    ) {
      return;
    }

    const xTo = gsap.quickTo(btn, "x", { duration: 0.3, ease: "power2.out" });
    const yTo = gsap.quickTo(btn, "y", { duration: 0.3, ease: "power2.out" });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      xTo(x * 0.35);
      yTo(y * 0.35);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    btn.addEventListener("mousemove", handleMouseMove);
    btn.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      btn.removeEventListener("mousemove", handleMouseMove);
      btn.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <a
      ref={btnRef}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="pointer"
      data-cursor-text="Visit"
      className="group relative flex items-center justify-between px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:border-accent/40 hover:bg-accent/10 transition-colors duration-200 overflow-hidden"
    >
      {/* Sliding Label Swap */}
      <div className="relative h-5 overflow-hidden">
        <span className="block text-sm font-medium text-white/90 transition-transform duration-300 ease-out group-hover:-translate-y-full">
          {label}
        </span>
        <span className="block text-sm font-medium text-accent transition-transform duration-300 ease-out translate-y-0 group-hover:-translate-y-full">
          {handle}
        </span>
      </div>

      <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
    </a>
  );
}

export function SocialTile({ className = "" }: { className?: string }) {
  return (
    <BentoTile className={className}>
      <div className="w-full h-full flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/25 flex items-center justify-center text-accent">
            <Share2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-display">Social Orbit</h3>
            <p className="text-xs text-white/50">Online frequency & writing</p>
          </div>
        </div>

        {/* 2x2 Grid of Magnetic Social Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-auto">
          {siteConfig.socials.map((social) => (
            <MagneticSocialButton
              key={social.label}
              label={social.label}
              handle={social.handle}
              url={social.url}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="text-[11px] text-white/40 pt-3 border-t border-white/[0.06] flex items-center justify-between">
          <span>Magnetic Target Tracking</span>
          <span className="font-mono">Direct Links</span>
        </div>
      </div>
    </BentoTile>
  );
}

