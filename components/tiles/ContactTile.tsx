"use client";

import { useState, useEffect } from "react";
import { BentoTile } from "./BentoTile";
import { ArrowUpRight, Copy, Check, Mail, Sun, Moon } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface LocalTimeState {
  timeStr: string;
  isSun: boolean;
  statusText: string;
}

function getIstStatus(): LocalTimeState {
  const now = new Date();

  // Extract hour in Asia/Kolkata (0..23)
  const hourFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    hourCycle: "h23",
  });
  const hour24 = parseInt(hourFormatter.format(now), 10);

  // Format 12-hour time without seconds
  const timeStr = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(now);

  // Sun from 08:00 to 19:59 IST, Moon otherwise
  const isSun = hour24 >= 8 && hour24 < 20;

  // At night (22:00–07:59 IST), second half changes to "probably asleep, replies in the morning"
  const isNight = hour24 >= 22 || hour24 < 8;
  const statusText = isNight
    ? "probably asleep, replies in the morning"
    : "usually replies within a day";

  return { timeStr, isSun, statusText };
}

export function ContactTile({ className = "" }: { className?: string }) {
  const email = "vipinkaushik20771041@gmail.com";
  const [copied, setCopied] = useState(false);
  const [timeState, setTimeState] = useState<LocalTimeState | null>(null);

  useEffect(() => {
    const update = () => {
      setTimeState(getIstStatus());
    };
    update();

    // Schedule update on the boundary of the next full minute, then repeat once a minute
    const now = new Date();
    const msToNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
    let intervalId: NodeJS.Timeout | null = null;
    const timeoutId = setTimeout(() => {
      update();
      intervalId = setInterval(update, 60000);
    }, Math.max(50, msToNextMinute));

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  const handleCopy = async () => {
    trackEvent("email_copy", { location: "contact_tile" });
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = email;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } catch {
        // Fallback silently
      }
    }
  };

  const mailUrl = `mailto:${email}?subject=Opportunity%20Inquiry%20%E2%80%94%20Vipin%20Kaushik`;

  return (
    <BentoTile className={className} cursorText="Contact" ariaLabel="Contact Vipin Kaushik">
      <div className="w-full h-full flex flex-col justify-between gap-3 sm:gap-0">
        {/* Top: Heading + Subline + Time line */}
        <div className="space-y-1.5 sm:space-y-2">
          <h3 className="text-[20px] sm:text-[22px] xl:text-[24px] font-bold text-[var(--text-primary)] leading-[1.15] tracking-[-0.02em]">
            Let’s talk.
          </h3>
          <p className="text-[13px] sm:text-[14px] text-[var(--text-secondary)] leading-snug">
            Roles, collaborations, or a chat about backend systems or drawing.
          </p>

          {/* Inlined Local Time & Status */}
          <div className="flex items-center gap-2 text-[13px] text-[var(--text-tertiary)] min-h-[24px] leading-normal pt-0.5">
            {timeState ? (
              <>
                {timeState.isSun ? (
                  <Sun className="w-3.5 h-3.5 shrink-0 text-[var(--text-secondary)]" aria-hidden="true" />
                ) : (
                  <Moon className="w-3.5 h-3.5 shrink-0 text-[var(--text-secondary)]" aria-hidden="true" />
                )}
                <span className="tabular-nums">
                  {timeState.timeStr} in India · {timeState.statusText}
                </span>
              </>
            ) : (
              <span className="invisible select-none inline-flex items-center gap-2" aria-hidden="true">
                <span className="w-3.5 h-3.5 shrink-0 inline-block" />
                <span>9:27 AM in India · usually replies within a day</span>
              </span>
            )}
          </div>
        </div>

        {/* Center / Bottom: Email/copy row then Send mail row */}
        <div className="flex flex-col gap-2 sm:gap-2.5 pt-1">
          {/* Email row with copy button */}
          <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] transition-colors min-h-[44px]">
            <button
              onClick={handleCopy}
              type="button"
              className="text-left font-medium text-[13px] sm:text-[14px] text-[var(--text-primary)] hover:text-[var(--accent-text)] transition-colors focus-visible:outline-none truncate min-h-[44px] flex items-center"
              title="Click to copy email address"
            >
              {email}
            </button>

            {/* Secondary button: neutral surface with hairline border, primary text color */}
            <button
              onClick={handleCopy}
              type="button"
              data-cta="secondary"
              data-ph-capture-attribute-location="contact_tile"
              aria-label={copied ? "Email copied to clipboard" : "Copy email address"}
              className="btn-secondary w-full sm:w-auto text-[13px] min-h-[44px] px-3.5 py-1.5"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-[var(--accent-color)]" aria-hidden="true" />
                  <span className="text-[var(--accent-color)] font-semibold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" aria-hidden="true" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Secondary Action: Send Mail */}
          <a
            href={mailUrl}
            data-cta="secondary"
            data-ph-capture-attribute-location="contact_tile"
            onClick={() =>
              trackEvent("outbound_click", {
                destination: "email",
                url: mailUrl,
                location: "contact_tile",
                label: "Send mail",
              })
            }
            className="btn-secondary w-full text-[13px] sm:text-sm min-h-[44px] justify-between px-4 py-2"
          >
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[var(--text-secondary)]" aria-hidden="true" />
              <span>Send mail</span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-[var(--text-tertiary)]" aria-hidden="true" />
          </a>
        </div>
      </div>
    </BentoTile>
  );
}
