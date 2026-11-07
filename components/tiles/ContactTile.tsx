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
      <div className="w-full h-full flex flex-col justify-between p-1 sm:p-2">
        {/* Top Header: CTA */}
        <div className="space-y-2">
          <h3 className="text-[26px] sm:text-[30px] xl:text-[32px] 2xl:text-[36px] font-bold text-[var(--text-primary)] leading-[1.1] tracking-[-0.03em]">
            Let’s talk.
          </h3>
          <p className="text-[14px] sm:text-[15px] xl:text-[16px] text-[var(--text-secondary)] leading-snug">
            Roles, collaborations, or a chat about backend systems or drawing.
          </p>

          {/* Inlined Local Time & Status */}
          <div className="flex items-start sm:items-center gap-2 text-[14px] sm:text-[15px] xl:text-[16px] text-[var(--text-secondary)] min-h-[24px] leading-snug sm:leading-normal pt-1">
            {timeState ? (
              <>
                {timeState.isSun ? (
                  <Sun className="w-4 h-4 shrink-0 mt-[2px] sm:mt-0 text-[var(--text-secondary)]" aria-hidden="true" />
                ) : (
                  <Moon className="w-4 h-4 shrink-0 mt-[2px] sm:mt-0 text-[var(--text-secondary)]" aria-hidden="true" />
                )}
                <span className="tabular-nums">
                  {timeState.timeStr} in India · {timeState.statusText}
                </span>
              </>
            ) : (
              <span className="invisible select-none inline-flex items-start sm:items-center gap-2" aria-hidden="true">
                <span className="w-4 h-4 shrink-0 mt-[2px] sm:mt-0 inline-block" />
                <span>9:27 AM in India · usually replies within a day</span>
              </span>
            )}
          </div>
        </div>

        {/* Center / Bottom: Large Clickable Email + Copy & Mail Actions */}
        <div className="pt-4 mt-auto space-y-2.5">
          {/* Large clickable email block with copy button */}
          <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-2 p-3 sm:p-3.5 rounded-2xl bg-[var(--surface-tile-elevated)] border border-transparent hover:border-[var(--border-hover)] transition-colors">
            <button
              onClick={handleCopy}
              type="button"
              className="text-left font-medium text-[clamp(13px,3.2vw,16px)] text-[var(--text-primary)] hover:text-sky-500 transition-colors focus-visible:outline-none"
              title="Click to copy email address"
            >
              {email}
            </button>

            <button
              onClick={handleCopy}
              type="button"
              data-ph-capture-attribute-location="contact_tile"
              aria-label={copied ? "Email copied to clipboard" : "Copy email address"}
              className="w-full sm:w-auto px-3 py-1.5 rounded-xl bg-[var(--surface-tile)] hover:bg-[var(--surface-tile-hover)] border border-transparent text-[13px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center justify-center gap-1.5 transition-colors shrink-0 cursor-pointer active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
                  <span className="text-emerald-500 font-medium">Copied</span>
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
              data-ph-capture-attribute-location="contact_tile"
              onClick={() =>
                trackEvent("outbound_click", {
                  destination: "email",
                  url: mailUrl,
                  location: "contact_tile",
                })
              }
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
