"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Stage, Window } from "@/components/stageshow/kit";
import { useTheme } from "@/components/motion/ThemeProvider";
import { TransitionLink } from "@/components/motion/RouteTransition";

interface Milestone {
  id: string;
  year: string;
  title: string;
  stage: string;
  description: string;
  keyArtifact: string;
  artifactTitle: string;
  terminalLines?: { prompt?: string; text: string; color?: string }[];
  projectLinks?: {
    label: string;
    href: string;
  }[];
}

const milestones: Milestone[] = [
  {
    id: "kgp-start",
    year: "2022",
    stage: "Joined IIT KGP",
    title: "Joining IIT Kharagpur",
    description:
      "Started the B.Tech + M.Tech dual degree in chemical engineering. Wrote my first real programs for numerical simulations, and started doing design for campus groups.",
    keyArtifact: "terminal",
    artifactTitle: "terminal :: iitkgp-hpc-node01",
    terminalLines: [
      { prompt: "vipin@kgp:~$", text: "g++ -O3 sim_transport.cpp -o sim" },
      { text: "[build] compiled with zero warnings (3.2ms)", color: "text-emerald-700 dark:text-emerald-400 font-medium" },
      { prompt: "vipin@kgp:~$", text: "./sim --nodes 1024 --iterations 50000" },
      { text: "[sim] memory allocated: 12.4 MB | runtime: 184ms", color: "text-[var(--text-secondary)]" },
      { text: "Convergence achieved: tolerance < 1e-6", color: "text-emerald-700 dark:text-emerald-400 font-medium" },
    ],
  },
  {
    id: "campus-design",
    year: "2023 to 2024",
    stage: "Campus design",
    title: "Design for campus publications",
    description:
      "Led design for the Manga & Anime Society and coordinated design for Illumination Magazine. I also worked on the Chemical Engineering Association's web and design team, and won bronze (2023) and silver (2024) at the inter-hall rangoli competition.",
    keyArtifact: "design",
    artifactTitle: "studio :: illumination-magazine-issue4",
    terminalLines: [
      { prompt: "studio >", text: "grid: 12-column modular, gutter: 16px" },
      { text: "Typography: Cabinet Grotesk (800) + Inter Display", color: "text-amber-800 dark:text-amber-300 font-medium" },
      { text: "Vectors: 6 custom editorial spreads exported to SVG", color: "text-[var(--text-secondary)]" },
      { text: "Exhibition: Inter-Hall Rangoli (Silver Medalist 2024)", color: "text-emerald-700 dark:text-emerald-400 font-medium" },
    ],
  },
  {
    id: "frontend-unnati-sportz",
    year: "2025",
    stage: "First internship",
    title: "Unnati and Sportz",
    description:
      "Interned at Unnati, building an admin dashboard and a component library. Built Sportz, a WebSocket server that pushes live scores to everyone watching a match.",
    keyArtifact: "sockets",
    artifactTitle: "sportz :: ws-room-monitor",
    projectLinks: [
      {
        label: "Sportz case study",
        href: "/work/sockets",
      },
    ],
    terminalLines: [
      { prompt: "ws-server >", text: "listening on 0.0.0.0:8080 (raw ws)" },
      { text: "[upgrade] client c_102 connected (TLS handshake 0.3ms)", color: "text-sky-800 dark:text-sky-300 font-medium" },
      { text: "[room] joined 'match:402' -> active room listeners: 4", color: "text-emerald-700 dark:text-emerald-400 font-medium" },
      { text: "[fanout] broadcasted score event (payload 142B, sub-ms tick)", color: "text-amber-800 dark:text-amber-300 font-medium" },
    ],
  },
  {
    id: "fullstack-clairvyn-appforge",
    year: "2026",
    stage: "Clairvyn & StreamMart",
    title: "Clairvyn AI, StreamMart and AppForge",
    description:
      "Interned at Clairvyn AI on their Next.js app, payments and deploys. Built StreamMart, which uses a transactional outbox to publish order events to Kafka, and AppForge, which turns model output into React components without eval().",
    keyArtifact: "distributed",
    artifactTitle: "stream-mart :: kafka-outbox-broker",
    projectLinks: [
      {
        label: "StreamMart case study",
        href: "/work/stream-mart",
      },
      {
        label: "AppForge case study",
        href: "/work/appforge",
      },
    ],
    terminalLines: [
      { prompt: "outbox >", text: "PostgreSQL ACID txn: order + outbox inserted" },
      { text: "[cdc] Debezium tailing WAL -> topic: orders.events", color: "text-sky-800 dark:text-sky-300 font-medium" },
      { text: "[kafka] partition 2 committed offset 49201", color: "text-emerald-700 dark:text-emerald-400 font-medium" },
      { text: "[appforge] prompt token stream -> AST validated (0 eval)", color: "text-amber-800 dark:text-amber-300 font-medium" },
    ],
  },
  {
    id: "current-focus",
    year: "Now",
    stage: "Now",
    title: "Kafka and Kubernetes",
    description:
      "Learning how Kafka partitioning and consumer group rebalancing behave under load, and how to run services on Kubernetes.",
    keyArtifact: "k8s",
    artifactTitle: "cluster :: distributed-orchestration",
    terminalLines: [
      { prompt: "kubectl >", text: "get pods -n backend-services -o wide" },
      { text: "order-svc-pod-7d4b    Running   0 restarts   ready: 3/3", color: "text-emerald-700 dark:text-emerald-400 font-medium" },
      { text: "kafka-broker-node-0    Running   0 restarts   partitions: 12", color: "text-sky-800 dark:text-sky-300 font-medium" },
      { text: "payment-consumer-pod   Running   0 restarts   lag: 0 msgs", color: "text-emerald-700 dark:text-emerald-400 font-medium" },
    ],
  },
];

export function AboutTimeline() {
  const { theme } = useTheme();
  const stageshowTheme = theme === "dark" ? "dark" : "light";
  const [activeId, setActiveId] = useState<string>("fullstack-clairvyn-appforge");

  const currentMilestone = milestones.find((m) => m.id === activeId) || milestones[3];

  return (
    <section
      aria-labelledby="timeline-heading"
      className="w-full space-y-6"
      style={{ contentVisibility: "auto", containIntrinsicSize: "auto 700px" }}
    >
      <div className="pb-2">
        <h2 id="timeline-heading" className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          How I got here
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
          From chemical engineering to backend work.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2" role="tablist" aria-label="Career milestones">
        {milestones.map((m) => {
          const isActive = m.id === activeId;
          return (
            <button
              key={m.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveId(m.id)}
              className={`p-3 rounded-xl text-left transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 ${
                isActive
                  ? "bg-[var(--surface-tile-elevated)] ring-1 ring-[var(--text-primary)]"
                  : "bg-[var(--surface-tile)] hover:bg-[var(--surface-tile-hover)] opacity-85 hover:opacity-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold tabular-nums text-[var(--text-tertiary)] block">
                  {m.year}
                </span>
              </div>
              <span
                className={`text-sm sm:text-base font-semibold truncate block mt-1 ${
                  isActive ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"
                }`}
              >
                {m.stage}
              </span>
            </button>
          );
        })}
      </div>

      <article className="p-6 sm:p-8 rounded-2xl bg-[var(--surface-tile)] space-y-6 motion-safe:animate-fadeIn">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 space-y-4">
            <div className="space-y-1.5">
              <div>
                <span className="px-2.5 py-1 rounded text-xs bg-[var(--surface-tile-hover)] border border-[var(--border-subtle)] text-[var(--text-tertiary)]">
                  {currentMilestone.year} · {currentMilestone.stage}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mt-1.5">
                {currentMilestone.title}
              </h3>
            </div>

            <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed font-normal">
              {currentMilestone.description}
            </p>

            {currentMilestone.projectLinks && currentMilestone.projectLinks.length > 0 && (
              <div className="pt-2 flex items-center gap-3 flex-wrap">
                {currentMilestone.projectLinks.map((link) => (
                  <TransitionLink
                    key={link.href}
                    href={link.href}
                    trackLocation="about_timeline"
                    trackLabel={link.label}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[var(--surface-tile-hover)] hover:bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] text-[var(--text-primary)] transition-colors active:scale-98"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[var(--text-tertiary)]" aria-hidden="true" />
                  </TransitionLink>
                ))}
              </div>
            )}
          </div>

          <div data-ui className="lg:col-span-5 rounded-xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--surface-tile-elevated)]">
            <Stage theme={stageshowTheme} fidelity="standard" width={420} height={220} className="w-full">
              {() => (
                <Window
                  title={currentMilestone.artifactTitle}
                  className="w-full h-full"
                >
                  <pre className="p-3.5 h-full flex flex-col justify-start font-mono text-xs leading-relaxed overflow-hidden">
                    <div className="space-y-1.5 font-mono">
                      {currentMilestone.terminalLines?.map((line, idx) => (
                        <div key={idx} className="space-y-0.5">
                          {line.prompt && (
                            <span className="text-[var(--text-tertiary)] block">
                              {line.prompt}{" "}
                              <span className="text-[var(--text-primary)] font-semibold">{line.text}</span>
                            </span>
                          )}
                          {!line.prompt && (
                            <span className={`block truncate ${line.color || "text-[var(--text-secondary)]"}`}>
                              {line.text}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </pre>
                </Window>
              )}
            </Stage>
          </div>
        </div>
      </article>

      <ol className="sr-only">
        {milestones.map((m) => (
          <li key={m.id}>
            <h4>
              {m.year}: {m.title} ({m.stage})
            </h4>
            <p>{m.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
