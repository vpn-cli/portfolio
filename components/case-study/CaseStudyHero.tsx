"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { CaseStudy } from "@/data/projects";
import { BragVideoPlayer } from "@/components/video/BragVideoPlayer";
import { Film, Sparkles } from "lucide-react";

const LlmsTxtShowcase = dynamic(
  () => import("@/components/stageshow/LlmsTxtShowcase").then((m) => m.LlmsTxtShowcase),
  {
    ssr: false,
    loading: () => (
      <div className="w-full aspect-[16/9] min-h-[360px] sm:min-h-[420px] rounded-[var(--card-radius)] bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] flex items-center justify-center motion-safe:animate-pulse motion-reduce:animate-none" />
    ),
  }
);

const SocketsShowcase = dynamic(
  () => import("@/components/stageshow/SocketsShowcase").then((m) => m.SocketsShowcase),
  {
    ssr: false,
    loading: () => (
      <div className="w-full aspect-[16/9] min-h-[360px] sm:min-h-[420px] rounded-[var(--card-radius)] bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] flex items-center justify-center motion-safe:animate-pulse motion-reduce:animate-none" />
    ),
  }
);

const AppforgeShowcase = dynamic(
  () => import("@/components/stageshow/AppforgeShowcase").then((m) => m.AppforgeShowcase),
  {
    ssr: false,
    loading: () => (
      <div className="w-full aspect-[16/9] min-h-[360px] sm:min-h-[420px] rounded-[var(--card-radius)] bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] flex items-center justify-center motion-safe:animate-pulse motion-reduce:animate-none" />
    ),
  }
);

interface CaseStudyHeroProps {
  project: CaseStudy;
}

export function CaseStudyHero({ project }: CaseStudyHeroProps) {
  // Default mode: video demo
  const [activeTab, setActiveTab] = useState<"video" | "interactive">("video");

  const poster = `/videos/${project.slug}/brag.jpg`;

  return (
    <div className="w-full space-y-3">
      {/* Mode Switcher Tabs */}
      <div className="flex items-center justify-between">
        <div
          role="tablist"
          aria-label="Showcase view selector"
          className="inline-flex items-center p-1 rounded-full bg-[var(--surface-tile)] border border-[var(--border-subtle)] gap-1"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "video"}
            onClick={() => setActiveTab("video")}
            className={`min-h-[36px] px-3.5 py-1.5 rounded-full text-xs font-medium inline-flex items-center gap-1.5 transition-colors motion-safe:active:scale-95 motion-reduce:transform-none disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 ${
              activeTab === "video"
                ? "bg-[var(--text-primary)] text-[var(--bg-canvas)] shadow-sm"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Film className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Launch video (20s)</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "interactive"}
            onClick={() => setActiveTab("interactive")}
            className={`min-h-[36px] px-3.5 py-1.5 rounded-full text-xs font-medium inline-flex items-center gap-1.5 transition-colors motion-safe:active:scale-95 motion-reduce:transform-none disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 ${
              activeTab === "interactive"
                ? "bg-[var(--text-primary)] text-[var(--bg-canvas)] shadow-sm"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Interactive simulator</span>
          </button>
        </div>

        <span className="text-xs text-[var(--text-tertiary)] hidden sm:inline font-mono">
          {activeTab === "video" ? "1080p · 20s overview" : "Real-time DOM simulation"}
        </span>
      </div>

      {/* Hero Display Slot */}
      {activeTab === "video" ? (
        <BragVideoPlayer
          slug={project.slug}
          title={project.title}
          poster={poster}
        />
      ) : (
        <div className="w-full">
          {project.slug === "llms-txt" && <LlmsTxtShowcase />}
          {project.slug === "sockets" && <SocketsShowcase />}
          {project.slug === "appforge" && <AppforgeShowcase />}
          {!["llms-txt", "sockets", "appforge"].includes(project.slug) && (
            <SocketsShowcase />
          )}
        </div>
      )}
    </div>
  );
}
