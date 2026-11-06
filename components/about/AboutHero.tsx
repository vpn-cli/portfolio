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
      {/* Top Profile & Header Lockup */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-8 border-b border-[var(--border-subtle)]">
        {/* Left: Avatar & Identity Block */}
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
            <div className="flex items-center gap-3 flex-wrap">
              <h1
                id="about-intro-heading"
                className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--text-primary)]"
              >
                Vipin Kaushik
              </h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--surface-tile-hover)] border border-[var(--border-subtle)] text-[var(--text-secondary)] shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" aria-hidden="true" />
                {status}
              </span>
            </div>

            <p className="text-base sm:text-lg text-[var(--text-secondary)] font-medium">
              Software Engineer <span className="text-[var(--text-tertiary)] font-normal">· Full-stack & backend systems</span>
            </p>

            <div className="flex items-center gap-4 text-xs text-[var(--text-tertiary)] flex-wrap tabular-nums">
              <span className="inline-flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5" aria-hidden="true" />
                IIT Kharagpur · Dual Degree (2022 – 2027)
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                Kharagpur / New Delhi, India
              </span>
            </div>
          </div>
        </div>

        {/* Right: Quick Action Buttons */}
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

      {/* Narrative Lead & Discipline Pillars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-4">
          <p className="text-xl sm:text-2xl text-[var(--text-primary)] font-normal leading-relaxed tracking-tight">
            I study chemical engineering at IIT Kharagpur. Somewhere along the way I started building software, and now I architect distributed, real-time backend systems and design sharp visual interfaces.
          </p>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
            I split my focus across two disciplines: on the systems side, I design event-driven architectures with Apache Kafka, sub-millisecond WebSocket fanout engines, and transactional outbox patterns. On the visual side, I lead campus publication design teams and create vector art studies.
          </p>
        </div>

        {/* Quick Capabilities Card */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-[var(--surface-tile)] border border-[var(--border-subtle)] space-y-3">
          <span className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider block">
            Core Disciplines
          </span>

          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0" />
              <div>
                <span className="font-semibold text-[var(--text-primary)] block">Distributed & Real-Time</span>
                <span className="text-[var(--text-secondary)]">Kafka, WebSockets, Docker, AWS EC2, Postgres</span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <div>
                <span className="font-semibold text-[var(--text-primary)] block">Full-Stack Application</span>
                <span className="text-[var(--text-secondary)]">Next.js, React 19, TypeScript, Node.js, Drizzle</span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <div>
                <span className="font-semibold text-[var(--text-primary)] block">Visual & Editorial Craft</span>
                <span className="text-[var(--text-secondary)]">Vector studies, campus art head, print layout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}