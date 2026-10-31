import { BentoGrid } from "@/components/motion/BentoGrid";
import { siteConfig } from "@/content/site";
import { TransitionLink } from "@/components/motion/RouteTransition";

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] transition-colors duration-300 flex flex-col justify-between px-3 sm:px-6 lg:px-8 py-3 lg:py-4">
      {/* Top Header */}
      <header className="relative z-40 w-full max-w-[1360px] mx-auto flex items-center justify-between py-1">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center font-semibold text-xs text-[var(--text-primary)] font-display">
            VK
          </div>
          <div>
            <span className="text-xs font-semibold text-[var(--text-primary)] font-display tracking-tight block">
              {siteConfig.name}
            </span>
            <span className="text-[10px] text-neutral-500 block font-mono">
              Portfolio // 2026
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-2 sm:gap-3">
          <TransitionLink
            href="/about"
            className="text-[11px] uppercase tracking-wider font-medium text-neutral-400 hover:text-white transition-colors px-3 py-1.5 rounded-full hover:bg-white/[0.04]"
          >
            About
          </TransitionLink>

          <TransitionLink
            href="/resources"
            className="text-[11px] uppercase tracking-wider font-medium text-neutral-400 hover:text-white transition-colors px-3 py-1.5 rounded-full hover:bg-white/[0.04]"
          >
            Resources
          </TransitionLink>

          <a
            href={`mailto:${siteConfig.email}?subject=Project%20Inquiry`}
            className="text-[11px] uppercase tracking-wider font-semibold text-white bg-white/[0.08] hover:bg-white hover:text-black border border-white/10 px-3.5 py-1.5 rounded-full transition-all duration-200"
          >
            Contact
          </a>
        </nav>
      </header>

      {/* Main Single-Viewport Bento Grid */}
      <main className="w-full flex items-center justify-center my-auto py-1">
        <BentoGrid />
      </main>

      {/* Subtle Bottom Footer */}
      <footer className="w-full max-w-[1360px] mx-auto flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-neutral-500 py-1 border-t border-white/[0.05]">
        <div>
          <span>{siteConfig.name}</span>
          <span className="mx-2">•</span>
          <span>{siteConfig.city}, {siteConfig.country}</span>
        </div>

        <div className="flex items-center gap-3 text-[10px] text-neutral-600">
          <span>Next.js 15</span>
          <span>•</span>
          <span>GSAP</span>
          <span>•</span>
          <span>Three.js</span>
          <span>•</span>
          <span>Tailwind v4</span>
        </div>
      </footer>
    </div>
  );
}
