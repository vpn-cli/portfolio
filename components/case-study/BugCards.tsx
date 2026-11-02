"use client";

import { useState } from "react";
import { ArrowUpRight, ChevronDown, GitCommit } from "lucide-react";
import type { CaseStudyBug } from "@/data/projects";

interface BugCardsProps {
  bugs: CaseStudyBug[];
}

export function BugCards({ bugs }: BugCardsProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (idx: number) => {
    setExpandedIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="w-full space-y-4" role="region" aria-label="Bugs and fixes">
      {bugs.map((bug, idx) => {
        const isExpanded = expandedIndex === idx;
        const panelId = `bug-panel-${idx}`;

        return (
          <article
            key={idx}
            className="rounded-[var(--card-radius)] bg-[var(--surface-tile)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] transition-colors p-5 sm:p-6 space-y-4 shadow-sm"
          >
            {/* Top row: Bug Title + Real GitHub Commit Link Chip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-[var(--border-subtle)] pb-3">
              <h3 className="text-sm sm:text-base font-medium text-[var(--text-primary)]">
                0{idx + 1}. {bug.title}
              </h3>

              {bug.commitUrl && (
                <a
                  href={bug.commitUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[32px] inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--surface-tile-elevated)] hover:bg-[var(--surface-tile-hover)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors self-start sm:self-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
                  title={`View GitHub commit ${bug.commitHash}`}
                >
                  <GitCommit className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{bug.commitHash}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-70" aria-hidden="true" />
                </a>
              )}
            </div>

            {/* ━━━ ONE-LINE EACH: SYMPTOM → CAUSE → FIX ━━━ */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs leading-relaxed">
              <div className="space-y-1">
                <span className="text-[11px] font-medium text-[var(--text-tertiary)] block">
                  Symptom
                </span>
                <p className="text-[var(--text-secondary)] line-clamp-2 md:line-clamp-none">
                  {bug.symptom}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-medium text-[var(--text-tertiary)] block">
                  Cause
                </span>
                <p className="text-[var(--text-secondary)] line-clamp-2 md:line-clamp-none">
                  {bug.cause}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-medium text-[var(--text-tertiary)] block">
                  Fix
                </span>
                <p className="text-[var(--text-primary)] font-medium line-clamp-2 md:line-clamp-none">
                  {bug.fix}
                </p>
              </div>
            </div>

            {/* Optional Context Expand (if bug has additional context text) */}
            {bug.context && (
              <div>
                <button
                  type="button"
                  onClick={() => toggleExpand(idx)}
                  className="text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)] inline-flex items-center gap-1 transition-colors mt-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
                  aria-expanded={isExpanded}
                  aria-controls={panelId}
                >
                  <span>{isExpanded ? "Hide notes" : "Read full context"}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {isExpanded && (
                  <div
                    id={panelId}
                    className="mt-3 p-3.5 rounded-lg bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] leading-relaxed animate-in fade-in duration-150"
                  >
                    {bug.context}
                  </div>
                )}
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}

