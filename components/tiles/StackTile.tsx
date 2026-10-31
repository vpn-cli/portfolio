"use client";

import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/content/site";
import { BentoTile } from "./BentoTile";
import { useLenisInstance } from "@/components/motion/SmoothScrollProvider";
import { Layers } from "lucide-react";
import { gsap } from "gsap";

export function StackTile({ className = "" }: { className?: string }) {
  const { lenis } = useLenisInstance();
  const trackRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef(false);
  const [activeSpeed, setActiveSpeed] = useState(1);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Respect reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let progress = 0;
    let currentSpeed = 1;
    let targetSpeed = 1;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      // React to Lenis scroll velocity
      if (lenis && !isHoveredRef.current) {
        const scrollVelocity = Math.abs(lenis.velocity || 0);
        targetSpeed = 1 + scrollVelocity * 0.08;
      } else if (isHoveredRef.current) {
        targetSpeed = 0.25; // Slow down on hover
      } else {
        targetSpeed = 1;
      }

      // Smoothly interpolate current speed towards target
      currentSpeed += (targetSpeed - currentSpeed) * Math.min(1, delta * 6);
      setActiveSpeed(Math.round(currentSpeed * 10) / 10);

      // Increment track position
      progress += currentSpeed * delta * 45; // 45px per second base
      if (track) {
        track.style.transform = `translateX(-${progress % 1000}px)`;
      }

      rafId = requestAnimationFrame(loop);
    };

    let rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [lenis]);

  // Triple items array for seamless infinite looping
  const items = [...siteConfig.techStack, ...siteConfig.techStack, ...siteConfig.techStack];

  return (
    <BentoTile className={className}>
      <div
        onMouseEnter={() => {
          isHoveredRef.current = true;
        }}
        onMouseLeave={() => {
          isHoveredRef.current = false;
        }}
        className="w-full h-full flex flex-col justify-between"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/25 flex items-center justify-center text-accent">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-display">Engineering Stack</h3>
              <p className="text-xs text-white/50">Production-hardened toolchain</p>
            </div>
          </div>

          <div className="text-[11px] font-mono text-accent/80 px-2 py-0.5 rounded border border-accent/20 bg-accent/5">
            {activeSpeed > 1.2 ? `Velocity Boost: ${activeSpeed}x` : "Cruise: 1.0x"}
          </div>
        </div>

        {/* Marquee Track Container with Gradient Edge Masks */}
        <div className="relative w-full overflow-hidden mask-marquee py-3">
          <div
            ref={trackRef}
            className="flex items-center gap-3 will-change-transform whitespace-nowrap"
            style={{ width: "max-content" }}
          >
            {items.map((tech, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:border-accent/40 hover:bg-accent/10 transition-colors duration-200"
              >
                <div className="w-2 h-2 rounded-full bg-accent" />
                <span className="text-sm font-medium text-white/90">{tech.name}</span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/[0.06] text-white/50">
                  {tech.highlight}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <div className="flex items-center justify-between text-[11px] text-white/40 pt-2 border-t border-white/[0.06]">
          <span>Hover to inspect</span>
          <span className="font-mono">Lenis Kinetic Sync</span>
        </div>
      </div>
    </BentoTile>
  );
}

