"use client";

import { CaseStudy } from "@/data/projects";
import { GitBranch, ArrowRight } from "lucide-react";

interface JourneyChapter {
  chapter: string;
  timeline: string;
  title: string;
  narrative: string;
  decision?: {
    title: string;
    problem: string;
    options: string[];
    chosen: string;
    tradeoff: string;
  };
}

interface JourneyTimelineProps {
  journey: JourneyChapter[];
}

export function JourneyTimeline({ journey }: JourneyTimelineProps) {
  return (
    <div className="w-full relative pl-6 sm:pl-8 border-l border-[var(--border-subtle)] space-y-12 sm:space-y-14">
      {journey.map((item, idx) => (
        <article key={idx} className="relative group">
          {/* Chapter Pin Dot */}
          <div
            className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-[var(--surface-tile-elevated)] border-2 border-[var(--text-primary)] flex items-center justify-center shadow-sm"
            aria-hidden="true"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--text-primary)]" />
          </div>

          {/* Chapter Header */}
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className="text-xs text-[var(--text-tertiary)]">
              {item.chapter}
            </span>
            <span className="text-[var(--border-subtle)]" aria-hidden="true">
              ·
            </span>
            <span className="text-xs text-[var(--text-tertiary)]">
              {item.timeline}
            </span>
          </div>

          <h3 className="type-h3 font-display font-medium text-[var(--text-primary)] tracking-tight mb-3">
            {item.title}
          </h3>

          <p className="type-body4 text-[var(--text-secondary)] leading-relaxed max-w-[70ch] mb-6">
            {item.narrative}
          </p>

          {/* Inline Engineering Decision Box */}
          {item.decision && (
            <div className="rounded-[var(--card-radius)] bg-[var(--surface-tile)] border border-[var(--border-subtle)] p-5 sm:p-6 space-y-4 max-w-[75ch] shadow-sm">
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-[var(--text-primary)] shrink-0" aria-hidden="true" />
                <h4 className="text-sm font-medium text-[var(--text-primary)]">
                  Architectural Decision: {item.decision.title}
                </h4>
              </div>

              {/* 4-Part Structured Decision Format */}
              <div className="space-y-3 text-xs leading-relaxed">
                <div>
                  <span className="text-[13px] font-medium text-[var(--text-tertiary)] block mb-0.5">
                    → The problem I hit:
                  </span>
                  <p className="text-[var(--text-secondary)]">{item.decision.problem}</p>
                </div>

                <div>
                  <span className="text-[13px] font-medium text-[var(--text-tertiary)] block mb-1">
                    → Options I considered:
                  </span>
                  <ul className="space-y-1 pl-3 border-l border-[var(--border-subtle)]">
                    {item.decision.options.map((opt, oIdx) => (
                      <li key={oIdx} className="text-[var(--text-secondary)]">
                        • {opt}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="text-[13px] font-medium text-[var(--text-tertiary)] block mb-0.5">
                    → What I chose:
                  </span>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium">
                    <ArrowRight className="w-3 h-3" aria-hidden="true" />
                    <span>{item.decision.chosen}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[13px] font-medium text-[var(--text-tertiary)] block mb-0.5">
                    → The trade-off:
                  </span>
                  <p className="text-[var(--text-secondary)] italic">{item.decision.tradeoff}</p>
                </div>
              </div>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
