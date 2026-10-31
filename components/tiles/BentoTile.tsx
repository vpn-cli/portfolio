"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { registerGSAPPlugins } from "@/lib/motion";

interface BentoTileProps {
  children: React.ReactNode;
  className?: string;
  enableTilt?: boolean;
  cursorText?: string;
  id?: string;
  tabIndex?: number;
  noPadding?: boolean;
}

export function BentoTile({
  children,
  className = "",
  enableTilt = true,
  cursorText,
  id,
  tabIndex = 0,
  noPadding = false,
}: BentoTileProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGSAPPlugins();
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !enableTilt) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      if (window.matchMedia("(pointer: coarse)").matches) return;

      const xToRotate = gsap.quickTo(card, "rotateY", { duration: 0.45, ease: "power2.out" });
      const yToRotate = gsap.quickTo(card, "rotateX", { duration: 0.45, ease: "power2.out" });
      const scaleTo = gsap.quickTo(card, "scale", { duration: 0.4, ease: "power2.out" });

      const handleMouseMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const nx = (x / rect.width) * 2 - 1;
        const ny = (y / rect.height) * 2 - 1;

        xToRotate(nx * 3);
        yToRotate(-ny * 3);
        scaleTo(1.02);

        if (glow) {
          glow.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
          glow.style.opacity = "1";
        }
      };

      const handleMouseLeave = () => {
        xToRotate(0);
        yToRotate(0);
        scaleTo(1.0);
        if (glow) {
          glow.style.opacity = "0";
        }
      };

      card.addEventListener("mousemove", handleMouseMove);
      card.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        card.removeEventListener("mousemove", handleMouseMove);
        card.removeEventListener("mouseleave", handleMouseLeave);
      };
    });

    return () => mm.revert();
  }, [enableTilt]);

  return (
    <div
      ref={cardRef}
      id={id}
      tabIndex={tabIndex}
      data-cursor={cursorText ? "pointer" : undefined}
      data-cursor-text={cursorText}
      style={{ transformStyle: "preserve-3d" }}
      className={`bento-tile bento-surface group relative rounded-[24px] ${
        noPadding ? "p-0" : "p-5 sm:p-6"
      } focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 overflow-hidden flex flex-col justify-between ${className}`}
    >
      {/* Specular Spotlight Glow (Tracks cursor) */}
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute w-64 h-64 rounded-full bg-gradient-to-r from-white/8 via-white/3 to-transparent blur-2xl opacity-0 transition-opacity duration-300"
      />

      {/* Apple Continuous Squircle Inner Top Bevel */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent"
      />

      {/* Content wrapper */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between">
        {children}
      </div>
    </div>
  );
}
