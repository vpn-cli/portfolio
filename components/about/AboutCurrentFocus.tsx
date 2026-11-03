import { BookOpen } from "lucide-react";

export function AboutCurrentFocus() {
  return (
    <section aria-labelledby="current-focus-heading" className="w-full space-y-4">
      <div className="flex items-baseline justify-between border-b border-[var(--border-subtle)] pb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-500" aria-hidden="true" />
          <h2 id="current-focus-heading" className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Right now
          </h2>
        </div>
        <span className="text-xs text-[var(--text-tertiary)]">
          Active study
        </span>
      </div>

      <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-tile)] border border-[var(--border-subtle)]">
        <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
          Deepening hands-on practice with <strong className="font-semibold text-[var(--text-primary)]">Apache Kafka</strong> event streaming partitions and <strong className="font-semibold text-[var(--text-primary)]">Kubernetes</strong> cluster orchestration for resilient backend microservices.
        </p>
      </div>
    </section>
  );
}
