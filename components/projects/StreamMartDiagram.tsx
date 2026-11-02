"use client";

import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Database, Layers, MessageSquare, Radio } from "lucide-react";

interface StreamMartDiagramProps {
  active?: boolean;
}

const STEPS = [
  {
    id: "order",
    title: "Order Service",
    meta: "POST /api/orders",
    tech: "Express & Zod",
    icon: Layers,
    log: "[14:28:01.102] INGEST  POST /api/orders received · payload validated",
  },
  {
    id: "outbox",
    title: "Outbox Table",
    meta: "outbox_events",
    tech: "Neon PostgreSQL",
    icon: Database,
    log: "[14:28:01.108] OUTBOX  Atomic transaction committed (outbox_event #9240)",
  },
  {
    id: "kafka",
    title: "Kafka Cluster",
    meta: "topic: order.created",
    tech: "Apache Kafka",
    icon: Radio,
    log: "[14:28:01.116] KAFKA   Dispatcher pushed event to 'order.created' (p:1)",
  },
  {
    id: "consumer",
    title: "Payment Worker",
    meta: "Stripe SDK + ACK",
    tech: "KafkaJS Consumer",
    icon: CheckCircle2,
    log: "[14:28:01.125] WORKER  Payment consumed event · outbox marked PROCESSED",
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
      setCurrentStep((prev) => (prev + 1) % STEPS.length);
    }, 1800);
    return () => clearInterval(timer);
  }, [reducedMotion, active]);

  return (
    <div className="w-full h-full p-4 sm:p-5 flex flex-col justify-between bg-[var(--bg-canvas-subtle)] select-none">
      {/* Top Architecture Flow Pipeline */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-2 relative items-center">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isCurrent = !reducedMotion && currentStep === idx;
          const isPast = !reducedMotion && currentStep > idx;

          return (
            <div key={step.id} className="relative flex flex-col">
              <div
                className={`rounded-lg p-2.5 sm:p-3 border transition-all duration-300 flex flex-col justify-between min-h-[88px] sm:min-h-[96px] ${
                  isCurrent
                    ? "bg-[var(--surface-tile-elevated)] border-[var(--text-primary)] shadow-sm ring-1 ring-[var(--text-primary)]/20"
                    : isPast
                    ? "bg-[var(--surface-tile)] border-[var(--border-hover)]"
                    : "bg-[var(--surface-tile)] border-[var(--border-subtle)] opacity-70 sm:opacity-90"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-[10px] text-[var(--text-tertiary)]">
                    0{idx + 1}
                  </span>
                  <div
                    className={`w-5 h-5 rounded flex items-center justify-center transition-colors duration-200 ${
                      isCurrent
                        ? "text-[var(--text-primary)] bg-[var(--surface-tile-hover)]"
                        : "text-[var(--text-tertiary)]"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-[var(--text-primary)] truncate">
                    {step.title}
                  </div>
                  <div className="font-mono text-[10px] text-[var(--text-secondary)] truncate">
                    {step.meta}
                  </div>
                </div>

                <div className="pt-1 mt-1 border-t border-[var(--border-subtle)]/60 font-mono text-[9px] text-[var(--text-tertiary)] truncate">
                  {step.tech}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Event Stream Log Feed */}
      <div className="mt-3 rounded-lg bg-[var(--surface-tile)] border border-[var(--border-subtle)] p-2.5 sm:p-3 font-mono text-[10.5px] sm:text-[11px] leading-relaxed">
        <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-[var(--border-subtle)] text-[10px] text-[var(--text-tertiary)]">
          <span className="flex items-center gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                active && !reducedMotion
                  ? "bg-emerald-500 motion-safe:animate-pulse"
                  : "bg-neutral-400"
              }`}
            />
            <span className="font-semibold tracking-wider uppercase text-[9.5px]">
              Transactional Outbox Relay
            </span>
          </span>
          <span>Topic: order.created</span>
        </div>

        <div className="text-[var(--text-secondary)] font-mono truncate">
          <span className="text-[var(--text-primary)] font-medium">
            {STEPS[reducedMotion ? 3 : currentStep].log.split("  ")[0]}
          </span>{" "}
          <span>{STEPS[reducedMotion ? 3 : currentStep].log.split("  ")[1]}</span>
        </div>
      </div>
    </div>
  );
}
