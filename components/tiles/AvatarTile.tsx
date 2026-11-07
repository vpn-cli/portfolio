"use client";

import Image from "next/image";
import { BentoTile } from "./BentoTile";
import { siteConfig } from "@/content/site";
import { TransitionLink } from "@/components/motion/RouteTransition";

export function AvatarTile({ className = "" }: { className?: string }) {
  return (
    <BentoTile className={className} noPadding cursorText="About Vipin">
      <TransitionLink
        href="/about"
        trackLocation="avatar_tile"
        trackLabel="About (Avatar)"
        aria-label="About Vipin"
        className="w-full h-full relative cursor-pointer overflow-hidden rounded-[24px] group block"
      >
        <Image
          src={siteConfig.avatar}
          alt={siteConfig.name}
          fill
          loading="lazy"
          sizes="(max-width: 640px) 100vw, 240px"
          className="object-cover object-[center_40%]"
          quality={85}
        />
      </TransitionLink>
    </BentoTile>
  );
}
