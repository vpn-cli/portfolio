import { BentoGrid } from "@/components/motion/BentoGrid";
import { siteConfig } from "@/content/site";
import { TransitionLink } from "@/components/motion/RouteTransition";

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] transition-colors duration-300">
      {/* Top Header */}
      <header className="relative z-40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center font-bold text-sm text-[var(--text-primary)] font-display shadow-sm">
            VK
          </div>
          <div>
            <span className="text-sm font-bold text-[var(--text-primary)] font-display tracking-tight block">
              {siteConfig.name}
            </span>
            <span className="text-[11px] text-[var(--text-tertiary)] block font-mono">
              Portfolio // 2026
            </span>
          </div>
        </div>

        {/* Navigation Actions */}
        <nav className="flex items-center gap-2 sm:gap-4">
          <TransitionLink
            href="/about"
            className="text-xs uppercase tracking-wider font-semibold text-[var(--text-secondary)] hover:text-accent transition-colors px-3 py-1.5 rounded-full hover:bg-white/[0.04]"
          >
            About
          </TransitionLink>

          <TransitionLink
            href="/resources"
            className="text-xs uppercase tracking-wider font-semibold text-[var(--text-secondary)] hover:text-accent transition-colors px-3 py-1.5 rounded-full hover:bg-white/[0.04]"
          >
            Resources
          </TransitionLink>

          <a
            href={`mailto:${siteConfig.email}?subject=Project%20Inquiry`}
            className="text-xs uppercase tracking-wider font-semibold text-black bg-accent hover:bg-accent-glow px-4 py-1.5 rounded-full transition-all shadow-[0_0_20px_rgba(255,107,0,0.25)]"
          >
            Get In Touch
          </a>
        </nav>
      </header>

      {/* Main Bento Grid Hub (Matches Screenshot 2026-10-31 210314.png) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <BentoGrid />
      </main>

      {/* Footer Colophon */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-t border-white/[0.06] mt-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[var(--text-tertiary)]">
        <div className="flex items-center gap-2">
          <span>Designed & Engineered by {siteConfig.name}</span>
          <span>•</span>
          <span className="font-mono">{siteConfig.city}, {siteConfig.country}</span>
        </div>

        <div className="flex items-center gap-4 font-mono text-[11px]">
          <span>Next.js 15</span>
          <span>•</span>
          <span>GSAP Motion</span>
          <span>•</span>
          <span>Tailwind v4</span>
        </div>
      </footer>
    </div>
  );
}
