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
    <div className="w-full space-y-3" role="region" aria-label="Bugs and fixes">
      {bugs.map((bug, idx) => {
        const isExpanded = expandedIndex === idx;
        const panelId = `bug-panel-${idx}`;

        return (
          <article
            key={idx}
            className="rounded-[var(--card-radius)] bg-[var(--surface-tile)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] transition-colors p-4 sm:p-5 space-y-3 shadow-sm"
          >
            {/* Top row: Bug Title + Real GitHub Commit Link */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-2.5">
              <h3 className="text-xs sm:text-sm font-medium text-[var(--text-primary)]">
                {bug.title}
              </h3>

              {bug.commitUrl && (
                <a
                  href={bug.commitUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:underline transition-colors self-start sm:self-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)] focus-visible:ring-offset-2"
                  title={`View GitHub commit ${bug.commitHash}`}
                >
                  <GitCommit className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{bug.commitHash}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-70" aria-hidden="true" />
                </a>
              )}
            </div>

            {/* ━━━ ONE-LINE EACH: SYMPTOM → CAUSE → FIX ━━━ */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-4 text-xs leading-relaxed">
              <div className="space-y-0.5">
                <span className="text-xs text-[var(--text-tertiary)] block">
                  Symptom
                </span>
                <p className="text-[var(--text-secondary)] truncate">
                  {bug.symptom}
                </p>
              </div>

              <div className="space-y-0.5">
                <span className="text-xs text-[var(--text-tertiary)] block">
                  Cause
                </span>
                <p className="text-[var(--text-secondary)] truncate">
                  {bug.cause}
                </p>
              </div>

              <div className="space-y-0.5">
                <span className="text-xs text-[var(--text-tertiary)] block">
                  Fix
                </span>
                <p className="text-[var(--text-primary)] font-medium truncate">
                  {bug.fix}
                </p>
              </div>
            </div>

            {/* Collapsed Details Toggle (44px min hit target) */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => toggleExpand(idx)}
                className="min-h-[44px] text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)] inline-flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)] focus-visible:ring-offset-2"
                aria-expanded={isExpanded}
                aria-controls={panelId}
              >
                <span>{isExpanded ? "Hide details" : "View details"}</span>
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
                  className="mt-2 p-3.5 rounded-lg bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] space-y-2 text-xs text-[var(--text-secondary)] leading-relaxed animate-in fade-in duration-150"
                >
                  <div>
                    <span className="font-medium text-[var(--text-primary)]">Full Symptom: </span>
                    {bug.symptom}
                  </div>
                  <div>
                    <span className="font-medium text-[var(--text-primary)]">Root Cause: </span>
                    {bug.cause}
                  </div>
                  <div>
                    <span className="font-medium text-[var(--text-primary)]">Resolution: </span>
                    {bug.fix}
                  </div>
                  {bug.context && (
                    <div className="pt-1 border-t border-[var(--border-subtle)] text-[13px] text-[var(--text-tertiary)]">
                      {bug.context}
                    </div>
                  )}
                </div>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
