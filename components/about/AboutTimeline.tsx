"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface Milestone {
  id: string;
  year: string;
  title: string;
  stage: string;
  description: string;
  projectLinks?: {
    label: string;
    href: string;
    note?: string;
  }[];
}

const milestones: Milestone[] = [
  {
    id: "kgp-start",
    year: "2022",
    stage: "Foundation",
    title: "IIT Kharagpur",
    description:
      "Joined IIT Kharagpur for a B.Tech + M.Tech Dual Degree in Chemical Engineering. Began writing software and exploring digital visual design.",
  },
  {
    id: "campus-design",
    year: "2023–2024",
    stage: "Visual Craft",
    title: "Campus Design Leadership",
    description:
      "Led design teams across campus student publications and societies: Manga & Anime Society, Illumination Magazine, and ChemEA.",
  },
  {
    id: "frontend-unnati-sportz",
    year: "2025",
    stage: "Frontend & Real-Time",
    title: "Unnati + Sportz Sockets",
    description:
      "Frontend engineering internship at Unnati building an SME onboarding dashboard and design system. Engineered Sportz, a push-based sports broadcasting server over raw WebSockets.",
    projectLinks: [
      {
        label: "Sportz Case Study",
        href: "/work/sockets",
      },
    ],
  },
  {
    id: "fullstack-clairvyn-appforge",
    year: "2026",
    stage: "Full-Stack & Systems",
    title: "Clairvyn AI + StreamMart & AppForge",
    description:
      "Full-stack internship at Clairvyn AI on paywalls and AWS deploys. Built StreamMart with Kafka transactional outbox and AppForge with deterministic AST transforms.",
    projectLinks: [
      {
        label: "StreamMart (dates: TODO)",
        href: "/work/stream-mart",
        note: "Dates: TODO",
      },
      {
        label: "AppForge Case Study",
        href: "/work/appforge",
      },
    ],
  },
  {
    id: "current-focus",
    year: "Now",
    stage: "Distributed Systems",
    title: "Kafka & Kubernetes",
    description:
      "Deepening production-readiness in backend distributed architectures, focusing on Kafka event partitioning and Kubernetes pod orchestration.",
  },
];

export function AboutTimeline() {
  const [activeId, setActiveId] = useState<string>("fullstack-clairvyn-appforge");

  return (
    <section aria-labelledby="timeline-heading" className="w-full space-y-6">
      <div className="flex items-baseline justify-between border-b border-[var(--border-subtle)] pb-4">
        <div>
          <h2 id="timeline-heading" className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            How I got here
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Growth trajectory from visual design into backend systems engineering.
          </p>
        </div>
        <span className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider font-medium hidden sm:inline">
          2022 – Present
        </span>
      </div>

      {/* Interactive Milestone Rail */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pb-2" role="tablist" aria-label="Career milestones">
        {milestones.map((m) => {
          const isActive = m.id === activeId;
          return (
            <button
              key={m.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveId(m.id)}
              className={`p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-white/40 ${
                isActive
                  ? "bg-[var(--surface-tile-elevated)] border-[var(--text-primary)] shadow-sm"
                  : "bg-[var(--surface-tile)] border-[var(--border-subtle)] hover:border-[var(--border-hover)]"
              }`}
            >
              <span className="text-xs font-semibold tabular-nums text-[var(--text-tertiary)] block">
                {m.year}
              </span>
              <span
                className={`text-xs sm:text-sm font-semibold truncate block mt-0.5 ${
                  isActive ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"
                }`}
              >
                {m.stage}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Milestone Card */}
      {milestones.map((m) => {
        if (m.id !== activeId) return null;
        return (
          <article
            key={m.id}
            className="p-6 sm:p-7 rounded-2xl bg-[var(--surface-tile)] border border-[var(--border-subtle)] space-y-4 motion-safe:animate-fadeIn"
          >
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <span className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider block">
                  {m.stage} · {m.year}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] mt-1">
                  {m.title}
                </h3>
              </div>
            </div>

            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
              {m.description}
            </p>

            {m.projectLinks && m.projectLinks.length > 0 && (
              <div className="pt-2 flex items-center gap-3 flex-wrap">
                {m.projectLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-[var(--surface-tile-hover)] hover:bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] text-[var(--text-primary)] transition-colors active:scale-98"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[var(--text-tertiary)]" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            )}
          </article>
        );
      })}

      {/* Accessible Full Chronology List for Screen Readers and Scrollers */}
      <ol className="sr-only">
        {milestones.map((m) => (
          <li key={m.id}>
            <h4>
              {m.year}: {m.title} ({m.stage})
            </h4>
            <p>{m.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
