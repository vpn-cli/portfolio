"use client";

import { IntroTile } from "@/components/tiles/IntroTile";
import { ProjectsTile } from "@/components/tiles/ProjectsTile";
import { AboutTile } from "@/components/tiles/AboutTile";
import { AvatarTile } from "@/components/tiles/AvatarTile";
import { LinksTile } from "@/components/tiles/LinksTile";
import { StackTile } from "@/components/tiles/StackTile";
import { ByteTile } from "@/components/tiles/ByteTile";
import { ContactTile } from "@/components/tiles/ContactTile";

export function BentoGrid() {
  return (
    <div className="bento-outer-container flex flex-col justify-between">
      <div className="bento-grid-root flex-1">
        {/* 1. Hero (cols 1-3, row 1 on desktop) */}
        <div className="tile-intro w-full h-auto xl:h-full">
          <IntroTile className="w-full h-full" />
        </div>

        {/* 2. Selected Work (cols 4-5, rows 1-2 on desktop) */}
        <div className="tile-projects w-full h-auto xl:h-full">
          <ProjectsTile className="w-full h-full" />
        </div>

        {/* 3. About (cols 2-3, row 2 on desktop) */}
        <div className="tile-about w-full h-auto xl:h-full">
          <AboutTile className="w-full h-full" />
        </div>

        {/* 4. Photo / Portrait (col 1, row 2 on desktop) */}
        <div className="tile-portrait w-full h-auto xl:h-full">
          <AvatarTile className="w-full h-full" />
        </div>

        {/* 5. Links Tile: GitHub, LinkedIn, Résumé (col 6, row 1 on desktop) */}
        <div className="tile-links w-full h-auto xl:h-full">
          <LinksTile className="w-full h-full" />
        </div>

        {/* 6. Stack I use (cols 1-3, row 3 on desktop) */}
        <div className="tile-stack w-full h-auto xl:h-full overflow-hidden">
          <StackTile className="w-full h-full" />
        </div>

        {/* 7. Interactive 3D Companion Byte (col 6, row 2 on desktop) */}
        <div className="tile-byte w-full h-auto xl:h-full">
          <ByteTile className="w-full h-full" />
        </div>

        {/* 8. Contact (cols 4-6, row 3 on desktop) */}
        <div className="tile-contact w-full h-auto xl:h-full">
          <ContactTile className="w-full h-full" />
        </div>
      </div>

      {/* Footer Credit Line */}
      <footer className="w-full pt-3 px-2 flex items-center justify-between text-[13px] text-[var(--text-tertiary)] select-none">
        <span>© {new Date().getFullYear()} Vipin Kaushik</span>
        <span>Byte: interactive 3D companion</span>
      </footer>
    </div>
  );
}
