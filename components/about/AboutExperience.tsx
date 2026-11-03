interface ExperienceEntry {
  company: string;
  role: string;
  period: string;
  type: string;
  summary: string;
}

const experiences: ExperienceEntry[] = [
  {
    company: "Clairvyn AI",
    role: "Full-Stack Developer Intern",
    period: "May 2026 – Jul 2026",
    type: "AI floor-planning platform",
    summary:
      "Built Next.js UI panels, a Paytm subscription paywall, GitHub Actions and Docker deploys to AWS EC2, and resolved N+1 queries in Node.js pipelines.",
  },
  {
    company: "Unnati",
    role: "Frontend Engineering Intern",
    period: "Mar 2025 – May 2025",
    type: "SME onboarding platform",
    summary:
      "Built an admin dashboard, a reusable React design system, and accessible (WCAG 2.1) components.",
  },
];

export function AboutExperience() {
  return (
    <section aria-labelledby="experience-heading" className="w-full space-y-6">
      <div className="flex items-baseline justify-between border-b border-[var(--border-subtle)] pb-4">
        <h2 id="experience-heading" className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          Experience
        </h2>
        <span className="text-xs text-[var(--text-tertiary)]">
          Production roles
        </span>
      </div>

      <div className="space-y-4">
        {experiences.map((exp) => (
          <article
            key={exp.company}
            className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-tile)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4 mb-2">
              <div className="flex items-baseline gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
                  {exp.role}
                </h3>
                <span className="text-sm font-semibold text-[var(--text-secondary)]">
                  · {exp.company}
                </span>
                <span className="text-xs text-[var(--text-tertiary)]">
                  ({exp.type})
                </span>
              </div>
              <time className="text-xs sm:text-sm text-[var(--text-tertiary)] tabular-nums shrink-0">
                {exp.period}
              </time>
            </div>

            <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-normal">
              {exp.summary}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
