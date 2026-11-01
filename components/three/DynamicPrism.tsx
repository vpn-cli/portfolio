"use client";

import dynamic from "next/dynamic";

const PrismScene = dynamic(() => import("./PrismScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[280px] flex flex-col items-center justify-center gap-3">
      <div className="relative w-20 h-20 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-accent/30 motion-safe:animate-ping opacity-75" />
        <div className="w-12 h-12 rounded-2xl border border-accent/60 bg-accent/10 backdrop-blur-md motion-safe:animate-spin" />
      </div>
      <p className="text-xs text-white/40">
        Initializing 3D Core…
      </p>
    </div>
  ),
});

export function DynamicPrism() {
  return <PrismScene />;
}

