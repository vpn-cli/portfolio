import Image from "next/image";
import { ArrowUpRight, MapPin, GraduationCap } from "lucide-react";
import { TransitionLink } from "@/components/motion/RouteTransition";
import { ResumeDownloadButton } from "./ResumeDownloadButton";

interface AboutHeroProps {
  status: string;
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
                className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[var(--text-primary)]"
              >
                Vipin Kaushik
              </h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1.5">
                {status}
              </p>
            </div>

            <p className="text-lg sm:text-xl text-[var(--text-secondary)] font-normal">
              Software engineer building event-driven backends and real-time systems.
            </p>

            <div className="flex items-center gap-x-3 gap-y-1 text-xs sm:text-[13px] text-[var(--text-tertiary)] flex-wrap tabular-nums pt-1">
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
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[var(--surface-tile)] hover:bg-[var(--surface-tile-hover)] border border-[var(--border-subtle)] hover:border-[var(--border-focus)] text-[var(--text-primary)] text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] active:scale-98"
          >
            <span>Case Studies</span>
            <ArrowUpRight className="w-4 h-4 text-[var(--text-tertiary)]" aria-hidden="true" />
          </TransitionLink>
        </div>
      </div>

      {/* Intro Narrative */}
      <div data-reveal data-reveal-order="4" className="max-w-[70ch] space-y-5 pt-2">
        <p className="text-2xl sm:text-3xl lg:text-4xl text-[var(--text-primary)] font-normal leading-[1.25] tracking-tight">
          I&apos;m finishing a dual degree at IIT Kharagpur and spend most of my time building backend systems with Kafka, WebSockets and Postgres. I also do design work on the side.
        </p>
        <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
          Recent projects include StreamMart, an e-commerce backend that uses a transactional outbox to get order events into Kafka, and Sportz, a WebSocket server that pushes live match scores. Away from code, I&apos;ve led design for campus groups like the Manga &amp; Anime Society and Illumination Magazine.
        </p>
      </div>
    </section>
  );
}
