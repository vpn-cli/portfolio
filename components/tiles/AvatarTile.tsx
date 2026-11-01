"use client";

import Image from "next/image";
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
        <Image
          src={siteConfig.avatar}
          alt={siteConfig.name}
          fill
          loading="lazy"
          sizes="(max-width: 640px) 100vw, 240px"
          className="object-cover object-[center_40%]"
          quality={85}
        />
      </div>
    </BentoTile>
  );
}
