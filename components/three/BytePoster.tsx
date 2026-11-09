"use client";

export default function BytePoster({ patCount }: { patCount?: number | null }) {
  return (
    <div
      className="relative w-full h-full min-h-[190px] sm:min-h-[210px] select-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Top Header Labels - matching ByteScene */}
      <div className="absolute top-3.5 left-4 right-4 flex items-center justify-between pointer-events-none z-20 gap-2">
        <span className="text-[13px] font-medium text-[var(--text-secondary)] shrink-0">
          Byte
        </span>
        <span className="text-[12px] sm:text-[13px] text-[var(--text-tertiary)] truncate text-right">
          <span className="hidden xl:inline">desk </span>companion
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
              className="fill-[rgba(120,113,108,0.22)] dark:fill-[rgba(0,0,0,0.6)]"
            />

            {/* Tiny Round Left Foot */}
            <ellipse
              cx="76"
              cy="156"
              rx="15"
              ry="9"
              className="fill-[#e8e5dc] dark:fill-[#1c1f26] stroke-[#ded9cf] dark:stroke-[#2d313c]"
              strokeWidth="1.2"
            />

            {/* Tiny Round Right Foot */}
            <ellipse
              cx="124"
              cy="156"
              rx="15"
              ry="9"
              className="fill-[#e8e5dc] dark:fill-[#1c1f26] stroke-[#ded9cf] dark:stroke-[#2d313c]"
              strokeWidth="1.2"
            />

            {/* Left Stub Arm */}
            <ellipse
              cx="45"
              cy="114"
              rx="11"
              ry="16"
              transform="rotate(18 45 114)"
              className="fill-[#eae6dd] dark:fill-[#1f2229] stroke-[#dfdad0] dark:stroke-[#2e323e]"
              strokeWidth="1.2"
            />

            {/* Right Stub Arm */}
            <ellipse
              cx="155"
              cy="114"
              rx="11"
              ry="16"
              transform="rotate(-18 155 114)"
              className="fill-[#eae6dd] dark:fill-[#1f2229] stroke-[#dfdad0] dark:stroke-[#2e323e]"
              strokeWidth="1.2"
            />

            {/* Antenna Stalk */}
            <rect
              x="98"
              y="32"
              width="4"
              height="20"
              rx="2"
              className="fill-[#c4beaf] dark:fill-[#333844]"
            />

            {/* Antenna Glowing Ball */}
            <circle
              cx="100"
              cy="28"
              r="8"
              fill="#38bdf8"
              className="stroke-[#0284c7] dark:stroke-[#7dd3fc]"
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
              className="fill-[url(#lightBodyGrad)] dark:fill-[url(#darkBodyGrad)] stroke-[#e2ded4] dark:stroke-[#2e323d]"
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
              className="stroke-[#222630] dark:stroke-[#1c2029]"
              strokeWidth="1.2"
            />

            {/* Cheek Blush Dots */}
            <ellipse cx="73" cy="107" rx="6" ry="3.5" fill="#fb7185" className="opacity-35 dark:opacity-45" />
            <ellipse cx="127" cy="107" rx="6" ry="3.5" fill="#fb7185" className="opacity-35 dark:opacity-45" />

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
      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between pointer-events-none z-20 text-[12.5px] sm:text-[13px] text-[var(--text-tertiary)] gap-2">
        <span className="truncate">pat me</span>
        <span className="shrink-0 text-right tabular-nums">
          {patCount !== undefined && patCount !== null
            ? `${patCount.toLocaleString()} pats`
            : "pats"}
        </span>
      </div>
    </div>
  );
}
