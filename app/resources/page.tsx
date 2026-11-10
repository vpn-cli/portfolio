"use client";

import { useState } from "react";
import { siteConfig, ResourceItem } from "@/content/site";
import { TransitionLink } from "@/components/motion/RouteTransition";
import { X, ArrowUpRight, Check, Sparkles, Code2, Layout, Layers, Terminal } from "lucide-react";
import { trackEvent, getOutboundDestination } from "@/lib/analytics";

export default function ResourcesPage() {
  const [activeItem, setActiveItem] = useState<ResourceItem | null>(null);

  const getResourceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "boilerplate":
        return <Terminal className="w-6 h-6 text-white/80" aria-hidden="true" />;
      case "template":
        return <Layout className="w-6 h-6 text-white/80" aria-hidden="true" />;
      case "component":
        return <Layers className="w-6 h-6 text-white/80" aria-hidden="true" />;
      default:
        return <Code2 className="w-6 h-6 text-white/80" aria-hidden="true" />;
    }
  };

  return (
    <main className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] p-3 sm:p-4 lg:p-6 flex flex-col items-center">
      {/* Main Bento Shell matching Master Framer Spec */}
      <div className="w-full max-w-[1480px] min-h-[calc(100vh-48px)] rounded-[32px] sm:rounded-[36px] bg-[var(--bg-canvas-subtle)] border border-[var(--border-subtle)] p-6 sm:p-10 lg:p-14 shadow-md flex flex-col items-center">
        {/* Top Floating Close / Back Pill */}
        <div data-reveal className="w-full flex justify-center mb-8 sm:mb-12">
          <TransitionLink
            href="/"
            trackLocation="back_link"
            trackLabel="Back to home"
            className="w-11 h-11 rounded-full bg-[var(--surface-tile)] hover:bg-[var(--surface-tile-hover)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] flex items-center justify-center transition-colors text-[var(--text-primary)] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)] focus-visible:ring-offset-2 active:scale-95"
            title="Back to home"
            aria-label="Back to home"
          >
            <X className="w-5 h-5 opacity-80" aria-hidden="true" />
          </TransitionLink>
        </div>

        {/* Inner Content Column */}
        <div className="w-full max-w-5xl lg:max-w-6xl">
          <header className="mb-10 text-center sm:text-left">
            <span data-reveal className="type-label2 text-[var(--text-tertiary)] block mb-2 font-semibold">
              Resources & open source
            </span>
            <h1 data-reveal className="type-h1 font-display font-medium text-[var(--text-primary)] tracking-tight">
              Templates & boilerplates to speed your workflow
            </h1>
          </header>

          {/* 2-Column Template Grid */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {siteConfig.resources.map((item, idx) => (
              <article
                key={item.id}
                {...(idx === 0 ? { "data-reveal": "" } : {})}
                onClick={() => setActiveItem(item)}
                className="group cursor-pointer rounded-[28px] bento-surface p-5 transition-[background-color,border-color] duration-300 flex flex-col justify-between"
              >
                {/* Thumbnail Mockup Preview */}
                <div
                  className={`w-full aspect-[16/10] rounded-[20px] bg-gradient-to-br ${item.gradient} border border-[var(--border-subtle)] p-5 flex flex-col justify-between overflow-hidden relative shadow-sm`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-medium text-white/80">
                      {item.type}
                    </span>
                    <span className="text-[13px] font-mono px-2.5 py-0.5 rounded-full bg-black/50 border border-white/10 text-white/90">
                      {item.price}
                    </span>
                  </div>

                  <div className="my-auto py-2 flex items-center justify-center">
                    {getResourceIcon(item.type)}
                  </div>

                  <div className="z-10">
                    <h3 className="text-xl font-semibold text-white font-display">
                      {item.title}
                    </h3>
                  </div>
                </div>

                {/* Title & Price Bar */}
                <div className="flex items-center justify-between pt-4 px-1">
                  <div>
                    <h4 className="text-sm font-semibold text-[var(--text-primary)] transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs text-[var(--text-tertiary)]">{item.category}</p>
                  </div>

                  <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-[var(--surface-tile-hover)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
                    {item.price}
                  </span>
                </div>
              </article>
            ))}
          </section>
        </div>
      </div>

      {/* Modal Detail Popup */}
      {activeItem && (
        <div
          className="fixed inset-0 z-[1000] bg-black/80 flex items-center justify-center p-4 motion-safe:animate-in motion-safe:fade-in motion-reduce:animate-none duration-200"
          onClick={() => setActiveItem(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl rounded-[32px] bg-[var(--surface-tile)] border border-[var(--border-subtle)] p-6 sm:p-8 shadow-md relative flex flex-col lg:flex-row gap-8 overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveItem(null)}
              type="button"
              aria-label="Close modal"
              className="absolute top-5 right-5 w-11 h-11 rounded-full bg-[var(--surface-tile-hover)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] flex items-center justify-center text-[var(--text-primary)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)] focus-visible:ring-offset-2 active:scale-95 disabled:opacity-50"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>

            {/* Left Preview Pane */}
            <div className="lg:w-1/2 aspect-[16/11] rounded-[24px] bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] p-6 flex flex-col justify-between">
              <span className="text-xs font-mono text-[var(--text-tertiary)]">{activeItem.type}</span>
              <div className="my-auto py-2">
                {getResourceIcon(activeItem.type)}
              </div>
              <h2 className="text-2xl font-semibold text-[var(--text-primary)] font-display">
                {activeItem.title}
              </h2>
            </div>

            {/* Right Information Pane */}
            <div className="lg:w-1/2 flex flex-col justify-between space-y-4">
              <div>
                <div className="inline-block px-2.5 py-0.5 rounded-md bg-[var(--surface-tile-hover)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-primary)] mb-3">
                  {activeItem.price}
                </div>

                <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-light mb-4">
                  {activeItem.description}
                </p>

                <div className="space-y-2 mb-6">
                  {activeItem.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" aria-hidden="true" />
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
                  data-ph-capture-attribute-location="resources_modal"
                  onClick={() =>
                    trackEvent("outbound_click", {
                      destination: "other",
                      url: activeItem.downloadUrl,
                      location: "resources_modal",
                      label: `${activeItem.title} (${activeItem.isFree ? "Free" : "Template"})`,
                    })
                  }
                  className="btn-primary min-h-[44px] w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-xs transition-opacity active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)] focus-visible:ring-offset-2"
                >
                  <span>{activeItem.isFree ? "Get it for free" : "Get template"}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                </a>

                <a
                  href={activeItem.previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ph-capture-attribute-location="resources_modal"
                  onClick={() =>
                    trackEvent("outbound_click", {
                      destination: getOutboundDestination(activeItem.previewUrl, "project_live"),
                      url: activeItem.previewUrl,
                      location: "resources_modal",
                      label: `${activeItem.title} Live Preview`,
                    })
                  }
                  className="btn-secondary min-h-[44px] w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium text-xs transition-colors active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)] focus-visible:ring-offset-2"
                >
                  <span>Live preview</span>
                  <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

