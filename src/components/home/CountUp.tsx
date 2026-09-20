"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The stat band's figures, counted up the first time the band is scrolled into view.
 *
 * The values are admin-editable strings, not numbers — "120+", "15+", "6" — so the digits
 * are counted and whatever surrounds them is carried through untouched. A value with no
 * digits at all ("many") simply renders as written rather than animating to nothing.
 *
 * The first render is the final figure, which is also what the server sent: a visitor
 * without JavaScript, and every reader between HTML and hydration, sees the real number.
 * The count only ever starts once the tile is about to be looked at, so the rewind to zero
 * happens while the tile is still hidden behind its own reveal animation.
 */
const DURATION_MS = 1100;

export function CountUp({ value, className }: { value: string; className?: string }) {
  const match = /^(\D*?)(\d+)([\s\S]*)$/.exec(value);
  const target = match ? Number(match[2]) : null;

  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (el === null || target === null) return;
    // A reader who asked for less motion gets the figure, not a slot machine.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    let frame = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();

        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / DURATION_MS, 1);
          // Ease-out: fast off the mark, settling onto the real figure.
          const eased = 1 - Math.pow(1 - p, 3);
          setShown(Math.round(target * eased));
          if (p < 1) frame = requestAnimationFrame(tick);
          else setShown(null);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.3 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [target]);

  if (!match || target === null) return <span className={className}>{value}</span>;

  return (
    <span ref={ref} className={className}>
      {/* `shown === null` before the count starts and again once it lands, so the figure on
          screen is the admin's own string at both ends — padding and all. */}
      {shown === null ? value : `${match[1]}${shown}${match[3]}`}
    </span>
  );
}
