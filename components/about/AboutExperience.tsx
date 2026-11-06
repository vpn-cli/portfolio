import { Briefcase, CheckCircle2, ShieldCheck, Server } from "lucide-react";

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
    period: "May 2026 – Jul 2026",
    type: "AI floor-planning platform",
    highlights: [
      "Engineered responsive UI control panels in Next.js for architectural floorplan generation.",
      "Integrated secure subscription paywall and webhooks using Paytm Gateway.",
      "Automated CI/CD workflows with GitHub Actions and containerized Docker images deployed to AWS EC2.",
      "Eliminated N+1 query bottlenecks in Node.js backend pipelines, cutting database latency.",
    ],
    stack: ["Next.js", "Node.js", "Docker", "AWS EC2", "Paytm API", "PostgreSQL", "GitHub Actions"],
  },
  {
    company: "Unnati",
    role: "Frontend Engineering Intern",
    period: "Mar 2025 – May 2025",
    type: "SME onboarding platform",
    highlights: [
      "Architected admin management dashboard with modular data tables and filtering.",
      "Built a reusable, production-grade React design system adopted across internal portals.",
      "Audited and remediated UI components to guarantee full WCAG 2.1 AA accessibility compliance.",
    ],
    stack: ["React", "TypeScript", "Tailwind CSS", "WCAG 2.1 AA", "Design Systems"],
  },
];

export function AboutExperience() {
  return (
    <section aria-labelledby="experience-heading" className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[var(--border-subtle)] pb-4">
        <div>
          <h2 id="experience-heading" className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Production experience
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Industry engineering internships delivering cloud infrastructure and user-facing software.
          </p>
        </div>
        <span className="text-xs text-[var(--text-tertiary)] hidden sm:inline">
          Verified roles
        </span>
      </div>

      <div className="space-y-4">
        {experiences.map((exp) => (
          <article
            key={exp.company}
            className="p-6 sm:p-7 rounded-2xl bg-[var(--surface-tile)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] transition-all space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4 border-b border-[var(--border-subtle)] pb-3">
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
              <time className="text-xs sm:text-sm text-[var(--text-tertiary)] tabular-nums font-mono shrink-0">
                {exp.period}
              </time>
            </div>

            <ul className="space-y-2 text-xs sm:text-sm text-[var(--text-secondary)]">
              {exp.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-1 shrink-0" aria-hidden="true" />
                  <span className="leading-relaxed font-normal">{h}</span>
                </li>
              ))}
            </ul>

            <div className="pt-2 flex items-center gap-1.5 flex-wrap">
              {exp.stack.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-0.5 rounded-md text-[11px] font-mono bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)]"
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