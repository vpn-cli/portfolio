"use client";

import { useEffect, useRef, useState } from "react";
import {
  Server,
  Database,
  Radio,
  Smartphone,
  ArrowRight,
  ArrowDown,
  Layers,
  CheckCircle2,
  Code2,
  Copy,
  Check,
  FileCode2,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Users,
  ShieldCheck,
} from "lucide-react";

interface DiagramElement {
  id: string;
  type: "service" | "database" | "broker" | "worker" | "topic" | "gateway";
  name: string;
  role: string;
  sourceFile: string;
  sourceLines?: string;
  codeExcerpt: string;
  language: string;
}

// Every label, topic, and source file grounded strictly in the StreamMart repository:
// 1. Client Ingress: client/src/app/page.jsx & client/src/components/Pay.jsx
// 2. API Gateway: api-gateway/index.js#L13-L24 & api-gateway/auth.middleware.js#L5-L32
// 3. Payment Service (Outbox Owner): payment-service/index.js#L33-L77
// 4. Outbox Schema: payment-service/db/schema.js#L11-L17 (outbox_events & payments)
// 5. Outbox Relay Worker: payment-service/worker.js#L21-L61 (started in payment-service/index.js#L74)
// 6. Kafka Broker Topic: kafka/admin.js#L13-L15 (topic: 'payment-successful')
// 7. Order Service Consumer: order-service/index.js#L25-L54 (subscribes to 'payment-successful')
// 8. Analytic Service Consumer: analytic-service/index.js#L21-L40 (subscribes to 'payment-successful')
const DIAGRAM_ELEMENTS: Record<string, DiagramElement> = {
  client: {
    id: "client",
    type: "service",
    name: "Next.js Client UI",
    role: "User checkout interface dispatching payments with JWT authentication to API Gateway",
    sourceFile: "client/src/app/page.jsx",
    sourceLines: "client/src/app/page.jsx#L11-L20 & client/src/components/Pay.jsx:14",
    language: "javascript",
    codeExcerpt: `// client/src/app/page.jsx line 11
const response = await fetch("http://localhost:8080/api/payment", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer mock.jwt.token", // JWT Bearer auth
  },
  body: JSON.stringify({ cart }),
});`,
  },
  gateway: {
    id: "gateway",
    type: "gateway",
    name: "API Gateway (Port 8080)",
    role: "Reverse proxy validating JWT tokens and routing checkout requests to payment-service",
    sourceFile: "api-gateway/index.js",
    sourceLines: "api-gateway/index.js#L13-L24 & api-gateway/auth.middleware.js#L5-L32",
    language: "javascript",
    codeExcerpt: `// api-gateway/index.js lines 13-24
app.use(
  "/api/payment",
  verifyToken, 
  createProxyMiddleware({
    // Routes directly to payment-service on port 8000
    target: process.env.PAYMENT_SERVICE_URL || "http://localhost:8000",
    changeOrigin: true,
    pathRewrite: {
      "^/api/payment": "/payment-service", 
    },
  })
);`,
  },
  paymentEndpoint: {
    id: "paymentEndpoint",
    type: "service",
    name: "Payment Service HTTP Endpoint",
    role: "Express endpoint receiving checkout proxy and coordinating atomic outbox persistence",
    sourceFile: "payment-service/index.js",
    sourceLines: "payment-service/index.js#L33-L66 & docker-compose.yml:4-14",
    language: "javascript",
    codeExcerpt: `// payment-service/index.js lines 33-66
app.post("/", async (req, res) => {
  const { cart } = req.body;
  const userId = req.headers['x-user-id'] || "123";

  if (process.env.DATABASE_URL) {
    const amount = cart ? cart.length * 10 : 0;
    try {
      await db.transaction(async (tx) => {
        await tx.insert(payments).values({
          userId: userId,
          amount: String(amount),
          status: "completed"
        });
        
        await tx.insert(outboxEvents).values({
          topic: "payment-successful",
          payload: { userId, cart },
          published: false 
        });
      });
    } catch (e) {
      return res.status(500).send("Database transaction failed");
    }
  }

  // Notice: Absolutely no producer.send() here! The background worker will do it.
  return res.status(200).send("Payment processed and event safely queued in outbox.");
});`,
  },
  outboxDb: {
    id: "outboxDb",
    type: "database",
    name: "outbox_events Table (Neon PostgreSQL)",
    role: "Owned by payment-service: stores event payloads atomically alongside payments table",
    sourceFile: "payment-service/db/schema.js",
    sourceLines: "payment-service/db/schema.js#L11-L17",
    language: "javascript",
    codeExcerpt: `// payment-service/db/schema.js lines 11-17
export const outboxEvents = pgTable('outbox_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  topic: text('topic').notNull(),
  payload: jsonb('payload').notNull(),
  published: boolean('published').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});`,
  },
  relayWorker: {
    id: "relayWorker",
    type: "worker",
    name: "Outbox Relay Worker (Inside Payment Service)",
    role: "Background worker started inside payment-service polling outbox_events every 5s and publishing to Kafka",
    sourceFile: "payment-service/worker.js",
    sourceLines: "payment-service/worker.js#L21-L61 & payment-service/index.js#L74",
    language: "javascript",
    codeExcerpt: `// payment-service/worker.js lines 28-56
// Poll every 5 seconds for unpublished events
setInterval(async () => {
  const events = await db
    .select()
    .from(outboxEvents)
    .where(eq(outboxEvents.published, false))
    .limit(50); // Batch limit

  for (const event of events) {
    try {
      // Attempt to publish to Kafka broker
      await producer.send({
        topic: event.topic,
        messages: [{ value: JSON.stringify(event.payload) }],
      });

      // Committing publish back to DB only if Kafka strictly succeeds
      await db
        .update(outboxEvents)
        .set({ published: true })
        .where(eq(outboxEvents.id, event.id));
    } catch (err) {
      console.error(\`Failed to publish event ID \${event.id} (Retrying next cycle)\`, err);
    }
  }
}, 5000);`,
  },
  kafka: {
    id: "kafka",
    type: "broker",
    name: "Apache Kafka Broker (Topic: payment-successful)",
    role: "Partitioned distributed log receiving outbox events and decoupling payment from consumers",
    sourceFile: "kafka/admin.js",
    sourceLines: "kafka/admin.js#L13-L15 & docker-compose.yml:12",
    language: "javascript",
    codeExcerpt: `// kafka/admin.js lines 10-19
const run = async () => {
  await admin.connect();
  await admin.createTopics({
    topics: [
      { topic: "payment-successful" }, // Target topic for outbox events
      { topic: "order-successful" },   // Direct publish topic (omitted from outbox diagram)
      { topic: "email-successful" },   // Direct publish topic (omitted from outbox diagram)
    ],
  });
};`,
  },
  orderService: {
    id: "orderService",
    type: "service",
    name: "Order Service (Consumer)",
    role: "Subscribes to topic 'payment-successful' from beginning and persists order in PostgreSQL",
    sourceFile: "order-service/index.js",
    sourceLines: "order-service/index.js#L25-L54 & docker-compose.yml:16-28",
    language: "javascript",
    codeExcerpt: `// order-service/index.js lines 25-54
await consumer.subscribe({
  topic: "payment-successful",
  fromBeginning: true,
});

await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    const value = message.value.toString();
    const { userId, cart } = JSON.parse(value);

    // Create order on real DB (Drizzle ORM)
    if (process.env.DATABASE_URL) {
      await db.insert(orders).values({
        userId: userId,
        items: cart,
        status: "processing"
      }).returning();
    }
  },
});`,
  },
  analyticService: {
    id: "analyticService",
    type: "service",
    name: "Analytic Service (Consumer)",
    role: "Subscribes to topic 'payment-successful' to record user spend and cart telemetry",
    sourceFile: "analytic-service/index.js",
    sourceLines: "analytic-service/index.js#L21-L40 & docker-compose.yml:40-48",
    language: "javascript",
    codeExcerpt: `// analytic-service/index.js lines 21-40
await consumer.subscribe({
  topics: ["payment-successful", "order-successful", "email-successful"],
  fromBeginning: true,
});

await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    if (topic === "payment-successful") {
      const { userId, cart } = JSON.parse(message.value.toString());
      const total = cart.reduce((acc, item) => acc + item.price, 0).toFixed(2);
      console.log(\`Analytic consumer: User \${userId} paid \${total}\`);
    }
  },
});`,
  },
};

const PHASES = [
  {
    step: 1,
    title: "1. Ingress Checkout → API Gateway",
    activeId: "client",
    targetId: "gateway",
    description: "Next.js UI posts checkout payload to API Gateway (Port 8080) with JWT Bearer authentication.",
    source: "client/src/app/page.jsx#L11 -> api-gateway/index.js#L13",
  },
  {
    step: 2,
    title: "2. Reverse Proxy → Payment Service",
    activeId: "gateway",
    targetId: "paymentEndpoint",
    description: "Gateway verifies JWT, sets x-user-id header, and routes request to Payment Service (Port 8000).",
    source: "api-gateway/index.js#L13-L24 -> payment-service/index.js#L33",
  },
  {
    step: 3,
    title: "3. Atomic Outbox DB Transaction (Inside payment-service)",
    activeId: "paymentEndpoint",
    targetId: "outboxDb",
    description: "Inside payment-service: db.transaction() commits payments AND outbox_events in ONE atomic SQL commit.",
    source: "payment-service/index.js#L45-L57 & payment-service/db/schema.js#L11",
  },
  {
    step: 4,
    title: "4. Outbox Worker Poll & Kafka Publish (Inside payment-service)",
    activeId: "relayWorker",
    targetId: "kafka",
    description: "Worker running inside payment-service polls unpublished events every 5s and streams to topic 'payment-successful'.",
    source: "payment-service/worker.js#L28-L56",
  },
  {
    step: 5,
    title: "5. Async Ingestion by Consumers",
    activeId: "kafka",
    targetId: "orderService",
    description: "Order Service and Analytic Service consume 'payment-successful' from Kafka cluster independently.",
    source: "order-service/index.js#L25 & analytic-service/index.js#L21",
  },
];

export function StreamMartDiagram() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState<string>("paymentEndpoint");
  const [currentPhase, setCurrentPhase] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionQuery.matches);
    const handleMotion = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    motionQuery.addEventListener("change", handleMotion);

    return () => motionQuery.removeEventListener("change", handleMotion);
  }, []);

  useEffect(() => {
    if (reducedMotion || !isPlaying) return;

    const interval = setInterval(() => {
      setCurrentPhase((prev) => (prev + 1) % PHASES.length);
    }, 3200);

    return () => clearInterval(interval);
  }, [reducedMotion, isPlaying]);

  const activePhase = PHASES[currentPhase];
  const activeElement = DIAGRAM_ELEMENTS[selectedId] || DIAGRAM_ELEMENTS.paymentEndpoint;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(activeElement.codeExcerpt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full rounded-[var(--card-radius)] border border-[var(--border-subtle)] bg-[var(--surface-tile-elevated)] p-4 sm:p-6 shadow-sm space-y-5"
      aria-label="StreamMart Architecture and Transactional Outbox Flow Diagram"
    >
      {/* ━━━ TOP BAR: STRICT LABEL "Diagram" + STEP CONTROLS ━━━ */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-md bg-[var(--text-primary)] text-[var(--bg-canvas)] tracking-wider uppercase">
            Diagram
          </span>
          <span className="text-xs font-medium text-[var(--text-primary)]">
            StreamMart Architecture & Transactional Outbox Flow
          </span>
          <span className="text-[var(--border-subtle)] hidden sm:inline" aria-hidden="true">·</span>
          <span className="text-[11px] font-mono text-[var(--text-tertiary)] hidden sm:inline">
            Ground Truth: payment-service owns outbox_events
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[var(--text-secondary)]">
            Step {activePhase.step}/{PHASES.length}
          </span>

          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="min-h-[34px] px-2.5 py-1 rounded-lg bg-[var(--surface-tile)] hover:bg-[var(--surface-tile-hover)] border border-[var(--border-subtle)] text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] inline-flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
            aria-label={isPlaying ? "Pause simulation" : "Play simulation"}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Play</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setCurrentPhase(0)}
            className="min-h-[34px] p-2 rounded-lg bg-[var(--surface-tile)] hover:bg-[var(--surface-tile-hover)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
            title="Restart simulation"
            aria-label="Restart simulation"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* ━━━ STEP NARRATIVE BANNER ━━━ */}
      <div className="p-3.5 rounded-xl bg-[var(--surface-tile)] border border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-medium text-[var(--text-primary)]">
              {activePhase.title}
            </span>
          </div>
          <p className="text-[var(--text-secondary)]">
            {activePhase.description}
          </p>
        </div>

        <div className="text-[11px] font-mono text-[var(--text-tertiary)] shrink-0">
          Source: <span className="text-[var(--text-secondary)]">{activePhase.source}</span>
        </div>
      </div>

      {/* ━━━ VISUAL ARCHITECTURE CANVAS: OUTBOX SITS INSIDE PAYMENT SERVICE ━━━ */}
      <div className="space-y-4">
        {/* ROW 1: INGRESS (Client -> API Gateway) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
          {/* Node 1: Client */}
          <button
            type="button"
            onClick={() => setSelectedId("client")}
            className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 relative flex flex-col justify-between min-h-[96px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 ${
              selectedId === "client"
                ? "bg-[var(--surface-tile)] border-[var(--text-primary)] shadow-md"
                : activePhase.activeId === "client"
                ? "bg-[var(--surface-tile)] border-amber-500/50 shadow-sm"
                : "bg-[var(--surface-tile)] border-[var(--border-subtle)] hover:border-[var(--border-hover)]"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-[var(--text-tertiary)] uppercase">
                Client UI · Port 3000
              </span>
              <Smartphone className="w-3.5 h-3.5 text-[var(--text-primary)]" aria-hidden="true" />
            </div>
            <div>
              <div className="text-xs font-medium text-[var(--text-primary)]">Next.js Client UI</div>
              <div className="font-mono text-[10px] text-[var(--text-tertiary)] truncate mt-0.5">
                client/src/app/page.jsx
              </div>
            </div>
            <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
              JWT Bearer Auth → POST /api/payment
            </div>
          </button>

          {/* Node 2: API Gateway */}
          <button
            type="button"
            onClick={() => setSelectedId("gateway")}
            className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 relative flex flex-col justify-between min-h-[96px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 ${
              selectedId === "gateway"
                ? "bg-[var(--surface-tile)] border-[var(--text-primary)] shadow-md"
                : activePhase.activeId === "gateway" || activePhase.targetId === "gateway"
                ? "bg-[var(--surface-tile)] border-amber-500/50 shadow-sm"
                : "bg-[var(--surface-tile)] border-[var(--border-subtle)] hover:border-[var(--border-hover)]"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-[var(--text-tertiary)] uppercase">
                Gateway · Port 8080
              </span>
              <Server className="w-3.5 h-3.5 text-[var(--text-primary)]" aria-hidden="true" />
            </div>
            <div>
              <div className="text-xs font-medium text-[var(--text-primary)]">API Gateway</div>
              <div className="font-mono text-[10px] text-[var(--text-tertiary)] truncate mt-0.5">
                api-gateway/index.js
              </div>
            </div>
            <div className="text-[10px] font-mono text-[var(--text-secondary)]">
              Routes checkout to payment-service:8000
            </div>
          </button>
        </div>

        {/* ROW 2: SERVICE BOUNDARY - PAYMENT SERVICE OWNS THE OUTBOX & RELAY WORKER */}
        <div className="rounded-xl border-2 border-[var(--border-hover)] bg-[var(--surface-tile)] p-4 sm:p-5 space-y-3.5">
          {/* Service Boundary Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-500" aria-hidden="true" />
              <span className="text-xs font-semibold text-[var(--text-primary)]">
                Service Boundary: payment-service (Port 8000)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-medium">
                Owns Transactional Outbox
              </span>
            </div>
            <span className="text-[10px] font-mono text-[var(--text-tertiary)]">
              payment-service/index.js & worker.js
            </span>
          </div>

          {/* Internal Components of Payment Service: Endpoint, DB, Worker */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Box 2A: REST Endpoint */}
            <button
              type="button"
              onClick={() => setSelectedId("paymentEndpoint")}
              className={`text-left p-3.5 rounded-lg border transition-all duration-200 flex flex-col justify-between min-h-[115px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 ${
                selectedId === "paymentEndpoint"
                  ? "bg-[var(--surface-tile-elevated)] border-[var(--text-primary)] shadow-sm"
                  : activePhase.activeId === "paymentEndpoint" || activePhase.targetId === "paymentEndpoint"
                  ? "bg-[var(--surface-tile-elevated)] border-amber-500/50"
                  : "bg-[var(--surface-tile-elevated)] border-[var(--border-subtle)] hover:border-[var(--border-hover)]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[var(--text-tertiary)] uppercase">
                  Express Endpoint
                </span>
                <Server className="w-3.5 h-3.5 text-[var(--text-primary)]" aria-hidden="true" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-medium text-[var(--text-primary)]">
                  POST / (Checkout Handler)
                </div>
                <div className="font-mono text-[10px] text-[var(--text-tertiary)] truncate">
                  payment-service/index.js:33
                </div>
              </div>
              <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                Initiates db.transaction()
              </div>
            </button>

            {/* Box 2B: Neon PostgreSQL (payments & outbox_events) */}
            <button
              type="button"
              onClick={() => setSelectedId("outboxDb")}
              className={`text-left p-3.5 rounded-lg border transition-all duration-200 flex flex-col justify-between min-h-[115px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 ${
                selectedId === "outboxDb"
                  ? "bg-[var(--surface-tile-elevated)] border-[var(--text-primary)] shadow-sm"
                  : activePhase.targetId === "outboxDb"
                  ? "bg-[var(--surface-tile-elevated)] border-amber-500/50"
                  : "bg-[var(--surface-tile-elevated)] border-[var(--border-subtle)] hover:border-[var(--border-hover)]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[var(--text-tertiary)] uppercase">
                  Neon PostgreSQL
                </span>
                <Database className="w-3.5 h-3.5 text-[var(--text-primary)]" aria-hidden="true" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-medium text-[var(--text-primary)]">
                  outbox_events Table
                </div>
                <div className="font-mono text-[10px] text-[var(--text-tertiary)] truncate">
                  payment-service/db/schema.js:11
                </div>
              </div>
              <div className="text-[10px] font-mono text-[var(--text-secondary)]">
                Single atomic SQL commit boundary
              </div>
            </button>

            {/* Box 2C: Outbox Relay Worker (Inside payment-service) */}
            <button
              type="button"
              onClick={() => setSelectedId("relayWorker")}
              className={`text-left p-3.5 rounded-lg border transition-all duration-200 flex flex-col justify-between min-h-[115px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 ${
                selectedId === "relayWorker"
                  ? "bg-[var(--surface-tile-elevated)] border-[var(--text-primary)] shadow-sm"
                  : activePhase.activeId === "relayWorker"
                  ? "bg-[var(--surface-tile-elevated)] border-amber-500/50"
                  : "bg-[var(--surface-tile-elevated)] border-[var(--border-subtle)] hover:border-[var(--border-hover)]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[var(--text-tertiary)] uppercase">
                  Relay Worker · 5s Poll
                </span>
                <Radio className="w-3.5 h-3.5 text-[var(--text-primary)]" aria-hidden="true" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-medium text-[var(--text-primary)]">
                  Outbox Relay Worker
                </div>
                <div className="font-mono text-[10px] text-[var(--text-tertiary)] truncate">
                  payment-service/worker.js:21
                </div>
              </div>
              <div className="text-[10px] font-mono text-[var(--text-secondary)]">
                Polls unpublished rows → Kafka publish
              </div>
            </button>
          </div>
        </div>

        {/* ROW 3: KAFKA BROKER (Topic: payment-successful) */}
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-tile)] p-4">
          <button
            type="button"
            onClick={() => setSelectedId("kafka")}
            className={`w-full text-left p-3.5 rounded-lg border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 ${
              selectedId === "kafka"
                ? "bg-[var(--surface-tile-elevated)] border-[var(--text-primary)] shadow-sm"
                : activePhase.activeId === "kafka" || activePhase.targetId === "kafka"
                ? "bg-[var(--surface-tile-elevated)] border-amber-500/50"
                : "bg-[var(--surface-tile-elevated)] border-[var(--border-subtle)] hover:border-[var(--border-hover)]"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--surface-tile)] border border-[var(--border-subtle)] flex items-center justify-center shrink-0">
                <Radio className="w-4 h-4 text-[var(--text-primary)]" aria-hidden="true" />
              </div>
              <div>
                <div className="text-xs font-medium text-[var(--text-primary)]">
                  Apache Kafka Message Broker
                </div>
                <div className="font-mono text-[10px] text-[var(--text-tertiary)]">
                  kafka/admin.js:13 & docker-compose.yml:12
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-[10.5px] px-2.5 py-1 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-semibold">
                Topic: payment-successful
              </span>
              <span className="text-[10px] font-mono text-[var(--text-tertiary)] hidden md:inline">
                (Decoupled outbox event stream)
              </span>
            </div>
          </button>
        </div>

        {/* ROW 4: ASYNC CONSUMERS OF 'payment-successful' */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-tertiary)] px-1">
            <span>Downstream Consumers (Subscribed to topic: payment-successful)</span>
            <span className="text-[10px] text-[var(--text-secondary)]">Direct downstream publishes omitted</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Consumer 1: Order Service */}
            <button
              type="button"
              onClick={() => setSelectedId("orderService")}
              className={`text-left p-3.5 rounded-xl border transition-all duration-200 flex flex-col justify-between min-h-[96px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 ${
                selectedId === "orderService"
                  ? "bg-[var(--surface-tile)] border-[var(--text-primary)] shadow-md"
                  : activePhase.activeId === "orderService" || activePhase.targetId === "orderService"
                  ? "bg-[var(--surface-tile)] border-amber-500/50 shadow-sm"
                  : "bg-[var(--surface-tile)] border-[var(--border-subtle)] hover:border-[var(--border-hover)]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[var(--text-tertiary)] uppercase">
                  Consumer Group: order-service
                </span>
                <Server className="w-3.5 h-3.5 text-[var(--text-primary)]" aria-hidden="true" />
              </div>
              <div>
                <div className="text-xs font-medium text-[var(--text-primary)]">Order Service</div>
                <div className="font-mono text-[10px] text-[var(--text-tertiary)] truncate mt-0.5">
                  order-service/index.js:25
                </div>
              </div>
              <div className="text-[10px] font-mono text-[var(--text-secondary)]">
                Subscribes to payment-successful → persists order in DB
              </div>
            </button>

            {/* Consumer 2: Analytic Service */}
            <button
              type="button"
              onClick={() => setSelectedId("analyticService")}
              className={`text-left p-3.5 rounded-xl border transition-all duration-200 flex flex-col justify-between min-h-[96px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 ${
                selectedId === "analyticService"
                  ? "bg-[var(--surface-tile)] border-[var(--text-primary)] shadow-md"
                  : "bg-[var(--surface-tile)] border-[var(--border-subtle)] hover:border-[var(--border-hover)]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[var(--text-tertiary)] uppercase">
                  Consumer Group: analytic-service
                </span>
                <Users className="w-3.5 h-3.5 text-[var(--text-primary)]" aria-hidden="true" />
              </div>
              <div>
                <div className="text-xs font-medium text-[var(--text-primary)]">Analytic Service</div>
                <div className="font-mono text-[10px] text-[var(--text-tertiary)] truncate mt-0.5">
                  analytic-service/index.js:21
                </div>
              </div>
              <div className="text-[10px] font-mono text-[var(--text-secondary)]">
                Subscribes to payment-successful → records user cart spend
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* ━━━ REPO GROUNDING DRAWER: REAL CODE EXCERPT FOR SELECTED NODE ━━━ */}
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-tile)] p-4 sm:p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--border-subtle)]">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <FileCode2 className="w-4 h-4 text-[var(--text-primary)]" aria-hidden="true" />
              <span className="text-xs font-medium text-[var(--text-primary)]">
                {activeElement.name}
              </span>
              <span className="text-[var(--border-subtle)]" aria-hidden="true">·</span>
              <span className="text-[11px] font-mono text-[var(--text-secondary)]">
                {activeElement.sourceFile}
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)]">
              {activeElement.role}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] text-[var(--text-tertiary)]">
              {activeElement.sourceLines || activeElement.sourceFile}
            </span>

            <button
              type="button"
              onClick={handleCopyCode}
              className="min-h-[32px] px-3 py-1 rounded-lg bg-[var(--surface-tile-elevated)] hover:bg-[var(--surface-tile-hover)] border border-[var(--border-subtle)] text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] inline-flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
              aria-label="Copy real code excerpt"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
                  <span className="text-emerald-500 font-mono text-[11px]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                  <span className="font-mono text-[11px]">Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Real Code Window */}
        <pre className="p-3.5 rounded-lg bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] font-mono text-xs leading-relaxed text-[var(--text-primary)] overflow-x-auto">
          <code>{activeElement.codeExcerpt}</code>
        </pre>
      </div>

      {/* ━━━ EXPLICIT FLOW CAPTION ━━━ */}
      <p className="text-xs text-[var(--text-tertiary)] font-mono text-center pt-1 border-t border-[var(--border-subtle)]">
        Diagram shows only the transactional outbox flow (Payment Service → Kafka topic &apos;payment-successful&apos; → Order &amp; Analytic consumers); subsequent direct Kafka publishes by order-service and email-service are omitted.
      </p>
    </div>
  );
}
