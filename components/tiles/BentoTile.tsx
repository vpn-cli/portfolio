"use client";

import React, { useRef } from "react";

interface BentoTileProps {
  children: React.ReactNode;
  className?: string;
  enableTilt?: boolean;
  cursorText?: string;
  id?: string;
  tabIndex?: number;
  noPadding?: boolean;
  href?: string;
  target?: string;
  rel?: string;
  ariaLabel?: string;
}

export function BentoTile({
  children,
  className = "",
  enableTilt = true,
  cursorText,
  id,
  tabIndex = 0,
  noPadding = false,
  href,
  target,
  rel,
  ariaLabel,
}: BentoTileProps) {
  const cardRef = useRef<HTMLDivElement | HTMLAnchorElement | null>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!enableTilt || typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const nx = (x / rect.width) * 2 - 1;
    const ny = (y / rect.height) * 2 - 1;

    card.style.transform = `perspective(1000px) rotateX(${-ny * 3}deg) rotateY(${nx * 3}deg) scale3d(1.015, 1.015, 1.015)`;

    if (glowRef.current) {
      glowRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      glowRef.current.style.opacity = "1";
    }
  };

  const handlePointerLeave = () => {
    const card = cardRef.current;
    if (card) {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    }
    if (glowRef.current) {
      glowRef.current.style.opacity = "0";
    }
  };

  const tileClasses = `bento-tile bento-surface group relative rounded-[24px] ${
    noPadding ? "" : "p-5 sm:p-6"
  } focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400 dark:focus-visible:ring-white/40 overflow-hidden flex flex-col justify-between transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transform-none ${className}`;

  const tileContent = (
    <div className="relative z-10 w-full h-full flex flex-col justify-between">
      {children}
    </div>
  );

  if (href) {
    return (
      <a
        ref={cardRef as React.RefObject<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={rel}
        aria-label={ariaLabel}
        id={id}
        data-cursor={cursorText ? "pointer" : undefined}
        data-cursor-text={cursorText}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{ transformStyle: "preserve-3d" }}
        className={tileClasses}
      >
        {tileContent}
      </a>
    );
  }

  return (
    <div
      ref={cardRef as React.RefObject<HTMLDivElement>}
      id={id}
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      data-cursor={cursorText ? "pointer" : undefined}
      data-cursor-text={cursorText}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ transformStyle: "preserve-3d" }}
      className={tileClasses}
    >
      {tileContent}
    </div>
  );
}
