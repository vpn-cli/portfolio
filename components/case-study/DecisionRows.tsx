"use client";

import { useState } from "react";
import { ChevronDown, ArrowRight, GitBranch } from "lucide-react";
import type { CaseStudyDecision } from "@/data/projects";

interface DecisionRowsProps {
  decisions: CaseStudyDecision[];
}

export function DecisionRows({ decisions }: DecisionRowsProps) {
  // Never open by default (set to null)
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleRow = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="w-full space-y-3" role="region" aria-label="Architectural decisions">
      {decisions.map((decision, idx) => {
        const isOpen = openIndex === idx;
        const rowId = `decision-row-${idx}`;
        const panelId = `decision-panel-${idx}`;

        return (
          <div
            key={idx}
            className={`rounded-xl border transition-colors duration-200 overflow-hidden ${
              isOpen
                ? "bg-[var(--surface-tile-elevated)] border-[var(--border-hover)] shadow-sm"
                : "bg-[var(--surface-tile)] border-[var(--border-subtle)] hover:border-[var(--border-hover)]"
            }`}
          >
            {/* ━━━ COMPACT ROW HEADER ━━━ */}
            <button
              type="button"
              id={rowId}
              onClick={() => toggleRow(idx)}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className="w-full min-h-[52px] p-4 sm:p-5 text-left flex items-start sm:items-center justify-between gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-[var(--text-tertiary)]">
                    0{idx + 1}
                  </span>
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    {decision.chosenOver}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed pl-6">
                  {decision.tradeoffSummary}
                </p>
              </div>

              <div className="pt-0.5 sm:pt-0 shrink-0">
                <div className="w-7 h-7 rounded-full bg-[var(--surface-tile)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-secondary)]">
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-[var(--text-primary)]" : ""
                    }`}
                    aria-hidden="true"
                  />
                </div>
              </div>
            </button>

            {/* ━━━ EXPANDABLE REASONING (OPENS ON CLICK ONLY) ━━━ */}
            {isOpen && (
              <div
                id={panelId}
                role="region"
                aria-labelledby={rowId}
                className="px-5 pb-5 pt-2 border-t border-[var(--border-subtle)] space-y-4 text-xs animate-in fade-in duration-150"
              >
                <div>
                  <span className="text-[11px] font-medium text-[var(--text-tertiary)] block mb-1">
                    Problem faced:
                  </span>
                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    {decision.problemFaced}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-medium text-[var(--text-tertiary)] block mb-1.5">
                    Options considered:
                  </span>
                  <ul className="space-y-1 pl-3 border-l border-[var(--border-subtle)]">
                    {decision.optionsConsidered.map((opt, oIdx) => (
                      <li key={oIdx} className="text-[var(--text-secondary)]">
                        • {opt}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="text-[11px] font-medium text-[var(--text-tertiary)] block mb-1">
                    Full trade-off & reasoning:
                  </span>
                  <p className="text-[var(--text-primary)] leading-relaxed bg-[var(--surface-tile)] p-3 rounded-lg border border-[var(--border-subtle)]">
                    {decision.fullReasoning}
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

