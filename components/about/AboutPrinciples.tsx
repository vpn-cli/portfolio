"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { TransitionLink } from "@/components/motion/RouteTransition";

export function AboutPrinciples() {
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
      <div className="border-b border-[var(--border-subtle)] pb-4">
        <h2 id="how-i-work-heading" className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          How I work
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
          Three rules I follow, each from a project.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <article className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-tile)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] flex flex-col justify-between transition-colors space-y-4">
          <div className="space-y-2">
            <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
              Use memory before adding infrastructure
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              If one process can hold the state, I keep it there before reaching for Redis or a broker.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[var(--text-tertiary)]">Storage</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setP1Mode("memory")}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    p1Mode === "memory"
                      ? "bg-[var(--text-primary)] text-[var(--bg-canvas)]"
                      : "text-[var(--text-secondary)]"
                  }`}
                >
                  In memory
                </button>
                <button
                  onClick={() => setP1Mode("redis")}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    p1Mode === "redis"
                      ? "bg-[var(--text-primary)] text-[var(--bg-canvas)]"
                      : "text-[var(--text-secondary)]"
                  }`}
                >
                  Redis
                </button>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-[var(--surface-tile)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] min-h-[52px] flex items-center">
              {p1Mode === "memory"
                ? "Rooms live in a Map in the Node process. No network call per broadcast."
                : "Every room lookup becomes a network round trip to Redis."}
            </div>
          </div>

          <div className="pt-3 border-t border-[var(--border-subtle)] space-y-1 text-xs">
            <p className="text-[12px] text-[var(--text-secondary)]">
              Sportz keeps every room in a Node.js Map, with no Redis.
            </p>
            <TransitionLink
              href="/work/sockets#decisions"
              trackLocation="about_principles"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--text-primary)] hover:underline pt-1"
            >
              <span>Sportz case study</span>
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </TransitionLink>
          </div>
        </article>

        <article className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-tile)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] flex flex-col justify-between transition-colors space-y-4">
          <div className="space-y-2">
            <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
              Send events through a log
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              Services talk through a durable log, so one slow service doesn&apos;t stall the others.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[var(--text-tertiary)]">Outbox steps</span>
              <span className="text-[11px] text-emerald-500 font-semibold">
                Step {p2Step + 1} of 4
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1">
              {p2Steps.map((step, idx) => (
                <button
                  key={idx}
                  onClick={() => setP2Step(idx)}
                  className={`py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                    p2Step === idx
                      ? "bg-emerald-500 text-black shadow-xs"
                      : "bg-[var(--surface-tile)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {step.label}
                </button>
              ))}
            </div>

            <p className="text-xs text-[var(--text-primary)] min-h-[36px] pt-1 leading-snug">
              {p2Steps[p2Step].desc}
            </p>
          </div>

          <div className="pt-3 border-t border-[var(--border-subtle)] space-y-1 text-xs">
            <p className="text-[12px] text-[var(--text-secondary)]">
              StreamMart uses a transactional outbox so Kafka gets every order event at least once.
            </p>
            <TransitionLink
              href="/work/stream-mart#decisions"
              trackLocation="about_principles"
              trackLabel="StreamMart case study"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--text-primary)] hover:underline pt-1"
            >
              <span>StreamMart case study</span>
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </TransitionLink>
          </div>
        </article>

        <article className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-tile)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] flex flex-col justify-between transition-colors space-y-4">
          <div className="space-y-2">
            <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
              Check model output before running it
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              Generated code goes through a schema and an AST check first. Nothing gets executed as raw text.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[var(--text-tertiary)]">Execution safety</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setP3Mode("ast")}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    p3Mode === "ast"
                      ? "bg-[var(--text-primary)] text-[var(--bg-canvas)]"
                      : "text-[var(--text-secondary)]"
                  }`}
                >
                  With AST check
                </button>
                <button
                  onClick={() => setP3Mode("raw")}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    p3Mode === "raw"
                      ? "bg-[var(--text-primary)] text-[var(--bg-canvas)]"
                      : "text-[var(--text-secondary)]"
                  }`}
                >
                  Raw eval
                </button>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-[var(--surface-tile)] border border-[var(--border-subtle)] text-xs min-h-[52px] flex items-center">
              {p3Mode === "ast" ? (
                <span className="text-emerald-500 font-medium">
                  Checked against the schema, nothing executes directly
                </span>
              ) : (
                <span className="text-amber-500 font-medium">
                  Runs whatever the model wrote, including scripts
                </span>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-[var(--border-subtle)] space-y-1 text-xs">
            <p className="text-[12px] text-[var(--text-secondary)]">
              AppForge builds React components from model output without eval().
            </p>
            <TransitionLink
              href="/work/appforge#decisions"
              trackLocation="about_principles"
              trackLabel="AppForge case study"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--text-primary)] hover:underline pt-1"
            >
              <span>AppForge case study</span>
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </TransitionLink>
          </div>
        </article>
      </div>
    </section>
  );
}
