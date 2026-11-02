import posthog from "posthog-js";

const isProd = process.env.NODE_ENV === "production";

export function initPostHog() {
  if (typeof window === "undefined") return;

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

  if (!key) {
    if (!isProd) {
      console.log("[PostHog] NEXT_PUBLIC_POSTHOG_KEY not set. Analytics disabled.");
    }
    return;
  }

  // Only initialize PostHog in production builds to prevent polluting analytics data
  if (!isProd) {
    console.log("[PostHog] Development environment detected: analytics will log locally only.");
    return;
  }

  posthog.init(key, {
    api_host: "/ingest",
    ui_host: host,
    // Privacy: run without tracking cookies (memory persistence)
    persistence: "memory",
    // Privacy: respect Do Not Track
    respect_dnt: true,
    // Privacy: no session recording of inputs, no cookie banner needed
    disable_session_recording: true,
    // App Router route changes handled manually
    capture_pageview: false,
    capture_pageleave: true,
  });
}

export function trackEvent(name: string, properties?: Record<string, any>) {
  if (!isProd) {
    console.log(`[PostHog dev event] ${name}`, properties || {});
    return;
  }

  if (typeof window !== "undefined" && posthog.__loaded) {
    posthog.capture(name, properties);
  }
}

export function trackPageView(url: string) {
  if (!isProd) {
    console.log(`[PostHog dev pageview] ${url}`);
    return;
  }

  if (typeof window !== "undefined" && posthog.__loaded) {
    posthog.capture("$pageview", {
      $current_url: url,
    });
  }
}
