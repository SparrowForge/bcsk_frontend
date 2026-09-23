"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { PublicTeacher } from "@/services";
import { reveal } from "@/lib/motion";
import { SectionBar } from "./SectionBar";

/** Cards visible at once at the widest breakpoint; the basis classes below must agree. */
const PER_VIEW = 5;
const STEP_MS = 3200;

/**
 * The teacher band, between the live boards and School Overview — five faces at a time, the
 * rest arriving one at a time as the strip advances.
 *
 * It wears the same band bar as the sections around it rather than sitting as a panel inside
 * one: the staff are a subject of their own, not a footnote to how the school is managed.
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
 */
export function TeacherPanel({ teachers, t }: { teachers: PublicTeacher[]; t: Dictionary }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  // How many actually fit *now*, measured rather than assumed: the basis classes below step
  // 2 → 3 → 4 → 5 across the breakpoints, and a strip that already shows everyone must not
  // creep sideways for no reason.
  const [perView, setPerView] = useState(PER_VIEW);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  // Bumped by every deliberate move — a button press, a swipe. It is in the timer's
  // dependencies, so each interaction tears the timer down and grants a fresh full interval:
  // the reader always gets STEP_MS to look at what they just scrolled to, and an auto-step
  // can never land in the middle of the scroll they started. Hover and focus cover a mouse
  // and a keyboard; a touch screen has neither, which is what this is really for.
  const [nudge, setNudge] = useState(0);

  const loops = teachers.length > perView;
  const cards = loops ? [...teachers, ...teachers] : teachers;

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
      const copy = card.offsetWidth * teachers.length;
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
    [loops, teachers.length],
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

  if (teachers.length === 0) return null;

  return (
    <section className="logo-shade logo-shade-left mx-auto max-w-7xl px-4 mt-12">
      <SectionBar>{t.home.teacherPanel}</SectionBar>

      {/* The reveal goes on the strip as a whole, never on the cards. A card sitting outside
          the viewport *horizontally* is not intersecting it, so a per-card `data-reveal`
          would leave the ones waiting off to the right at opacity 0 and slide them in blank. */}
      <div
        {...reveal("up", 1, 90)}
        className="mt-5"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocusCapture={() => setHovered(true)}
        onBlurCapture={() => setHovered(false)}
      >
        {/* `-mx-2` cancels the padding each card carries as its gutter, so the first and last
            cards line up with the band bar above rather than sitting 8px inside it. */}
        <div
          ref={viewportRef}
          // `aria-live="off"`: the cards are a rotating view of one list, not news arriving.
          // Announcing each step would talk over whatever the reader is actually doing.
          role="region"
          aria-label={t.home.teacherPanel}
          aria-live="off"
          onPointerDown={() => setNudge((n) => n + 1)}
          className="no-scrollbar -mx-2 flex overflow-x-auto scroll-smooth motion-reduce:scroll-auto snap-x snap-mandatory"
        >
          {cards.map((tp, i) => (
            <div
              key={`${tp.teacherId}-${i}`}
              data-card
              // The second copy exists only to make the wrap seamless; to a screen reader it
              // would otherwise be the whole staff read out twice.
              aria-hidden={loops && i >= teachers.length}
              className="shrink-0 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 snap-start px-2"
            >
              <TeacherCard teacher={tp} index={i} t={t} />
            </div>
          ))}
        </div>

        {/* Controls and the way out of the band share a row: the strip is wide, and stacking
            three small rows under it would turn the footer into more furniture than content. */}
        <div className="mt-4 flex items-center justify-between gap-3">
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
          <Link
            href="/bcsk/teachers"
            className="text-green-mid text-xs font-bold hover:underline underline-offset-4"
          >
            {t.home.viewTeachers} →
          </Link>
        </div>
      </div>
    </section>
  );
}

/** One face. Compact on purpose — five of these share the sheet the CMS panels get alone. */
function TeacherCard({ teacher, index, t }: { teacher: PublicTeacher; index: number; t: Dictionary }) {
  return (
    <article className="h-full rounded-lg border border-line bg-white px-3 py-4 text-center hover-lift">
      {teacher.photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={teacher.photoUrl}
          alt={teacher.name}
          className="mx-auto h-16 w-16 rounded-full object-cover"
        />
      ) : (
        <div
          className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full font-display text-lg font-semibold ${
            ["bg-green text-white", "bg-green-mid text-white", "bg-green-deep text-white", "bg-crimson text-white"][
              index % 4
            ]
          }`}
          aria-hidden
        >
          {teacher.name.split(" ").slice(-2).map((w) => w[0]).join("")}
        </div>
      )}
      <h4 className="mt-3 text-[13px] font-bold leading-snug text-ink">{teacher.name}</h4>
      {teacher.designation && (
        <p className="mt-0.5 text-[10px] font-extrabold uppercase tracking-wide text-crimson-ink">
          {teacher.designation}
        </p>
      )}
      {teacher.subjects && (
        <p className="mt-1.5 text-[11.5px] leading-snug text-ink-soft">
          <span className="font-bold text-green">{t.common.teacher}:</span> {teacher.subjects}
        </p>
      )}
    </article>
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
      className="press flex h-7 w-7 items-center justify-center rounded-full border border-green/20 bg-white text-green hover:bg-green hover:text-white"
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {children}
      </svg>
    </button>
  );
}
