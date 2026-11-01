"use client";

import { useTheme } from "@/components/motion/ThemeProvider";

export default function BytePoster() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className="relative w-full h-full min-h-[190px] sm:min-h-[210px] select-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Top Header Labels - matching ByteScene */}
      <div className="absolute top-4 left-5 right-5 flex items-center justify-between pointer-events-none z-20">
        <span className="text-[13px] font-medium text-[var(--text-secondary)] shrink-0">
          Byte
        </span>
        <span className="text-[12px] sm:text-[13px] text-[var(--text-tertiary)] whitespace-nowrap">
          desk companion
        </span>
      </div>

      {/* Stylized Byte Vector Illustration: strictly inset between top and bottom label bands */}
      <div className="absolute inset-x-0 top-11 bottom-9 flex items-center justify-center p-2">
        <div className="w-[140px] h-[140px] sm:w-[155px] sm:h-[155px] flex items-center justify-center relative">
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full drop-shadow-sm"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Ambient Contact Ground Shadow */}
            <ellipse
              cx="100"
              cy="166"
              rx="46"
              ry="11"
              fill={isDark ? "rgba(0,0,0,0.6)" : "rgba(120,113,108,0.22)"}
            />

            {/* Tiny Round Left Foot */}
            <ellipse
              cx="76"
              cy="156"
              rx="15"
              ry="9"
              fill={isDark ? "#1c1f26" : "#e8e5dc"}
              stroke={isDark ? "#2d313c" : "#ded9cf"}
              strokeWidth="1.2"
            />

            {/* Tiny Round Right Foot */}
            <ellipse
              cx="124"
              cy="156"
              rx="15"
              ry="9"
              fill={isDark ? "#1c1f26" : "#e8e5dc"}
              stroke={isDark ? "#2d313c" : "#ded9cf"}
              strokeWidth="1.2"
            />

            {/* Left Stub Arm */}
            <ellipse
              cx="45"
              cy="114"
              rx="11"
              ry="16"
              transform="rotate(18 45 114)"
              fill={isDark ? "#1f2229" : "#eae6dd"}
              stroke={isDark ? "#2e323e" : "#dfdad0"}
              strokeWidth="1.2"
            />

            {/* Right Stub Arm */}
            <ellipse
              cx="155"
              cy="114"
              rx="11"
              ry="16"
              transform="rotate(-18 155 114)"
              fill={isDark ? "#1f2229" : "#eae6dd"}
              stroke={isDark ? "#2e323e" : "#dfdad0"}
              strokeWidth="1.2"
            />

            {/* Antenna Stalk */}
            <rect
              x="98"
              y="32"
              width="4"
              height="20"
              rx="2"
              fill={isDark ? "#333844" : "#c4beaf"}
            />

            {/* Antenna Glowing Ball */}
            <circle
              cx="100"
              cy="28"
              r="8"
              fill="#38bdf8"
              stroke={isDark ? "#7dd3fc" : "#0284c7"}
              strokeWidth="1.2"
            />
            {/* Antenna Specular Dot */}
            <circle cx="98" cy="26" r="2.2" fill="#ffffff" opacity="0.85" />

            {/* Main Chubby Squashed Sphere Body */}
            <rect
              x="48"
              y="52"
              width="104"
              height="96"
              rx="46"
              fill={isDark ? "url(#darkBodyGrad)" : "url(#lightBodyGrad)"}
              stroke={isDark ? "#2e323d" : "#e2ded4"}
              strokeWidth="1.2"
            />

            {/* Visor Screen (Glossy Dark Display) */}
            <rect
              x="62"
              y="74"
              width="76"
              height="48"
              rx="18"
              fill="#0a0c10"
              stroke={isDark ? "#1c2029" : "#222630"}
              strokeWidth="1.2"
            />

            {/* Cheek Blush Dots */}
            <ellipse cx="73" cy="107" rx="6" ry="3.5" fill="#fb7185" opacity={isDark ? 0.45 : 0.35} />
            <ellipse cx="127" cy="107" rx="6" ry="3.5" fill="#fb7185" opacity={isDark ? 0.45 : 0.35} />

            {/* Big Glowing Oval Eyes */}
            {/* Left Eye */}
            <ellipse cx="85" cy="95" rx="7" ry="11" fill="#38bdf8" />
            <circle cx="87" cy="91" r="2.5" fill="#ffffff" opacity="0.9" />

            {/* Right Eye */}
            <ellipse cx="115" cy="95" rx="7" ry="11" fill="#38bdf8" />
            <circle cx="117" cy="91" r="2.5" fill="#ffffff" opacity="0.9" />

            {/* Definitions for Gradients */}
            <defs>
              <linearGradient id="darkBodyGrad" x1="50" y1="52" x2="150" y2="148" gradientUnits="userSpaceOnUse">
                <stop stopColor="#252932" />
                <stop offset="1" stopColor="#1a1c22" />
              </linearGradient>
              <linearGradient id="lightBodyGrad" x1="50" y1="52" x2="150" y2="148" gradientUnits="userSpaceOnUse">
                <stop stopColor="#ffffff" />
                <stop offset="1" stopColor="#ece7dc" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Bottom Footer Labels - matching ByteScene */}
      <div className="absolute bottom-3 left-5 right-5 flex items-center justify-between pointer-events-none z-20 text-[13px] text-[var(--text-tertiary)]">
        <span>say hi 👋</span>
        <span>active</span>
      </div>
    </div>
  );
}
