"use client";

import { useEffect, useRef, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initPostHog, trackEvent, trackPageView, PageType, AnalyticsEvents } from "@/lib/analytics";
import { getRouteLabel } from "@/components/motion/RouteTransition";

function getPageType(pathname: string): PageType {
  if (pathname === "/") return "home";
  if (pathname === "/about") return "about";
  if (pathname === "/projects") return "projects";
  if (pathname === "/work") return "work";
  if (pathname.startsWith("/work/")) return "case_study";
  if (pathname === "/resources") return "resources";
  return "not_found";
}

function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedUrl = useRef<string | null>(null);

  useEffect(() => {
    if (pathname && typeof window !== "undefined") {
      let url = window.origin + pathname;
      const search = searchParams?.toString();
      if (search) {
        url = `${url}?${search}`;
      }

      // Ensure pageview fires exactly once per route change including back/forward
      if (lastTrackedUrl.current === url) return;
      lastTrackedUrl.current = url;

      const route_label = getRouteLabel(pathname);
      const page_type = getPageType(pathname);

      trackPageView(url, {
        route_label,
        page_type,
      });
    }
  }, [pathname, searchParams]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initPostHog();

    const handleCustomEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ name: keyof AnalyticsEvents; properties?: any }>;
      if (customEvent.detail && customEvent.detail.name) {
        trackEvent(customEvent.detail.name as any, customEvent.detail.properties);
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
