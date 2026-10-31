"use client";

import { useState } from "react";
import { BentoTile } from "./BentoTile";
import { siteConfig } from "@/content/site";
import { Copy, Check, ArrowUpRight } from "lucide-react";

export function ContactTile({ className = "" }: { className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.email);
    } catch {
      const el = document.createElement("textarea");
      el.value = siteConfig.email;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }

    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2500);
  };

  return (
    <BentoTile className={className}>
      <div className="w-full h-full flex flex-col justify-between py-1">
        <h3 className="type-h4 font-display font-medium text-[var(--text-primary)] mb-4">
          Have a project in mind?
        </h3>

        <div className="mt-auto">
          <button
            onClick={handleCopy}
            type="button"
            data-cursor="pointer"
            data-cursor-text={copied ? "Copied!" : "Click to Copy"}
            className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-white/[0.04] dark:bg-white/[0.04] border border-white/[0.08] hover:border-accent hover:bg-accent/10 text-[var(--text-primary)] hover:text-accent transition-all duration-200 group active:scale-98"
          >
            <span className="text-sm font-medium">
              {copied ? "Copied to clipboard!" : "Copy email"}
            </span>

            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[var(--text-secondary)] group-hover:text-accent">
              {copied ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              )}
            </div>
          </button>
        </div>
      </div>
    </BentoTile>
  );
}
