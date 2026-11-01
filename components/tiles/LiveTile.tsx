"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/content/site";
import { BentoTile } from "./BentoTile";

export function LiveTile({ className = "" }: { className?: string }) {
  const [timeString, setTimeString] = useState<string>("--:--:--");
  const [period, setPeriod] = useState<string>("IST");

  useEffect(() => {
    const updateClock = () => {
      try {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat("en-US", {
          timeZone: siteConfig.timezone,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });

        const parts = formatter.formatToParts(now);
        const hour = parts.find((p) => p.type === "hour")?.value || "00";
        const minute = parts.find((p) => p.type === "minute")?.value || "00";
        const second = parts.find((p) => p.type === "second")?.value || "00";
        const dayPeriod = parts.find((p) => p.type === "dayPeriod")?.value || "PM";

        setTimeString(`${hour}:${minute}:${second}`);
        setPeriod(dayPeriod);
      } catch {
        setTimeString(new Date().toLocaleTimeString());
      }
    };

    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <BentoTile className={className}>
      <div className="w-full h-full flex flex-col justify-between py-0.5">
        <div className="flex items-center justify-between">
          <span className="type-label2 text-[var(--text-tertiary)] font-medium">
            Local Time
          </span>
          <span className="text-[10px] font-mono text-[var(--text-tertiary)]">
            {siteConfig.city}
          </span>
        </div>

        <div className="my-auto py-1">
          <div className="flex items-baseline gap-1.5 font-mono">
            <span className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
              {timeString}
            </span>
            <span className="text-xs font-medium text-[var(--text-tertiary)]">{period}</span>
          </div>
        </div>

        {/* Ambient Waveform Audio Indicator */}
        <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
          <span>Focus: Coding</span>
          <div className="flex items-end gap-1 h-3">
            {[35, 75, 45, 90, 40].map((h, i) => (
              <span
                key={i}
                className="w-0.5 bg-[var(--text-tertiary)] rounded-full motion-safe:animate-pulse"
                style={{
                  height: `${h}%`,
                  animationDuration: `${0.5 + i * 0.15}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </BentoTile>
  );
}
