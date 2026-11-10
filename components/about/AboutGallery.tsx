"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
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
  const [mounted, setMounted] = useState(false);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const viewedArtworks = useRef<Set<string>>(new Set());

  // Track client mount for createPortal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Touch gesture tracking for mobile swipe & tap
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const isSwipeAction = useRef(false);

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

  // Preload next and previous images for instant switching
  useEffect(() => {
    if (activeIndex === null) return;
    const prevIdx = activeIndex === 0 ? artworks.length - 1 : activeIndex - 1;
    const nextIdx = activeIndex === artworks.length - 1 ? 0 : activeIndex + 1;

    const preload = (file: string) => {
      if (typeof window !== "undefined") {
        const img = new window.Image();
        img.src = `/art/${file}`;
      }
    };

    preload(artworks[prevIdx].file);
    preload(artworks[nextIdx].file);
  }, [activeIndex]);

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

  // Touch gesture handling: swipe to switch, tap backdrop to close
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (absX > 40 && absX > absY * 1.5) {
      isSwipeAction.current = true;
      setTimeout(() => {
        isSwipeAction.current = false;
      }, 350);
      if (deltaX < 0) {
        showNext();
      } else {
        showPrev();
      }
    } else if (absX < 15 && absY < 15 && e.target === e.currentTarget) {
      // Direct tap on backdrop - prevent synthetic click from hitting underlying gallery buttons
      e.preventDefault();
      closeLightbox();
    } else {
      isSwipeAction.current = false;
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isSwipeAction.current) {
      return;
    }
    if (e.target === e.currentTarget) {
      closeLightbox();
    }
  };

  return (
    <section
      aria-labelledby="design-art-heading"
      className="w-full space-y-8"
      style={{ contentVisibility: "auto", containIntrinsicSize: "auto 700px" }}
    >
      <style>{`
        @keyframes artworkFade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @media (prefers-reduced-motion: no-preference) {
          .artwork-crossfade {
            animation: artworkFade 200ms ease-out forwards;
          }
        }

        /* Gallery piece button base: outline-free, border-free, card-free */
        .gallery-piece-btn {
          outline: none !important;
          box-shadow: none !important;
          border: none !important;
          background: transparent !important;
        }
        .gallery-piece-btn:focus {
          outline: none !important;
          box-shadow: none !important;
        }
        .gallery-piece-btn:focus:not(:focus-visible) {
          outline: none !important;
          box-shadow: none !important;
        }
        .gallery-piece-btn:focus:not(:focus-visible) .gallery-piece-img {
          outline: none !important;
          box-shadow: none !important;
        }

        /* Focus-visible ring on the image only for keyboard Tab users */
        .gallery-piece-btn:focus-visible .gallery-piece-img {
          box-shadow: 0 0 0 3px var(--bg-canvas-subtle, transparent), 0 0 0 4.5px var(--accent-color, #2B4EFF) !important;
        }
      `}</style>

      <div className="pb-2">
        <h2 id="design-art-heading" className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          Design
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Digital illustrations, character studies and campus event posters.
        </p>
      </div>

      {/* Gallery grid: runs wider than the text column so the art has more presence */}
      <div className="-mx-2 sm:-mx-6 lg:-mx-10 columns-1 sm:columns-2 lg:columns-3 gap-6 sm:gap-8">
        {artworks.map((art, index) => (
          <figure
            key={art.slug}
            className="break-inside-avoid mb-6 sm:mb-8 block"
          >
            <button
              ref={(el) => {
                triggerRefs.current[index] = el;
              }}
              type="button"
              onClick={() => openLightbox(index)}
              className="gallery-piece-btn group w-full text-left cursor-pointer block select-none border-0 bg-transparent p-0"
              aria-label={`Open lightbox for ${art.title}, ${art.medium}`}
            >
              <div className="gallery-piece-img overflow-hidden rounded-xl transition-all duration-300">
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
                  className="w-full h-auto object-contain rounded-xl block transition-all duration-300 ease-out group-hover:scale-[1.015] group-hover:brightness-[1.03]"
                />
              </div>
              <figcaption className="pt-2.5 sm:pt-3 space-y-0.5 text-left">
                <h3 className="text-sm sm:text-base font-normal text-[var(--text-primary)] leading-snug">
                  {art.title}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-tertiary)] leading-normal">
                  {art.medium}
                </p>
              </figcaption>
            </button>
          </figure>
        ))}
      </div>

      {/* Campus design roles and Competitions: Compact two-column directory, NO cards, NO orange badges/dots */}
      <div className="pt-8 border-t border-[var(--border-subtle)] grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Campus design roles */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] tracking-tight">
            Campus design roles
          </h3>
          <ul className="divide-y divide-[var(--border-subtle)] text-sm" role="list">
            {leadershipRoles.map((lead) => (
              <li key={lead.org} className="py-3 first:pt-0 last:pb-0 space-y-1">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-normal text-[var(--text-primary)]">
                    {lead.role}
                  </span>
                  <span className="text-xs text-[var(--text-tertiary)] tabular-nums shrink-0 font-normal">
                    {lead.period}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)]">
                  {lead.org}
                </p>
                <p className="text-xs text-[var(--text-tertiary)] leading-relaxed">
                  {lead.scope}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Competitions */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] tracking-tight">
            Competitions
          </h3>
          <ul className="divide-y divide-[var(--border-subtle)] text-sm" role="list">
            {awards.map((award) => (
              <li key={award.year} className="py-3 first:pt-0 last:pb-0 space-y-1">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-normal text-[var(--text-primary)]">
                    {award.title}
                  </span>
                  <span className="text-xs text-[var(--text-tertiary)] tabular-nums shrink-0 font-normal">
                    {award.year}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)]">
                  {award.event}
                </p>
                <p className="text-xs text-[var(--text-tertiary)] font-normal">
                  {award.badge}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Lightbox Modal: Portal to document.body for true full-screen overlay */}
      {currentArt &&
        mounted &&
        createPortal(
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={`Artwork: ${currentArt.title}`}
            tabIndex={-1}
            className="fixed inset-0 z-50 flex items-center justify-center select-none overflow-hidden"
            style={{ backgroundColor: "rgba(5, 5, 5, 0.92)" }}
            onClick={handleBackdropClick}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Close icon in top-right corner */}
            <button
              ref={closeBtnRef}
              type="button"
              onClick={closeLightbox}
              onTouchEnd={(e) => {
                e.stopPropagation();
                closeLightbox();
              }}
              aria-label="Close lightbox (Esc)"
              className="fixed top-3 right-3 sm:top-5 sm:right-5 z-50 min-w-[44px] min-h-[44px] w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center bg-transparent border-0 text-white/50 hover:text-white focus-visible:text-white transition-colors cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-white/40 rounded-sm"
            >
              <X className="w-6 h-6" aria-hidden="true" />
            </button>

            {/* Previous arrow at left edge */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                showPrev();
              }}
              onTouchEnd={(e) => {
                e.stopPropagation();
                showPrev();
              }}
              aria-label="Previous artwork (Left arrow)"
              className="fixed left-1 sm:left-4 top-1/2 -translate-y-1/2 z-50 min-w-[44px] min-h-[44px] w-12 h-20 sm:w-16 sm:h-24 flex items-center justify-center bg-transparent border-0 text-white/40 hover:text-white focus-visible:text-white transition-colors cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-white/40 rounded-sm"
            >
              <ChevronLeft className="w-8 h-8 sm:w-9 sm:h-9" aria-hidden="true" />
            </button>

            {/* Next arrow at right edge */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                showNext();
              }}
              onTouchEnd={(e) => {
                e.stopPropagation();
                showNext();
              }}
              aria-label="Next artwork (Right arrow)"
              className="fixed right-1 sm:right-4 top-1/2 -translate-y-1/2 z-50 min-w-[44px] min-h-[44px] w-12 h-20 sm:w-16 sm:h-24 flex items-center justify-center bg-transparent border-0 text-white/40 hover:text-white focus-visible:text-white transition-colors cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-white/40 rounded-sm"
            >
              <ChevronRight className="w-8 h-8 sm:w-9 sm:h-9" aria-hidden="true" />
            </button>

            {/* Centered image & caption: fits fully on screen at all viewports without scrolling */}
            <div
              key={currentArt.slug}
              className="artwork-crossfade relative flex flex-col items-center justify-center max-w-[90vw] max-h-[88vh] pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
              onTouchEnd={(e) => e.stopPropagation()}
            >
              <Image
                src={`/art/${currentArt.file}`}
                alt={currentArt.alt}
                width={currentArt.width}
                height={currentArt.height}
                priority
                className="max-h-[74vh] sm:max-h-[78vh] max-w-[88vw] sm:max-w-[90vw] w-auto h-auto object-contain block select-none pointer-events-none"
              />

              {/* Lightbox caption: title, medium, and optional note only */}
              <div className="mt-3 sm:mt-4 text-center max-w-lg px-3 space-y-0.5 select-text">
                <h3 className="text-sm sm:text-base font-normal text-white/85 tracking-normal">
                  {currentArt.title}
                </h3>
                <p className="text-xs sm:text-sm text-white/70">
                  {currentArt.medium}
                </p>
                {currentArt.note && (
                  <p className="text-xs sm:text-sm text-white/65 pt-0.5 leading-relaxed">
                    {currentArt.note}
                  </p>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}
