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
}

export function BentoTile({
  children,
  className = "",
  enableTilt = true,
  cursorText,
  id,
  tabIndex = 0,
}: BentoTileProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGSAPPlugins();
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !enableTilt) return;

    // Disable 3D tilt if reduced motion is requested or on touch devices
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(pointer: coarse)").matches
    ) {
      return;
    }

    // High performance gsap.quickTo setters
    const xToRotate = gsap.quickTo(card, "rotateY", { duration: 0.45, ease: "power2.out" });
    const yToRotate = gsap.quickTo(card, "rotateX", { duration: 0.45, ease: "power2.out" });
    const scaleTo = gsap.quickTo(card, "scale", { duration: 0.4, ease: "power2.out" });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Normalized coordinates (-1 to 1)
      const nx = (x / rect.width) * 2 - 1;
      const ny = (y / rect.height) * 2 - 1;

      // Subtle 3D tilt
      xToRotate(nx * 5); // rotateY
      yToRotate(-ny * 5); // rotateX
      scaleTo(1.015);

      // Specular spotlight position
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
  }, [enableTilt]);

  return (
    <div
      ref={cardRef}
      id={id}
      tabIndex={tabIndex}
      data-cursor={cursorText ? "pointer" : undefined}
      data-cursor-text={cursorText}
      style={{ transformStyle: "preserve-3d" }}
      className={`bento-tile group relative rounded-[32px] bg-[#12141A]/90 backdrop-blur-xl border border-white/[0.08] p-6 sm:p-8 transition-colors duration-300 hover:border-white/[0.18] hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8),0_0_30px_rgba(255,107,0,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-[#08090C] overflow-hidden ${className}`}
    >
      {/* Specular Spotlight Glow (Tracks cursor) */}
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute w-80 h-80 rounded-full bg-gradient-to-r from-accent/20 via-amber-400/10 to-transparent blur-2xl opacity-0 transition-opacity duration-300"
      />

      {/* Apple Squircle Inner Top Bevel */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"
      />

      {/* Content wrapper with z-index to stay above spotlight */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between">
        {children}
      </div>
    </div>
  );
}

