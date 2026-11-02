"use client";

import { ExternalLink, ArrowUpRight, CheckCircle2, Lightbulb } from "lucide-react";
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
  claim,
  nextSteps,
  learningStatement,
  tryItSteps,
  demoUrl,
  repoUrl,
  coldStartNote,
}: NextStepsSectionProps) {
  return (
    <div className="w-full space-y-6">
      {/* ━━━ NEXT STEPS & LEARNING FOLDED IN ━━━ */}
      <div className="rounded-[var(--card-radius)] bg-[var(--surface-tile)] border border-[var(--border-subtle)] p-6 sm:p-7 space-y-5 shadow-sm">
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-[var(--text-tertiary)] uppercase tracking-wider font-mono">
            What I&apos;d build next
          </h3>
          <ul className="space-y-2">
            {nextSteps.map((step, idx) => (
              <li
                key={idx}
                className="text-xs sm:text-sm text-[var(--text-secondary)] flex items-start gap-2.5 leading-relaxed"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-primary)] mt-2 shrink-0" aria-hidden="true" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Folded Learning Sentence */}
        <div className="p-4 rounded-xl bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] flex items-start gap-3">
          <Lightbulb className="w-4 h-4 text-[var(--text-primary)] mt-0.5 shrink-0" aria-hidden="true" />
          <div className="text-xs leading-relaxed">
            <span className="font-medium text-[var(--text-primary)]">Key takeaway: </span>
            <span className="text-[var(--text-secondary)]">{learningStatement}</span>
          </div>
        </div>
      </div>

      {/* ━━━ TRY IT YOURSELF STEPS & REPEATED DEMO CTA ━━━ */}
      <div className="rounded-[var(--card-radius)] bg-[var(--surface-tile-elevated)] border border-[var(--border-hover)] p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-[var(--text-tertiary)] uppercase tracking-wider font-mono">
            How to verify live
          </h3>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
            Test the live system directly in your browser:
          </p>
        </div>

        {/* Numbered Steps */}
        <div className="rounded-xl bg-[var(--surface-tile)] p-5 border border-[var(--border-subtle)] space-y-3">
          <ol className="space-y-2.5">
            {tryItSteps.map((st, idx) => (
              <li
                key={idx}
                className="text-xs sm:text-sm text-[var(--text-secondary)] flex items-start gap-3 leading-relaxed"
              >
                <span className="font-mono text-xs text-[var(--text-primary)] font-medium shrink-0 pt-0.5">
                  0{idx + 1}.
                </span>
                <span>{st}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Repeated CTA Row */}
        <div className="space-y-2 pt-2">
          <div className="flex flex-wrap items-center gap-3">
            {demoUrl && (
              <a
                href={demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--text-primary)] text-[var(--bg-canvas)] hover:opacity-90 font-medium text-sm transition-opacity shadow-sm motion-safe:active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-white/40"
              >
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
                <span>Launch live demo</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-80" aria-hidden="true" />
              </a>
            )}

            {repoUrl && (
              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--surface-tile)] hover:bg-[var(--surface-tile-hover)] border border-[var(--border-subtle)] text-sm font-medium text-[var(--text-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
              >
                <SiGithub className="w-4 h-4" aria-hidden="true" />
                <span>View source</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60" aria-hidden="true" />
              </a>
            )}
          </div>

          {coldStartNote && (
            <p className="text-xs text-[var(--text-tertiary)] pt-1">
              {coldStartNote}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

