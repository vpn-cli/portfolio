import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface Principle {
  title: string;
  statement: string;
  proofCaseStudy: string;
  proofUrl: string;
  proofDetail: string;
}

const principles: Principle[] = [
  {
    title: "1. Simple state before added infrastructure",
    statement: "Solve local problems with language primitives before introducing external caching or message brokers.",
    proofCaseStudy: "Sportz Sockets Engine",
    proofUrl: "/work/sockets#decisions",
    proofDetail:
      "Chose an in-memory room map with an atomic sweep timer before reaching for an external Redis Pub/Sub cluster, keeping single-node deployment zero-cost and sub-millisecond.",
  },
  {
    title: "2. Durable event logs over direct HTTP cascades",
    statement: "Decouple inter-service communication through persistent logs to eliminate synchronous cascade failures.",
    proofCaseStudy: "StreamMart Outbox",
    proofUrl: "/work/stream-mart#decisions",
    proofDetail:
      "Implemented the transactional outbox pattern to guarantee at-least-once Kafka message delivery with ACID safety instead of chaining raw HTTP checkout calls.",
  },
  {
    title: "3. Deterministic ASTs over unverified model outputs",
    statement: "Constrain generative models with strict schemas and compiler sandboxes rather than executing raw text.",
    proofCaseStudy: "AppForge Engine",
    proofUrl: "/work/appforge#decisions",
    proofDetail:
      "Engineered an AST parser and JSON Schema pipeline to compile user prompts into bounded React component trees safely.",
  },
];

export function AboutPrinciples() {
  return (
    <section aria-labelledby="how-i-work-heading" className="w-full space-y-6">
      <div className="flex items-baseline justify-between border-b border-[var(--border-subtle)] pb-4">
        <div>
          <h2 id="how-i-work-heading" className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            How I work
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Three engineering principles backed by decisions in production case studies.
          </p>
        </div>
        <span className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider font-medium hidden sm:inline">
          Architectural Proof
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {principles.map((item) => (
          <article
            key={item.title}
            className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-tile)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] flex flex-col justify-between transition-colors"
          >
            <div className="space-y-3">
              <h3 className="text-base font-bold text-[var(--text-primary)]">
                {item.title}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-normal">
                {item.statement}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-[var(--border-subtle)] space-y-2">
              <span className="text-xs text-[var(--text-tertiary)] block">
                Proof from case study:
              </span>
              <p className="text-xs text-[var(--text-secondary)] leading-normal">
                {item.proofDetail}
              </p>
              <Link
                href={item.proofUrl}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--text-primary)] hover:underline pt-1"
              >
                <span>Read in {item.proofCaseStudy}</span>
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
