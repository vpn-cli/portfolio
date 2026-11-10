export function AboutCurrentFocus() {
  return (
    <section
      aria-labelledby="current-focus-heading"
      className="w-full space-y-4"
      style={{ contentVisibility: "auto", containIntrinsicSize: "auto 700px" }}
    >
      <div className="pb-2 border-b border-[var(--border-subtle)]">
        <h2 id="current-focus-heading" className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          What I&apos;m learning now
        </h2>
      </div>

      {/* Short two-item text block, NO cards, NO icons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 pt-1">
        <div className="space-y-1.5">
          <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
            Kafka
          </h3>
          <p className="text-base text-[var(--text-secondary)] leading-relaxed font-normal">
            How partitions get assigned, what happens during a consumer group rebalance, and how to make producers idempotent.
          </p>
        </div>

        <div className="space-y-1.5">
          <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
            Kubernetes
          </h3>
          <p className="text-base text-[var(--text-secondary)] leading-relaxed font-normal">
            Helm charts, health probes, and rolling deploys without downtime.
          </p>
        </div>
      </div>
    </section>
  );
}
