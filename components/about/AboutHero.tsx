import Image from "next/image";
import { ArrowUpRight, MapPin, GraduationCap } from "lucide-react";
import { TransitionLink } from "@/components/motion/RouteTransition";
import { ResumeDownloadButton } from "./ResumeDownloadButton";

interface AboutHeroProps {
  status: string;
}

interface BuiltWithProject {
  name: string;
  href?: string;
  tagline: string;
  tools: string[];
}

const BUILT_WITH_PROJECTS: BuiltWithProject[] = [
  {
    name: "StreamMart",
    href: "/work/stream-mart",
    tagline: "Orders over Kafka",
    tools: [
      "Node.js",
      "Express",
      "Kafka",
      "PostgreSQL",
      "Drizzle",
      "Docker",
    ],
  },
  {
    name: "Sportz",
    href: "/work/sockets",
    tagline: "Live scores, zero refresh",
    tools: [
      "Node.js",
      "Express",
      "WebSockets",
      "PostgreSQL",
      "Drizzle",
      "Arcjet",
    ],
  },
  {
    name: "AppForge",
    href: "/work/appforge",
    tagline: "Apps from a sentence",
    tools: [
      "Next.js",
      "TypeScript",
      "Llama-3.3-70B",
      "Groq LPU",
      "Upstash Redis",
      "Upstash Kafka",
    ],
  },
  {
    name: "Clairvyn AI",
    tagline: "Internship, AI floor-planning platform",
    tools: [
      "Next.js",
      "Node.js",
      "Docker",
      "AWS EC2",
      "Paytm API",
      "PostgreSQL",
    ],
  },
];

function formatTools(tools: string[]): string {
  if (tools.length <= 6) {
    return tools.join(", ");
  }
  const primary = tools.slice(0, 6);
  const remaining = tools.length - 6;
  return `${primary.join(", ")}, and ${remaining} more`;
}

export function AboutHero({ status }: AboutHeroProps) {
  return (
    <section aria-labelledby="about-intro-heading" className="w-full space-y-8">
      {/* Hero Header Lockup */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 sm:gap-6 pb-6 border-b border-[var(--border-subtle)]">
        <div data-reveal data-reveal-order="2" className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 min-w-0">
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] shrink-0">
            <Image
              src="/avatar.jpg"
              alt="Portrait of Vipin Kaushik"
              width={128}
              height={128}
              priority
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-2 min-w-0">
            <div>
              <h1
                id="about-intro-heading"
                className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--text-primary)]"
              >
                Vipin Kaushik
              </h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                {status}
              </p>
            </div>

            <p className="text-base sm:text-lg text-[var(--text-secondary)] font-medium">
              Software engineer building event-driven backends and real-time systems.
            </p>

            <div className="flex items-center gap-x-3 gap-y-1 text-xs sm:text-[13px] text-[var(--text-tertiary)] flex-wrap tabular-nums">
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <GraduationCap className="w-3.5 h-3.5" aria-hidden="true" />
                Dual degree at IIT Kharagpur, 2022 to 2027
              </span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
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
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[var(--surface-tile)] hover:bg-[var(--surface-tile-hover)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] text-[var(--text-primary)] text-sm font-semibold transition-colors active:scale-98"
          >
            <span>Case Studies</span>
            <ArrowUpRight className="w-4 h-4 text-[var(--text-tertiary)]" aria-hidden="true" />
          </TransitionLink>
        </div>
      </div>

      {/* Intro Narrative */}
      <div data-reveal data-reveal-order="4" className="max-w-[65ch] space-y-4">
        <p className="text-xl sm:text-2xl text-[var(--text-primary)] font-normal leading-relaxed tracking-tight">
          I&apos;m finishing a dual degree at IIT Kharagpur and spend most of my time building backend systems with Kafka, WebSockets and Postgres. I also do design work on the side.
        </p>
        <p className="text-base text-[var(--text-secondary)] leading-relaxed">
          Recent projects include StreamMart, an e-commerce backend that uses a transactional outbox to get order events into Kafka, and Sportz, a WebSocket server that pushes live match scores. Away from code, I&apos;ve led design for campus groups like the Manga &amp; Anime Society and Illumination Magazine.
        </p>
      </div>

      {/* "Built with" block organized by project */}
      <div data-reveal data-reveal-order="5" className="w-full pt-8 sm:pt-10 space-y-4">
        <h2 className="text-base font-bold text-[var(--text-primary)]">
          Built with
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 items-start">
          {BUILT_WITH_PROJECTS.map((project) => (
            <div key={project.name} className="space-y-1.5">
              <div>
                {project.href ? (
                  <TransitionLink
                    href={project.href}
                    trackLocation="about_built_with"
                    trackLabel={`Built with: ${project.name}`}
                    className="group inline-flex items-baseline gap-1 text-[17px] font-normal text-[var(--text-primary)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-white/40 rounded-sm transition-colors"
                  >
                    <span>{project.name}</span>
                    <span
                      aria-hidden="true"
                      className="inline-block text-xs text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-focus-visible:translate-x-0.5 group-focus-visible:-translate-y-0.5 select-none motion-reduce:transform-none"
                    >
                      ↗
                    </span>
                  </TransitionLink>
                ) : (
                  <span className="text-[17px] font-normal text-[var(--text-primary)]">
                    {project.name}
                  </span>
                )}
              </div>

              <p className="text-sm text-[var(--text-secondary)] leading-snug">
                {project.tagline}
              </p>

              <p className="text-xs text-[var(--text-tertiary)] leading-relaxed">
                {formatTools(project.tools)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
