"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, AlertTriangle, ShieldCheck, Database, Radio } from "lucide-react";

export function AboutPrinciples() {
  // Principle 1: In-Memory vs Redis toggle
  const [p1Mode, setP1Mode] = useState<"memory" | "redis">("memory");

  // Principle 2: Sequence step scrubber (0 to 3)
  const [p2Step, setP2Step] = useState<number>(1);

  // Principle 3: AST mode toggle
  const [p3Mode, setP3Mode] = useState<"ast" | "raw">("ast");

  const p2Steps = [
    { label: "1. DB Commit", desc: "Order + Outbox event written in 1 atomic PostgreSQL transaction" },
    { label: "2. Outbox Row", desc: "Event persisted to outbox table with status 'PENDING'" },
    { label: "3. Kafka CDC", desc: "Debezium streams WAL event to topic orders.events (partition 2)" },
    { label: "4. Payment Ack", desc: "Payment worker consumes event, marks outbox 'COMPLETED'" },
  ];

  return (
    <section aria-labelledby="how-i-work-heading" className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[var(--border-subtle)] pb-4">
        <div>
          <h2 id="how-i-work-heading" className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            How I work
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Three core engineering principles backed by architectural decisions in production case studies.
          </p>
        </div>
        <span className="text-xs text-[var(--text-tertiary)] hidden sm:inline">
          Architectural proofs
        </span>
      </div>

      {/* 3 Interactive Principle Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* PRINCIPLE 1: SIMPLE STATE */}
        <article className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-tile)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] flex flex-col justify-between transition-colors space-y-4">
          <div className="space-y-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-sky-500">
              01 // Architectural Tenet
            </span>
            <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
              Simple state before added infrastructure
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              Solve local concurrency with language primitives before introducing external caching or message brokers.
            </p>
          </div>

          {/* Interactive Micro-Demo: Memory vs Redis */}
          <div className="p-3 rounded-xl bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[var(--text-tertiary)]">Interactive Benchmark:</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setP1Mode("memory")}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${p1Mode === "memory"
                      ? "bg-[var(--text-primary)] text-[var(--bg-canvas)]"
                      : "text-[var(--text-secondary)]"
                    }`}
                >
                  In-Memory Map
                </button>
                <button
                  onClick={() => setP1Mode("redis")}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${p1Mode === "redis"
                      ? "bg-[var(--text-primary)] text-[var(--bg-canvas)]"
                      : "text-[var(--text-secondary)]"
                    }`}
                >
                  Redis Cluster
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-[var(--border-subtle)] font-mono text-[11px]">
              <div>
                <span className="text-[10px] text-[var(--text-tertiary)] block">LATENCY</span>
                <span className={`font-bold ${p1Mode === "memory" ? "text-emerald-500" : "text-amber-500"}`}>
                  {p1Mode === "memory" ? "0.18 ms" : "4.8 ms"}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--text-tertiary)] block">NETWORK HOPS</span>
                <span className="font-bold text-[var(--text-primary)]">
                  {p1Mode === "memory" ? "0 (local)" : "1 hop"}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--text-tertiary)] block">INFRA COST</span>
                <span className="font-bold text-[var(--text-primary)]">
                  {p1Mode === "memory" ? "$0/mo" : "$35+/mo"}
                </span>
              </div>
            </div>
          </div>

          {/* Foot: Case Study Reference */}
          <div className="pt-3 border-t border-[var(--border-subtle)] space-y-1 text-xs">
            <span className="text-[11px] text-[var(--text-tertiary)] block">
              Proof from case study:
            </span>
            <p className="text-[12px] text-[var(--text-secondary)]">
              Sportz handles thousands of concurrent subscribers using native Node.js Maps with zero Redis dependency.
            </p>
            <Link
              href="/work/sockets#decisions"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--text-primary)] hover:underline pt-1"
            >
              <span>Read in Sportz Sockets Engine</span>
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        </article>

        {/* PRINCIPLE 2: DURABLE EVENT LOGS */}
        <article className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-tile)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] flex flex-col justify-between transition-colors space-y-4">
          <div className="space-y-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-500">
              02 // Architectural Tenet
            </span>
            <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
              Durable event logs over direct HTTP cascades
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              Decouple inter-service communication through persistent logs to eliminate synchronous cascade failures.
            </p>
          </div>

          {/* Interactive Micro-Demo: Outbox Scrubber */}
          <div className="p-3 rounded-xl bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[var(--text-tertiary)]">Outbox Lifecycle:</span>
              <span className="font-mono text-[10px] text-emerald-500 font-bold">
                STEP {p2Step + 1} OF 4
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1">
              {p2Steps.map((step, idx) => (
                <button
                  key={idx}
                  onClick={() => setP2Step(idx)}
                  className={`py-1 rounded text-[10px] font-mono font-semibold transition-all cursor-pointer ${p2Step === idx
                      ? "bg-emerald-500 text-black shadow-xs"
                      : "bg-[var(--surface-tile)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                    }`}
                >
                  S{idx + 1}
                </button>
              ))}
            </div>

            <p className="text-[11px] font-mono text-[var(--text-primary)] min-h-[32px] pt-1 leading-snug">
              {p2Steps[p2Step].desc}
            </p>
          </div>

          {/* Foot: Case Study Reference */}
          <div className="pt-3 border-t border-[var(--border-subtle)] space-y-1 text-xs">
            <span className="text-[11px] text-[var(--text-tertiary)] block">
              Proof from case study:
            </span>
            <p className="text-[12px] text-[var(--text-secondary)]">
              StreamMart uses the transactional outbox pattern to guarantee at-least-once Kafka message delivery.
            </p>
            <Link
              href="/work/stream-mart#decisions"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--text-primary)] hover:underline pt-1"
            >
              <span>Read in StreamMart Outbox</span>
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        </article>

        {/* PRINCIPLE 3: DETERMINISTIC ASTS */}
        <article className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-tile)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] flex flex-col justify-between transition-colors space-y-4">
          <div className="space-y-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-500">
              03 // Architectural Tenet
            </span>
            <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
              Deterministic ASTs over unverified model outputs
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              Constrain generative models with strict schemas and compiler sandboxes rather than executing raw text.
            </p>
          </div>

          {/* Interactive Micro-Demo: AST vs Raw Eval */}
          <div className="p-3 rounded-xl bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[var(--text-tertiary)]">Execution Safety:</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setP3Mode("ast")}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${p3Mode === "ast"
                      ? "bg-[var(--text-primary)] text-[var(--bg-canvas)]"
                      : "text-[var(--text-secondary)]"
                    }`}
                >
                  AST Validated
                </button>
                <button
                  onClick={() => setP3Mode("raw")}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${p3Mode === "raw"
                      ? "bg-[var(--text-primary)] text-[var(--bg-canvas)]"
                      : "text-[var(--text-secondary)]"
                    }`}
                >
                  Raw Eval
                </button>
              </div>
            </div>

            <div className="p-2 rounded-lg bg-[var(--surface-tile)] border border-[var(--border-subtle)] font-mono text-[11px] space-y-1">
              {p3Mode === "ast" ? (
                <div className="flex items-center gap-2 text-emerald-500">
                  <ShieldCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Schema bounded: 0 code injection risk</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-amber-500">
                  <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Unsafe: Arbitrary DOM & script execution</span>
                </div>
              )}
            </div>
          </div>

          {/* Foot: Case Study Reference */}
          <div className="pt-3 border-t border-[var(--border-subtle)] space-y-1 text-xs">
            <span className="text-[11px] text-[var(--text-tertiary)] block">
              Proof from case study:
            </span>
            <p className="text-[12px] text-[var(--text-secondary)]">
              AppForge compiles raw generative prompts into safe, deterministic React JSX syntax trees without eval().
            </p>
            <Link
              href="/work/appforge#decisions"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--text-primary)] hover:underline pt-1"
            >
              <span>Read in AppForge Engine</span>
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}