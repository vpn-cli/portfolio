"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/content/site";
import { BentoTile } from "./BentoTile";
import { Clock, Disc3 } from "lucide-react";

export function LiveTile({ className = "" }: { className?: string }) {
  const [timeString, setTimeString] = useState<string>("--:--:--");
  const [period, setPeriod] = useState<string>("UTC");

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
        const dayPeriod = parts.find((p) => p.type === "dayPeriod")?.value || "AM";

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
      <div className="w-full h-full flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/25 flex items-center justify-center text-accent">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white/90">Local Time</h3>
              <p className="text-[11px] text-white/40">{siteConfig.city} (PST/PDT)</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Online</span>
          </div>
        </div>

        {/* Large Digital Clock Display */}
        <div className="my-2">
          <div className="flex items-baseline gap-2 font-mono">
            <span className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              {timeString}
            </span>
            <span className="text-sm font-semibold text-accent uppercase">{period}</span>
          </div>
        </div>

        {/* Studio Sound / Ambient Waveform */}
        <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-white/70">
            <Disc3 className="w-3.5 h-3.5 text-accent animate-spin" style={{ animationDuration: "6s" }} />
            <span className="truncate max-w-[170px] sm:max-w-[200px]">
              Studio Focus: Ambient Flow
            </span>
          </div>

          {/* Equalizer Bars */}
          <div className="flex items-end gap-1 h-3.5">
            {[40, 80, 55, 100, 30].map((h, i) => (
              <span
                key={i}
                className="w-1 bg-accent rounded-full animate-pulse"
                style={{
                  height: `${h}%`,
                  animationDuration: `${0.4 + i * 0.15}s`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </BentoTile>
  );
}

