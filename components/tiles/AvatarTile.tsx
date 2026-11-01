"use client";

import { BentoTile } from "./BentoTile";
import { siteConfig } from "@/content/site";
import { usePageTransition } from "@/components/motion/RouteTransition";

export function AvatarTile({ className = "" }: { className?: string }) {
  const { navigateWithWipe } = usePageTransition();

  return (
    <BentoTile className={className} noPadding cursorText="About Vipin">
      <div
        onClick={() => navigateWithWipe("/about")}
        className="w-full h-full relative cursor-pointer overflow-hidden rounded-[24px] group"
      >
        <img
          src={siteConfig.avatar}
          alt={siteConfig.name}
          className="absolute inset-0 w-full h-full object-cover object-[center_40%] transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
      </div>
    </BentoTile>
  );
}
