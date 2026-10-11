import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { reveal } from "@/lib/motion";
import { SectionBar } from "./SectionBar";

const icon = {
  width: 26,
  height: 26,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/**
 * "Why Choose BCSK?" — replaces School Overview on the homepage at the school's request
 * (October 2026). Six reasons, each a card with its own colour, then the two next steps.
 *
 * The overview's other panels are not lost: mission, management and fees each have their own
 * page, linked from the header.
 */
export function WhyChooseBcsk({ t }: { t: Dictionary }) {
  const h = t.home;
  const reasons = [
    { title: h.whyCurriculumTitle, text: h.whyCurriculumText, tone: "bg-green", glyph: <path d="m2 9 10-5 10 5-10 5L2 9ZM6 11v5c0 1.4 2.7 3 6 3s6-1.6 6-3v-5" /> },
    { title: h.whyTeachersTitle, text: h.whyTeachersText, tone: "bg-ielts", glyph: <path d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0" /> },
    { title: h.whyEnglishTitle, text: h.whyEnglishText, tone: "bg-crimson", glyph: <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3.5 9h17M3.5 15h17M12 3c2.5 2.6 3.8 5.6 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" /> },
    { title: h.whyValuesTitle, text: h.whyValuesText, tone: "bg-deen", glyph: <path d="M12 21s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.6-7 10-7 10Z" /> },
    { title: h.whyOnlineTitle, text: h.whyOnlineText, tone: "bg-abacus-deep", glyph: <path d="M3 5h18v11H3zM8 20h8M12 16v4M10 8.5l4 2-4 2v-4Z" /> },
    { title: h.whyCultureTitle, text: h.whyCultureText, tone: "bg-green-mid", glyph: <path d="M5 21V4M5 4h11l-2 4 2 4H5" /> },
  ];

  return (
    <section id="why-bcsk" className="mx-auto max-w-7xl px-4 mt-12 scroll-mt-24">
      <SectionBar>{h.whyChoose}</SectionBar>
      <p {...reveal()} className="mx-auto mt-4 max-w-2xl text-center text-[14.5px] text-ink-soft">
        {h.whyChooseIntro}
      </p>

      <ul className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {reasons.map((r, i) => (
          <li
            key={r.title}
            {...reveal("up", i % 3, 90)}
            className="hover-lift flex gap-4 rounded-2xl border border-line bg-white p-6"
          >
            <span aria-hidden className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl text-white ${r.tone}`}>
              <svg {...icon}>{r.glyph}</svg>
            </span>
            <div className="min-w-0">
              <h3 className="font-display text-lg font-semibold leading-snug text-green">{r.title}</h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">{r.text}</p>
            </div>
          </li>
        ))}
      </ul>

      <div {...reveal()} className="mt-7 flex flex-wrap justify-center gap-3">
        <Link
          href="/apply"
          className="press inline-flex items-center gap-1.5 rounded-full bg-crimson px-6 py-2.5 text-sm font-bold text-white hover:bg-crimson-deep"
        >
          {t.nav.applyNow} →
        </Link>
        <Link
          href="/bcsk/about-us"
          className="inline-flex items-center rounded-full border-2 border-green/20 bg-white px-6 py-2 text-sm font-bold text-green hover:border-green"
        >
          {h.readMoreHero}
        </Link>
      </div>
    </section>
  );
}
