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
                    ? "Client HTTP Polling"
                    : slug === "stream-mart"
                    ? "Synchronous HTTP Chaining"
                    : "Unchecked HTML eval()"}
                </h3>
              </div>
              <span className="text-xs text-[var(--text-tertiary)]">
                {slug === "sockets"
                  ? step === 1
                    ? "2.1s Lag"
                    : "2s Interval"
                  : slug === "stream-mart"
                  ? "504 Timeout"
                  : "Syntax Crash"}
              </span>
            </div>

            {/* Simulated Problem Display */}
            <div className="rounded-xl bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] p-4 space-y-2.5">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2 text-xs">
                <span className="text-[var(--text-secondary)] font-mono">
                  {slug === "sockets"
                    ? "Score Telemetry"
                    : slug === "stream-mart"
                    ? "Checkout Pipeline"
                    : "Copilot Canvas"}
                </span>
                <span className="font-mono text-[13px] text-[var(--text-tertiary)]">
                  {slug === "sockets"
                    ? step === 2
                      ? "Updated late"
                      : "Stale data"
                    : slug === "stream-mart"
                    ? "Cascading delay"
                    : "Unchecked JSX"}
                </span>
              </div>

              <div className="py-1">
                <span className="text-xs text-[var(--text-secondary)] font-mono block">
                  {slug === "sockets"
                    ? "90% identical responses"
                    : slug === "stream-mart"
                    ? "Uncommitted order write"
                    : "Unchecked script execution"}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[var(--border-subtle)] text-[13px] text-[var(--text-tertiary)] flex items-center gap-1.5 font-mono">
            <XCircle className="w-3.5 h-3.5 text-[var(--text-tertiary)] shrink-0" aria-hidden="true" />
            <span>High latency</span>
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
                    ? "Targeted WebSocket Push"
                    : slug === "stream-mart"
                    ? "Transactional Outbox & Kafka"
                    : "Constrained AST Registry"}
                </h3>
              </div>
              <span className="text-xs text-[var(--accent-text)] font-medium">
                {slug === "sockets"
                  ? "Instant Push"
                  : slug === "stream-mart"
                  ? "Atomic Commit"
                  : "Zero eval()"}
              </span>
            </div>

            {/* Simulated Solution Display */}
            <div className="rounded-xl bg-[var(--surface-tile)] border border-[var(--border-subtle)] p-4 space-y-2.5">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2 text-xs">
                <span className="text-[var(--text-secondary)]">
                  {slug === "sockets"
                    ? "Push Gateway"
                    : slug === "stream-mart"
                    ? "Kafka Consumer"
                    : "Zod Schema"}
                </span>
                <span className="text-xs text-[var(--text-secondary)] font-normal">
                  {slug === "sockets"
                    ? "Push frame"
                    : slug === "stream-mart"
                    ? "Async decoupled"
                    : "Verified AST"}
                </span>
              </div>

              <div className="py-1">
                <span className="text-xs text-[var(--text-primary)] block">
                  {slug === "sockets"
                    ? "Push on database mutation"
                    : slug === "stream-mart"
                    ? "Atomic SQL transaction"
                    : "Typed JSON to React AST"}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[var(--border-subtle)] text-[13px] text-[var(--text-primary)] flex items-center gap-1.5 font-mono">
            <CheckCircle2 className="w-3.5 h-3.5 text-[var(--text-primary)] shrink-0" aria-hidden="true" />
            <span>Sub-second delivery</span>
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
