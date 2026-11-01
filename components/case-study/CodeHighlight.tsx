"use client";

import { useState } from "react";
import { Check, Copy, FileCode2 } from "lucide-react";

interface CodeHighlightProps {
  filename: string;
  language: string;
  code: string;
  explanation?: string;
}

export function CodeHighlight({
  filename,
  language,
  code,
  explanation,
}: CodeHighlightProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const lines = code.trim().split("\n");

  return (
    <div className="w-full rounded-[var(--card-radius)] overflow-hidden border border-[var(--border-subtle)] bg-[var(--surface-tile)] shadow-md">
      {/* Code Window Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border-subtle)] bg-[var(--surface-tile-elevated)]">
        <div className="flex items-center gap-2.5">
          <FileCode2 className="w-4 h-4 text-[var(--text-tertiary)]" aria-hidden="true" />
          <span className="font-mono text-xs text-[var(--text-primary)] font-medium">
            {filename}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-xs font-mono text-[var(--text-tertiary)] px-2.5 py-1 rounded-md bg-[var(--surface-tile)] border border-[var(--border-subtle)]">
            {language}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="min-h-[44px] inline-flex items-center gap-2 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-3.5 py-2.5 rounded-lg bg-[var(--surface-tile)] hover:bg-[var(--surface-tile-hover)] border border-[var(--border-subtle)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Copy snippet"
            aria-label="Copy code to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[var(--text-primary)]" aria-hidden="true" />
                <span className="text-[var(--text-primary)]">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Body */}
      <div className="p-4 sm:p-6 overflow-x-auto font-mono text-xs sm:text-[13px] leading-relaxed bg-[var(--surface-tile-elevated)] text-[var(--text-primary)]">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx} className="leading-relaxed">
                <td className="select-none pr-4 text-right text-[var(--text-tertiary)] text-xs w-8 opacity-60 align-top">
                  {idx + 1}
                </td>
                <td className="whitespace-pre font-mono align-top">
                  {renderHighlightedTokens(line)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {explanation && (
        <div className="px-5 py-3 border-t border-[var(--border-subtle)] bg-[var(--surface-tile)] text-xs text-[var(--text-secondary)]">
          <span className="font-medium text-[var(--text-primary)]">Note:</span>{" "}
          {explanation}
        </div>
      )}
    </div>
  );
}

function renderHighlightedTokens(line: string) {
  if (line.trim().startsWith("//")) {
    return <span className="text-[var(--text-tertiary)]">{line}</span>;
  }

  const parts = line.split(/(\b(?:function|const|let|var|if|return|for|of|import|export|from|new|await|async)\b|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`[^`]*`|\b\d+\b)/g);

  return parts.map((part, i) => {
    if (/^(function|const|let|var|if|return|for|of|import|export|from|new|await|async)$/.test(part)) {
      return (
        <span key={i} className="font-medium text-[var(--text-primary)] underline decoration-[var(--border-subtle)] underline-offset-2">
          {part}
        </span>
      );
    }
    if (/^["'`].*["'`]$/.test(part)) {
      return (
        <span key={i} className="text-[var(--text-secondary)] opacity-95">
          {part}
        </span>
      );
    }
    if (/^\d+$/.test(part)) {
      return (
        <span key={i} className="font-medium text-[var(--text-primary)]">
          {part}
        </span>
      );
    }
    if (part === "WebSocket" || part === "OPEN") {
      return (
        <span key={i} className="font-medium text-[var(--text-primary)]">
          {part}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}
