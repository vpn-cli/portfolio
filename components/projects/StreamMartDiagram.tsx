"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Database, Layers, Radio, Users } from "lucide-react";

interface StreamMartDiagramProps {
  active?: boolean;
}

// Every label and step is grounded directly in the StreamMart repository:
// 1. Order Service: order-service/index.js:1-68 & README.md:23
// 2. Outbox Table: payment-service/db/schema.js:12 & README.md:26
// 3. Kafka Broker: payment-service/worker.js:29-57 & README.md:28
// 4. Real Consumers: email-service/index.js:24 & analytic-service/index.js:22 & README.md:32-33
// 5. At-Least-Once Delivery: README.md:51 & payment-service/worker.js:41-55
const FLOW_STEPS = [
  {
    id: "order",
    number: "01",
    role: "PRODUCER",
    title: "Order Service",
    endpoint: "POST /api/orders",
    tech: "Express & Zod",
    icon: Layers,
    description: "Order Service validates payload and initiates atomic SQL transaction",
    badge: "HTTP API",
    sourceFile: "order-service/index.js:1",
  },
  {
    id: "outbox",
    number: "02",
    role: "ATOMIC TX",
    title: "Outbox Table",
    endpoint: "outbox_events",
    tech: "PostgreSQL",
    icon: Database,
    description: "Order record & outbox event committed together in a single atomic database transaction",
    badge: "Neon SQL",
    sourceFile: "payment-service/db/schema.js:12",
  },
  {
    id: "kafka",
    number: "03",
    role: "EVENT BROKER",
    title: "Kafka Topic",
    endpoint: "order.created",
    tech: "Apache Kafka",
    icon: Radio,
    description: "Outbox relay worker dispatches verified event payload to Kafka topic 'order.created'",
    badge: "Topic",
    sourceFile: "payment-service/worker.js:29",
  },
  {
    id: "consumers",
    number: "04",
    role: "CONSUMERS",
    title: "Consumers",
    endpoint: "Email & Analytics",
    tech: "KafkaJS Consumer",
    icon: Users,
    description: "Email & Analytic consumer groups process order events asynchronously",
    badge: "Consumer Groups",
    sourceFile: "email-service/index.js:24 & analytic-service/index.js:22",
  },
];

export function StreamMartDiagram({ active = true }: StreamMartDiagramProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (reducedMotion || !active) return;
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % FLOW_STEPS.length);
    }, 2200);
    return () => clearInterval(timer);
  }, [reducedMotion, active]);

  const activeStep = FLOW_STEPS[reducedMotion ? 3 : currentStep];

  return (
    <div className="w-full h-full p-3.5 sm:p-5 flex flex-col justify-between bg-[var(--surface-tile-elevated)] text-[var(--text-primary)] select-none">
      {/* Top Header Row */}
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-tertiary)] font-semibold">
            Architecture Diagram
          </span>
          <span className="text-[var(--border-subtle)]" aria-hidden="true">
            /
          </span>
          <span className="text-[11px] font-medium text-[var(--text-secondary)]">
            Transactional Outbox Pattern
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[9.5px] font-mono tracking-wider bg-[var(--surface-tile)] text-[var(--text-secondary)] border border-[var(--border-subtle)] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 motion-safe:animate-pulse" />
            LIVE FLOW
          </span>
        </div>
      </div>

      {/* Main Diagram Area: 4 Connected Nodes Spanning the Preview */}
      <div className="my-auto py-3">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 relative items-stretch">
          {FLOW_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isCurrent = !reducedMotion && currentStep === idx;
            const isCompleted = !reducedMotion && currentStep > idx;

            return (
              <div
                key={step.id}
                className={`relative rounded-xl p-3 sm:p-3.5 border transition-all duration-300 flex flex-col justify-between ${
                  isCurrent
                    ? "bg-[var(--surface-tile)] border-[var(--text-primary)] shadow-md ring-1 ring-[var(--text-primary)]/20 scale-[1.02]"
                    : isCompleted
                    ? "bg-[var(--surface-tile)] border-[var(--border-hover)]"
                    : "bg-[var(--surface-tile)]/70 border-[var(--border-subtle)] opacity-85"
                }`}
              >
                {/* Node Header: Step Number + Icon */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] font-bold text-[var(--text-secondary)]">
                      {step.number}
                    </span>
                    <span className="text-[8.5px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] text-[var(--text-tertiary)]">
                      {step.role}
                    </span>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors duration-200 ${
                      isCurrent
                        ? "text-[var(--text-primary)] bg-[var(--text-primary)]/10"
                        : "text-[var(--text-tertiary)] bg-[var(--surface-tile-elevated)]"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                  </div>
                </div>

                {/* Node Title & Endpoint */}
                <div className="space-y-0.5 my-1">
                  <div className="text-xs sm:text-[13px] font-medium text-[var(--text-primary)] truncate">
                    {step.title}
                  </div>
                  <div className="font-mono text-[10px] sm:text-[10.5px] text-[var(--text-secondary)] truncate">
                    {step.endpoint}
                  </div>
                </div>

                {/* Node Footer: Tech Stack Tag */}
                <div className="pt-2 mt-2 border-t border-[var(--border-subtle)]/70 flex items-center justify-between font-mono text-[9px] text-[var(--text-tertiary)]">
                  <span>{step.tech}</span>
                  {isCurrent && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 motion-safe:animate-ping" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Step Flow Directional Indicators between cards */}
        <div className="hidden lg:flex items-center justify-between px-10 -mt-2 pointer-events-none text-[var(--border-hover)]">
          <ArrowRight className="w-3.5 h-3.5 mx-auto" />
          <ArrowRight className="w-3.5 h-3.5 mx-auto" />
          <ArrowRight className="w-3.5 h-3.5 mx-auto" />
        </div>
      </div>

      {/* Honest Architecture Flow Status Bar (No fake logs, no fake timestamps) */}
      <div className="rounded-lg bg-[var(--surface-tile)] border border-[var(--border-subtle)] p-2.5 sm:p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] font-mono">
        <div className="flex items-center gap-2 truncate max-w-full">
          <span className="shrink-0 flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                active && !reducedMotion ? "bg-emerald-500 motion-safe:animate-pulse" : "bg-neutral-400"
              }`}
            />
            <span className="font-semibold text-[var(--text-primary)] uppercase text-[9.5px] tracking-wider">
              Step {activeStep.number}:
            </span>
          </span>
          <span className="text-[var(--text-secondary)] truncate">
            {activeStep.description}
          </span>
        </div>

        <div className="shrink-0 text-[10px] text-[var(--text-tertiary)] hidden sm:block border-l border-[var(--border-subtle)] pl-2.5">
          At-Least-Once Delivery
        </div>
      </div>
    </div>
  );
}
