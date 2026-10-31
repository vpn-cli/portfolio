import { BentoGrid } from "@/components/motion/BentoGrid";
import { siteConfig } from "@/content/site";
import { TransitionLink } from "@/components/motion/RouteTransition";

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-canvas overflow-hidden">
      {/* Ambient background glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-accent/10 blur-[140px] -z-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-[-20%] right-[-10%] w-[700px] h-[700px] rounded-full bg-amber-600/5 blur-[160px] -z-10"
      />

      {/* Top Header */}
      <header className="relative z-40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center font-bold text-sm text-white font-display">
            AV
          </div>
          <div>
            <span className="text-sm font-bold text-white font-display tracking-tight block">
              {siteConfig.name}
            </span>
            <span className="text-[11px] text-white/40 block font-mono">
              Portfolio // 2026
            </span>
          </div>
        </div>

        {/* Navigation Actions */}
        <nav className="flex items-center gap-3 sm:gap-4">
          <TransitionLink
            href="/about"
            className="text-xs uppercase tracking-wider font-semibold text-white/70 hover:text-accent transition-colors px-3 py-1.5 rounded-full hover:bg-white/[0.04]"
          >
            About & Ethos
          </TransitionLink>

          <a
            href={`mailto:${siteConfig.email}?subject=Project%20Inquiry`}
            className="text-xs uppercase tracking-wider font-semibold text-black bg-accent hover:bg-accent-glow px-4 py-1.5 rounded-full transition-all shadow-[0_0_20px_rgba(255,107,0,0.3)]"
          >
            Get In Touch
          </a>
        </nav>
      </header>

      {/* Main Bento Grid Hub */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <BentoGrid />
      </main>

      {/* Footer Colophon */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-white/[0.06] mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-white/40">
        <div className="flex items-center gap-2">
          <span>Designed & Engineered by {siteConfig.name}</span>
          <span>•</span>
          <span className="font-mono">{siteConfig.city}</span>
        </div>

        <div className="flex items-center gap-4 font-mono text-[11px]">
          <span>Next.js 15</span>
          <span>•</span>
          <span>GSAP Motion</span>
          <span>•</span>
          <span>R3F 3D</span>
          <span>•</span>
          <span>Tailwind v4</span>
        </div>
      </footer>
    </div>
  );
}

