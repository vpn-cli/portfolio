"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Activity,
  Terminal,
  Palette,
  Layers,
  ArrowUpRight,
  Play,
  RotateCcw,
  CheckCircle2,
  Cpu,
  Database,
  Radio,
  FileCode,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Stage, Window } from "@/components/stageshow/kit";
import { useTheme } from "@/components/motion/ThemeProvider";

type WorkbenchMode = "systems" | "visual" | "benchmarks";
type SystemsSubTab = "kafka" | "sockets" | "ast";

interface StreamLog {
  id: string;
  time: string;
  type: "commit" | "publish" | "consume" | "ws" | "ast";
  tag: string;
  message: string;
  meta?: string;
  latency?: string;
}

const initialKafkaLogs: StreamLog[] = [
  {
    id: "k-1",
    time: "23:28:10.142",
    type: "commit",
    tag: "PG-TXN",
    message: "ACID commit: order #SM-8941 & outbox event inserted",
    meta: "orders_table",
    latency: "0.8ms",
  },
  {
    id: "k-2",
    time: "23:28:10.145",
    type: "publish",
    tag: "KAFKA",
    message: "Topic [orders.events] partition 2 offset +1 published",
    meta: "debezium_cdc",
    latency: "0.2ms",
  },
  {
    id: "k-3",
    time: "23:28:10.149",
    type: "consume",
    tag: "PAYMENT",
    message: "Consumer group 'payments' acked event #SM-8941",
    meta: "lag: 0",
    latency: "0.4ms",
  },
];

const initialSocketsLogs: StreamLog[] = [
  {
    id: "s-1",
    time: "23:28:09.804",
    type: "ws",
    tag: "WS-UPGRADE",
    message: "GET /ws -> Rate limiter: PASS (client_309)",
    meta: "sub-ms",
    latency: "0.3ms",
  },
  {
    id: "s-2",
    time: "23:28:10.010",
    type: "ws",
    tag: "ROOM-JOIN",
    message: "Client joined room 'match:arsenal-chelsea' (listeners: 4)",
    meta: "in-memory map",
  },
  {
    id: "s-3",
    time: "23:28:10.150",
    type: "ws",
    tag: "FANOUT",
    message: "Broadcast score tick to 4 listeners across room map",
    meta: "payload: 128B",
    latency: "0.15ms",
  },
];

const initialAstLogs: StreamLog[] = [
  {
    id: "a-1",
    time: "23:28:08.512",
    type: "ast",
    tag: "PARSER",
    message: "Prompt token stream received: 'Analytics Dashboard Grid'",
    meta: "prompt_in",
  },
  {
    id: "a-2",
    time: "23:28:08.640",
    type: "ast",
    tag: "AST-TRANS",
    message: "Parsed into 4 AST nodes: Container, MetricTile, ChartView",
    meta: "100% schema bounded",
    latency: "1.2ms",
  },
  {
    id: "a-3",
    time: "23:28:08.644",
    type: "ast",
    tag: "COMPILER",
    message: "React JSX AST tree safely instantiated without eval()",
    meta: "sandbox: secure",
  },
];

export function AboutWorkbench() {
  const { theme } = useTheme();
  const stageshowTheme = theme === "dark" ? "dark" : "light";

  const [mode, setMode] = useState<WorkbenchMode>("systems");
  const [systemsTab, setSystemsTab] = useState<SystemsSubTab>("kafka");
  const [kafkaLogs, setKafkaLogs] = useState<StreamLog[]>(initialKafkaLogs);
  const [socketsLogs, setSocketsLogs] = useState<StreamLog[]>(initialSocketsLogs);
  const [astLogs, setAstLogs] = useState<StreamLog[]>(initialAstLogs);
  const [selectedArtwork, setSelectedArtwork] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const handleEmitEvent = () => {
    setIsSimulating(true);
    const now = new Date();
    const timeStr = now.toTimeString().split(" ")[0] + "." + String(now.getMilliseconds()).padStart(3, "0");

    if (systemsTab === "kafka") {
      const orderNum = Math.floor(1000 + Math.random() * 9000);
      const newLog: StreamLog = {
        id: `k-${Date.now()}`,
        time: timeStr,
        type: "commit",
        tag: "PG-TXN",
        message: `Order #SM-${orderNum} transactional outbox committed`,
        meta: "partition: 0",
        latency: "0.2ms",
      };
      setKafkaLogs((prev) => [newLog, ...prev.slice(0, 5)]);
    } else if (systemsTab === "sockets") {
      const newLog: StreamLog = {
        id: `s-${Date.now()}`,
        time: timeStr,
        type: "ws",
        tag: "FANOUT",
        message: `Match event broadcasted: score update (tick: ${Math.floor(Math.random() * 90)}m)`,
        meta: "listeners: 5",
        latency: "0.18ms",
      };
      setSocketsLogs((prev) => [newLog, ...prev.slice(0, 5)]);
    } else {
      const newLog: StreamLog = {
        id: `a-${Date.now()}`,
        time: timeStr,
        type: "ast",
        tag: "AST-TRANS",
        message: "AST syntax node generated: <DataGrid cols={3} />",
        meta: "deterministic",
        latency: "0.9ms",
      };
      setAstLogs((prev) => [newLog, ...prev.slice(0, 5)]);
    }

    setTimeout(() => setIsSimulating(false), 400);
  };

  const handleReset = () => {
    setKafkaLogs(initialKafkaLogs);
    setSocketsLogs(initialSocketsLogs);
    setAstLogs(initialAstLogs);
  };

  return (
    <section
      aria-labelledby="workbench-heading"
      className="w-full rounded-[28px] sm:rounded-[32px] bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] p-5 sm:p-7 lg:p-8 space-y-6 shadow-sm overflow-hidden"
    >
      {/* Workbench Header & Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
              Interactive Systems & Design Workbench
            </span>
          </div>
          <h2 id="workbench-heading" className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Explore the dual discipline live
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            Test the real-time event streaming pipeline, inspect vector design studies, or compare architectural latency tradeoffs.
          </p>
        </div>

        {/* Mode Selector Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--surface-tile)] border border-[var(--border-subtle)] shrink-0 self-start md:self-auto">
          <button
            onClick={() => setMode("systems")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              mode === "systems"
                ? "bg-[var(--text-primary)] text-[var(--bg-canvas)] shadow-xs"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" aria-hidden="true" />
            <span>01 // Systems Engine</span>
          </button>

          <button
            onClick={() => setMode("visual")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              mode === "visual"
                ? "bg-[var(--text-primary)] text-[var(--bg-canvas)] shadow-xs"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Palette className="w-3.5 h-3.5" aria-hidden="true" />
            <span>02 // Visual Studio</span>
          </button>

          <button
            onClick={() => setMode("benchmarks")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              mode === "benchmarks"
                ? "bg-[var(--text-primary)] text-[var(--bg-canvas)] shadow-xs"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Zap className="w-3.5 h-3.5" aria-hidden="true" />
            <span>03 // Primitives</span>
          </button>
        </div>
      </div>

      {/* MODE 1: SYSTEMS ENGINE (STAGESHOW WINDOW) */}
      {mode === "systems" && (
        <div className="space-y-4">
          {/* Subtabs for Architecture */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setSystemsTab("kafka")}
                className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                  systemsTab === "kafka"
                    ? "bg-[var(--surface-tile)] border-[var(--text-primary)] text-[var(--text-primary)] font-semibold"
                    : "bg-transparent border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]"
                }`}
              >
                Kafka Outbox (StreamMart)
              </button>
              <button
                onClick={() => setSystemsTab("sockets")}
                className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                  systemsTab === "sockets"
                    ? "bg-[var(--surface-tile)] border-[var(--text-primary)] text-[var(--text-primary)] font-semibold"
                    : "bg-transparent border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]"
                }`}
              >
                WebSocket Fanout (Sportz)
              </button>
              <button
                onClick={() => setSystemsTab("ast")}
                className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                  systemsTab === "ast"
                    ? "bg-[var(--surface-tile)] border-[var(--text-primary)] text-[var(--text-primary)] font-semibold"
                    : "bg-transparent border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]"
                }`}
              >
                AST Parser (AppForge)
              </button>
            </div>

            {/* Live Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleEmitEvent}
                disabled={isSimulating}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[var(--text-primary)] text-[var(--bg-canvas)] text-xs font-medium hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-xs disabled:opacity-50"
              >
                <Play className={`w-3 h-3 ${isSimulating ? "animate-spin" : ""}`} aria-hidden="true" />
                <span>Emit Event</span>
              </button>
              <button
                onClick={handleReset}
                title="Reset simulation logs"
                className="p-1 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--border-hover)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Miniature Stageshow Stage */}
          <div className="w-full rounded-2xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--surface-tile)] shadow-inner">
            <Stage theme={stageshowTheme} fidelity="standard" width={920} height={380} className="w-full">
              {() => (
                <Window
                  title={
                    systemsTab === "kafka"
                      ? "stream-mart :: kafka-transactional-outbox-monitor"
                      : systemsTab === "sockets"
                      ? "sportz :: ws-room-dispatcher (in-memory)"
                      : "appforge :: deterministic-ast-pipeline"
                  }
                  toolbar={
                    <span className="text-[11px] font-mono font-bold text-emerald-500">
                      {isSimulating ? "EMITTING..." : "STREAMING ACTIVE"}
                    </span>
                  }
                  className="w-full h-full"
                >
                  <div className="p-4 sm:p-5 flex flex-col justify-between h-full space-y-4">
                    {/* Top Stats Strip */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-b border-[var(--border-subtle)] pb-3">
                      <div className="space-y-0.5">
                        <span className="text-[11px] text-[var(--text-tertiary)] uppercase font-mono">
                          {systemsTab === "kafka" ? "Topic Partition" : systemsTab === "sockets" ? "Active Room" : "AST Nodes"}
                        </span>
                        <p className="text-sm font-bold font-mono text-[var(--text-primary)]">
                          {systemsTab === "kafka" ? "orders.events (p2)" : systemsTab === "sockets" ? "match:402" : "4 Bounded Nodes"}
                        </p>
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-[11px] text-[var(--text-tertiary)] uppercase font-mono">
                          {systemsTab === "kafka" ? "Consumer Lag" : systemsTab === "sockets" ? "Connected" : "Schema Guard"}
                        </span>
                        <p className="text-sm font-bold font-mono text-emerald-500">
                          {systemsTab === "kafka" ? "0 msgs (real-time)" : systemsTab === "sockets" ? "4 listeners" : "Zod Strict Valid"}
                        </p>
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-[11px] text-[var(--text-tertiary)] uppercase font-mono">
                          Average Latency
                        </span>
                        <p className="text-sm font-bold font-mono text-[var(--text-primary)]">
                          {systemsTab === "kafka" ? "0.24 ms" : systemsTab === "sockets" ? "0.18 ms" : "1.1 ms"}
                        </p>
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-[11px] text-[var(--text-tertiary)] uppercase font-mono">
                          Integrity Guarantee
                        </span>
                        <p className="text-sm font-bold font-mono text-[var(--text-secondary)]">
                          {systemsTab === "kafka" ? "At-least-once ACID" : systemsTab === "sockets" ? "Sub-ms In-memory" : "Zero Eval()"}
                        </p>
                      </div>
                    </div>

                    {/* Middle: Live Event Log Stream */}
                    <div className="flex-1 space-y-2 overflow-hidden font-mono text-xs">
                      <div className="text-[11px] text-[var(--text-tertiary)] flex items-center justify-between pb-1">
                        <span>LIVE TRANSACTION STREAM</span>
                        <span>TIMEZONE: IST (LOCAL CLOCK)</span>
                      </div>

                      <div className="space-y-1.5 max-h-[170px] overflow-y-auto pr-1">
                        {(systemsTab === "kafka"
                          ? kafkaLogs
                          : systemsTab === "sockets"
                          ? socketsLogs
                          : astLogs
                        ).map((log) => (
                          <div
                            key={log.id}
                            className="flex items-center justify-between gap-3 p-2 rounded-lg bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] text-[12px] leading-tight"
                          >
                            <div className="flex items-center gap-2.5 truncate">
                              <span className="text-[var(--text-tertiary)] tabular-nums shrink-0">
                                {log.time}
                              </span>
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                                  log.tag.includes("PG") || log.tag.includes("AST")
                                    ? "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                                    : log.tag.includes("KAFKA") || log.tag.includes("FANOUT")
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                    : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                }`}
                              >
                                {log.tag}
                              </span>
                              <span className="text-[var(--text-primary)] truncate font-mono">
                                {log.message}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {log.meta && (
                                <span className="text-[11px] text-[var(--text-tertiary)] hidden sm:inline">
                                  {log.meta}
                                </span>
                              )}
                              {log.latency && (
                                <span className="text-[11px] text-emerald-500 font-bold tabular-nums">
                                  {log.latency}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Foot Note with Case Study Link */}
                    <div className="flex items-center justify-between border-t border-[var(--border-subtle)] pt-2.5 text-xs text-[var(--text-secondary)]">
                      <span className="text-[11px] text-[var(--text-tertiary)]">
                        {systemsTab === "kafka"
                          ? "Source: StreamMart production architecture"
                          : systemsTab === "sockets"
                          ? "Source: Sportz high-throughput WebSocket engine"
                          : "Source: AppForge AST component compiler"}
                      </span>
                      <Link
                        href={
                          systemsTab === "kafka"
                            ? "/work/stream-mart"
                            : systemsTab === "sockets"
                            ? "/work/sockets"
                            : "/work/appforge"
                        }
                        className="inline-flex items-center gap-1 font-semibold text-[var(--text-primary)] hover:underline"
                      >
                        <span>Read case study</span>
                        <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </Window>
              )}
            </Stage>
          </div>
        </div>
      )}

      {/* MODE 2: VISUAL STUDIO (VECTOR ARTWORK & CAMPUS DESIGN) */}
      {mode === "visual" && (
        <div className="space-y-4">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-[var(--text-tertiary)]">
              Digital vector studies & exhibition works (2023 – 2025)
            </span>
            <span className="text-xs text-[var(--text-secondary)] font-medium">
              Click artwork to inspect vector details
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left: Artwork Spotlight Window */}
            <div className="lg:col-span-8 rounded-2xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--surface-tile)]">
              <Stage theme={stageshowTheme} fidelity="standard" width={680} height={400} className="w-full">
                {() => (
                  <Window
                    title={`studio-canvas :: art-0${selectedArtwork + 1}.svg`}
                    toolbar={
                      <span className="text-[11px] font-mono text-emerald-500 font-bold">
                        VECTOR 100% SCALE
                      </span>
                    }
                    className="w-full h-full"
                  >
                    <div className="p-4 sm:p-5 flex flex-col h-full justify-between">
                      <div className="relative w-full flex-1 rounded-xl overflow-hidden bg-neutral-950 flex items-center justify-center border border-[var(--border-subtle)]">
                        <Image
                          src={`/art/art-0${selectedArtwork + 1}.svg`}
                          alt={`Digital vector study 0${selectedArtwork + 1} by Vipin Kaushik`}
                          fill
                          unoptimized
                          priority
                          className="object-contain p-4"
                        />
                        {/* Grid overlay lines */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
                      </div>

                      <div className="flex items-center justify-between pt-3 text-xs">
                        <span className="font-semibold text-[var(--text-primary)]">
                          {[
                            "Vector Flow & Axis",
                            "Topographic Contour",
                            "Isometric Monolith",
                            "Triangular Tension",
                            "Harmonic Cadence",
                            "Orbital Duality",
                          ][selectedArtwork]}
                        </span>
                        <span className="text-[var(--text-tertiary)] font-mono">
                          IIT Kharagpur Studio Archives
                        </span>
                      </div>
                    </div>
                  </Window>
                )}
              </Stage>
            </div>

            {/* Right: Selectable Artwork Palette */}
            <div className="lg:col-span-4 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <span className="text-xs font-semibold text-[var(--text-secondary)]">
                  Vector Studies
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[0, 1, 2, 3, 4, 5].map((idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedArtwork(idx)}
                      className={`relative aspect-square rounded-xl overflow-hidden border transition-all cursor-pointer ${
                        selectedArtwork === idx
                          ? "border-[var(--text-primary)] ring-2 ring-[var(--text-primary)]/20 scale-95"
                          : "border-[var(--border-subtle)] hover:border-[var(--border-hover)] opacity-75 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={`/art/art-0${idx + 1}.svg`}
                        alt={`Study thumbnail 0${idx + 1}`}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Campus Leadership Credentials */}
              <div className="p-3.5 rounded-xl bg-[var(--surface-tile)] border border-[var(--border-subtle)] space-y-2">
                <span className="text-[11px] font-semibold text-[var(--text-tertiary)] uppercase block">
                  Campus Design Leadership
                </span>
                <div className="space-y-1.5 text-xs text-[var(--text-secondary)]">
                  <div className="flex justify-between items-baseline">
                    <span className="font-medium text-[var(--text-primary)]">Manga & Anime Society</span>
                    <span className="text-[11px] text-[var(--text-tertiary)] font-mono">Head</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="font-medium text-[var(--text-primary)]">Illumination Magazine</span>
                    <span className="text-[11px] text-[var(--text-tertiary)] font-mono">Coordinator</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="font-medium text-[var(--text-primary)]">Inter-Hall Rangoli</span>
                    <span className="text-[11px] text-amber-500 font-mono">Silver & Bronze</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE 3: BENCHMARKS & PRIMITIVES */}
      {mode === "benchmarks" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-[var(--surface-tile)] border border-[var(--border-subtle)] space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-sky-500/10 text-sky-400 font-bold">
                  LOCAL MEMORY MAP
                </span>
                <span className="text-xs font-mono text-emerald-500 font-bold">0.18 ms</span>
              </div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">
                In-Memory WebSocket Rooms
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-normal">
                Single-node room lookups in plain JavaScript <code className="font-mono text-xs">Map&lt;string, Set&lt;Client&gt;&gt;</code> without Redis network hop overhead. Zero external dependency, sub-millisecond broadcast.
              </p>
            </div>
            <div className="pt-3 border-t border-[var(--border-subtle)] text-[11px] text-[var(--text-tertiary)] font-mono">
              Applied in: Sportz Sockets Engine
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--surface-tile)] border border-[var(--border-subtle)] space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/10 text-emerald-400 font-bold">
                  TRANSACTIONAL OUTBOX
                </span>
                <span className="text-xs font-mono text-emerald-500 font-bold">ACID Guarantee</span>
              </div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">
                Durable Kafka Event Logs
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-normal">
                Writing orders and events into PostgreSQL in the same database transaction. Debezium CDC pushes to Kafka topic partitions, eliminating 2-phase commit and dual-write anomalies.
              </p>
            </div>
            <div className="pt-3 border-t border-[var(--border-subtle)] text-[11px] text-[var(--text-tertiary)] font-mono">
              Applied in: StreamMart E-Commerce
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--surface-tile)] border border-[var(--border-subtle)] space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-amber-500/10 text-amber-400 font-bold">
                  DETERMINISTIC AST
                </span>
                <span className="text-xs font-mono text-emerald-500 font-bold">Zero Eval()</span>
              </div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">
                Compiler AST Constraints
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-normal">
                Compiler pipeline that parses generative AI output through rigorous JSON Schema and Babel AST validators before building React components. Eliminates arbitrary code execution risk.
              </p>
            </div>
            <div className="pt-3 border-t border-[var(--border-subtle)] text-[11px] text-[var(--text-tertiary)] font-mono">
              Applied in: AppForge App Builder
            </div>
          </div>
        </div>
      )}
    </section>
  );
}