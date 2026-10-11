import Link from "next/link";
import { VirtualAbacus } from "./VirtualAbacus";
import { SorobanArt } from "./SorobanArt";

const icon = {
  width: 30,
  height: 30,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** The four steps of the curriculum, as the mockup names them. */
const STEPS = [
  { title: "Foundation Level", text: "Build a strong number sense.", glyph: <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Zm0 9 8-4.5M12 12 4 7.5M12 12v9" /> },
  { title: "Intermediate Level", text: "Strengthen calculation and problem solving.", glyph: <path d="M6 3h12v18H6zM9 7h6M9 11h1.5M13.5 11H15M9 14.5h1.5M13.5 14.5H15M9 18h6" /> },
  { title: "Advanced Level", text: "Tackle complex calculations.", glyph: <path d="M4 20h16M6 20v-5M10 20v-8M14 20v-6M18 20V8M5 11l5-4 4 3 6-6M16 4h4v4" /> },
  { title: "Master Level", text: "Achieve excellence with abacus.", glyph: <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4ZM7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4" /> },
];

/** Which school class studies which two levels. */
const STAGES = [
  { klass: "Class-1", levels: "Level-1 & 2" },
  { klass: "Class-2", levels: "Level-3 & 4" },
  { klass: "Class-3", levels: "Level-5 & 6" },
  { klass: "Class-4", levels: "Level-7 & 8" },
];

/**
 * Photos from the school's mockup, standing in until real class photos replace them in
 * `public/images/banners/`.
 */
const IN_ACTION = [
  { src: "/images/banners/abacus-action-1.jpg", caption: "Focused Learning" },
  { src: "/images/banners/abacus-action-2.jpg", caption: "Individual Attention" },
  { src: "/images/banners/abacus-action-3.jpg", caption: "Supportive Teachers" },
  { src: "/images/banners/abacus-action-4.jpg", caption: "Happy Students" },
];

const FUN = [
  { label: "Bead games", tone: "bg-abacus-soft text-abacus-ink" },
  { label: "Speed rounds", tone: "bg-green-soft text-green" },
  { label: "Challenges", tone: "bg-ielts-soft text-ielts" },
  { label: "Best scores", tone: "bg-crimson-band text-crimson-ink" },
];

/** Abacus Home, after the school's October 2026 mockup. */
export default function AbacusHomePage() {
  return (
    <>
      {/* Virtual Abacus Tool */}
      <section id="virtual-abacus" className="mx-auto max-w-7xl px-4 mt-8 scroll-mt-24">
        <details className="group rounded-3xl border border-green/15 bg-green-soft/60">
          <summary className="flex cursor-pointer list-none flex-col items-center gap-6 p-6 sm:flex-row sm:p-8 [&::-webkit-details-marker]:hidden">
            {/* A laptop with an abacus on its screen. */}
            <span aria-hidden className="relative w-56 shrink-0">
              <span className="block rounded-t-xl border-[6px] border-ink/85 bg-white p-2">
                <SorobanArt value={2026} rods={5} className="h-auto w-full" />
              </span>
              <span className="mx-auto block h-2.5 w-[115%] -translate-x-[6.5%] rounded-b-lg bg-ink/70" />
            </span>
            <span className="text-center sm:text-left">
              <span className="block font-display text-3xl font-semibold text-green">Virtual Abacus Tool</span>
              <span className="mt-1 block font-display text-lg text-green-mid">Practice. Learn. Improve.</span>
              <span className="mt-2 block max-w-md text-sm leading-relaxed text-ink-soft">
                Try our online abacus tool and experience the power of abacus learning from anywhere.
              </span>
              <span className="press mt-4 inline-flex items-center gap-2 rounded-lg bg-green px-5 py-2.5 text-sm font-bold text-white group-open:bg-green-deep">
                <span className="group-open:hidden">Start Practice →</span>
                <span className="hidden group-open:inline">Close the tool ✕</span>
              </span>
            </span>
          </summary>
          <div className="border-t border-green/15 px-4 pb-8 pt-6">
            <p className="mx-auto mb-5 max-w-2xl text-center text-sm text-ink-soft">
              A real soroban in your browser. Move beads to the beam to count them, hide the number to test yourself, or
              press <strong>Challenge me!</strong> for a number to build.
            </p>
            <div className="flex justify-center">
              <div className="max-w-full">
                <VirtualAbacus />
              </div>
            </div>
          </div>
        </details>
      </section>

      {/* Step-by-step learning */}
      <section className="mx-auto max-w-7xl px-4 mt-14">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,2fr)]">
          <div>
            <Eyebrow>Our Abacus Curriculum</Eyebrow>
            <h2 className="mt-2 font-display text-3xl font-semibold text-green sm:text-4xl">Step-by-Step Learning</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              Our structured curriculum is designed for different age groups and skill levels, ensuring steady progress
              and success.
            </p>
            <Link
              href="/courses/abacus/syllabus"
              className="press mt-5 inline-flex items-center gap-2 rounded-lg bg-green px-5 py-2.5 text-sm font-bold text-white hover:bg-green-deep"
            >
              View Curriculum →
            </Link>
          </div>
          <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {STEPS.map((s) => (
              <li key={s.title} className="hover-lift rounded-2xl border border-line bg-white px-4 py-6 text-center">
                <span aria-hidden className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-green-soft text-green">
                  <svg {...icon}>{s.glyph}</svg>
                </span>
                <h3 className="mt-3 text-[15px] font-bold text-green">{s.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-ink-soft">{s.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Age groups, class & levels */}
      <section className="mx-auto max-w-7xl px-4 mt-14">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
          <div>
            <Eyebrow>Age Groups, Class &amp; Levels</Eyebrow>
            <h2 className="mt-2 font-display text-3xl font-semibold text-green sm:text-4xl">For Every Stage of Growth</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">
              We offer Abacus classes for students from Class-1 to Class-4, with structured levels to match their
              learning journey.
            </p>
            <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {STAGES.map((s, i) => (
                <li key={s.klass} className="rounded-2xl border border-line bg-white px-3 py-5 text-center">
                  <Kid index={i} />
                  <p className="mt-2 font-bold text-green">{s.klass}</p>
                  <p className="text-xs font-semibold text-ink-soft">{s.levels}</p>
                </li>
              ))}
            </ul>
          </div>
          <aside className="self-end rounded-2xl bg-crimson-band p-6">
            <p className="flex items-center gap-2 font-display text-xl font-semibold leading-snug text-green">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--crimson)" strokeWidth="1.7" strokeLinecap="round" aria-hidden>
                <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3ZM12 0v1M4 4l.8.8M20 4l-.8.8M1 11h1M22 11h1" />
              </svg>
              A Strong Foundation for Future Success
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              With Abacus, children don&apos;t just learn math — they build confidence, discipline and a growth mindset.
            </p>
            <span aria-hidden className="mt-3 block h-1 w-16 rounded-full bg-crimson" />
          </aside>
        </div>
      </section>

      {/* In action + Fun Abacus */}
      <section className="mx-auto max-w-7xl px-4 mt-14">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
          <div>
            <Eyebrow>Our Abacus Class in Action</Eyebrow>
            <h2 className="mt-2 font-display text-3xl font-semibold text-green sm:text-4xl">Learning in Action, Growing Every Day</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">
              See how our engaged students are developing their skills, confidence and enthusiasm through interactive
              abacus classes.
            </p>
            <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {IN_ACTION.map((p) => (
                <li key={p.caption} className="overflow-hidden rounded-xl border border-line bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.src} alt={p.caption} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                  <p className="bg-green px-2 py-1.5 text-center text-[11.5px] font-bold text-white">{p.caption}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-line bg-white p-6">
            <Eyebrow>Fun Abacus</Eyebrow>
            <h2 className="mt-2 font-display text-2xl font-semibold text-green">Make Math Fun!</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Through games, challenges and creative activities, we make learning abacus exciting, enjoyable and full
              of fun.
            </p>
            <ul className="mt-4 grid grid-cols-2 gap-2.5">
              {FUN.map((f) => (
                <li key={f.label} className={`rounded-xl px-3 py-3 text-center text-xs font-bold ${f.tone}`}>
                  {f.label}
                </li>
              ))}
            </ul>
            <Link
              href="/courses/abacus/fun"
              className="nudge mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-green hover:underline underline-offset-4"
            >
              Play Fun Abacus <span className="nudge-mark inline-block">→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2.5 text-xs font-extrabold uppercase tracking-[0.18em] text-green">
      <span aria-hidden className="h-0.5 w-7 rounded-full bg-crimson" />
      {children}
    </p>
  );
}

/** A child's face in line art, one colour per class tile. */
function Kid({ index }: { index: number }) {
  const tones = ["text-green", "text-ielts", "text-deen", "text-abacus-ink"];
  return (
    <svg width="44" height="44" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={`mx-auto ${tones[index % 4]}`} aria-hidden>
      <circle cx="24" cy="20" r="10" />
      <path d="M14.5 17c2-6 8-8 14-6 3 1 5 3 5.5 6M20 21h.01M28 21h.01M20.5 25c2 1.5 5 1.5 7 0M10 44c0-8 6-12 14-12s14 4 14 12" />
    </svg>
  );
}
