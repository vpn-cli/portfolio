"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Menu } from "lucide-react";

export interface TocItem {
  id: string;
  label: string;
}

export const TOC_SECTIONS: TocItem[] = [
  { id: "tldr", label: "TL;DR" },
  { id: "hero", label: "Demo" },
  { id: "context", label: "Context" },
  { id: "problem", label: "The problem" },
  { id: "goals", label: "Goals & constraints" },
  { id: "journey", label: "The journey" },
  { id: "flow", label: "How it works" },
  { id: "challenges", label: "Hard parts & bugs" },
  { id: "results", label: "Results" },
  { id: "learnings", label: "What I learned" },
  { id: "try-it", label: "Try it yourself" },
];

export function TableOfContents() {
  const [activeId, setActiveId] = useState<string>("tldr");
  const [progress, setProgress] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate overall page scroll progress
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const currentProgress = Math.min(100, Math.max(0, (window.scrollY / totalScroll) * 100));
        setProgress(currentProgress);
      }

      // Track active section using scroll offset
      const offsets = TOC_SECTIONS.map((sec) => {
        const el = document.getElementById(sec.id);
        if (!el) return { id: sec.id, top: Infinity };
        const rect = el.getBoundingClientRect();
        return { id: sec.id, top: rect.top };
      });

      // Find the last section whose top is <= 220px
      const inView = offsets.filter((o) => o.top <= 220);
      if (inView.length > 0) {
        setActiveId(inView[inView.length - 1].id);
      } else {
        setActiveId(TOC_SECTIONS[0].id);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    const target = document.getElementById(id);
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({
      top,
      behavior: "smooth",
    });
  };

  const activeLabel = TOC_SECTIONS.find((s) => s.id === activeId)?.label || "Contents";
  const scaleValue = progress / 100;

  return (
    <>
      {/* ━━━ MOBILE COLLAPSIBLE TOC ━━━ */}
      <div className="lg:hidden sticky top-2 z-40 w-full mb-8">
        <div className="rounded-xl bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] shadow-md backdrop-blur-md overflow-hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-full min-h-[44px] px-4 py-2.5 flex items-center justify-between text-left text-sm font-medium text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-white/40"
            aria-expanded={mobileOpen}
            aria-controls="mobile-toc-list"
          >
            <div className="flex items-center gap-2">
              <Menu className="w-4 h-4 text-[var(--text-tertiary)]" aria-hidden="true" />
              <span className="text-xs text-[var(--text-tertiary)]">Section:</span>
              <span className="text-sm font-medium text-[var(--text-primary)]">{activeLabel}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--text-tertiary)]">{Math.round(progress)}%</span>
              <ChevronDown
                className={`w-4 h-4 text-[var(--text-secondary)] transition-transform duration-200 ${
                  mobileOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </div>
          </button>

          {/* Reading Progress Line (scale-x instead of width transition) */}
          <div className="w-full h-0.5 bg-[var(--border-subtle)] overflow-hidden">
            <div
              className="h-full w-full bg-[var(--text-primary)] origin-left transition-transform duration-150 ease-out"
              style={{ transform: `scaleX(${scaleValue})` }}
            />
          </div>

          {/* Mobile Accordion Drawer */}
          {mobileOpen && (
            <nav
              id="mobile-toc-list"
              aria-label="Mobile table of contents"
              className="p-3 border-t border-[var(--border-subtle)] bg-[var(--surface-tile)] max-h-72 overflow-y-auto"
            >
              <ul className="space-y-1">
                {TOC_SECTIONS.map((sec, idx) => {
                  const isActive = activeId === sec.id;
                  return (
                    <li key={sec.id}>
                      <button
                        type="button"
                        onClick={() => scrollTo(sec.id)}
                        className={`w-full min-h-[38px] px-3 py-1.5 rounded-lg text-left text-xs transition-colors flex items-center justify-between ${
                          isActive
                            ? "bg-[var(--surface-tile-elevated)] font-medium text-[var(--text-primary)] border border-[var(--border-subtle)]"
                            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        }`}
                      >
                        <span>{sec.label}</span>
                        <span className="text-[11px] text-[var(--text-tertiary)]">0{idx + 1}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          )}
        </div>
      </div>

      {/* ━━━ DESKTOP STICKY SIDEBAR TOC ━━━ */}
      <aside
        aria-label="Table of contents"
        className="hidden lg:block w-56 shrink-0 sticky top-12 self-start space-y-6"
      >
        {/* Progress pill */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)]">
            <span className="text-xs font-normal">Case study guide</span>
            <span className="text-xs text-[var(--text-tertiary)]">{Math.round(progress)}% read</span>
          </div>
          <div className="w-full h-1 rounded-full bg-[var(--surface-tile-elevated)] overflow-hidden border border-[var(--border-subtle)]">
            <div
              className="h-full w-full bg-[var(--text-primary)] origin-left transition-transform duration-150 ease-out rounded-full"
              style={{ transform: `scaleX(${scaleValue})` }}
            />
          </div>
        </div>

        {/* Section link list */}
        <nav>
          <ul className="space-y-1 relative border-l border-[var(--border-subtle)] pl-3">
            {TOC_SECTIONS.map((sec, idx) => {
              const isActive = activeId === sec.id;
              return (
                <li key={sec.id} className="relative">
                  <button
                    type="button"
                    onClick={() => scrollTo(sec.id)}
                    className={`block w-full text-left py-1.5 text-xs transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-white/40 ${
                      isActive
                        ? "font-medium text-[var(--text-primary)] translate-x-1"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    <span className="text-[11px] text-[var(--text-tertiary)] mr-1.5">
                      {idx < 9 ? `0${idx + 1}` : idx + 1}
                    </span>
                    <span>{sec.label}</span>
                  </button>
                  {isActive && (
                    <span
                      className="absolute -left-[13px] top-2 w-1.5 h-1.5 rounded-full bg-[var(--text-primary)]"
                      aria-hidden="true"
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
