<div align="center">

# Vipin Kaushik

### Full-Stack Developer & Backend Systems Engineer
**Dual Degree, Indian Institute of Technology (IIT) Kharagpur (2022 – 2027)**  
*Graduating April 2027 · Actively seeking Software Development Engineer (SDE) roles*

[![Website](https://img.shields.io/badge/Live_Portfolio-vipinkaushik.dev-0c0f16?style=for-the-badge&logo=vercel&logoColor=white)](https://vipinkaushik.dev)
[![GitHub](https://img.shields.io/badge/GitHub-vpn--cli-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/vpn-cli)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-vpnk2003-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/vpnk2003)
[![Email](https://img.shields.io/badge/Email-vipinkaushik20771041@gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:vipinkaushik20771041@gmail.com)

<br />

[![Next.js 15](https://img.shields.io/badge/Next.js_15-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![GSAP 3](https://img.shields.io/badge/GSAP_3-88CE02?style=flat-square&logo=greensock&logoColor=white)](https://greensock.com/gsap/)
[![Three.js](https://img.shields.io/badge/Three.js_R3F-000000?style=flat-square&logo=threedotjs&logoColor=white)](https://threejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Apache Kafka](https://img.shields.io/badge/Apache_Kafka-231F20?style=flat-square&logo=apachekafka&logoColor=white)](https://kafka.apache.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)

</div>

---

## 📌 Overview

This repository houses the source code for **[vipinkaushik.dev](https://vipinkaushik.dev)**, my personal engineering portfolio, systems playground, and case study showcase.

I specialize in building full-stack web applications and resilient distributed backends—focusing on event-driven streaming with Apache Kafka, real-time WebSocket pipelines, transactional consistency patterns, and high-performance user interfaces.

The portfolio is architected as an interactive **Bento Grid Hub** paired with an **Interactive Systems Workbench**, deep technical case studies, and a real-time 3D companion ("Byte") engineered with React Three Fiber.

---

## 🏛 Core Engineering Projects & Deep Dives

Each featured project includes an in-depth case study analyzing real production bugs, architecture decisions, trade-offs, and verifiable system workflows:

### 1. [StreamMart](https://github.com/vpn-cli/StreamMart) — Event-Driven Microservices Backend
> **Category:** Distributed Systems & Microservices · [Read Case Study](https://vipinkaushik.dev/work/stream-mart) · [GitHub](https://github.com/vpn-cli/StreamMart)
- **Problem Solved:** Prevents dual-write inconsistencies and data loss between database operations and asynchronous message brokers across distributed payment and order services.
- **Architecture:** Implements the **Transactional Outbox Pattern** with **Apache Kafka** and **PostgreSQL**. Atomically commits order states and outbox events in a single SQL transaction; a dedicated relay worker continuously polls and reliably dispatches events to partitioned Kafka topics.
- **Tech Stack:** Node.js, Express, Apache Kafka, PostgreSQL, Docker, JWT Authentication.

### 2. [Sportz Sockets Engine](https://github.com/vpn-cli/sockets) — Real-Time Match Broadcasting Hub
> **Category:** Real-Time Networking & Distributed State · [Live App](https://sportz-rho.vercel.app) · [Read Case Study](https://vipinkaushik.dev/work/sockets) · [GitHub](https://github.com/vpn-cli/sockets)
- **Problem Solved:** Eliminates client polling overhead for live sports scores by maintaining stateful persistent WebSocket connections with topic-based fanout.
- **Architecture:** High-throughput `ws` gateway with partitioned match room subscriptions. Scores are ingested via authenticated REST webhooks, persisted to PostgreSQL via Drizzle ORM, and broadcasted to subscriber clusters in $O(k)$ time. Shielded against scraping and abuse via **Arcjet** rate limiting.
- **Tech Stack:** Node.js, TypeScript, WebSockets (`ws`), Drizzle ORM, PostgreSQL, Arcjet, React.

### 3. [AppForge](https://github.com/vpn-cli/appforge) — Generative AI Application Engine
> **Category:** Generative AI & Developer Tools · [Live App](https://appforge-studios.vercel.app) · [Read Case Study](https://vipinkaushik.dev/work/appforge) · [GitHub](https://github.com/vpn-cli/appforge)
- **Problem Solved:** Generates executable UI components and schemas from natural language while strictly eliminating arbitrary `eval()` and client-side code injection vulnerabilities.
- **Architecture:** Streams prompt tokens through **Groq LPU (Llama-3.3-70B)** directly into structured JSON Abstract Syntax Tree (AST) definitions. Validates AST nodes against strict **Zod** boundary schemas before mounting nodes onto a constrained, pre-compiled React component registry.
- **Tech Stack:** Next.js 15, TypeScript, Groq LPU, Llama-3.3-70B, Zod, Upstash Redis, Upstash Kafka, Supabase, Tailwind CSS.

---

## ⚡ Portfolio Architecture & Engineering Highlights

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            vipinkaushik.dev                                 │
├───────────────────────┬─────────────────────────────┬───────────────────────┤
│    Bento Grid Hub     │     Systems Workbench       │      Interactive 3D   │
│  - 8 Responsive Tiles │  - Live Kafka CDC Simulator │  - "Byte" Companion   │
│  - Physics 3D Tilt    │  - WebSocket Room Monitor   │  - R3F & Drei Shaders │
│  - Specular Beams     │  - AST Parser Playground    │  - Gyro Cursor Lerp   │
├───────────────────────┴─────────────────────────────┴───────────────────────┤
│                           Motion & Interaction Core                         │
│  - GSAP 3 SplitText Choreography       - Lenis Velocity Scroll Sync         │
│  - Apple Spring Easing (0.16, 1, 0.3, 1)- Cinematic Route Transitions       │
├─────────────────────────────────────────────────────────────────────────────┤
│                          Infrastructure & Security                          │
│  - Next.js 15 App Router + React 19   - Neon Serverless PostgreSQL          │
│  - Arcjet Bot & Rate-Limit Shield     - PostHog & Vercel Web Analytics      │
│  - WCAG 2.1 AA & prefers-reduced-motion - Locked SVG Film-Grain Texture     │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1. Physics-Based Bento Grid (`components/tiles/BentoTile.tsx`)
- High-frequency pointer-tracked 3D tilt built with `gsap.quickTo` (`rotateX`, `rotateY`, `scale`) for zero-lag 60fps tracking.
- Specular spotlight illumination dynamically tracks cursor coordinates over Apple continuous squircle borders (`rounded-[32px]`).

### 2. "Byte" — The Interactive 3D Companion (`components/tiles/ByteTile.tsx` & `components/three/`)
- Powered by **React Three Fiber (R3F)** and **Drei** (`MeshTransmissionMaterial`).
- Features dynamic optical glass refraction, chromatic aberration, and specular rim highlights.
- Viscous gyroscopic cursor inertia tracking with smooth organic floating physics.
- Automatically suspends WebGL render loops via `IntersectionObserver` when scrolled offscreen to conserve client GPU cycles.

### 3. Interactive Systems Workbench (`app/about/page.tsx` & `components/about/`)
- Embedded telemetry simulators allowing visitors to test and inspect backend mechanics directly in the browser:
  - **Kafka Outbox:** Visualizes ACID database commits, Debezium CDC polling, topic partitioning, and consumer acknowledgments.
  - **WebSocket Gateway:** Demonstrates client connection upgrade handshakes, Arcjet rate limiting, room subscriptions, and broadcast fanout.
  - **AST Parser:** Visualizes streaming prompt ingestion, Zod schema validation, and safe component tree compilation.

### 4. Cinematic Motion Choreography & Transitions
- **Character & Line Masking:** SplitText typography reveals using custom `"apple-spring"` bezier easing (`cubic-bezier(0.16, 1, 0.3, 1)`).
- **Lenis Velocity Marquee:** Continuously synchronizes tech stack marquee speed with the user's scroll inertia, pausing on pointer hover.
- **Route Portal Transitions:** Dynamic geometric clip-path wipes between pages to eliminate jarring layout shifts.

### 5. Accessibility & Reduced Motion
- Full compliance with **WCAG 2.1 AA** standards (color contrast ratios, accessible ARIA labeling, logical heading hierarchy, and keyboard focus rings).
- Strictly honors `(prefers-reduced-motion: reduce)` across all GSAP timelines, Lenis smooth scrolling, Three.js animations, and 3D tilt effects.

---

## 📂 Repository Structure

```
portfolio/
├── app/                        # Next.js 15 App Router routes & layouts
│   ├── about/                  # About page: IIT KGP, experience, interactive workbench
│   ├── api/                    # API routes (Arcjet defense, telemetry, pats-regions)
│   ├── projects/               # Project listing & filter views
│   ├── resources/              # Curated developer templates & kits
│   ├── work/[slug]/            # Deep-dive case studies (StreamMart, Sportz, AppForge)
│   ├── globals.css             # Tailwind CSS v4 design tokens & locked film-grain
│   └── layout.tsx              # Root layout with providers, fonts, and metadata
├── components/                 # Modular React components
│   ├── about/                  # About hero, workbench, experience, and principles
│   ├── case-study/             # Case study view, hero clips, architecture diagrams, bugs
│   ├── motion/                 # BentoGrid, CustomCursor, Lenis provider, RouteTransition
│   ├── stageshow/              # Frame, browser chrome, and screen preview wrappers
│   ├── three/                  # Three.js canvas, prism shaders, and Byte companion
│   └── tiles/                  # Individual Bento Grid tile components
├── content/
│   └── site.ts                 # Centralized profile, experience, stack, and resource data
├── data/
│   └── projects.ts             # Truthful project data, metrics, architecture nodes, and bug post-mortems
├── public/                     # Static media, project screenshots, and video clips
└── scripts/                    # Automation and utility scripts
```

---

## 🛠 Tech Stack Summary

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | [Next.js 15](https://nextjs.org/) (App Router), [React 19](https://react.dev/) |
| **Styling & Design** | [Tailwind CSS v4](https://tailwindcss.com/), Custom Design Tokens, SVG Film-Grain Filter |
| **Animation & Physics** | [GSAP 3](https://greensock.com/gsap/) (`ScrollTrigger`, `Flip`, `SplitText`, `CustomEase`), [Lenis](https://lenis.darkroom.engineering/) |
| **3D Graphics & Shaders** | [Three.js](https://threejs.org/), [@react-three/fiber](https://r3f.docs.pmnd.rs/), [@react-three/drei](https://github.com/pmndrs/drei) |
| **Backend & Databases** | Node.js, Express, [PostgreSQL](https://www.postgresql.org/), [Neon Serverless](https://neon.tech/), [Drizzle ORM](https://orm.drizzle.team/) |
| **Streaming & Messaging** | [Apache Kafka](https://kafka.apache.org/), WebSockets (`ws`), [Upstash Redis](https://upstash.com/) |
| **Security & Analytics** | [Arcjet](https://arcjet.com/) (Rate Limiting, Bot Protection), [PostHog](https://posthog.com/), [Vercel Analytics](https://vercel.com/analytics) |
| **Icons & Tooling** | [Lucide React](https://lucide.dev/), [TypeScript](https://www.typescriptlang.org/), [Docker](https://www.docker.com/), [Git](https://git-scm.com/) |

---

## 🚀 Getting Started Locally

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: `v20.x` or higher
- **npm**: `v10.x` or higher (or `pnpm` / `yarn`)
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/vpn-cli/portfolio.git
cd portfolio
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the project root based on `.env.example`:
```bash
cp .env.example .env.local
```

Fill in your configuration keys:
```env
# PostHog Analytics (Optional for local testing)
NEXT_PUBLIC_POSTHOG_KEY=phc_your_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# Database Connection (Neon Serverless Postgres)
DATABASE_URL=postgresql://user:password@endpoint.neon.tech/neondb?sslmode=require

# Arcjet Security & Bot Protection
ARCJET_KEY=ajkey_your_key_here

# Secret Admin Key (for internal inspection endpoints)
ADMIN_KEY=your_secret_admin_key
```

### 4. Start the Development Server
```bash
npm run dev
```

Navigate to **[http://localhost:3000](http://localhost:3000)** to explore the portfolio in development mode.

---

## 📜 Available NPM Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server with Turbopack enabled. |
| `npm run dev:clean` | Wipes `.next` build cache and restarts dev server with a fresh state. |
| `npm run build` | Compiles optimized production bundle and validates TypeScript & CSS. |
| `npm run start` | Serves the production build locally. |
| `npm run lint` | Runs Next.js ESLint validation checks across the codebase. |

---

## 📬 Contact & Connect

I am currently in my final year at **IIT Kharagpur** (graduating April 2027) and actively seeking **Software Development Engineer (SDE)** roles focusing on backend systems, distributed architectures, and full-stack engineering.

- **Portfolio:** [vipinkaushik.dev](https://vipinkaushik.dev)
- **GitHub:** [@vpn-cli](https://github.com/vpn-cli)
- **LinkedIn:** [linkedin.com/in/vpnk2003](https://www.linkedin.com/in/vpnk2003)
- **Email:** [vipinkaushik20771041@gmail.com](mailto:vipinkaushik20771041@gmail.com)

---

<div align="center">
  <sub>Designed & engineered by Vipin Kaushik · Built with Next.js 15, GSAP, and Tailwind CSS v4</sub>
</div>
