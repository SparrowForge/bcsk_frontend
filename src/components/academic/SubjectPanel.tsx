import { paletteFor } from "@/lib/academic-palette";
import type { ClassSubject } from "@/services/types";
import { QuarterSign } from "./QuarterSign";

/**
 * One book on a class page, as the design's final panels draw it: the subject's name, a short
 * rule and its description across two thirds, and a coloured third holding the book cover with
 * the subject's colour sign at its foot. The outer corners are rounded - bottom-left on the text,
 * top-right on the picture - so a stack of panels reads as one ribbon down the page.
 */
export function SubjectPanel({ s, step }: { s: ClassSubject; step: number }) {
  const p = paletteFor(s.color);
  return (
    <article className="grid overflow-hidden rounded-tr-[3rem] rounded-bl-[3rem] md:grid-cols-[2fr_1fr]">
      <div className="bg-[#EBEEFF] px-6 py-7 sm:px-10 sm:py-9">
        <h3 className="font-display text-2xl font-bold leading-tight sm:text-[1.9rem]" style={{ color: p.deep }}>
          {s.title}
        </h3>
        <span aria-hidden className="mt-4 block h-[3px] w-14 rounded-full" style={{ background: p.base }} />
        {s.description && <p className="mt-4 text-[15px] leading-relaxed text-ink">{s.description}</p>}
        {s.outcomes.length > 0 && (
          <>
            <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.15em] text-ink-soft">Learning outcomes</p>
            <ul className="mt-2.5 grid gap-x-6 gap-y-2 sm:grid-cols-2">
              {s.outcomes.map((o) => (
                <li key={o} className="flex items-start gap-2 text-[14px] text-ink">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={p.base} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="mt-0.5 shrink-0">
                    <path d="m5 12.5 4.5 4.5L19 7.5" />
                  </svg>
                  {o}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      <div className="flex flex-col items-center justify-between gap-6 px-6 py-7" style={{ background: p.tint }}>
        {s.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={s.coverImageUrl}
            alt={`Cover of ${s.title}`}
            className="w-36 rounded-md shadow-[0_12px_24px_-12px_rgba(0,0,0,0.45)] sm:w-40"
          />
        ) : (
          <span className="grid h-44 w-36 place-items-center rounded-md border-2 border-dashed text-center text-xs font-bold" style={{ borderColor: p.base, color: p.deep }}>
            {s.title}
          </span>
        )}
        <QuarterSign step={step} palette={p} />
      </div>
    </article>
  );
}
