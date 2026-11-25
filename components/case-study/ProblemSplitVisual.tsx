"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, RefreshCw, Zap, XCircle, CheckCircle2 } from "lucide-react";

interface ProblemSplitVisualProps {
  before: {
    title: string;
    points: string[];
  };
  after: {
    title: string;
    points: string[];
  };
  slug: string;
  caption?: string;
}

export function ProblemSplitVisual({ before, after, slug, caption }: ProblemSplitVisualProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [step, setStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionQuery.matches);
    const handleMotion = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    motionQuery.addEventListener("change", handleMotion);

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );

    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      motionQuery.removeEventListener("change", handleMotion);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (reducedMotion || !isVisible) return;

    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 3);
    }, 2200);

    return () => clearInterval(interval);
  }, [reducedMotion, isVisible]);

  return (
    <div ref={containerRef} className="w-full space-y-3">
      {/* ━━━ SPLIT COMPARISON PANEL (TAKES ≥50% VIEWPORT ON DESKTOP) ━━━ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Left: Traditional Problem State */}
        <div className="rounded-[var(--card-radius)] bg-[var(--surface-tile)] border border-[var(--border-subtle)] p-5 sm:p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RefreshCw
                  className="w-4 h-4 text-[var(--text-tertiary)] animate-spin motion-reduce:animate-none"
                  aria-hidden="true"
                />
                <h3 className="text-sm font-medium text-[var(--text-primary)]">
                  {slug === "sockets"
                    ? "Single-Node Map & Uncoalesced Replay"
                    : slug === "stream-mart"
                    ? "Per-Message eachMessage Commits"
                    : "Unchecked JSX eval() & Legacy DDL"}
                </h3>
              </div>
              <span className="text-xs text-[var(--text-tertiary)]">
                {slug === "sockets"
                  ? step === 1
                    ? "N DB Queries"
                    : "Isolated State"
                  : slug === "stream-mart"
                  ? "48.42 /s Cap"
                  : "Syntax & SQL Risk"}
              </span>
            </div>

            {/* Simulated Problem Display */}
            <div className="rounded-xl bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] p-4 space-y-2.5">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2 text-xs">
                <span className="text-[var(--text-secondary)] font-mono">
                  {slug === "sockets"
                    ? "Reconnect & Outage"
                    : slug === "stream-mart"
                    ? "Consumer Pipeline"
                    : "Copilot & Schema"}
                </span>
                <span className="font-mono text-[13px] text-[var(--text-tertiary)]">
                  {slug === "sockets"
                    ? step === 2
                      ? "Duplicate Echo"
                      : "Stampede"
                    : slug === "stream-mart"
                    ? "7,420 Lag @ 30s"
                    : "Unchecked AST"}
                </span>
              </div>

              <div className="py-1">
                <span className="text-xs text-[var(--text-secondary)] font-mono block">
                  {slug === "sockets"
                    ? "1,000 clients = 1,000 Postgres queries"
                    : slug === "stream-mart"
                    ? "24.22ms/msg (99.7% Postgres I/O)"
                    : "Unvalidated JSX + raw SQL strings"}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[var(--border-subtle)] text-[13px] text-[var(--text-tertiary)] flex items-center gap-1.5 font-mono">
            <XCircle className="w-3.5 h-3.5 text-[var(--text-tertiary)] shrink-0" aria-hidden="true" />
            <span>
              {slug === "sockets"
                ? "Single-instance bottleneck"
                : slug === "stream-mart"
                ? "154.33s lag catch-up"
                : "Fragile generation & DDL"}
            </span>
          </div>
        </div>

        {/* Right: Engineered Solution State */}
        <div className="rounded-[var(--card-radius)] bg-[var(--surface-tile-elevated)] border border-[var(--border-hover)] p-5 sm:p-6 flex flex-col justify-between space-y-4 shadow-sm">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[var(--text-primary)] shrink-0" aria-hidden="true" />
                <h3 className="text-sm font-medium text-[var(--text-primary)]">
                  {slug === "sockets"
                    ? "Redis 7 Cluster & Coalesced Replay"
                    : slug === "stream-mart"
                    ? "SKIP LOCKED & eachBatch + DLQ"
                    : "Strict Zod AST & Parameterized DDL"}
                </h3>
              </div>
              <span className="text-xs text-[var(--accent-text)] font-medium">
                {slug === "sockets"
                  ? "0 / 625k Lost"
                  : slug === "stream-mart"
                  ? "375.75 /s (+7.76×)"
                  : "81.4% Eval Pass"}
              </span>
            </div>

            {/* Simulated Solution Display */}
            <div className="rounded-xl bg-[var(--surface-tile)] border border-[var(--border-subtle)] p-4 space-y-2.5">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2 text-xs">
                <span className="text-[var(--text-secondary)]">
                  {slug === "sockets"
                    ? "500-Seq Dedupe + Coalescing"
                    : slug === "stream-mart"
                    ? "1 SQL Tx / Batch"
                    : "Pre-Chunk Failover"}
                </span>
                <span className="text-xs text-[var(--text-secondary)] font-normal">
                  {slug === "sockets"
                    ? "98.649% ≤ 400ms"
                    : slug === "stream-mart"
                    ? "0 msgs lag @ 30s"
                    : "92.8% valid nodes"}
                </span>
              </div>

              <div className="py-1">
                <span className="text-xs text-[var(--text-primary)] block">
                  {slug === "sockets"
                    ? "1,000 gap requests = 1 Postgres query"
                    : slug === "stream-mart"
                    ? "Poison pills isolated to payment-successful.DLQ"
                    : "format('%I') DDL + Clerk RLS (192 tests)"}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[var(--border-subtle)] text-[13px] text-[var(--text-primary)] flex items-center gap-1.5 font-mono">
            <CheckCircle2 className="w-3.5 h-3.5 text-[var(--text-primary)] shrink-0" aria-hidden="true" />
            <span>
              {slug === "sockets"
                ? "0.0ms server event-loop lag"
                : slug === "stream-mart"
                ? "0.31s catch-up · 4/4 CI tests"
                : "Zero eval() · Lighthouse 91"}
            </span>
          </div>
        </div>
      </div>

      {/* Caption directly under visual (≤12 words) */}
      <p className="text-xs text-[var(--text-secondary)] text-center">
        {caption || "Architectural comparison: traditional approach versus targeted event delivery."}
      </p>

      {/* ━━━ PROGRESSIVE DISCLOSURE: DETAILS EXPANDER (44PX HIT TARGET) ━━━ */}
      <div className="flex flex-col items-center pt-1">
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="btn-secondary min-h-[44px] px-5 py-2.5 rounded-lg text-xs font-medium text-[var(--text-primary)] inline-flex items-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)] focus-visible:ring-offset-2 active:scale-95 shadow-sm"
          aria-expanded={showDetails}
          aria-controls="problem-details-panel"
        >
          <span>{showDetails ? "Hide comparison" : "View comparison"}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${showDetails ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>

        {showDetails && (
          <div
            id="problem-details-panel"
            className="w-full mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 p-5 rounded-xl bg-[var(--surface-tile)] border border-[var(--border-subtle)] animate-in fade-in duration-150"
          >
            <div className="space-y-2">
              <span className="text-xs font-medium text-[var(--text-primary)] block">
                {before.title}
              </span>
              <ul className="space-y-1.5 pl-3 border-l border-[var(--border-subtle)]">
                {before.points.map((pt, idx) => (
                  <li key={idx} className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    • {pt}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-medium text-[var(--text-primary)] block">
                {after.title}
              </span>
              <ul className="space-y-1.5 pl-3 border-l border-[var(--border-subtle)]">
                {after.points.map((pt, idx) => (
                  <li key={idx} className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    • {pt}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
