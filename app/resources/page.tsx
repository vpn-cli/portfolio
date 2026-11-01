"use client";

import { useState } from "react";
import { siteConfig, ResourceItem } from "@/content/site";
import { TransitionLink } from "@/components/motion/RouteTransition";
import { X, ArrowUpRight, Check, Sparkles } from "lucide-react";

export default function ResourcesPage() {
  const [activeItem, setActiveItem] = useState<ResourceItem | null>(null);

  return (
    <main className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] p-3 sm:p-4 lg:p-6 flex flex-col items-center">
      {/* Main Bento Shell matching Master Framer Spec */}
      <div className="w-full max-w-[1800px] min-h-[calc(100vh-48px)] rounded-[32px] sm:rounded-[36px] bg-[var(--bg-canvas-subtle)] border border-[var(--border-subtle)] p-6 sm:p-10 lg:p-14 shadow-2xl flex flex-col items-center">
        {/* Top Floating Close / Back Pill (Matches Reference) */}
        <div className="w-full flex justify-center mb-8 sm:mb-12">
          <TransitionLink
            href="/"
            className="w-10 h-10 rounded-full bg-neutral-200 hover:bg-neutral-300 border border-neutral-300 dark:bg-white/[0.06] dark:border-white/10 dark:hover:border-white/20 flex items-center justify-center transition-colors text-neutral-800 dark:text-white"
            title="Back to Home"
          >
            <X className="w-5 h-5 opacity-80" />
          </TransitionLink>
        </div>

        {/* Inner Content Column */}
        <div className="w-full max-w-5xl lg:max-w-6xl">
          <div className="mb-10 text-center sm:text-left">
            <span className="type-label2 text-[var(--text-tertiary)] block mb-2 font-semibold font-mono">
              RESOURCES & OPEN SOURCE
            </span>
            <h1 className="type-h1 font-display font-medium text-[var(--text-primary)] tracking-tight">
              Templates & Boilerplates to speed your workflow
            </h1>
          </div>

          {/* 2-Column Template Grid (Matching Screenshot 2026-10-31 210333.png) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {siteConfig.resources.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="group cursor-pointer rounded-[28px] bento-surface p-5 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Thumbnail Mockup Preview */}
              <div
                className={`w-full aspect-[16/10] rounded-[20px] bg-gradient-to-br ${item.gradient} border border-black/10 dark:border-white/[0.06] p-5 flex flex-col justify-between overflow-hidden relative group-hover:scale-[1.02] transition-transform duration-300`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/70">
                    {item.type}
                  </span>
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-black/50 border border-white/10 text-white/90">
                    {item.price}
                  </span>
                </div>

                <div className="z-10">
                  <h3 className="text-xl font-bold text-white font-display">
                    {item.title}
                  </h3>
                </div>
              </div>

              {/* Title & Price Bar */}
              <div className="flex items-center justify-between pt-4 px-1">
                <div>
                  <h4 className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-black dark:group-hover:text-white transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[var(--text-tertiary)]">{item.category}</p>
                </div>

                <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-white/[0.06] text-[var(--text-secondary)]">
                  {item.price}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

      {/* Modal Detail Popup (Exact Match to Screenshot 2026-10-31 210403.png) */}
      {activeItem && (
        <div
          className="fixed inset-0 z-[1000] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setActiveItem(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl rounded-[32px] bg-[var(--surface-tile)] border border-[var(--border-subtle)] p-6 sm:p-8 shadow-2xl relative flex flex-col lg:flex-row gap-8 overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-neutral-200 dark:bg-white/[0.06] border border-neutral-300 dark:border-white/10 flex items-center justify-center text-neutral-800 dark:text-white/70 hover:opacity-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left Preview Pane */}
            <div className="lg:w-1/2 aspect-[16/11] rounded-[24px] bg-gradient-to-br from-neutral-800 to-black border border-white/[0.08] p-6 flex flex-col justify-between">
              <span className="text-xs font-mono text-zinc-400">{activeItem.type}</span>
              <h2 className="text-2xl font-bold text-white font-display">
                {activeItem.title}
              </h2>
            </div>

            {/* Right Information Pane */}
            <div className="lg:w-1/2 flex flex-col justify-between space-y-4">
              <div>
                <div className="inline-block px-2.5 py-0.5 rounded-md bg-neutral-100 dark:bg-white/[0.08] text-xs font-mono text-[var(--text-primary)] mb-3">
                  {activeItem.price}
                </div>

                <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-light mb-4">
                  {activeItem.description}
                </p>

                <div className="space-y-2 mb-6">
                  {activeItem.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-4 border-t border-[var(--border-subtle)]">
                <a
                  href={activeItem.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-neutral-900 text-white hover:bg-black dark:bg-white/[0.08] dark:hover:bg-white dark:text-white dark:hover:text-black font-semibold text-xs tracking-wider uppercase transition-colors"
                >
                  <span>{activeItem.isFree ? "Get it for free" : "Get Template"}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>

                <a
                  href={activeItem.previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-neutral-300 hover:border-neutral-500 text-neutral-700 hover:text-black dark:border-white/10 dark:hover:border-white/20 dark:text-zinc-400 dark:hover:text-white font-medium text-xs tracking-wider uppercase transition-colors"
                >
                  <span>Live preview</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

