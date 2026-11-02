"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initPostHog, trackEvent, trackPageView } from "@/lib/analytics";

function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname && typeof window !== "undefined") {
      let url = window.origin + pathname;
      if (searchParams && searchParams.toString()) {
        url = `${url}?${searchParams.toString()}`;
      }
      trackPageView(url);
    }
  }, [pathname, searchParams]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initPostHog();

    const handleCustomEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ name: string; properties?: Record<string, any> }>;
      if (customEvent.detail && customEvent.detail.name) {
        trackEvent(customEvent.detail.name, customEvent.detail.properties);
      }
    };

    window.addEventListener("portfolio-analytics", handleCustomEvent);
    return () => window.removeEventListener("portfolio-analytics", handleCustomEvent);
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
      {children}
    </>
  );
}
