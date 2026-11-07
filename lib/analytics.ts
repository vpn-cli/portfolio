import posthog from "posthog-js";

export const ENABLE_REPLAY = false;

export type OutboundDestination =
  | "github"
  | "linkedin"
  | "resume"
  | "email"
  | "project_live"
  | "project_repo"
  | "other";

export type PageType =
  | "home"
  | "about"
  | "projects"
  | "work"
  | "case_study"
  | "resources"
  | "not_found";

export interface AnalyticsEvents {
  $pageview: {
    $current_url: string;
    route_label: string;
    page_type: PageType;
  };
  nav_click: {
    from_path: string;
    to_path: string;
    location: string;
    label: string;
    referrer_domain?: string;
  };
  outbound_click: {
    destination: OutboundDestination;
    url: string;
    location: string;
    label?: string;
  };
  project_preview: {
    project: string;
  };
  project_open: {
    project: string;
    from_path: string;
    referrer_domain?: string;
  };
  email_copy: {
    location: string;
  };
  theme_toggle: {
    to: "light" | "dark";
  };
  byte_viewed: Record<string, never>;
  byte_scene_loaded: {
    load_ms: number;
  };
  byte_scene_failed: {
    reason: "no_webgl" | "load_error";
  };
  byte_pat_batch: {
    count: number;
    session_total: number;
  };
  case_study_read: {
    project: string;
    max_scroll_pct: number;
  };
}

interface QueuedEvent {
  name: string;
  properties?: Record<string, any>;
}

const eventQueue: QueuedEvent[] = [];
let posthogLoaded = false;
let initScheduled = false;

function isDebugEnabled(): boolean {
  if (process.env.NEXT_PUBLIC_POSTHOG_DEBUG === "true") return true;
  if (typeof window !== "undefined") {
    if ((window as any).__POSTHOG_DEBUG === true) return true;
    try {
      if (window.localStorage && window.localStorage.getItem("posthog_debug") === "true") return true;
    } catch {}
  }
  return false;
}

function isProdEnv(): boolean {
  return process.env.NODE_ENV === "production";
}

function isLocalEnvironment(): boolean {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return host === "localhost" || host === "127.0.0.1" || host.endsWith(".local");
}

function isBotSuspect(): boolean {
  if (isDebugEnabled()) return false;
  if (typeof navigator === "undefined") return false;
  return Boolean(navigator.webdriver);
}

export function initPostHog(): void {
  if (typeof window === "undefined" || initScheduled) return;
  initScheduled = true;

  const runInit = () => {
    // Obvious bot hygiene: skip PostHog initialization entirely
    if (isBotSuspect()) {
      return;
    }

    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";
    const debug = isDebugEnabled();
    const prod = isProdEnv();
    const local = isLocalEnvironment();

    // Skip all tracking on localhost and when NODE_ENV !== "production", unless NEXT_PUBLIC_POSTHOG_DEBUG=true
    if ((!prod || local) && !debug) {
      return;
    }

    if (!key) {
      if (debug) {
        console.log("[PostHog] NEXT_PUBLIC_POSTHOG_KEY not set. Debug events will be recorded locally.");
        posthogLoaded = true;
        // Flush queue in debug mode
        flushQueue(null);
      }
      return;
    }

    posthog.init(key, {
      api_host: "/ingest",
      ui_host: host,
      capture_pageview: false,
      capture_pageleave: true,
      autocapture: true,
      rageclick: true,
      enable_heatmaps: true,
      person_profiles: "identified_only",
      respect_dnt: true,
      disable_session_recording: !ENABLE_REPLAY,
      session_recording: ENABLE_REPLAY
        ? {
          sampleRate: 0.2,
          maskAllInputs: true,
        }
        : undefined,
      loaded: (ph) => {
        posthogLoaded = true;
        ph.register({
          is_bot_suspect: false,
        });
        if (debug) {
          ph.debug();
          console.log("[PostHog] Loaded with debug mode active.");
        }
        flushQueue(ph);
      },
    });
  };

  // Initialize PostHog after the page is interactive inside requestIdleCallback (fallback setTimeout 1500ms)
  if ("requestIdleCallback" in window) {
    (window as any).requestIdleCallback(runInit, { timeout: 1500 });
  } else {
    setTimeout(runInit, 1500);
  }
}

function flushQueue(ph: { capture: (name: string, properties?: any) => void } | null): void {
  while (eventQueue.length > 0) {
    const item = eventQueue.shift();
    if (item && ph) {
      ph.capture(item.name, item.properties);
    }
  }
}

function recordDebugCapture(name: string, properties?: Record<string, any>): void {
  if (typeof window !== "undefined") {
    (window as any).__posthogEvents = (window as any).__posthogEvents || [];
    const item = {
      name,
      properties: properties ? { ...properties } : {},
      timestamp: Date.now(),
    };
    (window as any).__posthogEvents.push(item);
    if (typeof (window as any).__recordPostHogEvent === "function") {
      try {
        (window as any).__recordPostHogEvent(item);
      } catch {}
    }
    if (isDebugEnabled() || !isProdEnv()) {
      console.log(`[PostHog Capture] ${name}`, properties || {});
    }
  }
}

/**
 * Defers executing a callback until the browser is idle.
 * If a route transition is currently active, re-defers until transition completion.
 */
export function deferUntilIdle(callback: () => void): void {
  if (typeof window === "undefined") return;

  const run = () => {
    if (typeof window !== "undefined" && (window as any).__isTransitioning) {
      if ("requestIdleCallback" in window) {
        (window as any).requestIdleCallback(run, { timeout: 1000 });
      } else {
        setTimeout(run, 100);
      }
      return;
    }
    callback();
  };

  if ("requestIdleCallback" in window) {
    (window as any).requestIdleCallback(run, { timeout: 2000 });
  } else {
    setTimeout(run, 0);
  }
}

/**
 * Fires a strongly-typed analytics event fire-and-forget.
 * Never awaits or blocks user action.
 */
export function trackEvent<K extends keyof AnalyticsEvents>(
  name: K,
  properties: AnalyticsEvents[K]
): void {
  // Obvious bot hygiene: ignore
  if (isBotSuspect()) return;

  const debug = isDebugEnabled();
  const prod = isProdEnv();
  const local = isLocalEnvironment();

  // Skip tracking if not production/localhost, unless debug mode enabled
  if ((!prod || local) && !debug) {
    recordDebugCapture(name, properties);
    return;
  }

  recordDebugCapture(name, properties);

  if (typeof window !== "undefined" && posthog.__loaded) {
    posthog.capture(name, properties);
  } else {
    // Queue event until PostHog finishes loading
    eventQueue.push({ name, properties });
  }
}

/**
 * Track page view with URL, route label and page type.
 */
export function trackPageView(
  url: string,
  properties: Omit<AnalyticsEvents["$pageview"], "$current_url">
): void {
  if (isBotSuspect()) return;

  const debug = isDebugEnabled();
  const prod = isProdEnv();
  const local = isLocalEnvironment();

  const payload: AnalyticsEvents["$pageview"] = {
    $current_url: url,
    route_label: properties.route_label,
    page_type: properties.page_type,
  };

  recordDebugCapture("$pageview", payload);

  if ((!prod || local) && !debug) {
    return;
  }

  if (typeof window !== "undefined" && posthog.__loaded) {
    posthog.capture("$pageview", payload);
  } else {
    eventQueue.push({ name: "$pageview", properties: payload });
  }
}

/**
 * Resolves outbound click destination strictly adhering to:
 * - Any URL on github.com that points to a repository must be "project_repo"
 * - The profile link (github.com/vpn-cli exactly) stays "github"
 * - mailto: -> "email"
 * - /resume.pdf or resume -> "resume"
 * - linkedin.com -> "linkedin"
 * - vercel.app or http/https live links -> "project_live"
 * - fallback / other -> "other"
 */
export function getOutboundDestination(href: string, explicit?: OutboundDestination): OutboundDestination {
  const cleanHref = href.trim();

  // Check for github.com URLs first
  try {
    const url = new URL(cleanHref, "https://portfolio.local");
    const hostname = url.hostname.toLowerCase().replace(/^www\./, "");
    if (hostname === "github.com") {
      const segments = url.pathname.split("/").filter(Boolean);
      // github.com/vpn-cli exactly (with or without trailing slash)
      if (segments.length === 1 && segments[0].toLowerCase() === "vpn-cli") {
        return "github";
      }
      // Any other path with repo (e.g. /vpn-cli/StreamMart, /vpn-cli/StreamMart/...)
      if (segments.length >= 2) {
        return "project_repo";
      }
      return "github";
    }
  } catch {
    if (cleanHref.includes("github.com")) {
      if (/github\.com\/vpn-cli\/?(?:$|[?#])/i.test(cleanHref)) {
        return "github";
      }
      return "project_repo";
    }
  }

  // If explicit destination is provided (and not overridden by github rules)
  if (explicit) return explicit;

  if (cleanHref.startsWith("mailto:")) return "email";
  if (cleanHref.includes("/resume.pdf") || cleanHref.includes("resume")) return "resume";
  if (cleanHref.includes("linkedin.com")) return "linkedin";
  if (cleanHref.includes("vercel.app") || cleanHref.startsWith("http://") || cleanHref.startsWith("https://")) {
    return "project_live";
  }
  return "other";
}

/**
 * Extracts referrer domain from document.referrer (domain only, or "direct" if empty/invalid).
 */
export function getReferrerDomain(): string {
  if (typeof document === "undefined" || !document.referrer) {
    return "direct";
  }
  try {
    const url = new URL(document.referrer);
    return url.hostname.replace(/^www\./, "") || "direct";
  } catch {
    return "direct";
  }
}
