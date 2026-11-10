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
    stage: "Rate limiter",
    message: "GET /ws -> Rate limiter: PASS (client_309)",
    meta: "sub-ms",
    latency: "0.3 ms",
  },
  {
    id: "s-2",
    offset: "+1.2 ms",
    stage: "Room",
    message: "Client joined room 'match:arsenal-chelsea' (listeners: 4)",
    meta: "in-memory map",
    latency: "0.1 ms",
  },
  {
    id: "s-3",
    offset: "+2.8 ms",
    stage: "Broadcast",
    message: "Broadcast score tick to 4 listeners across room map",
    meta: "payload: 128B",
    latency: "0.15 ms",
  },
];

const initialAstLogs: StreamLog[] = [
  {
    id: "a-1",
    offset: "+0.0 ms",
    stage: "Prompt",
    message: "Prompt token stream received: 'Analytics Dashboard Grid'",
    meta: "prompt_in",
    latency: "0.5 ms",
  },
  {
    id: "a-2",
    offset: "+4.2 ms",
    stage: "Schema check",
    message: "Parsed into 4 AST nodes: Container, MetricTile, ChartView",
    meta: "100% schema bounded",
    latency: "1.2 ms",
  },
  {
    id: "a-3",
    offset: "+6.8 ms",
    stage: "React",
    message: "React JSX AST tree safely instantiated without eval()",
    meta: "sandbox: secure",
    latency: "0.3 ms",
  },
];

export function AboutWorkbench() {
  const [mode, setMode] = useState<WorkbenchMode>("systems");
  const [systemsTab, setSystemsTab] = useState<SystemsSubTab>("kafka");
  const [kafkaLogs, setKafkaLogs] = useState<StreamLog[]>(initialKafkaLogs);
  const [socketsLogs, setSocketsLogs] = useState<StreamLog[]>(initialSocketsLogs);
  const [astLogs, setAstLogs] = useState<StreamLog[]>(initialAstLogs);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [activeStageIndex, setActiveStageIndex] = useState<number | null>(null);
  const [newestLogId, setNewestLogId] = useState<string | null>(null);

  const trackRef = useRef<HTMLDivElement | null>(null);
  const stageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const markerRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<Animation | null>(null);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const currentPipeline = PIPELINES[systemsTab];
  const logs =
    systemsTab === "kafka"
      ? kafkaLogs
      : systemsTab === "sockets"
      ? socketsLogs
      : astLogs;

  // Cleanup timeouts and animations on unmount or tab switch
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
      if (animationRef.current) {
        animationRef.current.cancel();
      }
    };
  }, [systemsTab]);

  const handleEmitEvent = () => {
    if (isSimulating) return;
    setIsSimulating(true);

    // Clear previous timeouts and animations
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    if (animationRef.current) {
      animationRef.current.cancel();
    }

    const stagesCount = currentPipeline.stages.length;
    const duration = 600; // ~600ms total
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

      // Collect node center positions relative to the track
      const nodeCenters = currentPipeline.stages.map((_, i) => {
        const el = stageRefs.current[i];
        if (!el) return 0;
        const rect = el.getBoundingClientRect();
        return rect.left - trackRect.left + rect.width / 2;
      });

      const keyframes = nodeCenters.map((x, i) => ({
        transform: `translate3d(${x - 4}px, 0, 0)`,
        opacity: 1,
        offset: i / (stagesCount - 1),
      }));

      // Start with opacity 0 at origin, quickly fade in
      keyframes[0].opacity = 0.9;

      marker.style.opacity = "1";
      const anim = marker.animate(keyframes, {
        duration,
        easing: "ease-in-out",
        fill: "forwards",
      });
      animationRef.current = anim;

      anim.onfinish = () => {
        // Fade out marker
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

    // ONE accent color on newest row for a moment after it appears
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
      className="w-full -mx-3 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 rounded-[28px] sm:rounded-[32px] bg-[#0E1014] text-[#F0F2F5] border border-white/[0.08] shadow-2xl space-y-6"
    >
      <div data-reveal data-reveal-order="6" className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div className="space-y-1">
          <h2 id="workbench-heading" className="text-xl sm:text-2xl font-bold tracking-tight text-[#F0F2F5]">
            Three backends, simulated
          </h2>
          <p className="text-sm text-[#9DA3AE] font-normal">
            Press Emit Event to see how each system handles a new event. The logs are simulated.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#181B21] border border-white/10 shrink-0 self-start md:self-auto">
          <button
            onClick={() => setMode("systems")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B4EFF] ${
              mode === "systems"
                ? "bg-[#2B4EFF] text-white shadow-sm"
                : "text-[#9DA3AE] hover:text-[#F0F2F5]"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Systems</span>
          </button>

          <button
            onClick={() => setMode("benchmarks")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B4EFF] ${
              mode === "benchmarks"
                ? "bg-[#2B4EFF] text-white shadow-sm"
                : "text-[#9DA3AE] hover:text-[#F0F2F5]"
            }`}
          >
            <Zap className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Trade-offs</span>
          </button>
        </div>
      </div>

      {mode === "systems" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div data-ui="pipeline-switcher" className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  setSystemsTab("kafka");
                  setActiveStageIndex(null);
                }}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B4EFF] ${
                  systemsTab === "kafka"
                    ? "bg-[#20242D] border-[#2B4EFF] text-[#F0F2F5] font-semibold ring-1 ring-[#2B4EFF]"
                    : "bg-transparent border-white/10 text-[#9DA3AE] hover:border-white/20 hover:text-[#F0F2F5]"
                }`}
              >
                StreamMart (Kafka)
              </button>
              <button
                onClick={() => {
                  setSystemsTab("sockets");
                  setActiveStageIndex(null);
                }}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B4EFF] ${
                  systemsTab === "sockets"
                    ? "bg-[#20242D] border-[#2B4EFF] text-[#F0F2F5] font-semibold ring-1 ring-[#2B4EFF]"
                    : "bg-transparent border-white/10 text-[#9DA3AE] hover:border-white/20 hover:text-[#F0F2F5]"
                }`}
              >
                Sportz (WebSockets)
              </button>
              <button
                onClick={() => {
                  setSystemsTab("ast");
                  setActiveStageIndex(null);
                }}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B4EFF] ${
                  systemsTab === "ast"
                    ? "bg-[#20242D] border-[#2B4EFF] text-[#F0F2F5] font-semibold ring-1 ring-[#2B4EFF]"
                    : "bg-transparent border-white/10 text-[#9DA3AE] hover:border-white/20 hover:text-[#F0F2F5]"
                }`}
              >
                AppForge (AST parser)
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleEmitEvent}
                disabled={isSimulating}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2B4EFF] text-white text-xs font-medium hover:bg-[#213ECC] active:scale-95 transition-all cursor-pointer disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B4EFF]"
              >
                <Play className={`w-3 h-3 ${isSimulating ? "animate-spin" : ""}`} aria-hidden="true" />
                <span>Emit Event</span>
              </button>
              <button
                onClick={handleReset}
                title="Reset simulation logs"
                aria-label="Reset simulation logs"
                className="p-1.5 rounded-lg border border-white/10 hover:border-white/20 text-[#808794] hover:text-[#F0F2F5] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B4EFF]"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Clean full-width single panel */}
          <div data-ui="simulator" className="w-full rounded-2xl overflow-hidden border border-white/10 bg-[#14161C]">
            {/* Panel Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-[#181B21] border-b border-white/5">
              <span className="text-sm font-medium text-[#F0F2F5]">
                {currentPipeline.title}
              </span>
              <span className="text-xs text-[#808794] font-normal">
                {isSimulating ? "Emitting..." : "Simulated"}
              </span>
            </div>

            {/* Pipeline stages */}
            <div className="px-4 sm:px-6 py-4 bg-[#101217] overflow-x-auto no-scrollbar border-b border-white/5">
              <div
                ref={trackRef}
                className="relative flex items-center justify-between min-w-[520px] sm:min-w-0 py-1"
              >
                {currentPipeline.stages.map((stage, idx) => {
                  const isActive = activeStageIndex === idx;
                  return (
                    <Fragment key={stage}>
                      <div
                        ref={(el) => {
                          stageRefs.current[idx] = el;
                        }}
                        className={`relative z-10 px-2.5 py-1 rounded-md text-xs transition-colors duration-150 select-none ${
                          isActive
                            ? "text-[#F0F2F5] font-medium bg-[#20242D] ring-1 ring-[#2B4EFF]"
                            : "text-[#9DA3AE] font-normal bg-[#181B21] border border-white/10"
                        }`}
                      >
                        {stage}
                      </div>
                      {idx < currentPipeline.stages.length - 1 && (
                        <div
                          className="flex-1 h-[1px] bg-white/10 mx-1.5"
                          aria-hidden="true"
                        />
                      )}
                    </Fragment>
                  );
                })}

                {/* Animated marker: accent circle with subtle glow, Web Animations API (transform/opacity only) */}
                <div
                  ref={markerRef}
                  className="absolute top-1/2 -translate-y-1/2 pointer-events-none z-20 w-2.5 h-2.5 rounded-full bg-[#2B4EFF] shadow-[0_0_8px_rgba(43,78,255,0.7)] opacity-0"
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* Event Log */}
            <div className="p-4 sm:p-6 space-y-2">
              <div className="text-xs text-[#808794] flex items-center justify-between pb-1 font-normal">
                <span>Event log</span>
                <span className="tabular-nums">{logs.length} events</span>
              </div>

              <div className="space-y-1.5">
                {logs.map((log) => {
                  const isNew = log.id === newestLogId;
                  return (
                    <div
                      key={log.id}
                      className={`flex items-center justify-between gap-3 p-2.5 rounded-lg border text-xs leading-tight transition-colors duration-300 ${
                        isNew
                          ? "border-l-2 border-l-[#2B4EFF] border-white/15 bg-[#2B4EFF]/10"
                          : "border-white/5 bg-[#181B21]"
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate min-w-0">
                        <span className="text-[#808794] font-normal tabular-nums shrink-0 text-xs">
                          {log.offset}
                        </span>
                        <span className="text-[#808794] font-normal shrink-0 text-xs">
                          {log.stage}
                        </span>
                        <code className="text-[#F0F2F5] font-mono text-xs truncate">
                          {log.message}
                        </code>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {log.meta && (
                          <code className="text-xs text-[#808794] hidden sm:inline font-mono">
                            {log.meta}
                          </code>
                        )}
                        {log.latency && (
                          <span className="text-xs text-[#808794] font-normal tabular-nums">
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
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 text-xs text-[#9DA3AE] bg-[#181B21] border-t border-white/5">
              <span className="text-xs text-[#808794] font-normal">
                {currentPipeline.source}
              </span>
              <TransitionLink
                href={currentPipeline.link}
                trackLocation="about_workbench"
                trackLabel={currentPipeline.linkLabel}
                className="inline-flex items-center gap-1 text-sm font-medium text-[#6E8CFF] hover:underline visited:text-[#6E8CFF] whitespace-nowrap shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B4EFF] rounded"
              >
                <span>Read case study</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#6E8CFF] shrink-0" aria-hidden="true" />
              </TransitionLink>
            </div>
          </div>
        </div>
      )}

      {mode === "benchmarks" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-[#181B21] border border-white/10 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-xs font-normal text-[#808794] block">
                In-memory rooms
              </span>
              <h3 className="text-base font-semibold text-[#F0F2F5]">
                Rooms in memory
              </h3>
              <p className="text-sm text-[#9DA3AE] leading-relaxed font-normal">
                Sportz keeps rooms in a <code className="font-mono text-xs text-[#F0F2F5]">Map&lt;string, Set&lt;Client&gt;&gt;</code> inside the Node process, so broadcasting to a room needs no Redis call.
              </p>
            </div>
            <div className="pt-2 text-xs text-[#808794] font-normal">
              Used in Sportz
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#181B21] border border-white/10 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-xs font-normal text-[#808794] block">
                Transactional outbox
              </span>
              <h3 className="text-base font-semibold text-[#F0F2F5]">
                Orders and events in one transaction
              </h3>
              <p className="text-sm text-[#9DA3AE] leading-relaxed font-normal">
                StreamMart writes the order and its outbox event in the same Postgres transaction. Debezium reads the outbox and publishes to Kafka, so an order can&apos;t exist without its event.
              </p>
            </div>
            <div className="pt-2 text-xs text-[#808794] font-normal">
              Used in StreamMart
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#181B21] border border-white/10 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-xs font-normal text-[#808794] block">
                Schema-checked AST
              </span>
              <h3 className="text-base font-semibold text-[#F0F2F5]">
                Validate before rendering
              </h3>
              <p className="text-sm text-[#9DA3AE] leading-relaxed font-normal">
                AppForge checks model output against a JSON schema and a Babel AST pass before building React components. It never calls eval().
              </p>
            </div>
            <div className="pt-2 text-xs text-[#808794] font-normal">
              Used in AppForge
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
