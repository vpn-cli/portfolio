"use client";

import { useState, useEffect } from "react";
import { ArrowUpRight, Copy, Check, Mail, Sun, Moon, MapPin } from "lucide-react";
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
    ? "probably asleep, I'll reply in the morning"
    : "I usually reply within a day";

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
    let intervalId: ReturnType<typeof setInterval> | null = null;
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
    trackEvent("email_copy", { location: "about_contact" });
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(email);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
        return;
      }
      throw new Error("Clipboard API unavailable");
    } catch {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = email;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        (document as any).execCommand?.("copy");
        document.body.removeChild(textarea);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } catch {
        /* Clipboard copy failed silently */
      }
    }
  };

  const mailUrl = `mailto:${email}?subject=Opportunity%20Inquiry%20-%20Vipin%20Kaushik`;

  return (
    <section
      aria-labelledby="contact-heading"
      className="w-full pt-8 pb-4 border-t border-[var(--border-subtle)] space-y-8"
      style={{ contentVisibility: "auto", containIntrinsicSize: "auto 700px" }}
    >
      <div className="space-y-4 max-w-2xl">
        <h2 id="contact-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--text-primary)]">
          Get in touch
        </h2>

        <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
          I&apos;m looking for full-time software engineering roles starting after I graduate in April 2027. Email me if you want to talk about backend systems or design.
        </p>

        {/* Local time line */}
        <div className="flex flex-wrap items-center gap-4 text-[13px] sm:text-sm text-[var(--text-tertiary)] min-h-[24px] pt-1 tabular-nums">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[var(--text-tertiary)] shrink-0" aria-hidden="true" />
            <span>IIT Kharagpur</span>
          </div>

          <div className="flex items-center gap-1.5">
            {timeState ? (
              <>
                {timeState.isSun ? (
                  <Sun className="w-4 h-4 shrink-0 text-[var(--text-tertiary)]" aria-hidden="true" />
                ) : (
                  <Moon className="w-4 h-4 shrink-0 text-[var(--text-tertiary)]" aria-hidden="true" />
                )}
                <span>
                  {timeState.timeStr} in India, {timeState.statusText}
                </span>
              </>
            ) : (
              <span className="invisible select-none inline-flex items-center gap-2" aria-hidden="true">
                <span className="w-4 h-4 shrink-0 inline-block" />
                <span>9:27 AM in India, I usually reply within a day</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Heroic closing moment: large email text with Copy button, Send email CTA in accent */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-4 border-t border-[var(--border-subtle)]">
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleCopy}
            type="button"
            className="text-left text-lg sm:text-2xl lg:text-3xl font-medium text-[var(--text-primary)] hover:text-[var(--accent-text)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] rounded-md cursor-pointer tracking-tight min-h-[44px] flex items-center"
            title="Click to copy email address"
          >
            {email}
          </button>

          {/* Secondary button: neutral surface with hairline border, primary text color */}
          <button
            onClick={handleCopy}
            type="button"
            data-cta="secondary"
            data-ph-capture-attribute-location="about_contact"
            aria-label={copied ? "Email copied to clipboard" : "Copy email address"}
            className="btn-secondary text-[13px] sm:text-sm min-h-[44px] px-3.5"
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

        {/* Primary CTA: Exactly one primary style (accent fill, white text) */}
        <a
          href={mailUrl}
          data-cta="primary"
          data-ph-capture-attribute-location="about_contact"
          onClick={() =>
            trackEvent("outbound_click", {
              destination: "email",
              url: mailUrl,
              location: "about_contact",
              label: "Send mail",
            })
          }
          className="btn-primary text-sm sm:text-base self-start sm:self-auto shrink-0"
        >
          <Mail className="w-4 h-4 text-current" aria-hidden="true" />
          <span>Send email</span>
          <ArrowUpRight className="w-4 h-4 text-current" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
