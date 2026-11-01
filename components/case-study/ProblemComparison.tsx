"use client";

import { XCircle, CheckCircle2 } from "lucide-react";

interface ProblemComparisonProps {
  before: {
    title: string;
    points: string[];
  };
  after: {
    title: string;
    points: string[];
  };
  coreChallenge: string;
}

export function ProblemComparison({ before, after, coreChallenge }: ProblemComparisonProps) {
  return (
    <div className="space-y-6 w-full">
      {/* 2-Column Comparative Bento Visual */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Traditional / Broken state */}
        <div className="rounded-[var(--card-radius)] bg-[var(--surface-tile)] border border-[var(--border-subtle)] p-6 sm:p-7 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <XCircle className="w-4 h-4 text-neutral-400 dark:text-neutral-500 shrink-0" aria-hidden="true" />
              <h3 className="text-sm font-medium text-[var(--text-primary)]">
                {before.title}
              </h3>
            </div>
            <ul className="space-y-2.5">
              {before.points.map((pt, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-[var(--text-secondary)] leading-relaxed">
                  <span className="w-1 h-1 rounded-full bg-neutral-400 dark:bg-neutral-600 mt-1.5 shrink-0" aria-hidden="true" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="pt-3 border-t border-[var(--border-subtle)] text-[11px] text-[var(--text-tertiary)]">
            Status: Latency bottlenecks and connection exhaustion
          </div>
        </div>

        {/* Engineered / Solution state */}
        <div className="rounded-[var(--card-radius)] bg-[var(--surface-tile-elevated)] border border-[var(--border-hover)] p-6 sm:p-7 flex flex-col justify-between space-y-4 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-4 h-4 text-[var(--text-primary)] shrink-0" aria-hidden="true" />
              <h3 className="text-sm font-medium text-[var(--text-primary)]">
                {after.title}
              </h3>
            </div>
            <ul className="space-y-2.5">
              {after.points.map((pt, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-[var(--text-secondary)] leading-relaxed">
                  <span className="w-1 h-1 rounded-full bg-[var(--text-primary)] mt-1.5 shrink-0" aria-hidden="true" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="pt-3 border-t border-[var(--border-subtle)] text-[11px] text-[var(--text-primary)]">
            Status: Deterministic, sub-second and memory-safe
          </div>
        </div>
      </div>

      {/* Bold Core Challenge Statement Callout */}
      <div className="rounded-xl bg-[var(--surface-tile)] border-l-2 border-l-[var(--text-primary)] border-r border-t border-b border-[var(--border-subtle)] p-4 sm:p-5">
        <span className="text-xs text-[var(--text-tertiary)] block mb-1">
          The core engineering challenge:
        </span>
        <p className="text-sm sm:text-base font-medium text-[var(--text-primary)] leading-snug">
          &ldquo;{coreChallenge}&rdquo;
        </p>
      </div>
    </div>
  );
}
