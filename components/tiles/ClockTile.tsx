"use client";

import { useState, useEffect, useRef } from "react";
import { BentoTile } from "./BentoTile";
import { Sun, Sunset, Moon } from "lucide-react";

interface ClockState {
  hours: number;
  minutes: number;
  seconds: number;
  digitalTime: string;
  dateString: string;
  isoString: string;
}

// Compute UTC offset in minutes for a given timezone and date using Intl
function getTimezoneOffsetMinutes(tz: string, date: Date): number {
  try {
    const str = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(date);

    const [d, t] = str.split(", ");
    const [m, day, y] = d.split("/").map(Number);
    const [h, min, s] = t.split(":").map(Number);
    const asUtc = Date.UTC(y, m - 1, day, h === 24 ? 0 : h, min, s);
    return Math.round((asUtc - date.getTime()) / 60000);
  } catch {
    return 330; // fallback IST offset (+5:30)
  }
}

// Extract IST hour, minute, second, digital time string and formatted date
function getIstTime(date = new Date(), mockTimeStr?: string | null): ClockState {
  if (mockTimeStr) {
    const [mockH, mockM] = mockTimeStr.split(":").map(Number);
    const h = isNaN(mockH) ? 12 : mockH;
    const m = isNaN(mockM) ? 0 : mockM;
    const s = 0;
    const hour12 = h % 12 || 12;
    const ampm = h >= 12 ? "PM" : "AM";
    const digitalTime = `${hour12}:${String(m).padStart(2, "0")} ${ampm}`;
    return {
      hours: h,
      minutes: m,
      seconds: s,
      digitalTime,
      dateString: "Sun, 1 Nov",
      isoString: `2026-11-01T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00+05:30`,
    };
  }

  // Exact IST breakdown via Intl
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  let h = 0,
    m = 0,
    s = 0;
  for (const part of parts) {
    if (part.type === "hour") h = parseInt(part.value, 10);
    if (part.type === "minute") m = parseInt(part.value, 10);
    if (part.type === "second") s = parseInt(part.value, 10);
  }
  if (h === 24) h = 0;

  // Digital time formatted e.g. "11:40 PM"
  const digitalTime = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);

  // Formatted date e.g. "Sun, 1 Nov"
  const dateParts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    day: "numeric",
    month: "short",
  }).formatToParts(date);

  const weekday = dateParts.find((p) => p.type === "weekday")?.value || "";
  const day = dateParts.find((p) => p.type === "day")?.value || "";
  const month = dateParts.find((p) => p.type === "month")?.value || "";
  const dateString = `${weekday}, ${day} ${month}`;

  // ISO string for <time datetime="...">
  const isoString = date.toISOString();

  return { hours: h, minutes: m, seconds: s, digitalTime, dateString, isoString };
}

// Compute visitor relative offset e.g. "4h 30m ahead of you" or "9h 30m behind you"
function getVisitorOffset(date: Date, mockTz?: string | null): string | null {
  try {
    const visitorTz =
      mockTz ||
      (typeof window !== "undefined"
        ? Intl.DateTimeFormat().resolvedOptions().timeZone
        : null);

    if (!visitorTz) return null;

    // If visitor is in IST, hide offset
    if (visitorTz === "Asia/Kolkata" || visitorTz === "Asia/Calcutta") {
      return null;
    }

    const istOffset = getTimezoneOffsetMinutes("Asia/Kolkata", date);
    const visitorOffset = getTimezoneOffsetMinutes(visitorTz, date);
    const diffMinutes = istOffset - visitorOffset;

    if (diffMinutes === 0) return null;

    const absDiff = Math.abs(diffMinutes);
    const hours = Math.floor(absDiff / 60);
    const mins = absDiff % 60;
    const parts: string[] = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (mins > 0) parts.push(`${mins}m`);
    const duration = parts.join(" ") || "0m";

    // If diffMinutes > 0, IST is ahead of visitor
    return diffMinutes > 0 ? `${duration} ahead of you` : `${duration} behind you`;
  } catch {
    return null;
  }
}

// 12 clock tick marks
const TICKS = Array.from({ length: 12 }, (_, i) => ({
  index: i,
  deg: i * 30,
  isMajor: i % 3 === 0,
}));

export function ClockTile({ className = "" }: { className?: string }) {
  // SSR initial state avoids hydration flicker
  const initialRef = useRef<ClockState | null>(null);
  if (!initialRef.current) {
    initialRef.current = getIstTime(new Date());
  }

  const [clock, setClock] = useState<ClockState>(initialRef.current);
  const [visitorOffset, setVisitorOffset] = useState<string | null>(null);

  // Cumulative seconds reference for smooth monotonic rotation
  const cumulativeSecondsRef = useRef<number>(
    initialRef.current.hours * 3600 +
      initialRef.current.minutes * 60 +
      initialRef.current.seconds
  );
  const lastIstTotalRef = useRef<number>(
    initialRef.current.hours * 3600 +
      initialRef.current.minutes * 60 +
      initialRef.current.seconds
  );

  useEffect(() => {
    // Check mock params from query string or window
    const urlParams = new URLSearchParams(window.location.search);
    const mockTime =
      urlParams.get("mockTime") ||
      (typeof window !== "undefined" ? (window as any).__MOCK_IST_TIME__ : null);
    const mockTz =
      urlParams.get("mockTz") ||
      (typeof window !== "undefined" ? (window as any).__MOCK_VISITOR_TZ__ : null);

    let timerId: ReturnType<typeof setTimeout> | null = null;
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const updateClock = () => {
      const now = new Date();
      const nextState = getIstTime(now, mockTime);

      const currentIstTotal =
        nextState.hours * 3600 + nextState.minutes * 60 + nextState.seconds;

      // Handle midnight wrap or elapsed delta
      let delta = currentIstTotal - lastIstTotalRef.current;
      if (delta < 0) {
        delta += 86400; // wrapped past midnight
      }
      cumulativeSecondsRef.current += delta;
      lastIstTotalRef.current = currentIstTotal;

      setClock(nextState);
      setVisitorOffset(getVisitorOffset(now, mockTz));
    };

    const scheduleNext = () => {
      if (mockTime) return; // static mock mode does not tick
      const now = Date.now();
      const intervalMs = isReduced ? 60000 : 1000;
      const delay = intervalMs - (now % intervalMs);

      timerId = setTimeout(() => {
        updateClock();
        scheduleNext();
      }, delay);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (timerId) clearTimeout(timerId);
      } else {
        updateClock();
        scheduleNext();
      }
    };

    // Initial sync
    updateClock();
    scheduleNext();

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      if (timerId) clearTimeout(timerId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Compute angles
  const totalSec = cumulativeSecondsRef.current;
  const secondAngle = totalSec * 6;
  const minuteAngle = (clock.minutes + clock.seconds / 60) * 6;
  const hourAngle =
    ((clock.hours % 12) + clock.minutes / 60 + clock.seconds / 3600) * 30;

  // Status configuration based on IST hours
  // 9 AM–7 PM (9 <= hours < 19): ☀ Working hours · quick replies
  // 7 PM–11 PM (19 <= hours < 23): 🌆 Evening · replies soon
  // 11 PM–9 AM (hours >= 23 || hours < 9): 🌙 Probably asleep · replies by morning
  const hours = clock.hours;
  let statusText = "Working hours · quick replies";
  let StatusIcon = Sun;
  let statusIconColor = "text-amber-500";

  if (hours >= 19 && hours < 23) {
    statusText = "Evening · replies soon";
    StatusIcon = Sunset;
    statusIconColor = "text-orange-400";
  } else if (hours >= 23 || hours < 9) {
    statusText = "Probably asleep · replies by morning";
    StatusIcon = Moon;
    statusIconColor = "text-indigo-400";
  }

  return (
    <BentoTile
      className={className}
      noPadding
      ariaLabel="Vipin's local time in India"
      cursorText="IST Time"
    >
      <div className="w-full h-full flex flex-col justify-between p-5 sm:p-6 box-border select-none">
        {/* Top Header Labels */}
        <div className="flex items-center justify-between text-[13px] text-[var(--text-tertiary)] font-medium leading-none">
          <span>Local time</span>
          <span>IST · UTC+05:30</span>
        </div>

        {/* Center: Analog Clock Face (SVG) + Digital Time */}
        <div className="my-auto flex flex-col items-center justify-center py-1 sm:py-2">
          {/* Minimal Swiss Analog Clock Face */}
          <svg
            viewBox="0 0 160 160"
            aria-hidden="true"
            className="w-[124px] h-[124px] sm:w-[136px] sm:h-[136px] xl:w-[130px] xl:h-[130px] shrink-0"
          >
            {/* Outer Ring & Theme-Aware Face Base */}
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="var(--clock-face-bg)"
              stroke="var(--clock-face-ring)"
              strokeWidth="1.2"
            />

            {/* 12 Tick Marks */}
            {TICKS.map((t) => (
              <line
                key={t.index}
                x1="80"
                y1={t.isMajor ? "16" : "17"}
                x2="80"
                y2={t.isMajor ? "25" : "23"}
                stroke={t.isMajor ? "var(--clock-tick-major)" : "var(--clock-tick-minor)"}
                strokeWidth={t.isMajor ? "1.75" : "1"}
                strokeLinecap="round"
                transform={`rotate(${t.deg} 80 80)`}
              />
            ))}

            {/* Hour Hand */}
            <line
              x1="80"
              y1="85"
              x2="80"
              y2="46"
              stroke="var(--clock-hand-primary)"
              strokeWidth="3.5"
              strokeLinecap="round"
              className="clock-hour-hand"
              style={{
                transform: `rotate(${hourAngle}deg)`,
                transformOrigin: "80px 80px",
              }}
            />

            {/* Minute Hand */}
            <line
              x1="80"
              y1="87"
              x2="80"
              y2="30"
              stroke="var(--clock-hand-primary)"
              strokeWidth="2.25"
              strokeLinecap="round"
              className="clock-minute-hand"
              style={{
                transform: `rotate(${minuteAngle}deg)`,
                transformOrigin: "80px 80px",
              }}
            />

            {/* Seconds Hand (Accent Coloured, with Counterbalance Tail) */}
            <line
              x1="80"
              y1="94"
              x2="80"
              y2="24"
              stroke="var(--accent-color)"
              strokeWidth="1.25"
              strokeLinecap="round"
              className="clock-second-hand"
              style={{
                transform: `rotate(${secondAngle}deg)`,
                transformOrigin: "80px 80px",
              }}
            />

            {/* Center Pivot Collar & Pin */}
            <circle cx="80" cy="80" r="3.5" fill="var(--clock-hand-primary)" />
            <circle cx="80" cy="80" r="1.5" fill="var(--accent-color)" />
          </svg>

          {/* Digital Time & Date */}
          <div className="flex flex-col items-center mt-2">
            <time
              dateTime={clock.isoString}
              suppressHydrationWarning
              className="text-[24px] sm:text-[26px] font-bold text-[var(--text-primary)] leading-tight tracking-tight tabular-nums"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {clock.digitalTime}
            </time>
            <span
              suppressHydrationWarning
              className="text-[12px] sm:text-[13px] text-[var(--text-tertiary)] font-normal mt-0.5"
            >
              {clock.dateString}
            </span>
          </div>
        </div>

        {/* Bottom Status & Visitor Offset Line */}
        <div className="pt-2 border-t border-[var(--border-subtle)] flex flex-col gap-0.5">
          <div
            suppressHydrationWarning
            className="flex items-center gap-1.5 text-[12px] sm:text-[13px] text-[var(--text-secondary)] font-medium truncate"
          >
            <StatusIcon
              className={`w-3.5 h-3.5 shrink-0 ${statusIconColor}`}
              aria-hidden="true"
            />
            <span className="truncate">{statusText}</span>
          </div>
          {visitorOffset && (
            <span
              suppressHydrationWarning
              className="text-[11px] sm:text-[12px] text-[var(--text-tertiary)] font-normal pl-5 truncate"
            >
              {visitorOffset}
            </span>
          )}
        </div>
      </div>
    </BentoTile>
  );
}