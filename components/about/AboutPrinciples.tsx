"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { TransitionLink } from "@/components/motion/RouteTransition";

type PrincipleId = "memory" | "log" | "safety";

interface PrincipleTab {
  id: PrincipleId;
  label: string;
}

const PRINCIPLE_TABS: PrincipleTab[] = [
  { id: "memory", label: "Use memory before adding infrastructure" },
  { id: "log", label: "Send events through a log" },
  { id: "safety", label: "Check model output before running it" },
];

interface SegmentedOption<T extends string | number> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string | number> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
}

function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  ariaLabel,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="inline-flex items-center p-1 rounded-xl bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)]"
    >
      {options.map((opt) => {
        const isActive = value === opt.value;
        return (
          <button
            key={String(opt.value)}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(opt.value)}
            className={`h-8 sm:h-9 px-3.5 sm:px-4 rounded-lg text-xs sm:text-sm font-semibold leading-none whitespace-nowrap transition-all cursor-pointer flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] ${
              isActive
                ? "bg-[var(--accent-color)] text-[var(--accent-contrast)] shadow-sm"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function AboutPrinciples() {
  const [activeTab, setActiveTab] = useState<PrincipleId>("memory");
  const [p1Mode, setP1Mode] = useState<"memory" | "redis">("memory");
  const [p2Step, setP2Step] = useState<number>(1);
  const [p3Mode, setP3Mode] = useState<"ast" | "raw">("ast");

  const p2Steps = [
    { label: "1", desc: "Order and outbox event written in one atomic Postgres transaction" },
    { label: "2", desc: "Event persisted to outbox table with status PENDING" },
    { label: "3", desc: "Debezium streams WAL event to topic orders.events (partition 2)" },
    { label: "4", desc: "Payment worker consumes event, marks outbox COMPLETED" },
  ];

  return (
    <section
      aria-labelledby="how-i-work-heading"
      className="w-full space-y-6"
      style={{ contentVisibility: "auto", containIntrinsicSize: "auto 700px" }}
    >
      <div className="pb-2 border-b border-[var(--border-subtle)]">
        <h2 id="how-i-work-heading" className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          How I work
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mt-1 font-normal">
          Three principles I build by, each demonstrated from a project.
        </p>
      </div>

      {/* Tabs navigation */}
      <div
        role="tablist"
        aria-label="Engineering principles"
        className="flex flex-wrap sm:flex-nowrap gap-2 p-1.5 rounded-2xl bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)]"
      >
        {PRINCIPLE_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[200px] text-left px-4 py-3 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] ${
                isActive
                  ? "bg-[var(--surface-tile)] text-[var(--text-primary)] font-semibold shadow-sm border border-[var(--border-subtle)] border-l-4 border-l-[var(--accent-color)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-tile)]/50"
              }`}
            >
              <span className="block truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Single spacious panel for the selected principle */}
      <div
        role="tabpanel"
        className="rounded-2xl sm:rounded-3xl bg-[var(--surface-tile)] border border-[var(--border-subtle)] p-6 sm:p-8 lg:p-10 space-y-8"
      >
        {activeTab === "memory" && (
          <article className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
                Use memory before adding infrastructure
              </h3>
              <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-[68ch]">
                If one process can hold the state, I keep it there before reaching for Redis or a broker. In-process data structures eliminate network round-trips and serialization costs.
              </p>
            </div>

            {/* Expanded Interactive Demo */}
            <div data-ui="demo-memory" className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs sm:text-sm font-semibold text-[var(--text-primary)]">
                  Storage architecture comparison
                </span>
                <SegmentedControl
                  ariaLabel="Storage mode"
                  options={[
                    { value: "memory", label: "In memory (Node.js Map)" },
                    { value: "redis", label: "External Redis" },
                  ]}
                  value={p1Mode}
                  onChange={setP1Mode}
                />
              </div>

              <div className="p-4 sm:p-5 rounded-xl bg-[var(--surface-tile)] border border-[var(--border-subtle)] text-sm sm:text-base text-[var(--text-secondary)] min-h-[96px] flex flex-col justify-center gap-1.5">
                <p className="font-medium text-[var(--text-primary)]">
                  {p1Mode === "memory"
                    ? "Direct memory access: ~0.15ms latency"
                    : "Network hop to cache: ~1.2ms latency"}
                </p>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  {p1Mode === "memory"
                    ? "Rooms live in a Map<string, Set<Client>> inside the Node.js process. Broadcasting to a room requires zero TCP sockets or serialization."
                    : "Every room lookup and client dispatch becomes a network round trip across Redis PUB/SUB with JSON serialization overhead."}
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[var(--border-subtle)]">
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-normal">
                Sportz keeps every room in a Node.js Map, with no Redis.
              </p>
              <TransitionLink
                href="/work/sockets#decisions"
                trackLocation="about_principles"
                trackLabel="Sportz case study"
                className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--accent-text)] hover:underline visited:text-[var(--accent-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] rounded shrink-0"
              >
                <span>Read Sportz case study</span>
                <ArrowUpRight className="w-4 h-4 text-[var(--accent-text)]" aria-hidden="true" />
              </TransitionLink>
            </div>
          </article>
        )}

        {activeTab === "log" && (
          <article className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
                Send events through a log
              </h3>
              <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-[68ch]">
                Services talk through a durable log, so one slow service doesn&apos;t stall the others. The transactional outbox pattern guarantees that database writes and message broker publishes never drift out of sync.
              </p>
            </div>

            {/* Expanded Interactive Demo */}
            <div data-ui="demo-outbox" className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs sm:text-sm font-semibold text-[var(--text-primary)]">
                  Outbox lifecycle progression
                </span>
                <span className="text-xs sm:text-sm text-[var(--text-tertiary)] font-medium">
                  Step {p2Step + 1} of 4
                </span>
              </div>

              <div>
                <SegmentedControl
                  ariaLabel="Outbox step"
                  options={p2Steps.map((step, idx) => ({ value: idx, label: `Step ${step.label}` }))}
                  value={p2Step}
                  onChange={setP2Step}
                />
              </div>

              <div className="p-4 sm:p-5 rounded-xl bg-[var(--surface-tile)] border border-[var(--border-subtle)] text-sm sm:text-base text-[var(--text-secondary)] min-h-[96px] flex flex-col justify-center gap-1.5">
                <span className="text-xs font-mono text-[var(--text-tertiary)] uppercase tracking-wider">
                  Stage {p2Step + 1}:
                </span>
                <p className="font-medium text-[var(--text-primary)]">
                  {p2Steps[p2Step].desc}
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[var(--border-subtle)]">
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-normal">
                StreamMart uses a transactional outbox so Kafka gets every order event at least once.
              </p>
              <TransitionLink
                href="/work/stream-mart#decisions"
                trackLocation="about_principles"
                trackLabel="StreamMart case study"
                className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--accent-text)] hover:underline visited:text-[var(--accent-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] rounded shrink-0"
              >
                <span>Read StreamMart case study</span>
                <ArrowUpRight className="w-4 h-4 text-[var(--accent-text)]" aria-hidden="true" />
              </TransitionLink>
            </div>
          </article>
        )}

        {activeTab === "safety" && (
          <article className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
                Check model output before running it
              </h3>
              <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-[68ch]">
                Generated code goes through a schema and an AST check first. Nothing gets executed as raw text, and dangerous evaluation routines like eval() or new Function() are blocked entirely.
              </p>
            </div>

            {/* Expanded Interactive Demo */}
            <div data-ui="demo-ast" className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs sm:text-sm font-semibold text-[var(--text-primary)]">
                  Execution safety validation
                </span>
                <SegmentedControl
                  ariaLabel="Execution safety mode"
                  options={[
                    { value: "ast", label: "With AST check" },
                    { value: "raw", label: "Raw eval (unfiltered)" },
                  ]}
                  value={p3Mode}
                  onChange={setP3Mode}
                />
              </div>

              <div className="p-4 sm:p-5 rounded-xl bg-[var(--surface-tile)] border border-[var(--border-subtle)] text-sm sm:text-base min-h-[96px] flex flex-col justify-center gap-1.5">
                <p className="font-medium text-[var(--text-primary)]">
                  {p3Mode === "ast" ? "Deterministic compiler pipeline" : "Unsafe text execution"}
                </p>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  {p3Mode === "ast"
                    ? "Checked against the JSON schema, parsed into a Babel AST, and compiled into safe React JSX nodes. Zero direct string evaluation."
                    : "Executes whatever arbitrary JavaScript strings the model generated, creating severe security vulnerabilities and runtime failures."}
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[var(--border-subtle)]">
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-normal">
                AppForge builds React components from model output without eval().
              </p>
              <TransitionLink
                href="/work/appforge#decisions"
                trackLocation="about_principles"
                trackLabel="AppForge case study"
                className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--accent-text)] hover:underline visited:text-[var(--accent-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] rounded shrink-0"
              >
                <span>Read AppForge case study</span>
                <ArrowUpRight className="w-4 h-4 text-[var(--accent-text)]" aria-hidden="true" />
              </TransitionLink>
            </div>
          </article>
        )}
      </div>
    </section>
  );
}
