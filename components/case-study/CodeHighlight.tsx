"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CodeHighlightProps {
  filename: string;
  language: string;
  code: string;
  explanation?: string;
  description?: string;
  contextUrl?: string;
}

export function CodeHighlight({
  filename,
  code,
  explanation,
  description,
  contextUrl,
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
    <div className="w-full space-y-2">
      {/* Filename and copy button on one row above */}
      <div className="flex items-center justify-between text-xs px-1">
        <span className="text-xs text-[var(--text-secondary)] font-mono">
          {filename}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="btn-secondary inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-[var(--text-primary)] transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)] focus-visible:ring-offset-2"
          aria-label="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[var(--accent-text)]" aria-hidden="true" />
              <span className="text-[var(--accent-text)] text-xs">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="text-xs">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* One code surface with comfortable padding */}
      <div className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-tile)] p-4 sm:p-5 overflow-x-auto text-xs sm:text-[13px] leading-relaxed font-mono">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx} className="leading-relaxed">
                <td className="select-none pr-4 text-right text-[var(--text-tertiary)] text-xs w-8 align-top" aria-hidden="true">
                  {idx + 1}
                </td>
                <td className="whitespace-pre font-mono align-top text-[var(--text-primary)]">
                  {renderHighlightedTokens(line)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(explanation || description) && (
        <p className="text-xs text-[var(--text-secondary)] px-1">
          <span className="text-[var(--text-primary)] font-medium">Note:</span> {explanation || description}
        </p>
      )}
      {contextUrl && (
        <div className="px-1 pt-1">
          <a
            href={contextUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link text-xs inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)] focus-visible:ring-offset-2"
          >
            <span>View source file on GitHub</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      )}
    </div>
  );
}

function renderHighlightedTokens(line: string) {
  if (line.trim().startsWith("//")) {
    return <span className="text-[var(--text-tertiary)] italic">{line}</span>;
  }

  const parts = line.split(
    /(\b(?:function|const|let|var|if|return|for|of|import|export|from|new|await|async)\b|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`[^`]*`|\b\d+\b)/g
  );

  return parts.map((part, i) => {
    if (
      /^(function|const|let|var|if|return|for|of|import|export|from|new|await|async)$/.test(
        part
      )
    ) {
      return (
        <span key={i} className="font-medium text-[var(--text-primary)]">
          {part}
        </span>
      );
    }
    if (/^["'`].*["'`]$/.test(part)) {
      return (
        <span key={i} className="text-[var(--text-secondary)]">
          {part}
        </span>
      );
    }
    if (/^\d+$/.test(part)) {
      return (
        <span key={i} className="text-[var(--text-primary)]">
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
