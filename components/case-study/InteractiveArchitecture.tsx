"use client";

import { useState } from "react";
import Image from "next/image";
import { Code2, Camera, ChevronDown } from "lucide-react";
import { CodeHighlight } from "./CodeHighlight";
import type { ArchitectureNode } from "@/data/projects";

interface InteractiveArchitectureProps {
  nodes: ArchitectureNode[];
}

export function InteractiveArchitecture({ nodes }: InteractiveArchitectureProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const initialHasScreenshot = Boolean(nodes[0]?.screenshotUrl);
  const [viewMode, setViewMode] = useState<"screenshot" | "code">(
    initialHasScreenshot ? "screenshot" : "code"
  );
  const [showCode, setShowCode] = useState(!initialHasScreenshot);

  const activeNode = nodes[selectedIdx] || nodes[0];

  const handleSelectNode = (idx: number) => {
    setSelectedIdx(idx);
    const nodeHasScreenshot = Boolean(nodes[idx]?.screenshotUrl);
    if (nodeHasScreenshot) {
      setViewMode("screenshot");
      setShowCode(false);
    } else {
      setViewMode("code");
      setShowCode(true);
    }
  };

  const hasScreenshot = Boolean(activeNode.screenshotUrl);

  return (
    <div className="w-full space-y-4">
      {/* ━━━ TOPOLOGY GRID (CLICK ANY NODE TO INSPECT) ━━━ */}
      <div className="rounded-[var(--card-radius)] bg-[var(--surface-tile)] border border-[var(--border-subtle)] p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] pb-2 border-b border-[var(--border-subtle)]">
          <span className="font-normal text-[var(--text-primary)]">Architecture components</span>
          <span className="hidden sm:inline">Select component to inspect details</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {nodes.map((node, idx) => {
            const isSelected = idx === selectedIdx;
            return (
              <button
                key={node.id}
                type="button"
                onClick={() => handleSelectNode(idx)}
                className={`text-left p-3.5 rounded-xl border transition-all duration-150 flex flex-col justify-between min-h-[96px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 ${
                  isSelected
                    ? "bg-[var(--surface-tile-elevated)] border-[var(--accent-color)] ring-1 ring-[var(--accent-color)] shadow-sm"
                    : "bg-[var(--surface-tile)] border-[var(--border-subtle)] hover:border-[var(--border-hover)]"
                }`}
                aria-pressed={isSelected}
                aria-label={`Inspect ${node.title}`}
              >
                <div>
                  <h3 className="text-xs sm:text-sm font-normal text-[var(--text-primary)] truncate">
                    {node.title}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] truncate mt-0.5">
                    {node.subtitle}
                  </p>
                </div>

                <div className="mt-2 pt-1.5 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
                  <span className="truncate">{node.tech}</span>
                  {isSelected && (
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-[var(--accent-color)] shrink-0"
                      aria-hidden="true"
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ━━━ INSPECTOR PANEL: SCREENSHOT OR CODE DISCLOSURE ━━━ */}
      {activeNode && (
        <div className="space-y-3">
          {/* Header Row: Component Title + Role + Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-[var(--text-primary)]">
                {activeNode.title}
              </span>
              <span className="text-[var(--border-subtle)]" aria-hidden="true">
                ·
              </span>
              <span className="text-xs text-[var(--text-secondary)] truncate">
                {activeNode.role}
              </span>
            </div>

            {hasScreenshot && activeNode.codeSnippet && (
              <div
                role="tablist"
                aria-label="Node inspector view"
                className="inline-flex items-center gap-1 self-start sm:self-auto"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={viewMode === "screenshot"}
                  onClick={() => setViewMode("screenshot")}
                  className={`min-h-[32px] px-2.5 py-1 rounded-lg text-xs font-normal inline-flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 ${
                    viewMode === "screenshot"
                      ? "bg-[var(--surface-tile-elevated)] text-[var(--text-primary)] border border-[var(--border-subtle)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Live capture</span>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={viewMode === "code"}
                  onClick={() => setViewMode("code")}
                  className={`min-h-[32px] px-2.5 py-1 rounded-lg text-xs font-normal inline-flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 ${
                    viewMode === "code"
                      ? "bg-[var(--surface-tile-elevated)] text-[var(--text-primary)] border border-[var(--border-subtle)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Code snippet</span>
                </button>
              </div>
            )}
          </div>

          {/* Visual Screen Capture */}
          {viewMode === "screenshot" && activeNode.screenshotUrl ? (
            <div className="space-y-2">
              <div className="w-full aspect-[16/10] rounded-[var(--card-radius)] overflow-hidden bg-[var(--surface-tile)] border border-[var(--border-subtle)] relative shadow-sm">
                <Image
                  src={activeNode.screenshotUrl}
                  alt={activeNode.screenshotCaption || activeNode.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 880px"
                  className="object-contain p-2"
                />
              </div>
              <p className="text-xs text-[var(--text-secondary)] text-center">
                {activeNode.screenshotCaption || `${activeNode.title} live runtime capture.`}
              </p>
            </div>
          ) : activeNode.codeSnippet ? (
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setShowCode(!showCode)}
                className="min-h-[44px] w-full px-4 py-2.5 rounded-xl bg-[var(--surface-tile)] hover:bg-[var(--surface-tile-hover)] border border-[var(--border-subtle)] text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] inline-flex items-center justify-between transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
                aria-expanded={showCode}
              >
                <span>
                  {showCode
                    ? "Hide implementation code"
                    : `Inspect implementation code (${activeNode.codeSnippet.filename})`}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    showCode ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>

              {showCode && (
                <CodeHighlight
                  filename={activeNode.codeSnippet.filename}
                  language={activeNode.codeSnippet.language}
                  code={activeNode.codeSnippet.code}
                  explanation={activeNode.codeSnippet.explanation}
                />
              )}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-[var(--surface-tile)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]">
              {activeNode.role}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
