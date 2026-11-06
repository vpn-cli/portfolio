"use client";

import { useState } from "react";
import Image from "next/image";
import { Award, Eye, X, ZoomIn } from "lucide-react";

interface ArtPiece {
  filename: string;
  title: string;
  medium: string;
  year: string;
  notes: string;
}

const artworks: ArtPiece[] = [
  {
    filename: "art-01.svg",
    title: "Vector Flow & Axis",
    medium: "Digital Vector Study",
    year: "2025",
    notes: "Exploring directional tension and Bézier curvature in two dimensions.",
  },
  {
    filename: "art-02.svg",
    title: "Topographic Contour",
    medium: "Vector Elevation Study",
    year: "2025",
    notes: "Parametric isolines mapped across simulated height gradients.",
  },
  {
    filename: "art-03.svg",
    title: "Isometric Monolith",
    medium: "Digital Projection",
    year: "2024",
    notes: "Axonometric geometry exploring architectural mass and shadow.",
  },
  {
    filename: "art-04.svg",
    title: "Triangular Tension",
    medium: "Fractal Geometry",
    year: "2024",
    notes: "Subdivided planar tessellations exploring dynamic visual weight.",
  },
  {
    filename: "art-05.svg",
    title: "Harmonic Cadence",
    medium: "Vector Series",
    year: "2024",
    notes: "Rhythmic vector wave sequences rendered in monochrome.",
  },
  {
    filename: "art-06.svg",
    title: "Orbital Duality",
    medium: "Chromatic Orbit",
    year: "2023",
    notes: "Early digital color study on celestial coordinates and radial paths.",
  },
];

const leadershipRoles = [
  {
    role: "Design Team Head",
    org: "Manga & Anime Society, IIT Kharagpur",
    period: "Aug 2024 to Apr 2025",
    scope: "Led 14 student designers producing publications, banners, and digital graphics.",
  },
  {
    role: "Design Coordinator",
    org: "Illumination Magazine, IIT Kharagpur",
    period: "Oct to Dec 2024",
    scope: "Curated typography systems and multi-page editorial spreads.",
  },
  {
    role: "Web & Design Team",
    org: "Chemical Engineering Association, IIT Kharagpur",
    period: "Aug 2023 to Apr 2024",
    scope: "Maintained departmental media, symposium collateral, and print assets.",
  },
];

const awards = [
  {
    title: "Silver Medal",
    event: "Inter-Hall Rangoli Competition, IIT Kharagpur",
    year: "2024",
    badge: "2nd Place Campus-wide",
  },
  {
    title: "Bronze Medal",
    event: "Inter-Hall Rangoli Competition, IIT Kharagpur",
    year: "2023",
    badge: "3rd Place Campus-wide",
  },
];

export function AboutGallery() {
  const [spotlightArt, setSpotlightArt] = useState<ArtPiece | null>(null);

  return (
    <section
      aria-labelledby="design-art-heading"
      className="w-full rounded-[28px] sm:rounded-[32px] bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] p-6 sm:p-8 space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[var(--border-subtle)] pb-4">
        <div>
          <h2 id="design-art-heading" className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Design & visual craft
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            An engineer who designs: digital vector studies, campus publication typography, and traditional rangoli.
          </p>
        </div>
        <span className="text-xs text-[var(--text-tertiary)] hidden sm:inline">
          Exhibition & leadership
        </span>
      </div>

      {/* Art Gallery Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            Digital Vector Exhibition (Click to Inspect)
          </h3>
          <span className="text-xs text-[var(--text-tertiary)] hidden sm:inline">
            Original SVG Artwork
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {artworks.map((art) => (
            <figure
              key={art.filename}
              onClick={() => setSpotlightArt(art)}
              className="group cursor-pointer overflow-hidden rounded-2xl bg-[var(--surface-tile)] border border-[var(--border-subtle)] hover:border-[var(--text-primary)] transition-all duration-200 hover:-translate-y-0.5 shadow-xs"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-950 flex items-center justify-center">
                <Image
                  src={`/art/${art.filename}`}
                  alt={`${art.title} (${art.medium}) by Vipin Kaushik`}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-xs text-xs font-medium">
                    <ZoomIn className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Inspect</span>
                  </span>
                </div>
              </div>
              <figcaption className="p-3.5 space-y-1">
                <div className="flex items-baseline justify-between gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-[var(--text-primary)] truncate">
                    {art.title}
                  </h4>
                  <span className="text-[11px] text-[var(--text-tertiary)] tabular-nums shrink-0 font-mono">
                    {art.year}
                  </span>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)] truncate">
                  {art.medium}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {/* Leadership & Competition Recognition Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-[var(--border-subtle)]">
        {/* Campus Design Leadership */}
        <div className="p-5 rounded-2xl bg-[var(--surface-tile)] border border-[var(--border-subtle)] space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
            Campus Design Leadership
          </h3>
          <ul className="space-y-3 text-xs sm:text-sm" role="list">
            {leadershipRoles.map((lead) => (
              <li
                key={lead.org}
                className="pb-3 border-b border-[var(--border-subtle)] last:border-none last:pb-0 space-y-0.5"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-bold text-[var(--text-primary)]">
                    {lead.role}
                  </span>
                  <span className="text-xs text-[var(--text-tertiary)] tabular-nums font-mono shrink-0">
                    {lead.period}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)]">
                  {lead.org}
                </p>
                <p className="text-[11px] text-[var(--text-tertiary)] leading-normal">
                  {lead.scope}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Art Competitions: Rangoli */}
        <div className="p-5 rounded-2xl bg-[var(--surface-tile)] border border-[var(--border-subtle)] space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" aria-hidden="true" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
                Competition Recognition
              </h3>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm" role="list">
              {awards.map((award) => (
                <li
                  key={award.year}
                  className="pb-3 border-b border-[var(--border-subtle)] last:border-none last:pb-0 space-y-1"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      {award.title}
                    </span>
                    <span className="text-xs text-[var(--text-tertiary)] font-mono tabular-nums">
                      {award.year}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {award.event}
                  </p>
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    {award.badge}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-3 border-t border-[var(--border-subtle)] text-[11px] text-[var(--text-tertiary)]">
            Traditional floor pigment compositions evaluated across color theory, symmetry, and geometric scaling.
          </div>
        </div>
      </div>

      {/* Spotlight Inspection Lightbox Modal */}
      {spotlightArt && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={spotlightArt.title}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSpotlightArt(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-[var(--surface-tile)] border border-[var(--border-hover)] rounded-3xl overflow-hidden p-6 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <div>
                <h4 className="text-lg font-bold text-[var(--text-primary)]">
                  {spotlightArt.title}
                </h4>
                <p className="text-xs text-[var(--text-tertiary)] font-mono">
                  {spotlightArt.medium} · {spotlightArt.year}
                </p>
              </div>

              <button
                onClick={() => setSpotlightArt(null)}
                className="p-2 rounded-full hover:bg-[var(--surface-tile-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                aria-label="Close inspection modal"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-neutral-950 flex items-center justify-center border border-[var(--border-subtle)]">
              <Image
                src={`/art/${spotlightArt.filename}`}
                alt={spotlightArt.title}
                fill
                unoptimized
                className="object-contain p-6"
              />
            </div>

            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              {spotlightArt.notes}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}