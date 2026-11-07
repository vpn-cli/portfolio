# Analytics & Event Taxonomy

This document describes the analytics implementation, event taxonomy, data privacy measures, and bot protection architecture for the portfolio.

## Core Design Principles

1. **Performance First**:
   - PostHog is loaded after the page is interactive via `requestIdleCallback` (with a 1500ms fallback `setTimeout`).
   - All events fired prior to PostHog initialization are queued in-memory and flushed automatically upon initialization.
   - All event captures are fire-and-forget; never awaited inside UI click handlers.
   - Internal navigation clicks (`nav_click`) are deferred via `queueMicrotask` until after route transition wipe animations begin.
   - First Load JS impact is minimal; Session Replay recorder scripts are not loaded by default (`ENABLE_REPLAY = false`).

2. **Data Privacy & Bot Hygiene**:
   - `respect_dnt: true` honors visitor Do Not Track preferences.
   - `person_profiles: "identified_only"` ensures anonymous visitor activity is not linked to persistent identities.
   - Obvious bot visits (`navigator.webdriver === true`) set `is_bot_suspect: true` and are skipped from tracking.
   - Zero IP addresses, cookies, or personal identifiers are stored in the database.
   - Localhost and non-production tracking are suppressed unless `NEXT_PUBLIC_POSTHOG_DEBUG=true`.

3. **Ingest Reverse Proxy**:
   - Routed via Next.js `/ingest` rewrite to avoid ad-blockers and protect client analytics data flow.
   - Preserves visitor geolocation data (`$geoip_country_name`, `$geoip_city_name`).

---

## Event Taxonomy

All events are strictly typed in `lib/analytics.ts`. TypeScript enforces type correctness for event names and property shapes.

| Event Name | Trigger / When it Fires | Properties | Description |
| :--- | :--- | :--- | :--- |
| `$pageview` | Fired once per route change (including back/forward navigation) by `PageViewTracker`. | `route_label: string`<br>`page_type: "home" \| "about" \| "projects" \| "work" \| "case_study" \| "resources" \| "not_found"`<br>`$current_url: string` | Core page view metric enriched with human-readable route label and categorized page type. |
| `nav_click` | Internal navigation links clicked inside `TransitionLink` (deferred via `queueMicrotask`). | `from_path: string`<br>`to_path: string`<br>`location: string`<br>`label: string`<br>`referrer_domain?: string` | Tracks internal user flow between pages. `location` indicates the calling component (`intro_tile`, `about_tile`, `selected_work`, `all_projects`, `case_study_nav`, `back_link`, `inline`). `label` is resolved via `trackLabel -> aria-label -> title -> first heading -> first text node`. `from_path` is the originating in-app path. On direct entries, `referrer_domain` is included. |
| `outbound_click` | Outbound external links clicked in `TransitionLink` or direct links (GitHub, LinkedIn, Résumé, Mail, Live Demos). | `destination: "github" \| "linkedin" \| "resume" \| "email" \| "project_live" \| "project_repo" \| "other"`<br>`url: string`<br>`location: string`<br>`label?: string` | Measures outbound engagement. `destination` categorizes the target destination. Includes readable label. |
| `project_preview` | Active preview changes in "Selected work" bento tile (hover, focus, or auto-advance). | `project: string` | Measures teaser engagement. Debounced to at most once per project per page view. |
| `project_open` | Case study page opened (`/work/[slug]`) on component mount. | `project: string`<br>`from_path: string`<br>`referrer_domain?: string` | Tracks case study entry. `from_path` uses previous in-app path tracked by `RouteTransitionProvider`, or `"external"` on direct landing (with `referrer_domain` from `document.referrer` or `"direct"`). |
| `email_copy` | User clicks the "Copy email" button in ContactTile or AboutContact. | `location: string` | Captures email copy actions with specific origin (`contact_tile`, `about_contact`). |
| `theme_toggle` | User toggles color theme between dark and light mode. | `to: "light" \| "dark"` | Tracks theme preference changes. |
| `byte_pat_batch` | Byte desk companion pat batch sent to `/api/pats` (flushed at most once per 3s or on pagehide). | `count: number`<br>`session_total: number` | Aggregated pat reporting. Avoids firing high-frequency single-pat events to save bandwidth and event limits. |
| `case_study_read` | User navigates away or closes a case study page after reading. | `project: string`<br>`max_scroll_pct: number` | Fired on unmount or `pagehide` only if user scrolled deeper than 25% of the case study. |

---

## Heatmap & Autocapture Annotation

Every link and clickable card includes:
```html
data-ph-capture-attribute-location="<location_name>"
```
This enables PostHog heatmaps, rage-click recordings, and autocapture funnels to filter actions by UI location without relying on brittle DOM selectors.

---

## Byte Pats Endpoint Protection & Admin Telemetry

The `/api/pats` route handler is protected against spam and bots using a multi-layered defense:

1. **Origin Header Enforcement**:
   - Rejects non-site origin requests with `403 Forbidden` (allows `localhost` in development).

2. **Input Validation**:
   - Request bodies are strictly validated via Zod: `{ count: z.number().int().min(1).max(25) }`. Rejects non-conforming inputs with `400 Bad Request`.

3. **Public Endpoint Privacy**:
   - `GET /api/pats` returns strictly `{ total }`. Region telemetry is never exposed publicly.
   - `GET /api/admin/pats-regions` exposes `pats_daily_region` rows exclusively when authenticated via the `x-admin-key` header matching `ADMIN_KEY` using constant-time comparison (`crypto.timingSafeEqual`). Unauthenticated requests return `404 Not Found` to prevent discovery.

4. **Arcjet Multi-Rule Security Pipeline**:
   - `shield({ mode: "LIVE" })`: Blocks automated scanners, scrapers, and malicious request patterns on both `/api/pats` and `/api/admin/pats-regions`.
   - `detectBot({ mode: "LIVE", allow: [] })`: Blocks all automated agents, bots, and curl clients.
   - `tokenBucket`: Rate limits per client IP with a capacity of 120 tokens, refilling at 60 tokens per 60 seconds. Each pat consumes 1 token (`requested = count`).
   - `dailyCap`: 600 pats per IP per day.
   - Hosting Provider / Datacenter IP rejection: blocks automated cloud/hosting IPs.

5. **Privacy-Preserving Geographic Aggregation**:
   - Geolocation is inferred via Arcjet (`decision.ip`) or edge platform headers (`x-vercel-ip-country`, `x-vercel-ip-city`).
   - Stored in `pats_daily_region`: `{ day, country, region, city, pats, requests }`.
   - Never logs IP addresses, user agents, or individual session IDs.

