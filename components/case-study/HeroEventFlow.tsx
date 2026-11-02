"use client";

import { useEffect, useRef, useState } from "react";
import { Server, Database, Radio, Smartphone, ArrowRight, Play, Film, CheckCircle2 } from "lucide-react";

interface HeroEventFlowProps {
  slug: string;
  title: string;
}

export function HeroEventFlow({ slug, title }: HeroEventFlowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [showVideo, setShowVideo] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionQuery.matches);
    const handleMotion = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    motionQuery.addEventListener("change", handleMotion);

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      motionQuery.removeEventListener("change", handleMotion);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (reducedMotion || !isVisible || showVideo) return;

    const timer = setInterval(() => {
      setPhase((prev) => (prev + 1) % 4);
    }, 1100);

    return () => clearInterval(timer);
  }, [reducedMotion, isVisible, showVideo]);

  return (
    <div
      ref={containerRef}
      className="w-full rounded-[var(--card-radius)] border border-[var(--border-subtle)] bg-[var(--surface-tile-elevated)] p-5 sm:p-7 shadow-sm overflow-hidden relative"
      aria-label={`${title} system architecture visual simulation`}
    >
      {/* Top Bar: Visual label + Optional Video toggle */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--border-subtle)] text-xs text-[var(--text-tertiary)]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--text-primary)]" aria-hidden="true" />
          <span className="font-medium text-[var(--text-primary)]">
            {slug === "sockets"
              ? "Event Flow"
              : slug === "stream-mart"
              ? "Outbox Pipeline"
              : "AST Pipeline"}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setShowVideo(!showVideo)}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--surface-tile)] hover:bg-[var(--surface-tile-hover)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
        >
          <Film className="w-3 h-3" aria-hidden="true" />
          <span>{showVideo ? "Diagram" : "Video"}</span>
        </button>
      </div>

      {showVideo ? (
        <div className="w-full aspect-[16/9] max-h-[420px] rounded-xl overflow-hidden bg-black flex items-center justify-center">
          <video
            controls
            autoPlay
            playsInline
            loop
            poster={`/videos/${slug}/brag.jpg`}
            className="w-full h-full object-contain"
          >
            <source src={`/videos/${slug}/brag.webm`} type="video/webm" />
            <source src={`/videos/${slug}/brag.mp4`} type="video/mp4" />
          </video>
        </div>
      ) : slug === "sockets" ? (
        /* ━━━ SPORTZ EVENT FLOW (Ingestion -> Postgres -> Gateway -> Topic Map -> Subscribed vs Idle Clients) ━━━ */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center relative">
            {/* Stage 1: REST Ingestion */}
            <div
              className={`rounded-xl p-4 border transition-all duration-300 ${
                phase === 0
                  ? "bg-[var(--surface-tile)] border-[var(--text-primary)] shadow-md"
                  : "bg-[var(--surface-tile)] border-[var(--border-subtle)] opacity-85"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[11px] text-[var(--text-tertiary)]">01 · POST</span>
                <Server className="w-4 h-4 text-[var(--text-primary)]" aria-hidden="true" />
              </div>
              <div className="font-mono text-xs font-medium text-[var(--text-primary)] truncate">
                /matches/1/score
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] mt-1">
                Score mutation received (ARS 2 - 1 CHE)
              </p>
              <div className="mt-2.5 pt-2 border-t border-[var(--border-subtle)] text-[10px] font-mono text-[var(--text-tertiary)] flex items-center gap-1.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    phase === 0 ? "bg-emerald-500 animate-pulse" : "bg-neutral-400"
                  }`}
                />
                <span>Payload validated</span>
              </div>
            </div>

            {/* Stage 2: Database Commit */}
            <div
              className={`rounded-xl p-4 border transition-all duration-300 ${
                phase === 1
                  ? "bg-[var(--surface-tile)] border-[var(--text-primary)] shadow-md"
                  : "bg-[var(--surface-tile)] border-[var(--border-subtle)] opacity-85"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[11px] text-[var(--text-tertiary)]">02 · WRITE</span>
                <Database className="w-4 h-4 text-[var(--text-primary)]" aria-hidden="true" />
              </div>
              <div className="font-mono text-xs font-medium text-[var(--text-primary)]">
                Neon PostgreSQL
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] mt-1">
                Drizzle ORM schema update committed
              </p>
              <div className="mt-2.5 pt-2 border-t border-[var(--border-subtle)] text-[10px] font-mono text-[var(--text-tertiary)] flex items-center gap-1.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    phase === 1 ? "bg-emerald-500 animate-pulse" : "bg-neutral-400"
                  }`}
                />
                <span>State persisted</span>
              </div>
            </div>

            {/* Stage 3: WS Gateway & Topic Isolation */}
            <div
              className={`rounded-xl p-4 border transition-all duration-300 ${
                phase === 2
                  ? "bg-[var(--surface-tile)] border-[var(--text-primary)] shadow-md"
                  : "bg-[var(--surface-tile)] border-[var(--border-subtle)] opacity-85"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[11px] text-[var(--text-tertiary)]">03 · GATEWAY</span>
                <Radio className="w-4 h-4 text-[var(--text-primary)]" aria-hidden="true" />
              </div>
              <div className="font-mono text-xs font-medium text-[var(--text-primary)] truncate">
                Topic Map Fanout
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] mt-1">
                Lookup Map&lt;match:1, Set&lt;ws&gt;&gt;
              </p>
              <div className="mt-2.5 pt-2 border-t border-[var(--border-subtle)] text-[10px] font-mono text-[var(--text-tertiary)] flex items-center gap-1.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    phase === 2 ? "bg-emerald-500 animate-pulse" : "bg-neutral-400"
                  }`}
                />
                <span>O(k) targeted routing</span>
              </div>
            </div>

            {/* Stage 4: Subscribed Clients vs Idle Clients */}
            <div
              className={`rounded-xl p-4 border transition-all duration-300 space-y-2.5 ${
                phase === 3
                  ? "bg-[var(--surface-tile)] border-[var(--text-primary)] shadow-md"
                  : "bg-[var(--surface-tile)] border-[var(--border-subtle)] opacity-85"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-[var(--text-tertiary)]">04 · CLIENTS</span>
                <Smartphone className="w-4 h-4 text-[var(--text-primary)]" aria-hidden="true" />
              </div>

              {/* Subscribed Phone 1 */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      phase === 3 ? "bg-emerald-500 animate-ping" : "bg-emerald-500"
                    }`}
                  />
                  <span className="font-mono font-medium text-[var(--text-primary)]">Client A (Match 1)</span>
                </div>
                <span className="font-mono text-[10px] text-[var(--text-primary)] font-medium">
                  {phase === 3 ? "⚡ 2-1" : "1-1"}
                </span>
              </div>

              {/* Subscribed Phone 2 */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      phase === 3 ? "bg-emerald-500 animate-ping" : "bg-emerald-500"
                    }`}
                  />
                  <span className="font-mono font-medium text-[var(--text-primary)]">Client B (Match 1)</span>
                </div>
                <span className="font-mono text-[10px] text-[var(--text-primary)] font-medium">
                  {phase === 3 ? "⚡ 2-1" : "1-1"}
                </span>
              </div>

              {/* Idle Phone (Match 2) - Topic Isolation in Action */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] text-[11px] opacity-60">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-neutral-400" />
                  <span className="font-mono text-[var(--text-tertiary)]">Client C (Match 2)</span>
                </div>
                <span className="font-mono text-[10px] text-[var(--text-tertiary)]">Idle</span>
              </div>
            </div>
          </div>

          {/* Caption highlighting topic isolation */}
          <div className="p-3 rounded-lg bg-[var(--surface-tile)] border border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
            <span className="leading-relaxed">
              <strong className="text-[var(--text-primary)] font-medium">Topic isolation in action:</strong>{" "}
              The score update travels only to clients subscribed to Match #1. Sockets watching other matches stay completely idle with zero network or CPU overhead.
            </span>
          </div>
        </div>
      ) : slug === "stream-mart" ? (
        /* ━━━ STREAMMART EVENT FLOW ━━━ */
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 items-center">
            {/* Stage 1: Checkout POST */}
            <div
              className={`rounded-xl p-3.5 border transition-all duration-300 ${
                phase === 0
                  ? "bg-[var(--surface-tile)] border-[var(--text-primary)] shadow-md"
                  : "bg-[var(--surface-tile)] border-[var(--border-subtle)] opacity-85"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-[10px] text-[var(--text-tertiary)]">01 · INGRESS</span>
                <Server className="w-3.5 h-3.5 text-[var(--text-primary)]" aria-hidden="true" />
              </div>
              <div className="font-mono text-xs font-medium text-[var(--text-primary)] truncate">
                API Gateway
              </div>
              <span className="text-[10px] text-[var(--text-secondary)] font-mono block mt-0.5">
                JWT auth & proxy
              </span>
            </div>

            {/* Stage 2: Atomic Outbox Transaction */}
            <div
              className={`rounded-xl p-3.5 border transition-all duration-300 ${
                phase === 1
                  ? "bg-[var(--surface-tile)] border-[var(--text-primary)] shadow-md"
                  : "bg-[var(--surface-tile)] border-[var(--border-subtle)] opacity-85"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-[10px] text-[var(--text-tertiary)]">02 · ATOMIC DB</span>
                <Database className="w-3.5 h-3.5 text-[var(--text-primary)]" aria-hidden="true" />
              </div>
              <div className="font-mono text-xs font-medium text-[var(--text-primary)] truncate">
                Postgres Outbox
              </div>
              <span className="text-[10px] text-[var(--text-secondary)] font-mono block mt-0.5">
                Atomic transaction
              </span>
            </div>

            {/* Stage 3: Kafka Message Broker */}
            <div
              className={`rounded-xl p-3.5 border transition-all duration-300 ${
                phase === 2
                  ? "bg-[var(--surface-tile)] border-[var(--text-primary)] shadow-md"
                  : "bg-[var(--surface-tile)] border-[var(--border-subtle)] opacity-85"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-[10px] text-[var(--text-tertiary)]">03 · BROKER</span>
                <Radio className="w-3.5 h-3.5 text-[var(--text-primary)]" aria-hidden="true" />
              </div>
              <div className="font-mono text-xs font-medium text-[var(--text-primary)] truncate">
                Apache Kafka
              </div>
              <span className="text-[10px] text-[var(--text-secondary)] font-mono block mt-0.5">
                Orders partition
              </span>
            </div>

            {/* Stage 4: Async Consumers */}
            <div
              className={`rounded-xl p-3.5 border transition-all duration-300 space-y-1.5 ${
                phase === 3
                  ? "bg-[var(--surface-tile)] border-[var(--text-primary)] shadow-md"
                  : "bg-[var(--surface-tile)] border-[var(--border-subtle)] opacity-85"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[var(--text-tertiary)]">04 · WORKERS</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--text-primary)]" aria-hidden="true" />
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-[var(--text-secondary)] truncate">Payment / Mail</span>
                <span className="text-emerald-500 font-medium shrink-0">Done</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ━━━ APPFORGE EVENT FLOW ━━━ */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            {/* Stage 1: Prompt Ingestion */}
            <div
              className={`rounded-xl p-4 border transition-all duration-300 ${
                phase === 0
                  ? "bg-[var(--surface-tile)] border-[var(--text-primary)] shadow-md"
                  : "bg-[var(--surface-tile)] border-[var(--border-subtle)] opacity-85"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[11px] text-[var(--text-tertiary)]">01 · PROMPT</span>
                <Server className="w-4 h-4 text-[var(--text-primary)]" aria-hidden="true" />
              </div>
              <div className="font-mono text-xs font-medium text-[var(--text-primary)] truncate">
                &ldquo;Kanban board&rdquo;
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] mt-1">
                Prompt streams to Groq LPU (Llama-3.3)
              </p>
            </div>

            {/* Stage 2: AST JSON Generation */}
            <div
              className={`rounded-xl p-4 border transition-all duration-300 ${
                phase === 1
                  ? "bg-[var(--surface-tile)] border-[var(--text-primary)] shadow-md"
                  : "bg-[var(--surface-tile)] border-[var(--border-subtle)] opacity-85"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[11px] text-[var(--text-tertiary)]">02 · COMPILATION</span>
                <Database className="w-4 h-4 text-[var(--text-primary)]" aria-hidden="true" />
              </div>
              <div className="font-mono text-xs font-medium text-[var(--text-primary)]">
                Structured AST
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] mt-1">
                Model outputs JSON UI tree, not raw JS
              </p>
            </div>

            {/* Stage 3: Zod Validation */}
            <div
              className={`rounded-xl p-4 border transition-all duration-300 ${
                phase === 2
                  ? "bg-[var(--surface-tile)] border-[var(--text-primary)] shadow-md"
                  : "bg-[var(--surface-tile)] border-[var(--border-subtle)] opacity-85"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[11px] text-[var(--text-tertiary)]">03 · SANITIZATION</span>
                <Radio className="w-4 h-4 text-[var(--text-primary)]" aria-hidden="true" />
              </div>
              <div className="font-mono text-xs font-medium text-[var(--text-primary)]">
                Zod Validator
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] mt-1">
                Strips code fences & validates schema
              </p>
            </div>

            {/* Stage 4: React Registry Mount */}
            <div
              className={`rounded-xl p-4 border transition-all duration-300 ${
                phase === 3
                  ? "bg-[var(--surface-tile)] border-[var(--text-primary)] shadow-md"
                  : "bg-[var(--surface-tile)] border-[var(--border-subtle)] opacity-85"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[11px] text-[var(--text-tertiary)]">04 · MOUNT</span>
                <CheckCircle2 className="w-4 h-4 text-[var(--text-primary)]" aria-hidden="true" />
              </div>
              <div className="font-mono text-xs font-medium text-[var(--text-primary)]">
                React Registry
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] mt-1">
                Zero eval() · Deterministic component DOM
              </p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[var(--surface-tile)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]">
            <strong className="text-[var(--text-primary)] font-medium">Zero arbitrary eval():</strong>{" "}
            Instead of executing unchecked script tags, AppForge parses prompts into typed JSON and maps nodes directly to verified React primitives.
          </div>
        </div>
      )}
    </div>
  );
}

