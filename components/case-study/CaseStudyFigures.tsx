"use client";

import { useState } from "react";
import type { CaseStudyFigure } from "@/data/projects";
import { ArrowRight, GitBranch } from "lucide-react";

interface CaseStudyFiguresProps {
  figures: CaseStudyFigure[];
}

function BarComparisonFigure({
  figure,
}: {
  figure: Extract<CaseStudyFigure, { kind: "bar-comparison" }>;
}) {
  const firstGroup = figure.groups[0];
  const hasTiers = Boolean(firstGroup?.tiers && firstGroup.tiers.length > 0);
  const [selectedTierIdx, setSelectedTierIdx] = useState(0);

  const activeBars = hasTiers
    ? firstGroup.tiers![selectedTierIdx]?.bars || []
    : firstGroup?.bars || [];

  const maxValue = Math.max(...activeBars.map((b) => b.value), 1);

  return (
    <figure className="rounded-[var(--card-radius)] bg-[var(--surface-tile)] border border-[var(--border-subtle)] p-5 sm:p-6 space-y-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
        <div className="space-y-1">
          <span className="text-[13px] font-medium text-[var(--accent-text)] block">
            {figure.figureNumber}
          </span>
          <h3 className="text-base sm:text-lg font-medium text-[var(--text-primary)] tracking-tight">
            {figure.title}
          </h3>
        </div>

        {hasTiers && firstGroup.tiers && (
          <div
            role="tablist"
            aria-label={`${figure.title} workload tier`}
            className="inline-flex items-center gap-1 p-1 rounded-xl bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] self-start shrink-0"
          >
            {firstGroup.tiers.map((tier, idx) => {
              const isSelected = idx === selectedTierIdx;
              return (
                <button
                  key={tier.tierLabel}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedTierIdx(idx)}
                  className={`min-h-[44px] px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] ${
                    isSelected
                      ? "bg-[var(--surface-tile)] text-[var(--text-primary)] shadow-sm"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {tier.tierLabel}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Horizontal proportional bars */}
      <div className="space-y-4">
        {activeBars.map((bar) => {
          const widthPct =
            figure.unit === "%"
              ? Math.min(100, Math.max(2, bar.value))
              : Math.min(100, Math.max(4, (bar.value / maxValue) * 100));

          return (
            <div key={bar.label} className="space-y-1.5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 text-sm">
                <span
                  className={
                    bar.highlight
                      ? "font-medium text-[var(--text-primary)]"
                      : "text-[var(--text-secondary)]"
                  }
                >
                  {bar.label}
                </span>
                <span className="font-mono text-sm font-medium text-[var(--text-primary)] tabular-nums">
                  {bar.displayValue}
                </span>
              </div>

              <div
                className="w-full h-3 rounded-full bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] overflow-hidden"
                role="img"
                aria-label={`${bar.label}: ${bar.displayValue}`}
              >
                <div
                  className={`h-full rounded-full transition-all duration-300 motion-reduce:transition-none ${
                    bar.highlight
                      ? "bg-[var(--accent-color)]"
                      : "bg-[var(--text-tertiary)]/55"
                  }`}
                  style={{ width: `${widthPct}%` }}
                />
              </div>

              {bar.note && (
                <p className="text-[13px] text-[var(--text-tertiary)] leading-snug tabular-nums">
                  {bar.note}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <figcaption className="pt-3 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[13px] text-[var(--text-secondary)]">
        <span>{figure.caption}</span>
        <span className="text-[var(--text-tertiary)] font-mono shrink-0">
          {figure.source}
        </span>
      </figcaption>
    </figure>
  );
}

function LatencyAnatomyFigure({
  figure,
}: {
  figure: Extract<CaseStudyFigure, { kind: "latency-anatomy" }>;
}) {
  return (
    <figure className="rounded-[var(--card-radius)] bg-[var(--surface-tile)] border border-[var(--border-subtle)] p-5 sm:p-6 space-y-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
        <div className="space-y-1">
          <span className="text-[13px] font-medium text-[var(--accent-text)] block">
            {figure.figureNumber}
          </span>
          <h3 className="text-base sm:text-lg font-medium text-[var(--text-primary)] tracking-tight">
            {figure.title}
          </h3>
        </div>

        <div className="sm:text-right shrink-0">
          <span className="text-[13px] text-[var(--text-tertiary)] block">
            {figure.totalLabel}
          </span>
          <span className="font-mono text-xl font-medium text-[var(--text-primary)] tabular-nums">
            {figure.totalValue}
          </span>
        </div>
      </div>

      {/* Stacked proportion bar */}
      <div className="space-y-3">
        <div
          className="w-full h-4 rounded-full bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] overflow-hidden flex"
          role="img"
          aria-label={`${figure.title} breakdown totaling ${figure.totalValue}`}
        >
          {figure.segments.map((seg) => {
            const colorClass =
              seg.tone === "accent"
                ? "bg-[var(--accent-color)]"
                : seg.tone === "secondary"
                ? "bg-[var(--text-secondary)]"
                : "bg-[var(--text-tertiary)]/50";

            return (
              <div
                key={seg.label}
                className={`h-full ${colorClass} border-r border-[var(--bg-canvas)] last:border-r-0`}
                style={{ width: `${Math.max(seg.sharePct, 2)}%` }}
                title={`${seg.label}: ${seg.valueDisplay} (${seg.sharePct}%)`}
              />
            );
          })}
        </div>

        {/* Segment legend rows */}
        <div className="grid grid-cols-1 gap-2.5">
          {figure.segments.map((seg) => {
            const dotClass =
              seg.tone === "accent"
                ? "bg-[var(--accent-color)]"
                : seg.tone === "secondary"
                ? "bg-[var(--text-secondary)]"
                : "bg-[var(--text-tertiary)]/50";

            return (
              <div
                key={seg.label}
                className="rounded-xl bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <span
                    className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${dotClass}`}
                    aria-hidden="true"
                  />
                  <div className="space-y-0.5 min-w-0">
                    <div className="text-sm font-medium text-[var(--text-primary)]">
                      {seg.label}
                    </div>
                    <p className="text-[13px] text-[var(--text-secondary)] leading-snug">
                      {seg.detail}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 sm:text-right shrink-0 pl-5 sm:pl-0">
                  <span className="font-mono text-sm font-medium text-[var(--text-primary)] tabular-nums">
                    {seg.valueDisplay}
                  </span>
                  <span className="text-[13px] text-[var(--text-tertiary)] tabular-nums">
                    ({seg.sharePct}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Supporting callout measurements */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        {figure.callouts.map((callout) => (
          <div
            key={callout.label}
            className="rounded-xl bg-[var(--bg-canvas-subtle)] border border-[var(--border-subtle)] p-3.5 space-y-1"
          >
            <span className="text-[13px] text-[var(--text-tertiary)] block">
              {callout.label}
            </span>
            <span className="font-mono text-base font-medium text-[var(--text-primary)] tabular-nums block">
              {callout.value}
            </span>
            <p className="text-[13px] text-[var(--text-secondary)] leading-snug">
              {callout.detail}
            </p>
          </div>
        ))}
      </div>

      <figcaption className="pt-3 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[13px] text-[var(--text-secondary)]">
        <span>{figure.caption}</span>
        <span className="text-[var(--text-tertiary)] font-mono shrink-0">
          {figure.source}
        </span>
      </figcaption>
    </figure>
  );
}

function FlowDiagramFigure({
  figure,
}: {
  figure: Extract<CaseStudyFigure, { kind: "flow-diagram" }>;
}) {
  return (
    <figure className="rounded-[var(--card-radius)] bg-[var(--surface-tile)] border border-[var(--border-subtle)] p-5 sm:p-6 space-y-5 shadow-sm">
      <div className="space-y-1 border-b border-[var(--border-subtle)] pb-4">
        <span className="text-[13px] font-medium text-[var(--accent-text)] block">
          {figure.figureNumber}
        </span>
        <h3 className="text-base sm:text-lg font-medium text-[var(--text-primary)] tracking-tight">
          {figure.title}
        </h3>
      </div>

      {/* 4-stage horizontal flow on desktop, vertical stack on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-stretch">
        {figure.lanes.map((lane, idx) => (
          <div key={lane.stage} className="relative flex flex-col justify-between">
            <div
              className={`h-full rounded-xl p-4 border flex flex-col justify-between space-y-3 ${
                lane.highlight
                  ? "bg-[var(--surface-tile-elevated)] border-[var(--accent-color)]"
                  : "bg-[var(--surface-tile-elevated)] border-[var(--border-subtle)]"
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[13px] font-medium text-[var(--accent-text)]">
                    {lane.stage}
                  </span>
                  {idx < figure.lanes.length - 1 && (
                    <ArrowRight
                      className="hidden md:block w-3.5 h-3.5 text-[var(--text-tertiary)] shrink-0"
                      aria-hidden="true"
                    />
                  )}
                </div>

                <div className="text-sm font-medium text-[var(--text-primary)]">
                  {lane.component}
                </div>

                <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
                  {lane.mechanism}
                </p>
              </div>

              <div className="pt-2 border-t border-[var(--border-subtle)] text-[13px] text-[var(--text-primary)] font-medium leading-snug">
                {lane.guarantee}
              </div>
            </div>
          </div>
        ))}
      </div>

      {figure.branchNote && (
        <div className="rounded-xl bg-[var(--bg-canvas-subtle)] border border-[var(--border-subtle)] p-4 flex flex-col sm:flex-row sm:items-center gap-3 text-[13px]">
          <div className="flex items-center gap-2 font-medium text-[var(--text-primary)] shrink-0">
            <GitBranch className="w-4 h-4 text-[var(--accent-text)]" aria-hidden="true" />
            <span>Fault path:</span>
          </div>
          <div className="text-[var(--text-secondary)] leading-relaxed">
            <span className="font-medium text-[var(--text-primary)]">
              {figure.branchNote.trigger}
            </span>{" "}
            → {figure.branchNote.fallback} →{" "}
            <span className="font-medium text-[var(--text-primary)]">
              {figure.branchNote.outcome}
            </span>
          </div>
        </div>
      )}

      <figcaption className="pt-3 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[13px] text-[var(--text-secondary)]">
        <span>{figure.caption}</span>
        <span className="text-[var(--text-tertiary)] font-mono shrink-0">
          {figure.source}
        </span>
      </figcaption>
    </figure>
  );
}

export function CaseStudyFigures({ figures }: CaseStudyFiguresProps) {
  if (!figures || figures.length === 0) return null;

  return (
    <div className="w-full space-y-6">
      {figures.map((figure) => {
        if (figure.kind === "bar-comparison") {
          return <BarComparisonFigure key={figure.id} figure={figure} />;
        }
        if (figure.kind === "latency-anatomy") {
          return <LatencyAnatomyFigure key={figure.id} figure={figure} />;
        }
        return <FlowDiagramFigure key={figure.id} figure={figure} />;
      })}
    </div>
  );
}
