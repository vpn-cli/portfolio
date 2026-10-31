"use client";

import { useState, useRef } from "react";
import { siteConfig } from "@/content/site";
import { BentoTile } from "./BentoTile";
import { Copy, Check, Mail, Send } from "lucide-react";
import { gsap } from "gsap";
import { registerGSAPPlugins } from "@/lib/motion";

export function ContactTile({ className = "" }: { className?: string }) {
  const [copied, setCopied] = useState(false);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  const handleCopy = async () => {
    registerGSAPPlugins();
    try {
      await navigator.clipboard.writeText(siteConfig.email);
    } catch {
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = siteConfig.email;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }

    setCopied(true);

    const flash = flashRef.current;
    const feedback = feedbackRef.current;

    if (flash) {
      gsap.fromTo(
        flash,
        { opacity: 0.8, scale: 0.9 },
        { opacity: 0, scale: 1.1, duration: 0.6, ease: "power2.out" }
      );
    }

    if (feedback) {
      gsap.fromTo(
        feedback,
        { scale: 0.8, y: 5 },
        { scale: 1, y: 0, duration: 0.4, ease: "back.out(2)" }
      );
    }

    setTimeout(() => {
      setCopied(false);
    }, 2400);
  };

  return (
    <BentoTile className={className}>
      <div className="relative w-full h-full flex flex-col justify-between">
        {/* Flash Effect on Copy */}
        <div
          ref={flashRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[28px] bg-accent/20 opacity-0"
        />

        {/* Top Row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/25 flex items-center justify-center text-accent">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-display">Let's Build Together</h3>
              <p className="text-xs text-white/50">Open for select collaborations</p>
            </div>
          </div>

          <a
            href={`mailto:${siteConfig.email}?subject=Project%20Inquiry`}
            data-cursor="pointer"
            data-cursor-text="Email"
            className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/10 hover:border-accent hover:text-accent flex items-center justify-center text-white/60 transition-colors"
            title="Open Email Client"
          >
            <Send className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Copy Interactive Button Surface */}
        <div className="my-auto py-2">
          <button
            onClick={handleCopy}
            type="button"
            data-cursor="pointer"
            data-cursor-text={copied ? "Copied!" : "Click to Copy"}
            className="w-full group/btn relative flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-accent/50 hover:bg-accent/[0.08] transition-all duration-300 text-left focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <div className="overflow-hidden">
              <span className="text-[11px] uppercase tracking-wider text-white/40 block mb-0.5">
                {copied ? "Status: Clipboard Active" : "Direct Transmission"}
              </span>
              <span className="text-base sm:text-lg font-mono font-medium text-white group-hover/btn:text-accent transition-colors duration-200 truncate block">
                {siteConfig.email}
              </span>
            </div>

            <div
              ref={feedbackRef}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 shrink-0 ml-3 ${
                copied
                  ? "bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                  : "bg-white/[0.06] border border-white/10 text-white/70 group-hover/btn:border-accent/40 group-hover/btn:text-accent group-hover/btn:bg-accent/10"
              }`}
            >
              {copied ? <Check className="w-5 h-5 stroke-[2.5]" /> : <Copy className="w-4 h-4" />}
            </div>
          </button>
        </div>

        {/* Footer info */}
        <div className="text-[11px] text-white/40 pt-2 border-t border-white/[0.06] flex items-center justify-between">
          <span>{copied ? "Copied to clipboard!" : "Click to copy email address"}</span>
          <span className="font-mono">Encrypted 256-bit</span>
        </div>
      </div>
    </BentoTile>
  );
}

