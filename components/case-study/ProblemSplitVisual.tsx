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
}

export function ProblemSplitVisual({ before, after, slug }: ProblemSplitVisualProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [step, setStep] = useState(0); // 0: baseline, 1: goal fires (push updates, polling lags), 2: polling finally updates, 3: rest
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

    // Simulation loop: 4.5s total
    // 0.0s: Base state (1-1)
    // 1.0s: Goal scored -> Push updates immediately to 2-1, polling requests pile up
    // 3.0s: Polling interval triggers -> Polling updates to 2-1
    // 4.5s: Reset
    const t1 = setTimeout(() => setStep(1), 1000);
    const t2 = setTimeout(() => setStep(2), 2800);
    const t3 = setTimeout(() => setStep(0), 4500);

    const interval = setInterval(() => {
      setStep(0);
      setTimeout(() => setStep(1), 1000);
      setTimeout(() => setStep(2), 2800);
    }, 4500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearInterval(interval);
    };
  }, [reducedMotion, isVisible]);

  return (
    <div ref={containerRef} className="w-full space-y-4">
      {/* ━━━ SPLIT VISUAL PANEL: POLLING VS PUSH ━━━ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Left: HTTP Polling (Traditional) */}
        <div className="rounded-[var(--card-radius)] bg-[var(--surface-tile)] border border-[var(--border-subtle)] p-5 sm:p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-neutral-400 dark:text-neutral-500 animate-spin motion-reduce:animate-none" aria-hidden="true" />
                <h3 className="text-sm font-medium text-[var(--text-primary)]">
                  {slug === "sockets"
                    ? "Client HTTP Polling"
                    : slug === "stream-mart"
                    ? "Synchronous HTTP Cascades"
                    : "Unchecked HTML eval()"}
                </h3>
              </div>
              <span className="text-[11px] font-mono text-[var(--text-tertiary)] px-2 py-0.5 rounded bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)]">
                {step === 1 ? "2.1s Lag" : "2s Interval"}
              </span>
            </div>

            {/* Simulated Polling Screen */}
            <div className="rounded-xl bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2 text-xs">
                <span className="text-[var(--text-secondary)] font-mono">ARS vs CHE (42&apos;)</span>
                <span className="font-mono text-[11px] text-[var(--text-tertiary)]">
                  {step >= 2 ? "Updated (late)" : step === 1 ? "Waiting for poll..." : "In sync"}
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-sm font-medium text-[var(--text-primary)]">Arsenal</span>
                <span
                  className={`font-mono text-xl font-medium transition-colors duration-200 ${
                    step >= 2 ? "text-[var(--text-primary)] font-semibold" : "text-[var(--text-secondary)]"
                  }`}
                >
                  {step >= 2 ? "2" : "1"}
                </span>
              </div>

              {/* Request pileup indicator */}
              <div className="pt-2 border-t border-[var(--border-subtle)] text-[11px] font-mono text-[var(--text-tertiary)] flex items-center justify-between">
                <span>Requests made:</span>
                <span className="text-red-400 dark:text-red-300 font-medium">
                  {step === 0 ? "12 GETs" : step === 1 ? "14 GETs (wasteful)" : "16 GETs (delayed)"}
                </span>
              </div>
            </div>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Clients repeatedly poll endpoints regardless of whether data changed, wasting connection pool slots and delaying scores until the next timer tick.
            </p>
          </div>

          <div className="pt-3 border-t border-[var(--border-subtle)] text-[11px] text-[var(--text-tertiary)] flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500 shrink-0" aria-hidden="true" />
            <span>High latency · Connection pool spikes under load</span>
          </div>
        </div>

        {/* Right: Push Architecture (Engineered) */}
        <div className="rounded-[var(--card-radius)] bg-[var(--surface-tile-elevated)] border border-[var(--border-hover)] p-5 sm:p-6 flex flex-col justify-between space-y-4 shadow-sm">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[var(--text-primary)] shrink-0" aria-hidden="true" />
                <h3 className="text-sm font-medium text-[var(--text-primary)]">
                  {slug === "sockets"
                    ? "Targeted WebSocket Push"
                    : slug === "stream-mart"
                    ? "Transactional Kafka Stream"
                    : "Verified Component Registry"}
                </h3>
              </div>
              <span className="text-[11px] font-mono text-emerald-500 px-2 py-0.5 rounded bg-[var(--surface-tile)] border border-[var(--border-subtle)] font-medium">
                {step >= 1 ? "Instant Push" : "Idle Socket"}
              </span>
            </div>

            {/* Simulated Push Screen */}
            <div className="rounded-xl bg-[var(--surface-tile)] border border-[var(--border-subtle)] p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2 text-xs">
                <span className="text-[var(--text-secondary)] font-mono">ARS vs CHE (42&apos;)</span>
                <span className="font-mono text-[11px] text-emerald-500 font-medium">
                  {step >= 1 ? "⚡ Event received" : "Ready"}
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-sm font-medium text-[var(--text-primary)]">Arsenal</span>
                <span
                  className={`font-mono text-xl font-medium transition-all duration-200 ${
                    step >= 1 ? "text-emerald-500 scale-105" : "text-[var(--text-primary)]"
                  }`}
                >
                  {step >= 1 ? "2" : "1"}
                </span>
              </div>

              {/* Network connection indicator */}
              <div className="pt-2 border-t border-[var(--border-subtle)] text-[11px] font-mono text-[var(--text-tertiary)] flex items-center justify-between">
                <span>Socket status:</span>
                <span className="text-emerald-500 font-medium">
                  1 persistent connection · 0 empty polls
                </span>
              </div>
            </div>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Database mutations trigger an immediate WebSocket frame to subscribed sockets in O(k) time, eliminating empty network requests.
            </p>
          </div>

          <div className="pt-3 border-t border-[var(--border-subtle)] text-[11px] text-[var(--text-primary)] flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[var(--text-primary)] shrink-0" aria-hidden="true" />
            <span>Sub-second delivery · Minimal bandwidth overhead</span>
          </div>
        </div>
      </div>

      {/* ━━━ PROGRESSIVE DISCLOSURE: DETAILS TOGGLE ━━━ */}
      <div className="flex flex-col items-center pt-1">
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="min-h-[40px] px-4 py-2 rounded-full bg-[var(--surface-tile)] hover:bg-[var(--surface-tile-hover)] border border-[var(--border-subtle)] text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] inline-flex items-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
          aria-expanded={showDetails}
          aria-controls="problem-details-panel"
        >
          <span>{showDetails ? "Hide full comparison" : "View technical comparison details"}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${showDetails ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>

        {showDetails && (
          <div
            id="problem-details-panel"
            className="w-full mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 p-5 rounded-xl bg-[var(--surface-tile)] border border-[var(--border-subtle)] transition-all animate-in fade-in duration-200"
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

