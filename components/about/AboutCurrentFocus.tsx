import { Cpu, Layers } from "lucide-react";

export function AboutCurrentFocus() {
  return (
    <section
      aria-labelledby="current-focus-heading"
      className="w-full space-y-4"
      style={{ contentVisibility: "auto", containIntrinsicSize: "auto 700px" }}
    >
      <div className="border-b border-[var(--border-subtle)] pb-4">
        <h2 id="current-focus-heading" className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          What I&apos;m learning now
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-tile)] border border-[var(--border-subtle)] space-y-2.5">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-500" aria-hidden="true" />
            <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
              Kafka
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-normal">
            How partitions get assigned, what happens during a consumer group rebalance, and how to make producers idempotent.
          </p>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-tile)] border border-[var(--border-subtle)] space-y-2.5">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-400" aria-hidden="true" />
            <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
              Kubernetes
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-normal">
            Helm charts, health probes, and rolling deploys without downtime.
          </p>
        </div>
      </div>
    </section>
  );
}
