"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, RotateCcw } from "lucide-react";

interface BragVideoPlayerProps {
  slug: string;
  title: string;
  poster: string;
  musicCredit?: string;
  className?: string;
}

export function BragVideoPlayer({
  slug,
  title,
  poster,
  musicCredit = "Music: Sascha Ende, ende.app (CC BY 4.0)",
  className = "",
}: BragVideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isSaveData, setIsSaveData] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Detect prefers-reduced-motion and Save-Data on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };
    mediaQuery.addEventListener("change", handleMotionChange);

    // Save-Data client hint
    const nav = navigator as unknown as { connection?: { saveData?: boolean } };
    if (nav.connection?.saveData) {
      setIsSaveData(true);
    }

    return () => {
      mediaQuery.removeEventListener("change", handleMotionChange);
    };
  }, []);

  // IntersectionObserver: lazy-load & autoplay only when visible in viewport
  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    // Under prefers-reduced-motion or Save-Data, do NOT autoplay
    if (isReducedMotion || isSaveData) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          if (!userPaused) {
            video
              .play()
              .then(() => setIsPlaying(true))
              .catch(() => {
                // Autoplay blocked by browser policy until user gesture
                setIsPlaying(false);
              });
          }
        } else {
          video.pause();
          setIsPlaying(false);
        }
      },
      {
        threshold: 0.35,
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [isReducedMotion, isSaveData, userPaused]);

  // Video time update for progress bar
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    setProgress((video.currentTime / video.duration) * 100);
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video
        .play()
        .then(() => {
          setIsPlaying(true);
          setUserPaused(false);
        })
        .catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
      setUserPaused(true);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleRestart = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().then(() => {
      setIsPlaying(true);
      setUserPaused(false);
    });
  };

  return (
    <div className={`w-full space-y-2.5 ${className}`}>
      {/* 16:9 Video Canvas Container */}
      <div
        ref={containerRef}
        className="w-full aspect-[16/9] rounded-[var(--card-radius)] overflow-hidden bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] relative shadow-md group select-none"
      >
        <video
          ref={videoRef}
          playsInline
          muted={isMuted}
          loop
          preload="metadata"
          poster={poster}
          onTimeUpdate={handleTimeUpdate}
          onLoadedData={() => setIsLoaded(true)}
          className="w-full h-full object-cover"
          aria-label={`${title} launch demonstration video`}
        >
          <source src={`/videos/${slug}/brag.webm`} type="video/webm" />
          <source src={`/videos/${slug}/brag.mp4`} type="video/mp4" />
          Your browser does not support HTML5 video.
        </video>

        {/* Poster / Reduced Motion Overlay fallback */}
        {(isReducedMotion || isSaveData) && !isPlaying && (
          <div className="absolute inset-0 bg-[oklch(0.12_0.015_var(--tint-hue)/0.85)] flex flex-col items-center justify-center p-4 text-center">
            <p className="text-xs text-[oklch(0.92_0.01_var(--tint-hue))] mb-3">
              {isReducedMotion
                ? "Autoplay paused (prefers-reduced-motion active)"
                : "Autoplay paused (Save-Data mode active)"}
            </p>
            <button
              type="button"
              onClick={togglePlay}
              className="min-h-[44px] min-w-[44px] px-5 py-2.5 rounded-full bg-[oklch(0.96_0.01_var(--tint-hue))] text-[oklch(0.17_0.015_var(--tint-hue))] font-medium text-xs sm:text-sm inline-flex items-center gap-2 shadow-lg hover:bg-[oklch(0.90_0.012_var(--tint-hue))] transition-[background-color] duration-150 motion-safe:active:scale-95 motion-reduce:transform-none disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]"
              aria-label={`Play ${title} demo video`}
            >
              <Play className="w-4 h-4 fill-current" aria-hidden="true" />
              <span>Play demo video</span>
            </button>
          </div>
        )}

        {/* Video Overlay Controls (accessible, min-h 44px touch targets) */}
        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 bg-gradient-to-t from-[oklch(0.10_0.015_var(--tint-hue)/0.9)] via-[oklch(0.10_0.015_var(--tint-hue)/0.5)] to-transparent flex flex-col gap-2 opacity-90 transition-opacity duration-200 group-hover:opacity-100 focus-within:opacity-100">
          {/* Subtle Progress Bar (transform scaleX for 60fps GPU acceleration) */}
          <div
            className="w-full h-1 bg-[oklch(0.94_0.01_var(--tint-hue)/0.25)] rounded-full overflow-hidden cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pos = (e.clientX - rect.left) / rect.width;
              if (videoRef.current && videoRef.current.duration) {
                videoRef.current.currentTime = pos * videoRef.current.duration;
              }
            }}
          >
            <div
              className="h-full w-full bg-[oklch(0.94_0.01_var(--tint-hue))] origin-left transition-transform duration-100 rounded-full"
              style={{ transform: `scaleX(${progress / 100})` }}
            />
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between">
            {/* Left Controls: Play/Pause & Restart */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={togglePlay}
                className="min-h-[44px] min-w-[44px] rounded-lg bg-[oklch(0.15_0.015_var(--tint-hue)/0.5)] hover:bg-[oklch(0.15_0.015_var(--tint-hue)/0.8)] text-[oklch(0.94_0.01_var(--tint-hue))] flex items-center justify-center transition-[background-color] duration-150 motion-safe:active:scale-95 motion-reduce:transform-none disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]"
                aria-label={isPlaying ? "Pause video" : "Play video"}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-current" aria-hidden="true" />
                ) : (
                  <Play className="w-4 h-4 fill-current" aria-hidden="true" />
                )}
              </button>

              <button
                type="button"
                onClick={handleRestart}
                className="min-h-[44px] min-w-[44px] rounded-lg bg-[oklch(0.15_0.015_var(--tint-hue)/0.5)] hover:bg-[oklch(0.15_0.015_var(--tint-hue)/0.8)] text-[oklch(0.74_0.015_var(--tint-hue))] hover:text-[oklch(0.94_0.01_var(--tint-hue))] flex items-center justify-center transition-[background-color,color] duration-150 motion-safe:active:scale-95 motion-reduce:transform-none disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]"
                aria-label="Restart video from beginning"
                title="Restart"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
              </button>

              <span className="text-xs text-[oklch(0.74_0.015_var(--tint-hue))] px-2 hidden sm:inline">
                20s Demo
              </span>
            </div>

            {/* Right Controls: Sound Toggle */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleMute}
                className="min-h-[44px] min-w-[44px] px-3 rounded-lg bg-[oklch(0.15_0.015_var(--tint-hue)/0.5)] hover:bg-[oklch(0.15_0.015_var(--tint-hue)/0.8)] text-[oklch(0.94_0.01_var(--tint-hue))] flex items-center gap-2 transition-[background-color] duration-150 motion-safe:active:scale-95 motion-reduce:transform-none disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]"
                aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                title={isMuted ? "Unmute audio" : "Mute audio"}
              >
                {isMuted ? (
                  <>
                    <VolumeX className="w-4 h-4 text-[oklch(0.74_0.015_var(--tint-hue))]" aria-hidden="true" />
                    <span className="text-xs text-[oklch(0.74_0.015_var(--tint-hue))] hidden sm:inline">
                      Muted
                    </span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-[oklch(0.94_0.01_var(--tint-hue))]" aria-hidden="true" />
                    <span className="text-xs text-[oklch(0.94_0.01_var(--tint-hue))] hidden sm:inline">
                      Sound on
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Music Licence & Attribution Line (CC BY 4.0 requirement) */}
      <div className="w-full flex items-center justify-between text-xs text-[var(--text-tertiary)] px-1">
        <span>1080p · WebM / H.264</span>
        <span>
          Music:{" "}
          <a
            href="https://ende.app"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-[var(--text-secondary)] transition-colors"
          >
            Sascha Ende
          </a>{" "}
          (
          <a
            href="https://creativecommons.org/licenses/by/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--text-secondary)] transition-colors"
          >
            CC BY 4.0
          </a>
          )
        </span>
      </div>
    </div>
  );
}
