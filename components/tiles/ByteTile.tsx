"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { BentoTile } from "./BentoTile";
import BytePoster from "@/components/three/BytePoster";
import { trackEvent, deferUntilIdle } from "@/lib/analytics";

let dynamicImportStartTime = 0;

// Dynamic import with ssr: false ensures three.js and react-three-fiber are code-split into their own chunk
const ByteScene = dynamic(
  () => {
    if (!dynamicImportStartTime) {
      dynamicImportStartTime = performance.now();
    }
    return import("@/components/three/ByteScene");
  },
  {
    ssr: false,
    loading: () => <BytePoster />,
  }
);

interface ByteErrorBoundaryProps {
  fallback: React.ReactNode;
  onError: () => void;
  children: React.ReactNode;
}

interface ByteErrorBoundaryState {
  hasError: boolean;
}

class ByteErrorBoundary extends React.Component<
  ByteErrorBoundaryProps,
  ByteErrorBoundaryState
> {
  constructor(props: ByteErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ByteErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

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
  const [hasLoadError, setHasLoadError] = useState(false);
  const [patCount, setPatCount] = useState<number | null>(null);

  const loadStartTimeRef = useRef<number>(0);
  const viewedTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasFiredViewedRef = useRef(false);
  const hasFiredFailedRef = useRef(false);

  useEffect(() => {
    fetch("/api/pats")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return;
        const total = typeof data.total === "number" ? data.total : data.count;
        if (typeof total === "number") {
          setPatCount(total);
        }
      })
      .catch(() => { });
  }, []);

  const handleSceneError = useCallback(() => {
    setHasLoadError(true);
    if (!hasFiredFailedRef.current) {
      hasFiredFailedRef.current = true;
      deferUntilIdle(() => {
        trackEvent("byte_scene_failed", { reason: "load_error" });
      });
    }
  }, []);

  useEffect(() => {
    const isAvailable = detectWebGL();
    setWebglOk(isAvailable);
    if (!isAvailable && !hasFiredFailedRef.current) {
      hasFiredFailedRef.current = true;
      deferUntilIdle(() => {
        trackEvent("byte_scene_failed", { reason: "no_webgl" });
      });
    }

    const el = containerRef.current;
    if (!el) return;

    // Reuse single IntersectionObserver to load Three.js and track continuous 50% visibility
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;

        if (entry.isIntersecting) {
          if (!loadStartTimeRef.current) {
            loadStartTimeRef.current = performance.now();
            if (!dynamicImportStartTime) {
              dynamicImportStartTime = loadStartTimeRef.current;
            }
          }
          setInViewport(true);
        }

        const is50PercentVisible = entry.isIntersecting && entry.intersectionRatio >= 0.5;

        if (is50PercentVisible) {
          if (!hasFiredViewedRef.current && !viewedTimerRef.current) {
            viewedTimerRef.current = setTimeout(() => {
              viewedTimerRef.current = null;
              if (!hasFiredViewedRef.current) {
                hasFiredViewedRef.current = true;
                deferUntilIdle(() => {
                  trackEvent("byte_viewed", {});
                });
              }
            }, 1000);
          }
        } else {
          if (viewedTimerRef.current) {
            clearTimeout(viewedTimerRef.current);
            viewedTimerRef.current = null;
          }
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1.0] }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (viewedTimerRef.current) {
        clearTimeout(viewedTimerRef.current);
        viewedTimerRef.current = null;
      }
    };
  }, []);

  return (
    <BentoTile className={className} enableTilt={false} noPadding>
      <div ref={containerRef} className="w-full h-full relative overflow-hidden">
        {inViewport && webglOk && !hasLoadError ? (
          <ByteErrorBoundary
            fallback={<BytePoster patCount={patCount} />}
            onError={handleSceneError}
          >
            <ByteScene
              initialPatCount={patCount}
              loadStartTime={loadStartTimeRef.current || dynamicImportStartTime}
              onLoadError={handleSceneError}
            />
          </ByteErrorBoundary>
        ) : (
          <BytePoster patCount={patCount} />
        )}
      </div>
    </BentoTile>
  );
}
