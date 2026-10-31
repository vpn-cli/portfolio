"use client";

import { BentoTile } from "./BentoTile";
import { usePageTransition } from "@/components/motion/RouteTransition";

export function AvatarTile({ className = "" }: { className?: string }) {
  const { navigateWithWipe } = usePageTransition();

  return (
    <BentoTile className={className} noPadding cursorText="About Me">
      <div
        onClick={() => navigateWithWipe("/about")}
        className="w-full h-full relative cursor-pointer overflow-hidden rounded-[28px] group"
      >
        {/* Sleek Portrait / Studio Background */}
        <div className="absolute inset-0 bg-gradient-to-tr from-neutral-900 via-zinc-800 to-stone-900 flex items-center justify-center">
          {/* Subtle geometric portrait placeholder with camera / developer lighting */}
          <div className="relative w-full h-full flex flex-col items-center justify-end p-6">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-black/80" />
            
            {/* Developer Avatar Silhouette / Photo Illustration */}
            <div className="relative z-10 w-28 h-28 rounded-full border-2 border-white/20 bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center shadow-xl backdrop-blur-md mb-2 group-hover:scale-105 transition-transform duration-500">
              <span className="text-3xl font-display font-bold text-white tracking-wider">
                VK
              </span>
            </div>

            <div className="relative z-10 text-center">
              <span className="text-xs font-mono uppercase tracking-widest text-white/50 block">
                Vipin Kaushik
              </span>
              <span className="text-[11px] font-mono text-emerald-400">
                ● Based in India
              </span>
            </div>
          </div>
        </div>
      </div>
    </BentoTile>
  );
}
