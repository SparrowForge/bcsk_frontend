import Link from "next/link";
import { paletteFor } from "@/lib/academic-palette";
import type { AcademicClassCard } from "@/services/types";

/**
 * One class on the All General Classes page, after the design's "Mathematics" reference card:
 * a photo with the class name, and a triangle of the class colour in the bottom-right corner.
 * On hover or keyboard focus the triangle sweeps up across the whole card - the photo still
 * showing through - and reveals the summary and a Learn more button.
 *
 * The sweep animates `clip-path` between two triangles with the same three vertices, so the
 * browser can interpolate it. The whole card is the link: on a touch screen there is no hover,
 * and a tap simply opens the class.
 */
export function ClassCard({ c }: { c: AcademicClassCard }) {
  const p = paletteFor(c.color);
  return (
    <Link
      href={`/academic/classes/${c.slug}`}
      className="group relative isolate block aspect-[4/5] overflow-hidden rounded-2xl rounded-tr-[3rem] bg-mist shadow-[0_16px_32px_-20px_rgba(0,0,0,0.55)] focus-visible:outline-none focus-visible:ring-4"
      style={{ ["--tw-ring-color" as string]: `${p.base}66` }}
    >
      {c.cardImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={c.cardImageUrl}
          alt=""
          className="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transform-none"
        />
      ) : null}
      {/* Keeps the resting title legible on any photo. */}
      <span aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />

      <span className="absolute bottom-5 left-5 right-24 transition-opacity duration-300 group-hover:opacity-0 group-focus-visible:opacity-0">
        <span className="block font-display text-2xl font-bold leading-tight text-white drop-shadow">{c.name}</span>
        {c.ageRange && <span className="mt-0.5 block text-sm font-semibold text-white/85">{c.ageRange}</span>}
        {c.summary && <span className="sr-only">{c.summary}</span>}
      </span>

      {/* A visual repeat of the text above, so screen readers skip it. */}
      <span
        aria-hidden
        className="absolute inset-0 flex flex-col items-center justify-center px-7 text-center text-white transition-[clip-path] duration-700 ease-out [clip-path:polygon(100%_74%,100%_100%,74%_100%)] group-hover:[clip-path:polygon(100%_-110%,100%_100%,-110%_100%)] group-focus-visible:[clip-path:polygon(100%_-110%,100%_100%,-110%_100%)] motion-reduce:transition-none"
        style={{ backgroundColor: `${p.base}E6` }}
      >
        <span className="opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:delay-300 group-focus-visible:opacity-100">
          <span className="block font-display text-2xl font-bold">{c.name}</span>
          {c.ageRange && <span className="mt-0.5 block text-sm font-semibold text-white/85">{c.ageRange}</span>}
          {c.summary && <span className="mt-3 block text-[14px] leading-relaxed text-white/95">{c.summary}</span>}
          <span
            className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2 text-[13px] font-bold"
            style={{ color: p.deep }}
          >
            Learn more
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </span>
      </span>
    </Link>
  );
}
