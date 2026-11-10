"use client";

import { useState, useRef, useEffect, Fragment } from "react";
import { TransitionLink } from "@/components/motion/RouteTransition";
import {
  ArrowUpRight,
  Play,
  RotateCcw,
  Cpu,
  Zap,
} from "lucide-react";

type WorkbenchMode = "systems" | "benchmarks";
type SystemsSubTab = "kafka" | "sockets" | "ast";

interface StreamLog {
  id: string;
  offset: string;
  stage: string;
  message: string;
  meta?: string;
  latency?: string;
}

interface PipelineConfig {
  title: string;
  source: string;
  link: string;
  linkLabel: string;
  stages: string[];
}

const PIPELINES: Record<SystemsSubTab, PipelineConfig> = {
  kafka: {
    title: "StreamMart outbox",
    source: "From StreamMart",
    link: "/work/stream-mart",
    linkLabel: "Read case study: StreamMart",
    stages: [
      "Postgres transaction",
      "Outbox row",
      "Debezium",
      "Kafka",
      "Payment consumer",
    ],
  },
  sockets: {
    title: "Sportz rooms",
    source: "From Sportz",
    link: "/work/sockets",
    linkLabel: "Read case study: Sportz",
    stages: [
      "Client",
      "Rate limiter",
      "Room",
      "Broadcast",
    ],
  },
  ast: {
    title: "AppForge parser",
    source: "From AppForge",
    link: "/work/appforge",
    linkLabel: "Read case study: AppForge",
    stages: [
      "Prompt",
      "Parser",
      "Schema check",
      "AST",
      "React",
    ],
  },
};

const initialKafkaLogs: StreamLog[] = [
  {
    id: "k-1",
    offset: "+0.0 ms",
    stage: "Postgres transaction",
    message: "ACID commit: order #SM-8941 & outbox event inserted",
    meta: "orders_table",
    latency: "0.8 ms",
  },
  {
    id: "k-2",
    offset: "+3.1 ms",
    stage: "Kafka",
    message: "Topic [orders.events] partition 2 offset +1 published",
    meta: "debezium_cdc",
    latency: "0.2 ms",
  },
  {
    id: "k-3",
    offset: "+7.4 ms",
    stage: "Payment consumer",
    message: "Consumer group 'payments' acked event #SM-8941",
    meta: "lag: 0",
    latency: "0.4 ms",
  },
];

const initialSocketsLogs: StreamLog[] = [
  {
    id: "s-1",
    offset: "+0.0 ms",
    stage: "Client",
    message: "Client connected, subscribing to room match:402",
    meta: "ws_handshake",
    latency: "1.2 ms",
  },
  {
    id: "s-2",
    offset: "+0.4 ms",
    stage: "Room",
    message: "Client added to in-memory room Set (subscribers: 142)",
    meta: "map_lookup",
    latency: "0.04 ms",
  },
  {
    id: "s-3",
    offset: "+1.1 ms",
    stage: "Broadcast",
    message: "Goal event dispatched to 142 sockets without Redis call",
    meta: "zero_copy",
    latency: "0.3 ms",
  },
];

const initialAstLogs: StreamLog[] = [
  {
    id: "a-1",
    offset: "+0.0 ms",
    stage: "Prompt",
    message: "User: 'Generate a dashboard with revenue cards and recent orders'",
    meta: "input_tokens: 34",
    latency: "0.1 ms",
  },
  {
    id: "a-2",
    offset: "+82.0 ms",
    stage: "Schema check",
    message: "Payload validated against strict component schema (Zod)",
    meta: "no_eval",
    latency: "1.4 ms",
  },
  {
    id: "a-3",
    offset: "+88.5 ms",
    stage: "AST",
    message: "JSX AST verified: 4 elements created, 0 unsafe expressions",
    meta: "babel_ast",
    latency: "2.1 ms",
  },
];

export function AboutWorkbench() {
  const [mode, setMode] = useState<WorkbenchMode>("systems");
  const [systemsTab, setSystemsTab] = useState<SystemsSubTab>("kafka");
  const [kafkaLogs, setKafkaLogs] = useState<StreamLog[]>(initialKafkaLogs);
  const [socketsLogs, setSocketsLogs] = useState<StreamLog[]>(initialSocketsLogs);
  const [astLogs, setAstLogs] = useState<StreamLog[]>(initialAstLogs);

  const [activeStageIndex, setActiveStageIndex] = useState<number | null>(null);
  const [newestLogId, setNewestLogId] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const markerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const stageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const animationRef = useRef<Animation | null>(null);

  const currentPipeline = PIPELINES[systemsTab];
  const logs =
    systemsTab === "kafka"
      ? kafkaLogs
      : systemsTab === "sockets"
      ? socketsLogs
      : astLogs;

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      if (animationRef.current) {
        animationRef.current.cancel();
      }
    };
  }, []);

  const handleEmitEvent = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    if (animationRef.current) {
      animationRef.current.cancel();
    }

    setIsSimulating(true);

    const stagesCount = currentPipeline.stages.length;
    const duration = 600;
    const stepDuration = duration / (stagesCount - 1);

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 1. Stage highlighting sequence
    for (let i = 0; i < stagesCount; i++) {
      const t = setTimeout(() => {
        setActiveStageIndex(i);
      }, i * stepDuration);
      timeoutsRef.current.push(t);
    }

    const resetStageTimeout = setTimeout(() => {
      setActiveStageIndex(null);
      setIsSimulating(false);
    }, duration + 150);
    timeoutsRef.current.push(resetStageTimeout);

    // 2. Marker movement via Web Animations API (transform/opacity only)
    if (!prefersReducedMotion && markerRef.current && trackRef.current) {
      const marker = markerRef.current;
      const track = trackRef.current;
      const trackRect = track.getBoundingClientRect();

      const nodeCenters = currentPipeline.stages.map((_, i) => {
        const el = stageRefs.current[i];
        if (!el) return 0;
        const rect = el.getBoundingClientRect();
        return rect.left - trackRect.left + rect.width / 2;
      });

      const keyframes = nodeCenters.map((x, i) => ({
        transform: `translate3d(${x - 5}px, 0, 0)`,
        opacity: 1,
        offset: i / (stagesCount - 1),
      }));

      keyframes[0].opacity = 0.9;

      marker.style.opacity = "1";
      const anim = marker.animate(keyframes, {
        duration,
        easing: "ease-in-out",
        fill: "forwards",
      });
      animationRef.current = anim;

      anim.onfinish = () => {
        const fadeAnim = marker.animate(
          [{ opacity: 1 }, { opacity: 0 }],
          { duration: 150, fill: "forwards" }
        );
        fadeAnim.onfinish = () => {
          marker.style.opacity = "0";
        };
      };
    }

    // 3. Log event creation
    let newLog: StreamLog;
    if (systemsTab === "kafka") {
      const orderNum = Math.floor(1000 + Math.random() * 9000);
      newLog = {
        id: `k-${Date.now()}`,
        offset: "+0.0 ms",
        stage: "Postgres transaction",
        message: `Order #SM-${orderNum} transactional outbox committed`,
        meta: "partition: 0",
        latency: "0.2 ms",
      };
      setKafkaLogs((prev) => [newLog, ...prev.slice(0, 5)]);
    } else if (systemsTab === "sockets") {
      const tick = Math.floor(Math.random() * 90);
      newLog = {
        id: `s-${Date.now()}`,
        offset: "+0.0 ms",
        stage: "Broadcast",
        message: `Match event broadcasted: score update (tick: ${tick}m)`,
        meta: "listeners: 5",
        latency: "0.18 ms",
      };
      setSocketsLogs((prev) => [newLog, ...prev.slice(0, 5)]);
    } else {
      newLog = {
        id: `a-${Date.now()}`,
        offset: "+0.0 ms",
        stage: "AST",
        message: "AST syntax node generated: <DataGrid cols={3} />",
        meta: "deterministic",
        latency: "0.9 ms",
      };
      setAstLogs((prev) => [newLog, ...prev.slice(0, 5)]);
    }

    // Accent highlight on newest row
    setNewestLogId(newLog.id);
    const clearAccentTimeout = setTimeout(() => {
      setNewestLogId((current) => (current === newLog.id ? null : current));
    }, 1800);
    timeoutsRef.current.push(clearAccentTimeout);
  };

  const handleReset = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    if (animationRef.current) {
      animationRef.current.cancel();
    }
    setActiveStageIndex(null);
    setNewestLogId(null);
    setIsSimulating(false);
    if (markerRef.current) {
      markerRef.current.style.opacity = "0";
    }
    setKafkaLogs(initialKafkaLogs);
    setSocketsLogs(initialSocketsLogs);
    setAstLogs(initialAstLogs);
  };

  return (
    <section
      aria-labelledby="workbench-heading"
      className="w-full rounded-[28px] sm:rounded-[32px] bg-[var(--surface-tile)] text-[var(--text-primary)] border border-[var(--border-subtle)] p-6 sm:p-8 lg:p-10 space-y-6"
    >
      <div data-reveal data-reveal-order="6" className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[var(--border-subtle)]">
        <div className="space-y-1">
          <h2 id="workbench-heading" className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Three backends, simulated
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] font-normal">
            Press Emit Event to see how each system handles a new event. The logs are simulated.
          </p>
        </div>

        {/* Selected state in ALL toggles, segmented controls and tabs: neutral pill in primary text color */}
        <div
          role="radiogroup"
          aria-label="Workbench display mode"
          className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] shrink-0 self-start md:self-auto"
        >
          <button
            type="button"
            role="radio"
            aria-checked={mode === "systems"}
            onClick={() => setMode("systems")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px] sm:text-sm font-semibold transition-colors cursor-pointer min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:ring-offset-2 ${
              mode === "systems"
                ? "bg-[var(--surface-tile)] text-[var(--text-primary)] shadow-sm"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Cpu className="w-4 h-4" aria-hidden="true" />
            <span>Systems</span>
          </button>

          <button
            type="button"
            role="radio"
            aria-checked={mode === "benchmarks"}
            onClick={() => setMode("benchmarks")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px] sm:text-sm font-semibold transition-colors cursor-pointer min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:ring-offset-2 ${
              mode === "benchmarks"
                ? "bg-[var(--surface-tile)] text-[var(--text-primary)] shadow-sm"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Zap className="w-4 h-4" aria-hidden="true" />
            <span>Trade-offs</span>
          </button>
        </div>
      </div>

      {mode === "systems" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Selected state in ALL toggles, segmented controls and tabs: primary text color plus 2px underline */}
            <div data-ui="pipeline-switcher" className="flex items-center gap-4 sm:gap-6 border-b border-[var(--border-subtle)]">
              <button
                type="button"
                onClick={() => {
                  setSystemsTab("kafka");
                  setActiveStageIndex(null);
                }}
                className={`pb-2.5 pt-1.5 text-[13px] sm:text-sm font-medium transition-colors cursor-pointer border-b-2 -mb-[1px] min-h-[44px] flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:ring-offset-2 ${
                  systemsTab === "kafka"
                    ? "text-[var(--text-primary)] font-semibold border-[var(--text-primary)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] border-transparent"
                }`}
              >
                StreamMart (Kafka)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSystemsTab("sockets");
                  setActiveStageIndex(null);
                }}
                className={`pb-2.5 pt-1.5 text-[13px] sm:text-sm font-medium transition-colors cursor-pointer border-b-2 -mb-[1px] min-h-[44px] flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:ring-offset-2 ${
                  systemsTab === "sockets"
                    ? "text-[var(--text-primary)] font-semibold border-[var(--text-primary)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] border-transparent"
                }`}
              >
                Sportz (WebSockets)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSystemsTab("ast");
                  setActiveStageIndex(null);
                }}
                className={`pb-2.5 pt-1.5 text-[13px] sm:text-sm font-medium transition-colors cursor-pointer border-b-2 -mb-[1px] min-h-[44px] flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:ring-offset-2 ${
                  systemsTab === "ast"
                    ? "text-[var(--text-primary)] font-semibold border-[var(--text-primary)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] border-transparent"
                }`}
              >
                AppForge (AST parser)
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* Primary action CTA: Exactly one primary style (accent fill, white text) */}
              <button
                type="button"
                data-cta="primary"
                onClick={handleEmitEvent}
                disabled={isSimulating}
                className="btn-primary text-[13px] sm:text-sm"
              >
                <Play className={`w-3.5 h-3.5 ${isSimulating ? "animate-spin" : ""}`} aria-hidden="true" />
                <span>Emit Event</span>
              </button>

              {/* Secondary button: neutral surface with hairline border, primary text color */}
              <button
                type="button"
                data-cta="secondary"
                onClick={handleReset}
                title="Reset simulation logs"
                aria-label="Reset simulation logs"
                className="btn-secondary !p-2.5"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Clean full-width single panel with theme surface tokens */}
          <div data-ui="simulator" className="w-full rounded-2xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--surface-tile-elevated)]">
            {/* Panel Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-[var(--surface-tile)] border-b border-[var(--border-subtle)]">
              <span className="text-sm sm:text-base font-semibold text-[var(--text-primary)]">
                {currentPipeline.title}
              </span>
              <span className="text-[13px] text-[var(--text-tertiary)] font-normal">
                {isSimulating ? "Emitting..." : "Simulated"}
              </span>
            </div>

            {/* Pipeline stages */}
            <div className="px-4 sm:px-6 py-4 bg-[var(--surface-tile-elevated)] overflow-x-auto no-scrollbar border-b border-[var(--border-subtle)]">
              <div
                ref={trackRef}
                className="relative flex items-center justify-between min-w-[520px] sm:min-w-0 py-2"
              >
                {currentPipeline.stages.map((stage, idx) => {
                  const isActive = activeStageIndex === idx;
                  return (
                    <Fragment key={stage}>
                      <div
                        ref={(el) => {
                          stageRefs.current[idx] = el;
                        }}
                        className={`relative z-10 px-3 py-1.5 rounded-lg text-[13px] transition-colors duration-150 select-none ${
                          isActive
                            ? "text-[var(--text-primary)] font-semibold bg-[var(--surface-tile)] ring-2 ring-[var(--accent-color)] border border-transparent shadow-sm"
                            : "text-[var(--text-secondary)] font-normal bg-[var(--surface-tile)] border border-[var(--border-subtle)]"
                        }`}
                      >
                        {stage}
                      </div>
                      {idx < currentPipeline.stages.length - 1 && (
                        <div
                          className="flex-1 h-[1px] bg-[var(--border-subtle)] mx-2"
                          aria-hidden="true"
                        />
                      )}
                    </Fragment>
                  );
                })}

                {/* Animated marker: Data highlight in accent */}
                <div
                  ref={markerRef}
                  className="absolute top-1/2 -translate-y-1/2 pointer-events-none z-20 w-3 h-3 rounded-full bg-[var(--accent-color)] shadow-[0_0_8px_var(--accent-color)] opacity-0"
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* Event Log */}
            <div className="p-4 sm:p-6 space-y-2">
              <div className="text-[13px] text-[var(--text-tertiary)] flex items-center justify-between pb-1 font-normal">
                <span>Event log</span>
                <span className="tabular-nums">{logs.length} events</span>
              </div>

              <div className="space-y-2">
                {logs.map((log) => {
                  const isNew = log.id === newestLogId;
                  return (
                    <div
                      key={log.id}
                      className={`flex items-center justify-between gap-3 p-3 rounded-xl border text-[13px] leading-snug transition-colors duration-300 ${
                        isNew
                          ? "border-[var(--accent-color)] bg-[var(--accent-color)]/10 text-[var(--text-primary)]"
                          : "border-[var(--border-subtle)] bg-[var(--surface-tile)]"
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate min-w-0">
                        <span className="text-[var(--text-tertiary)] font-normal tabular-nums shrink-0 text-[13px]">
                          {log.offset}
                        </span>
                        <span className="text-[var(--text-tertiary)] font-normal shrink-0 text-[13px]">
                          {log.stage}
                        </span>
                        <code className="text-[var(--text-primary)] font-mono text-[13px] truncate">
                          {log.message}
                        </code>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {log.meta && (
                          <code className="text-[13px] text-[var(--text-tertiary)] hidden sm:inline font-mono">
                            {log.meta}
                          </code>
                        )}
                        {log.latency && (
                          <span className="text-[13px] text-[var(--text-tertiary)] font-normal tabular-nums">
                            {log.latency}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 text-[13px] text-[var(--text-secondary)] bg-[var(--surface-tile)] border-t border-[var(--border-subtle)]">
              <span className="text-[13px] text-[var(--text-tertiary)] font-normal">
                {currentPipeline.source}
              </span>
              <TransitionLink
                href={currentPipeline.link}
                trackLocation="about_workbench"
                trackLabel={currentPipeline.linkLabel}
                className="text-link inline-flex items-center gap-1 text-sm font-semibold whitespace-nowrap shrink-0 transition-colors rounded min-h-[44px]"
              >
                <span>Read case study</span>
                <ArrowUpRight className="w-4 h-4 shrink-0" aria-hidden="true" />
              </TransitionLink>
            </div>
          </div>
        </div>
      )}

      {mode === "benchmarks" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[13px] font-normal text-[var(--text-tertiary)] block">
                In-memory rooms
              </span>
              <h3 className="text-base sm:text-lg font-semibold text-[var(--text-primary)]">
                Rooms in memory
              </h3>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed font-normal">
                Sportz keeps rooms in a <code className="font-mono text-[13px] bg-[var(--surface-tile)] text-[var(--text-primary)] px-1.5 py-0.5 rounded border border-[var(--border-subtle)]">Map&lt;string, Set&lt;Client&gt;&gt;</code> inside the Node process, so broadcasting to a room needs no Redis call.
              </p>
            </div>
            <div className="pt-2 text-[13px] text-[var(--text-tertiary)] font-normal">
              Used in Sportz
            </div>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[13px] font-normal text-[var(--text-tertiary)] block">
                Transactional outbox
              </span>
              <h3 className="text-base sm:text-lg font-semibold text-[var(--text-primary)]">
                Orders and events in one transaction
              </h3>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed font-normal">
                StreamMart writes the order and its outbox event in the same Postgres transaction. Debezium reads the outbox and publishes to Kafka, so an order can&apos;t exist without its event.
              </p>
            </div>
            <div className="pt-2 text-[13px] text-[var(--text-tertiary)] font-normal">
              Used in StreamMart
            </div>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[13px] font-normal text-[var(--text-tertiary)] block">
                Schema-checked AST
              </span>
              <h3 className="text-base sm:text-lg font-semibold text-[var(--text-primary)]">
                Validate before rendering
              </h3>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed font-normal">
                AppForge checks model output against a JSON schema and a Babel AST pass before building React components. It never calls eval().
              </p>
            </div>
            <div className="pt-2 text-[13px] text-[var(--text-tertiary)] font-normal">
              Used in AppForge
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
