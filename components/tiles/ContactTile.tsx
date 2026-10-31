"use client";

import { useState } from "react";
import { BentoTile } from "./BentoTile";
import { siteConfig } from "@/content/site";
import { Copy, Check } from "lucide-react";

export function ContactTile({ className = "" }: { className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.email);
    } catch {
      const el = document.createElement("textarea");
      el.value = siteConfig.email;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }

    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1800);
  };

  return (
    <BentoTile className={className}>
      <div className="w-full h-full flex flex-col justify-between py-1">
        <h3 className="text-[18px] sm:text-[20px] xl:text-[22px] 2xl:text-[26px] font-medium text-[#f2f2f2] leading-[1.25] tracking-tight">
          Have a project in mind?
        </h3>

        <div className="mt-auto pt-4 w-full">
          <button
            onClick={handleCopy}
            type="button"
            data-cursor="pointer"
            data-cursor-text={copied ? "Copied!" : "Copy email"}
            className="w-full flex items-center justify-between px-4 py-3 rounded-full bg-white/[0.06] border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.1] text-[#f2f2f2] transition-all duration-200 group active:scale-98 cursor-pointer"
          >
            <span className="text-xs sm:text-sm font-medium">
              {copied ? "Copied!" : "Copy email"}
            </span>

            <div className="w-5 h-5 flex items-center justify-center text-neutral-400 group-hover:text-white transition-colors">
              {copied ? (
                <Check className="w-4 h-4 text-white" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </div>
          </button>
        </div>
      </div>
    </BentoTile>
  );
}
