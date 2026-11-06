import { Cpu, Terminal, Layers } from "lucide-react";

export function AboutCurrentFocus() {
  return (
    <section aria-labelledby="current-focus-heading" className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[var(--border-subtle)] pb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
          <h2 id="current-focus-heading" className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Active technical focus
          </h2>
        </div>
        <span className="text-xs text-[var(--text-tertiary)] hidden sm:inline font-mono">
          Spring 2026 Focus Area
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-tile)] border border-[var(--border-subtle)] space-y-2.5">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-500" aria-hidden="true" />
            <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
              Apache Kafka & Distributed Streaming
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-normal">
            Mastering partition distribution strategies, transactional outbox producers with idempotent keys, consumer group rebalancing guarantees, and stream processing fault tolerance.
          </p>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-tile)] border border-[var(--border-subtle)] space-y-2.5">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-400" aria-hidden="true" />
            <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
              Kubernetes & Cloud Infrastructure
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-normal">
            Orchestrating microservice topologies, declarative Helm charts, health probes, zero-downtime rolling deploys, and container sandboxing for production distributed systems.
          </p>
        </div>
      </div>
    </section>
  );
}