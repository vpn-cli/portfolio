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

export interface CaseStudyStarSituation {
  heading: string;
  summary: string;
  constraints: string[];
}

export interface CaseStudyStarTask {
  heading: string;
  summary: string;
  objectives: {
    title: string;
    target: string;
    detail: string;
  }[];
}

export interface CaseStudyStarResultOutcome {
  metric: string;
  before: string;
  after: string;
  source: string;
}

export interface CaseStudyStarResult {
  heading: string;
  summary: string;
  outcomes: CaseStudyStarResultOutcome[];
}

export type CaseStudyFigure =
  | {
      id: string;
      kind: "bar-comparison";
      figureNumber: string;
      title: string;
      caption: string;
      source: string;
      unit: string;
      seriesLabels: string[];
      groups: {
        label: string;
        sublabel?: string;
        tiers?: {
          tierLabel: string;
          bars: {
            label: string;
            value: number;
            displayValue: string;
            note?: string;
            highlight?: boolean;
          }[];
        }[];
        bars?: {
          label: string;
          value: number;
          displayValue: string;
          note?: string;
          highlight?: boolean;
        }[];
      }[];
    }
  | {
      id: string;
      kind: "latency-anatomy";
      figureNumber: string;
      title: string;
      caption: string;
      source: string;
      totalLabel: string;
      totalValue: string;
      segments: {
        label: string;
        valueDisplay: string;
        sharePct: number;
        detail: string;
        tone: "accent" | "secondary" | "muted";
      }[];
      callouts: {
        label: string;
        value: string;
        detail: string;
      }[];
    }
  | {
      id: string;
      kind: "flow-diagram";
      figureNumber: string;
      title: string;
      caption: string;
      source: string;
      lanes: {
        stage: string;
        component: string;
        mechanism: string;
        guarantee: string;
        highlight?: boolean;
      }[];
      branchNote?: {
        trigger: string;
        fallback: string;
        outcome: string;
      };
    };

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
  // STAR sections
  situation: CaseStudyStarSituation;
  task: CaseStudyStarTask;
  figures: CaseStudyFigure[];
  result: CaseStudyStarResult;
  // Supporting narrative & interactive inspector fields
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
      "I built an AI app builder that compiles natural-language prompts into strict Zod-validated React component trees and isolated Postgres tables.",
    tagline:
      "A metadata-driven AI app builder compiling prompts into strict Zod-validated React interfaces and dynamic PostgreSQL schemas.",
    category: "Generative AI & App Engine",
    year: "2026",
    role: "Full-Stack Architect",
    timeline: "May 2026 to Nov 2026",
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Groq / Gemini AI SDK",
      "Upstash Redis",
      "Supabase PostgreSQL",
      "Clerk",
      "Motion",
      "Sentry",
      "Tailwind CSS v4",
    ],
    heroClip: {
      mp4: "/projects/appforge/appforge-copilot-demo.mp4",
      webm: "/projects/appforge/appforge-copilot-demo.webm",
      poster: "/projects/appforge/appforge-hero-redesign.webp",
      caption:
        "Ask Copilot morphs into the JSON builder to stream Zod-validated components into live preview.",
    },
    problemVisualCaption:
      "Unchecked JSX eval() versus strict Zod AST validation and tenant-isolated DDL.",
    links: {
      demo: "https://appforge-studios.vercel.app",
      repo: "https://github.com/vpn-cli/appforge",
      readme: "https://github.com/vpn-cli/appforge#readme",
    },
    metrics: [
      {
        value: "81.4%",
        label: "Full layout pass rate",
        howMeasured:
          "EVALS.md: 48/59 completed non-429 prompts passed all 3 layout criteria on Groq openai/gpt-oss-120b (100% on Dashboards 19/19 & CRUD 18/18).",
      },
      {
        value: "92.8%",
        label: "Component node validity",
        howMeasured:
          "EVALS.md: 141 of 152 evaluated AST component nodes passed per-component Zod schema validation via validateComponentNode().",
      },
      {
        value: "91",
        label: "Lighthouse perf median",
        howMeasured:
          "context/progress-tracker.md: 3-run production Lighthouse benchmark (runs: 94, 91, 90; LCP 1.2s, CLS 0) vs 88 baseline on origin/master.",
      },
    ],
    situation: {
      heading: "Raw LLM code generation breaks UIs and multi-tenant isolation",
      summary:
        "Streaming raw JSX from an LLM into an iframe fails on minor syntax hallucinations, exposes cross-site scripting risks, and stalls when primary inference keys hit rate limits. Earlier iterations also shipped unvalidated DDL helpers, an unused Upstash Kafka dependency, and a third-party shader library that inflated landing bundle weight.",
      constraints: [
        "Executing model-written JSX with eval() causes white-screen crashes on malformed syntax",
        "Mid-stream fallback between two LLMs corrupts JSON output by concatenating tokens from different models",
        "Dynamic schema sync must never allow DROP TABLE, SQL injection, or cross-tenant table reads",
        "Client bundle and main-thread motion must stay responsive under 50ms task budgets",
      ],
    },
    task: {
      heading: "Build a deterministic AST pipeline, harden multi-tenancy, and benchmark every layer",
      summary:
        "Redesign AppForge into a production-hardened runtime: enforce per-component Zod validation, guarantee atomic single-provider streams, lock down dynamic Postgres DDL and RLS, and measure reliability with an automated 100-prompt evaluation suite and 192 tests.",
      objectives: [
        {
          title: "Strict AST & Fallback Boundary",
          target: "0 eval() calls + safe node fallback",
          detail:
            "Validate every Header, Statistic, DataTable, Card, Grid, and ButtonAction node with .strict() Zod schemas and isolate malformed nodes in InvalidNodeFallback.",
        },
        {
          title: "Pre-First-Chunk Multi-Provider Failover",
          target: "Groq primary → Gemini fallback",
          detail:
            "Allow provider failover only before chunk #1 leaves the stream; lock the stream once committed and normalize cache keys in Upstash Redis.",
        },
        {
          title: "Parameterized DDL & Tenant RLS",
          target: "192 tests (148 unit + 44 DB)",
          detail:
            "Replace raw SQL string building with format('%I') identifiers, a strict column-type whitelist, removed DROP TABLE, and Clerk sub RLS policies.",
        },
      ],
    },
    figures: [
      {
        id: "appforge-evals",
        kind: "bar-comparison",
        figureNumber: "Figure 1",
        title: "Copilot 100-Prompt Evaluation Suite (Groq openai/gpt-oss-120b)",
        caption:
          "Per-category full layout pass rates excluding HTTP 429 rate-limited prompts (59 completed of 67 attempted; 141/152 valid nodes overall). Source: EVALS.md.",
        source: "EVALS.md · scripts/run-evals.mjs",
        unit: "%",
        seriesLabels: ["Full Layout Pass % (Completed)", "Node Validity %"],
        groups: [
          {
            label: "Category Pass Rates (Completed Prompts)",
            bars: [
              {
                label: "Dashboards (19/19)",
                value: 100,
                displayValue: "100.0%",
                note: "48/48 valid nodes · 1 prompt 429-limited",
                highlight: true,
              },
              {
                label: "CRUD Interfaces (18/18)",
                value: 100,
                displayValue: "100.0%",
                note: "46/46 valid nodes · 2 prompts 429-limited",
                highlight: true,
              },
              {
                label: "Overall Non-429 (48/59)",
                value: 81.4,
                displayValue: "81.4%",
                note: "141/152 valid nodes (92.8% node validity)",
                highlight: true,
              },
              {
                label: "Forms (10/20)",
                value: 50,
                displayValue: "50.0%",
                note: "41/50 valid nodes · includes 2 safety refusals",
              },
              {
                label: "Settings (1/2)",
                value: 50,
                displayValue: "50.0%",
                note: "6/8 valid nodes · 5 prompts 429-limited",
              },
            ],
          },
        ],
      },
      {
        id: "appforge-failover-flow",
        kind: "flow-diagram",
        figureNumber: "Figure 2",
        title: "Pre-First-Chunk Failover & Strict Schema/DDL Gate",
        caption:
          "How Copilot prevents mixed-model JSON corruption while isolating per-node errors and securing dynamic Postgres table creation.",
        source: "lib/copilot-pipeline.ts · actions/schema.ts",
        lanes: [
          {
            stage: "1. Ingress",
            component: "POST /api/copilot",
            mechanism: "x-real-ip guest quota + Upstash normalized cache lookup",
            guarantee: "Instant stream on cache hit (7-day TTL)",
          },
          {
            stage: "2. Stream Gate",
            component: "createCopilotStream()",
            mechanism: "Groq primary → Gemini 2.5 Flash failover ONLY pre-chunk #1",
            guarantee: "Zero cross-model token concatenation",
            highlight: true,
          },
          {
            stage: "3. AST Check",
            component: "lib/validation.ts (.strict())",
            mechanism: "Per-component Zod parse + InvalidNodeFallback wrapper",
            guarantee: "92.8% valid nodes; 0 white-screen crashes",
            highlight: true,
          },
          {
            stage: "4. Schema Sync",
            component: "execute_app_ddl RPC",
            mechanism: "format('%I') + type whitelist + (select auth.jwt()->>'sub') RLS",
            guarantee: "No DROP TABLE; strict tenant isolation",
          },
        ],
        branchNote: {
          trigger: "Mid-stream socket drop after chunk #1",
          fallback: "Lock out remaining providers & emit terminal error event",
          outcome: "Client retries cleanly instead of parsing hybrid JSON",
        },
      },
      {
        id: "appforge-perf-anatomy",
        kind: "latency-anatomy",
        figureNumber: "Figure 3",
        title: "UX Polish & Gate (b) Native Shader Performance Budget",
        caption:
          "Measured client runtime numbers after consolidating onto motion/react, removing framer-motion, and replacing @paper-design/shaders-react with NativeMeshShader.",
        source: "context/progress-tracker.md · Gate (b) & Lighthouse runs",
        totalLabel: "Production Lighthouse Median (vs 88 baseline)",
        totalValue: "91 / 100",
        segments: [
          {
            label: "Lighthouse Performance (3-run median: 94, 91, 90)",
            valueDisplay: "91 score",
            sharePct: 91,
            detail: "LCP 1.2s · CLS 0 · TBT 290ms (down from 340ms)",
            tone: "accent",
          },
          {
            label: "NativeMeshShader Control Delta (10-run median)",
            valueDisplay: "1.00ms",
            sharePct: 5,
            detail: "Domain-warped FBM fragment shader + KHR_parallel_shader_compile",
            tone: "secondary",
          },
          {
            label: "Copilot Morph Max Main-Thread Task",
            valueDisplay: "23.98ms",
            sharePct: 4,
            detail: "0 long tasks > 50ms during layoutId pill-to-panel morph",
            tone: "muted",
          },
        ],
        callouts: [
          {
            label: "Dependencies Removed",
            value: "3 packages",
            detail: "Dropped framer-motion, @paper-design/shaders-react, and Upstash Kafka.",
          },
          {
            label: "Test Coverage",
            value: "192 tests",
            detail: "148 unit tests + 44 real Postgres RLS & cross-tenant isolation tests.",
          },
          {
            label: "Logo & Theme Contrast",
            value: ">15:1",
            detail: "Inverted solid tile mark + View Transitions 450ms circular theme ripple.",
          },
        ],
      },
    ],
    result: {
      heading: "Verified 81.4% layout reliability, 192 passing tests, and 91 Lighthouse performance",
      summary:
        "AppForge ships a hardened generative pipeline with measurable eval benchmarks, zero-dependency WebGL shaders, strict tenant database isolation, and verified UI polish across light and dark modes.",
      outcomes: [
        {
          metric: "Copilot Layout Accuracy",
          before: "Unchecked JSX strings + legacy type-only check",
          after: "81.4% full layout pass (100% Dashboards/CRUD) · 92.8% node validity",
          source: "EVALS.md (Groq 120b)",
        },
        {
          metric: "Multi-Tenant Security",
          before: "Raw DDL strings & unguarded dev cookie bypass",
          after: "format('%I') whitelist DDL + Clerk RLS + 44 DB tests passing",
          source: "vitest --project database",
        },
        {
          metric: "Frontend Performance",
          before: "88 Lighthouse median + 340ms TBT + PolyForm shader dep",
          after: "91 Lighthouse median + 290ms TBT + 1.00ms NativeMeshShader",
          source: "context/progress-tracker.md",
        },
      ],
    },
    problemClaim: "Unchecked code generation crashes UIs and leaks tenant boundaries",
    problemText:
      "Streaming raw JSX into iframes breaks on minor syntax hallucinations, risks script injection, and fails silently when LLM quotas trip or dynamic SQL helpers accept unsanitized identifiers.",
    problemComparison: {
      before: {
        title: "Unrestricted JSX eval() & Legacy DDL",
        points: [
          "LLM outputs raw JSX strings executed in an iframe",
          "Mid-stream model failover concatenates broken JSON fragments",
          "Third-party shader and dual animation libs inflate bundle size",
          "Unparameterized DDL helpers expose table-drop and tenant risks",
        ],
      },
      after: {
        title: "Strict Zod AST + Pre-Chunk Failover + Hardened DDL",
        points: [
          "Model emits structured JSON validated by .strict() Zod schemas",
          "Invalid nodes render isolated InvalidNodeFallback without crashing",
          "Groq → Gemini failover locked strictly before first streamed chunk",
          "Parameterized execute_app_ddl enforces column whitelists & RLS",
        ],
      },
    },
    architectureClaim: "Prompts stream into strict Zod trees and isolated Postgres schemas",
    architectureText:
      "Copilot normalizes prompts in Upstash Redis, streams through pre-first-chunk Groq/Gemini failover, validates every node against strict Zod schemas, and syncs tables via parameterized Supabase RPCs.",
    architectureNodes: [
      {
        id: "landing",
        title: "Hero & Native Shader",
        subtitle: "Zero-Dep WebGL2 FBM",
        tech: "Next.js 16 & WebGL",
        role: "Renders domain-warped mesh & live config demo.",
        screenshotUrl: "/projects/appforge/appforge-hero-redesign.webp",
        screenshotCaption:
          "Redesigned AppForge landing hero with NativeMeshShader and live config-to-UI reactive preview.",
        codeSnippet: {
          filename: "components/home/NativeMeshShader.tsx",
          language: "typescript",
          code: `// Full-screen triangle covering NDC [-1, 1] in 1 draw call
const TRIANGLE_VERTICES = new Float32Array([
  -1, -1,
   3, -1,
  -1,  3,
]);
// Domain-warped 5-octave FBM fragment shader with theme palette uniforms
void main(){
  vec2 uv=gl_FragCoord.xy/r;
  vec2 p=uv; p.x*=r.x/r.y;
  vec2 q=vec2(fb(p*1.4+t*.06),fb(p*1.4+vec2(5.2,1.3)-t*.05));
  float k=fb(p*1.1+q*1.9+t*.04);
  vec3 col=mix(c0,c1,smoothstep(.25,.65,k));
  gl_FragColor=vec4(col,1.);
}`,
          explanation:
            "Replaced @paper-design/shaders-react with a custom single-draw-call GLSL shader using KHR_parallel_shader_compile.",
        },
      },
      {
        id: "copilot",
        title: "Failover Streamer",
        subtitle: "Groq → Gemini Pipeline",
        tech: "AI SDK & Upstash Redis",
        role: "Normalizes cache & locks failover after chunk #1.",
        screenshotUrl: "/projects/appforge/appforge-prompt-input.webp",
        screenshotCaption:
          "Ask Copilot floating pill morphing into the prompt composer over the Incident Command Center editor.",
        codeSnippet: {
          filename: "lib/copilot-pipeline.ts",
          language: "typescript",
          code: `// Failover is permitted ONLY before the first chunk is sent.
const firstResult = await iterator.next();
if (firstResult.done) {
  throw new Error(\`Provider '\${currentProvider.name}' produced an empty token stream.\`);
}
controller.enqueue(encoder.encode(firstResult.value));
streamTextAccumulator += firstResult.value;
hasSentChunks = true; // Failover window is now CLOSED`,
          explanation:
            "Prevents hybrid malformed JSON by refusing cross-model failover once token streaming begins.",
        },
      },
      {
        id: "validator",
        title: "Strict Zod Validator",
        subtitle: "Per-Component .strict()",
        tech: "Zod v4 & Error Isolation",
        role: "Rejects unknown props & isolates broken nodes.",
        screenshotUrl: "/projects/appforge/appforge-renderer-states.webp",
        screenshotCaption:
          "Verified component renderer states (loading, loaded, empty, scoped error) from /dev/renderers.",
        codeSnippet: {
          filename: "lib/validation.ts",
          language: "typescript",
          code: `export const StatisticSchema = z.object({
  type: z.literal("Statistic"),
  label: z.string().optional(),
  value: z.union([z.string(), z.number()]).optional().default("0"),
  valueSuffix: z.string().optional(),
  trend: StatisticTrendSchema.optional(),
  variant: z.enum(["default", "panel", "gradient"]).optional(),
}).strict();`,
          explanation:
            "Strict schemas reject hallucinated attributes while InvalidNodeFallback keeps the rest of the canvas alive.",
        },
      },
      {
        id: "schema",
        title: "Hardened DDL Sync",
        subtitle: "Parameterized RPC",
        tech: "Supabase Postgres & RLS",
        role: "Creates tenant-isolated tables without DROP.",
        screenshotUrl: "/projects/appforge/appforge-apps-dashboard.webp",
        screenshotCaption:
          "Canonical /apps workspace backed by tenant-isolated Postgres schemas and RLS policies.",
        codeSnippet: {
          filename: "actions/schema.ts",
          language: "typescript",
          code: `const COLUMN_TYPE_WHITELIST: Record<string, string> = {
  string: "TEXT", text: "TEXT",
  number: "NUMERIC", numeric: "NUMERIC",
  boolean: "BOOLEAN", date: "TIMESTAMPTZ", timestamptz: "TIMESTAMPTZ",
};
const { error: ddlError } = await supabase.rpc('execute_app_ddl', {
  app_id: appId,
  entity_name: validEntityName,
  fields: sanitizedFields,
});`,
          explanation:
            "Enforces 22-char entity identifiers, column collision checks, whitelisted Postgres types, and service_role-only DDL.",
        },
      },
      {
        id: "builder",
        title: "Builder & Morph UI",
        subtitle: "Resizable Split & Motion",
        tech: "Monaco & motion/react",
        role: "Pairs Monaco editor with live container-query preview.",
        screenshotUrl: "/projects/appforge/appforge-editor-view.webp",
        screenshotCaption:
          "Split Monaco config editor with bottom-right Ask Copilot pill, validation log, and Incident Command Center preview.",
        codeSnippet: {
          filename: "app/api/copilot/route.ts",
          language: "typescript",
          code: `// Resolve client IP strictly via x-real-ip; enforce guest quota
const clientIp = resolveClientIp(req);
if (!userId) {
  const guestCheck = await checkGuestCopilotLimit(clientIp);
  if (!guestCheck.success) return NextResponse.json({ code: "AUTH_REQUIRED" }, { status: 429 });
}
const normalizedKey = \`copilot_cache:\${normalizePromptForCache(prompt)}\`;`,
          explanation:
            "Normalizes whitespace/punctuation in cache keys and protects LLM quotas with Upstash sliding windows.",
        },
      },
    ],
    decisionsClaim: "Four architectural choices that hardened reliability and speed",
    decisionsText:
      "Every decision removed unnecessary runtime weight or closed a concrete security and evaluation failure mode.",
    decisions: [
      {
        chosenOver: "Removed Upstash Kafka in favor of direct transactional state in Supabase",
        tradeoffSummary:
          "Eliminated an unused external broker with zero loss of publish/validation telemetry.",
        optionsConsidered: [
          "Keep Upstash Kafka producer/consumer hooks for publish events",
          "Direct Postgres state in apps & validation_logs + Sentry",
        ],
        problemFaced:
          "Maintaining an external Kafka topic for low-volume publish metadata added dependency surface and failure modes.",
        fullReasoning:
          "Tracking publish state via apps.published_config, apps.updated_at, and validation_logs inside Supabase gave honest 'Recently updated' semantics with zero extra infrastructure.",
      },
      {
        chosenOver: "Chose pre-first-chunk failover over mid-stream model fallback",
        tradeoffSummary:
          "Guarantees valid single-model JSON, but mid-stream disconnects trigger a clean client retry.",
        optionsConsidered: [
          "Mid-stream provider switch appending tokens to partial JSON",
          "Pre-first-chunk failover (Groq → Gemini 2.5 Flash)",
        ],
        problemFaced:
          "Switching models mid-stream concatenates incompatible JSON structures, breaking the parser.",
        fullReasoning:
          "Once iterator.next() yields chunk #1, createCopilotStream() commits exclusively to that provider; failures before chunk #1 fail over seamlessly.",
      },
      {
        chosenOver: "Replaced Paper Shaders with custom zero-dependency NativeMeshShader",
        tradeoffSummary:
          "Removed PolyForm Shield license dependency and cut landing main-thread cost to 1.00ms median.",
        optionsConsidered: [
          "Keep @paper-design/shaders-react (0.0.82)",
          "Pre-rendered WebM video loop",
          "Custom WebGL FBM shader with KHR_parallel_shader_compile",
        ],
        problemFaced:
          "A 10-run control benchmark showed shader library hydration/compile overhead and introduced a restrictive third-party license.",
        fullReasoning:
          "Writing a 1-draw-call full-screen triangle shader in WebGL reading CSS theme tokens removed the dependency and kept desktop Lighthouse at 91.",
      },
      {
        chosenOver: "Replaced raw SQL DDL concatenation with structured execute_app_ddl RPC",
        tradeoffSummary:
          "Eliminates SQL injection & DROP TABLE risk, while constraining entities to 22-char identifiers.",
        optionsConsidered: [
          "String blacklist filtering on SQL DDL statements",
          "Structured RPC with format('%I'), column whitelist, and RLS",
        ],
        problemFaced:
          "Regex blacklists on raw DDL strings are fragile and Postgres truncates identifiers past 63 bytes.",
        fullReasoning:
          "Accepting structured JSON field maps in execute_app_ddl, enforcing a 22-char entity cap, and wrapping RLS with Clerk auth.jwt() guarantees tenant isolation.",
      },
    ],
    bugsClaim: "Four production bugs fixed during UX polish and hardening",
    bugsText:
      "Real bugs caught by Playwright, Lighthouse, and workspace verification, with links to commits.",
    bugs: [
      {
        title: "Copilot floating panel collapsed to 28px inside Monaco container",
        symptom: "Opening Copilot collapsed the dialog into an invisible 28px box clipped by overflow.",
        cause: "Panel used calc(100% - 32px) inside a 0-width containing block with overflow: hidden.",
        fix: "Moved CopilotFloatingPill to workspace root and sized with min(480px, calc(100vw - 32px)).",
        commitHash: "7043f88",
        commitUrl: "https://github.com/vpn-cli/appforge/commit/7043f88",
      },
      {
        title: "Motion bundle inflated landing page JS overhead",
        symptom: "Landing route shipped full Motion runtime solely for nav pill transitions.",
        cause: "Shared Navbar imported Motion primitives directly on the public landing page.",
        fix: "Replaced landing nav indicator with pure CSS sliding indicator and consolidated on motion/react.",
        commitHash: "36e5b12",
        commitUrl: "https://github.com/vpn-cli/appforge/commit/36e5b12",
      },
      {
        title: "Monaco swallowed pointer events during split-pane resize",
        symptom: "Dragging the builder divider stalled whenever the cursor crossed the Monaco iframe/canvas.",
        cause: "Custom divider lacked pointer capture isolation over Monaco and preview panes.",
        fix: "Migrated to react-resizable-panels with drag-state body cursor lock and transparent overlay.",
        commitHash: "b5507ee",
        commitUrl: "https://github.com/vpn-cli/appforge/commit/b5507ee",
      },
      {
        title: "Third-party Paper Shaders added compile overhead and license coupling",
        symptom: "Landing hero carried external shader bundle and PolyForm Shield notice.",
        cause: "Third-party React wrapper bundled extra shader plumbing on mount.",
        fix: "Implemented zero-dep NativeMeshShader with async parallel shader compilation (1.00ms median).",
        commitHash: "1bcf981",
        commitUrl: "https://github.com/vpn-cli/appforge/commit/1bcf981",
      },
    ],
    nextStepsClaim: "What I would build next and live demo",
    nextStepsText:
      "Introduce a strict Tailwind utility className sanitizer for public /apps/[appId] routes and re-run the 100-prompt eval suite under v1.4.0 .strict() schemas.",
    learningStatement:
      "Deterministic AST boundaries, measurable eval harnesses, and strict tenant SQL isolation matter far more than unconstrained prompt magic.",
    tryItSteps: [
      "Open the live demo at appforge-studios.vercel.app.",
      "Inspect the reactive config-to-UI demo on the hero or launch the builder sandbox.",
      "Submit a dashboard or CRUD prompt and inspect the validated JSON AST mounted live with zero eval().",
    ],
    image: "/projects/appforge.jpg",
    videoUrl: "/videos/appforge/brag.mp4",
    videoPoster: "/videos/appforge/brag.jpg",
    githubUrl: "https://github.com/vpn-cli/appforge",
    liveUrl: "https://appforge-studios.vercel.app",
  },
  {
    slug: "sockets",
    title: "Sportz",
    hookPitch:
      "I scaled a WebSocket sports engine across multiple Node.js instances with Redis 7 Pub/Sub, zero-duplicate Docker-pause recovery, and stampede-coalesced gap replay.",
    tagline:
      "A horizontally scaled WebSocket sports broadcasting engine verified across 625,000 deliveries with Redis 7 Pub/Sub and stampede-coalesced replay.",
    category: "Distributed Systems & Real-Time",
    year: "2026",
    role: "Backend & Systems Engineer",
    timeline: "Mar 2025 to Nov 2026",
    stack: [
      "Node.js 24",
      "Express 5",
      "ws",
      "Redis 7 (Pub/Sub & Hashes)",
      "PostgreSQL (Neon)",
      "Drizzle ORM",
      "Arcjet",
      "React 19",
      "Vite 6",
    ],
    heroClip: {
      mp4: "/projects/sockets/sportz-live-score-update.mp4",
      webm: "/projects/sockets/sportz-live-score-update.webm",
      poster: "/projects/sockets/sportz-live-score-update-poster.webp",
      caption:
        "Sportz v2.0 live commentary, Win Probability, Redis HINCRBY fan reactions, and Gemini 3.8 Flash AI Analyst.",
    },
    problemVisualCaption:
      "Isolated single-node polling/sockets versus horizontally scaled Redis Pub/Sub with gap replay.",
    links: {
      demo: "https://sportz-rho.vercel.app",
      repo: "https://github.com/vpn-cli/sportz",
      readme: "https://github.com/vpn-cli/sportz#readme",
      coldStartNote: "First load can take ~30s (Render free tier idle sleep).",
    },
    metrics: [
      {
        value: "0 / 625k",
        label: "Undelivered messages",
        howMeasured:
          "README.md 5-run benchmark: 2 instances × 5,000 WebSocket clients × 25 rounds × 5 runs = 625,000 expected deliveries; 0 missed within 2.0s window.",
      },
      {
        value: "98.649%",
        label: "Deliveries ≤ 400ms SLA",
        howMeasured:
          "README.md: 616,554 of 625,000 deliveries arrived within 400ms across 5 runs (Runs 4 & 5: 100.0%; p50 ≈ 26ms; 0.0ms server event-loop lag).",
      },
      {
        value: "1 / 1,000",
        label: "Gap replay DB coalescing",
        howMeasured:
          "sportz-websockets-main/src/ws/server.js: inFlightReplayQueries deduplicates concurrent (matchId, lastSeq) requests so 1,000 clients trigger 1 Postgres query.",
      },
    ],
    situation: {
      heading: "Single-instance WebSockets cannot scale horizontally or survive broker hiccups cleanly",
      summary:
        "While replacing HTTP polling with native WebSockets solved single-node latency, keeping room state solely in one Node.js Map meant adding a second backend instance split spectators across isolated hubs. Moreover, Redis pauses, dropped mobile connections, and synchronized reconnects could trigger duplicate broadcasts, lost reaction deltas, or database stampedes.",
      constraints: [
        "Two backend instances must fan out match commentary, score updates, and reactions to 5,000+ sockets consistently",
        "If Redis disconnects or pauses (`docker pause`), local sockets must keep receiving updates without duplicates on unpause",
        "1,000 clients detecting a sequence gap simultaneously cannot fire 1,000 identical PostgreSQL replay queries",
        "Third-party Arcjet security blips must never take down live match streaming in production",
      ],
    },
    task: {
      heading: "Architect multi-instance Redis fanout, stampede-safe recovery, and 5k-socket benchmarks",
      summary:
        "Connect backend nodes over Redis 7 Pub/Sub and atomic reaction hashes, engineer sequence-based deduplication and coalesced Postgres gap replay, harden Arcjet fail-open telemetry, and verify delivery at 5,000 concurrent connections.",
      objectives: [
        {
          title: "Horizontal Redis 7 Backplane",
          target: "2 instances × 2,500 clients",
          detail:
            "Await Redis channel subscription before acking subscribed, fan out via sportz:match:id & sportz:global, and sync reactions with atomic HINCRBY.",
        },
        {
          title: "Zero-Duplicate Degraded & Gap Replay",
          target: "500-seq FIFO ring + 1-query coalescing",
          detail:
            "Fall back to local broadcast during Redis outages, dedupe returning Redis frames via recentlyBroadcastSeq, and coalesce concurrent gap-replay DB queries.",
        },
        {
          title: "Fail-Open Perimeter & Live Ingestion",
          target: "TRUST_PROXY + arcjetErrors metric",
          detail:
            "Resolve client IPs from rightmost X-Forwarded-For hop, refuse BENCHMARK_BYPASS_ARCJET in production, and surface Arcjet error counts on GET /health.",
        },
      ],
    },
    figures: [
      {
        id: "sportz-5run-sla",
        kind: "bar-comparison",
        figureNumber: "Figure 1",
        title: "5-Run Horizontal Scale Benchmark (2 Instances × 5,000 Clients = 625,000 Deliveries)",
        caption:
          "On-time deliveries within the ≤400ms SLA across 5 consecutive benchmark runs (125,000 deliveries/run across 5 match rooms). Zero messages (>2000ms) were lost in any run.",
        source: "vpn-cli/sportz README.md · measure-undelivered-distribution.js",
        unit: "%",
        seriesLabels: ["On-Time (≤400ms SLA)", "Undelivered (>2000ms): 0.000%"],
        groups: [
          {
            label: "Per-Run SLA Compliance (125,000 msgs/run)",
            bars: [
              {
                label: "Run 1 (124,546 / 125k)",
                value: 99.637,
                displayValue: "99.637%",
                note: "454 in 400–500ms · 0 undelivered",
                highlight: true,
              },
              {
                label: "Run 2 (122,579 / 125k)",
                value: 98.063,
                displayValue: "98.063%",
                note: "2,421 in 400–600ms · 0 undelivered",
              },
              {
                label: "Run 3 (119,429 / 125k)",
                value: 95.543,
                displayValue: "95.543%",
                note: "5,571 in 400–800ms (max 639ms) · 0 undelivered",
              },
              {
                label: "Run 4 (125,000 / 125k)",
                value: 100,
                displayValue: "100.000%",
                note: "0 missed SLA · 0 undelivered",
                highlight: true,
              },
              {
                label: "Run 5 (125,000 / 125k)",
                value: 100,
                displayValue: "100.000%",
                note: "0 missed SLA · 0 undelivered",
                highlight: true,
              },
            ],
          },
        ],
      },
      {
        id: "sportz-cluster-flow",
        kind: "flow-diagram",
        figureNumber: "Figure 2",
        title: "Multi-Instance Redis Pub/Sub, Pause Dedupe & Gap-Replay Coalescing",
        caption:
          "How two Sportz backend nodes coordinate broadcasts, survive docker pause without duplicate frames, and coalesce concurrent client gap replays.",
        source: "sportz-websockets-main/src/ws/server.js",
        lanes: [
          {
            stage: "1. Perimeter",
            component: "Arcjet HTTP Upgrade",
            mechanism: "TRUST_PROXY rightmost IP + slidingWindow(30/10s)",
            guarantee: "Fails open on Arcjet ERROR + logs /health arcjetErrors",
          },
          {
            stage: "2. Backplane",
            component: "Redis 7 Pub/Sub + HINCRBY",
            mechanism: "sportz:match:id + sportz:global + awaited subscribe ack",
            guarantee: "2,500 sockets per instance stay synchronized",
            highlight: true,
          },
          {
            stage: "3. Pause Shield",
            component: "recentlyBroadcastSeq (500 FIFO)",
            mechanism: "Degrades to local broadcast; skips returning Redis seqs",
            guarantee: "0 duplicates across 2 instances on docker unpause",
            highlight: true,
          },
          {
            stage: "4. Gap Recovery",
            component: "inFlightReplayQueries Map",
            mechanism: "Coalesces concurrent (matchId, lastSeq) queries; >200 → snapshot",
            guarantee: "1,000 reconnecting clients = 1 Postgres query",
          },
        ],
        branchNote: {
          trigger: "Finished match private replay requested",
          fallback: "Streams 1x/10x directly to requesting socket with 3s cooldown",
          outcome: "Bounded by MAX_CONCURRENT_CLIENT_REPLAYS=5 per instance",
        },
      },
      {
        id: "sportz-latency-split",
        kind: "latency-anatomy",
        figureNumber: "Figure 3",
        title: "625,000-Delivery Latency Buckets & Server Event-Loop Telemetry",
        caption:
          "Distribution of all 625,000 deliveries across the 2.0-second window on a single Ryzen 7 6800H host running 2 server instances, Redis 7, and 5,000 sockets.",
        source: "vpn-cli/sportz README.md · perf_hooks.monitorEventLoopDelay",
        totalLabel: "Aggregate ≤400ms SLA (616,554 / 625,000)",
        totalValue: "98.649%",
        segments: [
          {
            label: "≤ 400ms On-Time SLA (p50 ≈ 26ms)",
            valueDisplay: "616,554 msgs",
            sharePct: 98.65,
            detail: "Delivered cleanly within 400ms target across all 5 runs",
            tone: "accent",
          },
          {
            label: "400–600ms Tail Bucket",
            valueDisplay: "7,705 msgs",
            sharePct: 1.23,
            detail: "4,932 (400–500ms) + 2,773 (500–600ms), symmetric across I1/I2",
            tone: "secondary",
          },
          {
            label: "600–800ms Tail Bucket (Max 639ms)",
            valueDisplay: "741 msgs",
            sharePct: 0.12,
            detail: "0 msgs in 800–2000ms and 0 undelivered (>2000ms)",
            tone: "muted",
          },
        ],
        callouts: [
          {
            label: "Server Event-Loop Lag",
            value: "0.0ms",
            detail: "Pre-serialized JSON frames kept libuv lag <0.5ms on both servers.",
          },
          {
            label: "Instance Tail Split",
            value: "49% / 51%",
            detail: "4,141 (I1) vs 4,305 (I2) late deliveries — single-process client bottleneck.",
          },
          {
            label: "Reaction Sync Safety",
            value: "Atomic HINCRBY",
            detail: "Local deltas deleted only after HINCRBY succeeds; broadcasts snapshot.",
          },
        ],
      },
    ],
    result: {
      heading: "Zero dropped messages across 625,000 deliveries and horizontally scaled resilience",
      summary:
        "Sportz evolved from a single-process WebSocket server into a multi-instance Redis-backed cluster with proven 5,000-client delivery, zero-duplicate pause recovery, and stampede-proof replay.",
      outcomes: [
        {
          metric: "Horizontal Delivery Reliability",
          before: "Single Node.js Map isolated to 1 instance",
          after: "0 / 625,000 dropped across 2 instances × 5,000 clients (98.649% ≤400ms)",
          source: "5-run benchmark (README.md)",
        },
        {
          metric: "Gap-Replay DB Load",
          before: "N reconnecting clients = N Postgres queries",
          after: "1,000 concurrent gap requests coalesced into 1 Postgres query",
          source: "inFlightReplayQueries (server.js)",
        },
        {
          metric: "Outage & Security Posture",
          before: "Redis drop or Arcjet error risked blind spots",
          after: "500-seq FIFO dedupe (0 dups on unpause) + fail-open arcjetErrors",
          source: "vitest & outage suite",
        },
      ],
    },
    problemClaim: "Single-node WebSockets split rooms and risk stampedes on reconnect",
    problemText:
      "Keeping room subscribers in a single process blocks horizontal scaling. Under cluster pauses or synchronized client reconnects, naive brokers drop frames, duplicate broadcasts, or hammer Postgres with thousands of identical replay queries.",
    problemComparison: {
      before: {
        title: "Single-Instance Sockets & Naive Reconnects",
        points: [
          "In-memory Map<matchId, Set> isolates rooms to one server process",
          "Replaying missed commentary fires one DB query per reconnecting client",
          "Docker pause/unpause can replay stale TCP-buffered Redis frames",
          "Arcjet upstream API blips can disrupt WebSocket upgrades",
        ],
      },
      after: {
        title: "Redis 7 Cluster, 500-Seq Dedupe & Coalesced Replay",
        points: [
          "Redis 7 Pub/Sub syncs match rooms & atomic HINCRBY reactions across nodes",
          "500-seq FIFO ring buffer discards duplicate frames after local fallback",
          "inFlightReplayQueries coalesces 1,000 concurrent gap replays into 1 query",
          "Arcjet fails open with TRUST_PROXY IP parsing and /health arcjetErrors",
        ],
      },
    },
    architectureClaim: "Two Node instances fan out over Redis 7 with coalesced Postgres replay",
    architectureText:
      "Match mutations commit to Neon PostgreSQL and publish to Redis 7 channels. Both WebSocket instances stream pre-serialized frames to 5,000 subscribed sockets while coalescing any client gap replays.",
    architectureNodes: [
      {
        id: "ingestion",
        title: "Live & Webhook Ingest",
        subtitle: "football-data.org + REST",
        tech: "Express 5 & Zod",
        role: "Filters unchanged score polls & ingests match events.",
        screenshotUrl: "/projects/sockets/sportz-match-list.webp",
        screenshotCaption:
          "Sportz v2.0 fixture feed filtering live Football, Cricket, and Basketball matches.",
        codeSnippet: {
          filename: "sportz-websockets-main/src/routes/matches.js",
          language: "javascript",
          code: `router.post('/:id/score', async (req, res) => {
  const matchId = parseInt(req.params.id);
  const { homeScore, awayScore } = scoreSchema.parse(req.body);
  await db.update(matches)
    .set({ homeScore, awayScore, updatedAt: new Date() })
    .where(eq(matches.id, matchId));
  broadcastScoreUpdate(matchId, { homeScore, awayScore });
  res.json({ success: true });
});`,
          explanation:
            "Validates incoming score updates and triggers global cluster fanout; automated ingestor deduplicates unchanged scores.",
        },
      },
      {
        id: "arcjet",
        title: "Arcjet Fail-Open Edge",
        subtitle: "TRUST_PROXY & /health",
        tech: "Arcjet @arcjet/node",
        role: "Inspects rightmost XFF IP; fails open on API errors.",
        codeSnippet: {
          filename: "sportz-websockets-main/src/arcjet.js",
          language: "javascript",
          code: `export function buildProtectOptions(clientIp, logger = console) {
  const normalized = normalizeIp(clientIp);
  if (normalized && net.isIP(normalized) !== 0) {
    return { ipSrc: normalized };
  }
  return {};
}
// Production refuses BENCHMARK_BYPASS_ARCJET; ERROR decisions increment arcjetErrors on /health`,
          explanation:
            "Resolves real client IPs behind reverse proxies, blocks prod bypass flags, and tracks Arcjet errors without dropping live streams.",
        },
      },
      {
        id: "redis",
        title: "Redis 7 Backplane",
        subtitle: "Pub/Sub & HINCRBY",
        tech: "Redis 7 & ioredis",
        role: "Syncs multi-instance channels & atomic reaction counts.",
        screenshotUrl: "/projects/sockets/sportz-connection-badge.webp",
        screenshotCaption:
          "Sportz v2.0 telemetry bar with Auto-Sim Demo, Event Simulator, Gemini AI Analyst, and LIVE CONNECTED state.",
        codeSnippet: {
          filename: "sportz-websockets-main/src/ws/server.js",
          language: "javascript",
          code: `// Delete local reaction delta ONLY after its own HINCRBY succeeds
await activePub.hincrby(key, emoji, count);
deltas[emoji] -= count;
if (deltas[emoji] <= 0) delete deltas[emoji];`,
          explanation:
            "Prevents reaction loss during Redis disconnects by holding per-match deltas until Redis confirms HINCRBY.",
        },
      },
      {
        id: "gateway",
        title: "ws Cluster & Dedupe",
        subtitle: "500-Seq Ring & Coalescing",
        tech: "ws & Drizzle ORM",
        role: "Dedupes pause frames & coalesces gap-replay queries.",
        screenshotUrl: "/projects/sockets/sportz-ai-analyst.webp",
        screenshotCaption:
          "Gemini 3.8 Flash AI Match Analyst surfacing tactical breakdown and momentum shift.",
        codeSnippet: {
          filename: "sportz-websockets-main/src/ws/server.js",
          language: "javascript",
          code: `// 1,000 concurrent clients requesting the same (matchId, lastSeq) join 1 Promise
let queryPromise = inFlightReplayQueries.get(replayKey);
if (!queryPromise) {
  queryPromise = (async () => {
    gapReplayDbQueryCount++;
    return await db.select().from(commentary)
      .where(and(eq(commentary.matchId, matchId), gt(commentary.sequence, lastSeq)))
      .orderBy(asc(commentary.sequence)).limit(201);
  })().finally(() => inFlightReplayQueries.delete(replayKey));
  inFlightReplayQueries.set(replayKey, queryPromise);
}`,
          explanation:
            "Coalesces concurrent gap-replay requests by (matchId, lastSeq) and switches to a 50-item snapshot when gaps exceed 200 events.",
        },
      },
      {
        id: "client",
        title: "React 19 Live Client",
        subtitle: "Gap Detection & Replay",
        tech: "React 19 & Vite 6",
        role: "Detects seq gaps over open socket & streams 1x/10x replays.",
        screenshotUrl: "/projects/sockets/sportz-live-match.webp",
        screenshotCaption:
          "Live scoreboard, commentary highlights, and simulator controls hydrated by push frames.",
        codeSnippet: {
          filename: "sportz-websockets-main/src/ws/server.js",
          language: "javascript",
          code: `// Per-client finished-match replay capped by concurrency & 3s socket cooldown
if (activeClientReplaysCount >= maxConcurrentClientReplays) {
  sendJson(socket, { type: 'error', code: 'replay_concurrency_limit' });
  return;
}`,
          explanation:
            "Streams finished matches privately from Postgres at 1x or 10x speed without mutating global server state.",
        },
      },
    ],
    decisionsClaim: "Four distributed-systems choices that survived 5,000-client load",
    decisionsText:
      "Each choice balanced cluster consistency, database protection, and predictable memory usage under contention.",
    decisions: [
      {
        chosenOver: "Chose Redis 7 Pub/Sub + 500-seq FIFO ring buffer over single-node isolation",
        tradeoffSummary:
          "Scales across multiple Node instances with 0 duplicates on unpause, within a 500-seq outage window.",
        optionsConsidered: [
          "Single-instance in-memory Map only",
          "Redis Pub/Sub with unguarded local fallback",
          "Redis 7 Pub/Sub + disabled offline queue + 500-seq FIFO deduplication",
        ],
        problemFaced:
          "During docker pause, ioredis writes PUBLISH into the OS TCP socket buffer; on unpause those delayed frames arrive back at the node that already broadcast locally.",
        fullReasoning:
          "Maintaining a bounded 500-sequence Set per match room lets each instance serve local sockets immediately during outages and drop duplicate Redis echoes upon recovery.",
      },
      {
        chosenOver: "Chose in-flight Promise coalescing over unguarded per-socket gap queries",
        tradeoffSummary:
          "Reduces 1,000 concurrent gap-replay DB queries to 1, with 1s short-lived cache cleanup.",
        optionsConsidered: [
          "Query Postgres independently for every reconnecting socket",
          "Force full WebSocket disconnect/reconnect on missed sequence",
          "Non-reconnecting gap replay coalesced by (matchId, lastSeq)",
        ],
        problemFaced:
          "A brief network hiccup across 1,000 spectators watching one match would trigger 1,000 simultaneous Postgres queries.",
        fullReasoning:
          "Sharing an in-flight Promise keyed by `${matchId}:${lastSeq}` plus a 1-second recentReplayCache eliminates thundering-herd DB load.",
      },
      {
        chosenOver: "Chose Arcjet fail-open on ERROR decisions over hard 503 blocking",
        tradeoffSummary:
          "Keeps live broadcasts online during third-party API blips, relying on /health arcjetErrors alerts.",
        optionsConsidered: [
          "Block all upgrades with 503 if Arcjet Decide API errors",
          "Fail open with redacted console.error logging and /health arcjetErrors counter",
        ],
        problemFaced:
          "An upstream Arcjet outage or missing User-Agent header should not take down live match delivery for legitimate spectators.",
        fullReasoning:
          "Logging non-ALLOW/ERROR decisions loudly while incrementing arcjetErrors on GET /health keeps availability at 100% while preserving observability.",
      },
      {
        chosenOver: "Chose pre-serialized broadcast buffers over per-client JSON.stringify",
        tradeoffSummary:
          "Keeps server event-loop lag at 0.0ms across 5,000 sockets, requiring uniform frame envelopes.",
        optionsConsidered: [
          "Serialize JSON individually inside the ws.clients loop",
          "Serialize once per broadcast and stream identical string buffer",
        ],
        problemFaced:
          "Calling JSON.stringify 5,000 times per event saturates the Node event loop during scoring bursts.",
        fullReasoning:
          "Serializing once before iterating subscribers kept libuv event-loop lag at 0.0ms across all 625,000 benchmark deliveries.",
      },
    ],
    bugsClaim: "Four concurrency and security bugs caught in testing",
    bugsText:
      "Real bugs uncovered during Redis pause tests, reverse-proxy IP inspection, and CI pipeline runs.",
    bugs: [
      {
        title: "Subscribed ack fired before Redis channel subscription completed",
        symptom: "Fast clients missed the first commentary event emitted right after subscribing.",
        cause: "Server sent { type: 'subscribed' } synchronously while activeSub.subscribe() was still in flight.",
        fix: "Awaited activeSub.subscribe() (with a 200ms race guard) before sending subscribed ack.",
        commitHash: "494fd0c",
        commitUrl: "https://github.com/vpn-cli/sportz/commit/494fd0c",
      },
      {
        title: "Docker unpause delivered duplicate events across 2 instances",
        symptom: "Clients received events twice after Redis recovered from container pause.",
        cause: "Degraded local fallback sent events locally, then OS-buffered Redis PUBLISH frames echoed back.",
        fix: "Disabled offline queue and added 500-seq FIFO recentlyBroadcastSeq deduplication.",
        commitHash: "7c698d9",
        commitUrl: "https://github.com/vpn-cli/sportz/commit/7c698d9",
      },
      {
        title: "Arcjet lacked resolved client IP behind reverse proxy",
        symptom: "Rate limits bucketed proxy hops instead of client IPs and silent errors hid denials.",
        cause: "TRUST_PROXY X-Forwarded-For IP wasn't passed via ipSrc to wsArcjet/httpArcjet.",
        fix: "Extracted rightmost trusted IP into buildProtectOptions({ ipSrc }) and added DEBUG_IP logging.",
        commitHash: "511ed6d",
        commitUrl: "https://github.com/vpn-cli/sportz/commit/511ed6d",
      },
      {
        title: "Test/benchmark scripts risked targeting remote Postgres",
        symptom: "Missing local DB overrides could accidentally hit non-local connection strings.",
        cause: "Benchmark and Vitest harnesses lacked an explicit localhost hostname guard.",
        fix: "Added localhost-only DB guard and dedicated CI Postgres 5433 test service.",
        commitHash: "af97a52",
        commitUrl: "https://github.com/vpn-cli/sportz/commit/af97a52",
      },
    ],
    nextStepsClaim: "What I would build next and live verification",
    nextStepsText:
      "Separate the load generator onto a dedicated host outside the server CPU budget to isolate the client-side 639ms tail and validate multi-node network hops.",
    learningStatement:
      "Scaling WebSockets horizontally is less about raw socket throughput and more about bounding failure modes: pause deduplication, stampede coalescing, and fail-open observability.",
    tryItSteps: [
      "Open the live demo at sportz-rho.vercel.app in two browser windows side by side.",
      "Click Simulate Event in Window 1 and broadcast a Goal or Wicket.",
      "Watch Window 2 update score, commentary, and reactions instantaneously without refreshing.",
    ],
    image: "/projects/sockets.jpg",
    videoUrl: "/videos/sockets/brag.mp4",
    videoPoster: "/videos/sockets/brag.jpg",
    githubUrl: "https://github.com/vpn-cli/sportz",
    liveUrl: "https://sportz-rho.vercel.app",
  },
  {
    slug: "stream-mart",
    title: "StreamMart",
    hookPitch:
      "I refactored an event-driven e-commerce backend with SKIP LOCKED outbox relays and idempotent eachBatch consumers, boosting throughput 7.76× to 375.75 checkouts/s at zero lag.",
    tagline:
      "An event-driven microservices backend using SKIP LOCKED transactional outbox relays, idempotent eachBatch consumers, and DLQ poison-pill isolation.",
    category: "Distributed Systems & Microservices",
    year: "2026",
    role: "Backend Systems Engineer",
    timeline: "Aug 2026 to Nov 2026",
    stack: [
      "Node.js",
      "Express 5",
      "Apache Kafka 3.7 (KRaft)",
      "KafkaJS",
      "PostgreSQL 16",
      "Drizzle ORM",
      "Docker Compose",
      "k6",
      "JWT",
    ],
    heroClip: {
      mp4: "/projects/stream-mart/stream-mart-demo.mp4",
      webm: "/projects/stream-mart/stream-mart-demo.webm",
      poster: "/projects/stream-mart/stream-mart-diagram.webp",
      caption:
        "Diagram: Refactored SKIP LOCKED outbox relays, 20/20 Kafka outage recovery, eachBatch consumers, and .DLQ isolation.",
    },
    problemVisualCaption:
      "Sequential 1-message DB transactions versus SKIP LOCKED relays and single-transaction eachBatch consumers.",
    links: {
      demo: "https://github.com/vpn-cli/streammart#verified-benchmarks-full-drain-results-only",
      repo: "https://github.com/vpn-cli/streammart",
      readme: "https://github.com/vpn-cli/streammart#readme",
    },
    metrics: [
      {
        value: "375.75/s",
        label: "Completed checkouts (100 VUs)",
        howMeasured:
          "PHASE1-BENCHMARKS.md (fix_b, 3-run mean at 100 VUs, full drain to lag=0): up 7.76× from 48.42/s baseline_consumer.",
      },
      {
        value: "0 msgs",
        label: "Full-pipeline lag @ 30s",
        howMeasured:
          "README.md & PHASE1-BENCHMARKS.md: Order, Email, and Analytic consumer lag @ 30s dropped from 7,420 / 5,050 / 20,480 msgs to 0 msgs (0.00s catch-up) at 100 VUs.",
      },
      {
        value: "500 / 500",
        label: "Kafka outage zero-loss recovery",
        howMeasured:
          "scripts/test-outbox-outage.js (CI): 500 checkouts returned HTTP 200 in 2.21s while Kafka was stopped; 500/500 orders fulfilled in 31.1s after restart with 0 duplicates.",
      },
    ],
    situation: {
      heading: "Per-message Postgres transactions capped consumer throughput at 48/s and piled up lag",
      summary:
        "While the original Transactional Outbox avoided dual writes, profiling revealed that sequential `eachMessage` consumers spent 98.2%–99.7% of their time on per-message PostgreSQL round trips—capping 100-VU fulfillment at 48.42 checkouts/s with 7,420 messages of lag (154.33s catch-up). Meanwhile, shared `outbox_events` lacked partial indexes for order/email topics, a single poison message could stall an entire partition, and the API Gateway opened a new TCP socket on every proxied request.",
      constraints: [
        "Baseline `eachMessage` order consumer took 24.22ms/msg under load (91.2% atomic SQL tx + 8.4% idempotency SELECT)",
        "API Gateway without HTTP keep-alive opened 4,405 TCP connections for 4,396 proxied requests (141.57 opens/s)",
        "Published rows for order-successful and email-successful accumulated unbounded (>93k rows) without topic-scoped indexes/pruning",
        "Checkouts must keep succeeding (HTTP 200) even when Kafka is completely down",
      ],
    },
    task: {
      heading: "Eliminate consumer lag, isolate poison pills, and prove resilience in CI",
      summary:
        "Instrument and remove the Postgres transaction bottleneck across all downstream consumers, add SKIP LOCKED batched outbox relays with topic-scoped pruners, implement 1-by-1 poison-pill DLQ fallback, split liveness from relay readiness, and verify every failure mode in GitHub Actions.",
      objectives: [
        {
          title: "Batch Consumer & Relay Pipeline",
          target: "0 lag across all 3 services",
          detail:
            "Convert order, email, and analytic consumers to idempotent eachBatch (1 SQL tx per batch via processed_events) and batch KafkaJS outbox sends with SKIP LOCKED.",
        },
        {
          title: "Poison-Pill & Crash Fault Isolation",
          target: "4 automated CI fault tests",
          detail:
            "Roll back failed batches cleanly, replay 1-by-1 in offset order, route only poison payloads to payment-successful.DLQ after 3 retries, and survive mid-batch SIGKILL.",
        },
        {
          title: "Ingress Keep-Alive & Split Health",
          target: "HTTP 200 during Kafka outage",
          detail:
            "Enable HTTP keep-alive in api-gateway, enforce 32+ char JWT_SECRET startup validation, and separate GET /health (200) from GET /relay-status (503).",
        },
      ],
    },
    figures: [
      {
        id: "streammart-bottleneck-anatomy",
        kind: "latency-anatomy",
        figureNumber: "Figure 1",
        title: "Why Single-Partition eachMessage Plateaued: Per-Message Latency Anatomy",
        caption:
          "High-resolution performance.now() breakdown inside order-service eachMessage (N=500 under load). 99.7% of processing time was PostgreSQL I/O, not Node.js CPU.",
        source: "PHASE1-BENCHMARKS.md · benchmarks/measure-consumer-breakdown.mjs",
        totalLabel: "Total Per-Message Latency (Under Load)",
        totalValue: "24.22 ms",
        segments: [
          {
            label: "Atomic DB Transaction (orders + processed_events + outbox)",
            valueDisplay: "22.10 ms",
            sharePct: 91.2,
            detail: "p50 17.14ms · p95 50.54ms (commit + WAL fsync per message)",
            tone: "accent",
          },
          {
            label: "Idempotency SELECT (processed_events lookup)",
            valueDisplay: "2.04 ms",
            sharePct: 8.4,
            detail: "p50 1.62ms · p95 3.35ms",
            tone: "secondary",
          },
          {
            label: "CPU / JSON Parse / JS Overhead",
            valueDisplay: "0.08 ms",
            sharePct: 0.3,
            detail: "p50 0.08ms · p95 0.12ms (JWT verify separately measured at 21.9 µs)",
            tone: "muted",
          },
        ],
        callouts: [
          {
            label: "Implied 1-Part Ceiling",
            value: "41.3 – 51.8 /s",
            detail: "Matches measured baseline_consumer 100-VU rate of 48.42 completed/s.",
          },
          {
            label: "Master Gateway TCP Probe",
            value: "4,405 opens",
            detail: "4,396 reqs opened 4,405 TCP sockets (1:1) before enabling HTTP keep-alive.",
          },
          {
            label: "Low-Contention Baseline",
            value: "13.42 ms/msg",
            detail: "Even idle, 10.77ms DB tx + 2.40ms SELECT capped 1 partition at ~75–90/s.",
          },
        ],
      },
      {
        id: "streammart-throughput-comparison",
        kind: "bar-comparison",
        figureNumber: "Figure 2",
        title: "Full-Drain Consumer Optimization: Completed Checkouts/s & Lag @ 30s",
        caption:
          "3-run mean across 20, 50, and 100 k6 VUs (1,000 distinct JWTs) drained completely to consumer lag = 0 on Ryzen 7 6800H / Docker WSL2.",
        source: "PHASE1-BENCHMARKS.md · summary-experiment-{baseline_consumer,fix_a,fix_b}.json",
        unit: "checkouts/s",
        seriesLabels: ["True Completed Checkouts/s (Mean across 3 full-drain runs)"],
        groups: [
          {
            label: "Throughput Comparison by VU Tier",
            tiers: [
              {
                tierLabel: "100 VUs",
                bars: [
                  {
                    label: "baseline_consumer (1 part, eachMessage)",
                    value: 48.42,
                    displayValue: "48.42 /s",
                    note: "7,420 lag @ 30s · 154.33s catch-up · p50 245.14ms",
                  },
                  {
                    label: "fix_a (6 parts, concurrency=6)",
                    value: 87.88,
                    displayValue: "87.88 /s (+1.81×)",
                    note: "7,912 lag @ 30s · 97.92s catch-up · p50 205.64ms",
                  },
                  {
                    label: "fix_b (1 part, eachBatch 1-tx/batch)",
                    value: 375.75,
                    displayValue: "375.75 /s (+7.76×)",
                    note: "0 lag @ 30s · 0.31s catch-up · p50 178.47ms",
                    highlight: true,
                  },
                ],
              },
              {
                tierLabel: "50 VUs",
                bars: [
                  {
                    label: "baseline_consumer (1 part, eachMessage)",
                    value: 56.23,
                    displayValue: "56.23 /s",
                    note: "5,645 lag @ 30s · 96.11s catch-up · p50 135.36ms",
                  },
                  {
                    label: "fix_a (6 parts, concurrency=6)",
                    value: 90.74,
                    displayValue: "90.74 /s (+1.61×)",
                    note: "5,858 lag @ 30s · 63.70s catch-up · p50 111.33ms",
                  },
                  {
                    label: "fix_b (1 part, eachBatch 1-tx/batch)",
                    value: 368.92,
                    displayValue: "368.92 /s (+6.56×)",
                    note: "0 lag @ 30s · 0.27s catch-up · p50 74.00ms",
                    highlight: true,
                  },
                ],
              },
              {
                tierLabel: "20 VUs",
                bars: [
                  {
                    label: "baseline_consumer (1 part, eachMessage)",
                    value: 71.37,
                    displayValue: "71.37 /s",
                    note: "3,984 lag @ 30s · 57.57s catch-up · p50 41.49ms",
                  },
                  {
                    label: "fix_a (6 parts, concurrency=6)",
                    value: 152.24,
                    displayValue: "152.24 /s (+2.13×)",
                    note: "2,142 lag @ 30s · 14.06s catch-up · p50 33.44ms",
                  },
                  {
                    label: "fix_b (1 part, eachBatch 1-tx/batch)",
                    value: 251.17,
                    displayValue: "251.17 /s (+3.52×)",
                    note: "0 lag @ 30s · 0.24s catch-up · p50 21.77ms",
                    highlight: true,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "streammart-batch-dlq-flow",
        kind: "flow-diagram",
        figureNumber: "Figure 3",
        title: "eachBatch Atomic Commit & 1-by-1 Poison-Pill DLQ Fallback",
        caption:
          "Verified in CI by test-poison-batch.js (49 valid + 1 null-userId + follow-up #51) and test-mid-batch-crash.js (SIGKILL before offset commit).",
        source: "order-service/consumer-processor.js · .github/workflows/ci.yml",
        lanes: [
          {
            stage: "1. Bulk Dedupe",
            component: "processed_events IN query",
            mechanism: "Single inArray() lookup + within-batch Set filter",
            guarantee: "Skips redeliveries cleanly after SIGKILL",
          },
          {
            stage: "2. Batch Commit",
            component: "db.transaction() (1 per batch)",
            mechanism: "Bulk INSERT orders + processed_events + outbox_events",
            guarantee: "375.75 checkouts/s on 1 partition (FIFO preserved)",
            highlight: true,
          },
          {
            stage: "3. Poison Fallback",
            component: "processSingleOrderMessage()",
            mechanism: "If batch tx fails, rolls back & replays 1-by-1 in offset order",
            guarantee: "49/49 valid orders commit without halting",
            highlight: true,
          },
          {
            stage: "4. DLQ Isolation",
            component: "payment-successful.DLQ",
            mechanism: "After 3 retries, sends only poison payload with error headers",
            guarantee: "Follow-up msg #51 processes; Kafka lag = 0",
          },
        ],
        branchNote: {
          trigger: "SIGKILL after DB batch tx commit, before Kafka resolveOffset()",
          fallback: "Partition redelivers 50 messages on container restart",
          outcome: "processed_events PK skips all 50; 0 duplicates, lag = 0",
        },
      },
    ],
    result: {
      heading: "7.76× higher completed throughput, zero consumer lag, and 4/4 CI fault tests passing",
      summary:
        "Batching PostgreSQL writes inside idempotent Kafka consumers eliminated downstream lag across Order, Email, and Analytic services while surviving broker outages, mid-batch crashes, and poison payloads.",
      outcomes: [
        {
          metric: "100-VU Completed Checkouts",
          before: "48.42 /s · 7,420 lag @ 30s · 154.33s catch-up",
          after: "375.75 /s (+7.76×) · 0 lag @ 30s · 0.31s catch-up",
          source: "fix_b (PHASE1-BENCHMARKS.md)",
        },
        {
          metric: "Email & Analytic Lag (100 VUs)",
          before: "5,050 email msgs (44s) + 20,480 analytic msgs (97s)",
          after: "0 msgs / 0.00s catch-up across all 3 downstream services",
          source: "Full-pipeline benchmark",
        },
        {
          metric: "CI Fault-Tolerance Matrix",
          before: "Unverified crash recovery & un-isolated bad payloads",
          after: "4/4 live Docker Compose resilience scripts green in GitHub Actions",
          source: ".github/workflows/ci.yml",
        },
      ],
    },
    problemClaim: "Per-message commits bottlenecked consumers and stalled on poison payloads",
    problemText:
      "Even with a transactional outbox, running one Postgres transaction per Kafka message capped single-partition fulfillment at 48.42 checkouts/s under 100 VUs, piled up >20,000 downstream analytic events, and risked halting partitions on malformed messages.",
    problemComparison: {
      before: {
        title: "Sequential eachMessage & Unindexed Shared Outbox",
        points: [
          "Every Kafka message opened a separate Postgres tx (24.22ms/msg under load)",
          "API Gateway opened 4,405 TCP connections for 4,396 HTTP requests",
          "Order/Email outbox rows lacked partial indexes and retention pruning",
          "Poison payloads or Kafka restarts lacked automated CI resilience proofs",
        ],
      },
      after: {
        title: "SKIP LOCKED Relays, eachBatch & DLQ Isolation",
        points: [
          "Single SQL tx per Kafka batch hits 375.75/s with 0 lag across 3 services",
          "Gateway HTTP keep-alive & 32+ char JWT_SECRET validation at boot",
          "Topic-scoped partial indexes + pruners keep outbox scans O(unpublished)",
          "1-by-1 fallback routes poison pills to .DLQ; /health stays 200 during outages",
        ],
      },
    },
    architectureClaim: "SKIP LOCKED relays and eachBatch consumers guarantee zero-loss throughput",
    architectureText:
      "API Gateway validates JWTs over keep-alive connections into Payment Service, which commits payments and outbox rows atomically. SKIP LOCKED relays batch-publish to KRaft Kafka, feeding idempotent eachBatch consumers with DLQ isolation.",
    architectureNodes: [
      {
        id: "gateway",
        title: "Keep-Alive Gateway",
        subtitle: "Port 8085 · Strict JWT",
        tech: "Express 5 & HTTP Keep-Alive",
        role: "Enforces 32+ char JWT_SECRET & reuses backend TCP sockets.",
        codeSnippet: {
          filename: "api-gateway/config.js",
          language: "javascript",
          code: `const MIN_JWT_SECRET_LENGTH = 32;
const secret = process.env.JWT_SECRET;
if (typeof secret !== "string" || secret.trim().length < MIN_JWT_SECRET_LENGTH) {
  throw new Error(
    \`Missing or invalid JWT_SECRET: must be set and at least \${MIN_JWT_SECRET_LENGTH} characters long\`
  );
}
export const JWT_SECRET = secret;`,
          explanation:
            "Fails fast on startup if JWT_SECRET is missing or short—eliminating insecure hardcoded defaults across gateway and CI.",
        },
      },
      {
        id: "payment",
        title: "Payment & Split Health",
        subtitle: "/health vs /relay-status",
        tech: "PostgreSQL 16 & Drizzle",
        role: "Commits payment + outbox atomically; stays 200 if Kafka drops.",
        codeSnippet: {
          filename: "payment-service/index.js",
          language: "javascript",
          code: `// GET /health -> 200 OK (process liveness so checkouts keep succeeding to Postgres)
// GET /relay-status -> 503 when Kafka relay is down + outbox pruner telemetry
await db.transaction(async (tx) => {
  await tx.insert(payments).values({ userId, amount: String(amount), status: "completed" });
  await tx.insert(outboxEvents).values({
    id: eventId, topic: "payment-successful",
    payload: { eventId, correlationId: eventId, causationId: eventId, userId, cart },
    published: false,
  });
});`,
          explanation:
            "Splits container liveness (/health) from broker readiness (/relay-status) so Docker never restarts checkout ingress during Kafka outages.",
        },
      },
      {
        id: "outbox",
        title: "SKIP LOCKED Relay",
        subtitle: "Batched Send & Pruner",
        tech: "FOR UPDATE SKIP LOCKED",
        role: "Claims 50 rows lock-free, batch-sends to Kafka, prunes old rows.",
        codeSnippet: {
          filename: "payment-service/worker.js",
          language: "javascript",
          code: `const rows = await tx.execute(
  sql\`SELECT id, topic, payload, created_at FROM outbox_events
       WHERE published = false AND topic = 'payment-successful'
       ORDER BY created_at ASC LIMIT 50 FOR UPDATE SKIP LOCKED\`
);
if (process.env.RELAY_BATCH_SEND === "true") {
  for (const [topic, messages] of messagesByTopic.entries()) {
    await producer.send({ topic, messages });
  }
}`,
          explanation:
            "Allows concurrent relay workers without duplicate publishes while topic-scoped partial indexes and pruners bound table growth.",
        },
      },
      {
        id: "order",
        title: "Order eachBatch + DLQ",
        subtitle: "Idempotent Batch Tx",
        tech: "KafkaJS eachBatch & Drizzle",
        role: "1 SQL tx per batch; 1-by-1 fallback isolates poison pills to DLQ.",
        codeSnippet: {
          filename: "order-service/consumer-processor.js",
          language: "javascript",
          code: `// 1. Bulk idempotency check via inArray(processedEvents.eventId, eventIds)
// 2. Single atomic db.transaction() for orders + processed_events + outbox_events
// 3. On batch failure: clean rollback -> 1-by-1 offset replay -> payment-successful.DLQ
if (batchFailed) {
  for (const message of batch.messages) {
    const res = await processSingleOrderMessage({ message, db, producer, tables });
    resolveOffset(message.offset);
  }
}`,
          explanation:
            "Preserves per-user FIFO order on 1 partition while reaching 375.75 completed checkouts/s and isolating poison messages.",
        },
      },
      {
        id: "downstream",
        title: "Email & Analytic Batch",
        subtitle: "Zero-Lag Downstream",
        tech: "eachBatch & ON CONFLICT",
        role: "Drains 3x cross-topic events with zero leftover lag.",
        codeSnippet: {
          filename: "analytic-service/index.js",
          language: "javascript",
          code: `// Consumes payment-successful, order-successful, and email-successful via eachBatch
// Bulk inserts into processed_events with ON CONFLICT DO NOTHING
// Result at 100 VUs: 0 msgs lag @ 30s (down from 20,480 msgs / 97.15s catch-up)`,
          explanation:
            "Applying eachBatch and batched relays across email-service and analytic-service reduced full-pipeline lag to 0.",
        },
      },
    ],
    decisionsClaim: "Four architectural choices that delivered 7.76× throughput",
    decisionsText:
      "Every optimization was guided by empirical profiling and verified by full-drain k6 benchmarks.",
    decisions: [
      {
        chosenOver: "Chose 1-partition eachBatch (1 tx/batch) over 6-partition concurrent eachMessage",
        tradeoffSummary:
          "375.75/s vs 87.88/s at 100 VUs while preserving strict per-user FIFO order, with batch fallback complexity.",
        optionsConsidered: [
          "1-partition sequential eachMessage (48.42/s)",
          "6 partitions + partitionsConsumedConcurrently=6 (87.88/s)",
          "1-partition eachBatch with 1 atomic SQL tx per batch (375.75/s)",
        ],
        problemFaced:
          "Even with 6 concurrent partitions, per-message Postgres commits (22.10ms tx + WAL fsync) created write contention that capped throughput below 100/s.",
        fullReasoning:
          "Collapsing dozens of per-message transactions into one SQL transaction per Kafka batch eliminated Postgres write contention, raising both consumer fulfillment (+7.76×) and accepted ingress (+32.9%).",
      },
      {
        chosenOver: "Chose 1-by-1 offset fallback + DLQ over halting partition or dropping failed batches",
        tradeoffSummary:
          "Valid messages in a poisoned batch still commit cleanly; only the bad payload goes to .DLQ.",
        optionsConsidered: [
          "Fail and retry entire batch indefinitely (head-of-line blocking)",
          "Skip entire batch on error (data loss)",
          "Rollback batch → replay 1-by-1 in offset order → DLQ after 3 retries",
        ],
        problemFaced:
          "A single malformed or constraint-violating message inside a 50-message batch rolls back the entire SQL transaction.",
        fullReasoning:
          "Falling back to per-message execution after a batch rollback guarantees 49/49 valid orders commit while isolating only the poison message to payment-successful.DLQ.",
      },
      {
        chosenOver: "Chose shared outbox_events with per-topic partial indexes over separate DBs in Phase 1",
        tradeoffSummary:
          "O(unpublished) index scans and atomic local transactions today; easy to split per service later.",
        optionsConsidered: [
          "Unindexed shared table (grew to >93k rows per topic)",
          "Separate PostgreSQL instances per microservice",
          "Shared outbox_events with 3 topic-scoped partial indexes & scoped pruners",
        ],
        problemFaced:
          "Only payment-successful had a partial index and pruner, causing full table scans for order and email relays.",
        fullReasoning:
          "Adding idx_outbox_events_{payment,order,email}_unpublished partial indexes and strictly topic-scoped DELETE pruners kept atomic local transactions while bounding table growth.",
      },
      {
        chosenOver: "Chose split /health & /relay-status over combined Kafka-coupled healthcheck",
        tradeoffSummary:
          "Checkouts keep returning HTTP 200 during broker outages while ops probes see 503 on /relay-status.",
        optionsConsidered: [
          "Single /health returning 503 whenever Kafka is disconnected",
          "Separate liveness (/health = 200) and relay readiness (/relay-status = 503)",
        ],
        problemFaced:
          "Coupling Docker's restart healthcheck to Kafka caused container restarts and blocked HTTP checkouts during broker downtime.",
        fullReasoning:
          "Decoupling liveness from broker readiness lets payment-service queue 500/500 checkouts into Postgres safely while /relay-status alerts on Kafka disconnect or pruner errors.",
      },
    ],
    bugsClaim: "Four production & benchmark bugs caught and fixed",
    bugsText:
      "Critical bugs uncovered by container effective-config auditing, keep-alive probes, and outage drills.",
    bugs: [
      {
        title: "Five consumer and relay env vars silently defaulted inside Docker",
        symptom: "Benchmarks showed sequential sends even when RELAY_BATCH_SEND=true was set on the host.",
        cause: "docker-compose.yml omitted RELAY_BATCH_SEND, CONSUMER_MODE, and OUTBOX_RETENTION_HOURS; payment pruner also passed raw JS Date to SQL.",
        fix: "Wired all env vars through Compose, fixed pruner SQL, and logged [EFFECTIVE CONFIG] at container boot.",
        commitHash: "5c7f584",
        commitUrl: "https://github.com/vpn-cli/streammart/commit/5c7f584",
      },
      {
        title: "Hardcoded JWT_SECRET fallbacks risked running insecure container defaults",
        symptom: "Gateway booted with fallback secrets when environment variables were unset.",
        cause: "Token signing and verification used inline || fallback strings across files.",
        fix: "Centralized 32+ char JWT_SECRET startup validation in api-gateway/config.js and auto-generated ephemeral CI secrets.",
        commitHash: "d7069ab",
        commitUrl: "https://github.com/vpn-cli/streammart/commit/d7069ab",
      },
      {
        title: "API Gateway opened a new TCP socket for every proxied request",
        symptom: "20-VU probe recorded 4,405 TCP ActiveOpens for 4,396 HTTP requests (141.57 opens/s).",
        cause: "Omitting an HTTP Agent in http-proxy-middleware defaulted to agent: false.",
        fix: "Configured persistent HTTP keep-alive agent, raising 50–100 VU ingress throughput past 370 req/s.",
        commitHash: "51cc87c",
        commitUrl: "https://github.com/vpn-cli/streammart/commit/51cc87c",
      },
      {
        title: "Kafka outage caused healthcheck failures during startup",
        symptom: "payment-service failed health checks if booted while Kafka was offline.",
        cause: "Producer connection failure stalled startup instead of retrying with backoff behind split health endpoints.",
        fix: "Added exponential Kafka connect backoff and separated /health (200) from /relay-status (503).",
        commitHash: "77e9b9c",
        commitUrl: "https://github.com/vpn-cli/streammart/commit/77e9b9c",
      },
    ],
    nextStepsClaim: "What I would build next and test steps",
    nextStepsText:
      "Split `outbox_events` into isolated per-service database schemas for independent horizontal DB scaling and run isolated causal measurements on `RELAY_BUSY_PAUSE_MS`.",
    learningStatement:
      "Empirical profiling before scaling partitions turned a 48/s database commit bottleneck into a 375.75/s zero-lag pipeline on a single partition.",
    tryItSteps: [
      "Clone the repository: git clone https://github.com/vpn-cli/streammart.git",
      "Boot the full KRaft Kafka + Postgres 16 + 5-service stack: npm run stack:up",
      "Run the narrated Kafka outage survival demo: npm run demo:outage",
      "Execute the 4 live fault-injection harnesses (poison batch, SIGKILL crash, Kafka outage, order crash).",
    ],
    image: "/projects/stream-mart.png",
    githubUrl: "https://github.com/vpn-cli/streammart",
    liveUrl: "https://github.com/vpn-cli/streammart#verified-benchmarks-full-drain-results-only",
  },
];
