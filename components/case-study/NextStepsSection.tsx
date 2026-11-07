"use client";

import { useState } from "react";
import { ExternalLink, ArrowUpRight, ChevronDown, Lightbulb } from "lucide-react";
import { SiGithub } from "react-icons/si";

interface NextStepsSectionProps {
  claim: string;
  nextSteps: string[];
  learningStatement: string;
  tryItSteps: string[];
  demoUrl?: string;
  repoUrl?: string;
  coldStartNote?: string;
}

export function NextStepsSection({
  nextSteps,
  learningStatement,
  tryItSteps,
  demoUrl,
  repoUrl,
  coldStartNote,
}: NextStepsSectionProps) {
  const [showDetails, setShowDetails] = useState(false);

  const isDemoOnGithub = Boolean(demoUrl && demoUrl.includes("github.com"));

  return (
    <div className="w-full space-y-4">
      {/* ━━━ COMPACT NEXT STEPS CARD ━━━ */}
      <div className="rounded-[var(--card-radius)] bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] p-5 sm:p-6 space-y-4 shadow-sm">
        <div className="space-y-1.5">
          <span className="text-xs font-mono text-[var(--text-tertiary)] uppercase tracking-wider block">
            Roadmap
          </span>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed max-w-[65ch]">
            {nextSteps[0]}
          </p>
        </div>

        {/* ━━━ ACTION CTAS (PRIMARY DEMO + SECONDARY REPO) ━━━ */}
        <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)]">
          <div className="flex flex-wrap items-center gap-3">
            {demoUrl && (
              <a
                href={demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--text-primary)] text-[var(--bg-canvas)] hover:opacity-90 font-medium text-sm transition-opacity shadow-sm active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-white/40"
              >
                {isDemoOnGithub ? (
                  <SiGithub className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <ExternalLink className="w-4 h-4" aria-hidden="true" />
                )}
                <span>{isDemoOnGithub ? "View architecture" : "Launch live demo"}</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-80" aria-hidden="true" />
              </a>
            )}

            {repoUrl && (
              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--surface-tile)] hover:bg-[var(--surface-tile-hover)] border border-[var(--border-subtle)] text-sm font-medium text-[var(--text-primary)] transition-colors shadow-sm active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
              >
                <SiGithub className="w-4 h-4" aria-hidden="true" />
                <span>Source code</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60" aria-hidden="true" />
              </a>
            )}
          </div>

          {coldStartNote && (
            <p className="text-[11px] text-[var(--text-tertiary)] font-mono">
              {coldStartNote}
            </p>
          )}
        </div>

        {/* ━━━ PROGRESSIVE DISCLOSURE: VERIFICATION STEPS & LEARNING ━━━ */}
        <div className="pt-2 border-t border-[var(--border-subtle)]">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="min-h-[44px] text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)] inline-flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
            aria-expanded={showDetails}
            aria-controls="try-it-details"
          >
            <span>{showDetails ? "Hide test steps" : "View test steps & takeaway"}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${showDetails ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </button>

          {showDetails && (
            <div id="try-it-details" className="mt-3 space-y-4 pt-3 border-t border-[var(--border-subtle)] animate-in fade-in duration-150">
              <div className="space-y-2">
                <span className="text-xs font-medium text-[var(--text-primary)] block">
                  Browser test steps:
                </span>
                <ol className="space-y-1.5 pl-4 list-decimal text-xs text-[var(--text-secondary)]">
                  {tryItSteps.map((step, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="p-3.5 rounded-lg bg-[var(--surface-tile)] border border-[var(--border-subtle)] flex items-start gap-2.5">
                <Lightbulb className="w-4 h-4 text-[var(--text-primary)] mt-0.5 shrink-0" aria-hidden="true" />
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  <span className="font-medium text-[var(--text-primary)]">Key takeaway: </span>
                  {learningStatement}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
