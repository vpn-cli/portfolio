"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CaseStudy } from "@/data/projects";
import { Play, Pause } from "lucide-react";
import { StreamMartDiagram } from "./StreamMartDiagram";

interface CaseStudyHeroProps {
  project: CaseStudy;
}

export function CaseStudyHero({ project }: CaseStudyHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [streamMartMode, setStreamMartMode] = useState<"video" | "diagram">("video");

  const clip = project.heroClip;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionQuery.matches);
    if (motionQuery.matches) {
      setStreamMartMode("diagram");
    }

    const handleMotion = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
      if (e.matches) {
        setStreamMartMode("diagram");
      }
    };
    motionQuery.addEventListener("change", handleMotion);

    // Pause video when offscreen to optimize performance
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!videoRef.current) return;
        if (entry.isIntersecting && !motionQuery.matches) {
          videoRef.current.play().catch(() => { });
          setIsPlaying(true);
        } else {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.25 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      motionQuery.removeEventListener("change", handleMotion);
      observer.disconnect();
    };
  }, []);

  const togglePlayback = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => { });
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // StreamMart has no UI: keep Diagram framing explicit while letting visitors switch
  // between the animated architecture changes demo video and the step-by-step diagram.
  if (project.slug === "stream-mart") {
    return (
      <div ref={containerRef} className="w-full space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[13px] font-mono uppercase tracking-wider bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
            Diagram · Architecture Only
          </span>

          <div
            role="tablist"
            aria-label="StreamMart visual view"
            className="inline-flex items-center p-1 rounded-lg bg-[var(--surface-tile)] border border-[var(--border-subtle)]"
          >
            <button
              type="button"
              role="tab"
              aria-selected={streamMartMode === "video"}
              onClick={() => setStreamMartMode("video")}
              className={`min-h-[36px] px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                streamMartMode === "video"
                  ? "bg-[var(--surface-tile-elevated)] text-[var(--text-primary)] shadow-xs border border-[var(--border-subtle)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              Changes demo video
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={streamMartMode === "diagram"}
              onClick={() => setStreamMartMode("diagram")}
              className={`min-h-[36px] px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                streamMartMode === "diagram"
                  ? "bg-[var(--surface-tile-elevated)] text-[var(--text-primary)] shadow-xs border border-[var(--border-subtle)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              Interactive diagram
            </button>
          </div>
        </div>

        {streamMartMode === "video" && !reducedMotion && clip?.mp4 ? (
          <div className="w-full aspect-[16/10] sm:aspect-[16/9] rounded-[var(--card-radius)] overflow-hidden bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] relative shadow-lg group">
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              poster={clip.poster}
              className="w-full h-full object-cover"
              aria-label="StreamMart refactored outbox and Kafka outage recovery architecture diagram demo"
            >
              {clip.webm && <source src={clip.webm} type="video/webm" />}
              <source src={clip.mp4} type="video/mp4" />
            </video>

            <button
              type="button"
              onClick={togglePlayback}
              className="absolute bottom-4 right-4 min-w-[44px] min-h-[44px] rounded-full bg-[oklch(0.15_0.015_var(--tint-hue)/0.7)] hover:bg-[oklch(0.15_0.015_var(--tint-hue)/0.85)] backdrop-blur-md border border-[oklch(0.94_0.01_var(--tint-hue)/0.2)] text-[oklch(0.96_0.01_var(--tint-hue))] flex items-center justify-center opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] shadow-md active:scale-95"
              aria-label={isPlaying ? "Pause video" : "Play video"}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-current" aria-hidden="true" />
              ) : (
                <Play className="w-4 h-4 text-current translate-x-0.5" aria-hidden="true" />
              )}
            </button>
          </div>
        ) : (
          <StreamMartDiagram />
        )}

        <p className="text-xs text-[var(--text-secondary)] text-center">
          {clip?.caption ||
            "Diagram: Refactored checkout flow through SKIP LOCKED outbox relays and idempotent eachBatch consumers."}
        </p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full space-y-2.5">
      <div className="w-full aspect-[16/10] sm:aspect-[16/9] rounded-[var(--card-radius)] overflow-hidden bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] relative shadow-lg group">
        {reducedMotion ? (
          <div className="relative w-full h-full">
            <Image
              src={clip?.poster || project.image}
              alt={`${project.title} interface preview`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 880px"
              className="object-cover"
            />
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              poster={clip?.poster}
              className="w-full h-full object-cover"
              aria-label={`${project.title} live interface preview`}
            >
              {clip?.webm && <source src={clip.webm} type="video/webm" />}
              {clip?.mp4 && <source src={clip.mp4} type="video/mp4" />}
            </video>

            {/* Play/Pause control on hover (44px target) */}
            <button
              type="button"
              onClick={togglePlayback}
              className="absolute bottom-4 right-4 min-w-[44px] min-h-[44px] rounded-full bg-[oklch(0.15_0.015_var(--tint-hue)/0.7)] hover:bg-[oklch(0.15_0.015_var(--tint-hue)/0.85)] backdrop-blur-md border border-[oklch(0.94_0.01_var(--tint-hue)/0.2)] text-[oklch(0.96_0.01_var(--tint-hue))] flex items-center justify-center opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] shadow-md active:scale-95"
              aria-label={isPlaying ? "Pause video" : "Play video"}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-current" aria-hidden="true" />
              ) : (
                <Play className="w-4 h-4 text-current translate-x-0.5" aria-hidden="true" />
              )}
            </button>
          </>
        )}
      </div>

      {/* Caption directly under visual (≤12 words) */}
      <p className="text-xs text-[var(--text-secondary)] text-center">
        {clip?.caption || "Live application state updating in real time."}
      </p>
    </div>
  );
}
