import { Cpu, Layers } from "lucide-react";

export function AboutCurrentFocus() {
  return (
    <section
      aria-labelledby="current-focus-heading"
      className="w-full space-y-4"
      style={{ contentVisibility: "auto", containIntrinsicSize: "auto 700px" }}
    >
      <div className="pb-2">
        <h2 id="current-focus-heading" className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          What I&apos;m learning now
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-tile)] space-y-2.5">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              Kafka
            </h3>
          </div>
          <p className="text-base text-[var(--text-secondary)] leading-relaxed font-normal">
            How partitions get assigned, what happens during a consumer group rebalance, and how to make producers idempotent.
          </p>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-tile)] space-y-2.5">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-700 dark:text-sky-300" aria-hidden="true" />
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              Kubernetes
            </h3>
          </div>
          <p className="text-base text-[var(--text-secondary)] leading-relaxed font-normal">
            Helm charts, health probes, and rolling deploys without downtime.
          </p>
        </div>
      </div>
    </section>
  );
}
