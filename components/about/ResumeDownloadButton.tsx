"use client";

import { Download } from "lucide-react";
import { trackEvent, getOutboundDestination } from "@/lib/analytics";

export function ResumeDownloadButton() {
  const resumeUrl = "/resume.pdf";

  return (
    <a
      href={resumeUrl}
      download="Vipin_Kaushik_Resume.pdf"
      data-ph-capture-attribute-location="about_resume"
      data-cta="primary"
      onClick={() =>
        trackEvent("outbound_click", {
          destination: getOutboundDestination(resumeUrl, "resume"),
          url: resumeUrl,
          location: "about_resume",
          label: "Download Résumé",
        })
      }
      className="btn-primary flex-1 sm:flex-initial text-sm"
    >
      <Download className="w-4 h-4 text-white" aria-hidden="true" />
      <span>Download Résumé</span>
    </a>
  );
}
