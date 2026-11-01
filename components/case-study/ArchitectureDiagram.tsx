"use client";

import { ArrowRight, Server, Shield, Database, Radio, Laptop } from "lucide-react";
import type { ProjectArchitectureStep } from "@/content/site";

interface ArchitectureDiagramProps {
  steps: ProjectArchitectureStep[];
  description?: string;
}

export function ArchitectureDiagram({ steps, description }: ArchitectureDiagramProps) {
  const getIcon = (id: string) => {
    switch (id) {
      case "worker":
        return <Server className="w-4 h-4 text-[var(--text-primary)] opacity-85" aria-hidden="true" />;
      case "server":
      case "gateway":
        return <Shield className="w-4 h-4 text-[var(--text-primary)] opacity-85" aria-hidden="true" />;
      case "db":
      case "storage":
        return <Database className="w-4 h-4 text-[var(--text-primary)] opacity-85" aria-hidden="true" />;
      case "pubsub":
      case "broadcaster":
        return <Radio className="w-4 h-4 text-[var(--text-primary)] opacity-85" aria-hidden="true" />;
      case "client":
      case "clients":
        return <Laptop className="w-4 h-4 text-[var(--text-primary)] opacity-85" aria-hidden="true" />;
      default:
        return <Server className="w-4 h-4 text-[var(--text-secondary)]" aria-hidden="true" />;
    }
  };

  return (
    <div className="w-full space-y-4">
      {description && (
        <p className="type-body4 text-[var(--text-secondary)] max-w-2xl">
          {description}
        </p>
      )}

      {/* Diagram Canvas Container */}
      <div className="w-full rounded-[var(--card-radius)] bento-surface p-6 sm:p-8 overflow-hidden">
        {/* Desktop View (Horizontal Pipeline) */}
        <div className="hidden lg:grid grid-cols-5 gap-3 items-stretch relative">
          {steps.map((step, idx) => (
            <div key={step.id} className="flex items-center gap-3">
              <div className="flex-1 rounded-[var(--card-radius-inner)] p-5 bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] transition-colors flex flex-col justify-between min-h-[190px] shadow-sm">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-lg bg-[var(--surface-tile)] border border-[var(--border-subtle)] flex items-center justify-center">
                      {getIcon(step.id)}
                    </div>
                    <span className="text-xs font-mono text-[var(--text-tertiary)] font-medium">
                      0{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-sm font-medium text-[var(--text-primary)] mb-1.5">
                    {step.label}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {step.role}
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-[var(--border-subtle)]">
                  <span className="font-mono text-xs text-[var(--text-tertiary)] bg-[var(--surface-tile)] px-2 py-0.5 rounded border border-[var(--border-subtle)] block truncate">
                    {step.tech}
                  </span>
                </div>
              </div>

              {idx < steps.length - 1 && (
                <div className="flex items-center justify-center text-[var(--text-tertiary)] opacity-60">
                  <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile & Tablet View (Vertical Stack with Connector Line) */}
        <div className="lg:hidden space-y-4 relative before:absolute before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-[var(--border-subtle)]">
          {steps.map((step, idx) => (
            <div key={step.id} className="relative flex items-start gap-4 pl-1">
              <div className="w-9 h-9 rounded-full bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] flex items-center justify-center shrink-0 z-10 shadow-sm">
                {getIcon(step.id)}
              </div>

              <div className="flex-1 rounded-[var(--card-radius-inner)] p-5 bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] shadow-sm">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-sm font-medium text-[var(--text-primary)]">
                    {step.label}
                  </h3>
                  <span className="text-xs text-[var(--text-tertiary)]">
                    Step <span className="font-mono">{idx + 1}</span>
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-3">
                  {step.role}
                </p>
                <span className="inline-block font-mono text-xs text-[var(--text-tertiary)] bg-[var(--surface-tile)] px-2 py-0.5 rounded border border-[var(--border-subtle)]">
                  {step.tech}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
