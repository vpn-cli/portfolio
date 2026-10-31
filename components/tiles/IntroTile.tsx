"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { siteConfig } from "@/content/site";
import { registerGSAPPlugins } from "@/lib/motion";
import { BentoTile } from "./BentoTile";
import { MapPin, Sparkles } from "lucide-react";

export function IntroTile({ className = "" }: { className?: string }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bioRef = useRef<HTMLParagraphElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGSAPPlugins();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const heading = headingRef.current;
    const bio = bioRef.current;
    const meta = metaRef.current;

    if (!heading || !bio) return;

    // SplitText masked character reveal for heading
    const splitHeading = new SplitText(heading, {
      type: "chars,words",
      charsClass: "inline-block overflow-hidden",
    });

    // SplitText masked line reveal for bio paragraph
    const splitBio = new SplitText(bio, {
      type: "lines",
      linesClass: "overflow-hidden",
    });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      tl.from(splitHeading.chars, {
        y: "115%",
        opacity: 0,
        rotateX: -30,
        stagger: 0.02,
        duration: 0.85,
        ease: "apple-spring",
      });

      tl.from(
        splitBio.lines,
        {
          y: "100%",
          opacity: 0,
          stagger: 0.08,
          duration: 0.75,
          ease: "apple-spring",
        },
        "-=0.5"
      );

      if (meta) {
        tl.from(
          meta.children,
          {
            opacity: 0,
            y: 12,
            stagger: 0.06,
            duration: 0.6,
            ease: "apple-spring",
          },
          "-=0.4"
        );
      }
    });

    return () => {
      splitHeading.revert();
      splitBio.revert();
      ctx.revert();
    };
  }, []);

  return (
    <BentoTile className={className}>
      {/* Top Header Row: Status Badge & Geo */}
      <div ref={metaRef} className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/25 text-accent text-xs font-medium tracking-wide">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
          </span>
          <span>{siteConfig.status}</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-white/50 font-mono tracking-wider">
          <MapPin className="w-3.5 h-3.5 text-accent" />
          <span>{siteConfig.city}</span>
          <span className="text-white/20">|</span>
          <span className="hidden sm:inline">{siteConfig.coordinates}</span>
        </div>
      </div>

      {/* Main Narrative Display */}
      <div className="my-auto">
        <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-accent font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{siteConfig.role}</span>
        </div>

        <h1
          ref={headingRef}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.08] mb-4 font-display"
        >
          Hi, I'm {siteConfig.name}
        </h1>

        <p
          ref={bioRef}
          className="text-base sm:text-lg text-white/70 leading-relaxed max-w-2xl font-light"
        >
          {siteConfig.bio}
        </p>
      </div>

      {/* Bottom Footer Details */}
      <div className="pt-6 mt-6 border-t border-white/[0.06] flex items-center justify-between text-xs text-white/40">
        <span>Bespoke Creative Engineering</span>
        <span className="font-mono">v2.6 // 2026 Edition</span>
      </div>
    </BentoTile>
  );
}

