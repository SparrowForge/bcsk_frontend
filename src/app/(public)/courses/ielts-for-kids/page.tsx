import Link from "next/link";
import { site, cms } from "@/services";
import { getSession } from "@/lib/auth";
import { krw } from "@/lib/format";
import { PracticeQuiz } from "./PracticeQuiz";
import { navMetadata } from "@/lib/seo";

export function generateMetadata() {
  return navMetadata("ielts", "IELTS foundations for children: Listening, Speaking, Reading and Writing, taught by native English speakers across ten levels.");
}

const LEVEL_COUNT = 10;

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

/** The four IELTS modules, each in its own colour so the page can refer back to them. */
const SKILLS = [
  {
    name: "Listening",
    tone: "bg-ielts",
    soft: "bg-ielts-soft",
    text: "Native-speaker dialogues, songs and stories tuned to each level.",
    points: ["Short conversations and announcements", "Note and form completion", "Accents from around the world"],
    glyph: <path d="M4 15v-3a8 8 0 0 1 16 0v3M4 15a2 2 0 0 0 2 2h1v-5H6a2 2 0 0 0-2 2v1Zm16 0a2 2 0 0 1-2 2h-1v-5h1a2 2 0 0 1 2 2v1Z" />,
  },
  {
    name: "Speaking",
    tone: "bg-green",
    soft: "bg-green-soft",
    text: "Confidence-first conversation practice in small groups.",
    points: ["Talking about yourself and your day", "Two-minute talks on a topic card", "Discussion with follow-up questions"],
    glyph: <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12ZM8.5 12h.01M12 12h.01M15.5 12h.01" />,
  },
  {
    name: "Reading",
    tone: "bg-deen",
    soft: "bg-deen-soft",
    text: "From picture books to short passages with comprehension questions.",
    points: ["Skimming and scanning", "True / false / not given", "Matching headings to paragraphs"],
    glyph: <path d="M12 6.5C10.3 5.2 7.8 4.6 4 4.8v12.9c3.8-.2 6.3.4 8 1.8 1.7-1.4 4.2-2 8-1.8V4.8c-3.8-.2-6.3.4-8 1.7ZM12 6.5v13" />,
  },
  {
    name: "Writing",
    tone: "bg-crimson",
    soft: "bg-crimson-band",
    text: "Guided sentences up to short essays, with teacher feedback on every piece.",
    points: ["Describing a picture or a chart", "Letters and short essays", "Planning, then checking your work"],
    glyph: <path d="m14.5 4.5 5 5L9 20H4v-5L14.5 4.5ZM12.5 6.5l5 5" />,
  },
];

/** The ten levels fall into four stages; each stage keeps one colour from start to finish. */
const STAGES = [
  { name: "Foundations", from: 1, to: 3, tone: "bg-green", ring: "border-green/30", text: "text-green", soft: "bg-green-soft" },
  { name: "Development", from: 4, to: 6, tone: "bg-ielts", ring: "border-ielts/30", text: "text-ielts", soft: "bg-ielts-soft" },
  { name: "Mastery", from: 7, to: 9, tone: "bg-deen", ring: "border-deen/30", text: "text-deen", soft: "bg-deen-soft" },
  { name: "Exam Ready", from: 10, to: 10, tone: "bg-crimson", ring: "border-crimson/30", text: "text-crimson-ink", soft: "bg-crimson-band" },
];
const stageOf = (n: number) => STAGES.find((s) => n >= s.from && n <= s.to) ?? STAGES[0];

/**
 * What each level covers when the database has no row for it yet. The school moved from nine
 * levels to ten in October 2026; until an admin adds Level 10 the page still shows all ten,
 * and an admin-written syllabus always wins over these.
 */
const FALLBACK_SYLLABUS = (n: number) =>
  n <= 3
    ? "Phonics and listening comprehension, simple conversations, picture reading, guided sentence writing."
    : n <= 6
    ? "Paragraph reading, structured speaking topics, listening to native dialogues, short essay writing."
    : n <= 9
    ? "Mock IELTS tasks across all four skills, band-score practice, academic vocabulary, timed writing."
    : "Full-length IELTS-style practice tests, band-score feedback, exam strategies and test-day confidence.";

const FORMAT = [
  { title: "Live online classes", text: "Weekly classes with a native English teacher, joined from home anywhere in Korea." },
  { title: "Small groups", text: "Children are grouped by level, so every child gets time to speak." },
  { title: "Practice tests", text: "Regular skill checks and mock tests, scored and saved to the progress report." },
  { title: "Reports for parents", text: "Guardians follow scores and teacher comments in the Classroom portal." },
];

const WHY = [
  "Native English-speaking teachers",
  "Ten clear levels — a placement check decides where to start",
  "All four IELTS skills in every level",
  "Small groups and individual feedback",
  "Progress tracked level by level",
  "Practice tests modelled on the real exam",
  "Classes on a fixed weekly timetable",
  "BCSK students pay a reduced fee",
];

const FAQ = [
  {
    q: "Who is IELTS for Kids for?",
    a: "Children of primary-school age who want strong, confident English. Level 1 starts from phonics, so no prior IELTS knowledge is needed.",
  },
  {
    q: "Does my child need to be a BCSK student?",
    a: "No. The course is open to every child; BCSK students pay the reduced BCSK fee shown above.",
  },
  {
    q: "How do you decide which level my child starts at?",
    a: "After you apply, the teacher runs a short placement check across the four skills and recommends a starting level.",
  },
  {
    q: "Are the classes online or in person?",
    a: "Classes are live online, so families anywhere in Korea can join. Enrolled students find the class link on this page and in the Classroom portal.",
  },
  {
    q: "How will I know how my child is doing?",
    a: "Practice-test scores and teacher comments are saved to your child's progress report, which you can open in the Classroom portal at any time.",
  },
];

/** 3.8.2 IELTS for Kids learning page (FR-IELTS-01..06). */
export default async function IeltsPage() {
  const [course, fees, slugs, session] = await Promise.all([
    site.course("ielts-for-kids"),
    cms.fees(),
    site.enrolledCourseSlugs(),
    getSession(),
  ]);
  const fee = fees.find((f) => f.key === "ielts_for_kids") ?? null;
  const enrolled = slugs.includes("ielts-for-kids");
  const studentUserId = session?.role === "STUDENT" ? session.userId : null;

  // The admin hero line reads "headline — explanation"; as one h1 it ran to four lines, so the
  // part after the dash becomes the subtitle.
  const [heroTitle, ...heroRest] = (course?.heroText ?? "Give your child a global voice").split(" — ");
  const heroSub = heroRest.join(" — ");

  // One tile per level, 1 to 10: the database row where there is one, the fallback otherwise.
  const levels = Array.from({ length: LEVEL_COUNT }, (_, i) => {
    const n = i + 1;
    const row = course?.levels.find((l) => l.name.trim() === `Level ${n}`) ?? null;
    const classSession = row ? course?.sessions.find((s) => s.courseLevelId === row.id) ?? null : null;
    return { n, syllabus: row?.syllabus || FALLBACK_SYLLABUS(n), session: classSession };
  });

  return (
    <>
      {/* hero */}
      <section className="mx-auto max-w-7xl px-4 pt-6">
        <div className="relative isolate overflow-hidden rounded-3xl border border-ielts/15 bg-white shadow-[0_18px_40px_-30px_rgba(23,74,136,0.7)]">
          <div aria-hidden className="absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full bg-ielts-soft" />
          <div aria-hidden className="absolute -bottom-28 left-1/3 -z-10 h-64 w-64 rounded-full bg-green-soft" />
          <div className="grid items-center gap-10 px-6 py-10 sm:px-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:px-12 lg:py-14">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-ielts-soft px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-[0.18em] text-ielts">
                IELTS for Kids
              </p>
              <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.1] text-green sm:text-5xl">{heroTitle}</h1>
              {heroSub && <p className="mt-3 font-display text-lg text-ielts sm:text-xl">{heroSub}</p>}
              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink-soft">
                Listening, Speaking, Reading and Writing — taught by native English speakers across ten progressive
                levels, from first phonics to exam-ready confidence.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/apply/special?course=ielts-for-kids"
                  className="press inline-flex items-center gap-2 rounded-full bg-crimson px-7 py-3 text-sm font-bold text-white hover:bg-crimson-deep"
                >
                  Apply for IELTS for Kids →
                </Link>
                <a
                  href="#levels"
                  className="inline-flex items-center rounded-full border-2 border-ielts/25 px-6 py-2.5 text-sm font-bold text-ielts hover:border-ielts hover:bg-ielts-soft"
                >
                  See the 10 levels
                </a>
              </div>
              <dl className="mt-9 grid max-w-lg grid-cols-3 gap-3">
                {[
                  ["10", "Levels"],
                  ["4", "Skills"],
                  ["Native", "Teachers"],
                ].map(([v, k]) => (
                  <div key={k} className="rounded-2xl border border-line bg-white/80 px-3 py-3 text-center">
                    <dt className="sr-only">{k}</dt>
                    <dd className="font-display text-2xl font-semibold text-ielts">{v}</dd>
                    <dd className="text-[11px] font-bold uppercase tracking-wide text-ink-soft">{k}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <SkillsArt />
          </div>
        </div>
      </section>

      {/* four skills (FR-IELTS-01) */}
      <section className="mx-auto max-w-7xl px-4 mt-16">
        <Heading eyebrow="What your child learns" title="The four IELTS skills" />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SKILLS.map((s) => (
            <article key={s.name} className="hover-lift flex flex-col rounded-2xl border border-line bg-white p-6">
              <span aria-hidden className={`grid h-12 w-12 place-items-center rounded-xl text-white ${s.tone}`}>
                <svg {...icon}>{s.glyph}</svg>
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold text-green">{s.name}</h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">{s.text}</p>
              <ul className={`mt-4 space-y-1.5 rounded-xl px-4 py-3 text-[12.5px] text-ink ${s.soft}`}>
                {s.points.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span aria-hidden className="font-bold">•</span>
                    {p}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* ten levels + schedule (FR-IELTS-02) */}
      <section id="levels" className="mx-auto max-w-7xl px-4 mt-16 scroll-mt-24">
        <Heading eyebrow="Your child's journey" title="Ten levels, four stages" />
        <ul className="mt-6 flex flex-wrap justify-center gap-2" aria-label="Stages">
          {STAGES.map((s) => (
            <li key={s.name} className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold ${s.soft} ${s.text}`}>
              <span aria-hidden className={`h-2.5 w-2.5 rounded-full ${s.tone}`} />
              {s.name} · {s.from === s.to ? `Level ${s.from}` : `Levels ${s.from}–${s.to}`}
            </li>
          ))}
        </ul>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {levels.map((l) => {
            const st = stageOf(l.n);
            return (
              <li key={l.n} className={`relative flex flex-col overflow-hidden rounded-2xl border bg-white p-5 ${st.ring}`}>
                <span aria-hidden className={`absolute inset-x-0 top-0 h-1.5 ${st.tone}`} />
                <div className="flex items-center gap-3">
                  <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full font-display text-lg font-semibold text-white ${st.tone}`}>
                    {l.n}
                  </span>
                  <div>
                    <h3 className="font-bold leading-tight text-ink">Level {l.n}</h3>
                    <p className={`text-[11px] font-extrabold uppercase tracking-wide ${st.text}`}>{st.name}</p>
                  </div>
                </div>
                <p className="mt-3 text-[12.5px] leading-relaxed text-ink-soft">{l.syllabus}</p>
                {l.session && (
                  <p className={`mt-auto pt-3 text-[11px] font-bold ${st.text}`}>
                    <span className={`inline-block rounded-full px-2.5 py-1 ${st.soft}`}>
                      {l.session.dayOfWeek} {l.session.startTime}
                    </span>
                  </p>
                )}
                {l.session && enrolled && l.session.zoomLink && (
                  <a
                    href={l.session.zoomLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 text-xs font-bold text-green hover:underline"
                  >
                    Join the live class →
                  </a>
                )}
              </li>
            );
          })}
        </ol>
      </section>

      {/* how the course runs */}
      <section className="mx-auto max-w-7xl px-4 mt-16">
        <div className="rounded-3xl bg-ielts-soft px-6 py-10 sm:px-10">
          <Heading eyebrow="Course format" title="How the course works" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FORMAT.map((f, i) => (
              <div key={f.title} className="rounded-2xl bg-white p-5">
                <p className="font-display text-3xl font-semibold text-ielts/30">0{i + 1}</p>
                <h3 className="mt-1 font-bold text-green">{f.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* why + pricing (FR-IELTS-03) */}
      <section className="mx-auto max-w-7xl px-4 mt-16 grid gap-10 lg:grid-cols-2">
        <div>
          <Heading eyebrow="Why BCSK" title="Why parents choose us" align="left" />
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {WHY.map((w) => (
              <li key={w} className="flex items-start gap-2.5 rounded-xl border border-line bg-white px-4 py-3 text-[13.5px] font-semibold text-ink">
                <span aria-hidden className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-green text-white">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m5 12.5 4.5 4.5L19 7.5" />
                  </svg>
                </span>
                {w}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <Heading eyebrow="Fees" title="Course fee" align="left" />
          <div className="mt-6 rounded-3xl border border-line bg-white p-5 sm:p-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="min-w-0 rounded-2xl bg-green-soft p-4 text-center sm:p-6">
                <p className="text-xs font-extrabold uppercase tracking-wide text-green">BCSK Student</p>
                <p className="mt-2 font-display text-xl font-semibold tabular-nums text-green sm:text-3xl">{fee?.bcskPrice ? krw(fee.bcskPrice) : "—"}</p>
                <p className="mt-1 text-xs text-ink-soft">per level / semester</p>
              </div>
              <div className="min-w-0 rounded-2xl bg-ielts-soft p-4 text-center sm:p-6">
                <p className="text-xs font-extrabold uppercase tracking-wide text-ielts">Non-BCSK Student</p>
                <p className="mt-2 font-display text-xl font-semibold tabular-nums text-ielts sm:text-3xl">{fee?.nonBcskPrice ? krw(fee.nonBcskPrice) : "—"}</p>
                <p className="mt-1 text-xs text-ink-soft">per level / semester</p>
              </div>
            </div>
            <p className="mt-4 text-xs text-ink-soft">
              Plus a one-time admission fee of {fee ? krw(fee.admissionFee) : "—"}. Fees are managed by the school office
              and may be updated each session.
            </p>
            <Link
              href="/apply/special?course=ielts-for-kids"
              className="press mt-5 block rounded-full bg-crimson px-6 py-3 text-center text-sm font-bold text-white hover:bg-crimson-deep"
            >
              Enroll now
            </Link>
          </div>
        </div>
      </section>

      {/* practice (FR-IELTS-04) */}
      <section className="mx-auto max-w-7xl px-4 mt-16">
        <Heading eyebrow="Try it" title="Practice Corner" align="left" />
        <p className="mb-6 mt-3 max-w-2xl text-sm text-ink-soft">
          {enrolled
            ? "A quick skills check — your score is saved to your progress report."
            : "A sample of our practice exercises. Enrolled students get full mock tests per skill, with scores tracked on their progress report."}
        </p>
        <PracticeQuiz enrolled={enrolled} studentUserId={studentUserId} />
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 mt-16">
        <Heading eyebrow="Questions" title="Frequently asked" />
        <div className="mt-8 space-y-3">
          {FAQ.map((f) => (
            <details key={f.q} className="group rounded-2xl border border-line bg-white">
              <summary className="flex cursor-pointer list-none items-center gap-3 px-6 py-4 font-bold text-green [&::-webkit-details-marker]:hidden">
                {f.q}
                <span aria-hidden className="ml-auto text-ielts transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="px-6 pb-5 text-sm leading-relaxed text-ink-soft">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* closing call to action */}
      <section className="mx-auto max-w-7xl px-4 mt-16">
        <div className="flex flex-col items-center gap-5 rounded-3xl border border-green/15 bg-green-soft px-6 py-10 text-center sm:flex-row sm:justify-between sm:px-12 sm:text-left">
          <div>
            <h2 className="font-display text-2xl font-semibold text-green sm:text-3xl">Start your child&apos;s English journey</h2>
            <p className="mt-1 text-sm text-ink-soft">Apply online — the teacher will recommend a starting level.</p>
          </div>
          <Link
            href="/apply/special?course=ielts-for-kids"
            className="press shrink-0 rounded-full bg-crimson px-8 py-3 text-sm font-bold text-white hover:bg-crimson-deep"
          >
            Apply now →
          </Link>
        </div>
      </section>
    </>
  );
}

function Heading({ eyebrow, title, align = "center" }: { eyebrow: string; title: string; align?: "center" | "left" }) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-crimson-ink">{eyebrow}</p>
      <h2 className="mt-2 font-display text-3xl font-semibold text-green sm:text-4xl">{title}</h2>
    </div>
  );
}

/**
 * The hero's picture: the four skills as tiles around a speech bubble that says hello in the
 * school's three languages. Decoration only — the same content is in the skills grid below.
 */
function SkillsArt() {
  return (
    <div aria-hidden className="relative mx-auto w-full max-w-sm">
      <div className="grid grid-cols-2 gap-3">
        {SKILLS.map((s) => (
          <div key={s.name} className={`flex flex-col items-center gap-2 rounded-2xl ${s.soft} px-4 py-6`}>
            <span className={`grid h-12 w-12 place-items-center rounded-full text-white shadow-md ${s.tone}`}>
              <svg {...icon}>{s.glyph}</svg>
            </span>
            <span className="text-sm font-bold text-ink">{s.name}</span>
          </div>
        ))}
      </div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl border-4 border-white bg-ielts px-5 py-3 text-center text-white shadow-xl">
        <p className="font-display text-xl font-semibold leading-none">Hello!</p>
        <p className="mt-1 text-[11px] font-bold text-white/85">হ্যালো · 안녕하세요</p>
      </div>
    </div>
  );
}
