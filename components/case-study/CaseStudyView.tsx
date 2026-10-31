"use client";

import { useEffect, useRef } from "react";
import { Project } from "@/content/site";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { registerGSAPPlugins, MOTION } from "@/lib/motion";
import { TransitionLink } from "@/components/motion/RouteTransition";
import { ArrowLeft, ArrowUpRight, Sparkles, CheckCircle2 } from "lucide-react";

export function CaseStudyView({ project }: { project: Project }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroMediaRef = useRef<HTMLDivElement>(null);
  const horizontalSectionRef = useRef<HTMLDivElement>(null);
  const horizontalTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGSAPPlugins();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const container = containerRef.current;
    const hero = heroRef.current;
    const heroMedia = heroMediaRef.current;
    const horizSection = horizontalSectionRef.current;
    const horizTrack = horizontalTrackRef.current;

    if (!container || !hero || !heroMedia) return;

    const ctx = gsap.context(() => {
      // 1. Scroll-scrubbed hero scale (Apple style: hero compresses into a framed viewport)
      gsap.to(heroMedia, {
        scale: 0.92,
        borderRadius: "40px",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // 2. SplitText line reveals on section paragraphs
      const textEls = container.querySelectorAll(".split-reveal-text");
      textEls.forEach((el) => {
        const split = new SplitText(el, {
          type: "lines",
          linesClass: "overflow-hidden",
        });

        gsap.from(split.lines, {
          y: "100%",
          opacity: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "apple-spring",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });

      // 3. Parallax Image Cards
      const parallaxCards = container.querySelectorAll(".parallax-card-media");
      parallaxCards.forEach((media) => {
        gsap.fromTo(
          media,
          { yPercent: -12 },
          {
            yPercent: 12,
            ease: "none",
            scrollTrigger: {
              trigger: media,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        );
      });

      // 4. Horizontal Scroll Gallery pinned with ScrollTrigger
      if (horizSection && horizTrack) {
        const cards = horizTrack.children;
        const totalScroll = horizTrack.scrollWidth - horizSection.clientWidth;

        if (totalScroll > 0) {
          gsap.to(horizTrack, {
            x: () => -totalScroll,
            ease: "none",
            scrollTrigger: {
              trigger: horizSection,
              pin: true,
              scrub: 1,
              start: "top top",
              end: () => `+=${totalScroll * 1.2}`,
              invalidateOnRefresh: true,
            },
          });
        }
      }
    }, container);

    return () => ctx.revert();
  }, [project]);

  return (
    <div ref={containerRef} className="relative w-full min-h-screen bg-canvas text-white">
      {/* Sticky Navigation Header */}
      <nav className="fixed top-0 inset-x-0 z-50 px-4 sm:px-8 py-5 flex items-center justify-between backdrop-blur-xl bg-canvas/70 border-b border-white/[0.06]">
        <TransitionLink
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/10 hover:border-accent hover:text-accent transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Grid</span>
        </TransitionLink>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-xs font-mono uppercase tracking-widest text-white/50">
            {project.category}
          </span>
          <span className="w-2 h-2 rounded-full bg-accent" />
          <span className="text-sm font-bold text-white font-display">{project.title}</span>
        </div>
      </nav>

      {/* Hero Section */}
      <header
        ref={heroRef}
        className="relative pt-32 pb-16 px-4 sm:px-8 max-w-7xl mx-auto flex flex-col items-center text-center"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-mono uppercase tracking-widest mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{project.category} // {project.year}</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white max-w-4xl font-display leading-[1.05] mb-6">
          {project.title}
        </h1>

        <p className="text-lg sm:text-2xl text-white/70 max-w-2xl font-light leading-relaxed mb-12">
          {project.tagline}
        </p>

        {/* Hero Visual Container (Scroll-scrubbed) */}
        <div
          ref={heroMediaRef}
          className={`relative w-full rounded-[36px] overflow-hidden border border-white/10 bg-gradient-to-br ${project.accentGradient} p-8 sm:p-14 min-h-[360px] sm:min-h-[500px] flex flex-col justify-end shadow-2xl transition-all duration-300`}
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/25 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="relative z-10 text-left max-w-xl">
            <span className="text-xs font-mono uppercase text-accent tracking-widest block mb-2">
              Client & Timeline
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {project.client}
            </h3>
            <p className="text-sm text-white/60">Execution Period: {project.timeline}</p>
          </div>
        </div>

        {/* Project Metadata Ribbon */}
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/[0.08] text-left">
          <div>
            <span className="text-xs font-mono uppercase text-white/40 block mb-1">Role</span>
            <span className="text-sm font-semibold text-white">{project.role}</span>
          </div>
          <div>
            <span className="text-xs font-mono uppercase text-white/40 block mb-1">Client</span>
            <span className="text-sm font-semibold text-white">{project.client}</span>
          </div>
          <div>
            <span className="text-xs font-mono uppercase text-white/40 block mb-1">Timeline</span>
            <span className="text-sm font-semibold text-white">{project.timeline}</span>
          </div>
          <div>
            <span className="text-xs font-mono uppercase text-white/40 block mb-1">Impact</span>
            <span className="text-sm font-semibold text-accent">{project.metrics[0]}</span>
          </div>
        </div>
      </header>

      {/* Main Narrative Deep Dive */}
      <section className="px-4 sm:px-8 max-w-5xl mx-auto py-16 space-y-24">
        {/* Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div className="md:sticky md:top-28">
            <h2 className="text-2xl font-bold font-display text-white mb-2">01. Overview</h2>
            <p className="text-xs font-mono text-accent uppercase tracking-wider">The Strategic Mandate</p>
          </div>
          <div className="md:col-span-2 space-y-4">
            <p className="split-reveal-text text-lg sm:text-xl text-white/80 leading-relaxed font-light">
              {project.overview}
            </p>
          </div>
        </div>

        {/* Problem & Process */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-[28px] bg-white/[0.03] border border-white/[0.08]">
            <h3 className="text-xl font-bold text-white mb-3 font-display">The Challenge</h3>
            <p className="split-reveal-text text-sm sm:text-base text-white/70 leading-relaxed font-light">
              {project.problem}
            </p>
          </div>

          <div className="p-8 rounded-[28px] bg-white/[0.03] border border-white/[0.08]">
            <h3 className="text-xl font-bold text-white mb-3 font-display">The Engineering Process</h3>
            <p className="split-reveal-text text-sm sm:text-base text-white/70 leading-relaxed font-light">
              {project.process}
            </p>
          </div>
        </div>

        {/* Solution & Key Insights */}
        <div className="p-8 sm:p-12 rounded-[32px] bg-gradient-to-br from-white/[0.04] to-transparent border border-white/10 space-y-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white mb-4">
              The Architecture & Solution
            </h2>
            <p className="split-reveal-text text-base sm:text-lg text-white/80 leading-relaxed font-light">
              {project.solution}
            </p>
          </div>

          <div className="pt-6 border-t border-white/[0.08]">
            <h4 className="text-xs font-mono uppercase tracking-widest text-accent mb-4">
              Key Technical Takeaways
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {project.keyInsights.map((insight, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-black/40 border border-white/[0.06] flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-white/75 leading-relaxed">{insight}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Horizontal Scroll Gallery (Pinned with ScrollTrigger) */}
      <section
        ref={horizontalSectionRef}
        className="relative w-full h-screen overflow-hidden bg-black/60 flex flex-col justify-center py-8"
      >
        <div className="px-6 sm:px-12 mb-6 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-accent">Artifacts</span>
            <h3 className="text-2xl sm:text-3xl font-bold font-display text-white">Visual Telemetry</h3>
          </div>
          <span className="text-xs text-white/40 font-mono">Pinned Horizontal Gallery →</span>
        </div>

        <div
          ref={horizontalTrackRef}
          className="flex gap-6 sm:gap-8 px-6 sm:px-12 will-change-transform"
        >
          {project.gallery.map((item, idx) => (
            <div
              key={idx}
              className="w-[85vw] sm:w-[540px] shrink-0 rounded-[28px] overflow-hidden bg-[#12141A] border border-white/10 p-6 flex flex-col justify-between"
            >
              <div
                className={`relative w-full ${item.aspectRatio} rounded-2xl overflow-hidden border border-white/[0.06] bg-gradient-to-tr from-black via-zinc-900 to-black flex items-center justify-center mb-4`}
              >
                <div
                  className="parallax-card-media absolute inset-0 opacity-40 blur-2xl"
                  style={{ backgroundColor: item.accent }}
                />
                <div className="relative z-10 text-center px-4">
                  <span className="text-[11px] font-mono uppercase text-white/50 tracking-wider">
                    Interactive Spec // Plate 0{idx + 1}
                  </span>
                  <p className="text-lg font-bold text-white mt-1 font-display">{item.title}</p>
                </div>
              </div>

              <div>
                <h4 className="text-base font-semibold text-white mb-1">{item.title}</h4>
                <p className="text-xs sm:text-sm text-white/60 leading-relaxed font-light">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Conversion / Next Project Callout */}
      <footer className="py-24 px-4 sm:px-8 max-w-4xl mx-auto text-center space-y-6">
        <span className="text-xs font-mono uppercase text-accent tracking-widest">Next Chapter</span>
        <h2 className="text-3xl sm:text-4xl font-bold font-display text-white">
          Explore More Case Studies
        </h2>
        <div className="pt-4 flex flex-wrap justify-center gap-4">
          <TransitionLink
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-black font-semibold hover:bg-accent-glow transition-all"
          >
            <span>Return to Bento Hub</span>
            <ArrowUpRight className="w-4 h-4" />
          </TransitionLink>
        </div>
      </footer>
    </div>
  );
}

