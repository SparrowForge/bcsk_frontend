import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { reveal } from "@/lib/motion";
import { SectionBar } from "./SectionBar";

/**
 * One colour per programme, applied to everything inside its card — stripe, halo, icon disc,
 * title and link — so a card reads as one piece and the four read as four. Full class strings
 * rather than a built-up `bg-${x}`: Tailwind only ships the classes it can see written out.
 */
const THEMES = {
  regular: {
    stripe: "bg-green",
    halo: "bg-green-soft",
    disc: "bg-green group-hover:bg-green-deep shadow-[0_10px_20px_-12px_rgba(0,77,57,0.9)]",
    text: "text-green",
    border: "hover:border-green/40",
  },
  ielts: {
    stripe: "bg-ielts",
    halo: "bg-ielts-soft",
    disc: "bg-ielts group-hover:bg-ielts-deep shadow-[0_10px_20px_-12px_rgba(23,74,136,0.9)]",
    text: "text-ielts",
    border: "hover:border-ielts/40",
  },
  deen: {
    stripe: "bg-deen",
    halo: "bg-deen-soft",
    disc: "bg-deen group-hover:bg-deen-deep shadow-[0_10px_20px_-12px_rgba(83,45,128,0.9)]",
    text: "text-deen",
    border: "hover:border-deen/40",
  },
  // The orange fill is too light for a white glyph, so the disc uses the deeper step, and the
  // title and link use the text-strength orange rather than the fill.
  abacus: {
    stripe: "bg-abacus",
    halo: "bg-abacus-soft",
    disc: "bg-abacus-deep group-hover:bg-abacus-ink shadow-[0_10px_20px_-12px_rgba(180,83,9,0.9)]",
    text: "text-abacus-ink",
    border: "hover:border-abacus/50",
  },
} as const;

/**
 * The four things a family can enrol a child in, as one row of cards.
 *
 * Each card is the whole link rather than just its "Learn more" line: a parent taps the card,
 * not the small text at its foot. A colour stripe along the top and a soft halo behind the
 * icon disc name the programme before its title does; the hover darkens the disc so the card
 * under the pointer stands out from the row.
 */
export function ProgramCards({ t }: { t: Dictionary }) {
  const programs = [
    {
      title: t.home.regularClasses,
      text: t.home.progRegularText,
      href: "/academic/curriculum",
      icon: <BookIcon />,
      theme: THEMES.regular,
      details: <RegularDetails t={t} />,
    },
    { title: t.nav.ielts, text: t.home.progIeltsText, href: "/courses/ielts-for-kids", icon: <CapIcon />, theme: THEMES.ielts },
    { title: t.nav.deen, text: t.home.progDeenText, href: "/courses/deen", icon: <MosqueIcon />, theme: THEMES.deen },
    { title: t.nav.abacus, text: t.home.progAbacusText, href: "/courses/abacus", icon: <AbacusIcon />, theme: THEMES.abacus },
  ];

  return (
    <section className="logo-shade logo-shade-left mx-auto max-w-7xl px-4 mt-12">
      <SectionBar>{t.home.programs}</SectionBar>
      <p {...reveal()} className="mt-4 text-center text-ink-soft text-[14px] max-w-2xl mx-auto">
        {t.home.programsIntro}
      </p>

      <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {programs.map((p, i) => (
          <li key={p.href} {...reveal("up", i, 90)}>
            <Link
              href={p.href}
              className={`group hover-lift relative isolate flex h-full flex-col items-center overflow-hidden rounded-2xl border border-line bg-white px-6 pt-9 pb-6 text-center ${p.theme.border}`}
            >
              <span aria-hidden className={`absolute inset-x-0 top-0 h-1.5 ${p.theme.stripe}`} />
              {/* The halo: a large soft disc cut off by the card's top edge, so the icon sits
                  in a pool of its own colour rather than floating on white. */}
              <span
                aria-hidden
                className={`absolute left-1/2 -top-24 -z-10 h-48 w-48 -translate-x-1/2 rounded-full ${p.theme.halo}`}
              />
              <span
                aria-hidden
                className={`grid h-16 w-16 place-items-center rounded-full text-white ring-4 ring-white transition-[background-color,transform] duration-300 group-hover:scale-105 motion-reduce:transform-none ${p.theme.disc}`}
              >
                {p.icon}
              </span>
              <h3 className={`mt-5 font-display text-[1.15rem] font-bold ${p.theme.text}`}>{p.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">{p.text}</p>
              {p.details}
              {/* mt-auto pins the link to the card's foot, so a row with uneven copy still
                  lines its four links up. */}
              <span className={`nudge mt-auto pt-5 inline-flex items-center gap-1.5 text-[13px] font-bold group-hover:underline underline-offset-4 ${p.theme.text}`}>
                {t.home.learnMore}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* Darkest last: each class a step up from the one before. */
const STEP_BARS = [
  "h-3.5 bg-green/30",
  "h-5 bg-green/45",
  "h-6.5 bg-green/60",
  "h-8 bg-green/75",
  "h-9.5 bg-green/90",
  "h-11 bg-green",
];

/**
 * What Regular Classes covers, at a glance: the six classes drawn as a staircase from
 * Pre-Primary up to Class 5, and the two things every class shares underneath it.
 *
 * The bars are decoration and hidden from assistive tech; the labels under them are the real
 * list, named as a whole by `progRegularLadder`.
 */
function RegularDetails({ t }: { t: Dictionary }) {
  const steps = [t.home.progPre, "1", "2", "3", "4", "5"];
  return (
    <div className="mt-5 w-full rounded-xl bg-green-soft/70 px-3 pt-3.5 pb-2.5">
      <div aria-hidden className="flex items-end gap-1.5 border-b-2 border-green/25">
        {STEP_BARS.map((bar) => (
          <span key={bar} className={`flex-1 rounded-t-md ${bar}`} />
        ))}
      </div>
      <ol aria-label={t.home.progRegularLadder} className="mt-1.5 flex gap-1.5">
        {steps.map((s) => (
          <li key={s} className="flex-1 min-w-0 text-[10.5px] font-bold leading-none text-green">
            {s}
          </li>
        ))}
      </ol>
      <ul className="mt-3 flex flex-wrap justify-center gap-1.5">
        {[t.home.progNctb, t.home.progGlobalEnglish].map((tag) => (
          <li
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-green ring-1 ring-green/15"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="m5 12.5 4.5 4.5L19 7.5" />
            </svg>
            {tag}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* Line icons at one stroke weight, so the four discs read as a set. */
const iconProps = {
  width: 30,
  height: 30,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function BookIcon() {
  return (
    <svg {...iconProps}>
      <path d="M12 6.5C10.3 5.2 7.8 4.6 4 4.8v12.9c3.8-.2 6.3.4 8 1.8 1.7-1.4 4.2-2 8-1.8V4.8c-3.8-.2-6.3.4-8 1.7Z" />
      <path d="M12 6.5v13M6.5 8.3c1.4 0 2.6.2 3.5.6M6.5 11.3c1.4 0 2.6.2 3.5.6M17.5 8.3c-1.4 0-2.6.2-3.5.6M17.5 11.3c-1.4 0-2.6.2-3.5.6" />
    </svg>
  );
}

function CapIcon() {
  return (
    <svg {...iconProps}>
      <path d="m2.5 9 9.5-4.5L21.5 9 12 13.5 2.5 9Z" />
      <path d="M6.5 11v4.2c0 1.5 2.5 2.8 5.5 2.8s5.5-1.3 5.5-2.8V11M21.5 9v5" />
    </svg>
  );
}

function MosqueIcon() {
  return (
    <svg {...iconProps}>
      <path d="M12 3v1.5M8 11c0-2.4 1.8-4.3 4-5.5 2.2 1.2 4 3.1 4 5.5M6.5 11h11v9h-11zM10.5 20v-3a1.5 1.5 0 0 1 3 0v3" />
      <path d="M3.5 20V10.5l1-1.5 1 1.5V20M18.5 20V10.5l1-1.5 1 1.5V20M2.5 20h19" />
    </svg>
  );
}

function AbacusIcon() {
  return (
    <svg {...iconProps}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="2" />
      <path d="M3.5 8.5h17M3.5 13h17M3.5 17.5h17" />
      <circle cx="7.5" cy="8.5" r="1.3" fill="currentColor" />
      <circle cx="10.5" cy="8.5" r="1.3" fill="currentColor" />
      <circle cx="15" cy="13" r="1.3" fill="currentColor" />
      <circle cx="8.5" cy="17.5" r="1.3" fill="currentColor" />
      <circle cx="16.5" cy="17.5" r="1.3" fill="currentColor" />
    </svg>
  );
}
