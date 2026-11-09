"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Award, ChevronLeft, ChevronRight, X } from "lucide-react";
import { artworks, type Artwork } from "@/content/artworks";
import { useLenisInstance } from "@/components/motion/SmoothScrollProvider";
import { trackEvent } from "@/lib/analytics";

const leadershipRoles = [
  {
    role: "Design Team Head",
    org: "Manga & Anime Society, IIT Kharagpur",
    period: "Aug 2024 to Apr 2025",
    scope: "Led 14 student designers on publications, banners and social graphics.",
  },
  {
    role: "Design Coordinator",
    org: "Illumination Magazine, IIT Kharagpur",
    period: "Oct to Dec 2024",
    scope: "Set the typography and laid out multi-page spreads.",
  },
  {
    role: "Web & Design Team",
    org: "Chemical Engineering Association, IIT Kharagpur",
    period: "Aug 2023 to Apr 2024",
    scope: "Kept the department's media, symposium material and print assets up to date.",
  },
];

const awards = [
  {
    title: "Silver Medal",
    event: "Inter-Hall Rangoli Competition, IIT Kharagpur",
    year: "2024",
    badge: "2nd place",
  },
  {
    title: "Bronze Medal",
    event: "Inter-Hall Rangoli Competition, IIT Kharagpur",
    year: "2023",
    badge: "3rd place",
  },
];

export function AboutGallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const viewedArtworks = useRef<Set<string>>(new Set());

  const { lenis } = useLenisInstance();
  const currentArt: Artwork | null = activeIndex !== null ? artworks[activeIndex] : null;

  // Track analytics event once per piece per page view
  useEffect(() => {
    if (currentArt && !viewedArtworks.current.has(currentArt.slug)) {
      viewedArtworks.current.add(currentArt.slug);
      trackEvent("artwork_view", { artwork: currentArt.slug });
    }
  }, [currentArt]);

  // Lock Lenis & document scroll when lightbox is open
  useEffect(() => {
    if (activeIndex !== null) {
      lenis?.stop();
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        lenis?.start();
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [activeIndex, lenis]);

  const openLightbox = (index: number) => {
    setActiveIndex(index);
  };

  const closeLightbox = useCallback(() => {
    const prevIndex = activeIndex;
    setActiveIndex(null);
    if (prevIndex !== null && triggerRefs.current[prevIndex]) {
      requestAnimationFrame(() => {
        triggerRefs.current[prevIndex]?.focus();
      });
    }
  }, [activeIndex]);

  const showPrev = useCallback(() => {
    setActiveIndex((prev) => (prev !== null ? (prev === 0 ? artworks.length - 1 : prev - 1) : null));
  }, []);

  const showNext = useCallback(() => {
    setActiveIndex((prev) => (prev !== null ? (prev === artworks.length - 1 ? 0 : prev + 1) : null));
  }, []);

  // Keyboard navigation & focus trap
  useEffect(() => {
    if (activeIndex === null) return;

    // Focus close button on open
    requestAnimationFrame(() => {
      closeBtnRef.current?.focus();
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeLightbox();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        showPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        showNext();
      } else if (e.key === "Tab") {
        if (!dialogRef.current) return;
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, closeLightbox, showPrev, showNext]);

  return (
    <section
      aria-labelledby="design-art-heading"
      className="w-full space-y-8"
      style={{ contentVisibility: "auto", containIntrinsicSize: "auto 700px" }}
    >
      <div className="pb-2">
        <h2 id="design-art-heading" className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          Design
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
          Digital illustrations, character studies and campus event posters.
        </p>
      </div>

      {/* Masonry-style gallery: 3-col desktop, 2-col tablet, 1-col mobile */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 sm:gap-6 space-y-5 sm:space-y-6">
        {artworks.map((art, index) => (
          <figure
            key={art.slug}
            className="break-inside-avoid group block"
          >
            <button
              ref={(el) => {
                triggerRefs.current[index] = el;
              }}
              type="button"
              onClick={() => openLightbox(index)}
              className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] rounded-xl cursor-pointer block"
              aria-label={`Open lightbox for ${art.title}, ${art.medium} (${art.year})`}
            >
              <div className="overflow-hidden rounded-xl bg-[var(--surface-tile)] transition-transform duration-200 group-hover:scale-[1.01]">
                <Image
                  src={`/art/${art.file}`}
                  alt={art.alt}
                  width={art.width}
                  height={art.height}
                  placeholder={art.blurDataURL ? "blur" : "empty"}
                  blurDataURL={art.blurDataURL}
                  priority={index < 3}
                  loading={index < 3 ? "eager" : "lazy"}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="w-full h-auto object-contain rounded-xl block"
                />
              </div>
              <figcaption className="pt-2.5 pb-1 space-y-0.5">
                <h3 className="text-sm font-normal text-[var(--text-primary)]">
                  {art.title}
                </h3>
                <p className="text-xs text-[var(--text-tertiary)]">
                  {art.medium} · {art.year}
                </p>
              </figcaption>
            </button>
          </figure>
        ))}
      </div>

      {/* Campus design roles and Competitions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-tile)] space-y-3">
          <h3 className="text-sm font-semibold text-[var(--text-tertiary)]">
            Campus design roles
          </h3>
          <ul className="space-y-4 text-sm" role="list">
            {leadershipRoles.map((lead) => (
              <li
                key={lead.org}
                className="space-y-0.5"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-bold text-[var(--text-primary)]">
                    {lead.role}
                  </span>
                  <span className="text-sm text-[var(--text-tertiary)] tabular-nums shrink-0">
                    {lead.period}
                  </span>
                </div>
                <p className="text-sm text-[var(--text-secondary)]">
                  {lead.org}
                </p>
                <p className="text-xs sm:text-sm text-[var(--text-tertiary)] leading-normal">
                  {lead.scope}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-tile)] space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-700 dark:text-amber-400" aria-hidden="true" />
              <h3 className="text-sm font-semibold text-[var(--text-tertiary)]">
                Competitions
              </h3>
            </div>
            <ul className="space-y-4 text-sm" role="list">
              {awards.map((award) => (
                <li
                  key={award.year}
                  className="space-y-1"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-600 dark:bg-amber-400" />
                      {award.title}
                    </span>
                    <span className="text-sm text-[var(--text-tertiary)] tabular-nums">
                      {award.year}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {award.event}
                  </p>
                  <span className="inline-block px-2 py-0.5 rounded text-xs bg-amber-500/15 text-amber-900 dark:text-amber-300 font-medium">
                    {award.badge}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {currentArt && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Artwork: ${currentArt.title}`}
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-3 sm:p-6 md:p-8 animate-fadeIn transition-opacity duration-200"
          onClick={closeLightbox}
        >
          <div
            ref={dialogRef}
            data-ui="lightbox-dialog"
            className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[var(--surface-tile)] border border-[var(--border-hover)] rounded-2xl sm:rounded-3xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header with title, index counter, and close button */}
            <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-3.5 shrink-0 bg-[var(--surface-tile)]">
              <div className="flex items-baseline gap-2.5 min-w-0 pr-3">
                <h3 className="text-sm sm:text-base font-normal text-[var(--text-primary)] truncate">
                  {currentArt.title}
                </h3>
                <span className="text-xs text-[var(--text-tertiary)] tabular-nums shrink-0">
                  {(activeIndex ?? 0) + 1} of {artworks.length}
                </span>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={showPrev}
                  className="p-1.5 sm:p-2 rounded-full hover:bg-[var(--surface-tile-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                  aria-label="Previous artwork"
                >
                  <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={showNext}
                  className="p-1.5 sm:p-2 rounded-full hover:bg-[var(--surface-tile-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                  aria-label="Next artwork"
                >
                  <ChevronRight className="w-5 h-5" aria-hidden="true" />
                </button>
                <button
                  ref={closeBtnRef}
                  type="button"
                  onClick={closeLightbox}
                  className="p-1.5 sm:p-2 rounded-full hover:bg-[var(--surface-tile-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer ml-1"
                  aria-label="Close artwork lightbox"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Modal image preview area */}
            <div className="relative flex-1 min-h-0 bg-neutral-950/60 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
              <div className="relative max-w-full max-h-[64vh] flex items-center justify-center">
                <Image
                  src={`/art/${currentArt.file}`}
                  alt={currentArt.alt}
                  width={currentArt.width}
                  height={currentArt.height}
                  priority
                  className="max-h-[64vh] w-auto max-w-full object-contain rounded-lg"
                />
              </div>
            </div>

            {/* Modal footer with medium, year, and note */}
            <div className="px-4 py-3 sm:px-6 sm:py-3.5 bg-[var(--surface-tile)] shrink-0 space-y-1">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-xs text-[var(--text-secondary)]">
                  {currentArt.medium}
                </span>
                <span className="text-xs text-[var(--text-tertiary)] tabular-nums">
                  {currentArt.year}
                </span>
              </div>
              {currentArt.note && (
                <p className="text-xs sm:text-sm text-[var(--text-tertiary)] leading-relaxed">
                  {currentArt.note}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
