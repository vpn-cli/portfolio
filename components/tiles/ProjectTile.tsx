"use client";

import { Project } from "@/content/site";
import { BentoTile } from "./BentoTile";
import { usePageTransition } from "@/components/motion/RouteTransition";
import { ArrowUpRight } from "lucide-react";

export function ProjectTile({
  project,
  className = "",
}: {
  project: Project;
  className?: string;
}) {
  const { navigateWithWipe } = usePageTransition();

  const handleOpen = () => {
    navigateWithWipe(`/work/${project.slug}`);
  };

  return (
    <BentoTile className={className} noPadding cursorText={`View ${project.title}`}>
      <div
        onClick={handleOpen}
        className="w-full h-full relative cursor-pointer group flex flex-col justify-between overflow-hidden rounded-[28px] p-5 sm:p-6"
      >
        {/* Device Canvas Frame depending on deviceType */}
        {project.deviceType === "phone-dark" && (
          <div className="w-full h-full flex flex-col justify-between">
            {/* Top Eyebrow */}
            <div className="flex items-center justify-between mb-3 z-10">
              <span className="type-label2 text-[var(--text-tertiary)] font-semibold">
                {project.category}
              </span>
              <div className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-[var(--text-secondary)] group-hover:text-accent group-hover:border-accent/40 transition-colors">
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>

            {/* Realistic iPhone Device Frame (Dark UI) */}
            <div className="relative w-full flex-1 flex items-center justify-center my-2 py-2">
              <div className="w-48 sm:w-52 h-64 sm:h-72 rounded-[32px] border-[5px] border-zinc-700/80 bg-black p-2.5 shadow-2xl overflow-hidden group-hover:scale-105 transition-transform duration-500 flex flex-col justify-between">
                {/* Dynamic Island */}
                <div className="w-16 h-3 bg-zinc-900 rounded-full mx-auto mb-2 flex items-center justify-end px-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500/80" />
                </div>

                {/* Mobile App UI Mockup */}
                <div className="space-y-2 flex-1 flex flex-col justify-between">
                  <div className="rounded-xl bg-zinc-900/90 p-2.5 border border-zinc-800">
                    <span className="text-[9px] text-zinc-500 font-mono block">TOTAL BALANCE</span>
                    <span className="text-base font-bold text-white font-mono">$18,450.80</span>
                  </div>

                  {/* Micro Bar Chart */}
                  <div className="rounded-xl bg-zinc-900/80 p-2 border border-zinc-800/80">
                    <span className="text-[8px] text-zinc-500 font-mono block mb-1">CASH FLOW</span>
                    <div className="flex items-end gap-1.5 h-10">
                      {[40, 75, 50, 90, 60, 100, 70].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-sm bg-gradient-to-t from-zinc-700 to-accent"
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Transaction List */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[9px] text-zinc-400 p-1 rounded bg-zinc-900/60">
                      <span>Cloud API Sub</span>
                      <span className="text-white font-mono">-$29.00</span>
                    </div>
                    <div className="flex items-center justify-between text-[9px] text-zinc-400 p-1 rounded bg-zinc-900/60">
                      <span>Stripe Payout</span>
                      <span className="text-emerald-400 font-mono">+$2,400.00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="z-10 mt-2">
              <h4 className="text-sm font-bold text-[var(--text-primary)] font-display">
                {project.title}
              </h4>
              <p className="text-xs text-[var(--text-secondary)] line-clamp-1">
                {project.tagline}
              </p>
            </div>
          </div>
        )}

        {project.deviceType === "phone-light" && (
          <div className="w-full h-full flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3 z-10">
              <span className="type-label2 text-[var(--text-tertiary)] font-semibold">
                {project.category}
              </span>
              <div className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-[var(--text-secondary)] group-hover:text-accent group-hover:border-accent/40 transition-colors">
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>

            {/* Phone on Warm Rattan/Pattern Studio Surface */}
            <div className="relative w-full flex-1 flex items-center justify-center my-2 py-2">
              {/* Patterned Ambient Background */}
              <div className="absolute inset-x-2 inset-y-0 rounded-2xl bg-[#EBE7DF]/10 border border-white/10 overflow-hidden">
                <div className="w-full h-full opacity-20 bg-[radial-gradient(#C4A482_1px,transparent_1px)] [background-size:12px_12px]" />
              </div>

              {/* Light Mobile Device */}
              <div className="relative z-10 w-48 sm:w-52 h-64 sm:h-72 rounded-[32px] border-[5px] border-zinc-200 bg-white text-zinc-900 p-2.5 shadow-2xl overflow-hidden group-hover:scale-105 transition-transform duration-500 flex flex-col justify-between">
                <div className="w-16 h-3 bg-zinc-200 rounded-full mx-auto mb-2" />

                <div className="space-y-2 flex-1 flex flex-col justify-between text-left">
                  <div className="p-2 rounded-xl bg-zinc-100 border border-zinc-200">
                    <span className="text-[9px] text-zinc-500 font-mono block">TRANSFER CONFIRMATION</span>
                    <span className="text-base font-bold text-zinc-900 font-mono">$4,850.00</span>
                  </div>

                  <div className="p-2 rounded-xl bg-orange-50 border border-orange-200/60">
                    <span className="text-[9px] text-orange-700 font-semibold block">INSTANT SETTLEMENT</span>
                    <span className="text-[10px] text-zinc-600 block">Verified via Smart Bridge</span>
                  </div>

                  <div className="w-full py-1.5 rounded-lg bg-black text-white text-center text-[10px] font-semibold">
                    Complete Transfer
                  </div>
                </div>
              </div>
            </div>

            <div className="z-10 mt-2">
              <h4 className="text-sm font-bold text-[var(--text-primary)] font-display">
                {project.title}
              </h4>
              <p className="text-xs text-[var(--text-secondary)] line-clamp-1">
                {project.tagline}
              </p>
            </div>
          </div>
        )}

        {project.deviceType === "laptop" && (
          <div className="w-full h-full flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3 z-10">
              <span className="type-label2 text-[var(--text-tertiary)] font-semibold">
                {project.category}
              </span>
              <div className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-[var(--text-secondary)] group-hover:text-accent group-hover:border-accent/40 transition-colors">
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>

            {/* MacBook Laptop Display Mockup */}
            <div className="relative w-full flex-1 flex flex-col items-center justify-center my-1 py-1">
              <div className="w-full max-w-sm rounded-t-2xl border-[5px] border-zinc-800 bg-[#0C0D11] p-2 shadow-2xl overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
                {/* Browser Tab Bar */}
                <div className="flex items-center gap-1.5 mb-2 pb-1 border-b border-white/[0.06]">
                  <div className="w-2 h-2 rounded-full bg-red-500/80" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500/80" />
                  <div className="w-2 h-2 rounded-full bg-green-500/80" />
                  <div className="text-[9px] font-mono text-zinc-500 ml-2">app.nexus.dev/clusters</div>
                </div>

                {/* SaaS Cloud Dashboard Preview */}
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-1.5">
                    <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800">
                      <span className="text-[8px] text-zinc-500 block">UPTIME</span>
                      <span className="text-xs font-mono font-bold text-emerald-400">99.99%</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800">
                      <span className="text-[8px] text-zinc-500 block">NODES</span>
                      <span className="text-xs font-mono font-bold text-white">48 Active</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800">
                      <span className="text-[8px] text-zinc-500 block">LATENCY</span>
                      <span className="text-xs font-mono font-bold text-amber-400">12ms</span>
                    </div>
                  </div>

                  {/* Telemetry Chart Curve */}
                  <div className="p-2 rounded-lg bg-zinc-900/80 border border-zinc-800/80 h-16 flex items-end gap-1">
                    {[30, 45, 60, 40, 80, 65, 95, 75, 90, 85, 100].map((v, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-accent/20 to-accent rounded-sm"
                        style={{ height: `${v}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Laptop Keyboard Base Base Stand */}
              <div className="w-[104%] max-w-[390px] h-2.5 bg-zinc-700/80 rounded-b-xl border-t border-zinc-600 shadow-md flex justify-center">
                <div className="w-12 h-1 bg-zinc-800 rounded-b-md" />
              </div>
            </div>

            <div className="z-10 mt-2">
              <h4 className="text-sm font-bold text-[var(--text-primary)] font-display">
                {project.title}
              </h4>
              <p className="text-xs text-[var(--text-secondary)] line-clamp-1">
                {project.tagline}
              </p>
            </div>
          </div>
        )}
      </div>
    </BentoTile>
  );
}
