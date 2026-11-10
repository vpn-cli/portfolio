"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Database, Layers, Radio, Server, Users } from "lucide-react";

interface StreamMartDiagramProps {
  active?: boolean;
}

// Every label and step is grounded directly in the StreamMart repository:
// 1. API Gateway: api-gateway/index.js:13-24 (proxies checkout to payment-service)
// 2. Outbox Owner & Atomic DB: payment-service/index.js:33-57 & payment-service/db/schema.js:11-17 (payments + outbox_events)
// 3. Relay Worker: payment-service/worker.js:21-61 (polls outbox_events every 5s & publishes to Kafka)
// 4. Kafka Topic & Consumers: kafka/admin.js:13, order-service/index.js:25-54 & analytic-service/index.js:21-40 (topic: 'payment-successful')
// Note: Shows strictly the transactional outbox flow; downstream direct publishes by order-service & email-service are omitted.
const FLOW_STEPS = [
  {
    id: "gateway",
    number: "01",
    role: "INGRESS",
    serviceOwner: "api-gateway",
    title: "API Gateway",
    endpoint: "POST /api/payment",
    tech: "Express & JWT Proxy",
    icon: Server,
    description: "API Gateway validates JWT bearer token and reverse-proxies checkout to Payment Service",
    badge: "Port 8080",
    sourceFile: "api-gateway/index.js:13",
  },
  {
    id: "payment_outbox",
    number: "02",
    role: "OUTBOX OWNER",
    serviceOwner: "payment-service",
    title: "Payment Service",
    endpoint: "Atomic db.transaction()",
    tech: "Neon PostgreSQL",
    icon: Database,
    description: "Payment Service atomically inserts payment record and outbox_events row in single SQL commit",
    badge: "payments & outbox_events",
    sourceFile: "payment-service/index.js:45",
  },
  {
    id: "relay_worker",
    number: "03",
    role: "RELAY WORKER",
    serviceOwner: "payment-service",
    title: "Outbox Relay",
    endpoint: "Polls outbox_events (5s)",
    tech: "KafkaJS Producer",
    icon: Radio,
    description: "Relay worker inside Payment Service polls unpublished events and dispatches to Kafka broker",
    badge: "Topic: payment-successful",
    sourceFile: "payment-service/worker.js:21",
  },
  {
    id: "consumers",
    number: "04",
    role: "CONSUMERS",
    serviceOwner: "order & analytic services",
    title: "Async Consumers",
    endpoint: "Sub: payment-successful",
    tech: "KafkaJS Consumer",
    icon: Users,
    description: "Order Service and Analytic Service consume 'payment-successful' independently from Kafka",
    badge: "Order & Analytic Groups",
    sourceFile: "order-service/index.js:25 & analytic-service/index.js:21",
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
    }, 2400);
    return () => clearInterval(timer);
  }, [reducedMotion, active]);

  const activeStep = FLOW_STEPS[reducedMotion ? 3 : currentStep];

  return (
    <div className="w-full h-full p-3.5 sm:p-5 flex flex-col justify-between bg-[var(--surface-tile-elevated)] text-[var(--text-primary)] select-none">
      {/* Top Header Row */}
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-mono uppercase tracking-widest text-[var(--text-tertiary)] font-semibold">
            Diagram
          </span>
          <span className="text-[var(--border-subtle)]" aria-hidden="true">
            /
          </span>
          <span className="text-[13px] font-medium text-[var(--text-secondary)]">
            Transactional Outbox Flow (payment-service)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[13px] font-mono tracking-wider bg-[var(--surface-tile)] text-[var(--text-secondary)] border border-[var(--border-subtle)] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 motion-safe:animate-pulse" />
            LIVE PIPELINE
          </span>
        </div>
      </div>

      {/* Main Diagram Area: 4 Connected Nodes with Service Ownership Callout */}
      <div className="my-auto py-2.5 space-y-2">
        <div className="flex items-center justify-between text-[13px] font-mono text-[var(--text-tertiary)] px-1">
          <span>Ingress → Service Boundary (Owns Outbox) → Kafka Broker → Consumers</span>
          <span className="text-emerald-500/90 font-medium">Topic: payment-successful</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 relative items-stretch">
          {FLOW_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isCurrent = !reducedMotion && currentStep === idx;
            const isCompleted = !reducedMotion && currentStep > idx;
            const isInsidePaymentService = step.serviceOwner === "payment-service";

            return (
              <div
                key={step.id}
                className={`relative rounded-xl p-3 sm:p-3.5 border transition-all duration-300 flex flex-col justify-between ${
                  isInsidePaymentService ? "border-dashed" : ""
                } ${
                  isCurrent
                    ? "bg-[var(--surface-tile)] border-[var(--text-primary)] shadow-md ring-1 ring-[var(--text-primary)]/20 scale-[1.02]"
                    : isCompleted
                    ? "bg-[var(--surface-tile)] border-[var(--border-hover)]"
                    : "bg-[var(--surface-tile)]/70 border-[var(--border-subtle)] opacity-85"
                }`}
              >
                {/* Node Header: Step Number + Role */}
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[13px] font-bold text-[var(--text-secondary)]">
                      {step.number}
                    </span>
                    <span
                      className={`text-[13px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                        isInsidePaymentService
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                          : "bg-[var(--surface-tile-elevated)] border-[var(--border-subtle)] text-[var(--text-tertiary)]"
                      }`}
                    >
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
                  <div className="font-mono text-[13px] text-[var(--text-secondary)] truncate">
                    {step.endpoint}
                  </div>
                </div>

                {/* Node Footer: Service Owner & Tech Tag */}
                <div className="pt-2 mt-2 border-t border-[var(--border-subtle)]/70 flex items-center justify-between font-mono text-[13px] text-[var(--text-tertiary)]">
                  <span className="truncate max-w-[120px]">{step.tech}</span>
                  {isCurrent && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 motion-safe:animate-ping" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Step Flow Directional Indicators between cards */}
        <div className="hidden lg:flex items-center justify-between px-10 -mt-1 pointer-events-none text-[var(--border-hover)]">
          <ArrowRight className="w-3.5 h-3.5 mx-auto" />
          <ArrowRight className="w-3.5 h-3.5 mx-auto" />
          <ArrowRight className="w-3.5 h-3.5 mx-auto" />
        </div>
      </div>

      {/* Honest Architecture Flow Status Bar & Explicit Caption */}
      <div className="rounded-lg bg-[var(--surface-tile)] border border-[var(--border-subtle)] p-2.5 sm:p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[13px] font-mono">
        <div className="flex items-center gap-2 truncate max-w-full">
          <span className="shrink-0 flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                active && !reducedMotion ? "bg-emerald-500 motion-safe:animate-pulse" : "bg-neutral-400"
              }`}
            />
            <span className="font-semibold text-[var(--text-primary)] uppercase text-[13px] tracking-wider">
              Step {activeStep.number}:
            </span>
          </span>
          <span className="text-[var(--text-secondary)] truncate">
            {activeStep.description}
          </span>
        </div>

        <div className="shrink-0 text-[13px] text-[var(--text-tertiary)] hidden sm:block border-l border-[var(--border-subtle)] pl-2.5">
          Outbox flow only · Direct publishes omitted
        </div>
      </div>
    </div>
  );
}
