interface ExperienceEntry {
  company: string;
  role: string;
  period: string;
  type: string;
  highlights: string[];
  stack: string[];
}

const experiences: ExperienceEntry[] = [
  {
    company: "Clairvyn AI",
    role: "Full-Stack Developer Intern",
    period: "May 2026 to Jul 2026",
    type: "AI floor-planning platform",
    highlights: [
      "Built the Next.js control panels people use to generate floor plans.",
      "Added paid subscriptions through the Paytm gateway, including webhook handling.",
      "Set up GitHub Actions to build Docker images and deploy them to AWS EC2.",
      "Fixed N+1 queries in the Node.js backend that were slowing down database calls.",
    ],
    stack: ["Next.js", "Node.js", "Docker", "AWS EC2", "Paytm API", "PostgreSQL", "GitHub Actions"],
  },
  {
    company: "Unnati",
    role: "Frontend Engineering Intern",
    period: "Mar 2025 to May 2025",
    type: "SME onboarding platform",
    highlights: [
      "Built the admin dashboard, with data tables and filters.",
      "Built a React component library that other internal tools now use.",
      "Audited components against WCAG 2.1 AA and fixed the issues I found.",
    ],
    stack: ["React", "TypeScript", "Tailwind CSS", "WCAG 2.1 AA", "Design Systems"],
  },
];

export function AboutExperience() {
  return (
    <section aria-labelledby="experience-heading" className="w-full space-y-6">
      <div className="pb-2">
        <h2 id="experience-heading" className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          Experience
        </h2>
      </div>

      <div className="space-y-4">
        {experiences.map((exp) => (
          <article
            key={exp.company}
            className="p-6 sm:p-7 rounded-2xl bg-[var(--surface-tile)] hover:bg-[var(--surface-tile-elevated)] transition-colors duration-150 space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4 pb-1">
              <div className="flex items-baseline gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
                  {exp.role}
                </h3>
                <span className="text-sm sm:text-base font-semibold text-[var(--text-secondary)]">
                  · {exp.company}
                </span>
                <span className="text-sm text-[var(--text-tertiary)]">
                  ({exp.type})
                </span>
              </div>
              <time className="text-sm text-[var(--text-tertiary)] tabular-nums shrink-0">
                {exp.period}
              </time>
            </div>

            <ul className="space-y-2 text-base text-[var(--text-secondary)]">
              {exp.highlights.map((h, i) => (
                <li key={i} className="leading-relaxed font-normal">
                  {h}
                </li>
              ))}
            </ul>

            <div className="pt-2 flex items-center gap-1.5 flex-wrap">
              {exp.stack.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-0.5 rounded-md text-sm bg-[var(--surface-tile-elevated)] text-[var(--text-secondary)]"
                >
                  {t}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
