"use client";

import { Stage, Window, type Act } from "./kit";
import { useTheme } from "@/components/motion/ThemeProvider";
import "./llms-txt-showcase.css";

interface HeuristicItem {
  name: string;
  score: string;
}

interface LlmsTxtState {
  status: "ANALYZING" | "VERIFIED";
  httpStatus: string;
  spaCheck: string;
  astSections: string;
  streamSafety: string;
  aeoScore: string;
  heuristics: HeuristicItem[];
  logMsg: string;
}

const INITIAL: LlmsTxtState = {
  status: "ANALYZING",
  httpStatus: "200 OK (Checking DOM)",
  spaCheck: "Diffing SPA root signatures...",
  astSections: "Parsing Markdown AST...",
  streamSafety: "0.8 MB buffered",
  aeoScore: "Calc...",
  heuristics: [
    { name: "Source Attribution", score: "..." },
    { name: "Hierarchy Structure", score: "..." },
    { name: "Machine Readability", score: "..." },
    { name: "Token Density", score: "..." },
  ],
  logMsg: "Connecting to target host via p-limit crawler...",
};

const POSTER: LlmsTxtState = {
  status: "VERIFIED",
  httpStatus: "200 OK (Verified text/markdown)",
  spaCheck: "Passed (Zero SPA false-positives)",
  astSections: "14 AST Sections (remark-parse)",
  streamSafety: "1.2 MB / 5.0 MB safe buffer",
  aeoScore: "9.4 / 10",
  heuristics: [
    { name: "Source Attribution", score: "10/10" },
    { name: "Hierarchy Structure", score: "10/10" },
    { name: "Machine Readability", score: "9/10" },
    { name: "Token Density", score: "9/10" },
  ],
  logMsg: "AEO Audit Complete: 42/42 links verified in 450ms.",
};

async function script(a: Act<LlmsTxtState>) {
  await a.wait(700);

  // Beat 1: HTTP & Soft-404 check
  await a.set((s) => ({
    ...s,
    httpStatus: "200 OK (text/markdown verified)",
    spaCheck: "Passed (Nonexistent route check negative)",
    logMsg: "Cheerio DOM analysis confirmed genuine markdown payload.",
  }));
  await a.wait(800);

  // Beat 2: AST Parser validation
  await a.set((s) => ({
    ...s,
    astSections: "14 Sections · 42 links (unified AST)",
    streamSafety: "1.2 MB / 5.0 MB safe buffer",
    logMsg: "remark-parse syntax tree validated hierarchy without regex.",
  }));
  await a.wait(700);

  // Beat 3: Heuristics scoring
  await a.set((s) => ({
    ...s,
    heuristics: [
      { name: "Source Attribution", score: "10/10" },
      { name: "Hierarchy Structure", score: "10/10" },
      { name: "Machine Readability", score: "9/10" },
      { name: "Token Density", score: "9/10" },
    ],
    logMsg: "Computing 10-point Answer Engine Optimization heuristic...",
  }));
  await a.wait(600);

  // Beat 4: Final verification payoff
  await a.set(POSTER);

  // Hold for viewer to read results
  await a.wait(3500);

  // Reset
  await a.set(INITIAL);
}

export function LlmsTxtShowcase() {
  const { theme } = useTheme();
  const stageTheme = theme === "light" ? "light" : "dark";

  return (
    <div className="w-full rounded-[var(--card-radius)] overflow-hidden border border-[var(--border-subtle)] bg-[var(--surface-tile-elevated)] shadow-md">
      <Stage<LlmsTxtState>
        width={920}
        height={440}
        compact={{ below: 768, width: 358, height: 490 }}
        theme={stageTheme}
        initial={INITIAL}
        poster={POSTER}
        script={script}
        className="ss-llm-stage"
      >
        {(state, _rect, layout) => (
          <Window
            title="llms.txt Crawler & AEO Validator"
            url="llmstxt.dev/audit?target=docs.cloud.dev/llms.txt"
            urlShape="pill"
            className="ss-llm-window"
          >
            <div className="ss-llm-grid" data-layout={layout}>
              {/* Left Column: Crawler Pipeline */}
              <div className="ss-llm-pipe-col">
                <div className="ss-llm-header">
                  <span className="ss-llm-title">Crawler AST Engine</span>
                  <div className="ss-llm-badge">
                    <span className="ss-llm-pulse" />
                    <span>{state.status}</span>
                  </div>
                </div>

                <div className="ss-llm-body">
                  <div className="ss-llm-item">
                    <span className="ss-llm-item-label">HTTP Resolution</span>
                    <span className="ss-llm-item-val">{state.httpStatus}</span>
                  </div>

                  <div className="ss-llm-item">
                    <span className="ss-llm-item-label">Soft-404 Detection</span>
                    <span className="ss-llm-item-val">{state.spaCheck}</span>
                  </div>

                  <div className="ss-llm-item">
                    <span className="ss-llm-item-label">AST Verification</span>
                    <span className="ss-llm-item-val">{state.astSections}</span>
                  </div>

                  <div className="ss-llm-item">
                    <span className="ss-llm-item-label">Crawler Memory Limit</span>
                    <span className="ss-llm-item-val">{state.streamSafety}</span>
                  </div>

                  <div className="mt-2 text-xs text-[var(--text-secondary)] font-mono">
                    &gt; {state.logMsg}
                  </div>
                </div>
              </div>

              {/* Right Column: AEO Score Matrix */}
              <div className="ss-llm-score-col">
                <div className="ss-llm-score-card">
                  <div>
                    <span className="text-xs font-medium text-[var(--text-secondary)] block">
                      AEO Quality Score
                    </span>
                    <span className="ss-llm-score-tag">
                      Answer Engine Optimized
                    </span>
                  </div>
                  <div className="ss-llm-score-num">{state.aeoScore}</div>
                </div>

                <div className="ss-llm-heuristics">
                  {state.heuristics.map((h) => (
                    <div key={h.name} className="ss-llm-h-row">
                      <span>{h.name}</span>
                      <span className="ss-llm-h-score">{h.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Window>
        )}
      </Stage>
    </div>
  );
}
