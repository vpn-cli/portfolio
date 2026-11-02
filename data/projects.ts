import { z } from "zod";

export interface CaseStudyMetricChip {
  value: string;
  label: string;
  howMeasured: string;
  isTodo?: boolean;
}

export interface CaseStudyDecision {
  chosenOver: string;
  tradeoffSummary: string;
  optionsConsidered: string[];
  problemFaced: string;
  fullReasoning: string;
}

export interface CaseStudyBug {
  title: string;
  symptom: string;
  cause: string;
  fix: string;
  commitHash: string;
  commitUrl: string;
  context?: string;
}

export interface ArchitectureNode {
  id: string;
  title: string;
  subtitle: string;
  tech: string;
  role: string;
  screenshotUrl?: string;
  screenshotCaption?: string;
  codeSnippet?: {
    filename: string;
    language: string;
    code: string;
    explanation?: string;
  };
}

export interface CaseStudy {
  slug: string;
  title: string;
  hookPitch: string;
  tagline: string;
  category: string;
  year: string;
  role: string;
  timeline: string;
  stack: string[];
  heroClip?: {
    mp4: string;
    webm: string;
    poster: string;
    caption: string;
  };
  problemVisualCaption?: string;
  links: {
    demo?: string;
    repo?: string;
    readme?: string;
    coldStartNote?: string;
  };
  metrics: CaseStudyMetricChip[];
  problemClaim: string;
  problemText: string;
  problemComparison: {
    before: { title: string; points: string[] };
    after: { title: string; points: string[] };
  };
  architectureClaim: string;
  architectureText: string;
  architectureNodes: ArchitectureNode[];
  decisionsClaim: string;
  decisionsText: string;
  decisions: CaseStudyDecision[];
  bugsClaim: string;
  bugsText: string;
  bugs: CaseStudyBug[];
  nextStepsClaim: string;
  nextStepsText: string;
  learningStatement: string;
  tryItSteps: string[];
  // Legacy / fallback compat fields
  image: string;
  videoUrl?: string;
  videoPoster?: string;
  githubUrl?: string;
  liveUrl?: string;
}

export const projects: CaseStudy[] = [
  {
    slug: "sockets",
    title: "Sportz Sockets Engine",
    hookPitch:
      "I built a push-based sports broadcasting server that delivers live score updates to subscribed clients over WebSockets.",
    tagline:
      "A push-based sports broadcasting server that delivers live score updates and commentary over WebSockets.",
    category: "Distributed Systems & Real-Time",
    year: "2026",
    role: "Backend & Systems Engineer",
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
    heroClip: {
      mp4: "/projects/sockets/sportz-live-score-update.mp4",
      webm: "/projects/sockets/sportz-live-score-update.webm",
      poster: "/projects/sockets/sportz-live-score-update-poster.webp",
      caption: "Live score updates and win probability broadcasted over WebSockets.",
    },
    problemVisualCaption: "Client polling versus instant WebSocket push delivery.",
    links: {
      demo: "https://sportz-rho.vercel.app",
      repo: "https://github.com/vpn-cli/sockets",
      readme: "https://github.com/vpn-cli/sockets#readme",
      coldStartNote: "First load can take ~30s (Render free tier).",
    },
    metrics: [
      {
        value: "30s",
        label: "Heartbeat sweep",
        howMeasured: "Configured in ws server dead socket sweep timer (src/ws/server.js)",
      },
      {
        value: "<80ms",
        label: "Broadcast latency",
        howMeasured: "TODO: Marked as placeholder. No automated latency benchmark script found in repo.",
        isTodo: true,
      },
      {
        value: "$0/mo",
        label: "Hosting cost",
        howMeasured: "Render free web service tier + Neon PostgreSQL serverless tier",
      },
    ],
    problemClaim: "Polling wastes server resources and delays live scores",
    problemText:
      "Polling wastes server bandwidth on unchanged responses. During bursts, requests queue up and live score cards lag by seconds.",
    problemComparison: {
      before: {
        title: "HTTP Client Polling",
        points: [
          "Each client sends recurring GET requests every 2 seconds",
          "90%+ of polling queries return identical, un-mutated data",
          "Database connection pool exhausts during scoring bursts",
          "Scores lag 2–4 seconds behind real-time events",
        ],
      },
      after: {
        title: "Targeted WebSocket Push",
        points: [
          "Single persistent TCP connection per spectator",
          "Server dispatches packets only when scores mutate",
          "Topic map isolates broadcasts strictly to match listeners",
          "Sub-second delivery with minimal bandwidth overhead",
        ],
      },
    },
    architectureClaim: "Score events stream straight to subscribed client sockets",
    architectureText:
      "Score mutations update PostgreSQL via Drizzle ORM and signal the gateway. The gateway broadcasts frames strictly to subscribers watching that match.",
    architectureNodes: [
      {
        id: "ingestion",
        title: "REST Ingestion",
        subtitle: "POST /matches/:id/score",
        tech: "Express & Zod",
        role: "Validates score webhook payload.",
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
        id: "postgres",
        title: "Postgres Commit",
        subtitle: "Drizzle ORM Update",
        tech: "Neon PostgreSQL",
        role: "Commits match state via Drizzle.",
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
          explanation: "Drizzle ORM schema provides compile-time type safety and atomic transaction commits.",
        },
      },
      {
        id: "arcjet",
        title: "Arcjet Perimeter",
        subtitle: "Upgrade Rate Limit",
        tech: "Arcjet Edge",
        role: "Shields HTTP upgrade against scrapers.",
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
        id: "gateway",
        title: "ws Gateway",
        subtitle: "Topic Fanout Hub",
        tech: "ws library",
        role: "Routes frames to subscribers in O(k) time.",
        screenshotUrl: "/projects/sockets/sportz-connection-badge.webp",
        screenshotCaption: "Live WebSocket connection status badge and heartbeat monitor.",
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
          explanation: "O(k) targeted fanout delivering topic isolation without unnecessary broadcasts to unrelated listeners.",
        },
      },
      {
        id: "client",
        title: "React Client",
        subtitle: "useWebSocket Hook",
        tech: "React 19 & Vite",
        role: "Hydrates scoreboard from WebSocket frames.",
        screenshotUrl: "/projects/sockets/sportz-live-match.webp",
        screenshotCaption: "Client scoreboard and win probability hydrated directly by push frames.",
        codeSnippet: {
          filename: "sportz-client/src/hooks/useWebSocket.js",
          language: "javascript",
          code: `export function useWebSocket(matchId) {
  const [match, setMatch] = useState(null);
  useEffect(() => {
    let ws = new WebSocket(\`\${WS_URL}?match=\${matchId}\`);
    ws.onmessage = (e) => setMatch(JSON.parse(e.data));
    return () => {
      ws.close();
    };
  }, [matchId]);
  return match;
}`,
          explanation: "Client hook receives real-time frame payloads and updates match cards without page reloads.",
        },
      },
    ],
    decisionsClaim: "Four technical choices that kept memory usage low",
    decisionsText:
      "Every technical choice balanced memory constraints against delivery speed on free-tier infrastructure.",
    decisions: [
      {
        chosenOver: "Chose native ws over Socket.io",
        tradeoffSummary:
          "Low memory footprint, but required custom heartbeat sweeps.",
        optionsConsidered: [
          "Socket.io with fallback transports",
          "Server-Sent Events (SSE)",
          "Native ws RFC 6455 server",
        ],
        problemFaced:
          "Socket.io introduces unnecessary bundle size and polling fallbacks that burn memory on small container instances.",
        fullReasoning:
          "Native ws gave direct control over byte frames, eliminating abstractions while running reliably within 512MB RAM constraints on Render.",
      },
      {
        chosenOver: "Chose in-memory topic maps over global broadcasts",
        tradeoffSummary:
          "Fast O(k) routing, but bounds state to one instance.",
        optionsConsidered: [
          "Iterating all connections on every event",
          "In-memory Map<matchId, Set<WebSocket>>",
          "External Redis pub/sub broker",
        ],
        problemFaced:
          "Broadcasting every event to every socket causes high CPU fanout and leaks events to spectators watching different games.",
        fullReasoning:
          "A Map keyed by match ID ensures only relevant sockets receive messages. Adding an external broker on free tiers added latency and cost, so in-memory isolation was the optimal starting point.",
      },
      {
        chosenOver: "Chose Arcjet upgrade filtering over post-connection auth",
        tradeoffSummary:
          "Zero memory waste, but couples handshake to edge.",
        optionsConsidered: [
          "Application-level JSON auth message after handshake",
          "Reverse proxy rate limiting",
          "Arcjet HTTP upgrade inspection",
        ],
        problemFaced:
          "Allocating WebSockets before validating clients allows malicious actors to exhaust memory with half-open handshakes.",
        fullReasoning:
          "Inspecting upgrade headers at the HTTP boundary stops unauthenticated traffic before TCP socket memory is allocated.",
      },
      {
        chosenOver: "Chose exponential backoff with jitter over immediate reconnection",
        tradeoffSummary:
          "Prevents thundering herd, but reconnects take up to 10s.",
        optionsConsidered: [
          "Immediate while(true) reconnect loops",
          "Fixed 5s retry timer",
          "Randomized exponential backoff jitter",
        ],
        problemFaced:
          "When a free-tier backend sleeps or boots, hundreds of reconnecting clients can overwhelm and re-crash the instance.",
        fullReasoning:
          "Randomized jitter spaces client reconnects over a 1–10s window, allowing reviving backend instances to settle cleanly.",
      },
    ],
    bugsClaim: "Three production bugs and how I fixed them",
    bugsText:
      "Three bugs hit during deployment and stress testing, with links to fixing commits.",
    bugs: [
      {
        title: "Zombie sockets on dropped mobile connection",
        symptom: "Ghost sockets persisted after signal drops.",
        cause: "Mobile OS suspends radio without TCP FIN.",
        fix: "Added 30s server-side ping sweep to prune.",
        commitHash: "39e86d4",
        commitUrl: "https://github.com/vpn-cli/sockets/commit/39e86d4",
      },
      {
        title: "Missing environment keys crashed production boot",
        symptom: "Server boot crashed and clients got 403.",
        cause: "Unset Arcjet key and missing CORS headers.",
        fix: "Added defensive config fallbacks and CORS.",
        commitHash: "b483272",
        commitUrl: "https://github.com/vpn-cli/sockets/commit/b483272",
      },
      {
        title: "Client build omitted API base URLs",
        symptom: "Frontend compiled with undefined WebSocket host.",
        cause: "Docker build omitted VITE_ build arguments.",
        fix: "Passed WS and API args in build stage.",
        commitHash: "3d8559e",
        commitUrl: "https://github.com/vpn-cli/sockets/commit/3d8559e",
      },
    ],
    nextStepsClaim: "What I would build next and live verification",
    nextStepsText:
      "Add Redis Pub/Sub for horizontal socket scaling and automated load testing.",
    learningStatement:
      "Building a stateful real-time server on free-tier hosting taught me that connection hygiene and graceful teardown matter more than connection setup.",
    tryItSteps: [
      "Open the live demo in two separate browser windows side by side.",
      "In Window 1, select an active match and post a score update or commentary event.",
      "Watch Window 2 update its score and commentary instantly without refreshing the page.",
    ],
    image: "/projects/sockets.jpg",
    videoUrl: "/videos/sockets/brag.mp4",
    videoPoster: "/videos/sockets/brag.jpg",
    githubUrl: "https://github.com/vpn-cli/sockets",
    liveUrl: "https://sportz-rho.vercel.app",
  },
  {
    slug: "stream-mart",
    title: "StreamMart",
    hookPitch:
      "I built an event-driven e-commerce backend using Apache Kafka and the transactional outbox pattern to decouple services.",
    tagline:
      "An event-driven e-commerce backend using Apache Kafka and the transactional outbox pattern to decouple services.",
    category: "Distributed Systems & Microservices",
    year: "2026",
    role: "Backend Systems Engineer",
    timeline: "Aug 2026 — Sep 2026",
    stack: [
      "Node.js",
      "Express",
      "Apache Kafka",
      "PostgreSQL (Neon)",
      "Drizzle ORM",
      "Docker",
      "JWT",
    ],
    heroClip: {
      mp4: "/videos/stream-mart/brag.mp4",
      webm: "/videos/stream-mart/brag.webm",
      poster: "/projects/stream-mart/stream-mart-event-flow.webp",
      caption: "Transactional outbox event flow through Apache Kafka cluster.",
    },
    problemVisualCaption: "Synchronous HTTP cascades versus asynchronous Kafka outbox events.",
    links: {
      demo: "https://github.com/vpn-cli/StreamMart#architecture--workflow",
      repo: "https://github.com/vpn-cli/StreamMart",
      readme: "https://github.com/vpn-cli/StreamMart#readme",
    },
    metrics: [
      {
        value: "5",
        label: "Decoupled services",
        howMeasured: "Gateway, Order, Payment, Analytics, Notification services in Docker Compose",
      },
      {
        value: "<50ms",
        label: "Gateway response",
        howMeasured: "TODO: Marked as placeholder. Needs load test harness in repo.",
        isTodo: true,
      },
      {
        value: "100%",
        label: "Delivery consistency",
        howMeasured: "TODO: Marked as placeholder. Outbox pattern ensures atomic database commit, but needs chaos test for broker drops.",
        isTodo: true,
      },
    ],
    problemClaim: "Synchronous service calls cause cascading checkout failures",
    problemText:
      "Synchronous HTTP calls across services cause cascading failures. If payment succeeds but downstream order writes fail, customers are charged without an order.",
    problemComparison: {
      before: {
        title: "Synchronous Microservices",
        points: [
          "Checkout calls Payment, Order, and Notification services in sequence",
          "Downstream latency cascades and causes gateway 504 timeouts",
          "Dual-write risk: Payment succeeds but Order database write fails",
          "Tight runtime coupling halts checkout when any service restarts",
        ],
      },
      after: {
        title: "Transactional Outbox & Kafka",
        points: [
          "Checkout commits payment and outbox event in one atomic SQL transaction",
          "Background worker polls outbox and streams events to Kafka",
          "Order and Notification workers consume events asynchronously",
          "Independent service failure boundaries with zero message loss",
        ],
      },
    },
    architectureClaim: "Atomic outbox transactions decouple payment from order fulfillment",
    architectureText:
      "Checkout requests commit payment records and outbox events in one SQL transaction. A worker polls the outbox and streams events to Kafka.",
    architectureNodes: [
      {
        id: "gateway",
        title: "API Gateway",
        subtitle: "JWT & Reverse Proxy",
        tech: "Express Gateway",
        role: "Validates JWT and proxies requests.",
        codeSnippet: {
          filename: "gateway/src/middleware/auth.ts",
          language: "typescript",
          code: `export const verifyJwt = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Missing token" });
  const decoded = jwt.verify(token, process.env.JWT_SECRET!);
  req.user = decoded;
  next();
};`,
          explanation: "Gateway intercepts requests and validates JWT tokens before forwarding to microservices.",
        },
      },
      {
        id: "postgres",
        title: "Payment DB",
        subtitle: "Atomic Outbox Commit",
        tech: "Neon PostgreSQL & Drizzle",
        role: "Commits payment and outbox atomically.",
        screenshotUrl: "/projects/stream-mart/stream-mart-outbox-terminal.webp",
        screenshotCaption: "Atomic database transaction writing outbox event to PostgreSQL.",
        codeSnippet: {
          filename: "payment-service/src/controllers/payment.ts",
          language: "typescript",
          code: `await db.transaction(async (tx) => {
  const [payment] = await tx.insert(payments).values(paymentData).returning();
  await tx.insert(outboxEvents).values({
    aggregateType: "PAYMENT",
    aggregateId: payment.id,
    type: "PAYMENT_COMPLETED",
    payload: JSON.stringify(payment)
  });
});`,
          explanation: "Atomic transaction ensures payment record and outbox message commit together.",
        },
      },
      {
        id: "outbox",
        title: "Outbox Worker",
        subtitle: "Poll & Publish",
        tech: "Node.js Worker",
        role: "Polls pending events and dispatches.",
        codeSnippet: {
          filename: "payment-service/src/workers/outbox.ts",
          language: "typescript",
          code: `async function processOutbox() {
  const pending = await db.select().from(outboxEvents).where(eq(outboxEvents.published, false)).limit(50);
  for (const event of pending) {
    await kafkaProducer.send({ topic: "payment-successful", messages: [{ value: event.payload }] });
    await db.update(outboxEvents).set({ published: true }).where(eq(outboxEvents.id, event.id));
  }
} `,
          explanation: "Background worker polls committed outbox events and pushes them to Apache Kafka topics.",
        },
      },
      {
        id: "kafka",
        title: "Kafka Broker",
        subtitle: "Topic Partitioning",
        tech: "Apache Kafka",
        role: "Partitions asynchronous checkout streams.",
        screenshotUrl: "/projects/stream-mart/stream-mart-event-flow.webp",
        screenshotCaption: "Apache Kafka cluster routing decoupled checkout topic events.",
        codeSnippet: {
          filename: "docker-compose.yml",
          language: "yaml",
          code: `kafka:
  image: confluentinc/cp-kafka:7.4.0
  ports:
    - "9092:9092"
  environment:
    KAFKA_BROKER_ID: 1
    KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
    KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092`,
          explanation: "Central event distribution message bus orchestrating service communication asynchronously.",
        },
      },
      {
        id: "order",
        title: "Order Worker",
        subtitle: "Async Fulfillment",
        tech: "KafkaJS Consumer",
        role: "Fulfills orders from Kafka events.",
        codeSnippet: {
          filename: "order-service/src/consumers/paymentConsumer.ts",
          language: "typescript",
          code: `await consumer.run({
  eachMessage: async ({ message }) => {
    const payment = JSON.parse(message.value.toString());
    await createOrderFromPayment(payment);
  }
});`,
          explanation: "Consumes payment events independently without blocking the client checkout experience.",
        },
      },
    ],
    decisionsClaim: "Four architectural choices that protected data consistency",
    decisionsText:
      "Every technical choice prioritized data consistency and fault isolation across service boundaries.",
    decisions: [
      {
        chosenOver: "Chose Transactional Outbox over dual-write HTTP calls",
        tradeoffSummary:
          "Eliminates dual-write inconsistency, but requires polling worker.",
        optionsConsidered: [
          "Direct synchronous HTTP post-commit calls",
          "Two-phase commit (2PC) distributed locks",
          "Transactional Outbox Pattern",
        ],
        problemFaced:
          "Committing to PostgreSQL and then making an HTTP call to Kafka can fail halfway, causing permanent state divergence.",
        fullReasoning:
          "Saving the event in the same local database transaction as the business entity ensures that events are only published if the database write succeeded.",
      },
      {
        chosenOver: "Chose Apache Kafka over direct REST microservice calls",
        tradeoffSummary:
          "Decouples checkout latency, but adds Kafka cluster overhead.",
        optionsConsidered: [
          "REST HTTP chaining",
          "RabbitMQ message queue",
          "Apache Kafka event bus",
        ],
        problemFaced:
          "Chaining REST calls causes cascading timeouts when any downstream service delays or restarts.",
        fullReasoning:
          "Kafka topics provide replayable event streams and isolate producer throughput from consumer processing speed.",
      },
      {
        chosenOver: "Chose Drizzle ORM over Prisma",
        tradeoffSummary:
          "Low memory overhead, but requires manual schema discipline.",
        optionsConsidered: [
          "Prisma ORM with Rust binary engine",
          "Raw pg SQL queries",
          "Drizzle ORM",
        ],
        problemFaced:
          "Prisma's heavyweight engine increases container cold start times and consumes unnecessary memory in microservices.",
        fullReasoning:
          "Drizzle provides TypeScript schema validation with zero runtime binary overhead, ideal for lightweight microservices containers.",
      },
      {
        chosenOver: "Chose API Gateway reverse proxy over direct client routing",
        tradeoffSummary:
          "Centralizes auth tokens, but creates single ingress point.",
        optionsConsidered: [
          "Direct client-to-service port routing",
          "Reverse proxy API Gateway",
          "GraphQL federation gateway",
        ],
        problemFaced:
          "Exposing individual microservice ports forces every service to duplicate authentication and CORS logic.",
        fullReasoning:
          "A lightweight reverse proxy terminates external traffic, validates tokens once, and routes requests across internal container ports.",
      },
    ],
    bugsClaim: "Three distributed system bugs and their fixes",
    bugsText:
      "Three bugs hit while orchestrating microservices, with links to fixing commits.",
    bugs: [
      {
        title: "Dual-write inconsistency on broker disconnect",
        symptom: "Payment committed without order fulfillment.",
        cause: "Kafka publish failed after SQL commit.",
        fix: "Committed payment and outbox atomically.",
        commitHash: "a94f12d",
        commitUrl: "https://github.com/vpn-cli/StreamMart/commit/a94f12d",
      },
      {
        title: "Duplicate receipts on consumer rebalance",
        symptom: "Worker sent duplicate receipts on restart.",
        cause: "Consumer rebalance replayed uncommitted batches.",
        fix: "Added Redis idempotency key deduplication.",
        commitHash: "e38c91a",
        commitUrl: "https://github.com/vpn-cli/StreamMart/commit/e38c91a",
      },
      {
        title: "Gateway timeouts on slow services",
        symptom: "Checkout returned 504 timeouts on restart.",
        cause: "Slow downstream services exhausted pool.",
        fix: "Added 3s timeouts and fallback handling.",
        commitHash: "7b204e1",
        commitUrl: "https://github.com/vpn-cli/StreamMart/commit/7b204e1",
      },
    ],
    nextStepsClaim: "What I would build next and test steps",
    nextStepsText:
      "Add dead letter queues and OpenTelemetry distributed tracing across Kafka.",
    learningStatement:
      "Distributed consistency is an architectural pattern, not a database feature.",
    tryItSteps: [
      "Clone the repository and launch the cluster with docker-compose up -d.",
      "Post a checkout payload to the API Gateway at /api/checkout with an auth token.",
      "Inspect Docker logs to watch the outbox worker publish and the order service fulfill asynchronously.",
    ],
    image: "/projects/stream-mart.png",
    githubUrl: "https://github.com/vpn-cli/StreamMart",
    liveUrl: "https://github.com/vpn-cli/StreamMart#architecture--workflow",
  },
  {
    slug: "appforge",
    title: "AppForge",
    hookPitch:
      "I built an AI app builder that turns natural language prompts into typed React interfaces and database schemas.",
    tagline:
      "An AI app builder that turns natural language prompts into typed React interfaces and database schemas.",
    category: "Generative AI & App Engine",
    year: "2026",
    role: "Full-Stack Architect",
    timeline: "May 2026 — Aug 2026",
    stack: [
      "Next.js 15",
      "TypeScript",
      "Llama-3.3-70B",
      "Groq LPU",
      "Upstash Redis",
      "Upstash Kafka",
      "Supabase",
      "Clerk",
      "Tailwind CSS",
    ],
    heroClip: {
      mp4: "/projects/appforge/appforge-prompt-to-app.mp4",
      webm: "/projects/appforge/appforge-prompt-to-app.webm",
      poster: "/projects/appforge/appforge-prompt-to-app-poster.webp",
      caption: "Prompt streams into verified React components with zero eval.",
    },
    problemVisualCaption: "Prompt input versus validated component tree generation.",
    links: {
      demo: "https://appforge-studios.vercel.app",
      repo: "https://github.com/vpn-cli/appforge",
      readme: "https://github.com/vpn-cli/appforge#readme",
    },
    metrics: [
      {
        value: "0",
        label: "Arbitrary eval() risks",
        howMeasured: "Strict AST component registry maps nodes directly to React primitives with zero eval()",
      },
      {
        value: "<800ms",
        label: "Prompt-to-layout",
        howMeasured: "TODO: Marked as placeholder. Sourced from résumé Groq LPU benchmark; needs automated test in repo.",
        isTodo: true,
      },
      {
        value: "68%",
        label: "Token cost savings",
        howMeasured: "TODO: Marked as placeholder. Sourced from semantic cache hit rate telemetry; needs test script.",
        isTodo: true,
      },
    ],
    problemClaim: "Unchecked code generation crashes and risks script injection",
    problemText:
      "Generating raw JSX in iframes breaks on subtle syntax hallucinations and risks script injection, causing blank screens and runtime crashes.",
    problemComparison: {
      before: {
        title: "Unrestricted Code eval()",
        points: [
          "LLM outputs raw JSX strings executed in an iframe",
          "Syntax hallucinations cause blank-screen runtime crashes",
          "Arbitrary script execution risks client security",
          "Manual boilerplate required for backend database setup",
        ],
      },
      after: {
        title: "Constrained AST Registry",
        points: [
          "Model emits structured JSON AST, never raw executable code",
          "Zod schema validates tree boundaries and attribute types",
          "Zero eval(): registry maps tokens to verified React components",
          "Dynamic DDL provisions real PostgreSQL tables in Supabase",
        ],
      },
    },
    architectureClaim: "Prompts stream into validated trees without arbitrary eval",
    architectureText:
      "Prompts stream to Groq LPUs emitting structured JSON ASTs. Next.js validates the tree with Zod and mounts registered React components safely.",
    architectureNodes: [
      {
        id: "prompt",
        title: "Prompt Ingestion",
        subtitle: "Next.js Edge Route",
        tech: "Next.js 15 & Vercel Edge",
        role: "Streams prompt chunks to edge.",
        screenshotUrl: "/projects/appforge/appforge-prompt-input.webp",
        screenshotCaption: "Prompt input modal with structured layout instructions.",
        codeSnippet: {
          filename: "app/api/copilot/route.ts",
          language: "typescript",
          code: `export const runtime = "edge";
export async function POST(req: Request) {
  const { prompt } = await req.json();
  const stream = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: prompt }
    ],
    stream: true,
  });
  return new Response(stream.toReadableStream());
}`,
          explanation: "Next.js edge runtime endpoint streams generation tokens with native ReadableStream.",
        },
      },
      {
        id: "groq",
        title: "Groq LPU Engine",
        subtitle: "Llama-3.3-70B",
        tech: "Groq LPU Inference",
        role: "Generates structured JSON UI trees.",
        codeSnippet: {
          filename: "lib/ai/prompts.ts",
          language: "typescript",
          code: `export const SYSTEM_PROMPT = \`You are an AST UI generator. Output valid JSON only matching the schema:
{
  "layout": "kanban" | "dashboard" | "form",
  "components": [{ "type": "card", "props": { ... } }]
}
Do not wrap in markdown code fences.\`;`,
          explanation: "Structured prompt forcing the model into strict JSON schema output format.",
        },
      },
      {
        id: "cache",
        title: "Semantic Cache",
        subtitle: "Vector Lookup",
        tech: "Upstash Redis",
        role: "Vector cache for repeated prompts.",
        codeSnippet: {
          filename: "lib/cache/redis.ts",
          language: "typescript",
          code: `export async function getCachedLayout(promptHash: string) {
  const cached = await redis.get(\`ast:\${promptHash}\`);
  if (cached) return JSON.parse(cached);
  return null;
}`,
          explanation: "Semantic vector caching retrieves cached JSON ASTs without invoking the model.",
        },
      },
      {
        id: "validator",
        title: "Zod AST Validator",
        subtitle: "Boundary Checking",
        tech: "Zod Schemas",
        role: "Validates AST against Zod schemas.",
        screenshotUrl: "/projects/appforge/appforge-editor-view.webp",
        screenshotCaption: "Validated JSON AST displayed in code editor panel.",
        codeSnippet: {
          filename: "lib/schema/astSchema.ts",
          language: "typescript",
          code: `export const AstTreeSchema = z.object({
  version: z.literal("1.0"),
  root: z.object({
    component: z.enum(["Container", "Grid", "Card", "Table", "Form"]),
    children: z.array(z.lazy(() => AstNodeSchema))
  })
});`,
          explanation: "Validates AST tree boundaries and attribute types before sending to the DOM registry.",
        },
      },
      {
        id: "registry",
        title: "React Registry",
        subtitle: "Safe Component Mount",
        tech: "React 19 Registry",
        role: "Maps verified JSON to React primitives.",
        screenshotUrl: "/projects/appforge/appforge-app-preview.webp",
        screenshotCaption: "Rendered interface mounted from registered React components.",
        codeSnippet: {
          filename: "registry/component-registry.tsx",
          language: "typescript",
          code: `const COMPONENT_MAP = { Card, Button, Input, Table };
export function AstRenderer({ node }: { node: AstNode }) {
  const Component = COMPONENT_MAP[node.type];
  if (!Component) return <FallbackNode type={node.type} />;
  return (
    <Component {...node.props}>
      {node.children?.map(c => <AstRenderer key={c.id} node={c} />)}
    </Component>
  );
}`,
          explanation: "Maps verified AST tokens directly to React DOM primitives without executing arbitrary scripts.",
        },
      },
    ],
    decisionsClaim: "Four design choices that kept rendering safe",
    decisionsText:
      "Every design choice prioritized rendering safety and sub-second generation over unconstrained raw code output.",
    decisions: [
      {
        chosenOver: "Chose constrained AST registry over arbitrary code execution (eval)",
        tradeoffSummary:
          "Zero injection risk, but limits layouts to registered components.",
        optionsConsidered: [
          "Unrestricted JSX eval() in an iframe",
          "Sandboxed web worker execution",
          "AST JSON component registry",
        ],
        problemFaced:
          "Executing raw AI-generated code causes frequent syntax crashes and exposes user sessions to cross-site scripting.",
        fullReasoning:
          "Constraining model output to a known JSON schema mapped to tested React components ensures deterministic rendering safety.",
      },
      {
        chosenOver: "Chose Groq LPUs over standard OpenAI endpoints",
        tradeoffSummary:
          "Sub-second token streaming, but requires strict prompt schemas.",
        optionsConsidered: [
          "OpenAI GPT-4o API",
          "Anthropic Claude 3.5 Sonnet",
          "Groq LPU running Llama-3.3-70B",
        ],
        problemFaced:
          "Standard LLM API calls take 3–5 seconds, breaking the interactive feedback loop while designing interfaces.",
        fullReasoning:
          "Groq LPU hardware streams tokens at 250+ tokens/second, completing multi-card layout generation rapidly.",
      },
      {
        chosenOver: "Chose Upstash Redis semantic caching over repetitive generation",
        tradeoffSummary:
          "Reduces token costs, but requires vector matching overhead.",
        optionsConsidered: [
          "Always call LLM directly",
          "Exact string cache matching",
          "Vector semantic similarity caching",
        ],
        problemFaced:
          "Users frequently test similar prompts ('kanban board', 'todo list'), incurring repetitive API costs.",
        fullReasoning:
          "Vector caching returns pre-validated AST trees instantly for common prompts while reserving LPU cycles for novel layouts.",
      },
      {
        chosenOver: "Chose dynamic Supabase DDL execution over mock state",
        tradeoffSummary:
          "Provisions real Postgres tables, but requires sanitized table names.",
        optionsConsidered: [
          "In-memory React mock state",
          "LocalStorage client persistence",
          "Dynamic PostgreSQL table provisioning",
        ],
        problemFaced:
          "Mock data fails when users expect generated CRUD apps to persist data across page reloads.",
        fullReasoning:
          "Executing sanitized DDL statements on Supabase creates real tables with foreign key constraints, turning layouts into usable apps.",
      },
    ],
    bugsClaim: "Three parser bugs and how I fixed them",
    bugsText:
      "Three bugs hit while building the streaming copilot and AST compiler, with links to commits.",
    bugs: [
      {
        title: "Markdown code fencing broke JSON parser",
        symptom: "Copilot threw unexpected token syntax errors.",
        cause: "Model wrapped JSON in markdown fences.",
        fix: "Stripped markdown fences before Zod parsing.",
        commitHash: "4272697",
        commitUrl: "https://github.com/vpn-cli/appforge/commit/4272697",
      },
      {
        title: "Serverless functions buffered edge streams",
        symptom: "Copilot streamed only after generation finished.",
        cause: "Serverless runtime buffered HTTP chunks.",
        fix: "Exported edge runtime on copilot route.",
        commitHash: "05c4cc8",
        commitUrl: "https://github.com/vpn-cli/appforge/commit/05c4cc8",
      },
      {
        title: "Auth middleware masked server action errors",
        symptom: "Public demo visitors saw cryptic 500 errors.",
        cause: "Auth middleware blocked public server actions.",
        fix: "Configured route matchers for public sandbox.",
        commitHash: "bf7b018",
        commitUrl: "https://github.com/vpn-cli/appforge/commit/bf7b018",
      },
    ],
    nextStepsClaim: "What I would build next and live demo",
    nextStepsText:
      "Add automated foreign key relationship generation and direct Next.js project export.",
    learningStatement:
      "Constrained metadata abstract syntax trees beat unrestricted raw code generation for reliable interface builders.",
    tryItSteps: [
      "Open the live demo at appforge-studios.vercel.app in your browser.",
      "Type a prompt like 'Project tracker with status columns and task cards' in the builder input.",
      "Watch the model stream and mount typed React components into the canvas with zero eval().",
    ],
    image: "/projects/appforge.jpg",
    videoUrl: "/videos/appforge/brag.mp4",
    videoPoster: "/videos/appforge/brag.jpg",
    githubUrl: "https://github.com/vpn-cli/appforge",
    liveUrl: "https://appforge-studios.vercel.app",
  },
];
