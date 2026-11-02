"use client";

import { useState } from "react";
import { CaseStudy } from "@/data/projects";
import { CodeHighlight } from "./CodeHighlight";
import { ArrowLeft, ArrowRight, Terminal } from "lucide-react";

interface FlowStepItem {
  step: number;
  title: string;
  actor: string;
  description: string;
  codeSnippet?: {
    filename: string;
    language: string;
    code: string;
    explanation?: string;
  };
  logLine?: string;
}

interface FlowStepperProps {
  steps: FlowStepItem[];
}

export function FlowStepper({ steps }: FlowStepperProps) {
  const [activeStep, setActiveStep] = useState(0);

  const current = steps[activeStep] || steps[0];

  const goPrev = () => {
    setActiveStep((prev) => Math.max(0, prev - 1));
  };

  const goNext = () => {
    setActiveStep((prev) => Math.min(steps.length - 1, prev + 1));
  };

  return (
    <div className="w-full space-y-6">
      {/* Step Tabs / Indicators */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none" role="tablist" aria-label="Event Flow Steps">
        {steps.map((s, idx) => {
          const isActive = idx === activeStep;
          return (
            <button
              key={s.step}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveStep(idx)}
              className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-medium transition-colors flex items-center gap-2 shrink-0 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-white/40 ${
                isActive
                  ? "bg-[var(--text-primary)] text-[var(--bg-canvas)] border-transparent shadow-sm"
                  : "bg-[var(--surface-tile)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)]"
              }`}
            >
              <span className="opacity-80">0{s.step}</span>
              <span className="truncate max-w-[140px] sm:max-w-none">{s.title.split(":")[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Main Flow Presentation: 2 Columns on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Stage Detail & Controls */}
        <div className="lg:col-span-5 rounded-[var(--card-radius)] bg-[var(--surface-tile)] border border-[var(--border-subtle)] p-6 sm:p-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--text-tertiary)]">
                Stage 0{current.step} of 0{steps.length}
              </span>
              <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
                {current.actor}
              </span>
            </div>

            <h3 className="type-h3 font-display font-medium text-[var(--text-primary)] tracking-tight">
              {current.title}
            </h3>

            <p className="type-body4 text-[var(--text-secondary)] leading-relaxed">
              {current.description}
            </p>
          </div>

          {/* Stepper Navigation Buttons */}
          <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
            <button
              type="button"
              onClick={goPrev}
              disabled={activeStep === 0}
              className="min-h-[44px] px-3.5 py-2 rounded-lg bg-[var(--surface-tile-elevated)] hover:bg-[var(--surface-tile-hover)] border border-[var(--border-subtle)] text-xs font-medium text-[var(--text-primary)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
              aria-label="Previous step"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Previous</span>
            </button>

            <span className="text-xs text-[var(--text-tertiary)]">
              {activeStep + 1} / {steps.length}
            </span>

            <button
              type="button"
              onClick={goNext}
              disabled={activeStep === steps.length - 1}
              className="min-h-[44px] px-3.5 py-2 rounded-lg bg-[var(--surface-tile-elevated)] hover:bg-[var(--surface-tile-hover)] border border-[var(--border-subtle)] text-xs font-medium text-[var(--text-primary)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
              aria-label="Next step"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Right Column: Code Snippet or Log Line */}
        <div className="lg:col-span-7">
          {current.codeSnippet ? (
            <CodeHighlight
              filename={current.codeSnippet.filename}
              language={current.codeSnippet.language}
              code={current.codeSnippet.code}
              explanation={current.codeSnippet.explanation}
            />
          ) : current.logLine ? (
            <div className="rounded-[var(--card-radius)] bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] p-6 space-y-3 text-xs shadow-md">
              <div className="flex items-center gap-2 text-[var(--text-tertiary)] pb-2 border-b border-[var(--border-subtle)]">
                <Terminal className="w-4 h-4 text-[var(--text-primary)]" aria-hidden="true" />
                <span className="text-xs font-medium text-[var(--text-primary)]">Runtime Telemetry</span>
              </div>
              <p className="font-mono text-xs text-[var(--text-primary)] leading-relaxed bg-[var(--surface-tile)] p-4 rounded-xl border border-[var(--border-subtle)]">
                {current.logLine}
              </p>
              <span className="text-[11px] text-[var(--text-tertiary)] block">
                Source: Real-time telemetry payload captured in client browser devtools.
              </span>
            </div>
          ) : (
            <div className="rounded-[var(--card-radius)] bg-[var(--surface-tile)] border border-[var(--border-subtle)] p-8 text-center text-xs text-[var(--text-secondary)]">
              No code preview for this stage.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
