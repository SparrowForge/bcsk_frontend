import { PhotoBanner, BannerRule } from "@/components/site/PhotoBanner";
import { SectionDivider } from "@/components/academic/SectionDivider";
import { ProgramImageCards } from "@/components/academic/ProgramImageCards";
import { navMetadata } from "@/lib/seo";

export function generateMetadata() {
  return navMetadata("curriculum", "BCSK follows Bangladesh's updated NCTB curriculum from Pre-Primary to Class 5, with Global English teaching and Islamic or Hindu Religious Studies.");
}

/** Line icons at one weight, as on the homepage programme cards. */
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
 * The subject areas, after the "Curriculum Snapshot" grid of the school's reference site.
 * Each card takes one of the brand and programme hues in turn so the grid reads as nine
 * subjects rather than one block; every fill carries a white glyph.
 */
const AREAS = [
  {
    title: "Bangla",
    text: "Reading, writing and speaking our mother tongue with confidence — the language that keeps children close to home.",
    tone: "bg-green",
    glyph: <path d="M5 19V6.5A2.5 2.5 0 0 1 7.5 4H19v13H7.5A2.5 2.5 0 0 0 5 19.5M9 8h6M9 11.5h4" />,
  },
  {
    title: "Global English",
    text: "Speaking, reading, writing and listening, taught so that English becomes a tool for thinking, not just a subject.",
    tone: "bg-ielts",
    glyph: <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3.5 9h17M3.5 15h17M12 3c2.5 2.6 3.8 5.6 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" />,
  },
  {
    title: "Mathematics",
    text: "Number sense, problem solving and reasoning, applied to real situations so children see themselves as mathematicians.",
    tone: "bg-crimson",
    glyph: <path d="M5 4h14v16H5zM8.5 8h7M8.5 12h1M12 12h1M15 12h.5M8.5 16h1M12 16h1M15 16h.5" />,
  },
  {
    title: "Science",
    text: "Curiosity first — observing, asking and testing ideas through hands-on exploration of the natural world.",
    tone: "bg-deen",
    glyph: <path d="M9.5 3h5M10.5 3v6L5 18.5A1.7 1.7 0 0 0 6.5 21h11a1.7 1.7 0 0 0 1.5-2.5L13.5 9V3M7.5 15h9" />,
  },
  {
    title: "Bangladesh & Global Studies",
    text: "Our history, society and culture, alongside the wider world — understanding many points of view.",
    tone: "bg-green-mid",
    glyph: <path d="M4 20h16M6 20V10M10 20V10M14 20V10M18 20V10M3 10l9-6 9 6" />,
  },
  {
    title: "Religion & Moral Education",
    text: "Islamic or Hindu Religious Studies, with honesty, kindness and respect taught in every class.",
    tone: "bg-abacus-deep",
    glyph: <path d="M12 21s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.6-7 10-7 10Z" />,
  },
  {
    title: "Arts & Culture",
    text: "Drawing, music, recitation and performance — creative expression rooted in our heritage.",
    tone: "bg-green-deep",
    glyph: <path d="M12 3a9 9 0 0 0 0 18c1.1 0 1.6-.9 1.2-1.8-.5-1-.1-2.2 1.2-2.2H17a4 4 0 0 0 4-4c0-5.5-4-10-9-10ZM7.5 12h.01M9.5 8h.01M14.5 8h.01" />,
  },
  {
    title: "Health & Wellbeing",
    text: "Physical activity, healthy habits and self-care that children carry with them for life.",
    tone: "bg-ielts-deep",
    glyph: <path d="M3 12h4l2-5 4 10 2-5h6" />,
  },
  {
    title: "Social & Emotional Learning",
    text: "Self-awareness, managing feelings, making good choices and building healthy friendships.",
    tone: "bg-deen-deep",
    glyph: <path d="M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.5 20a5.5 5.5 0 0 1 11 0M16 11a2.5 2.5 0 1 0 0-5M17.5 20h3a4.5 4.5 0 0 0-4-4.5" />,
  },
];

/**
 * FR-ACAD-02. The banner and snapshot, then the four programmes as picture cards (Academic
 * Curriculum design, Oct 2026). The class-by-class subject lists moved to each class's own page
 * under /academic/classes, where the office edits them.
 */
export default function CurriculumPage() {
  return (
    <>
      <PhotoBanner image="/images/banners/curriculum-students.jpg" imagePosition="35% 30%">
        <p className="flex items-center gap-2.5 font-display text-2xl font-semibold text-green-mid sm:text-[1.7rem]">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden className="text-green">
            <path d="m2 9 10-5 10 5-10 5L2 9Z" fill="currentColor" />
            <path d="M6 11v5c0 1.4 2.7 3 6 3s6-1.6 6-3v-5M22 9v6" />
          </svg>
          Academic
        </p>
        <h1 className="mt-1 font-display text-5xl font-extrabold leading-none tracking-tight text-green sm:text-6xl lg:text-7xl">
          Curriculum
        </h1>
        <BannerRule />
        <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink-soft">
          Our progressive approach to education encourages children to develop self-reliance, solid academic skills,
          integrity, and a sense of social values.
        </p>
      </PhotoBanner>

      <section className="mx-auto max-w-7xl px-4 mt-14">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-crimson-ink">Curriculum Snapshot</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-green sm:text-4xl">
            A national curriculum, taught for children growing up in Korea
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
            BCSK follows the updated{" "}
            <strong className="text-green">NCTB (National Curriculum and Textbook Board)</strong> curriculum of Bangladesh
            from Pre-Primary to Class 5, with Global English Teaching across speaking, reading, writing and listening.
            Religious Studies is offered in Islamic and Hindu tracks. We keep refining how we teach it, so that every
            child builds strong foundations and a love of learning.
          </p>
        </div>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {AREAS.map((a) => (
            <li
              key={a.title}
             
              className="hover-lift flex gap-4 rounded-2xl border border-line bg-white p-6"
            >
              <span aria-hidden className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl text-white ${a.tone}`}>
                <svg {...icon}>{a.glyph}</svg>
              </span>
              <div className="min-w-0">
                <h3 className="font-display text-lg font-semibold leading-snug text-green">{a.title}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">{a.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <SectionDivider />
      <ProgramImageCards />
    </>
  );
}
