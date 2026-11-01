"use client";

import { useEffect, useRef, useState } from "react";
import { Film } from "lucide-react";

interface ProjectCardPreviewProps {
  slug: string;
  title: string;
  image: string;
  priority?: boolean;
}

export function ProjectCardPreview({
  slug,
  title,
  image,
  priority = false,
}: ProjectCardPreviewProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isSaveData, setIsSaveData] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(motionQuery.matches);

    const handleMotion = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    motionQuery.addEventListener("change", handleMotion);

    const nav = navigator as unknown as { connection?: { saveData?: boolean } };
    if (nav.connection?.saveData) {
      setIsSaveData(true);
    }

    return () => {
      motionQuery.removeEventListener("change", handleMotion);
    };
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (isReducedMotion || isSaveData) return;

    const video = videoRef.current;
    if (video) {
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const handleManualPlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const video = videoRef.current;
    if (video) {
      if (video.paused) {
        video
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      } else {
        video.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="w-full lg:w-1/2 aspect-[16/10] rounded-[var(--card-radius-inner)] overflow-hidden bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] relative shadow-md shrink-0 group/preview"
    >
      {/* Base Static Mockup / Image */}
      <img
        src={image}
        alt={title}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        className={`w-full h-full object-cover object-top transition-opacity duration-300 ${
          isPlaying ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Video Loop (Preload none to preserve mobile data and initial page load) */}
      <video
        ref={videoRef}
        playsInline
        muted
        loop
        preload="none"
        poster={`/videos/${slug}/brag.jpg`}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
          isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-label={`${title} demo video preview`}
      >
        <source src={`/videos/${slug}/brag.webm`} type="video/webm" />
        <source src={`/videos/${slug}/brag.mp4`} type="video/mp4" />
      </video>

      {/* Subtle "Watch demo" Pill / Badge */}
      <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 pointer-events-auto">
        <button
          type="button"
          onClick={handleManualPlay}
          className={`min-h-[36px] px-3 py-1.5 rounded-full text-xs font-medium border shadow-sm transition-[background-color,border-color,color] duration-200 flex items-center gap-1.5 motion-safe:active:scale-95 motion-reduce:transform-none disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
            isPlaying
              ? "bg-[var(--text-primary)] text-[var(--bg-canvas)] border-[var(--border-hover)]"
              : "bg-[var(--surface-tile-elevated)] hover:bg-[var(--surface-tile-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border-[var(--border-subtle)] hover:border-[var(--border-hover)]"
          }`}
          aria-label={isPlaying ? "Pause demo preview" : `Watch ${title} demo preview`}
        >
          {isPlaying ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-400 motion-safe:animate-pulse motion-reduce:animate-none" />
              <span>Playing demo</span>
            </>
          ) : (
            <>
              <Film className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Watch demo</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
