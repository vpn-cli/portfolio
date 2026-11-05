"use client";

import { createContext, useContext, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { registerGSAPPlugins } from "@/lib/motion";

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

    // Fast, crisp wipe in animation
    gsap.set(overlay, {
      display: "block",
      clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
      opacity: 1,
    });

    gsap.to(overlay, {
      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
      duration: 0.22,
      ease: "power2.out",
      onComplete: () => {
        startTransition(() => {
          router.push(href);

          // Fast wipe out on route swap with zero artificial lag
          requestAnimationFrame(() => {
            gsap.to(overlay, {
              clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
              duration: 0.22,
              ease: "power2.inOut",
              onComplete: () => {
                gsap.set(overlay, { display: "none" });
                isTransitioningRef.current = false;
              },
            });
          });
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
      />
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
  children?: React.ReactNode;
  className?: string;
  [key: string]: any;
}) {
  const { navigateWithWipe } = usePageTransition();
  const router = useRouter();

  const handlePrefetch = () => {
    if (!href.startsWith("http") && !href.startsWith("mailto:") && !href.startsWith("#")) {
      router.prefetch(href);
    }
  };

  return (
    <a
      href={href}
      className={className}
      onMouseEnter={handlePrefetch}
      onFocus={handlePrefetch}
      onTouchStart={handlePrefetch}
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
