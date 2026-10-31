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
      className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:border-accent hover:bg-accent/10 text-white transition-all duration-200 group active:scale-98"
    >
      <span className="text-sm font-medium">
        {copied ? "Copied to clipboard!" : "Copy email"}
      </span>
      {copied ? (
        <Check className="w-4 h-4 text-emerald-400" />
      ) : (
        <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-accent transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      )}
    </button>
  );
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col items-center">
      {/* Top Floating Close Pill (Matches Screenshot 2026-10-31 210409.png) */}
      <div className="w-full max-w-5xl flex justify-center mb-8">
        <TransitionLink
          href="/"
          className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/10 hover:border-accent hover:text-accent flex items-center justify-center transition-colors"
          title="Back to Home"
        >
          <X className="w-5 h-5 text-white/70" />
        </TransitionLink>
      </div>

      {/* Main Bento Container */}
      <div className="w-full max-w-5xl rounded-[36px] bg-[#0E0F12] border border-white/[0.06] p-6 sm:p-10 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* ================= LEFT COLUMN (Story & Experience) ================= */}
          <div className="lg:col-span-7 space-y-8">
            {/* Story Card */}
            <div className="rounded-[28px] bg-[#141519] border border-white/[0.08] p-6 sm:p-8 space-y-6">
              <h1 className="type-h2 font-display font-medium text-white tracking-tight">
                What I'm about?
              </h1>

              <div>
                <span className="type-label2 text-[var(--text-tertiary)] block mb-2 font-semibold">
                  MY STORY
                </span>
                <p className="type-body4 text-zinc-300 font-light leading-relaxed">
                  I was born and raised in India. Ever since I wrote my first line of code, I have had a relentless passion for software engineering and system architecture. I was captivated by the synergy between computational algorithms and creative design, which inspired me to dive deep into full-stack web development and high-performance interactive interfaces.
                </p>
              </div>

              <div>
                <span className="type-label2 text-[var(--text-tertiary)] block mb-2 font-semibold">
                  WHAT I DO NOW
                </span>
                <p className="type-body4 text-zinc-300 font-light leading-relaxed">
                  Today I'm engineering scalable cloud platforms, distributed API backends, and fluid Next.js frontend applications designed to handle high concurrency with zero latency.
                </p>
              </div>
            </div>

            {/* Experience Table Card (Matches Reference) */}
            <div className="rounded-[28px] bg-[#141519] border border-white/[0.08] p-6 sm:p-8">
              <span className="type-label2 text-[var(--text-tertiary)] block mb-4 font-semibold">
                EXPERIENCE
              </span>

              <div className="divide-y divide-white/[0.06]">
                {siteConfig.experience.map((exp, idx) => (
                  <div key={idx} className="py-4 flex items-center justify-between text-sm">
                    <div>
                      <h4 className="font-semibold text-white">{exp.role}</h4>
                      <p className="text-xs text-zinc-500">{exp.company}</p>
                    </div>
                    <span className="text-xs font-mono text-zinc-400 px-2.5 py-1 rounded bg-white/[0.04]">
                      {exp.period}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN (Services, Stack, Photo, Contact) ================= */}
          <div className="lg:col-span-5 space-y-6">
            {/* What I Do Best Card */}
            <div className="rounded-[28px] bg-[#141519] border border-white/[0.08] p-6 sm:p-8">
              <span className="type-label2 text-[var(--text-tertiary)] block mb-2 font-semibold">
                WHAT I DO BEST
              </span>
              <h3 className="type-h3 font-display font-medium text-white mb-2">
                Full-Stack Engineering
              </h3>
              <p className="type-body4 text-zinc-400 font-light leading-relaxed mb-4">
                Providing innovative architecture, performant databases, and impactful digital solutions to ensure a superior user experience.
              </p>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-accent" />
                <span className="w-2 h-2 rounded-full bg-white/20" />
                <span className="w-2 h-2 rounded-full bg-white/20" />
              </div>
            </div>

            {/* Stack I use */}
            <div className="rounded-[28px] bg-[#141519] border border-white/[0.08] p-6">
              <span className="type-label2 text-[var(--text-tertiary)] block mb-3 font-semibold">
                STACK I USE
              </span>
              <div className="flex flex-wrap gap-2">
                {siteConfig.techStack.slice(0, 6).map((tech) => (
                  <div
                    key={tech.name}
                    className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-zinc-300 flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                    <span>{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Photo Preview Card */}
            <div className="rounded-[28px] bg-[#141519] border border-white/[0.08] p-3 overflow-hidden">
              <div className="w-full aspect-[16/11] rounded-[22px] bg-gradient-to-tr from-stone-900 via-neutral-800 to-zinc-900 border border-white/10 flex flex-col justify-end p-5 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-black/80" />
                <div className="relative z-10">
                  <span className="text-[11px] font-mono text-white/60 block">Outside the Terminal</span>
                  <span className="text-sm font-semibold text-white">Exploring, Cycling & Open-Source</span>
                </div>
              </div>
            </div>

            {/* Have a project in mind? (Contact) */}
            <div className="rounded-[28px] bg-[#141519] border border-white/[0.08] p-6">
              <h4 className="type-h4 font-display font-medium text-white mb-4">
                Have a project in mind?
              </h4>
              <CopyEmailButton />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
