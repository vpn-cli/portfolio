"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CaseStudy } from "@/data/projects";
import { Play, Pause } from "lucide-react";
import { HeroEventFlow } from "./HeroEventFlow";
import { StreamMartDiagram } from "./StreamMartDiagram";

interface CaseStudyHeroProps {
  project: CaseStudy;
}

export function CaseStudyHero({ project }: CaseStudyHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  const clip = project.heroClip;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionQuery.matches);

    const handleMotion = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
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

  // If project is stream-mart (no UI), render the real repo-grounded architecture diagram
  if (project.slug === "stream-mart") {
    return (
      <div className="w-full space-y-2.5">
        <StreamMartDiagram />
        <p className="text-xs text-[var(--text-tertiary)] font-mono text-center">
          {clip?.caption || "Diagram: Transactional outbox event flow through Apache Kafka cluster."}
        </p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full space-y-2.5">
      <div className="w-full aspect-[16/10] sm:aspect-[16/9] rounded-[var(--card-radius)] overflow-hidden bg-black border border-[var(--border-subtle)] relative shadow-lg group">
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
              className="absolute bottom-4 right-4 min-w-[44px] min-h-[44px] rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white shadow-md active:scale-95"
              aria-label={isPlaying ? "Pause video" : "Play video"}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-white" aria-hidden="true" />
              ) : (
                <Play className="w-4 h-4 text-white translate-x-0.5" aria-hidden="true" />
              )}
            </button>
          </>
        )}
      </div>

      {/* Caption directly under visual (≤12 words) */}
      <p className="text-xs text-[var(--text-tertiary)] font-mono text-center">
        {clip?.caption || "Live application state updating in real time."}
      </p>
    </div>
  );
}
