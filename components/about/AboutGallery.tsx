import Image from "next/image";
import { Award } from "lucide-react";

interface ArtPiece {
  filename: string;
  title: string;
  medium: string;
  year: string;
}

const artworks: ArtPiece[] = [
  {
    filename: "art-01.svg",
    title: "Vector Flow & Axis",
    medium: "Digital Vector",
    year: "2025",
  },
  {
    filename: "art-02.svg",
    title: "Topographic Contour",
    medium: "Vector Study",
    year: "2025",
  },
  {
    filename: "art-03.svg",
    title: "Isometric Monolith",
    medium: "Digital Projection",
    year: "2024",
  },
  {
    filename: "art-04.svg",
    title: "Triangular Tension",
    medium: "Fractal Geometry",
    year: "2024",
  },
  {
    filename: "art-05.svg",
    title: "Harmonic Cadence",
    medium: "Vector Series",
    year: "2024",
  },
  {
    filename: "art-06.svg",
    title: "Orbital Duality",
    medium: "Chromatic Orbit",
    year: "2023",
  },
];

const leadershipRoles = [
  {
    role: "Design Team Head",
    org: "Manga & Anime Society, IIT Kharagpur",
    period: "Aug 2024 to Apr 2025",
  },
  {
    role: "Design Coordinator",
    org: "Illumination Magazine, IIT Kharagpur",
    period: "Oct to Dec 2024",
  },
  {
    role: "Web & Design Team",
    org: "Chemical Engineering Association, IIT Kharagpur",
    period: "Aug 2023 to Apr 2024",
  },
];

const awards = [
  {
    title: "Silver Medal",
    event: "Inter-Hall Rangoli Competition, IIT Kharagpur",
    year: "2024",
  },
  {
    title: "Bronze Medal",
    event: "Inter-Hall Rangoli Competition, IIT Kharagpur",
    year: "2023",
  },
];

export function AboutGallery() {
  return (
    <section
      aria-labelledby="design-art-heading"
      className="w-full rounded-3xl bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] p-6 sm:p-8 space-y-8"
    >
      {/* Section Header: Natural Framing */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[var(--border-subtle)] pb-4">
        <div>
          <h2 id="design-art-heading" className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Design & art
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            An engineer who can design: digital illustrations, campus publications, and traditional rangoli.
          </p>
        </div>
        <span className="text-xs text-[var(--text-tertiary)] hidden sm:inline">
          Exhibition & leadership
        </span>
      </div>

      {/* Art Gallery Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-[var(--text-secondary)]">
          Digital artwork
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {artworks.map((art) => (
            <figure
              key={art.filename}
              className="group overflow-hidden rounded-2xl bg-[var(--surface-tile)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] transition-colors"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-900">
                <Image
                  src={`/art/${art.filename}`}
                  alt={`${art.title} (${art.medium}) by Vipin Kaushik`}
                  fill
                  unoptimized
                  loading="eager"
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="p-3 sm:p-3.5 space-y-0.5">
                <div className="flex items-baseline justify-between gap-2">
                  <h4 className="text-xs sm:text-sm font-semibold text-[var(--text-primary)] truncate">
                    {art.title}
                  </h4>
                  <span className="text-[11px] text-[var(--text-tertiary)] tabular-nums shrink-0">
                    {art.year}
                  </span>
                </div>
                <p className="text-[11px] text-[var(--text-tertiary)] truncate">
                  {art.medium}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {/* Compact Leadership & Recognition Lines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-[var(--border-subtle)]">
        {/* Campus Design Leadership */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-[var(--text-secondary)]">
            Campus design leadership
          </h3>
          <ul className="space-y-2.5 text-xs sm:text-sm" role="list">
            {leadershipRoles.map((lead) => (
              <li
                key={lead.org}
                className="flex items-baseline justify-between gap-3 pb-2 border-b border-[var(--border-subtle)] last:border-none"
              >
                <div>
                  <span className="font-semibold text-[var(--text-primary)] block">
                    {lead.role}
                  </span>
                  <span className="text-xs text-[var(--text-secondary)]">
                    {lead.org}
                  </span>
                </div>
                <span className="text-xs text-[var(--text-tertiary)] tabular-nums shrink-0">
                  {lead.period}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Art Competitions: Rangoli */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
            <h3 className="text-xs font-semibold text-[var(--text-secondary)]">
              Competition recognition
            </h3>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm" role="list">
            {awards.map((award) => (
              <li
                key={award.year}
                className="flex items-baseline justify-between gap-3 pb-2 border-b border-[var(--border-subtle)] last:border-none"
              >
                <div>
                  <span className="font-semibold text-[var(--text-primary)] block">
                    {award.title}
                  </span>
                  <span className="text-xs text-[var(--text-secondary)]">
                    {award.event}
                  </span>
                </div>
                <span className="text-xs text-[var(--text-tertiary)] tabular-nums shrink-0">
                  {award.year}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
