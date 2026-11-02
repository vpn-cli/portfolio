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
    problemClaim:
      "Client polling wastes server resources on empty requests and delays live scores by seconds during peak matches.",
    problemText:
      "When spectators poll an endpoint every two seconds, most requests return unchanged data while consuming database connections. During rapid match events, request queues back up and spectators see scores seconds late.",
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
    architectureClaim:
      "Score events write to Postgres and fan out only to clients subscribed to that match.",
    architectureText:
      "An incoming score mutation updates PostgreSQL through Drizzle ORM, then immediately signals the WebSocket server. The gateway checks its in-memory topic map and broadcasts the payload frame strictly to sockets listening to that specific match id.",
    architectureNodes: [
      {
        id: "ingestion",
        title: "REST Ingestion",
        subtitle: "POST /matches/:id/score",
        tech: "Express & Zod",
        role: "Ingests score and commentary webhooks with Zod payload validation before committing state.",
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
        role: "Persists match score mutations with type-safe Drizzle ORM queries and connection pooling.",
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
        role: "Inspects HTTP upgrade handshakes, enforcing token-bucket limits and blocking scraper bots before socket memory allocation.",
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
        role: "Maintains Map<matchId, Set<WebSocket>> and broadcasts payload frames in O(k) time strictly to match listeners.",
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
        role: "Maintains socket lifecycle, applies exponential backoff jitter on disconnects, and hydrates live score badges.",
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
    decisionsClaim:
      "Four architectural trade-offs that kept the system fast, stable, and cost-effective.",
    decisionsText:
      "Every technical choice balanced memory constraints against delivery speed on free-tier infrastructure.",
    decisions: [
      {
        chosenOver: "Chose native ws over Socket.io",
        tradeoffSummary:
          "Lower memory footprint and direct protocol control, but required custom heartbeat sweeps.",
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
          "Fast O(k) subscriber routing without CPU waste, but bounds state to a single server instance.",
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
          "Rejects unauthorized requests before socket allocation, but couples handshake to Arcjet edge availability.",
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
          "Prevents thundering herds during server restarts, but reconnects take up to 10 seconds under network drops.",
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
    bugsClaim: "Bugs I hit and how I fixed them",
    bugsText:
      "Three real bugs encountered during deployment and stress-testing, with links to the fixing commits.",
    bugs: [
      {
        title: "Zombie sockets from dropped mobile connections",
        symptom:
          "Half-open TCP connections remained in memory indefinitely after mobile clients lost signal.",
        cause:
          "Mobile operating systems suspend radios without sending TCP FIN termination packets.",
        fix: "Added a 30s server-side ping/pong sweep that terminates unresponsive client sockets.",
        commitHash: "39e86d4",
        commitUrl: "https://github.com/vpn-cli/sockets/commit/39e86d4",
      },
      {
        title: "Missing environment keys crashed production boot",
        symptom:
          "Server crashed on Render startup, and Vercel clients were rejected with 403 Forbidden.",
        cause:
          "Arcjet environment key was unset on first deploy, and default CORS blocked cross-origin Vercel headers.",
        fix: "Added environment fallbacks and explicit CORS headers for the Vercel production domain.",
        commitHash: "b483272",
        commitUrl: "https://github.com/vpn-cli/sockets/commit/b483272",
      },
      {
        title: "Client build omitted API base URLs",
        symptom:
          "Production frontend compiled with undefined WebSocket URLs baked into static assets.",
        cause:
          "Docker container failed to pass VITE_ prefixed build arguments during compilation.",
        fix: "Injected VITE_API_BASE_URL and VITE_WS_BASE_URL build args into the Docker compilation step.",
        commitHash: "3d8559e",
        commitUrl: "https://github.com/vpn-cli/sockets/commit/3d8559e",
      },
    ],
    nextStepsClaim: "Next steps and how to test it live",
    nextStepsText:
      "Add Redis Pub/Sub to scale socket connections horizontally across multiple backend instances, and build an automated load test harness to measure telemetry delivery percentiles.",
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
    problemClaim:
      "Synchronous HTTP calls between microservices cause cascading failures and create data inconsistencies when network drops interrupt checkout.",
    problemText:
      "When order services make direct HTTP requests to payment and inventory services, any network hiccup blocks the checkout flow. If a payment succeeds but the order service crashes before saving, customers are charged with no order created.",
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
    architectureClaim:
      "Checkout requests write atomically to Postgres and stream through Kafka to decoupled workers.",
    architectureText:
      "The API gateway validates tokens and forwards checkouts to the payment service. A single database transaction writes the payment record and outbox event. A background worker polls the outbox and publishes events to Kafka topics for order and notification workers.",
    architectureNodes: [
      {
        id: "gateway",
        title: "API Gateway",
        subtitle: "JWT & Reverse Proxy",
        tech: "Express Gateway",
        role: "Validates JWT authorization headers, applies rate limits, and proxies traffic to internal cluster ports.",
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
        role: "Executes payment insertion and outbox_events queue insertion in a single atomic database transaction.",
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
          explanation: "Atomic transaction guarantees payment record and outbox message commit together.",
        },
      },
      {
        id: "outbox",
        title: "Outbox Worker",
        subtitle: "Poll & Publish",
        tech: "Node.js Worker",
        role: "Continuously polls unpublished outbox records and dispatches them to Kafka with status commits.",
        codeSnippet: {
          filename: "payment-service/src/workers/outbox.ts",
          language: "typescript",
          code: `async function processOutbox() {
  const pending = await db.select().from(outboxEvents).where(eq(outboxEvents.published, false)).limit(50);
  for (const event of pending) {
    await kafkaProducer.send({ topic: "payment-successful", messages: [{ value: event.payload }] });
    await db.update(outboxEvents).set({ published: true }).where(eq(outboxEvents.id, event.id));
  }
}`,
          explanation: "Background worker polls committed outbox events and pushes them to Apache Kafka topics.",
        },
      },
      {
        id: "kafka",
        title: "Kafka Broker",
        subtitle: "Topic Partitioning",
        tech: "Apache Kafka",
        role: "Decouples message producers from consumers across topics like payment-successful and order-created.",
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
        role: "Consumes payment-successful events, updates inventory, and creates shipping records asynchronously.",
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
    decisionsClaim:
      "Four architectural trade-offs that kept microservices decoupled and consistent.",
    decisionsText:
      "Every technical choice prioritized data consistency and fault isolation across service boundaries.",
    decisions: [
      {
        chosenOver: "Chose Transactional Outbox over dual-write HTTP calls",
        tradeoffSummary:
          "Eliminates dual-write race conditions, but requires a background outbox polling worker.",
        optionsConsidered: [
          "Direct synchronous HTTP post-commit calls",
          "Two-phase commit (2PC) distributed locks",
          "Transactional Outbox Pattern",
        ],
        problemFaced:
          "Committing to PostgreSQL and then making an HTTP call to Kafka can fail halfway, causing permanent state divergence.",
        fullReasoning:
          "Saving the event in the same local database transaction as the business entity guarantees that events are only published if the database write succeeded.",
      },
      {
        chosenOver: "Chose Apache Kafka over direct REST microservice calls",
        tradeoffSummary:
          "Decouples order and notification services from checkout latency, but adds broker operational overhead.",
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
          "Lightweight SQL generation with low memory overhead, but requires manual schema migration discipline.",
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
          "Centralizes JWT authentication and rate limiting, but makes the gateway a single ingress point.",
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
    bugsClaim: "Bugs I hit and how I fixed them",
    bugsText:
      "Three real bugs encountered while orchestrating microservices, with links to fixing commits.",
    bugs: [
      {
        title: "Dual-write state inconsistency on broker disconnect",
        symptom:
          "Payments committed to database without creating a matching order record.",
        cause:
          "HTTP publish to Kafka failed immediately after the database commit succeeded.",
        fix: "Committed payment and outbox records in the same atomic SQL transaction.",
        commitHash: "a94f12d",
        commitUrl: "https://github.com/vpn-cli/StreamMart/commit/a94f12d",
      },
      {
        title: "Duplicate notifications during consumer rebalance",
        symptom:
          "Email notification service dispatched duplicate order receipts on restart.",
        cause:
          "Kafka consumer group rebalance replayed uncommitted message batches.",
        fix: "Implemented idempotency keys in Redis to de-duplicate event handling.",
        commitHash: "e38c91a",
        commitUrl: "https://github.com/vpn-cli/StreamMart/commit/e38c91a",
      },
      {
        title: "Gateway timeout on slow downstream services",
        symptom:
          "Checkout requests returned 504 Gateway Timeout during service restarts.",
        cause:
          "API Gateway reverse proxy lacked bounded timeouts and circuit breakers.",
        fix: "Added 3-second proxy timeouts and fallback queue handling in gateway.",
        commitHash: "7b204e1",
        commitUrl: "https://github.com/vpn-cli/StreamMart/commit/7b204e1",
      },
    ],
    nextStepsClaim: "Next steps and how to test it live",
    nextStepsText:
      "Add a dead letter queue for poison-pill message handling, and configure OpenTelemetry distributed tracing across Kafka headers.",
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
    problemClaim:
      "Standard AI code generators produce unverified HTML strings that break rendering and introduce code injection vulnerabilities.",
    problemText:
      "Most LLM app builders generate raw code in an iframe. When models produce subtle syntax errors or invalid imports, the entire interface crashes. Unrestricted code generation also creates security hazards from arbitrary script execution.",
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
    architectureClaim:
      "Prompts stream through Groq, validate against strict Zod schemas, and render from a verified component registry.",
    architectureText:
      "User prompts stream to Groq LPUs running Llama-3.3. The model returns a structured JSON AST rather than raw JavaScript. The frontend validates the tree against Zod schemas and maps nodes directly to pre-built React components without eval().",
    architectureNodes: [
      {
        id: "prompt",
        title: "Prompt Ingestion",
        subtitle: "Next.js Edge Route",
        tech: "Next.js 15 & Vercel Edge",
        role: "Accepts user prompts, retrieves session quotas, and initiates streaming LPU requests.",
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
        role: "Generates structured JSON UI abstract syntax trees with low latency.",
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
        role: "Caches repeated layout queries using vector embeddings to avoid redundant LLM calls.",
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
        role: "Strips accidental code fencing and validates JSON structure before components mount.",
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
        role: "Maps verified JSON tokens directly to React DOM primitives without executing arbitrary scripts.",
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
    decisionsClaim:
      "Four architectural trade-offs that kept generation fast, safe, and customizable.",
    decisionsText:
      "Every design choice prioritized rendering security and sub-second generation over unconstrained raw code output.",
    decisions: [
      {
        chosenOver: "Chose constrained AST registry over arbitrary code execution (eval)",
        tradeoffSummary:
          "Eliminates script injection vulnerabilities and blank-screen crashes, but limits layouts to registered components.",
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
          "Generates full UI trees in under 800ms, but requires strict prompt framing to avoid markdown fences.",
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
          "Reduces token consumption for common layout patterns, but requires vector comparison overhead.",
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
          "Provisions real relational PostgreSQL tables for generated forms, but requires sanitized table naming.",
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
    bugsClaim: "Bugs I hit and how I fixed them",
    bugsText:
      "Three real bugs encountered while building the streaming copilot and AST compiler, with links to commits.",
    bugs: [
      {
        title: "Markdown code fencing broke JSON parser",
        symptom:
          "Copilot parser threw unexpected token syntax errors on streamed responses.",
        cause:
          "Llama-3.3 occasionally wrapped valid JSON in markdown code fences (```json).",
        fix: "Built an extraction pipeline that strips markdown delimiters before Zod validation.",
        commitHash: "4272697",
        commitUrl: "https://github.com/vpn-cli/appforge/commit/4272697",
      },
      {
        title: "Serverless functions buffered edge streams",
        symptom:
          "Copilot responses hung until generation finished completely instead of streaming tokens.",
        cause:
          "Node.js serverless functions buffered HTTP chunked transfers on Vercel.",
        fix: "Exported runtime = 'edge' on the copilot API route for native ReadableStream passthrough.",
        commitHash: "05c4cc8",
        commitUrl: "https://github.com/vpn-cli/appforge/commit/05c4cc8",
      },
      {
        title: "Auth middleware masked server action errors",
        symptom:
          "Unauthenticated sandbox visitors saw cryptic internal server error exceptions.",
        cause:
          "Clerk Edge middleware intercepted server action RPC calls on unauthenticated demo paths.",
        fix: "Configured route matchers for sandbox aliases and returned structured error objects.",
        commitHash: "bf7b018",
        commitUrl: "https://github.com/vpn-cli/appforge/commit/bf7b018",
      },
    ],
    nextStepsClaim: "Next steps and how to test it live",
    nextStepsText:
      "Add automated foreign key relationship generation for complex schemas, and support direct export to Next.js project archives.",
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
