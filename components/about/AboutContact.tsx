"use client";

import { useState, useEffect } from "react";
import { ArrowUpRight, Copy, Check, Mail, Sun, Moon } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface LocalTimeState {
  timeStr: string;
  isSun: boolean;
  statusText: string;
}

function getIstStatus(): LocalTimeState {
  const now = new Date();

  const hourFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    hourCycle: "h23",
  });
  const hour24 = parseInt(hourFormatter.format(now), 10);

  const timeStr = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(now);

  const isSun = hour24 >= 8 && hour24 < 20;
  const isNight = hour24 >= 22 || hour24 < 8;
  const statusText = isNight
    ? "probably asleep, replies in the morning"
    : "usually replies within a day";

  return { timeStr, isSun, statusText };
}

export function AboutContact() {
  const email = "vipinkaushik20771041@gmail.com";
  const [copied, setCopied] = useState(false);
  const [timeState, setTimeState] = useState<LocalTimeState | null>(null);

  useEffect(() => {
    const update = () => {
      setTimeState(getIstStatus());
    };
    update();

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
    trackEvent("email_copy");
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
    <section aria-labelledby="contact-heading" className="w-full">
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface-tile)] border border-[var(--border-subtle)] space-y-6">
        <div className="space-y-2">
          <h2 id="contact-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            Let’s talk.
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)]">
            Roles, collaborations, or a chat about backend systems or drawing.
          </p>

          <div className="flex items-center gap-2 text-xs sm:text-sm text-[var(--text-secondary)] min-h-[22px] pt-1">
            {timeState ? (
              <>
                {timeState.isSun ? (
                  <Sun className="w-3.5 h-3.5 shrink-0 text-amber-500" aria-hidden="true" />
                ) : (
                  <Moon className="w-3.5 h-3.5 shrink-0 text-slate-400" aria-hidden="true" />
                )}
                <span className="tabular-nums">
                  {timeState.timeStr} in India ({timeState.statusText})
                </span>
              </>
            ) : (
              <span className="invisible select-none inline-flex items-center gap-2" aria-hidden="true">
                <span className="w-3.5 h-3.5 shrink-0 inline-block" />
                <span>9:27 AM in India (usually replies within a day)</span>
              </span>
            )}
          </div>
        </div>

        {/* Email & Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)]">
          <button
            onClick={handleCopy}
            type="button"
            className="text-left font-medium text-sm sm:text-base text-[var(--text-primary)] hover:text-sky-500 transition-colors focus-visible:outline-none"
            title="Click to copy email address"
          >
            {email}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              type="button"
              aria-label={copied ? "Email copied to clipboard" : "Copy email address"}
              className="px-3.5 py-2 rounded-xl bg-[var(--surface-tile)] hover:bg-[var(--surface-tile-hover)] border border-[var(--border-subtle)] text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-95"
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

            <a
              href={mailUrl}
              onClick={() => trackEvent("send_mail_click")}
              className="px-4 py-2 rounded-xl bg-[var(--text-primary)] text-[var(--bg-canvas)] text-xs font-medium hover:opacity-90 flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <Mail className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Send mail</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-80" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
