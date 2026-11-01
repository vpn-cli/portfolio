"use client";

import { useState } from "react";
import { BentoTile } from "./BentoTile";
import { ArrowUpRight, Copy, Check, Mail } from "lucide-react";

export function ContactTile({ className = "" }: { className?: string }) {
  const email = "vipinkaushik20771041@gmail.com";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback
    }
  };

  const mailUrl = `mailto:${email}?subject=Opportunity%20Inquiry%20%E2%80%94%20Vipin%20Kaushik`;

  return (
    <BentoTile className={className} cursorText="Contact" ariaLabel="Contact Vipin Kaushik">
      <div className="w-full h-full flex flex-col justify-between p-1 sm:p-2">
        {/* Top Header: Big, bold recruiter-targeted CTA */}
        <div className="space-y-2.5">
          <h3 className="text-[26px] sm:text-[30px] xl:text-[32px] 2xl:text-[36px] font-bold text-[var(--text-primary)] leading-[1.1] tracking-[-0.03em]">
            Hiring? Let’s talk.
          </h3>

          <div className="flex items-center gap-2 text-[15px] sm:text-[16px] text-[var(--text-secondary)]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" aria-hidden="true" />
            <span>Open to SDE roles · replies within a day</span>
          </div>
        </div>

        {/* Center / Bottom: Large Clickable Email + Copy & Mail Actions */}
        <div className="pt-4 mt-auto space-y-2.5">
          {/* Large clickable email block with copy button */}
          <div className="w-full flex items-center justify-between p-3 sm:p-3.5 rounded-2xl bg-[var(--surface-tile-elevated)] border border-transparent hover:border-[var(--border-hover)] transition-colors">
            <button
              onClick={handleCopy}
              type="button"
              className="text-left font-medium text-[15px] sm:text-[16px] text-[var(--text-primary)] hover:text-sky-500 transition-colors truncate focus-visible:outline-none"
              title="Click to copy email address"
            >
              {email}
            </button>

            <button
              onClick={handleCopy}
              type="button"
              aria-label={copied ? "Email copied to clipboard" : "Copy email address"}
              className="ml-2 px-3 py-1.5 rounded-xl bg-[var(--surface-tile)] hover:bg-[var(--surface-tile-hover)] border border-transparent text-[13px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
                  <span className="text-emerald-500 font-medium">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Secondary Action: Send Mail */}
          <div className="flex items-center gap-3">
            <a
              href={mailUrl}
              className="min-h-[44px] w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--surface-tile)] hover:bg-[var(--surface-tile-hover)] border border-transparent hover:border-[var(--border-hover)] text-[13px] sm:text-[14px] font-medium text-[var(--text-primary)] transition-colors active:scale-98 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-white/40"
            >
              <Mail className="w-4 h-4 text-[var(--text-secondary)]" aria-hidden="true" />
              <span>Send mail</span>
              <ArrowUpRight className="w-4 h-4 text-[var(--text-tertiary)] ml-auto" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </BentoTile>
  );
}
