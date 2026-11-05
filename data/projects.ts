import { z } from "zod";

export interface CaseStudyMetricChip {
  value: string;
  label: string;
  howMeasured: string;
  isTodo?: boolean;
  isConfig?: boolean;
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
      mp4: "/projects/appforge/appforge-ask-ai-dashboard.mp4",
      webm: "/projects/appforge/appforge-ask-ai-dashboard.webm",
      poster: "/projects/appforge/appforge-ask-ai-dashboard-poster.webp",
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
        isConfig: true,
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
        isConfig: true,
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
        isConfig: true,
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
      poster: "/projects/stream-mart/stream-mart-diagram.webp",
      caption: "Diagram shows only the transactional outbox flow (Payment Service → Kafka topic 'payment-successful' → Order & Analytic consumers); direct publish flows omitted.",
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
        label: "Docker Compose services",
        howMeasured: "docker-compose.yml lines 4-54: payment-service, order-service, email-service, analytic-service, client",
        isConfig: true,
      },
      {
        value: "3",
        label: "Kafka event topics",
        howMeasured: "kafka/admin.js lines 13-17: payment-successful, order-successful, email-successful",
        isConfig: true,
      },
      {
        value: "At-least-once",
        label: "Delivery guarantee",
        howMeasured: "README.md line 51 & payment-service/worker.js: atomic SQL outbox commit with persistent background polling and retry",
        isConfig: true,
      },
    ],
    problemClaim: "Dual-write inconsistency between database commits and broker dispatch",
    problemText:
      "When payment commits to PostgreSQL but publishing to Kafka fails due to network partitions, downstream services never receive the event. Chaining synchronous HTTP calls across microservices causes cascading 504 timeouts and unfulfilled paid orders.",
    problemComparison: {
      before: {
        title: "Synchronous Microservices",
        points: [
          "Checkout chains HTTP calls across Payment, Order, and Notification services sequentially",
          "Downstream network spikes or service restarts cause cascading gateway timeouts",
          "Dual-write hazard: database record persists but subsequent broker publish crashes",
          "Tight runtime coupling halts checkout when any downstream dependency lags",
        ],
      },
      after: {
        title: "Transactional Outbox & Kafka",
        points: [
          "Payment service inserts payment record and outbox_events in one atomic SQL transaction",
          "Background worker polls outbox table every 5s and reliably publishes to Kafka",
          "Order, Analytic, and Email consumers process events asynchronously with zero blocking",
          "Independent failure domains guarantee at-least-once message delivery",
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
        subtitle: "API gateway (JWT auth)",
        tech: "Express 5 & http-proxy-middleware",
        role: "Validates bearer token and reverse-proxies requests on port 8080.",
        codeSnippet: {
          filename: "api-gateway/index.js",
          language: "javascript",
          code: `// api-gateway/index.js (lines 13-24)
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
          explanation: "Source: api-gateway/index.js lines 13-24. Validates JWT authorization header and reverse-proxies to internal payment service.",
        },
      },
      {
        id: "postgres",
        title: "Transactional Outbox",
        subtitle: "Atomic SQL Transaction",
        tech: "Neon PostgreSQL & Drizzle ORM",
        role: "Atomically commits payment and outbox event in single database transaction.",
        codeSnippet: {
          filename: "payment-service/index.js",
          language: "javascript",
          code: `// payment-service/index.js (lines 45-61)
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
          explanation: "Source: payment-service/index.js lines 45-61. Guarantees atomic consistency between business record and event log with zero message loss.",
        },
      },
      {
        id: "outbox",
        title: "Outbox Relay Worker",
        subtitle: "Poll & Reliable Publish",
        tech: "Node.js & KafkaJS Producer",
        role: "Polls pending events every 5s and reliably dispatches to Apache Kafka.",
        codeSnippet: {
          filename: "payment-service/worker.js",
          language: "javascript",
          code: `// payment-service/worker.js (lines 29-53)
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
      console.error("Worker publish failed; retrying next cycle:", err);
    }
  }
}, 5000);`,
          explanation: "Source: payment-service/worker.js lines 29-53. Polling relay worker with retry loop guarantees at-least-once Kafka publication.",
        },
      },
      {
        id: "kafka",
        title: "Kafka Cluster",
        subtitle: "Topic Declaration",
        tech: "Apache Kafka & KafkaJS Admin",
        role: "Declares partitioned message topics connecting distributed microservices.",
        codeSnippet: {
          filename: "kafka/admin.js",
          language: "javascript",
          code: `// kafka/admin.js (lines 10-19)
const run = async () => {
  await admin.connect();
  await admin.createTopics({
    topics: [
      { topic: "payment-successful" },
      { topic: "order-successful" },
      { topic: "email-successful" },
    ],
  });
};

run();`,
          explanation: "Source: kafka/admin.js lines 10-19. Central topic topology connecting payment, order, analytic, and email services.",
        },
      },
      {
        id: "order",
        title: "Order Consumer",
        subtitle: "Async Fulfillment",
        tech: "KafkaJS Consumer & Drizzle ORM",
        role: "Consumes payment events, creates orders in Postgres, and produces order-successful.",
        codeSnippet: {
          filename: "order-service/index.js",
          language: "javascript",
          code: `// order-service/index.js (lines 25-60)
await consumer.subscribe({
  topic: "payment-successful",
  fromBeginning: true,
});

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
          explanation: "Source: order-service/index.js lines 25-60. Consumes payment events independently and propagates fulfillment downstream.",
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
          "Centralizes auth tokens, but creates a single entry point.",
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
        title: "Payment and order service orchestration route mismatch",
        symptom: "Gateway proxied checkout requests to payment service but hit 404 handler.",
        cause: "Express handler was bound to '/payment-service' while API Gateway pathRewrite routed to '/'.",
        fix: "Realigned payment route to '/' and injected x-user-id header in auth middleware.",
        commitHash: "81b4778",
        commitUrl: "https://github.com/vpn-cli/StreamMart/commit/81b4778318836f3ed66491dbb9241d690b9690b2",
      },
      {
        title: "Broker connectivity in distributed container cluster",
        symptom: "Microservices failed to resolve Kafka brokers across container boundaries.",
        cause: "Hardcoded localhost:9094 broker ports failed inside Docker networks and cloud clusters.",
        fix: "Configured dynamic KAFKA_BROKERS, added SASL/SSL credentials, and mounted ca.pem certificate.",
        commitHash: "204ba26",
        commitUrl: "https://github.com/vpn-cli/StreamMart/commit/204ba26eeb957e834e6a1155b1a5098ab99b18eb",
      },
      {
        title: "Proprietary Supabase client SDK runtime coupling",
        symptom: "Services lacked standard SQL migration workflows and transactional pooling.",
        cause: "Supabase client abstraction bypassed transactional SQL session primitives needed for outbox commits.",
        fix: "Migrated persistence layer to Neon Serverless Postgres and Drizzle ORM schemas.",
        commitHash: "a50d3a9",
        commitUrl: "https://github.com/vpn-cli/StreamMart/commit/a50d3a9ef5ccbc9481b39360f1b9eaf89715854b",
      },
    ],
    nextStepsClaim: "What I would build next and test steps",
    nextStepsText:
      "Add Redis idempotency key deduplication on consumers and Dead Letter Queues (DLQ) for failed message handling.",
    learningStatement:
      "Distributed consistency is an architectural pattern, not a database feature.",
    tryItSteps: [
      "Clone the repository: git clone https://github.com/vpn-cli/StreamMart.git",
      "In payment-service and order-service directories, execute database migrations: npx drizzle-kit push",
      "Spin up the architecture cluster: docker-compose up --build -d",
      "Send a POST request to API Gateway at http://localhost:8080/api/payment with Bearer token: mock.jwt.token",
    ],
    image: "/projects/stream-mart.png",
    githubUrl: "https://github.com/vpn-cli/StreamMart",
    liveUrl: "https://github.com/vpn-cli/StreamMart#architecture--workflow",
  },
];
