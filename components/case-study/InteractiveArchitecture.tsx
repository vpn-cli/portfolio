"use client";

import { useState } from "react";
import Image from "next/image";
import { Server, Database, Shield, Radio, Smartphone, Code2, Camera, ChevronDown } from "lucide-react";
import { CodeHighlight } from "./CodeHighlight";
import type { ArchitectureNode } from "@/data/projects";

interface InteractiveArchitectureProps {
  nodes: ArchitectureNode[];
}

export function InteractiveArchitecture({ nodes }: InteractiveArchitectureProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const initialHasScreenshot = Boolean(nodes[0]?.screenshotUrl);
  // Default to screenshot if available for visual-first presentation, otherwise code
  const [viewMode, setViewMode] = useState<"screenshot" | "code">(
    initialHasScreenshot ? "screenshot" : "code"
  );
  const [showCode, setShowCode] = useState(!initialHasScreenshot);

  const activeNode = nodes[selectedIdx] || nodes[0];

  const getIcon = (id: string) => {
    switch (id) {
      case "ingestion":
      case "prompt":
      case "api":
        return <Server className="w-4 h-4 text-[var(--text-primary)]" aria-hidden="true" />;
      case "db":
      case "postgres":
        return <Database className="w-4 h-4 text-[var(--text-primary)]" aria-hidden="true" />;
      case "security":
      case "arcjet":
      case "validator":
        return <Shield className="w-4 h-4 text-[var(--text-primary)]" aria-hidden="true" />;
      case "gateway":
      case "topic-map":
      case "kafka":
      case "groq":
      case "outbox":
        return <Radio className="w-4 h-4 text-[var(--text-primary)]" aria-hidden="true" />;
      case "client":
      case "clients":
      case "ui":
      case "registry":
      case "order":
        return <Smartphone className="w-4 h-4 text-[var(--text-primary)]" aria-hidden="true" />;
      default:
        return <Server className="w-4 h-4 text-[var(--text-primary)]" aria-hidden="true" />;
    }
  };

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
      <div className="rounded-[var(--card-radius)] bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] p-4 sm:p-5 shadow-sm">
        <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)] pb-3 mb-3 border-b border-[var(--border-subtle)]">
          <span className="font-medium text-[var(--text-primary)]">Architecture</span>
          <span className="hidden sm:inline">Select stage to inspect pipeline runtime</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {nodes.map((node, idx) => {
            const isSelected = idx === selectedIdx;
            return (
              <button
                key={node.id}
                type="button"
                onClick={() => handleSelectNode(idx)}
                className={`text-left p-3 rounded-xl border transition-all duration-150 flex flex-col justify-between min-h-[110px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 ${isSelected
                  ? "bg-[var(--surface-tile)] border-[var(--text-primary)] shadow-sm"
                  : "bg-[var(--surface-tile)] border-[var(--border-subtle)] hover:border-[var(--border-hover)] opacity-85 hover:opacity-100"
                  }`}
                aria-pressed={isSelected}
                aria-label={`Inspect stage 0${idx + 1}: ${node.title}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="w-6 h-6 rounded-md bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] flex items-center justify-center">
                      {getIcon(node.id)}
                    </div>
                    <span className="font-mono text-[10px] text-[var(--text-tertiary)]">
                      0{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-xs font-medium text-[var(--text-primary)] truncate">
                    {node.title}
                  </h3>
                  <p className="text-[10px] text-[var(--text-secondary)] truncate mt-0.5">
                    {node.subtitle}
                  </p>
                </div>

                <div className="mt-2 pt-1.5 border-t border-[var(--border-subtle)] flex items-center justify-between text-[10px] font-mono text-[var(--text-tertiary)]">
                  <span className="truncate">{node.tech}</span>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-primary)] shrink-0" aria-hidden="true" />
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
          {/* Header Row: Stage Description + Tabs (if both screenshot and code exist) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[var(--text-tertiary)]">
                Stage 0{selectedIdx + 1} · {activeNode.title}
              </span>
              <span className="text-[var(--border-subtle)]" aria-hidden="true">·</span>
              <span className="text-xs text-[var(--text-secondary)] truncate">
                {activeNode.role}
              </span>
            </div>

            {hasScreenshot && activeNode.codeSnippet && (
              <div
                role="tablist"
                aria-label="Node inspector view"
                className="inline-flex items-center p-0.5 rounded-lg bg-[var(--surface-tile)] border border-[var(--border-subtle)] self-start sm:self-auto"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={viewMode === "screenshot"}
                  onClick={() => setViewMode("screenshot")}
                  className={`min-h-[36px] px-3 py-1 rounded-md text-xs font-medium inline-flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 ${viewMode === "screenshot"
                    ? "bg-[var(--surface-tile-elevated)] text-[var(--text-primary)] shadow-sm"
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
                  className={`min-h-[36px] px-3 py-1 rounded-md text-xs font-medium inline-flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 ${viewMode === "code"
                    ? "bg-[var(--surface-tile-elevated)] text-[var(--text-primary)] shadow-sm"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    }`}
                >
                  <Code2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Code snippet</span>
                </button>
              </div>
            )}
          </div>

          {/* Visual Screen Capture (Dominates half viewport) */}
          {viewMode === "screenshot" && activeNode.screenshotUrl ? (
            <div className="space-y-2">
              <div className="w-full aspect-[16/10] rounded-[var(--card-radius)] overflow-hidden bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] relative shadow-md">
                <Image
                  src={activeNode.screenshotUrl}
                  alt={activeNode.screenshotCaption || activeNode.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 880px"
                  className="object-contain p-2"
                />
              </div>
              <p className="text-xs text-[var(--text-tertiary)] font-mono text-center">
                {activeNode.screenshotCaption || `${activeNode.title} live runtime capture.`}
              </p>
            </div>
          ) : activeNode.codeSnippet ? (
            <div className="space-y-2">
              {/* If node has code snippet, show progressive disclosure */}
              <div className="rounded-[var(--card-radius)] bg-[var(--surface-tile)] border border-[var(--border-subtle)] p-4 flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-[var(--text-primary)]" aria-hidden="true" />
                    <span className="font-mono text-[var(--text-secondary)]">
                      {activeNode.codeSnippet.filename}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] text-[var(--text-tertiary)] uppercase">
                    {activeNode.codeSnippet.language}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowCode(!showCode)}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-[var(--surface-tile-elevated)] hover:bg-[var(--surface-tile-hover)] border border-[var(--border-subtle)] text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] inline-flex items-center justify-between transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
                  aria-expanded={showCode}
                >
                  <span>{showCode ? "Hide implementation code" : "Inspect implementation code"}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${showCode ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                </button>

                {showCode && (
                  <div className="pt-2">
                    <CodeHighlight
                      filename={activeNode.codeSnippet.filename}
                      language={activeNode.codeSnippet.language}
                      code={activeNode.codeSnippet.code}
                      explanation={activeNode.codeSnippet.explanation}
                    />
                  </div>
                )}
              </div>
              <p className="text-xs text-[var(--text-tertiary)] font-mono text-center">
                Click to inspect {activeNode.codeSnippet.filename} implementation details.
              </p>
            </div>
          ) : (
            <div className="p-5 rounded-xl bg-[var(--surface-tile)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]">
              {activeNode.role}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
