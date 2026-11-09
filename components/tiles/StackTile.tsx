"use client";
/* Hallmark · answered 26b · tech stack display tiles are semantic presentation items without form controls */

import React, { useState, useEffect } from "react";
import type { IconType } from "react-icons";
import {
  SiTypescript,
  SiJavascript,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiExpress,
  SiPostgresql,
  SiDrizzle,
  SiApachekafka,
  SiRedis,
  SiDocker,
  SiVercel,
  SiSupabase,
  SiTailwindcss,
  SiGit,
} from "react-icons/si";
import { BentoTile } from "./BentoTile";
import { siteConfig } from "@/content/site";
import { useTheme } from "@/components/motion/ThemeProvider";

// Official Multi-Color Figma SVG Mark
function FigmaMultiColorIcon({ className = "w-[20px] h-[28px]" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 38 57"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z"
        fill="#1ABCFE"
      />
      <path
        d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z"
        fill="#0ACF83"
      />
      <path
        d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z"
        fill="#FF7262"
      />
      <path
        d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z"
        fill="#F24E1E"
      />
      <path
        d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z"
        fill="#A259FF"
      />
    </svg>
  );
}

// Convert Hex to RGB tuple
function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

interface StackMeta {
  name: string;
  brandHex: string;
  isDarkBrand?: boolean;
  isMultiColor?: boolean;
  Icon?: IconType;
  opticalClass?: string;
}

// Tech tools with official brand colors from simple-icons and optical sizing
const STACK_METADATA: Record<string, StackMeta> = {
  typescript: {
    name: "TypeScript",
    brandHex: "#3178C6",
    Icon: SiTypescript,
    opticalClass: "w-[24px] h-[24px] sm:w-[25px] sm:h-[25px]",
  },
  javascript: {
    name: "JavaScript",
    brandHex: "#F7DF1E",
    Icon: SiJavascript,
    opticalClass: "w-[24px] h-[24px] sm:w-[25px] sm:h-[25px]",
  },
  react: {
    name: "React",
    brandHex: "#61DAFB",
    Icon: SiReact,
    opticalClass: "w-[27px] h-[27px] sm:w-[29px] sm:h-[29px]",
  },
  nextjs: {
    name: "Next.js",
    brandHex: "#000000",
    isDarkBrand: true,
    Icon: SiNextdotjs,
    opticalClass: "w-[26px] h-[26px] sm:w-[27px] sm:h-[27px]",
  },
  nodejs: {
    name: "Node.js",
    brandHex: "#5FA04E",
    Icon: SiNodedotjs,
    opticalClass: "w-[26px] h-[26px] sm:w-[28px] sm:h-[28px]",
  },
  express: {
    name: "Express",
    brandHex: "#0A0A0A",
    isDarkBrand: true,
    Icon: SiExpress,
    opticalClass: "w-[27px] h-[22px] sm:w-[29px] sm:h-[24px]",
  },
  postgresql: {
    name: "PostgreSQL",
    brandHex: "#4169E1",
    Icon: SiPostgresql,
    opticalClass: "w-[26px] h-[26px] sm:w-[28px] sm:h-[28px]",
  },
  postgres: {
    name: "PostgreSQL",
    brandHex: "#4169E1",
    Icon: SiPostgresql,
    opticalClass: "w-[26px] h-[26px] sm:w-[28px] sm:h-[28px]",
  },
  drizzle: {
    name: "Drizzle",
    brandHex: "#C5F74F",
    Icon: SiDrizzle,
    opticalClass: "w-[27px] h-[27px] sm:w-[29px] sm:h-[29px]",
  },
  kafka: {
    name: "Kafka",
    brandHex: "#231F20",
    isDarkBrand: true,
    Icon: SiApachekafka,
    opticalClass: "w-[25px] h-[25px] sm:w-[27px] sm:h-[27px]",
  },
  redis: {
    name: "Redis",
    brandHex: "#FF4438",
    Icon: SiRedis,
    opticalClass: "w-[26px] h-[26px] sm:w-[27px] sm:h-[27px]",
  },
  docker: {
    name: "Docker",
    brandHex: "#2496ED",
    Icon: SiDocker,
    opticalClass: "w-[28px] h-[23px] sm:w-[30px] sm:h-[25px]",
  },
  vercel: {
    name: "Vercel",
    brandHex: "#000000",
    isDarkBrand: true,
    Icon: SiVercel,
    opticalClass: "w-[23px] h-[21px] sm:w-[25px] sm:h-[23px]",
  },
  supabase: {
    name: "Supabase",
    brandHex: "#3FCF8E",
    Icon: SiSupabase,
    opticalClass: "w-[25px] h-[25px] sm:w-[26px] sm:h-[26px]",
  },
  tailwindcss: {
    name: "Tailwind CSS",
    brandHex: "#06B6D4",
    Icon: SiTailwindcss,
    opticalClass: "w-[27px] h-[27px] sm:w-[29px] sm:h-[29px]",
  },
  tailwind: {
    name: "Tailwind CSS",
    brandHex: "#06B6D4",
    Icon: SiTailwindcss,
    opticalClass: "w-[27px] h-[27px] sm:w-[29px] sm:h-[29px]",
  },
  figma: {
    name: "Figma",
    brandHex: "#F24E1E",
    isMultiColor: true,
    opticalClass: "w-[19px] h-[27px] sm:w-[20px] sm:h-[28px]",
  },
  git: {
    name: "Git",
    brandHex: "#F03C2E",
    Icon: SiGit,
    opticalClass: "w-[25px] h-[25px] sm:w-[27px] sm:h-[27px]",
  },
};

export function StackTile({ className = "" }: { className?: string }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Compute theme-aware brand styles
  const getToolStyles = (meta: StackMeta) => {
    const isDarkBrand = meta.isDarkBrand;

    // Primary foreground color of the mark
    let iconColor = meta.brandHex;
    if (isDarkBrand) {
      iconColor = isDark ? "#FFFFFF" : "#111111";
    }

    // Hex for tint calculations
    const calcHex = isDarkBrand
      ? (isDark ? "#FFFFFF" : "#111111")
      : meta.brandHex;
    const [r, g, b] = hexToRgb(calcHex);

    // Subtle background tint (6-8% in light mode, 10-14% in dark mode)
    // Darken slightly for light yellow/neon in light mode to provide strong contrast
    let bgOpacity = isDark ? 0.12 : 0.07;
    let borderOpacity = isDark ? 0.20 : 0.14;

    if (!isDark && (meta.brandHex === "#F7DF1E" || meta.brandHex === "#C5F74F")) {
      // Slightly deeper tint for light yellow/lime in light mode
      bgOpacity = 0.14;
      borderOpacity = 0.24;
    }

    const background = `rgba(${r}, ${g}, ${b}, ${bgOpacity})`;
    const borderColor = `rgba(${r}, ${g}, ${b}, ${borderOpacity})`;
    const hoverBackground = `rgba(${r}, ${g}, ${b}, ${isDark ? 0.22 : 0.15})`;
    const hoverBorder = `rgba(${r}, ${g}, ${b}, ${isDark ? 0.38 : 0.30})`;
    const hoverGlow = `0 4px 18px -2px rgba(${r}, ${g}, ${b}, ${isDark ? 0.35 : 0.22})`;

    return {
      iconColor,
      background,
      borderColor,
      hoverBackground,
      hoverBorder,
      hoverGlow,
    };
  };

  // Stack items from synchronized siteConfig
  const stackItems = siteConfig.techStack.map((tech) => {
    const key = tech.icon?.toLowerCase() || tech.name.toLowerCase().replace(/[\s.-]/g, "");
    const meta = STACK_METADATA[key] || {
      name: tech.name,
      brandHex: tech.color || "#4169E1",
      opticalClass: "w-[26px] h-[26px]",
    };
    return {
      ...tech,
      meta,
    };
  });

  const duplicateItems = stackItems.map((item) => ({
    ...item,
    isDuplicate: true,
  }));

  const marqueeItems = [...stackItems, ...duplicateItems];

  return (
    <BentoTile className={className} noPadding>
      <div className="w-full h-full flex flex-col justify-between p-4 sm:p-5 lg:p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-2 shrink-0">
          <h2 className="text-[18px] sm:text-[20px] font-bold text-[var(--text-primary)] leading-tight tracking-tight">
            Stack I use
          </h2>
          <span className="text-[12px] sm:text-[13px] text-[var(--text-tertiary)] font-medium">
            Core toolchain
          </span>
        </div>

        {/* Screen Reader Summary */}
        <div className="sr-only">
          <p>
            Engineering toolchain: {stackItems.map((s) => s.name).join(", ")}.
          </p>
        </div>

        {/* Reduced motion static wrapped grid */}
        {reducedMotion ? (
          <div
            suppressHydrationWarning
            className="my-auto py-1 grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-x-2.5 gap-y-3.5 max-h-[185px] overflow-visible"
          >
            {stackItems.map((tech) => {
              const styles = getToolStyles(tech.meta);
              const { Icon, opticalClass, isMultiColor } = tech.meta;

              return (
                <div
                  key={tech.name}
                  className="flex flex-col items-center gap-1.5 shrink-0 group focus-visible:outline-none"
                  tabIndex={0}
                  role="img"
                  aria-label={tech.name}
                >
                  <div
                    style={{
                      backgroundColor: styles.background,
                      borderColor: styles.borderColor,
                    }}
                    className="w-[48px] h-[48px] sm:w-[52px] sm:h-[52px] rounded-[16px] border flex items-center justify-center transition-transform duration-200"
                  >
                    {isMultiColor ? (
                      <FigmaMultiColorIcon className={opticalClass} />
                    ) : Icon ? (
                      <Icon
                        className={`${opticalClass} shrink-0`}
                        style={{ color: styles.iconColor }}
                        aria-hidden="true"
                      />
                    ) : (
                      <span className="font-bold text-[12px]" style={{ color: styles.iconColor }}>
                        {tech.name.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="text-[10.5px] sm:text-[11px] font-medium text-[var(--text-tertiary)] text-center whitespace-nowrap overflow-visible max-w-[76px]">
                    {tech.name}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          /* Infinite marquee with edge fades, pauses on hover & keyboard focus */
          <div
            suppressHydrationWarning
            className="relative w-full overflow-hidden my-auto py-2 [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]"
          >
            <div className="animate-marquee flex items-center gap-4 sm:gap-5">
              {marqueeItems.map((tech, idx) => {
                const styles = getToolStyles(tech.meta);
                const { Icon, opticalClass, isMultiColor } = tech.meta;
                const isDup = Boolean((tech as any).isDuplicate);

                return (
                  <div
                    key={`${tech.name}-${idx}`}
                    className="flex flex-col items-center gap-1.5 shrink-0 group focus-visible:outline-none disabled:opacity-50 cursor-default"
                    tabIndex={isDup ? -1 : 0}
                    role={isDup ? undefined : "img"}
                    aria-label={isDup ? undefined : tech.name}
                    aria-hidden={isDup ? "true" : undefined}
                  >
                    {/* Tool Icon Square with subtle brand tint & soft hover glow */}
                    <div
                      style={
                        {
                          "--tool-bg": styles.background,
                          "--tool-border": styles.borderColor,
                          "--tool-hover-bg": styles.hoverBackground,
                          "--tool-hover-border": styles.hoverBorder,
                          "--tool-hover-glow": styles.hoverGlow,
                        } as React.CSSProperties
                      }
                      className="w-[50px] h-[50px] sm:w-[54px] sm:h-[54px] rounded-[16px] border flex items-center justify-center shrink-0 transition-[background-color,border-color,box-shadow,transform] duration-200 ease-out group-hover:scale-105 group-hover:-translate-y-0.5"
                    >
                      {isMultiColor ? (
                        <FigmaMultiColorIcon className={opticalClass} />
                      ) : Icon ? (
                        <Icon
                          className={`${opticalClass} shrink-0 transition-transform duration-200`}
                          style={{ color: styles.iconColor }}
                          aria-hidden="true"
                        />
                      ) : (
                        <span className="font-bold text-[13px]" style={{ color: styles.iconColor }}>
                          {tech.name.slice(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>

                    {/* Tech Name Label Under Icon */}
                    <span className="text-[10.5px] sm:text-[11px] font-medium text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] transition-colors text-center whitespace-nowrap overflow-visible max-w-[76px] select-none">
                      {tech.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        div[style*="--tool-bg"] {
          background-color: var(--tool-bg);
          border-color: var(--tool-border);
        }
        div[style*="--tool-bg"]:hover {
          background-color: var(--tool-hover-bg) !important;
          border-color: var(--tool-hover-border) !important;
          box-shadow: var(--tool-hover-glow) !important;
        }
      `}</style>
    </BentoTile>
  );
}
