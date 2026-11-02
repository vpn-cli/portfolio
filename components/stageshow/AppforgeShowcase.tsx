"use client";

import { Stage, Window, type Act } from "./kit";
import { useTheme } from "@/components/motion/ThemeProvider";
import "./appforge-showcase.css";

interface KanbanCard {
  title: string;
  tag: string;
  points: string;
}

interface KanbanCol {
  id: string;
  name: string;
  count: number;
  cards: KanbanCard[];
}

interface AppforgeState {
  status: "COMPILING" | "LIVE_AST";
  inferenceTime: string;
  cacheSaved: string;
  ddlTables: string;
  columns: KanbanCol[];
}

const INITIAL: AppforgeState = {
  status: "COMPILING",
  inferenceTime: "Compiling...",
  cacheSaved: "Checking Redis...",
  ddlTables: "Generating DDL...",
  columns: [
    {
      id: "backlog",
      name: "Sprint Backlog",
      count: 2,
      cards: [
        { title: "Kafka Event Consumer", tag: "Backend", points: "5 pts" },
        { title: "Semantic Cache Invalidation", tag: "Redis", points: "3 pts" },
      ],
    },
    {
      id: "in-flight",
      name: "In Flight",
      count: 1,
      cards: [
        { title: "Groq LPU Inference Router", tag: "LLM", points: "8 pts" },
      ],
    },
    {
      id: "deployed",
      name: "Live Deployed",
      count: 1,
      cards: [
        { title: "Clerk Edge Middleware", tag: "Security", points: "3 pts" },
      ],
    },
  ],
};

const POSTER: AppforgeState = {
  status: "LIVE_AST",
  inferenceTime: "1.18s (Groq LPU)",
  cacheSaved: "Active (Redis)",
  ddlTables: "3 Tables Synced",
  columns: [
    {
      id: "backlog",
      name: "Sprint Backlog",
      count: 3,
      cards: [
        { title: "Kafka Event Streamer", tag: "Backend", points: "5 pts" },
        { title: "AST Schema Validator", tag: "Core", points: "3 pts" },
      ],
    },
    {
      id: "in-flight",
      name: "In Flight",
      count: 2,
      cards: [
        { title: "Groq LPU Inference Router", tag: "LLM", points: "8 pts" },
        { title: "Upstash Redis Cache Hook", tag: "Redis", points: "5 pts" },
      ],
    },
    {
      id: "deployed",
      name: "Live Deployed",
      count: 4,
      cards: [
        { title: "Clerk Edge Middleware", tag: "Security", points: "3 pts" },
        { title: "Dynamic Postgres DDL Sync", tag: "Database", points: "8 pts" },
      ],
    },
  ],
};

async function script(a: Act<AppforgeState>) {
  await a.wait(700);

  // Beat 1: Groq inference compiles AST
  await a.set((s) => ({
    ...s,
    inferenceTime: "1.18s (Groq LPU)",
    ddlTables: "Generating DDL Schema...",
  }));
  await a.wait(800);

  // Beat 2: Upstash Redis semantic cache hit
  await a.set((s) => ({
    ...s,
    cacheSaved: "Cache Hit (Upstash)",
    ddlTables: "Applying runtime DDL on Supabase...",
  }));
  await a.wait(700);

  // Beat 3: Live AST Dynamic DOM Hydration
  await a.set(POSTER);

  // Hold at rest
  await a.wait(3500);

  // Reset
  await a.set(INITIAL);
}

export function AppforgeShowcase() {
  const { theme } = useTheme();
  const stageTheme = theme === "light" ? "light" : "dark";

  return (
    <div className="w-full rounded-[var(--card-radius)] overflow-hidden border border-[var(--border-subtle)] bg-[var(--surface-tile-elevated)] shadow-md">
      <Stage<AppforgeState>
        width={920}
        height={440}
        compact={{ below: 768, width: 358, height: 490 }}
        theme={stageTheme}
        initial={INITIAL}
        poster={POSTER}
        script={script}
        className="ss-app-stage"
      >
        {(state, _rect, layout) => (
          <Window
            title="AppForge Runtime Studio"
            url="appforge.dev/workspace/kanban"
            urlShape="pill"
            className="ss-app-window"
          >
            <div className="ss-app-layout" data-layout={layout}>
              {/* Prompt Bar */}
              <div className="ss-app-prompt-bar">
                <div className="ss-app-prompt-text">
                  <span>Prompt:</span>
                  <span className="text-[var(--text-secondary)]">
                    &quot;Sprint Kanban with Postgres DDL &amp; live sync&quot;
                  </span>
                </div>
                <div className="ss-app-prompt-pill">
                  <span>Status:</span>
                  <span className="text-[var(--text-primary)] font-semibold">
                    {state.status}
                  </span>
                </div>
              </div>

              {/* Telemetry Strip */}
              <div className="ss-app-telemetry">
                <div>
                  <span>Inference: </span>
                  <span className="ss-app-tele-val">{state.inferenceTime}</span>
                </div>
                <div>
                  <span>Semantic Cache: </span>
                  <span className="ss-app-tele-val">{state.cacheSaved}</span>
                </div>
                <div>
                  <span>Postgres State: </span>
                  <span className="ss-app-tele-val">{state.ddlTables}</span>
                </div>
              </div>

              {/* Kanban Columns */}
              <div className="ss-app-board">
                {state.columns.map((col) => (
                  <div key={col.id} className="ss-app-col">
                    <div className="ss-app-col-head">
                      <span>{col.name}</span>
                      <span>({col.count})</span>
                    </div>

                    {col.cards.map((card, i) => (
                      <div key={i} className="ss-app-card">
                        <span className="ss-app-card-title">{card.title}</span>
                        <div className="ss-app-card-meta">
                          <span>{card.tag}</span>
                          <span>{card.points}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </Window>
        )}
      </Stage>
    </div>
  );
}
