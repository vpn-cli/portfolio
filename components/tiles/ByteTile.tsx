"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { BentoTile } from "./BentoTile";
import BytePoster from "@/components/three/BytePoster";

// Dynamic import with ssr: false ensures three.js and react-three-fiber are code-split into their own chunk
const ByteScene = dynamic(() => import("@/components/three/ByteScene"), {
  ssr: false,
  loading: () => <BytePoster />,
});

function detectWebGL(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

export function ByteTile({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inViewport, setInViewport] = useState(false);
  const [webglOk, setWebglOk] = useState(true);
  const [patCount, setPatCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/pats")
      .then((res) => res.json())
      .then((data) => {
        const total = typeof data.total === "number" ? data.total : data.count;
        if (typeof total === "number") {
          setPatCount(total);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setWebglOk(detectWebGL());

    const el = containerRef.current;
    if (!el) return;

    // Load Three.js when the tile enters or nears the viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: "120px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <BentoTile className={className} enableTilt={false} noPadding>
      <div ref={containerRef} className="w-full h-full relative overflow-hidden">
        {inViewport && webglOk ? (
          <ByteScene initialPatCount={patCount} />
        ) : (
          <BytePoster patCount={patCount} />
        )}
      </div>
    </BentoTile>
  );
}
