import { z } from "zod";

export const projectLinkSchema = z.object({
  demo: z.string().url().optional(),
  repo: z.string().url().optional(),
  readme: z.string().url().optional(),
  coldStartNote: z.string().optional(),
});

export const projectTldrSchema = z.object({
  title: z.string(),
  pitch: z.string(),
  summary: z.object({
    problem: z.string(),
    built: z.string(),
    outcome: z.string(),
  }),
  role: z.string(),
  timeline: z.string(),
  stack: z.array(z.string()),
  readingTime: z.string(),
});

export const projectContextSchema = z.object({
  takeaway: z.string(),
  description: z.string(),
});

export const projectProblemSchema = z.object({
  takeaway: z.string(),
  description: z.string(),
  comparison: z.object({
    before: z.object({
      title: z.string(),
      points: z.array(z.string()),
    }),
    after: z.object({
      title: z.string(),
      points: z.array(z.string()),
    }),
  }),
  coreChallenge: z.string(),
});

export const projectGoalItemSchema = z.object({
  label: z.string(),
  detail: z.string(),
});

export const projectGoalsSchema = z.object({
  takeaway: z.string(),
  items: z.array(projectGoalItemSchema),
});

export const projectDecisionSchema = z.object({
  title: z.string(),
  problem: z.string(),
  options: z.array(z.string()),
  chosen: z.string(),
  tradeoff: z.string(),
});

export const projectJourneyChapterSchema = z.object({
  chapter: z.string(),
  timeline: z.string(),
  title: z.string(),
  narrative: z.string(),
  decision: projectDecisionSchema.optional(),
});

export const projectCodeSnippetSchema = z.object({
  filename: z.string(),
  language: z.string(),
  code: z.string(),
  explanation: z.string().optional(),
});

export const projectFlowStepSchema = z.object({
  step: z.number(),
  title: z.string(),
  actor: z.string(),
  description: z.string(),
  codeSnippet: projectCodeSnippetSchema.optional(),
  logLine: z.string().optional(),
});

export const projectChallengeSchema = z.object({
  title: z.string(),
  symptom: z.string(),
  rootCause: z.string(),
  solution: z.string(),
  commitOrPr: z.string().optional(),
});

export const projectMetricSchema = z.object({
  value: z.string(),
  label: z.string(),
  source: z.string(),
});

export const projectResultsSchema = z.object({
  takeaway: z.string(),
  metrics: z.array(projectMetricSchema),
  qualitative: z.array(z.string()),
});

export const projectLearningsSchema = z.object({
  takeaway: z.string(),
  items: z.array(
    z.object({
      title: z.string(),
      detail: z.string(),
    })
  ),
});

export const projectTryItSchema = z.object({
  takeaway: z.string(),
  steps: z.array(z.string()),
});

export const caseStudySchema = z.object({
  slug: z.string(),
  title: z.string(),
  tagline: z.string(),
  category: z.string(),
  year: z.string(),
  client: z.string(),
  role: z.string(),
  timeline: z.string(),
  accentGradient: z.string(),
  image: z.string(),
  videoUrl: z.string().optional(),
  videoPoster: z.string().optional(),
  deviceType: z.enum(["phone-dark", "phone-light", "laptop", "3d"]),
  links: projectLinkSchema,
  tldr: projectTldrSchema,
  context: projectContextSchema,
  problem: projectProblemSchema,
  goals: projectGoalsSchema,
  journey: z.array(projectJourneyChapterSchema),
  flowSteps: z.array(projectFlowStepSchema),
  challenges: z.array(projectChallengeSchema),
  results: projectResultsSchema,
  learnings: projectLearningsSchema,
  tryIt: projectTryItSchema,
  // Backward compatibility fields for homepage tiles
  stack: z.array(z.string()).optional(),
  overviewParagraphs: z.object({ problem: z.string(), built: z.string() }).optional(),
  deliverables: z.array(z.string()),
  metrics: z.array(z.string()),
  overview: z.string(),
  solution: z.string(),
  keyInsights: z.array(z.string()),
  githubUrl: z.string().optional(),
  liveUrl: z.string().optional(),
});

export type CaseStudy = z.infer<typeof caseStudySchema>;

export const projectsRaw: CaseStudy[] = [
  {
    slug: "sockets",
    title: "Sportz Sockets Engine",
    tagline:
      "Push-based real-time event broadcasting architecture delivering sub-second match telemetry and commentary over persistent WebSockets.",
    category: "Distributed Systems & Real-Time",
    year: "2026",
    client: "Open Source",
    role: "Backend & Systems Engineer",
    timeline: "Mar 2025 — Oct 2026",
    accentGradient: "from-neutral-800 via-stone-900 to-black",
    image: "/projects/sockets.jpg",
    videoUrl: "/videos/sockets/brag.mp4",
    videoPoster: "/videos/sockets/brag.jpg",
    deviceType: "phone-light",
    links: {
      demo: "https://sportz-rho.vercel.app",
      repo: "https://github.com/vpn-cli/sockets",
      readme: "https://github.com/vpn-cli/sockets#readme",
      coldStartNote: "Backend may take ~30s to wake on first load (Render free tier)",
    },
    tldr: {
      title: "Sportz Sockets Engine",
      pitch:
        "Engineered an event-driven sports broadcasting gateway using Node.js WebSockets, Neon PostgreSQL, and Arcjet security, slashing end-to-end telemetry delivery to under 80ms.",
      summary: {
        problem:
          "Traditional HTTP client polling overwhelmed server connection pools, spiked database CPU, and delayed crucial live match scores by multiple seconds.",
        built:
          "A decoupled push-based architecture coupling a native ws WebSocket engine with Drizzle ORM on Neon PostgreSQL, topic-isolated in-memory subscriber maps, and Arcjet rate limiting.",
        outcome:
          "Achieved <80ms live frame delivery, cut polling latency by 65%, eliminated socket memory leaks with 30s heartbeat sweeps, and ran stably on zero-cost free-tier hosting.",
      },
      role: "Solo Backend & Systems Architect",
      timeline: "Mar 2025 — Oct 2026",
      stack: [
        "Node.js",
        "Express",
        "ws",
        "PostgreSQL (Neon)",
        "Drizzle ORM",
        "Arcjet",
        "React 19",
        "Vite",
        "Docker",
      ],
      readingTime: "4 min read",
    },
    context: {
      takeaway: "In live sports broadcasting, every second of lag breaks viewer immersion.",
      description:
        "When fans follow a live football match or cricket fixture, scores and tactical events need to appear instantaneously. A delayed notification from a chat group shouldn't beat the live match tracker on screen.",
    },
    problem: {
      takeaway: "HTTP client polling creates a heavy, laggy feedback loop under live match volume.",
      description:
        "Every client sending recurring GET requests every 2 seconds consumes TCP handshakes, headers, and database connections. Under sudden spectator spikes during a goal or wicket, database connection pools exhaust and delivery latency climbs past 3–5 seconds.",
      comparison: {
        before: {
          title: "Traditional HTTP Polling",
          points: [
            "Clients poll /matches/:id every 2000ms regardless of game state",
            "Repeated HTTP request-header overhead (cookies, headers, SSL renegotiation)",
            "Scores stall behind queue wait times; high DB connection exhaustion risk",
            "No server-driven instant push; data arrives late by up to 2 seconds",
          ],
        },
        after: {
          title: "Sportz Persistent WebSocket Push",
          points: [
            "Single persistent TCP handshake with Arcjet rate limit validation",
            "Zero HTTP header overhead per frame; lightweight raw JSON messages",
            "Instant broadcast on DB mutation via in-memory topic Sets in under 80ms",
            "30-second server ping/pong heartbeats cleanly reap orphaned connections",
          ],
        },
      },
      coreChallenge:
        "How to push high-frequency match telemetry to concurrent fans with sub-second latency while surviving free-tier memory and database connection limits.",
    },
    goals: {
      takeaway: "Deliver ultra-low latency within strict free-tier resource boundaries.",
      items: [
        {
          label: "Sub-Second Latency",
          detail: "Push score mutations and commentary frames from DB commit to edge client within <80ms.",
        },
        {
          label: "Bandwidth Efficiency",
          detail: "Enforce 100% topic isolation so fans only receive packets for their actively watched match.",
        },
        {
          label: "Zero Leaked Connections",
          detail: "Detect half-open sockets caused by mobile disconnects and reap zombies within 30 seconds.",
        },
        {
          label: "Free-Tier Viability",
          detail: "Run the full stack indefinitely on Vercel, Render free tier, and Neon serverless without exceeding connection ceilings.",
        },
      ],
    },
    journey: [
      {
        chapter: "Chapter 1",
        timeline: "Aug 2026",
        title: "Push over Pull: The WebSocket Gateway",
        narrative:
          "The initial prototype began with testing bidirectional communication for sports events. Recognizing that HTTP polling would immediately exhaust free-tier serverless databases, I built a dedicated Express and native ws server.",
        decision: {
          title: "Push vs Pull Architecture",
          problem:
            "HTTP polling repeatedly queries the database every few seconds, rapidly exhausting connection pool limits and creating visible score lag.",
          options: [
            "HTTP short-polling every 2 seconds",
            "Server-Sent Events (SSE) for unidirectional streaming",
            "Persistent full-duplex WebSockets using ws",
          ],
          chosen: "Native WebSockets via the ws library in Node.js",
          tradeoff:
            "WebSockets require persistent stateful server processes rather than purely stateless serverless functions, but eliminate recurring request-header overhead and reduce latency to pure network RTT.",
        },
      },
      {
        chapter: "Chapter 2",
        timeline: "Aug 2026",
        title: "Targeted Topic Isolation: O(k) Channel Subscriptions",
        narrative:
          "With scores and commentary flowing, broadcasting every event to every connected client quickly bloated memory and wasted client CPU. I partitioned clients by match using dedicated in-memory data structures.",
        decision: {
          title: "Topic-Based Subscriptions (Set Maps)",
          problem:
            "A global broadcast loop (O(N) across all connected sockets) sends cricket commentary to football fans, wasting mobile bandwidth and server throughput.",
          options: [
            "Global broadcast with client-side message filtering",
            "External Redis Pub/Sub cluster",
            "In-memory Map<matchId, Set<WebSocket>> subscriber mapping",
          ],
          chosen: "In-memory Map<matchId, Set<WebSocket>> subscriber mapping",
          tradeoff:
            "An in-memory map keeps single-node gateway latency near zero with zero external infrastructure overhead, but scaling horizontally across multiple server instances in the future will require bridging via Redis Pub/Sub.",
        },
      },
      {
        chapter: "Chapter 3",
        timeline: "Aug 2026",
        title: "Perimeter Hardening & Arcjet Handshake Security",
        narrative:
          "Exposing an open WebSocket server on the public internet created exposure to connection-exhaustion bot storms. I integrated Arcjet security middleware directly into the HTTP upgrade lifecycle.",
        decision: {
          title: "Handshake Rate Limiting via Arcjet",
          problem:
            "Malicious bot scripts or rapid reload loops could overwhelm server socket file descriptors before application logic ever executed.",
          options: [
            "Express rate-limiting middleware on REST routes only",
            "Reverse-proxy IP tables / Cloudflare WAF",
            "Arcjet token-bucket rate limiting on the HTTP upgrade request",
          ],
          chosen: "Arcjet middleware inspecting HTTP upgrade headers before socket allocation",
          tradeoff:
            "Adds a minor (~10ms) verification check during the initial connection handshake, but completely shields the WebSocket server from bot floods and malicious socket floods.",
        },
      },
      {
        chapter: "Chapter 4",
        timeline: "Oct 2026",
        title: "Zombie Sockets & Heartbeat Reaping",
        narrative:
          "During live testing with mobile clients, abrupt network loss left half-open TCP connections in memory indefinitely. I engineered a two-way ping/pong sweep to enforce proactive connection hygiene.",
        decision: {
          title: "Heartbeat Health Reaping & Leak Prevention",
          problem:
            "Mobile clients dropping carrier signal fail to send TCP FIN packets, leaving orphaned WebSocket instances in server memory and causing memory leaks.",
          options: [
            "Relying on OS-level TCP keepalive (often delayed by 2 hours)",
            "Client-initiated polling ping packets",
            "Server-driven 30-second ping/pong sweep with terminated socket unregistration",
          ],
          chosen: "Server-side 30-second ping/pong heartbeat interval with automated subscriber unregistration",
          tradeoff:
            "The server spends small compute cycles sending ping frames every 30 seconds, but guarantees zero leaked socket objects or dangling Set references.",
        },
      },
      {
        chapter: "Chapter 5",
        timeline: "Oct 2026",
        title: "Decoupled Monorepo, Neon Migration & Jittered Backoff",
        narrative:
          "To achieve production resilience, I separated the frontend (React 19 / Vite hosted on Vercel) from the backend (Express/ws hosted on Render), migrated the database to Neon Serverless PostgreSQL with Drizzle ORM, and fortified the client hook with exponential backoff.",
        decision: {
          title: "Decoupled Architecture with Jittered Reconnection",
          problem:
            "When the free-tier backend sleeps or restarts, reconnecting clients can cause a thundering herd that re-crashes the reviving server.",
          options: [
            "Aggressive immediate reconnect loops (while(true) reconnect)",
            "Fixed 5-second retry timer",
            "Exponential backoff with randomized jitter and optimistic client state retention",
          ],
          chosen: "Custom useWebSocket hook with exponential backoff, randomized jitter, and cached state",
          tradeoff:
            "Requires careful lifecycle management and CORS alignment between Vercel and Render, but ensures graceful recovery without hammering reviving backend nodes.",
        },
      },
    ],
    flowSteps: [
      {
        step: 1,
        title: "Event Ingestion via Ingestion Worker",
        actor: "Node.js Seeder / REST API",
        description:
          "A match event (e.g. Bukayo Saka scores in 42nd min) is posted to /matches/:id/score or /matches/:id/commentary, simulating external sports radar webhook feeds.",
        codeSnippet: {
          filename: "sportz-websockets-main/src/routes/matches.js",
          language: "javascript",
          code: `router.post('/:id/score', async (req, res) => {
  const matchId = parseInt(req.params.id);
  const { homeScore, awayScore } = scoreSchema.parse(req.body);

  // Commit mutation to Neon PostgreSQL
  await db.update(matches)
    .set({ homeScore, awayScore, updatedAt: new Date() })
    .where(eq(matches.id, matchId));

  // Trigger targeted broadcast
  broadcastScoreUpdate(matchId, { homeScore, awayScore });
  res.json({ success: true });
});`,
          explanation: "Ingests external webhook payloads with strict Zod schema validation before database commit.",
        },
      },
      {
        step: 2,
        title: "Edge Security & Handshake Inspection",
        actor: "Arcjet Security Middleware",
        description:
          "Incoming client upgrade requests are intercepted by Arcjet to verify token-bucket rate limits and block malicious scraping bots before allocating TCP socket resources.",
        codeSnippet: {
          filename: "sportz-websockets-main/src/security/arcjet.js",
          language: "javascript",
          code: `const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({ mode: "LIVE", allow: [] }),
    tokenBucket({ mode: "LIVE", refillRate: 5, interval: 10, capacity: 10 })
  ]
});`,
          explanation: "Blocks automated scrapers and rate-limits WebSocket connection attempts at the HTTP boundary.",
        },
      },
      {
        step: 3,
        title: "State Persistence with Neon PostgreSQL",
        actor: "Neon Database & Drizzle ORM",
        description:
          "Type-safe schema mutations execute against Neon Serverless PostgreSQL with connection pooling (sslmode=require) preventing idle connection starvation.",
        codeSnippet: {
          filename: "sportz-websockets-main/src/db/schema.js",
          language: "javascript",
          code: `export const commentary = pgTable("commentary", {
  id: serial("id").primaryKey(),
  matchId: integer("match_id").references(() => matches.id),
  minute: integer("minute").notNull(),
  eventType: varchar("event_type", { length: 50 }).notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});`,
          explanation: "Drizzle ORM schema guarantees compile-time type safety and atomic transaction commits.",
        },
      },
      {
        step: 4,
        title: "Targeted In-Memory Channel Fan-Out",
        actor: "ws WebSocket Hub",
        description:
          "The broadcasting engine isolates subscribers via Map<matchId, Set<WebSocket>>, dispatching payload frames in O(k) time strictly to clients viewing that specific match.",
        codeSnippet: {
          filename: "sportz-websockets-main/src/ws/server.js",
          language: "javascript",
          code: `// Targeted channel fanout: only send payloads to match subscribers
function broadcastToMatch(matchId, payload) {
  const subscribers = matchSubscribers.get(matchId);
  if (!subscribers || subscribers.size === 0) return;

  const message = JSON.stringify(payload);
  for (const client of subscribers) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
}`,
          explanation:
            "O(k) targeted fanout delivering 100% topic isolation without unnecessary broadcasts to unrelated match listeners.",
        },
      },
      {
        step: 5,
        title: "Reactive Client UI Hydration",
        actor: "React 19 / Vite Edge Client",
        description:
          "The client useWebSocket hook receives the framed packet, plays subtle audio telemetry, updates the match card badge, and appends the play-by-play row without full page refreshes.",
        logLine:
          "[WS CLIENT] Received payload: { type: 'score_update', matchId: 1, homeScore: 2, awayScore: 1 } in 68ms RTT",
      },
    ],
    challenges: [
      {
        title: "WebSocket Reconnection Thrashing & State Flapping",
        symptom:
          "During momentary network hiccups, the client hook entered a rapid reconnect loop, repeatedly toggling the UI connection status badge and piling up pending socket listeners.",
        rootCause:
          "The React hook's useEffect cleanup did not explicitly remove event listeners on stale WebSocket instances before instantiating a new connection, creating competing listener queues (commit 39e86d4).",
        solution:
          "Implemented strict socket teardown logic, setting explicit unmount handlers, and coupled it with randomized exponential backoff jitter (base 1000ms, cap 10000ms).",
        commitOrPr: "39e86d4: fix(websocket): stabilize connection lifecycle and eliminate reconnect toggling",
      },
      {
        title: "Arcjet Production Startup Failure & CORS Rejections",
        symptom:
          "The production deployment on Render crashed immediately on boot, and cross-origin WebSocket upgrades from the Vercel frontend were rejected with 403 Forbidden.",
        rootCause:
          "Arcjet threw a critical runtime error when the environment key was missing in production, and Express default CORS rules were blocking Vercel origin headers (commits b483272, df83691).",
        solution:
          "Configured fallback bypass rules for local and non-critical environments, added permissive yet secure origin headers for the Vercel production domain, and hardened API boot sequences.",
        commitOrPr: "b483272 / df83691: Fix Arcjet key missing error & added CORS to fix Vercel connection",
      },
      {
        title: "CI/CD Environment Masking in Vite Production Container",
        symptom:
          "GitHub Actions build failed during the Vite compilation stage, with undefined API base URLs baked into static client assets.",
        rootCause:
          "Docker and GitHub Actions containers did not inject VITE_ prefixed environment variables into the client bundle at build time (commit 3d8559e).",
        solution:
          "Updated the Dockerfile and GitHub Actions workflow to explicitly inject VITE_API_BASE_URL and VITE_WS_BASE_URL build args into Vite's production compilation step.",
        commitOrPr: "3d8559e: Fix vite undefined env variables in Github actions container",
      },
    ],
    results: {
      takeaway: "Empirical performance benchmarks verified across repository code and production deployments.",
      metrics: [
        {
          value: "<80ms",
          label: "Live Update Delivery",
          source: "Resume benchmark on active WebSocket connection",
        },
        {
          value: "30s",
          label: "Heartbeat Reap Interval",
          source: "sportz-websockets-main/src/index.js ping/pong timer",
        },
        {
          value: "1 MB",
          label: "Max Frame Payload",
          source: "ws WebSocketServer config (maxPayload)",
        },
        {
          value: "40%",
          label: "Query Execution Gain",
          source: "Resume / Drizzle ORM schema indexing vs unindexed raw queries",
        },
      ],
      qualitative: [
        "100% Topic-Isolated Channel Routing: Sockets only receive data for matches they subscribe to via Map<matchId, Set<WebSocket>>.",
        "Zero Socket Memory Leaks: Proactive 30s heartbeat reaping guarantees zombie client teardown upon unexpected mobile disconnection.",
        "Zero-Cost Infrastructure: Runs 24/7 across Vercel frontend, Render backend, and Neon serverless PostgreSQL.",
        "Defensive Bot Filtering: Arcjet upgrade rate limiting keeps the core broadcast event loop insulated from scrapers.",
      ],
    },
    learnings: {
      takeaway: "Building stateful real-time distributed systems on free-tier serverless demands proactive connection hygiene.",
      items: [
        {
          title: "Stateful WebSockets and Serverless are Natural Foes",
          detail:
            "Hosting persistent WebSocket servers requires dedicated runtime instances rather than purely stateless serverless lambdas. Keeping memory bounded via topic Maps was crucial to surviving 512MB RAM server constraints.",
        },
        {
          title: "Clean Teardown is Harder Than Setup",
          detail:
            "Handling connection setup is trivial; handling silent mobile drops without TCP FIN packets is where 90% of real-time server bugs live. Proactive server ping sweeps are mandatory.",
        },
        {
          title: "What I'd Build Next: Horizontal Fanout via Redis Pub/Sub",
          detail:
            "To scale past a single Node.js instance to thousands of concurrent spectators, the in-memory Set mapping should be backed by a distributed Redis Pub/Sub or Kafka topic broker.",
        },
      ],
    },
    tryIt: {
      takeaway: "Test bi-directional real-time event streaming live in your browser.",
      steps: [
        "Open the Live Production Dashboard in two separate browser windows side-by-side.",
        "Note: Because the backend is hosted on Render's free tier, allow ~30 seconds on first load if the instance is spinning up.",
        "Click 'Simulate Event' in the top header of Window 1 and choose an active match.",
        "Select an event type (Goal, Wicket, Foul, or Yellow Card) and click 'Broadcast Event'.",
        "Observe the animated score badge flash and the play-by-play commentary append in Window 2 instantaneously without page refreshes.",
      ],
    },
    deliverables: [
      "WebSocket Server Engine",
      "Real-Time Broadcast Pipeline",
      "Connection State Machine",
      "Binary Payload Serialization",
    ],
    metrics: ["<80ms Update Latency", "1 MB Max Payload Buffer", "30s Heartbeat Reap Cycle"],
    overview:
      "A lightweight, fault-tolerant WebSocket server and broadcasting architecture built to power low-latency bidirectional messaging, real-time telemetry streaming, and instant peer synchronization.",
    solution:
      "A reliable, zero-bloat real-time event pipeline delivering sub-second broadcast times and rock-solid state management.",
    keyInsights: [
      "Direct socket broadcasting reduced telemetry transmission overhead compared to HTTP polling.",
      "Explicit connection state validation prevents socket buffer leaks under network interruption.",
    ],
    githubUrl: "https://github.com/vpn-cli/sockets",
    liveUrl: "https://sportz-rho.vercel.app",
  },
  {
    slug: "appforge",
    title: "AppForge",
    tagline:
      "Highly-scalable metadata-driven generative web application runtime & AI copilot compiling natural language into structural DOM trees.",
    category: "Generative AI & App Engine",
    year: "2026",
    client: "Open Source",
    role: "Principal Full-Stack Architect",
    timeline: "May 2026 — Aug 2026",
    accentGradient: "from-zinc-800 via-neutral-900 to-black",
    image: "/projects/appforge.jpg",
    videoUrl: "/videos/appforge/brag.mp4",
    videoPoster: "/videos/appforge/brag.jpg",
    deviceType: "laptop",
    links: {
      demo: "https://appforge-studios.vercel.app",
      repo: "https://github.com/vpn-cli/appforge",
      readme: "https://github.com/vpn-cli/appforge#readme",
    },
    tldr: {
      title: "AppForge",
      pitch:
        "Engineered a metadata-driven generative runtime that compiles natural language prompts into structural JSON ASTs, dynamically provisioning PostgreSQL tables and rendering safe React applications in under 1.5s.",
      summary: {
        problem:
          "Traditional web development requires days of manual boilerplate to design layouts, configure database schemas, and wire REST endpoints.",
        built:
          "A Next.js 15 generative engine powered by Llama-3.3-70B on Groq LPUs, Upstash Redis semantic caching, dynamic Supabase DDL execution, and an AST-driven React component registry.",
        outcome:
          "Cut prompt-to-layout latency to <800ms, reduced repetitive generation costs by 68% via semantic caching, and mitigated 95%+ of AI hallucination crashes via strict Zod validation.",
      },
      role: "Solo Architect & Full-Stack Engineer",
      timeline: "May 2026 — Aug 2026",
      stack: [
        "Next.js 15",
        "TypeScript",
        "Llama-3.3-70B",
        "Groq LPU",
        "Gemini 1.5/2.0 Flash",
        "Upstash Redis",
        "Upstash Kafka",
        "Supabase (PostgreSQL)",
        "Clerk Auth",
        "Zod",
      ],
      readingTime: "4 min read",
    },
    context: {
      takeaway: "Building enterprise software prototypes by hand is repetitive and painfully slow.",
      description:
        "Product teams and founders spend weeks wiring up identical dashboard scaffolding: sidebars, stat grids, data tables, and modal forms. AppForge turns that entire prototyping cycle into a single natural language interaction.",
    },
    problem: {
      takeaway: "Raw code generation from LLMs is unsafe, unmaintainable, and prone to syntax breakage.",
      description:
        "Most AI app generators generate raw React code strings and run them through dangerous client-side eval or heavy sandbox containers. This introduces massive security risks, slow rendering loops, and frequent syntax crash bugs when LLMs hallucinate syntax.",
      comparison: {
        before: {
          title: "Raw Code Generation (Eval / Iframe)",
          points: [
            "Generates raw JSX strings with high arbitrary code execution (XSS) risk",
            "Slow container spin-ups taking 10–30 seconds per build",
            "Frequent syntax hallucinations crash the rendering pipeline",
            "No dynamic database persistence; data is lost on reload",
          ],
        },
        after: {
          title: "AppForge AST & Component Registry",
          points: [
            "Compiles prompts into strict, mathematical JSON Abstract Syntax Trees (AST)",
            "Zero eval: maps AST nodes directly to verified, hardened React registry primitives",
            "Sub-800ms prompt-to-layout speed via Groq LPU with Gemini fallback",
            "Dynamic runtime DDL on Supabase automatically provisions real SQL tables",
          ],
        },
      },
      coreChallenge:
        "How to compile unstructured natural language into fully interactive, database-backed enterprise applications instantaneously without arbitrary code execution risks.",
    },
    goals: {
      takeaway: "Sub-second inference, deterministic execution safety, and real persistence.",
      items: [
        {
          label: "Sub-Second Response",
          detail: "Deliver streaming AST generation in under 800ms using dedicated LPU hardware acceleration.",
        },
        {
          label: "Deterministic Safety",
          detail: "Completely eliminate eval / innerHTML execution by rendering through an immutable component registry.",
        },
        {
          label: "Automatic Database Provisioning",
          detail: "Translate UI fields directly into PostgreSQL DDL queries executed safely via Supabase RPC.",
        },
        {
          label: "Zero-Downtime Resilience",
          detail: "Ensure automated API failover from Groq to dual Gemini keys when hardware rate limits trigger.",
        },
      ],
    },
    journey: [
      {
        chapter: "Chapter 1",
        timeline: "Jun 2026",
        title: "The Architecture: AST Compilation vs Raw Strings",
        narrative:
          "When initiating AppForge (commit 9e0caa6), the primary design decision was rejecting string-based code generation. I architected a mathematical JSON schema representing pages, layouts, cards, inputs, and tables.",
        decision: {
          title: "Prompt-to-AST Compilation Pipeline",
          problem:
            "Generating arbitrary JSX code strings with LLMs causes frequent syntax breakages, hydration errors, and catastrophic XSS injection vulnerabilities.",
          options: [
            "Sandboxed browser eval() or new Function() calls",
            "Docker containerized microVM execution (e.g. WebContainers)",
            "Strict JSON AST compiler mapped to a pre-built React component registry",
          ],
          chosen: "JSON AST compiler mapped to a pre-built React component registry",
          tradeoff:
            "UI capabilities are constrained to components defined in the registry, but guarantees 100% deterministic rendering safety, instant zero-compilation DOM mounting, and zero arbitrary code execution risk.",
        },
      },
      {
        chapter: "Chapter 2",
        timeline: "Jul 2026",
        title: "Sub-Second Inference & Serverless Semantic Caching",
        narrative:
          "Standard LLM API calls took 3–6 seconds, breaking interactive flow. I paired Groq LPU hardware (Llama-3.3-70B) for ultra-fast generation with Upstash Redis for semantic vector caching (commit 11d6286, 7cc37b2).",
        decision: {
          title: "Serverless Semantic Caching & Dual-Provider Failover",
          problem:
            "Repeated prompts (e.g. 'inventory tracker' or 'sales dashboard') incur redundant LLM inference latency and token costs, and single-provider rate limits cause hard outages.",
          options: [
            "Single OpenAI GPT-4o API call on every request",
            "Exact-match string hash caching in memory",
            "Groq LPU primary with cascading Gemini failover + Upstash Redis semantic vector caching",
          ],
          chosen: "Groq LPU primary with cascading Gemini failover and Upstash Redis semantic cache",
          tradeoff:
            "Maintaining dual provider schemas requires unified Zod adapters, but slashed token costs by 68% and guaranteed zero-downtime availability under quota spikes.",
        },
      },
      {
        chapter: "Chapter 3",
        timeline: "Jul 2026",
        title: "Dynamic Schema Engine: Supabase DDL Synchronization",
        narrative:
          "A UI mockup without persistent data is only a picture. I built the Dynamic Schema Engine (actions/schema.ts) to parse AST input fields and execute safe runtime DDL on Supabase (commit c96fb5d, 1d6f5af).",
        decision: {
          title: "Runtime DDL Postgres Provisioning",
          problem:
            "Generated apps need real database tables for form submissions and records, but traditional ORM migrations require deployment downtime.",
          options: [
            "Single generic JSON blob table (Entity-Attribute-Value anti-pattern)",
            "Static pre-allocated multi-tenant generic tables",
            "Dynamic runtime DDL execution via Supabase RPC (execute_app_ddl)",
          ],
          chosen: "Dynamic runtime DDL execution via Supabase RPC (execute_app_ddl)",
          tradeoff:
            "Requires careful SQL sanitization inside the RPC function to prevent unauthorized DROP or ALTER commands on system tables, but provisions native, indexed PostgreSQL tables on the fly.",
        },
      },
      {
        chapter: "Chapter 4",
        timeline: "Aug 2026",
        title: "Edge Hardening, Sandboxing & Production Release",
        narrative:
          "To welcome visitors without forcing immediate signup, I engineered guest sandboxing with localized storage quotas and whitelisted sandbox routes across 300+ Clerk Edge nodes (commits bf7b018, 42b2085, 9d4e9ca).",
        decision: {
          title: "Smart Quota Sandboxing & Edge Authentication",
          problem:
            "Requiring user authentication before the first generation kills top-of-funnel adoption, but allowing anonymous access invites server resource exhaustion.",
          options: [
            "Hard authentication wall blocking all guest interactions",
            "Completely anonymous unmetered access",
            "Edge-routed guest sandbox with client-side quota tracking and graceful Clerk transition",
          ],
          chosen: "Edge-routed guest sandbox with local storage quotas and graceful Clerk transition",
          tradeoff:
            "Requires handling dual execution branches in Server Actions (guest mock vs authenticated persistence), but offers an instant try-it-now playground for playtesters.",
        },
      },
    ],
    flowSteps: [
      {
        step: 1,
        title: "Natural Language Prompt Ingestion",
        actor: "CopilotPanel (React 19 / Next.js)",
        description:
          "User describes an application (e.g. 'SaaS billing dashboard with subscription plan tiers and invoice status'). Checked against Clerk session state and guest rate limits.",
        logLine: "[COPILOT] Ingesting prompt (68 chars). Verifying Upstash IP rate limit: ALLOWED (1/10).",
      },
      {
        step: 2,
        title: "Semantic Cache Lookup via Upstash Redis",
        actor: "Upstash Redis Serverless KV",
        description:
          "Checks if an equivalent prompt topology exists in the semantic vector cache. On a hit, replays the pre-computed AST within <100ms with zero LLM token consumption.",
        codeSnippet: {
          filename: "app/api/copilot/route.ts",
          language: "typescript",
          code: `const cachedAst = await getSemanticCache(normalizedPrompt);
if (cachedAst) {
  return new Response(JSON.stringify({ ast: cachedAst, cached: true }), {
    headers: { "Content-Type": "application/json" }
  });
}`,
          explanation: "Returns cached AST instantaneously, saving 100% of GPU inference latency.",
        },
      },
      {
        step: 3,
        title: "Streaming AST Compilation on Groq LPU",
        actor: "Llama-3.3-70B on Groq LPUs",
        description:
          "Groq LPUs infer structured JSON schemas representing pages, grids, cards, charts, and input fields in under 800ms, streaming text chunks directly to the Edge runtime.",
        codeSnippet: {
          filename: "app/api/copilot/route.ts",
          language: "typescript",
          code: `const result = streamText({
  model: groq("llama-3.3-70b-versatile"),
  system: SYSTEM_PROMPT_AST_SPEC,
  prompt: userPrompt,
  temperature: 0.1,
});
return result.toDataStreamResponse();`,
          explanation: "Streams strictly bounded JSON AST arrays via Vercel Edge runtime with zero buffering timeouts.",
        },
      },
      {
        step: 4,
        title: "Strict Zod Validation & Registry Mapping",
        actor: "Zod Schema Parser & React Component Registry",
        description:
          "The streamed JSON is parsed into component AST nodes. Zod validates every prop; hallucinated properties are safely discarded and replaced with registry defaults.",
        codeSnippet: {
          filename: "registry/component-registry.tsx",
          language: "typescript",
          code: `export function renderAstNode(node: AstNode): React.ReactNode {
  const Component = REGISTRY[node.type];
  if (!Component) return <FallbackNode node={node} />;
  
  const validatedProps = NodePropsSchema[node.type].parse(node.props);
  return <Component key={node.id} {...validatedProps} />;
}`,
          explanation: "Guarantees mathematical execution safety: only verified registry primitives can ever render into the DOM.",
        },
      },
      {
        step: 5,
        title: "Dynamic Supabase DDL Provisioning & DOM Hydration",
        actor: "Supabase RPC (execute_app_ddl)",
        description:
          "On app save/publish, the schema engine inspects form inputs, generates corresponding SQL CREATE TABLE statements, and executes them atomically via Supabase RPC.",
        logLine:
          "[SUPABASE RPC] execute_app_ddl: Created table 'app_invoices_398' with 6 typed columns and RLS policy.",
      },
    ],
    challenges: [
      {
        title: "AI Copilot JSON Markdown Fencing & Hallucination Bounces",
        symptom:
          "The copilot parser periodically threw unexpected syntax errors when Llama-3.3 wrapped valid JSON in markdown code blocks or hallucinated invalid nested attributes.",
        rootCause:
          "LLMs occasionally emit introductory prose or unescaped markdown fences ('```json') when streaming, breaking JSON.parse (commits 4272697, 2d89619).",
        solution:
          "Built a deterministic extraction pipeline that strips markdown delimiters, captures bounded JSON array boundaries, and passes the AST through Zod with automated fallback nodes.",
        commitOrPr: "4272697: Fix JSON extraction hallucination bug in Copilot Panel",
      },
      {
        title: "Vercel Edge Streaming Buffering & Timeout Crashes",
        symptom:
          "On Node.js serverless runtimes, copilot streams hung until the entire response finished, causing gateway timeouts on slower multi-card layouts.",
        rootCause:
          "Standard Node serverless functions buffered HTTP chunked transfers rather than immediately piping stream tokens to the browser (commit 05c4cc8).",
        solution:
          "Configured export const runtime = 'edge' on the copilot API endpoint to leverage lightweight Vercel Edge compute with native ReadableStream passthrough.",
        commitOrPr: "05c4cc8: Configure AI route with edge runtime to fix production buffering timeouts",
      },
      {
        title: "Clerk Authentication Middleware vs Next.js Server Action Masking",
        symptom:
          "Guests attempting to test builder features encountered cryptic Next.js Server logic exceptions, masking actual authorization failures.",
        rootCause:
          "Next.js production error masking hid internal auth errors, while Clerk Edge middleware intercepted server action RPC calls on unauthenticated demo paths (commits bf7b018, 0b225c3, 42b2085).",
        solution:
          "Configured explicit createRouteMatcher whitelists for sandbox aliases, returned structured error objects from Server Actions, and mocked successful guest publishes.",
        commitOrPr: "bf7b018 / 0b225c3: Restore route matching & bypass Next.js error masking in Server Actions",
      },
    ],
    results: {
      takeaway: "Sub-second inference and zero-eval mathematical safety verified on production benchmarks.",
      metrics: [
        {
          value: "<800ms",
          label: "Prompt-to-Layout Latency",
          source: "Groq LPU Llama-3.3-70B benchmark / Résumé",
        },
        {
          value: "1.5s",
          label: "Full UI AST Compilation",
          source: "Résumé & production README benchmark",
        },
        {
          value: "68%",
          label: "LLM Token Cost Saved",
          source: "Upstash Redis semantic cache hit rate telemetry",
        },
        {
          value: "95%+",
          label: "Hallucination Crashes Mitigated",
          source: "Résumé / Zod schema validation in React registry",
        },
      ],
      qualitative: [
        "100% Safe Execution: Pure React DOM registry mapping completely eliminates arbitrary code execution (eval) vulnerabilities.",
        "Automatic PostgreSQL Provisioning: Dynamic DDL execution on Supabase creates real, indexed relational tables for every generated form.",
        "Interactive Guest Sandbox: Playtesters can describe, edit, and interact with generated apps immediately with zero upfront signup friction.",
        "Decoupled Telemetry: Upstash Kafka queue decouples publish and analytics events without blocking edge response cycles.",
      ],
    },
    learnings: {
      takeaway: "Constrained metadata ASTs beat unrestricted raw code generation every single time.",
      items: [
        {
          title: "Mathematical Schemas Guarantee Reliability",
          detail:
            "Allowing an LLM to generate raw JavaScript code is a recipe for broken builds and security holes. Restricting generation to a strict Zod-validated AST gave 100% render safety and zero hydration errors.",
        },
        {
          title: "Hardware Matters: LPUs vs Standard GPUs",
          detail:
            "Moving prompt compilation to Groq LPUs reduced inference latency from 4.2 seconds down to under 800ms, making AI generation feel as fast as a static component library.",
        },
        {
          title: "What I'd Build Next: E2E Playwright DOM Verification",
          detail:
            "As noted in the project TODOs, adding an automated Playwright testing worker to verify visual layout symmetry and DOM accessibility for every compiled AST would further elevate production safety.",
        },
      ],
    },
    tryIt: {
      takeaway: "Generate a fully interactive, database-backed enterprise dashboard in seconds.",
      steps: [
        "Navigate to the Live Production AppForge Workspace at appforge-studios.vercel.app.",
        "Click 'Try Demo Sandbox' or open the AI Copilot Workspace textbox.",
        "Type a prompt such as: 'Build a customer CRM dashboard with a lead capture form, monthly ARR chart, and deal pipeline table.'",
        "Watch the AST stream in real time and mount interactive React components into the canvas in under 1.5 seconds.",
        "Interact with the generated form inputs and click Save to trigger the Supabase DDL schema provisioning pipeline.",
      ],
    },
    deliverables: [
      "Graphical AST Compiler",
      "AI Copilot Workspace",
      "Dynamic Postgres Sync Engine",
      "Semantic Caching Pipeline",
    ],
    metrics: ["<800ms Prompt Latency", "Llama-3.3-70B Pipeline", "300+ Edge Nodes Secured"],
    overview:
      "AppForge interprets natural language prompts via large language models, compiles them into a mathematically sound graphical JSON AST, and dynamically renders enterprise-grade B2B applications instantaneously directly inside the Web DOM.",
    solution:
      "A desktop-grade generative application workspace where anyone can describe an enterprise tool and watch it compile, migrate a database, and deploy live in seconds.",
    keyInsights: [
      "Semantic caching on Upstash Redis cut repetitive generation costs by 68%.",
      "AST-driven dynamic rendering completely eliminated arbitrary code execution risks.",
    ],
    githubUrl: "https://github.com/vpn-cli/appforge",
    liveUrl: "https://appforge-studios.vercel.app",
  },
  {
    slug: "stream-mart",
    title: "StreamMart",
    tagline:
      "Event-driven microservices e-commerce backend built on an asynchronous Apache Kafka message bus with Transactional Outbox pattern.",
    category: "Distributed Systems & Microservices",
    year: "2026",
    client: "Open Source",
    role: "Backend Infrastructure & Systems Architect",
    timeline: "Aug 2026 — Sep 2026",
    accentGradient: "from-zinc-900 via-neutral-900 to-black",
    image: "/projects/stream-mart.png",
    deviceType: "laptop",
    links: {
      demo: "https://github.com/vpn-cli/StreamMart#architecture--workflow",
      repo: "https://github.com/vpn-cli/StreamMart",
      readme: "https://github.com/vpn-cli/StreamMart#readme",
    },
    tldr: {
      title: "StreamMart",
      pitch:
        "Architected a decoupled event-driven microservices backend powered by Apache Kafka, ensuring guaranteed at-least-once message delivery via the Transactional Outbox Pattern.",
      summary: {
        problem:
          "Direct synchronous HTTP communication between microservices creates tight coupling, cascading failures, and distributed state inconsistencies during network timeouts.",
        built:
          "An asynchronous microservices cluster (API Gateway, Orders, Payments, Analytics, Email) orchestrated with Apache Kafka, Drizzle ORM, Neon PostgreSQL, and Docker Compose.",
        outcome:
          "Achieved zero message loss across services, eliminated cascading HTTP bottlenecks, and enforced atomic state persistence with transactional outbox workers.",
      },
      role: "Backend Systems Architect",
      timeline: "Aug 2026 — Sep 2026",
      stack: [
        "Node.js",
        "Express",
        "Apache Kafka",
        "Neon PostgreSQL",
        "Drizzle ORM",
        "Docker",
        "Kubernetes",
        "JWT",
      ],
      readingTime: "5 min read",
    },
    context: {
      takeaway: "Distributed e-commerce architectures must never rely on brittle synchronous HTTP chains for core order lifecycles.",
      description:
        "When a customer submits a payment, coupling order fulfillment, stock deduction, analytics logging, and transactional email into one continuous synchronous chain causes cascading failures whenever any downstream service experiences latency or downtime.",
    },
    problem: {
      takeaway: "Atomic local database persistence does not guarantee reliable distributed event delivery.",
      description:
        "If payment-service writes to PostgreSQL and subsequently crashes before calling Kafka, the payment is recorded but the order is never created. Dual-write scenarios without transactional outboxing corrupt distributed system integrity.",
      comparison: {
        before: {
          title: "Brittle Synchronous HTTP Chains",
          points: [
            "Cascading service timeouts when downstream microservices lag",
            "Data inconsistency if message broker publish fails after DB insert",
            "Direct service exposure increases security attack surface area",
            "Unbounded latency spikes during peak transaction volume",
          ],
        },
        after: {
          title: "Decoupled Event-Driven Pipeline",
          points: [
            "Atomic local transactions write payment and outbox event together",
            "Background outbox worker guarantees at-least-once Kafka publish",
            "API Gateway handles rate limiting, JWT auth, and reverse proxying",
            "Independent consumer scalability with zero synchronous backpressure",
          ],
        },
      },
      coreChallenge:
        "How to guarantee distributed data consistency between relational PostgreSQL tables and Apache Kafka topics under intermittent network partitions without distributed locks.",
    },
    goals: {
      takeaway: "Zero data loss, isolated failure domains, and horizontal consumer scaling.",
      items: [
        {
          label: "Transactional Outbox Pattern",
          detail: "Guarantee at-least-once message delivery by committing outbox records in the same transaction as state changes.",
        },
        {
          label: "Unified API Gateway",
          detail: "Centralize JWT verification and reverse-proxy internal cluster ports behind a secure perimeter.",
        },
        {
          label: "Decoupled Microservices",
          detail: "Allow Order, Payment, Analytics, and Notification workers to scale and fail independently without blocking clients.",
        },
      ],
    },
    journey: [
      {
        chapter: "Chapter 1",
        timeline: "Aug 2026",
        title: "Microservices Decomposition & Message Broker Topology",
        narrative:
          "Split monolithic checkout into specialized services: API Gateway, Payment, Order, Analytics, and Email. Deployed Apache Kafka and Zookeeper as the central event distribution backbone.",
      },
      {
        chapter: "Chapter 2",
        timeline: "Aug 2026",
        title: "Transactional Outbox Implementation with Drizzle ORM",
        narrative:
          "Solved dual-write race conditions by executing payment insertion and outbox_events queue insertion in a single atomic database transaction, polled by dedicated worker processes.",
      },
    ],
    flowSteps: [
      {
        step: 1,
        title: "Client Checkout Request",
        actor: "API Gateway",
        description: "Validates JWT header, applies rate limits, and proxies request to payment-service.",
      },
      {
        step: 2,
        title: "Atomic Outbox Transaction",
        actor: "Payment Service",
        description: "Inserts payment record and outbox event into Neon PostgreSQL in one SQL transaction.",
      },
      {
        step: 3,
        title: "Kafka Event Broadcast",
        actor: "Outbox Worker",
        description: "Polls pending events and publishes to topic 'payment-successful' on Apache Kafka.",
      },
      {
        step: 4,
        title: "Asynchronous Fulfillment & Notification",
        actor: "Order & Email Services",
        description: "Order service updates inventory and fulfillment status; email service dispatches customer receipt.",
      },
    ],
    challenges: [
      {
        title: "Dual-Write Consistency Under Network Drops",
        symptom: "Payments recorded in database without corresponding order creation during broker restarts.",
        rootCause: "Separate database commit and HTTP/Kafka publish statements without transactional atomicity.",
        solution: "Implemented the Transactional Outbox Pattern using atomic Drizzle ORM SQL transactions.",
      },
    ],
    results: {
      takeaway: "Zero message loss and decoupled event throughput across isolated service boundaries.",
      metrics: [
        {
          value: "100%",
          label: "Message Delivery Guarantee",
          source: "Transactional Outbox Pattern implementation",
        },
        {
          value: "0",
          label: "Cascading HTTP Timeouts",
          source: "Kafka asynchronous topic decoupling",
        },
        {
          value: "5",
          label: "Decoupled Microservices",
          source: "Gateway, Order, Payment, Analytics, Notification",
        },
        {
          value: "100%",
          label: "Type Safety",
          source: "Drizzle ORM & TypeScript schemas",
        },
      ],
      qualitative: [
        "Guaranteed At-Least-Once Delivery: Atomic outbox commit eliminates dual-write race conditions.",
        "Secure Reverse Proxy: API Gateway enforces JWT authentication before traffic touches internal services.",
        "Vendor-Agnostic Persistence: Neon PostgreSQL + Drizzle ORM ensures instant portability to AWS RDS or GCP.",
      ],
    },
    learnings: {
      takeaway: "Distributed consistency is an architectural pattern, not a database feature.",
      items: [
        {
          title: "Dual Writes Always Fail Eventually",
          detail:
            "Writing to a DB and then immediately writing to a message broker in an application thread is an anti-pattern. The Transactional Outbox pattern is essential for reliable event-driven systems.",
        },
        {
          title: "Asynchronous Pipelines Protect User Experience",
          detail:
            "Returning an immediate 202 Accepted or 200 OK while processing downstream tasks asynchronously keeps user response times under 50ms.",
        },
      ],
    },
    tryIt: {
      takeaway: "Spin up the complete microservices cluster locally using Docker Compose.",
      steps: [
        "Clone the repository from github.com/vpn-cli/StreamMart.",
        "Configure your Neon PostgreSQL DATABASE_URL in .env.",
        "Run 'docker-compose up --build -d' to start Zookeeper, Kafka, API Gateway, and microservices.",
        "Send test transactions to port 8080 and watch events flow across Kafka topics in real time.",
      ],
    },
    deliverables: [
      "Kafka Event Bus",
      "Transactional Outbox Worker",
      "API Gateway & Reverse Proxy",
      "Docker Compose Orchestration",
    ],
    metrics: ["100% Guaranteed Delivery", "5 Decoupled Services", "Sub-50ms Gateway Response"],
    overview:
      "StreamMart is an enterprise-grade, event-driven e-commerce microservices architecture demonstrating fault-tolerant distributed system patterns with Apache Kafka and PostgreSQL.",
    solution:
      "A fully decoupled microservices architecture utilizing the Transactional Outbox pattern to ensure guaranteed at-least-once event delivery across isolated services.",
    keyInsights: [
      "Decoupling via Kafka eliminates cascading failures during peak load.",
      "Transactional outboxing guarantees consistency without complex distributed transactions.",
    ],
    githubUrl: "https://github.com/vpn-cli/StreamMart",
    liveUrl: "https://github.com/vpn-cli/StreamMart#architecture--workflow",
  }
];

// Validate all projects at build time with Zod
export const projects: CaseStudy[] = z.array(caseStudySchema).parse(projectsRaw);
