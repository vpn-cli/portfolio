"use client";

import { BentoTile } from "./BentoTile";
import { ArrowUpRight } from "lucide-react";

export function ContactTile({ className = "" }: { className?: string }) {
  const mailUrl =
    "https://mail.google.com/mail/?view=cm&fs=1&to=vipinkaushik20771041@gmail.com&su=Project%20inquiry";

  return (
    <BentoTile className={className}>
      <div className="w-full h-full flex flex-col justify-between py-1">
        <h3 className="text-[18px] sm:text-[20px] xl:text-[22px] 2xl:text-[26px] font-medium text-[var(--text-primary)] leading-[1.25] tracking-tight">
          Have a project in mind?
        </h3>

        <div className="mt-auto pt-4 w-full">
          <a
            href={mailUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="pointer"
            data-cursor-text="Send mail"
            className="w-full flex items-center justify-between px-4 py-3 rounded-full bg-neutral-100 hover:bg-neutral-200/80 border border-neutral-200 hover:border-neutral-300 text-neutral-900 dark:bg-white/[0.06] dark:border-white/[0.08] dark:hover:border-white/20 dark:hover:bg-white/[0.1] dark:text-[#f2f2f2] transition-all duration-200 group active:scale-98 cursor-pointer"
          >
            <span className="text-xs sm:text-sm font-medium">Send mail</span>

            <div className="w-5 h-5 flex items-center justify-center text-neutral-500 group-hover:text-neutral-900 dark:text-neutral-400 dark:group-hover:text-white transition-colors">
              <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </a>
        </div>
      </div>
    </BentoTile>
  );
}
