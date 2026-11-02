"use client";

import { useEffect, useState } from "react";

export interface TocItem {
  id: string;
  label: string;
}

export const TOC_SECTIONS: TocItem[] = [
  { id: "hook", label: "Hook" },
  { id: "problem", label: "The problem" },
  { id: "architecture", label: "How it works" },
  { id: "decisions", label: "Decisions" },
  { id: "bugs", label: "Bugs I fixed" },
  { id: "next", label: "Try it" },
];

export function TableOfContents() {
  const [activeId, setActiveId] = useState<string>("hook");
  const [progress, setProgress] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;

      if (scrollY > 20) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }

      if (totalScroll > 0) {
        const currentProgress = Math.min(100, Math.max(0, (scrollY / totalScroll) * 100));
        setProgress(currentProgress);
      }

      // Track active section using scroll offset
      const offsets = TOC_SECTIONS.map((sec) => {
        const el = document.getElementById(sec.id);
        if (!el) return { id: sec.id, top: Infinity };
        const rect = el.getBoundingClientRect();
        return { id: sec.id, top: rect.top };
      });

      // Find the last section whose top is <= 240px
      const inView = offsets.filter((o) => o.top <= 240);
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
    const target = document.getElementById(id);
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({
      top,
      behavior: "smooth",
    });
  };

  const activeLabel = TOC_SECTIONS.find((s) => s.id === activeId)?.label || "Hook";
  const scaleValue = progress / 100;

  return (
    <>
      {/* ━━━ MOBILE COLLAPSED STICKY TOP PROGRESS BAR ━━━ */}
      <div className="lg:hidden sticky top-0 z-40 w-full bg-[var(--bg-canvas)]/90 backdrop-blur-md border-b border-[var(--border-subtle)] px-4 py-2 flex flex-col gap-1.5 shadow-sm">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-[var(--text-tertiary)] font-mono">0{TOC_SECTIONS.findIndex((s) => s.id === activeId) + 1}</span>
            <span className="text-[var(--text-tertiary)]">·</span>
            <span className="font-medium text-[var(--text-primary)]">{activeLabel}</span>
          </div>
          {hasScrolled && progress > 0 && (
            <span className="text-[11px] font-mono text-[var(--text-tertiary)]">
              {Math.round(progress)}% read
            </span>
          )}
        </div>

        <div className="w-full h-1 bg-[var(--border-subtle)] rounded-full overflow-hidden">
          <div
            className="h-full w-full bg-[var(--text-primary)] origin-left transition-transform duration-100 ease-out"
            style={{ transform: `scaleX(${scaleValue})` }}
          />
        </div>
      </div>

      {/* ━━━ DESKTOP STICKY SIDEBAR TOC ━━━ */}
      <aside
        aria-label="Table of contents"
        className="hidden lg:block w-52 shrink-0 sticky top-12 self-start space-y-6"
      >
        {/* Progress bar (Hides "0% read" until scrolled) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)] h-4">
            <span className="text-xs font-normal">Case study</span>
            {hasScrolled && progress > 0 ? (
              <span className="text-xs font-mono text-[var(--text-tertiary)]">
                {Math.round(progress)}% read
              </span>
            ) : null}
          </div>
          <div className="w-full h-1 rounded-full bg-[var(--surface-tile-elevated)] overflow-hidden border border-[var(--border-subtle)]">
            <div
              className="h-full w-full bg-[var(--text-primary)] origin-left transition-transform duration-150 ease-out rounded-full"
              style={{ transform: `scaleX(${scaleValue})` }}
            />
          </div>
        </div>

        {/* 6 Sections List */}
        <nav>
          <ul className="space-y-1 relative border-l border-[var(--border-subtle)] pl-3">
            {TOC_SECTIONS.map((sec, idx) => {
              const isActive = activeId === sec.id;
              return (
                <li key={sec.id} className="relative">
                  <button
                    type="button"
                    onClick={() => scrollTo(sec.id)}
                    className={`block w-full text-left py-1.5 text-xs transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 ${
                      isActive
                        ? "font-medium text-[var(--text-primary)] translate-x-1"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    <span className="text-[11px] font-mono text-[var(--text-tertiary)] mr-1.5">
                      0{idx + 1}
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
