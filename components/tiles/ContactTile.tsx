"use client";

import { useState } from "react";
import { BentoTile } from "./BentoTile";
import { siteConfig } from "@/content/site";
import { Check, ArrowUpRight } from "lucide-react";

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
    }, 2400);
  };

  return (
    <BentoTile className={className}>
      <div className="w-full h-full flex flex-col justify-between py-0.5">
        <h3 className="type-h4 font-display font-medium text-[var(--text-primary)] leading-snug">
          Have a project in mind?
        </h3>

        <div className="mt-auto pt-3">
          <button
            onClick={handleCopy}
            type="button"
            data-cursor="pointer"
            data-cursor-text={copied ? "Copied!" : "Click to Copy"}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-full bg-white/[0.05] border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.09] text-[var(--text-primary)] transition-all duration-200 group active:scale-98"
          >
            <span className="text-xs font-medium pl-1">
              {copied ? "Copied to clipboard!" : "Copy email"}
            </span>

            <div className="w-5 h-5 rounded-full flex items-center justify-center text-neutral-400 group-hover:text-white">
              {copied ? (
                <Check className="w-3.5 h-3.5 text-neutral-200" />
              ) : (
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              )}
            </div>
          </button>
        </div>
      </div>
    </BentoTile>
  );
}
