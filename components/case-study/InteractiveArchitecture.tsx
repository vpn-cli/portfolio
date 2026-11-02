"use client";

import { useState } from "react";
import { Server, Database, Shield, Radio, Smartphone, ArrowRight, Check, Copy, FileCode2 } from "lucide-react";
import { CodeHighlight } from "./CodeHighlight";
import type { ArchitectureNode } from "@/data/projects";

interface InteractiveArchitectureProps {
  nodes: ArchitectureNode[];
}

export function InteractiveArchitecture({ nodes }: InteractiveArchitectureProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);

  const activeNode = nodes[selectedIdx] || nodes[0];

  const getIcon = (id: string) => {
    switch (id) {
      case "ingestion":
      case "api":
        return <Server className="w-4 h-4 text-[var(--text-primary)]" aria-hidden="true" />;
      case "db":
      case "postgres":
        return <Database className="w-4 h-4 text-[var(--text-primary)]" aria-hidden="true" />;
      case "security":
      case "arcjet":
        return <Shield className="w-4 h-4 text-[var(--text-primary)]" aria-hidden="true" />;
      case "gateway":
      case "topic-map":
      case "kafka":
        return <Radio className="w-4 h-4 text-[var(--text-primary)]" aria-hidden="true" />;
      case "client":
      case "clients":
      case "ui":
        return <Smartphone className="w-4 h-4 text-[var(--text-primary)]" aria-hidden="true" />;
      default:
        return <Server className="w-4 h-4 text-[var(--text-primary)]" aria-hidden="true" />;
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* ━━━ INTERACTIVE ARCHITECTURE NODES (CLICK A NODE TO INSPECT CODE) ━━━ */}
      <div className="rounded-[var(--card-radius)] bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)] pb-3 mb-4 border-b border-[var(--border-subtle)]">
          <span className="font-medium text-[var(--text-primary)]">Interactive System Topology</span>
          <span>Click any stage to inspect runtime code</span>
        </div>

        {/* Desktop Pipeline Flow */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {nodes.map((node, idx) => {
            const isSelected = idx === selectedIdx;
            return (
              <button
                key={node.id}
                type="button"
                onClick={() => setSelectedIdx(idx)}
                className={`text-left p-3.5 sm:p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between min-h-[120px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 ${
                  isSelected
                    ? "bg-[var(--surface-tile)] border-[var(--text-primary)] shadow-sm translate-y-[-2px]"
                    : "bg-[var(--surface-tile)] border-[var(--border-subtle)] hover:border-[var(--border-hover)] opacity-90 hover:opacity-100"
                }`}
                aria-pressed={isSelected}
                aria-label={`Inspect ${node.title}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-7 h-7 rounded-lg bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] flex items-center justify-center">
                      {getIcon(node.id)}
                    </div>
                    <span className="font-mono text-[11px] text-[var(--text-tertiary)]">
                      0{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-medium text-[var(--text-primary)] line-clamp-1">
                    {node.title}
                  </h3>
                  <p className="text-[11px] text-[var(--text-secondary)] line-clamp-1 mt-0.5">
                    {node.subtitle}
                  </p>
                </div>

                <div className="mt-2 pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between">
                  <span className="font-mono text-[10px] text-[var(--text-tertiary)] truncate">
                    {node.tech}
                  </span>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-primary)]" aria-hidden="true" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ━━━ CODE & RUNTIME INSPECTOR PANEL ━━━ */}
      {activeNode && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
            <div>
              <span className="text-xs text-[var(--text-tertiary)]">
                Stage 0{selectedIdx + 1} of 0{nodes.length} · Role Description
              </span>
              <p className="text-sm font-medium text-[var(--text-primary)] mt-0.5">
                {activeNode.role}
              </p>
            </div>
          </div>

          {activeNode.codeSnippet ? (
            <CodeHighlight
              filename={activeNode.codeSnippet.filename}
              language={activeNode.codeSnippet.language}
              code={activeNode.codeSnippet.code}
              explanation={activeNode.codeSnippet.explanation}
            />
          ) : (
            <div className="p-6 rounded-[var(--card-radius)] bg-[var(--surface-tile)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]">
              No code snippet for this stage. Runtime role: {activeNode.role}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

