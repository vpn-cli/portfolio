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
      <div className="pb-2 border-b border-[var(--border-subtle)]">
        <h2 id="experience-heading" className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          Experience
        </h2>
      </div>

      <div className="divide-y divide-[var(--border-subtle)]">
        {experiences.map((exp) => (
          <article
            key={exp.company}
            className="py-6 sm:py-8 first:pt-0 last:pb-0 flex flex-col md:flex-row gap-2 md:gap-8 items-start"
          >
            {/* Narrow left column (~9rem) with dates in muted text; on mobile sits above role */}
            <div className="w-full md:w-[9rem] shrink-0">
              <time className="text-sm sm:text-base text-[var(--text-tertiary)] tabular-nums block font-normal">
                {exp.period}
              </time>
            </div>

            {/* Main column: Role, Company on first line, description muted below, bullets, stack */}
            <div className="flex-1 space-y-3 min-w-0">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-[var(--text-primary)] leading-snug">
                  {exp.role}, {exp.company}
                </h3>
                <p className="text-sm sm:text-base text-[var(--text-tertiary)] font-normal mt-0.5">
                  {exp.type}
                </p>
              </div>

              <ul className="space-y-2 text-base text-[var(--text-secondary)]">
                {exp.highlights.map((h, i) => (
                  <li key={i} className="leading-relaxed font-normal flex items-start gap-3">
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-[var(--text-primary)] shrink-0 mt-2.5"
                      aria-hidden="true"
                    />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-1 text-sm sm:text-base text-[var(--text-tertiary)] font-normal leading-relaxed">
                {exp.stack.join(", ")}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
