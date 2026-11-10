"use client";

import { useEffect, useState } from "react";
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";

interface Phase {
  step: number;
  activeBoxes: string[];
  activeArrows: string[];
  description: string;
  sourceUrl: string;
}

const PHASES: Phase[] = [
  {
    step: 1,
    activeBoxes: ["client", "gateway"],
    activeArrows: ["client->gateway"],
    description:
      "Next.js UI posts checkout payload to API Gateway with JWT Bearer authentication.",
    sourceUrl:
      "https://github.com/vpn-cli/StreamMart/blob/master/client/src/app/page.jsx#L11-L20",
  },
  {
    step: 2,
    activeBoxes: ["gateway", "payment"],
    activeArrows: ["gateway->payment"],
    description:
      "API Gateway verifies JWT and proxies checkout request to Payment Service on port 8000.",
    sourceUrl:
      "https://github.com/vpn-cli/StreamMart/blob/master/api-gateway/index.js#L13-L24",
  },
  {
    step: 3,
    activeBoxes: ["payment", "outbox"],
    activeArrows: ["payment->outbox"],
    description:
      "Payment Service commits payment record and outbox event in one atomic database transaction.",
    sourceUrl:
      "https://github.com/vpn-cli/StreamMart/blob/master/payment-service/index.js#L45-L57",
  },
  {
    step: 4,
    activeBoxes: ["outbox", "worker", "kafka"],
    activeArrows: ["outbox->worker", "worker->kafka"],
    description:
      "Background relay worker polls unpublished events every 5 seconds and publishes to Kafka.",
    sourceUrl:
      "https://github.com/vpn-cli/StreamMart/blob/master/payment-service/worker.js#L28-L56",
  },
  {
    step: 5,
    activeBoxes: ["kafka", "order", "analytics"],
    activeArrows: ["kafka->order", "kafka->analytics"],
    description:
      "Order Service and Analytics Service consume the payment-successful topic asynchronously.",
    sourceUrl:
      "https://github.com/vpn-cli/StreamMart/blob/master/order-service/index.js#L25-L54",
  },
];

function DiagramBox({
  title,
  subline,
  isActive,
  className = "",
}: {
  title: string;
  subline?: string;
  isActive: boolean;
  className?: string;
}) {
  return (
    <div
      className={`rounded-lg p-3 transition-colors duration-200 border text-left ${
        isActive
          ? "border-[var(--accent-color)] bg-[var(--surface-tile-elevated)] ring-1 ring-[var(--accent-color)]"
          : "border-[var(--border-subtle)] bg-[var(--surface-tile)]"
      } ${className}`}
    >
      <div className="text-sm font-semibold text-[var(--text-primary)] leading-snug">
        {title}
      </div>
      {subline && (
        <div className="text-[13px] text-[var(--text-secondary)] mt-0.5 leading-snug">
          {subline}
        </div>
      )}
    </div>
  );
}

function SvgArrow({
  direction = "right",
  isActive = false,
  className = "",
}: {
  direction?: "right" | "down";
  isActive?: boolean;
  className?: string;
}) {
  const strokeColor = isActive ? "var(--accent-color)" : "var(--border-hover)";
  const fillColor = isActive ? "var(--accent-color)" : "var(--border-hover)";

  if (direction === "down") {
    return (
      <svg
        className={`w-3.5 h-5 shrink-0 transition-colors duration-200 ${className}`}
        viewBox="0 0 14 20"
        fill="none"
        aria-hidden="true"
      >
        <line x1="7" y1="0" x2="7" y2="14" stroke={strokeColor} strokeWidth="1.5" />
        <polygon points="3.5,12 7,19 10.5,12" fill={fillColor} />
      </svg>
    );
  }

  return (
    <svg
      className={`w-5 h-3.5 shrink-0 transition-colors duration-200 ${className}`}
      viewBox="0 0 20 14"
      fill="none"
      aria-hidden="true"
    >
      <line x1="0" y1="7" x2="14" y2="7" stroke={strokeColor} strokeWidth="1.5" />
      <polygon points="12,3.5 19,7 12,10.5" fill={fillColor} />
    </svg>
  );
}

export function StreamMartDiagram() {
  const [currentPhase, setCurrentPhase] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) {
      setIsPlaying(false);
    }
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentPhase((prev) => (prev + 1) % PHASES.length);
    }, 3200);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const activePhase = PHASES[currentPhase];
  const activeBoxes = new Set(activePhase.activeBoxes);
  const activeArrows = new Set(activePhase.activeArrows);

  const handlePrev = () => {
    setCurrentPhase((prev) => (prev - 1 + PHASES.length) % PHASES.length);
  };

  const handleNext = () => {
    setCurrentPhase((prev) => (prev + 1) % PHASES.length);
  };

  const handleTogglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  return (
    <div
      className="w-full rounded-[var(--card-radius)] border border-[var(--border-subtle)] bg-[var(--surface-tile)] p-4 sm:p-6 shadow-sm space-y-6"
      aria-label="StreamMart architecture and transactional outbox flow diagram"
    >
      {/* ━━━ MOBILE VIEW: TOP-TO-BOTTOM VERTICAL REFLOW (390px) ━━━ */}
      <div className="flex md:hidden flex-col items-stretch space-y-2">
        <DiagramBox
          title="Client UI"
          subline="Port 3000"
          isActive={activeBoxes.has("client")}
        />
        <div className="flex justify-center py-0.5">
          <SvgArrow
            direction="down"
            isActive={activeArrows.has("client->gateway")}
          />
        </div>

        <DiagramBox
          title="API Gateway"
          subline="Port 8080"
          isActive={activeBoxes.has("gateway")}
        />
        <div className="flex justify-center py-0.5">
          <SvgArrow
            direction="down"
            isActive={activeArrows.has("gateway->payment")}
          />
        </div>

        {/* Service boundary: single dashed outline with small plain label */}
        <div className="rounded-xl border border-dashed border-[var(--border-subtle)] p-3 space-y-2">
          <div className="text-[13px] text-[var(--text-secondary)] font-normal">
            Payment Service (Port 8000)
          </div>
          <DiagramBox
            title="Payment Service"
            subline="POST /api/payment"
            isActive={activeBoxes.has("payment")}
          />
          <div className="flex justify-center py-0.5">
            <SvgArrow
              direction="down"
              isActive={activeArrows.has("payment->outbox")}
            />
          </div>
          <DiagramBox
            title="outbox_events table"
            subline="Neon PostgreSQL"
            isActive={activeBoxes.has("outbox")}
          />
          <div className="flex justify-center py-0.5">
            <SvgArrow
              direction="down"
              isActive={activeArrows.has("outbox->worker")}
            />
          </div>
          <DiagramBox
            title="Relay Worker"
            subline="Polls every 5s"
            isActive={activeBoxes.has("worker")}
          />
        </div>

        <div className="flex justify-center py-0.5">
          <SvgArrow
            direction="down"
            isActive={activeArrows.has("worker->kafka")}
          />
        </div>

        <DiagramBox
          title="Kafka Broker"
          subline="Topic: payment-successful"
          isActive={activeBoxes.has("kafka")}
        />

        <div className="flex justify-center py-0.5">
          <SvgArrow
            direction="down"
            isActive={
              activeArrows.has("kafka->order") ||
              activeArrows.has("kafka->analytics")
            }
          />
        </div>

        <DiagramBox
          title="Order Service"
          subline="Consumer"
          isActive={activeBoxes.has("order")}
        />

        <div className="flex justify-center py-0.5">
          <SvgArrow
            direction="down"
            isActive={activeArrows.has("kafka->analytics")}
          />
        </div>

        <DiagramBox
          title="Analytics Service"
          subline="Consumer"
          isActive={activeBoxes.has("analytics")}
        />
      </div>

      {/* ━━━ DESKTOP VIEW: FLAT HORIZONTAL PIPELINE FLOW (>= 768px) ━━━ */}
      <div className="hidden md:flex flex-col space-y-4">
        {/* Row 1: Ingress (Client UI → API Gateway) */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 max-w-xl mx-auto w-full">
          <DiagramBox
            title="Client UI"
            subline="Port 3000"
            isActive={activeBoxes.has("client")}
          />
          <SvgArrow
            direction="right"
            isActive={activeArrows.has("client->gateway")}
          />
          <DiagramBox
            title="API Gateway"
            subline="Port 8080"
            isActive={activeBoxes.has("gateway")}
          />
        </div>

        {/* Down connector from Gateway to Payment Service */}
        <div className="flex justify-center py-0.5">
          <SvgArrow
            direction="down"
            isActive={activeArrows.has("gateway->payment")}
          />
        </div>

        {/* Row 2: Service boundary - Payment Service with dashed outline */}
        <div className="rounded-xl border border-dashed border-[var(--border-subtle)] p-4 space-y-2.5">
          <div className="text-[13px] text-[var(--text-secondary)] font-normal">
            Payment Service (Port 8000)
          </div>
          <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-3">
            <DiagramBox
              title="Payment Service"
              subline="POST /api/payment"
              isActive={activeBoxes.has("payment")}
            />
            <SvgArrow
              direction="right"
              isActive={activeArrows.has("payment->outbox")}
            />
            <DiagramBox
              title="outbox_events table"
              subline="Neon PostgreSQL"
              isActive={activeBoxes.has("outbox")}
            />
            <SvgArrow
              direction="right"
              isActive={activeArrows.has("outbox->worker")}
            />
            <DiagramBox
              title="Relay Worker"
              subline="Polls every 5s"
              isActive={activeBoxes.has("worker")}
            />
          </div>
        </div>

        {/* Down connector from Worker to Kafka */}
        <div className="flex justify-center py-0.5">
          <SvgArrow
            direction="down"
            isActive={activeArrows.has("worker->kafka")}
          />
        </div>

        {/* Row 3: Kafka Broker */}
        <div className="max-w-md mx-auto w-full">
          <DiagramBox
            title="Kafka Broker"
            subline="Topic: payment-successful"
            isActive={activeBoxes.has("kafka")}
          />
        </div>

        {/* Down connector to downstream consumers */}
        <div className="flex justify-center py-0.5">
          <SvgArrow
            direction="down"
            isActive={
              activeArrows.has("kafka->order") ||
              activeArrows.has("kafka->analytics")
            }
          />
        </div>

        {/* Row 4: Consumers (Order Service & Analytics Service) */}
        <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto w-full">
          <DiagramBox
            title="Order Service"
            subline="Consumer"
            isActive={activeBoxes.has("order")}
          />
          <DiagramBox
            title="Analytics Service"
            subline="Consumer"
            isActive={activeBoxes.has("analytics")}
          />
        </div>
      </div>

      {/* ━━━ STEPPING BANNER: STEP DESCRIPTION + VIEW SOURCE + CONTROLS ━━━ */}
      <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-sm sm:text-base text-[var(--text-primary)] leading-relaxed">
          {activePhase.description}{" "}
          <a
            href={activePhase.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] text-[var(--accent-text)] hover:underline inline-flex items-center gap-1 ml-1"
          >
            <span>View source</span>
            <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        </p>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <span className="text-[13px] text-[var(--text-secondary)] font-normal mr-1">
            {currentPhase + 1} of {PHASES.length}
          </span>
          <button
            type="button"
            onClick={handlePrev}
            className="w-11 h-11 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-tile)] hover:bg-[var(--surface-tile-hover)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:ring-offset-2"
            aria-label="Previous step"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={handleTogglePlay}
            className="w-11 h-11 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-tile)] hover:bg-[var(--surface-tile-hover)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:ring-offset-2"
            aria-label={isPlaying ? "Pause simulation" : "Play simulation"}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Play className="w-4 h-4 ml-0.5" aria-hidden="true" />
            )}
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="w-11 h-11 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-tile)] hover:bg-[var(--surface-tile-hover)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:ring-offset-2"
            aria-label="Next step"
          >
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
