"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Stage, Window } from "@/components/stageshow/kit";
import { useTheme } from "@/components/motion/ThemeProvider";

interface Milestone {
  id: string;
  year: string;
  title: string;
  stage: string;
  badge: string;
  description: string;
  keyArtifact: string;
  artifactTitle: string;
  terminalLines?: { prompt?: string; text: string; color?: string }[];
  projectLinks?: {
    label: string;
    href: string;
    note?: string;
  }[];
}

const milestones: Milestone[] = [
  {
    id: "kgp-start",
    year: "2022",
    stage: "Foundation",
    badge: "IIT Kharagpur",
    title: "IIT Kharagpur Entry & Systems Foundations",
    description:
      "Admitted to IIT Kharagpur for the B.Tech + M.Tech Dual Degree in Chemical Engineering. Began writing software for numerical modeling and discovering visual design principles.",
    keyArtifact: "terminal",
    artifactTitle: "terminal :: iitkgp-hpc-node01",
    terminalLines: [
      { prompt: "vipin@kgp:~$", text: "g++ -O3 sim_transport.cpp -o sim" },
      { text: "[build] compiled with zero warnings (3.2ms)", color: "text-emerald-500" },
      { prompt: "vipin@kgp:~$", text: "./sim --nodes 1024 --iterations 50000" },
      { text: "[sim] memory allocated: 12.4 MB | runtime: 184ms", color: "text-[var(--text-secondary)]" },
      { text: "Convergence achieved: tolerance < 1e-6", color: "text-emerald-500" },
    ],
  },
  {
    id: "campus-design",
    year: "2023 to 2024",
    stage: "Visual Craft",
    badge: "Design Direction",
    title: "Campus Design Leadership & Publication Direction",
    description:
      "Led design teams across campus student publications and societies: Manga & Anime Society (Head), Illumination Magazine (Coordinator), and ChemEA. Won Silver & Bronze Medals in Inter-Hall Rangoli competitions.",
    keyArtifact: "design",
    artifactTitle: "studio :: illumination-magazine-issue4",
    terminalLines: [
      { prompt: "studio >", text: "grid: 12-column modular, gutter: 16px" },
      { text: "Typography: Cabinet Grotesk (800) + Inter Display", color: "text-amber-500" },
      { text: "Vectors: 6 custom editorial spreads exported to SVG", color: "text-[var(--text-secondary)]" },
      { text: "Exhibition: Inter-Hall Rangoli (Silver Medalist 2024)", color: "text-emerald-500" },
    ],
  },
  {
    id: "frontend-unnati-sportz",
    year: "2025",
    stage: "Real-Time & UI",
    badge: "Unnati & Sportz",
    title: "Unnati Internship & Sportz Sockets Engine",
    description:
      "Frontend engineering internship at Unnati building an SME onboarding dashboard and design system (WCAG 2.1 AA). Engineered Sportz, a push-based sports broadcasting server over raw WebSockets with in-memory room dispatching.",
    keyArtifact: "sockets",
    artifactTitle: "sportz :: ws-room-monitor",
    projectLinks: [
      {
        label: "Sportz Case Study",
        href: "/work/sockets",
      },
    ],
    terminalLines: [
      { prompt: "ws-server >", text: "listening on 0.0.0.0:8080 (raw ws)" },
      { text: "[upgrade] client c_102 connected (TLS handshake 0.3ms)", color: "text-sky-400" },
      { text: "[room] joined 'match:402' -> active room listeners: 4", color: "text-emerald-500" },
      { text: "[fanout] broadcasted score event (payload 142B, sub-ms tick)", color: "text-amber-400" },
    ],
  },
  {
    id: "fullstack-clairvyn-appforge",
    year: "2026",
    stage: "Distributed Systems",
    badge: "Clairvyn & StreamMart",
    title: "Clairvyn AI Internship + StreamMart & AppForge",
    description:
      "Full-stack internship at Clairvyn AI: built Next.js UI panels, Paytm subscription paywall, and Docker deploys to AWS EC2. Built StreamMart with Kafka transactional outbox and AppForge with deterministic AST compiler transforms.",
    keyArtifact: "distributed",
    artifactTitle: "stream-mart :: kafka-outbox-broker",
    projectLinks: [
      {
        label: "StreamMart (dates: TODO)",
        href: "/work/stream-mart",
        note: "Dates: TODO",
      },
      {
        label: "AppForge Case Study",
        href: "/work/appforge",
      },
    ],
    terminalLines: [
      { prompt: "outbox >", text: "PostgreSQL ACID txn: order + outbox inserted" },
      { text: "[cdc] Debezium tailing WAL -> topic: orders.events", color: "text-sky-400" },
      { text: "[kafka] partition 2 committed offset 49201", color: "text-emerald-500" },
      { text: "[appforge] prompt token stream -> AST validated (0 eval)", color: "text-amber-400" },
    ],
  },
  {
    id: "current-focus",
    year: "Now",
    stage: "Distributed Scale",
    badge: "Kafka & K8s",
    title: "Advanced Kafka Event Partitioning & Kubernetes",
    description:
      "Deepening production-readiness in backend distributed architectures, focusing on Kafka event partitioning, consumer group rebalancing, and Kubernetes pod orchestration for resilient microservices.",
    keyArtifact: "k8s",
    artifactTitle: "cluster :: distributed-orchestration",
    terminalLines: [
      { prompt: "kubectl >", text: "get pods -n backend-services -o wide" },
      { text: "order-svc-pod-7d4b    Running   0 restarts   ready: 3/3", color: "text-emerald-500" },
      { text: "kafka-broker-node-0    Running   0 restarts   partitions: 12", color: "text-sky-400" },
      { text: "payment-consumer-pod   Running   0 restarts   lag: 0 msgs", color: "text-emerald-500" },
    ],
  },
];

export function AboutTimeline() {
  const { theme } = useTheme();
  const stageshowTheme = theme === "dark" ? "dark" : "light";
  const [activeId, setActiveId] = useState<string>("fullstack-clairvyn-appforge");

  const currentMilestone = milestones.find((m) => m.id === activeId) || milestones[3];

  return (
    <section aria-labelledby="timeline-heading" className="w-full space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[var(--border-subtle)] pb-4">
        <div>
          <h2 id="timeline-heading" className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            How I got here
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Growth trajectory from IIT Kharagpur foundations through visual design leadership into distributed backend systems.
          </p>
        </div>
        <span className="text-xs text-[var(--text-tertiary)] hidden sm:inline tabular-nums">
          2022 to present
        </span>
      </div>

      {/* Interactive Milestone Rail */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2" role="tablist" aria-label="Career milestones">
        {milestones.map((m) => {
          const isActive = m.id === activeId;
          return (
            <button
              key={m.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveId(m.id)}
              className={`p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 ${
                isActive
                  ? "bg-[var(--surface-tile-elevated)] border-[var(--text-primary)] shadow-sm scale-102"
                  : "bg-[var(--surface-tile)] border-[var(--border-subtle)] hover:border-[var(--border-hover)] opacity-85 hover:opacity-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tabular-nums text-[var(--text-tertiary)] block">
                  {m.year}
                </span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
                )}
              </div>
              <span
                className={`text-xs sm:text-sm font-semibold truncate block mt-1 ${
                  isActive ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"
                }`}
              >
                {m.stage}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Milestone Card with Paired Stageshow Window */}
      <article className="p-6 sm:p-7 rounded-2xl bg-[var(--surface-tile)] border border-[var(--border-subtle)] space-y-6 motion-safe:animate-fadeIn">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Narrative & Context */}
          <div className="lg:col-span-7 space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono uppercase bg-[var(--surface-tile-hover)] border border-[var(--border-subtle)] text-[var(--text-tertiary)]">
                  {currentMilestone.year} · {currentMilestone.stage}
                </span>
                <span className="text-xs font-semibold text-emerald-500">
                  {currentMilestone.badge}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">
                {currentMilestone.title}
              </h3>
            </div>

            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
              {currentMilestone.description}
            </p>

            {currentMilestone.projectLinks && currentMilestone.projectLinks.length > 0 && (
              <div className="pt-2 flex items-center gap-3 flex-wrap">
                {currentMilestone.projectLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[var(--surface-tile-hover)] hover:bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] text-[var(--text-primary)] transition-colors active:scale-98"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[var(--text-tertiary)]" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Right: Miniature Stageshow Artifact Window */}
          <div className="lg:col-span-5 rounded-xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--surface-tile-elevated)] shadow-xs">
            <Stage theme={stageshowTheme} fidelity="standard" width={420} height={220} className="w-full">
              {() => (
                <Window
                  title={currentMilestone.artifactTitle}
                  toolbar={
                    <span className="text-[10px] font-mono text-[var(--text-tertiary)] font-bold">
                      ARCHIVED
                    </span>
                  }
                  className="w-full h-full"
                >
                  <div className="p-3.5 h-full flex flex-col justify-between font-mono text-[11px] leading-relaxed overflow-hidden">
                    <div className="space-y-1.5">
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

                    <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[10px] text-[var(--text-tertiary)]">
                      <span>STATUS: REPRODUCIBLE</span>
                      <span>VERIFIED ARTIFACT</span>
                    </div>
                  </div>
                </Window>
              )}
            </Stage>
          </div>
        </div>
      </article>

      {/* Accessible Full Chronology List for Screen Readers */}
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