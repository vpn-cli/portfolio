"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { TransitionLink } from "@/components/motion/RouteTransition";

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
      className="inline-flex items-center p-0.5 rounded-lg bg-[var(--surface-tile)] border border-[var(--border-subtle)]"
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
            className={`h-7 px-2.5 rounded-md text-sm font-medium leading-none whitespace-nowrap transition-colors cursor-pointer flex items-center justify-center ${
              isActive
                ? "bg-[var(--text-primary)] text-[var(--bg-canvas)] font-semibold"
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
      <div className="pb-2">
        <h2 id="how-i-work-heading" className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          How I work
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Three rules I follow, each from a project.
        </p>
      </div>

      <div className="rounded-2xl bg-[var(--surface-tile)] p-5 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-[auto_auto_auto_auto] gap-8 lg:gap-x-8 lg:gap-y-5">
          {/* Column 1 */}
          <article className="flex flex-col gap-4 lg:grid lg:row-span-4 lg:grid-rows-subgrid lg:gap-4">
            {/* (a) Title */}
            <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
              Use memory before adding infrastructure
            </h3>

            {/* (b) Description */}
            <p className="text-base text-[var(--text-secondary)] leading-relaxed font-normal">
              If one process can hold the state, I keep it there before reaching for Redis or a broker.
            </p>

            {/* (c) Demo box */}
            <div data-ui="demo-memory" className="p-3.5 rounded-xl bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-[var(--text-tertiary)]">Storage</span>
              </div>

              <div>
                <SegmentedControl
                  ariaLabel="Storage mode"
                  options={[
                    { value: "memory", label: "In memory" },
                    { value: "redis", label: "Redis" },
                  ]}
                  value={p1Mode}
                  onChange={setP1Mode}
                />
              </div>

              <div className="p-3 rounded-lg bg-[var(--surface-tile)] border border-[var(--border-subtle)] text-sm text-[var(--text-secondary)] min-h-[82px] flex items-center">
                {p1Mode === "memory"
                  ? "Rooms live in a Map in the Node process. No network call per broadcast."
                  : "Every room lookup becomes a network round trip to Redis."}
              </div>
            </div>

            {/* (d) Footer */}
            <div className="pt-2 flex flex-col justify-between gap-1 text-sm h-full">
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed min-h-[40px]">
                Sportz keeps every room in a Node.js Map, with no Redis.
              </p>
              <TransitionLink
                href="/work/sockets#decisions"
                trackLocation="about_principles"
                trackLabel="Sportz case study"
                className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--text-primary)] hover:underline pt-1 w-fit"
              >
                <span>Sportz case study</span>
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </TransitionLink>
            </div>
          </article>

          {/* Column 2 */}
          <article className="flex flex-col gap-4 lg:grid lg:row-span-4 lg:grid-rows-subgrid lg:gap-4">
            {/* (a) Title */}
            <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
              Send events through a log
            </h3>

            {/* (b) Description */}
            <p className="text-base text-[var(--text-secondary)] leading-relaxed font-normal">
              Services talk through a durable log, so one slow service doesn&apos;t stall the others.
            </p>

            {/* (c) Demo box */}
            <div data-ui="demo-outbox" className="p-3.5 rounded-xl bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-[var(--text-tertiary)]">Outbox steps</span>
                <span className="text-sm text-[var(--text-tertiary)] font-medium">
                  Step {p2Step + 1} of 4
                </span>
              </div>

              <div>
                <SegmentedControl
                  ariaLabel="Outbox step"
                  options={p2Steps.map((step, idx) => ({ value: idx, label: step.label }))}
                  value={p2Step}
                  onChange={setP2Step}
                />
              </div>

              <div className="p-3 rounded-lg bg-[var(--surface-tile)] border border-[var(--border-subtle)] text-sm text-[var(--text-secondary)] min-h-[82px] flex items-center">
                {p2Steps[p2Step].desc}
              </div>
            </div>

            {/* (d) Footer */}
            <div className="pt-2 flex flex-col justify-between gap-1 text-sm h-full">
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed min-h-[40px]">
                StreamMart uses a transactional outbox so Kafka gets every order event at least once.
              </p>
              <TransitionLink
                href="/work/stream-mart#decisions"
                trackLocation="about_principles"
                trackLabel="StreamMart case study"
                className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--text-primary)] hover:underline pt-1 w-fit"
              >
                <span>StreamMart case study</span>
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </TransitionLink>
            </div>
          </article>

          {/* Column 3 */}
          <article className="flex flex-col gap-4 lg:grid lg:row-span-4 lg:grid-rows-subgrid lg:gap-4">
            {/* (a) Title */}
            <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
              Check model output before running it
            </h3>

            {/* (b) Description */}
            <p className="text-base text-[var(--text-secondary)] leading-relaxed font-normal">
              Generated code goes through a schema and an AST check first. Nothing gets executed as raw text.
            </p>

            {/* (c) Demo box */}
            <div data-ui="demo-ast" className="p-3.5 rounded-xl bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-[var(--text-tertiary)]">Execution safety</span>
              </div>

              <div>
                <SegmentedControl
                  ariaLabel="Execution safety mode"
                  options={[
                    { value: "ast", label: "With AST check" },
                    { value: "raw", label: "Raw eval" },
                  ]}
                  value={p3Mode}
                  onChange={setP3Mode}
                />
              </div>

              <div className="p-3 rounded-lg bg-[var(--surface-tile)] border border-[var(--border-subtle)] text-sm min-h-[82px] flex items-center">
                {p3Mode === "ast" ? (
                  <span className="text-[var(--text-secondary)]">
                    Checked against the schema, nothing executes directly
                  </span>
                ) : (
                  <span className="text-amber-800 dark:text-amber-300 font-medium">
                    Runs whatever the model wrote, including scripts
                  </span>
                )}
              </div>
            </div>

            {/* (d) Footer */}
            <div className="pt-2 flex flex-col justify-between gap-1 text-sm h-full">
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed min-h-[40px]">
                AppForge builds React components from model output without eval().
              </p>
              <TransitionLink
                href="/work/appforge#decisions"
                trackLocation="about_principles"
                trackLabel="AppForge case study"
                className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--text-primary)] hover:underline pt-1 w-fit"
              >
                <span>AppForge case study</span>
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </TransitionLink>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
