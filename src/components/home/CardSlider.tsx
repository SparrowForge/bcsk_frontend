"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { reveal } from "@/lib/motion";

const STEP_MS = 3200;

/**
 * The auto-advancing card strip shared by the Teacher Panel and the Opinions band.
 *
 * It is a *native* horizontal scroller, not a transform carousel, and that choice carries
 * most of the behaviour for free: a phone swipes it, a trackpad flicks it, a keyboard tabs
 * through the cards and the browser scrolls them into view on its own. All this component
 * adds is a timer that nudges it one card along.
 *
 * The loop is seamless because the list is rendered **twice**. Advancing past the end of the
 * first copy lands on an identical card in the second, so the scroll position can be pulled
 * back by exactly one copy's width with no animation and nothing moves on screen. Snapping
 * back from the end of a single list would instead rewind the whole strip in view.
 *
 * Three things stop it from being the kind of carousel that fights its reader, which is what
 * WCAG 2.2.2 is about: it pauses while the pointer is over it or the keyboard is inside it,
 * it carries an explicit pause control, and it never starts at all when the visitor has asked
 * for reduced motion — the same preference the rest of the page's animation honours.
 *
 * `items` arrive already rendered, so a server component can hand over links and markup
 * without the cards themselves becoming client code.
 */
export function CardSlider({
  items,
  label,
  basis,
  footer,
  t,
}: {
  items: { key: string; node: React.ReactNode }[];
  /** Names the scroll region for assistive tech — the band's own heading. */
  label: string;
  /** Tailwind basis classes per breakpoint, written in full so Tailwind generates them. */
  basis: string;
  /** Anything that sits at the right of the control row, such as a "see all" link. */
  footer?: React.ReactNode;
  t: Dictionary;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  // How many actually fit *now*, measured rather than assumed from the basis classes: a strip
  // that already shows everything must not creep sideways for no reason.
  const [perView, setPerView] = useState(Infinity);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  // Bumped by every deliberate move — a button press, a swipe. It is in the timer's
  // dependencies, so each interaction tears the timer down and grants a fresh full interval:
  // the reader always gets STEP_MS to look at what they just scrolled to, and an auto-step
  // can never land in the middle of the scroll they started. Hover and focus cover a mouse
  // and a keyboard; a touch screen has neither, which is what this is really for.
  const [nudge, setNudge] = useState(0);

  const loops = items.length > perView;
  const cards = loops ? [...items, ...items] : items;

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const measure = () => {
      const card = el.querySelector<HTMLElement>("[data-card]");
      if (card?.offsetWidth) setPerView(Math.max(1, Math.round(el.clientWidth / card.offsetWidth)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /**
   * Move by `dir` cards, wrapping invisibly at the seam between the two copies. The rewind
   * happens *before* the animated scroll, never after: correcting the position first means
   * the reader only ever sees the one smooth step.
   */
  const step = useCallback(
    (dir: 1 | -1) => {
      const el = viewportRef.current;
      if (!el) return;
      const card = el.querySelector<HTMLElement>("[data-card]");
      if (!card?.offsetWidth) return;
      // One copy measured from the cards, not as half of `scrollWidth`: the two differ by a
      // pixel or two of sub-pixel rounding, and rewinding by the wrong amount would walk the
      // strip slowly out of alignment on every lap.
      const copy = card.offsetWidth * items.length;
      if (loops) {
        // `behavior: "instant"` is load-bearing. The element carries `scroll-smooth`, and
        // under it even a plain `scrollLeft` assignment animates — so the rewind would glide
        // backwards and the `scrollBy` below would immediately cancel it, leaving the strip
        // to run to the end of the second copy and stop dead. This is the explicit opt-out.
        if (dir === 1 && el.scrollLeft >= copy - 1)
          el.scrollTo({ left: el.scrollLeft - copy, behavior: "instant" });
        // Going backwards off the front: jump forward one copy first, so there is room to
        // scroll back into. Without this the strip simply stops at zero.
        if (dir === -1 && el.scrollLeft <= 1)
          el.scrollTo({ left: el.scrollLeft + copy, behavior: "instant" });
      }
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollBy({ left: dir * card.offsetWidth, behavior: reduced ? "auto" : "smooth" });
    },
    [loops, items.length],
  );

  const nudgeStep = useCallback(
    (dir: 1 | -1) => {
      setNudge((n) => n + 1);
      step(dir);
    },
    [step],
  );

  useEffect(() => {
    if (!loops || paused || hovered) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      // A background tab still fires intervals; scrolling one would bank up a long, jerky
      // catch-up the moment the reader comes back.
      if (!document.hidden) step(1);
    }, STEP_MS);
    return () => clearInterval(id);
  }, [loops, paused, hovered, nudge, step]);

  return (
    // The reveal goes on the strip as a whole, never on the cards. A card sitting outside
    // the viewport *horizontally* is not intersecting it, so a per-card `data-reveal` would
    // leave the ones waiting off to the right at opacity 0 and slide them in blank.
    <div
      {...reveal("up", 1, 90)}
      className="mt-5"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setHovered(true)}
      onBlurCapture={() => setHovered(false)}
    >
      {/* `-mx-2.5` cancels the padding each card carries as its gutter, so the first and last
          cards line up with the band bar above rather than sitting inside it. `py-2` leaves
          room for the hover lift and its shadow, which the scroller would otherwise clip. */}
      <div
        ref={viewportRef}
        // `aria-live="off"`: the cards are a rotating view of one list, not news arriving.
        // Announcing each step would talk over whatever the reader is actually doing.
        role="region"
        aria-label={label}
        aria-live="off"
        onPointerDown={() => setNudge((n) => n + 1)}
        className="no-scrollbar -mx-2.5 flex overflow-x-auto py-2 scroll-smooth motion-reduce:scroll-auto snap-x snap-mandatory"
      >
        {cards.map((item, i) => {
          // The second copy exists only to make the wrap seamless. `inert` takes it out of
          // both the tab order and the accessibility tree — otherwise a keyboard would tab
          // through every link twice and a screen reader would read the whole list twice.
          const copy = loops && i >= items.length;
          return (
            <div
              key={`${item.key}-${i}`}
              data-card
              aria-hidden={copy || undefined}
              inert={copy || undefined}
              className={`shrink-0 snap-start px-2.5 ${basis}`}
            >
              {item.node}
            </div>
          );
        })}
      </div>

      {/* Controls and the way out of the band share a row: the strip is wide, and stacking
          three small rows under it would turn the footer into more furniture than content. */}
      {(loops || footer) && (
        <div className="mt-3 flex items-center justify-between gap-3">
          {loops ? (
            <div className="flex items-center gap-2">
              <StripButton label={t.common.previous} onClick={() => nudgeStep(-1)}>
                <path d="m15 5-7 7 7 7" />
              </StripButton>
              <StripButton
                label={paused ? t.common.play : t.common.pause}
                onClick={() => setPaused((p) => !p)}
                pressed={paused}
              >
                {paused ? <path d="M7 4v16l13-8z" /> : <path d="M8 4v16M16 4v16" />}
              </StripButton>
              <StripButton label={t.common.next} onClick={() => nudgeStep(1)}>
                <path d="m9 5 7 7-7 7" />
              </StripButton>
            </div>
          ) : (
            <span />
          )}
          {footer}
        </div>
      )}
    </div>
  );
}

function StripButton({
  label,
  onClick,
  pressed,
  children,
}: {
  label: string;
  onClick: () => void;
  pressed?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      {...(pressed === undefined ? {} : { "aria-pressed": pressed })}
      className="press flex h-8 w-8 items-center justify-center rounded-full border border-green/20 bg-white text-green hover:bg-green hover:text-white"
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {children}
      </svg>
    </button>
  );
}
