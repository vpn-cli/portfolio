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
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-8 border-b border-[var(--border-subtle)]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
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
              Software engineer, mostly backend.
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

        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 pt-2 lg:pt-0">
          <ResumeDownloadButton />

          <TransitionLink
            href="/projects"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[var(--surface-tile)] hover:bg-[var(--surface-tile-hover)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] text-[var(--text-primary)] text-xs sm:text-sm font-semibold transition-colors active:scale-98"
          >
            <span>Case Studies</span>
            <ArrowUpRight className="w-4 h-4 text-[var(--text-tertiary)]" aria-hidden="true" />
          </TransitionLink>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-4">
          <p className="text-xl sm:text-2xl text-[var(--text-primary)] font-normal leading-relaxed tracking-tight">
            I&apos;m a chemical engineering student at IIT Kharagpur who ended up writing software. Now I build backend systems with Kafka, WebSockets and Postgres, and I still do design work on the side.
          </p>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
            Recent projects include StreamMart, an e-commerce backend that uses a transactional outbox to get order events into Kafka, and Sportz, a WebSocket server that pushes live match scores. Away from code, I&apos;ve led design for campus groups like the Manga &amp; Anime Society and Illumination Magazine.
          </p>
        </div>

        <div className="lg:col-span-4 p-5 rounded-2xl bg-[var(--surface-tile)] border border-[var(--border-subtle)] space-y-3">
          <span className="text-xs font-semibold text-[var(--text-tertiary)] block">
            What I work with
          </span>

          <div className="space-y-3 text-xs">
            <div>
              <span className="font-semibold text-[var(--text-primary)] block">Backend</span>
              <span className="text-[var(--text-secondary)]">Kafka, WebSockets, Postgres, Node.js, Drizzle, Docker, AWS EC2</span>
            </div>

            <div>
              <span className="font-semibold text-[var(--text-primary)] block">Frontend</span>
              <span className="text-[var(--text-secondary)]">Next.js, React, TypeScript, Tailwind</span>
            </div>

            <div>
              <span className="font-semibold text-[var(--text-primary)] block">Design</span>
              <span className="text-[var(--text-secondary)]">Editorial layout, vector illustration</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
