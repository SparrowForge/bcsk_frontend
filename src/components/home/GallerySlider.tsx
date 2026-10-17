"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { reveal } from "@/lib/motion";

/**
 * The gallery's paged strip: up to three cards in one frame, arrows and one dot per frame
 * underneath, as the school's mockup draws it.
 *
 * Like `CardSlider` it is a native scroll-snap scroller, so swipe, trackpad and keyboard all
 * work without help; unlike it, it pages a whole frame at a time and never moves on its own —
 * photos are something a visitor browses, not a ticker. The frame count is measured from the
 * strip rather than assumed from the breakpoint classes, so the dots stay right at any width.
 *
 * Filter chips sit above it when the albums span more than one category. Changing the filter
 * remounts the strip (`key`) so it starts from the first frame.
 */
export function GallerySlider({
  items,
  groups,
  allLabel,
  label,
  prevLabel,
  nextLabel,
  slideLabel,
}: {
  items: { key: string; group: string | null; node: React.ReactNode }[];
  groups: string[];
  allLabel: string;
  label: string;
  prevLabel: string;
  nextLabel: string;
  slideLabel: string;
}) {
  const [filter, setFilter] = useState<string | null>(null);
  const visible = filter ? items.filter((i) => i.group === filter) : items;

  return (
    <>
      {groups.length > 1 && (
        <div {...reveal("up", 1, 90)} className="mt-6 flex flex-wrap justify-center gap-2" role="group" aria-label={label}>
          {[null, ...groups].map((g) => {
            const on = filter === g;
            return (
              <button
                key={g ?? "all"}
                type="button"
                aria-pressed={on}
                onClick={() => setFilter(g)}
                className={`press rounded-full px-4 py-1.5 text-[12.5px] font-bold transition-colors ${
                  on ? "bg-green text-white shadow-[0_8px_16px_-10px_rgba(0,77,57,0.9)]" : "bg-white text-ink-soft ring-1 ring-line hover:text-green hover:ring-green/40"
                }`}
              >
                {g ?? allLabel}
              </button>
            );
          })}
        </div>
      )}
      <Strip key={filter ?? "all"} items={visible} label={label} prevLabel={prevLabel} nextLabel={nextLabel} slideLabel={slideLabel} />
    </>
  );
}

function Strip({
  items,
  label,
  prevLabel,
  nextLabel,
  slideLabel,
}: {
  items: { key: string; node: React.ReactNode }[];
  label: string;
  prevLabel: string;
  nextLabel: string;
  slideLabel: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(0);

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el || !el.clientWidth) return;
    const n = Math.max(1, Math.round(el.scrollWidth / el.clientWidth));
    setPages(n);
    // At the far end the last frame may be a partial one; count it as the last dot.
    const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 2;
    setPage(atEnd ? n - 1 : Math.min(n - 1, Math.round(el.scrollLeft / el.clientWidth)));
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure]);

  const go = (to: number) => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: to * el.clientWidth, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    // The reveal goes on the strip as a whole, never on the cards: a card waiting off to the
    // right is not intersecting the viewport and would slide in blank (see CardSlider).
    <div {...reveal("up", 2, 90)} className="mt-7">
      {/* `-mx-3` cancels each card's gutter so the outer cards line up with the band; `py-3`
          leaves room for the hover lift and its shadow, which the scroller would clip. */}
      <div
        ref={ref}
        role="region"
        aria-label={label}
        onScroll={measure}
        className="no-scrollbar -mx-3 flex overflow-x-auto py-3 snap-x snap-mandatory scroll-smooth motion-reduce:scroll-auto"
      >
        {items.map((item) => (
          // `min-w-0` so a long, truncated album title cannot widen its card (see CardSlider).
          <div key={item.key} className="min-w-0 shrink-0 snap-start basis-full px-3 sm:basis-1/2 lg:basis-1/3">
            {item.node}
          </div>
        ))}
      </div>

      {pages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-3">
          <Arrow label={prevLabel} disabled={page === 0} onClick={() => go(page - 1)}>
            <path d="m15 5-7 7 7 7" />
          </Arrow>
          <div className="flex items-center gap-1">
            {Array.from({ length: pages }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => go(i)}
                aria-label={`${slideLabel} ${i + 1}`}
                aria-current={i === page || undefined}
                // A 24px target around a small dot: the dot is the picture, the button is the hit area.
                className="grid h-6 w-6 place-items-center"
              >
                <span
                  aria-hidden
                  className={`block h-2.5 rounded-full transition-all ${i === page ? "w-6 bg-crimson" : "w-2.5 bg-green/25 hover:bg-green/50"}`}
                />
              </button>
            ))}
          </div>
          <Arrow label={nextLabel} disabled={page >= pages - 1} onClick={() => go(page + 1)}>
            <path d="m9 5 7 7-7 7" />
          </Arrow>
        </div>
      )}
    </div>
  );
}

function Arrow({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="press grid h-9 w-9 place-items-center rounded-full border border-green/20 bg-white text-green shadow-sm hover:bg-green hover:text-white disabled:pointer-events-none disabled:opacity-40"
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {children}
      </svg>
    </button>
  );
}
