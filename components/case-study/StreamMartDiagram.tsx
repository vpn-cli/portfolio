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
} from "lucide-react";

interface DiagramElement {
  id: string;
  type: "service" | "database" | "broker" | "worker" | "topic" | "arrow";
  name: string;
  role: string;
  sourceFile: string;
  sourceLines?: string;
  codeExcerpt: string;
  language: string;
}

const DIAGRAM_ELEMENTS: Record<string, DiagramElement> = {
  client: {
    id: "client",
    type: "service",
    name: "Next.js Client UI",
    role: "User checkout interface dispatching payments with JWT authentication",
    sourceFile: "client/src/app/page.jsx",
    sourceLines: "client/src/components/Pay.jsx & docker-compose.yml:50",
    language: "javascript",
    codeExcerpt: `// client/src/components/Pay.jsx
const handlePay = async () => {
  const res = await fetch("http://localhost:8080/api/payment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer mock.jwt.token", // JWT Bearer auth
    },
    body: JSON.stringify({ cart }),
  });
};`,
  },
  gateway: {
    id: "gateway",
    type: "service",
    name: "API Gateway (Port 8080)",
    role: "Reverse proxy validating JWT tokens and injecting x-user-id headers",
    sourceFile: "api-gateway/index.js",
    sourceLines: "api-gateway/index.js#L13-L27 & api-gateway/auth.middleware.js#L5-L32",
    language: "javascript",
    codeExcerpt: `// api-gateway/index.js lines 13-24
app.use(
  "/api/payment",
  verifyToken, 
  createProxyMiddleware({
    target: process.env.PAYMENT_SERVICE_URL || "http://localhost:8000",
    changeOrigin: true,
    pathRewrite: {
      "^/api/payment": "/", 
    },
  })
);`,
  },
  payment: {
    id: "payment",
    type: "service",
    name: "Payment Service (Port 8000)",
    role: "Express service managing checkout requests and initiating atomic DB transaction",
    sourceFile: "payment-service/index.js",
    sourceLines: "payment-service/index.js#L33-L77 & docker-compose.yml:4-14",
    language: "javascript",
    codeExcerpt: `// payment-service/index.js lines 45-57
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
});`,
  },
  postgres: {
    id: "postgres",
    type: "database",
    name: "Neon Serverless Postgres",
    role: "Stores payments and outbox_events tables in single atomic SQL commit boundary",
    sourceFile: "payment-service/db/schema.js",
    sourceLines: "payment-service/db/schema.js#L3-L25 & README.md#L43",
    language: "javascript",
    codeExcerpt: `// payment-service/db/schema.js
export const payments = pgTable('payments', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull(),
  amount: numeric('amount').notNull(),
  status: text('status').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const outboxEvents = pgTable('outbox_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  topic: text('topic').notNull(),
  payload: jsonb('payload').notNull(),
  published: boolean('published').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});`,
  },
  worker: {
    id: "worker",
    type: "worker",
    name: "Outbox Relay Worker",
    role: "Background worker polling unpublished events every 5s and publishing to Kafka",
    sourceFile: "payment-service/worker.js",
    sourceLines: "payment-service/worker.js#L21-L61",
    language: "javascript",
    codeExcerpt: `// payment-service/worker.js lines 28-56
setInterval(async () => {
  const events = await db
    .select()
    .from(outboxEvents)
    .where(eq(outboxEvents.published, false))
    .limit(50); // Batch limit

  for (const event of events) {
    try {
      await producer.send({
        topic: event.topic,
        messages: [{ value: JSON.stringify(event.payload) }],
      });

      await db
        .update(outboxEvents)
        .set({ published: true })
        .where(eq(outboxEvents.id, event.id));
    } catch (err) {
      console.error("Failed to publish event (Leaving as unpublished to retry)", err);
    }
  }
}, 5000);`,
  },
  kafka: {
    id: "kafka",
    type: "broker",
    name: "Apache Kafka Broker",
    role: "Central event distribution bus decoupling producer throughput from consumer processing",
    sourceFile: "kafka/admin.js",
    sourceLines: "kafka/admin.js#L10-L19 & docker-compose.yml:12",
    language: "javascript",
    codeExcerpt: `// kafka/admin.js lines 10-19
const run = async () => {
  await admin.connect();
  await admin.createTopics({
    topics: [
      { topic: "payment-successful" },
      { topic: "order-successful" },
      { topic: "email-successful" },
    ],
  });
};`,
  },
  orderService: {
    id: "orderService",
    type: "service",
    name: "Order Service (Consumer)",
    role: "Consumes payment-successful, persists order in PostgreSQL, produces order-successful",
    sourceFile: "order-service/index.js",
    sourceLines: "order-service/index.js#L25-L62 & docker-compose.yml:16",
    language: "javascript",
    codeExcerpt: `// order-service/index.js lines 25-60
await consumer.subscribe({ topic: "payment-successful", fromBeginning: true });

await consumer.run({
  eachMessage: async ({ message }) => {
    const { userId, cart } = JSON.parse(message.value.toString());
    const data = await db.insert(orders).values({
      userId, items: cart, status: "processing"
    }).returning();

    await producer.send({
      topic: "order-successful",
      messages: [{ value: JSON.stringify({ userId, orderId: data[0].id }) }],
    });
  },
});`,
  },
  analyticService: {
    id: "analyticService",
    type: "service",
    name: "Analytic Service (Multi-topic)",
    role: "Consumes payment-successful, order-successful, email-successful to record telemetry",
    sourceFile: "analytic-service/index.js",
    sourceLines: "analytic-service/index.js#L21-L60 & docker-compose.yml:40",
    language: "javascript",
    codeExcerpt: `// analytic-service/index.js lines 21-40
await consumer.subscribe({
  topics: ["payment-successful", "order-successful", "email-successful"],
  fromBeginning: true,
});

await consumer.run({
  eachMessage: async ({ topic, message }) => {
    const { userId, cart } = JSON.parse(message.value.toString());
    if (topic === "payment-successful") {
      const total = cart.reduce((acc, item) => acc + item.price, 0);
      console.log(\`Analytic consumer: User \${userId} paid \${total}\`);
    }
  },
});`,
  },
  emailService: {
    id: "emailService",
    type: "service",
    name: "Email Service (Consumer)",
    role: "Consumes order-successful, sends order confirmation email, produces email-successful",
    sourceFile: "email-service/index.js",
    sourceLines: "email-service/index.js#L23-L45 & docker-compose.yml:30",
    language: "javascript",
    codeExcerpt: `// email-service/index.js lines 23-42
await consumer.subscribe({ topic: "order-successful", fromBeginning: true });

await consumer.run({
  eachMessage: async ({ message }) => {
    const { userId, orderId } = JSON.parse(message.value.toString());
    console.log(\`Email consumer: Email sent to user id \${userId}\`);

    await producer.send({
      topic: "email-successful",
      messages: [{ value: JSON.stringify({ userId, emailId: "091584203985" }) }],
    });
  },
});`,
  },
};

const PHASES = [
  {
    step: 1,
    title: "1. REST Checkout & JWT Ingress",
    activeId: "client",
    targetId: "gateway",
    description: "Next.js UI submits checkout to API Gateway (Port 8080) with Bearer token.",
    source: "client/src/components/Pay.jsx -> api-gateway/index.js",
  },
  {
    step: 2,
    title: "2. Reverse Proxy to Payment Service",
    activeId: "gateway",
    targetId: "payment",
    description: "Gateway validates JWT, injects x-user-id header, proxies HTTP POST to payment-service.",
    source: "api-gateway/index.js#L13-L24 -> payment-service/index.js#L33",
  },
  {
    step: 3,
    title: "3. Atomic Outbox DB Transaction",
    activeId: "payment",
    targetId: "postgres",
    description: "db.transaction() writes payment AND outbox_events table in ONE atomic SQL commit.",
    source: "payment-service/index.js#L45-L57 (Drizzle ORM)",
  },
  {
    step: 4,
    title: "4. Outbox Worker Poll & Kafka Publish",
    activeId: "worker",
    targetId: "kafka",
    description: "Background worker polls unpublished events every 5s and streams to topic payment-successful.",
    source: "payment-service/worker.js#L28-L56",
  },
  {
    step: 5,
    title: "5. Async Consumer Ingestion",
    activeId: "kafka",
    targetId: "orderService",
    description: "Order Service and Analytic Service consume payment-successful independently.",
    source: "order-service/index.js#L25 & analytic-service/index.js#L21",
  },
  {
    step: 6,
    title: "6. Order Fulfillment & Email Propagation",
    activeId: "orderService",
    targetId: "emailService",
    description: "Order Service writes order to DB and produces order-successful -> Email Service dispatches receipt.",
    source: "order-service/index.js#L55 -> email-service/index.js#L23",
  },
];

export function StreamMartDiagram() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState<string>("payment");
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
  const activeElement = DIAGRAM_ELEMENTS[selectedId] || DIAGRAM_ELEMENTS.payment;

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
      aria-label="StreamMart Architecture and Event Flow Diagram"
    >
      {/* ━━━ TOP BAR: STRICT LABEL "Diagram" + STEP CONTROLS ━━━ */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2.5">
          {/* Label required by prompt: "Label it Diagram on the page" */}
          <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-md bg-[var(--text-primary)] text-[var(--bg-canvas)] tracking-wider uppercase">
            Diagram
          </span>
          <span className="text-xs font-medium text-[var(--text-primary)]">
            StreamMart Architecture & Event Flow
          </span>
          <span className="text-[var(--border-subtle)] hidden sm:inline" aria-hidden="true">·</span>
          <span className="text-[11px] font-mono text-[var(--text-tertiary)] hidden sm:inline">
            Derived from README.md & docker-compose.yml
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Step indicator */}
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

      {/* ━━━ VISUAL ARCHITECTURE CANVAS (MERMAID RE-ENGINEERED IN ACCESSIBLE DOM) ━━━ */}
      <div className="space-y-4">
        {/* ROW 1: INGRESS CHAIN (Client -> API Gateway -> Payment Service) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
          {/* Box 1: Client */}
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
                Service · Port 3000
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
              JWT Bearer Auth
            </div>
          </button>

          {/* Box 2: API Gateway */}
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
              Reverse Proxy & JWT Verify
            </div>
          </button>

          {/* Box 3: Payment Service */}
          <button
            type="button"
            onClick={() => setSelectedId("payment")}
            className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 relative flex flex-col justify-between min-h-[96px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 ${
              selectedId === "payment"
                ? "bg-[var(--surface-tile)] border-[var(--text-primary)] shadow-md"
                : activePhase.activeId === "payment" || activePhase.targetId === "payment"
                ? "bg-[var(--surface-tile)] border-amber-500/50 shadow-sm"
                : "bg-[var(--surface-tile)] border-[var(--border-subtle)] hover:border-[var(--border-hover)]"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-[var(--text-tertiary)] uppercase">
                Service · Port 8000
              </span>
              <Server className="w-3.5 h-3.5 text-[var(--text-primary)]" aria-hidden="true" />
            </div>
            <div>
              <div className="text-xs font-medium text-[var(--text-primary)]">Payment Service</div>
              <div className="font-mono text-[10px] text-[var(--text-tertiary)] truncate mt-0.5">
                payment-service/index.js
              </div>
            </div>
            <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
              db.transaction() initiator
            </div>
          </button>
        </div>

        {/* ROW 2: TRANSACTIONAL OUTBOX SUBGRAPH + KAFKA BROKER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          {/* Subgraph: Transactional Outbox Pattern (8 cols) */}
          <div className="lg:col-span-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-tile)] p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[var(--text-primary)]" aria-hidden="true" />
                <span className="text-xs font-medium text-[var(--text-primary)]">
                  Subgraph: Transactional Outbox Pattern
                </span>
              </div>
              <span className="text-[10px] font-mono text-[var(--text-tertiary)]">
                README.md lines 25-29 & 49-51
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Neon Postgres DB */}
              <button
                type="button"
                onClick={() => setSelectedId("postgres")}
                className={`text-left p-3 rounded-lg border transition-all duration-200 flex flex-col justify-between min-h-[110px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 ${
                  selectedId === "postgres"
                    ? "bg-[var(--surface-tile-elevated)] border-[var(--text-primary)] shadow-sm"
                    : activePhase.targetId === "postgres"
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
                <div className="space-y-1">
                  <div className="text-xs font-medium text-[var(--text-primary)]">
                    payments & outbox_events
                  </div>
                  <div className="font-mono text-[10px] text-[var(--text-tertiary)] truncate">
                    payment-service/db/schema.js
                  </div>
                </div>
                <div className="text-[10px] font-mono text-[var(--text-secondary)]">
                  Atomic single-transaction commit
                </div>
              </button>

              {/* Outbox Relay Worker */}
              <button
                type="button"
                onClick={() => setSelectedId("worker")}
                className={`text-left p-3 rounded-lg border transition-all duration-200 flex flex-col justify-between min-h-[110px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 ${
                  selectedId === "worker"
                    ? "bg-[var(--surface-tile-elevated)] border-[var(--text-primary)] shadow-sm"
                    : activePhase.activeId === "worker"
                    ? "bg-[var(--surface-tile-elevated)] border-amber-500/50"
                    : "bg-[var(--surface-tile-elevated)] border-[var(--border-subtle)] hover:border-[var(--border-hover)]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-[var(--text-tertiary)] uppercase">
                    Worker · Polls every 5s
                  </span>
                  <Radio className="w-3.5 h-3.5 text-[var(--text-primary)]" aria-hidden="true" />
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-medium text-[var(--text-primary)]">
                    Outbox Worker (Relay)
                  </div>
                  <div className="font-mono text-[10px] text-[var(--text-tertiary)] truncate">
                    payment-service/worker.js
                  </div>
                </div>
                <div className="text-[10px] font-mono text-[var(--text-secondary)]">
                  Polls unpublished events, sends to Kafka
                </div>
              </button>
            </div>
          </div>

          {/* Apache Kafka Broker (4 cols) */}
          <div className="lg:col-span-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-tile)] p-4 flex flex-col justify-between space-y-3">
            <button
              type="button"
              onClick={() => setSelectedId("kafka")}
              className={`w-full text-left p-3 rounded-lg border transition-all duration-200 flex flex-col justify-between h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 ${
                selectedId === "kafka"
                  ? "bg-[var(--surface-tile-elevated)] border-[var(--text-primary)] shadow-sm"
                  : activePhase.activeId === "kafka" || activePhase.targetId === "kafka"
                  ? "bg-[var(--surface-tile-elevated)] border-amber-500/50"
                  : "bg-[var(--surface-tile-elevated)] border-[var(--border-subtle)] hover:border-[var(--border-hover)]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[var(--text-tertiary)] uppercase">
                  Message Broker
                </span>
                <Radio className="w-3.5 h-3.5 text-[var(--text-primary)]" aria-hidden="true" />
              </div>

              <div className="my-2 space-y-1">
                <div className="text-xs font-medium text-[var(--text-primary)]">
                  Apache Kafka Cluster
                </div>
                <div className="font-mono text-[10px] text-[var(--text-tertiary)]">
                  kafka/admin.js & docker-compose.yml:12
                </div>
              </div>

              <div className="space-y-1 pt-1 border-t border-[var(--border-subtle)]">
                <div className="font-mono text-[10px] text-amber-600 dark:text-amber-400 truncate">
                  • Topic: payment-successful
                </div>
                <div className="font-mono text-[10px] text-blue-600 dark:text-blue-400 truncate">
                  • Topic: order-successful
                </div>
                <div className="font-mono text-[10px] text-purple-600 dark:text-purple-400 truncate">
                  • Topic: email-successful
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* ROW 3: THREE ASYNC CONSUMERS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
                Consumer & Producer
              </span>
              <Server className="w-3.5 h-3.5 text-[var(--text-primary)]" aria-hidden="true" />
            </div>
            <div>
              <div className="text-xs font-medium text-[var(--text-primary)]">Order Service</div>
              <div className="font-mono text-[10px] text-[var(--text-tertiary)] truncate mt-0.5">
                order-service/index.js
              </div>
            </div>
            <div className="text-[10px] font-mono text-[var(--text-secondary)]">
              Sub: payment-successful → Pub: order-successful
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
                Multi-Topic Consumer
              </span>
              <Server className="w-3.5 h-3.5 text-[var(--text-primary)]" aria-hidden="true" />
            </div>
            <div>
              <div className="text-xs font-medium text-[var(--text-primary)]">Analytic Service</div>
              <div className="font-mono text-[10px] text-[var(--text-tertiary)] truncate mt-0.5">
                analytic-service/index.js
              </div>
            </div>
            <div className="text-[10px] font-mono text-[var(--text-secondary)]">
              Sub: payment, order, email events
            </div>
          </button>

          {/* Consumer 3: Email Service */}
          <button
            type="button"
            onClick={() => setSelectedId("emailService")}
            className={`text-left p-3.5 rounded-xl border transition-all duration-200 flex flex-col justify-between min-h-[96px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 ${
              selectedId === "emailService"
                ? "bg-[var(--surface-tile)] border-[var(--text-primary)] shadow-md"
                : activePhase.targetId === "emailService"
                ? "bg-[var(--surface-tile)] border-amber-500/50 shadow-sm"
                : "bg-[var(--surface-tile)] border-[var(--border-subtle)] hover:border-[var(--border-hover)]"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-[var(--text-tertiary)] uppercase">
                Consumer & Producer
              </span>
              <Server className="w-3.5 h-3.5 text-[var(--text-primary)]" aria-hidden="true" />
            </div>
            <div>
              <div className="text-xs font-medium text-[var(--text-primary)]">Email Service</div>
              <div className="font-mono text-[10px] text-[var(--text-tertiary)] truncate mt-0.5">
                email-service/index.js
              </div>
            </div>
            <div className="text-[10px] font-mono text-[var(--text-secondary)]">
              Sub: order-successful → Pub: email-successful
            </div>
          </button>
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
    </div>
  );
}
