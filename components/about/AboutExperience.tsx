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
    <section aria-labelledby="experience-heading" className="w-full space-y-8">
      <div className="pb-2 border-b border-[var(--border-subtle)]">
        <h2 id="experience-heading" className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          Experience
        </h2>
      </div>

      <div className="divide-y divide-[var(--border-subtle)]">
        {experiences.map((exp) => (
          <article
            key={exp.company}
            className="py-8 first:pt-0 last:pb-0 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start"
          >
            {/* Left Column: Sticky on desktop with role, company, type, dates */}
            <div className="md:col-span-5 md:sticky md:top-24 space-y-1.5">
              <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] leading-snug">
                {exp.role}
              </h3>
              <div className="text-base font-medium text-[var(--text-secondary)]">
                {exp.company}
                <span className="text-sm text-[var(--text-tertiary)] block sm:inline sm:ml-1.5 font-normal">
                  ({exp.type})
                </span>
              </div>
              <time className="text-sm text-[var(--text-tertiary)] tabular-nums block font-normal pt-0.5">
                {exp.period}
              </time>
            </div>

            {/* Right Column: Bullets + plain muted stack text */}
            <div className="md:col-span-7 space-y-4">
              <ul className="space-y-2.5 text-base text-[var(--text-secondary)]">
                {exp.highlights.map((h, i) => (
                  <li key={i} className="leading-relaxed font-normal flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-tertiary)] shrink-0 mt-2.5" aria-hidden="true" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-2 text-sm text-[var(--text-tertiary)] font-normal leading-relaxed">
                <span className="text-[var(--text-secondary)] font-medium">Stack: </span>
                {exp.stack.join(" · ")}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
