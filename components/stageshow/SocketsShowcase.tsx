"use client";

import { Stage, Window, Chart, type Act } from "./kit";
import { useTheme } from "@/components/motion/ThemeProvider";
import "./sockets-showcase.css";

interface LogItem {
  time: string;
  tag: "upgrade" | "client" | "sub" | "db" | "bcast" | "ping";
  label: string;
  msg: string;
  meta?: string;
  latency?: string;
}

interface SocketsState {
  activeSockets: number;
  msgsPerSec: number;
  avgLatency: string;
  latencyPoints: number[];
  logs: LogItem[];
  subscribed: boolean;
  fanoutActive: boolean;
  subscribedClients: number;
}

const initialLogs: LogItem[] = [
  {
    time: "17:42:00.104",
    tag: "upgrade",
    label: "UPGRADE",
    msg: "GET /ws?all=1 -> Arcjet: ALLOWED (200)",
  },
  {
    time: "17:42:00.108",
    tag: "client",
    label: "CLIENT",
    msg: "Handshake verified: 192.168.1.10",
    meta: "c_102",
  },
];

const posterLogs: LogItem[] = [
  {
    time: "17:42:00.104",
    tag: "upgrade",
    label: "UPGRADE",
    msg: "GET /ws?all=1 -> Arcjet: ALLOWED (200)",
  },
  {
    time: "17:42:00.108",
    tag: "client",
    label: "CLIENT",
    msg: "Handshake verified: 192.168.1.10",
    meta: "c_102",
  },
  {
    time: "17:42:00.820",
    tag: "sub",
    label: "SUB",
    msg: "Client c_102 joined channel match:402 (Arsenal vs Chelsea)",
  },
  {
    time: "17:42:01.350",
    tag: "db",
    label: "DB-PG",
    msg: "Supabase transaction committed: goal_event on match:402",
  },
  {
    time: "17:42:01.351",
    tag: "bcast",
    label: "BCAST",
    msg: "Fanout to 4 match:402 listeners",
    meta: "payload: 142B",
    latency: "0.6ms",
  },
  {
    time: "17:42:03.000",
    tag: "ping",
    label: "PING",
    msg: "30s heartbeat sweep: 4/4 clients alive",
    latency: "<1ms",
  },
];

const INITIAL: SocketsState = {
  activeSockets: 2,
  msgsPerSec: 48,
  avgLatency: "0.8ms",
  latencyPoints: [14, 18, 12, 22, 16, 20, 15],
  logs: initialLogs,
  subscribed: false,
  fanoutActive: false,
  subscribedClients: 2,
};

const POSTER: SocketsState = {
  activeSockets: 4,
  msgsPerSec: 240,
  avgLatency: "0.6ms",
  latencyPoints: [14, 18, 12, 22, 16, 20, 15, 26, 18, 12, 14, 11],
  logs: posterLogs,
  subscribed: true,
  fanoutActive: true,
  subscribedClients: 4,
};

async function script(a: Act<SocketsState>) {
  await a.wait(700);

  // Beat 1: Client upgrade & connection
  await a.set((s) => ({
    ...s,
    activeSockets: 3,
    logs: [
      ...s.logs,
      {
        time: "17:42:00.820",
        tag: "sub",
        label: "SUB",
        msg: "Client c_102 joined channel match:402 (Arsenal vs Chelsea)",
      },
    ],
    subscribed: true,
    subscribedClients: 3,
  }));
  await a.wait(800);

  // Beat 2: Database transaction committed
  await a.set((s) => ({
    ...s,
    logs: [
      ...s.logs,
      {
        time: "17:42:01.350",
        tag: "db",
        label: "DB-PG",
        msg: "Supabase transaction committed: goal_event on match:402",
      },
    ],
  }));
  await a.wait(400);

  // Beat 3: Targeted broadcast fanout
  await a.set((s) => ({
    ...s,
    fanoutActive: true,
    activeSockets: 4,
    subscribedClients: 4,
    msgsPerSec: 240,
    avgLatency: "0.6ms",
    latencyPoints: [14, 18, 12, 22, 16, 20, 15, 26, 18, 12, 14, 11],
    logs: [
      ...s.logs,
      {
        time: "17:42:01.351",
        tag: "bcast",
        label: "BCAST",
        msg: "Fanout to 4 match:402 listeners",
        meta: "payload: 142B",
        latency: "0.6ms",
      },
    ],
  }));
  await a.wait(1200);

  // Beat 4: Heartbeat ping/pong check
  await a.set((s) => ({
    ...s,
    fanoutActive: false,
    logs: [
      ...s.logs,
      {
        time: "17:42:03.000",
        tag: "ping",
        label: "PING",
        msg: "30s heartbeat sweep: 4/4 clients alive",
        latency: "<1ms",
      },
    ],
  }));

  // Hold at rest for 3200ms so the viewer can read the completed stream
  await a.wait(3200);

  // Loop reset
  await a.set(INITIAL);
}

export function SocketsShowcase() {
  const { theme } = useTheme();
  const stageTheme = theme === "light" ? "light" : "dark";

  return (
    <div className="w-full rounded-[24px] overflow-hidden border border-[var(--border-subtle)] bg-[var(--surface-tile-elevated)] shadow-md">
      <Stage<SocketsState>
        width={920}
        height={440}
        compact={{ below: 768, width: 358, height: 490 }}
        theme={stageTheme}
        initial={INITIAL}
        poster={POSTER}
        script={script}
        className="ss-ws-stage"
      >
        {(s, _rect, layout) => (
          <Window
            url="sportz-rho.vercel.app"
            nav
            className="ss-ws-window"
          >
            <div className="ss-ws-grid" data-layout={layout}>
              {/* Left Column: Streaming Terminal */}
              <div className="ss-ws-terminal-col" data-target="terminal">
                <div className="ss-ws-term-header">
                  <div className="ss-ws-term-title">
                    sportz-websockets — node src/index.js
                  </div>
                  <div className="ss-ws-term-badge">
                    <span className="ss-ws-pulse" />
                    <span>ws://localhost:8080/ws</span>
                  </div>
                </div>

                <div className="ss-ws-term-body">
                  {s.logs.slice(-6).map((log, idx) => (
                    <div key={idx} className="ss-ws-log-line">
                      <span className="ss-ws-log-time">{log.time}</span>
                      <span className={`ss-ws-tag ss-ws-tag-${log.tag}`}>
                        {log.label}
                      </span>
                      <span className="ss-ws-log-msg">{log.msg}</span>
                      {log.meta && (
                        <span className="ss-ws-log-meta">[{log.meta}]</span>
                      )}
                      {log.latency && (
                        <span className="ss-ws-log-latency">
                          ⚡ {log.latency}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Telemetry Dashboard & Sparkline */}
              <div className="ss-ws-dash-col" data-target="dashboard">
                <div className="ss-ws-dash-head">
                  <div className="ss-ws-dash-title">Telemetry & Health</div>
                  <div className="ss-ws-dash-arcjet">Arcjet Protected</div>
                </div>

                <div className="ss-ws-stats-grid">
                  <div className="ss-ws-stat-card">
                    <span className="ss-ws-stat-label">Sockets</span>
                    <span className="ss-ws-stat-val">
                      {s.activeSockets}
                      <span className="ss-ws-stat-unit">conn</span>
                    </span>
                  </div>
                  <div className="ss-ws-stat-card">
                    <span className="ss-ws-stat-label">Rate</span>
                    <span className="ss-ws-stat-val">
                      {s.msgsPerSec}
                      <span className="ss-ws-stat-unit">msg/s</span>
                    </span>
                  </div>
                  <div className="ss-ws-stat-card">
                    <span className="ss-ws-stat-label">Latency</span>
                    <span className="ss-ws-stat-val">{s.avgLatency}</span>
                  </div>
                </div>

                <div className="ss-ws-chart-wrap">
                  <div className="ss-ws-chart-head">
                    <span>Broadcast Latency Distribution</span>
                    <span className="ss-ws-chart-now">{s.avgLatency}</span>
                  </div>
                  <Chart
                    data={s.latencyPoints}
                    kind="line"
                    width={layout === "compact" ? 300 : 270}
                    height={46}
                    area
                    dot
                  />
                </div>

                <div className="ss-ws-channel-card">
                  <div className="ss-ws-chan-info">
                    <span className="ss-ws-chan-name">
                      #match-402 · Arsenal vs Chelsea
                    </span>
                    <span className="ss-ws-chan-sub">
                      {s.subscribedClients} listeners subscribed to topic
                    </span>
                  </div>
                  <span className="ss-ws-chan-badge">
                    {s.fanoutActive ? "BROADCASTING" : "LISTENING"}
                  </span>
                </div>
              </div>
            </div>
          </Window>
        )}
      </Stage>
    </div>
  );
}
