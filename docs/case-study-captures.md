# Case Study Visual Captures & Analysis

This document catalogs every captured visual asset for Sportz, AppForge, and StreamMart, maps each to its engineering story beat, and details the visual curation decisions.

---

## 1. SPORTZ (Sockets Real-Time Telemetry Engine)

### Live Deployment
- **URL**: `https://sportz-rho.vercel.app` (Backend on Render free tier + Neon PostgreSQL)
- **Status**: Live, verified active, connected over WebSocket protocol RFC 6455.

### All Captured Visuals & Analysis
1. `public/projects/sockets/sportz-live-score-update.mp4` & `.webm` (Poster: `sportz-live-score-update-poster.webp`)
   - **What it shows**: 7-second muted screen recording of the live match view as score events fire and win-probability shifts in real time without refreshing.
   - **What it proves to a recruiter**: Demonstrates sub-second end-to-end WebSocket telemetry fanout from API mutation to client UI.
   - **Story beat**: Hook / Result.
2. `public/projects/sockets/sportz-connection-badge.webp`
   - **What it shows**: High-resolution crop of the pulsing green "LIVE CONNECTED" badge in the navigation header.
   - **What it proves to a recruiter**: Shows active duplex connection state lifecycle and heartbeat sweep indicators.
   - **Story beat**: How it works / Decisions.
3. `public/projects/sockets/sportz-match-list.webp`
   - **What it shows**: Responsive grid of live match cards across Football, Cricket, and Basketball with real-time score indicators and filter pills.
   - **What it proves to a recruiter**: Shows multi-sport topic partition architecture where clients can subscribe to specific match rooms.
   - **Story beat**: Problem (isolated topic routing vs global flooding).
4. `public/projects/sockets/sportz-live-match.webp`
   - **What it shows**: The focused match view featuring the active scoreboard, win-probability distribution, and quick simulation controls.
   - **What it proves to a recruiter**: Proves state hydration and live DOM updates driven strictly by server push packets.
   - **Story beat**: How it works.
5. `public/projects/sockets/sportz-commentary-feed.webp`
   - **What it shows**: Timestamped minute-by-minute live commentary stream with event tags (`#BOUNDARY`, `#SIX`, `#WICKET`).
   - **What it proves to a recruiter**: Proves ordered event stream processing and message serialization.
   - **Story beat**: How it works.
6. `public/projects/sockets/sportz-mobile.webp`
   - **What it shows**: Viewport 390×844 capture of the match score view on mobile.
   - **What it proves to a recruiter**: Demonstrates responsive layout and mobile connection recovery behavior.
   - **Story beat**: Result / Decisions (zombie socket sweeps on mobile network drops).

### Visual Selection for Sportz (5 Selected, 1 Dropped)
- **Selected**:
  1. `sportz-live-score-update.mp4` / `.webm` (Hero Hook clip)
  2. `sportz-match-list.webp` (Problem & topic routing)
  3. `sportz-live-match.webp` (How it works main layout)
  4. `sportz-commentary-feed.webp` (Real-time telemetry feed)
  5. `sportz-connection-badge.webp` (Connection lifecycle & heartbeat)
- **Dropped**:
  - `shots/temp-sportz/badge.png` raw uncropped asset: dropped because `sportz-connection-badge.webp` provides the optimized, web-ready crop.
  - Auto-sim modal raw dump: dropped because the focused scoreboard change and commentary feed demonstrate the actual user experience much more clearly without modal clutter.

---

## 2. APPFORGE (AI App Builder & AST Engine)

### Live Deployment
- **URL**: `https://appforge-studios.vercel.app` (Next.js 15, Vercel Edge Runtime, Groq LPU)
- **Status**: Live, verified active.

### All Captured Visuals & Analysis
1. `public/projects/appforge/appforge-prompt-to-app.mp4` & `.webm` (Poster: `appforge-prompt-to-app-poster.webp`)
   - **What it shows**: 8-second clip of natural language prompt input ("Generate a fleet logistics dashboard...") streaming into typed React components.
   - **What it proves to a recruiter**: Demonstrates streaming token ingestion from Groq LPUs directly into an AST renderer with zero eval().
   - **Story beat**: Hook / Result.
2. `public/projects/appforge/appforge-prompt-input.webp`
   - **What it shows**: Focused crop of the AI Copilot modal with the user's natural language prompt and model submission action.
   - **What it proves to a recruiter**: Shows the input boundary and prompt engineering interface.
   - **Story beat**: The Problem / Hook.
3. `public/projects/appforge/appforge-editor-view.webp`
   - **What it shows**: Code editor panel displaying the validated JSON AST tree (`app`, `pages`, `components`, typed props).
   - **What it proves to a recruiter**: Proves structured metadata output and Zod boundary validation rather than unsafe raw JavaScript code strings.
   - **Story beat**: How it works (AST vs raw eval).
4. `public/projects/appforge/appforge-app-preview.webp`
   - **What it shows**: Right-hand canvas displaying the mounted React interface with operational metrics, status tables, and action buttons.
   - **What it proves to a recruiter**: Demonstrates deterministic DOM primitive rendering from a verified component registry.
   - **Story beat**: How it works / Decisions.
5. `public/projects/appforge/appforge-generating.webp`
   - **What it shows**: Live compilation transition state while tokens are streaming and validating.
   - **What it proves to a recruiter**: Shows edge streaming pipeline handling chunked transfers without blocking.
   - **Story beat**: Decisions (Edge runtime over buffered lambdas).
6. `public/projects/appforge/appforge-mobile.webp`
   - **What it shows**: Viewport 390×844 capture of the builder and rendered app on mobile.
   - **What it proves to a recruiter**: Demonstrates responsive canvas scaling on constrained viewports.
   - **Story beat**: Result.

### Visual Selection for AppForge (5 Selected, 1 Dropped)
- **Selected**:
  1. `appforge-prompt-to-app.mp4` / `.webm` (Hero Hook clip)
  2. `appforge-prompt-input.webp` (Prompt ingestion & problem framing)
  3. `appforge-editor-view.webp` (Structured JSON AST specification)
  4. `appforge-app-preview.webp` (Safe React component registry render)
  5. `appforge-generating.webp` (Edge streaming state)
- **Dropped**:
  - `shots/appforge-initial.png` full page landing dump: dropped because the builder interface (`appforge-editor-view.webp` and `appforge-app-preview.webp`) directly showcases the core product engineering rather than marketing copy.

---

## 3. STREAMMART (Distributed E-Commerce Microservices)

### Environment & Architecture Status
- **Status**: Backend event-driven microservices architecture (Node.js, Apache Kafka, PostgreSQL Outbox, Docker Compose).
- **Repo-Grounded Visual Policy**: Docker was not run to produce fake logs. In accordance with honesty rules, no fake terminal windows, simulated logs, or faux live outputs are permitted.
- **Deletions**:
  1. `stream-mart-outbox-terminal.webp`: DELETED. Generated artificially from `public/projects/stream-mart-flow.html` via Playwright crop without running real microservices.
  2. `stream-mart-mobile.webp`: DELETED. Generated artificially from mobile viewport crop of `stream-mart-flow.html`.
- **Allowed Visuals Implemented**:
  1. **Architecture & Event-Flow Diagram**: Directly derived from `README.md` lines 18-36 (Mermaid) and `docker-compose.yml`. Clearly labeled "Diagram" on the page. Every box and arrow matches a file in the repo (`client/src/app/page.jsx`, `api-gateway/index.js`, `payment-service/index.js`, `payment-service/db/schema.js`, `payment-service/worker.js`, `kafka/admin.js`, `order-service/index.js`, `analytic-service/index.js`, `email-service/index.js`).
  2. **Real Code Excerpts with Copy**: Displayed in `InteractiveArchitecture.tsx` and `StreamMartDiagram.tsx` with file paths, syntax highlighting, and clipboard copy buttons. These replace all fake terminal windows.
     - Outbox write inside DB transaction: `payment-service/index.js#L45-L61`
     - Relay/publisher worker loop: `payment-service/worker.js#L29-L53`
     - Kafka topic administrator: `kafka/admin.js#L10-L19`
     - Async Order consumer: `order-service/index.js#L25-L60`
     - API Gateway reverse proxy: `api-gateway/index.js#L13-L24`
  3. **Sample Output Check**: Checked `d:\Projects\StreamMart\README.md`. It contains no sample CLI/terminal output, so no quotes were fabricated.

