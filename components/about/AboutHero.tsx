import Image from "next/image";
import { ArrowUpRight, MapPin, GraduationCap, LayoutTemplate, PenTool } from "lucide-react";
import {
  SiApachekafka,
  SiSocketdotio,
  SiPostgresql,
  SiNodedotjs,
  SiDrizzle,
  SiDocker,
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiTailwindcss,
} from "react-icons/si";
import { FaAws } from "react-icons/fa6";
import { TransitionLink } from "@/components/motion/RouteTransition";
import { ResumeDownloadButton } from "./ResumeDownloadButton";
import type { ElementType } from "react";

interface AboutHeroProps {
  status: string;
}

interface StackTool {
  name: string;
  icon: ElementType;
  projects?: string;
}

interface StackGroup {
  label: string;
  tools: StackTool[];
}

const STACK_GROUPS: StackGroup[] = [
  {
    label: "Backend",
    tools: [
      { name: "Kafka", icon: SiApachekafka, projects: "StreamMart" },
      { name: "WebSockets", icon: SiSocketdotio, projects: "Sportz" },
      { name: "Postgres", icon: SiPostgresql, projects: "StreamMart, AppForge" },
      { name: "Node.js", icon: SiNodedotjs, projects: "StreamMart, Sportz" },
      { name: "Drizzle", icon: SiDrizzle, projects: "StreamMart, Sportz" },
      { name: "Docker", icon: SiDocker, projects: "StreamMart, Sportz" },
      { name: "AWS EC2", icon: FaAws },
    ],
  },
  {
    label: "Frontend",
    tools: [
      { name: "Next.js", icon: SiNextdotjs, projects: "AppForge" },
      { name: "React", icon: SiReact, projects: "AppForge, Sportz" },
      { name: "TypeScript", icon: SiTypescript, projects: "AppForge" },
      { name: "Tailwind", icon: SiTailwindcss, projects: "AppForge" },
    ],
  },
  {
    label: "Design",
    tools: [
      { name: "Editorial layout", icon: LayoutTemplate },
      { name: "Vector illustration", icon: PenTool },
    ],
  },
];

export function AboutHero({ status }: AboutHeroProps) {
  return (
    <section aria-labelledby="about-intro-heading" className="w-full space-y-8">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-8 border-b border-[var(--border-subtle)]">
        <div data-reveal data-reveal-order="2" className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
          <div className="relative w-22 h-22 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] shrink-0 shadow-sm">
            <Image
              src="/avatar.jpg"
              alt="Portrait of Vipin Kaushik"
              width={112}
              height={112}
              priority
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-2">
            <div>
              <h1
                id="about-intro-heading"
                className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--text-primary)]"
              >
                Vipin Kaushik
              </h1>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
                {status}
              </p>
            </div>

            <p className="text-base sm:text-lg text-[var(--text-secondary)] font-medium">
              Software engineer building event-driven backends and real-time systems.
            </p>

            <div className="flex items-center gap-4 text-xs text-[var(--text-tertiary)] flex-wrap tabular-nums">
              <span className="inline-flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5" aria-hidden="true" />
                Dual degree at IIT Kharagpur, 2022 to 2027
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                Kharagpur and New Delhi
              </span>
            </div>
          </div>
        </div>

        <div data-reveal data-reveal-order="3" className="flex items-center gap-3 w-full sm:w-auto shrink-0 pt-2 lg:pt-0">
          <ResumeDownloadButton />

          <TransitionLink
            href="/projects"
            trackLocation="about_hero"
            trackLabel="Case Studies"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[var(--surface-tile)] hover:bg-[var(--surface-tile-hover)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] text-[var(--text-primary)] text-xs sm:text-sm font-semibold transition-colors active:scale-98"
          >
            <span>Case Studies</span>
            <ArrowUpRight className="w-4 h-4 text-[var(--text-tertiary)]" aria-hidden="true" />
          </TransitionLink>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div data-reveal data-reveal-order="4" className="lg:col-span-7 space-y-4">
          <p className="text-xl sm:text-2xl text-[var(--text-primary)] font-normal leading-relaxed tracking-tight">
            I&apos;m finishing a dual degree at IIT Kharagpur and spend most of my time building backend systems with Kafka, WebSockets and Postgres. I also do design work on the side.
          </p>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
            Recent projects include StreamMart, an e-commerce backend that uses a transactional outbox to get order events into Kafka, and Sportz, a WebSocket server that pushes live match scores. Away from code, I&apos;ve led design for campus groups like the Manga &amp; Anime Society and Illumination Magazine.
          </p>
        </div>

        <div data-reveal data-reveal-order="5" className="lg:col-span-5 p-5 rounded-2xl bg-[var(--surface-tile)] border border-[var(--border-subtle)] space-y-3">
          <h2 className="text-xs font-normal text-[var(--text-tertiary)]">
            What I work with
          </h2>

          <div className="divide-y divide-[var(--border-subtle)]">
            {STACK_GROUPS.map((group, groupIdx) => (
              <div key={group.label} className={groupIdx === 0 ? "pb-3" : "py-3 first:pt-0 last:pb-0"}>
                <span className="text-xs font-normal text-[var(--text-tertiary)] block mb-1.5">
                  {group.label}
                </span>

                <ul className="space-y-0.5" role="list">
                  {group.tools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <li
                        key={tool.name}
                        tabIndex={0}
                        className="group flex flex-col sm:flex-row sm:items-center sm:justify-between py-1 px-1.5 -mx-1.5 rounded-md hover:bg-[var(--surface-tile-elevated)] focus-visible:bg-[var(--surface-tile-elevated)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--border-focus)] transition-colors cursor-default"
                        aria-label={tool.projects ? `${tool.name}, used in ${tool.projects}` : tool.name}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Icon
                            className="w-3.5 h-3.5 text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] group-focus-visible:text-[var(--text-primary)] shrink-0 transition-colors"
                            aria-hidden="true"
                          />
                          <span className="text-xs text-[var(--text-primary)] font-normal truncate">
                            {tool.name}
                          </span>
                        </div>
                        {tool.projects && (
                          <>
                            <span
                              className="text-[11px] text-[var(--text-tertiary)] hidden sm:block opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity tabular-nums truncate text-right ml-2"
                              aria-hidden="true"
                            >
                              {tool.projects}
                            </span>
                            <span
                              className="text-[11px] text-[var(--text-tertiary)] block sm:hidden pl-5.5 pt-0.5 tabular-nums"
                              aria-hidden="true"
                            >
                              {tool.projects}
                            </span>
                          </>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
