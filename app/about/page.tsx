import { siteConfig } from "@/content/site";
import { TransitionLink } from "@/components/motion/RouteTransition";
import { ArrowLeft, ArrowUpRight, CheckCircle, Sparkles, Terminal } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `About — ${siteConfig.name}`,
  description: siteConfig.bio,
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-canvas text-white pb-24">
      {/* Sticky Navigation Header */}
      <nav className="fixed top-0 inset-x-0 z-50 px-4 sm:px-8 py-5 flex items-center justify-between backdrop-blur-xl bg-canvas/70 border-b border-white/[0.06]">
        <TransitionLink
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/10 hover:border-accent hover:text-accent transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Hub</span>
        </TransitionLink>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-sm font-bold text-white font-display">Biography & Ethos</span>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-32 px-4 sm:px-8 max-w-4xl mx-auto space-y-20">
        {/* Hero Section */}
        <header className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/25 text-accent text-xs font-mono uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Creative Ethos</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white font-display leading-[1.08]">
            {siteConfig.about.heroStatement}
          </h1>

          <p className="text-lg sm:text-xl text-white/70 leading-relaxed font-light">
            I am {siteConfig.name}, a {siteConfig.role} based in {siteConfig.city}. Over the past 6+ years, I've collaborated with fast-moving startups and industry leaders to shape interfaces that feel physically alive, mathematically structured, and emotionally resonant.
          </p>
        </header>

        {/* Core Principles */}
        <section className="space-y-8">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-accent" />
            <h2 className="text-2xl font-bold font-display text-white">Guiding Principles</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {siteConfig.about.philosophy.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-[28px] bg-white/[0.03] border border-white/[0.08] hover:border-accent/40 transition-colors duration-300 flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-mono text-accent block mb-2">0{idx + 1} // Principle</span>
                  <h3 className="text-lg font-bold text-white mb-3 font-display">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-light">
                    {item.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Experience & Track Record */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold font-display text-white">Experience & Cadence</h2>
            <span className="text-xs font-mono text-white/40">Chronological</span>
          </div>

          <div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
            {siteConfig.about.experience.map((exp, idx) => (
              <div key={idx} className="py-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-baseline">
                <span className="text-xs font-mono text-accent">{exp.period}</span>
                <div className="md:col-span-1">
                  <h4 className="text-base font-bold text-white">{exp.role}</h4>
                  <p className="text-xs text-white/50">{exp.company}</p>
                </div>
                <p className="md:col-span-2 text-sm text-white/70 leading-relaxed font-light">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Services & Capabilities */}
        <section className="space-y-8">
          <h2 className="text-2xl font-bold font-display text-white">Core Capabilities</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {siteConfig.about.services.map((service, idx) => (
              <div
                key={idx}
                className="p-6 rounded-[24px] bg-white/[0.02] border border-white/[0.06] flex items-start gap-4"
              >
                <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/25 flex items-center justify-center text-accent text-xs font-mono font-bold shrink-0">
                  {service.number}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-1">{service.title}</h3>
                  <p className="text-xs sm:text-sm text-white/60 leading-relaxed font-light">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <footer className="pt-12 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold font-display text-white">Have a high-stakes project?</h3>
            <p className="text-sm text-white/50">Let's build something extraordinary.</p>
          </div>

          <a
            href={`mailto:${siteConfig.email}?subject=Collaboration%20Inquiry`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-black font-semibold hover:bg-accent-glow transition-all"
          >
            <span>Initiate Contact</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </footer>
      </div>
    </main>
  );
}

