"use client";

import { useState } from "react";
import { siteConfig } from "@/content/site";
import { TransitionLink } from "@/components/motion/RouteTransition";
import { X, ArrowUpRight, Check, Code2, Sparkles, MapPin } from "lucide-react";

function CopyEmailButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.email);
    } catch {
      const el = document.createElement("textarea");
      el.value = siteConfig.email;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  return (
    <button
      onClick={handleCopy}
      type="button"
      disabled={copied}
      className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-[var(--surface-tile-hover)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] text-[var(--text-primary)] transition-colors duration-200 group active:scale-98 cursor-pointer disabled:opacity-75 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-white/40"
    >
      <span className="text-sm font-medium">
        {copied ? "Copied to clipboard!" : "Copy email"}
      </span>
      {copied ? (
        <Check className="w-4 h-4 text-emerald-500" aria-hidden="true" />
      ) : (
        <ArrowUpRight className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-transform motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5 motion-reduce:transform-none" aria-hidden="true" />
      )}
    </button>
  );
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] p-3 sm:p-4 lg:p-6 flex flex-col items-center">
      {/* Main Bento Shell matching Master Framer Spec */}
      <div className="w-full max-w-[1480px] min-h-[calc(100vh-48px)] rounded-[32px] sm:rounded-[36px] bg-[var(--bg-canvas-subtle)] border border-[var(--border-subtle)] p-6 sm:p-10 lg:p-14 shadow-md flex flex-col items-center">
        {/* Top Floating Close Pill */}
        <div className="w-full flex justify-center mb-8 sm:mb-12">
          <TransitionLink
            href="/"
            className="w-10 h-10 rounded-full bg-[var(--surface-tile)] hover:bg-[var(--surface-tile-hover)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] flex items-center justify-center transition-colors text-[var(--text-primary)] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-white/40 active:scale-95"
            title="Back to home"
            aria-label="Back to home"
          >
            <X className="w-5 h-5 opacity-80" aria-hidden="true" />
          </TransitionLink>
        </div>

        {/* Inner Content Column */}
        <div className="w-full max-w-5xl lg:max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* ================= LEFT COLUMN (Story & Experience) ================= */}
          <div className="lg:col-span-7 space-y-8">
            {/* Story Card */}
            <header className="rounded-[28px] bento-surface p-6 sm:p-8 space-y-6">
              <h1 className="type-h2 font-display font-medium text-[var(--text-primary)] tracking-tight">
                What I’m about?
              </h1>

              <div>
                <span className="type-label2 text-[var(--text-tertiary)] block mb-2 font-semibold">
                  My story
                </span>
                <p className="type-body4 text-[var(--text-secondary)] font-light leading-relaxed">
                  I was born and raised in India. Ever since I wrote my first line of code, I have had a relentless passion for software engineering and system architecture. I was captivated by the synergy between computational algorithms and creative design, which inspired me to dive deep into full-stack web development and high-performance interactive interfaces.
                </p>
              </div>

              <div>
                <span className="type-label2 text-[var(--text-tertiary)] block mb-2 font-semibold">
                  What I do now
                </span>
                <p className="type-body4 text-[var(--text-secondary)] font-light leading-relaxed">
                  Today I’m engineering scalable cloud platforms, distributed API backends, and fluid Next.js frontend applications designed to handle high concurrency with zero latency.
                </p>
              </div>
            </header>

            {/* Experience Table Card */}
            <section className="rounded-[28px] bento-surface p-6 sm:p-8">
              <span className="type-label2 text-[var(--text-tertiary)] block mb-4 font-semibold">
                Experience
              </span>

              <div className="divide-y divide-[var(--border-subtle)]">
                {siteConfig.experience.map((exp, idx) => (
                  <div key={idx} className="py-4 flex items-center justify-between text-sm">
                    <div>
                      <h4 className="font-semibold text-[var(--text-primary)]">{exp.role}</h4>
                      <p className="text-xs text-[var(--text-tertiary)]">{exp.company}</p>
                    </div>
                    <span className="text-xs font-mono text-[var(--text-secondary)] px-2.5 py-1 rounded bg-[var(--surface-tile-hover)] border border-[var(--border-subtle)]">
                      {exp.period}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* ================= RIGHT COLUMN (Services, Stack, Photo, Contact) ================= */}
          <div className="lg:col-span-5 space-y-6">
            {/* What I Do Best Card */}
            <div className="rounded-[28px] bento-surface p-6 sm:p-8">
              <span className="type-label2 text-[var(--text-tertiary)] block mb-2 font-semibold">
                What I do best
              </span>
              <h3 className="type-h3 font-display font-medium text-[var(--text-primary)] mb-2">
                Full-Stack Engineering
              </h3>
              <p className="type-body4 text-[var(--text-secondary)] font-light leading-relaxed mb-4">
                Providing innovative architecture, performant databases, and impactful digital solutions to ensure a superior user experience.
              </p>
              <div className="flex items-center gap-1.5" aria-hidden="true">
                <span className="w-2 h-2 rounded-full bg-[var(--text-primary)]" />
                <span className="w-2 h-2 rounded-full bg-[var(--text-tertiary)] opacity-40" />
                <span className="w-2 h-2 rounded-full bg-[var(--text-tertiary)] opacity-40" />
              </div>
            </div>

            {/* Stack I use */}
            <div className="rounded-[28px] bento-surface p-6">
              <span className="type-label2 text-[var(--text-tertiary)] block mb-3 font-semibold">
                Stack I use
              </span>
              <div className="flex flex-wrap gap-2">
                {siteConfig.techStack.slice(0, 6).map((tech) => (
                  <div
                    key={tech.name}
                    className="px-3 py-1.5 rounded-xl bg-[var(--surface-tile-hover)] border border-[var(--border-subtle)] text-xs font-medium text-[var(--text-secondary)] flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--text-primary)]" aria-hidden="true" />
                    <span>{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Photo Preview Card */}
            <div className="rounded-[28px] bento-surface p-3 overflow-hidden">
              <div className="w-full aspect-[16/11] rounded-[22px] bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] flex flex-col justify-end p-5 relative overflow-hidden">
                <div className="relative z-10">
                  <span className="text-[11px] text-[var(--text-tertiary)] block">Outside the terminal</span>
                  <span className="text-sm font-semibold text-[var(--text-primary)]">Exploring, cycling & open source</span>
                </div>
              </div>
            </div>

            {/* Have a project in mind? (Contact) */}
            <div className="rounded-[28px] bento-surface p-6">
              <h4 className="type-h4 font-display font-medium text-[var(--text-primary)] mb-4">
                Have a project in mind?
              </h4>
              <CopyEmailButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
  );
}
