"use client";

import { useState } from "react";
import Image from "next/image";
import { BentoTile } from "./BentoTile";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { usePageTransition } from "@/components/motion/RouteTransition";

interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  stack: string[];
  image: string;
  videoUrl?: string;
  videoPoster?: string;
  repoUrl: string;
  liveUrl: string;
}

const projectsList: ProjectItem[] = [
  {
    id: "appforge",
    slug: "appforge",
    title: "AppForge",
    tagline:
      "Generative AI runtime compiling LLM-streamed JSON ASTs into Next.js UI in sub-800ms.",
    stack: ["Next.js 15", "Groq", "Kafka", "Redis", "Zod"],
    image: "/projects/appforge-live.png",
    videoUrl: "/videos/appforge/brag.webm",
    videoPoster: "/videos/appforge/brag.jpg",
    repoUrl: "https://github.com/vpn-cli/appforge",
    liveUrl: "https://appforge-studios.vercel.app",
  },
  {
    id: "stream-mart",
    slug: "stream-mart",
    title: "StreamMart",
    tagline:
      "Event-driven e-commerce microservices backend with Kafka and Transactional Outbox pattern.",
    stack: ["Node.js", "Kafka", "PostgreSQL", "Docker", "Drizzle"],
    image: "/projects/stream-mart.png",
    repoUrl: "https://github.com/vpn-cli/StreamMart",
    liveUrl: "https://github.com/vpn-cli/StreamMart#architecture--workflow",
  },
  {
    id: "sportz",
    slug: "sockets",
    title: "Sportz",
    tagline:
      "Real-time analytical sports engine serving sub-80ms WebSocket updates with PostgreSQL & Drizzle.",
    stack: ["Next.js 15", "WebSockets", "PostgreSQL", "Drizzle"],
    image: "/stageshow-sockets-dark.png",
    videoUrl: "/videos/sockets/brag.webm",
    videoPoster: "/videos/sockets/brag.jpg",
    repoUrl: "https://github.com/vpn-cli/sockets",
    liveUrl: "https://sportz-rho.vercel.app",
  },
];

export function ProjectsTile({ className = "" }: { className?: string }) {
  const { navigateWithWipe } = usePageTransition();
  const [activeIdx, setActiveIdx] = useState(0);

  const activeProject = projectsList[activeIdx];

  return (
    <BentoTile className={className} cursorText="View work" noPadding>
      <div className="w-full h-full flex flex-col justify-between p-5 sm:p-6 overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-3 z-20">
          <h2 className="text-[20px] font-bold text-[var(--text-primary)] leading-tight tracking-tight">
            Selected work
          </h2>
          <span className="text-[13px] text-[var(--text-tertiary)] font-medium">
            3 flagship systems
          </span>
        </div>

        {/* Real Screenshot / Video Loop Preview */}
        <div
          onClick={() => navigateWithWipe(`/work/${activeProject.slug}`)}
          className="relative w-full aspect-[16/9] max-h-[160px] sm:max-h-[190px] xl:max-h-[210px] rounded-xl overflow-hidden border border-transparent bg-[var(--surface-tile-elevated)] cursor-pointer group/preview"
        >
          {projectsList.map((project, idx) => (
            <div
              key={project.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${
                idx === activeIdx ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {project.videoUrl ? (
                <video
                  src={project.videoUrl}
                  poster={project.videoPoster || project.image}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover object-top transition-transform duration-300 group-hover/preview:scale-[1.02]"
                />
              ) : (
                <Image
                  src={project.image}
                  alt={`${project.title} preview`}
                  fill
                  sizes="(max-width: 640px) 90vw, 480px"
                  className="object-cover object-top transition-transform duration-300 group-hover/preview:scale-[1.02]"
                />
              )}
            </div>
          ))}

          </div>

        {/* Project Selector Tabs */}
        <div className="my-2.5 flex flex-col gap-1.5">
          {projectsList.map((project, idx) => {
            const isActive = idx === activeIdx;

            return (
              <div
                key={project.id}
                onMouseEnter={() => setActiveIdx(idx)}
                onClick={() => navigateWithWipe(`/work/${project.slug}`)}
                className={`py-2 px-2.5 rounded-lg transition-colors cursor-pointer flex flex-col gap-1 ${
                  isActive
                    ? "bg-[var(--surface-tile-elevated)]"
                    : "hover:bg-[var(--surface-tile-hover)]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isActive ? "bg-sky-500" : "bg-neutral-500"
                      }`}
                    />
                    <span
                      className={`text-[16px] font-bold ${
                        isActive
                          ? "text-[var(--text-primary)]"
                          : "text-[var(--text-secondary)]"
                      }`}
                    >
                      {project.title}
                    </span>
                  </div>

                  {/* Direct Links (Repo & Live) */}
                  <div
                    className="flex items-center gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`${project.title} GitHub repository`}
                      className="p-1 rounded-md text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-tile)] transition-colors"
                    >
                      <SiGithub className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`${project.title} live demo`}
                      className="p-1 rounded-md text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-tile)] transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Plain description */}
                <p className="text-[16px] text-[var(--text-secondary)] line-clamp-1 leading-normal">
                  {project.tagline}
                </p>

                {/* Stack tags */}
                <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="text-[13px] px-1.5 py-0.5 rounded bg-[var(--surface-tile)] text-[var(--text-tertiary)] border border-transparent"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer: View all case studies */}
        <div className="pt-1 mt-auto flex items-center justify-between ">
          <button
            onClick={() => navigateWithWipe("/projects")}
            type="button"
            className="text-[13px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>All projects & case studies</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </BentoTile>
  );
}
