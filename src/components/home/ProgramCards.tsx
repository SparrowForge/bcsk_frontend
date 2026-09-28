import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { reveal } from "@/lib/motion";
import { SectionBar } from "./SectionBar";

/**
 * The four things a family can enrol a child in, as one row of cards.
 *
 * Each card is the whole link rather than just its "Learn more" line: a parent taps the card,
 * not the small text at its foot. The card is a pale green tint with a solid green disc
 * carrying the icon — the tint says "one of a set", the disc gives each card a single focal
 * point, and the hover darkens the disc so the one under the pointer stands out from the row.
 */
export function ProgramCards({ t }: { t: Dictionary }) {
  const programs = [
    { title: t.home.regularClasses, text: t.home.progRegularText, href: "/academic/curriculum", icon: <BookIcon /> },
    { title: t.nav.ielts, text: t.home.progIeltsText, href: "/courses/ielts-for-kids", icon: <CapIcon /> },
    { title: t.nav.deen, text: t.home.progDeenText, href: "/courses/deen", icon: <MosqueIcon /> },
    { title: t.nav.abacus, text: t.home.progAbacusText, href: "/courses/abacus", icon: <AbacusIcon /> },
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
              className="group hover-lift flex h-full flex-col items-center rounded-2xl border border-green-mid/15 bg-white px-6 pt-8 pb-6 text-center hover:border-green-mid/30"
            >
              <span
                aria-hidden
                className="grid h-16 w-16 place-items-center rounded-full bg-green text-white shadow-[0_10px_20px_-12px_rgba(0,77,57,0.9)] transition-[background-color,transform] duration-300 group-hover:bg-green-deep group-hover:scale-105 motion-reduce:transform-none"
              >
                {p.icon}
              </span>
              <h3 className="mt-5 font-display text-[1.15rem] font-bold text-green">{p.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">{p.text}</p>
              {/* mt-auto pins the link to the card's foot, so a row with uneven copy still
                  lines its four links up. */}
              <span className="nudge mt-auto pt-5 inline-flex items-center gap-1.5 text-[13px] font-bold text-green-mid group-hover:underline underline-offset-4">
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

function BookIcon() {
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
