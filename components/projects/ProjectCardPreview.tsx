"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
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

  const previewVideo =
    slug === "sockets"
      ? {
        mp4: "/projects/sockets/sportz-live-score-update.mp4",
        webm: "/projects/sockets/sportz-live-score-update.webm",
        poster: "/projects/sockets/sportz-live-score-update-poster.webp",
        image: "/projects/sockets/sportz-live-match.webp",
      }
      : slug === "appforge"
        ? {
          mp4: "/projects/appforge/appforge-prompt-to-app.mp4",
          webm: "/projects/appforge/appforge-prompt-to-app.webm",
          poster: "/projects/appforge/appforge-prompt-to-app-poster.webp",
          image: "/projects/appforge/appforge-app-preview.webp",
        }
        : {
          mp4: null,
          webm: null,
          poster: "/projects/stream-mart/stream-mart-event-flow.webp",
          image: "/projects/stream-mart/stream-mart-event-flow.webp",
        };

  const displayImage = previewVideo.image || image;

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
    if (isReducedMotion || isSaveData || !previewVideo.mp4) return;

    const video = videoRef.current;
    if (video) {
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => { });
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
          .catch(() => { });
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
      {/* Base Static Image */}
      <Image
        src={displayImage}
        alt={`${title} live capture`}
        fill
        sizes="(max-width: 1024px) 100vw, 560px"
        priority={priority}
        className={`object-cover object-top transition-opacity duration-300 ${isPlaying ? "opacity-0" : "opacity-100"
          }`}
      />

      {/* Video Loop if available */}
      {previewVideo.mp4 && (
        <video
          ref={videoRef}
          playsInline
          muted
          loop
          preload="none"
          poster={previewVideo.poster}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          aria-label={`${title} preview clip`}
        >
          {previewVideo.webm && <source src={previewVideo.webm} type="video/webm" />}
          <source src={previewVideo.mp4} type="video/mp4" />
        </video>
      )}

      {/* Subtle Live/Clip Pill */}
      {previewVideo.mp4 && (
        <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 pointer-events-auto">
          <button
            type="button"
            onClick={handleManualPlay}
            className={`min-h-[36px] px-3 py-1.5 rounded-full text-xs font-medium border shadow-sm transition-[background-color,border-color,color] duration-200 flex items-center gap-1.5 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${isPlaying
                ? "bg-[var(--text-primary)] text-[var(--bg-canvas)] border-[var(--border-hover)]"
                : "bg-[var(--surface-tile-elevated)] hover:bg-[var(--surface-tile-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border-[var(--border-subtle)] hover:border-[var(--border-hover)]"
              }`}
            aria-label={isPlaying ? "Pause preview" : `Watch ${title} preview`}
          >
            {isPlaying ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 motion-safe:animate-pulse" />
                <span>Playing clip</span>
              </>
            ) : (
              <>
                <Film className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Hover to preview</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
