"use client";

import { useEffect, useRef, useState } from "react";
import { StreamMartDiagram } from "./StreamMartDiagram";

interface ProjectCardPreviewProps {
  slug: string;
  title: string;
  image: string;
  priority?: boolean;
}

interface PreviewConfig {
  chromeTitle: string;
  statusBadge: {
    label: string;
    isLive?: boolean;
    isDiagram?: boolean;
  };
  videoMp4?: string;
  videoWebm?: string;
  poster: string;
  isDiagram?: boolean;
}

const PREVIEW_CONFIGS: Record<string, PreviewConfig> = {
  sockets: {
    chromeTitle: "sportz.live — Live Score Telemetry",
    statusBadge: { label: "LIVE CONNECTED", isLive: true },
    videoMp4: "/projects/sockets/sportz-live-score-update.mp4",
    videoWebm: "/projects/sockets/sportz-live-score-update.webm",
    poster: "/projects/sockets/sportz-live-score-update-poster.webp",
  },
  "stream-mart": {
    chromeTitle: "stream-mart — Event Outbox Pipeline",
    statusBadge: { label: "Diagram", isDiagram: true },
    poster: "/projects/stream-mart/stream-mart-event-flow.webp",
    isDiagram: true,
  },
  appforge: {
    chromeTitle: "appforge.dev — Copilot Studio",
    statusBadge: { label: "READY" },
    videoMp4: "/projects/appforge/appforge-prompt-to-app.mp4",
    videoWebm: "/projects/appforge/appforge-prompt-to-app.webm",
    poster: "/projects/appforge/appforge-prompt-to-app-poster.webp",
  },
};

export function ProjectCardPreview({
  slug,
  title,
  image,
  priority = false,
}: ProjectCardPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  const config = PREVIEW_CONFIGS[slug] || {
    chromeTitle: `${slug} preview`,
    statusBadge: { label: "PREVIEW" },
    poster: image,
  };

  // 1. Detect prefers-reduced-motion
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // 2. IntersectionObserver (50% in view triggers autoplay, leaves pauses)
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof window === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting;
        setIsInView(inView);

        const video = videoRef.current;
        if (!video || !config.videoMp4) return;

        if (inView && !isReducedMotion) {
          video.play().catch(() => {
            // Autoplay policy fallback: muted video is standard
          });
        } else {
          video.pause();
        }
      },
      {
        threshold: 0.15,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [config.videoMp4, isReducedMotion]);

  return (
    <div
      ref={containerRef}
      className="w-full lg:w-[60%] shrink-0 rounded-xl overflow-hidden bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] group-hover:border-[var(--border-hover)] shadow-sm transition-[border-color,transform] duration-200 ease-out motion-safe:group-hover:scale-[1.01] flex flex-col"
    >
      {/* Stageshow Window Chrome Header */}
      <div className="h-8 px-3.5 bg-[var(--surface-tile)] border-b border-[var(--border-subtle)] flex items-center justify-between shrink-0 select-none">
        {/* macOS Traffic Lights */}
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]/80 dark:bg-[#FF5F56]/60 border border-black/10" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]/80 dark:bg-[#FFBD2E]/60 border border-black/10" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]/80 dark:bg-[#27C93F]/60 border border-black/10" />
        </div>

        {/* Quiet Window Title / Route */}
        <span className="text-[11px] font-mono text-[var(--text-tertiary)] truncate max-w-[200px] sm:max-w-xs">
          {config.chromeTitle}
        </span>

        {/* Status Badge */}
        <div className="flex items-center">
          <span
            className={`text-[9.5px] font-mono tracking-wider px-2 py-0.5 rounded border inline-flex items-center gap-1.5 ${
              config.statusBadge.isLive
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                : config.statusBadge.isDiagram
                ? "bg-[var(--surface-tile-elevated)] text-[var(--text-secondary)] border-[var(--border-subtle)] font-semibold"
                : "bg-[var(--surface-tile-elevated)] text-[var(--text-tertiary)] border-[var(--border-subtle)]"
            }`}
          >
            {config.statusBadge.isLive && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 motion-safe:animate-pulse" />
            )}
            {config.statusBadge.label}
          </span>
        </div>
      </div>

      {/* Main Preview Stage (Aspect 16/10) */}
      <div className="relative w-full aspect-[16/10] bg-[var(--bg-canvas-subtle)] overflow-hidden">
        {config.isDiagram ? (
          <StreamMartDiagram active={isInView} />
        ) : (
          <>
            {/* Base static poster frame - NEVER blank on load */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={config.poster}
              alt={`${title} live capture`}
              loading={priority ? "eager" : "lazy"}
              fetchPriority={priority ? "high" : "auto"}
              className="absolute inset-0 w-full h-full object-cover object-top"
            />

            {/* Live Autoplaying Video Clip (loops when in view) */}
            {config.videoMp4 && !isReducedMotion && (
              <video
                ref={videoRef}
                playsInline
                muted
                loop
                preload={priority ? "auto" : "metadata"}
                poster={config.poster}
                className="absolute inset-0 w-full h-full object-cover object-top"
                aria-label={`${title} live capture clip`}
              >
                {config.videoWebm && <source src={config.videoWebm} type="video/webm" />}
                <source src={config.videoMp4} type="video/mp4" />
              </video>
            )}
          </>
        )}
      </div>
    </div>
  );
}
