"use client";

import { Download } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export function ResumeDownloadButton() {
  return (
    <a
      href="/resume.pdf"
      download="Vipin_Kaushik_Resume.pdf"
      data-ph-capture-attribute-location="about_resume"
      onClick={() =>
        trackEvent("outbound_click", {
          destination: "resume",
          url: "/resume.pdf",
          location: "about_resume",
        })
      }
      className="inline-flex items-center justify-center gap-2 flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-[var(--text-primary)] text-[var(--bg-canvas)] text-xs sm:text-sm font-semibold hover:opacity-90 active:scale-98 transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 cursor-pointer"
    >
      <Download className="w-4 h-4" aria-hidden="true" />
      <span>Download Résumé</span>
    </a>
  );
}

