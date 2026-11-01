"use client";

import { createContext, useContext, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { registerGSAPPlugins, MOTION } from "@/lib/motion";

interface TransitionContextType {
  navigateWithWipe: (href: string) => void;
  isPending: boolean;
}

const TransitionContext = createContext<TransitionContextType>({
  navigateWithWipe: () => {},
  isPending: false,
});

export const usePageTransition = () => useContext(TransitionContext);

export function RouteTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const overlayRef = useRef<HTMLDivElement>(null);
  const isTransitioningRef = useRef(false);

  const navigateWithWipe = (href: string) => {
    if (isTransitioningRef.current) return;
    if (typeof window === "undefined") {
      router.push(href);
      return;
    }

    // Check reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      router.push(href);
      return;
    }

    registerGSAPPlugins();
    isTransitioningRef.current = true;
    const overlay = overlayRef.current;

    if (!overlay) {
      router.push(href);
      isTransitioningRef.current = false;
      return;
    }

    // Wipe in animation (accent curtain wipes down from top)
    gsap.set(overlay, {
      display: "block",
      clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
      opacity: 1,
    });

    gsap.to(overlay, {
      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
      duration: MOTION.durations.portal * 0.6,
      ease: "power3.inOut",
      onComplete: () => {
        startTransition(() => {
          router.push(href);

          // Small timeout to allow Next.js route swap before wiping out
          setTimeout(() => {
            gsap.to(overlay, {
              clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
              duration: MOTION.durations.portal * 0.6,
              ease: "power3.inOut",
              onComplete: () => {
                gsap.set(overlay, { display: "none" });
                isTransitioningRef.current = false;
              },
            });
          }, 150);
        });
      },
    });
  };

  return (
    <TransitionContext.Provider value={{ navigateWithWipe, isPending }}>
      {/* Wipe overlay */}
      <div
        ref={overlayRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[10000] hidden bg-[var(--bg-canvas)] border-b border-[var(--border-subtle)]"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-2 border-black/20 dark:border-white/20 border-t-neutral-900 dark:border-t-white animate-spin" />
        </div>
      </div>
      {children}
    </TransitionContext.Provider>
  );
}

export function TransitionLink({
  href,
  children,
  className,
  ...props
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) {
  const { navigateWithWipe } = usePageTransition();

  return (
    <a
      href={href}
      className={className}
      onClick={(e) => {
        // If external link, don't hijack
        if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("#")) {
          return;
        }
        e.preventDefault();
        navigateWithWipe(href);
      }}
      {...props}
    >
      {children}
    </a>
  );
}

