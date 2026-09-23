import Link from "next/link";
import { getDict } from "@/lib/i18n";
import { reveal } from "@/lib/motion";
import { cms, site, getSettings } from "@/services";
import { HeroLanguageSlider } from "@/components/site/HeroLanguageSlider";
import { CountUp } from "@/components/home/CountUp";
import { SchoolStatusBar } from "@/components/home/SchoolStatusBar";
import { OfficeBoard } from "@/components/home/OfficeBoard";
import { ClassroomBoard } from "@/components/home/ClassroomBoard";
import { SchoolOverview } from "@/components/home/SchoolOverview";
import { OpinionsGrid } from "@/components/home/OpinionsGrid";
import { LatestNews } from "@/components/home/LatestNews";
import { StudentsLounge } from "@/components/home/StudentsLounge";

/**
 * The homepage, as the school's design deck lays it out (LP-1 … LP-6):
 *
 *   LP-1  hero + the four headline figures
 *   LP-2  school hours, current status, and the office board — who is at their desk
 *   LP-3  the classroom board — which rooms are running right now
 *   LP-4  school overview: why BCSK, mission, the teacher strip, management, tuition
 *   LP-5  six recorded opinions about the school
 *   LP-6  the student shortcuts and the seminar gallery
 *
 * Plus one band the deck does not draw: latest news, between LP-5 and LP-6. The deck drops
 * it, but the school publishes news and the homepage is where families look for it — so it
 * wears the same band bar as the sections it sits between rather than reading as a bolt-on.
 *
 * Every read is caught individually: a homepage is the one page that must never 500, and a
 * CMS page an admin has not written yet is a missing panel, not an outage.
 */
export default async function HomePage() {
  const { lang, t } = await getDict();
  const [
    hero,
    stats,
    board,
    whyBcsk,
    missionVision,
    educationManagement,
    fees,
    albums,
    heroImages,
    chairmanMsg,
    principalMsg,
    governingBody,
    teachers,
    news,
  ] = await Promise.all([
    cms.page("home-hero", lang).catch(() => null),
    getSettings([
      "stat_total_students",
      "stat_total_classes",
      "stat_special_courses",
      "stat_teachers_staff",
      "school_time_weekday",
      "school_time_weekend",
    ]),
    site.schoolBoard().catch(() => null),
    cms.page("why-bcsk", lang).catch(() => null),
    cms.page("mission-vision", lang).catch(() => null),
    cms.page("education-management", lang).catch(() => null),
    cms.fees().catch(() => []),
    cms.gallery().catch(() => []),
    site.heroImages().catch(() => []),
    cms.page("message-chairman", lang).catch(() => null),
    cms.page("message-principal", lang).catch(() => null),
    cms.governingBody().catch(() => []),
    cms.teachers().catch(() => []),
    cms.news(3).catch(() => []),
  ]);

  // LP-1: the four figures the school publishes, in the deck's order. Values are
  // admin-editable settings; the fallbacks match the deck so a bare database still states
  // the truth rather than a placeholder.
  const statCards = [
    { label: t.home.stats_students, sub: null, inline: false, value: stats.stat_total_students || "120+" },
    // The deck sets this one as "6 Classes" on a single line, unlike the other three.
    { label: t.home.stats_classes, sub: t.home.stats_classes_sub, inline: true, value: stats.stat_total_classes || "6" },
    { label: t.home.stats_special, sub: null, inline: false, value: stats.stat_special_courses || "8" },
    { label: t.home.stats_teachers, sub: null, inline: false, value: stats.stat_teachers_staff || "15+" },
  ];

  // LP-5 links a role's tile only where real, attributed content sits behind it. No quote is
  // invented for a role the school has not recorded yet.
  const voicesAvailable = new Set<string>();
  if (chairmanMsg) voicesAvailable.add("message-chairman");
  if (principalMsg) voicesAvailable.add("message-principal");
  if (governingBody.length > 0) voicesAvailable.add("governing-body");

  return (
    <>
      {/* ---------------- LP-1 · HERO (FR-HOME-03) ---------------- */}
      {/* The page used to open on bare white, which made the strongest content on the site
          look like a draft. The band below is pure decoration — a warm-to-cool wash, the
          deck's dot motif, and two blurred discs of the accent colours — so the headline
          arrives on a surface rather than on nothing. "isolate" keeps the -z-10 layer inside
          this section; "aria-hidden" keeps all of it out of the accessibility tree. */}
      <section className="relative isolate overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-green-soft via-mist/50 to-white" />
          <div className="dot-grid absolute inset-x-0 top-0 h-48 opacity-50" />
          <div className="absolute -left-28 top-6 h-72 w-72 rounded-full bg-crimson/15 blur-3xl" />
          <div className="absolute -right-20 -top-16 h-80 w-80 rounded-full bg-green-mid/15 blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-4 pt-10 pb-12 grid lg:grid-cols-[minmax(0,1fr)_1.15fr] gap-8 lg:gap-10 items-center">
          <div>
            {/* The CMS page owns the headline; the fallback is the deck's exact wording.
                The hero's three pieces arrive in reading order, a beat apart. */}
            <h1
              {...reveal()}
              className="text-[2.1rem] sm:text-[2.6rem] lg:text-[3rem] leading-[1.12] font-extrabold text-green"
            >
              {hero?.title ?? t.home.firstSchool}
            </h1>
            <div
              {...reveal("up", 1, 110)}
              className="mt-5 text-ink-soft text-[14.5px] leading-[1.8] max-w-lg [&_strong]:text-green"
              dangerouslySetInnerHTML={{ __html: hero?.html ?? "" }}
            />
            {/* Deck order: Read More first, Apply Now second — both small and orange. */}
            <div {...reveal("up", 2, 110)} className="mt-6 flex flex-wrap gap-2.5">
              <Link
                href="/bcsk/about-us"
                className="press bg-white hover:bg-mist text-green font-bold rounded-full border-2 border-green/15 px-5 py-2.5 text-[12.5px]"
              >
                {t.home.readMoreHero}
              </Link>
              <Link
                href="/apply"
                className="press nudge bg-crimson hover:bg-crimson-deep text-white font-bold rounded-full px-6 py-2.5 text-[12.5px] inline-flex items-center gap-1.5 shadow-[0_10px_20px_-12px_rgba(163,23,42,0.9)]"
              >
                {t.nav.applyNow}
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden>
                  <path d="m7 5 7 7-7 7M14 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Two elements, not one: the reveal and the idle float are both `animation`, so
              nesting them is what lets the visual settle in and then keep breathing. */}
          <div {...reveal("zoom", 1, 160)}>
            <div className="float-soft">
              <HeroLanguageSlider images={heroImages} />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- LP-1 · STATS BAND (FR-HOME-04) ---------------- */}
      <section className="mx-auto max-w-7xl px-4 -mt-4">
        <ul className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s, i) => (
            <li
              key={s.label}
              {...reveal("up", i, 90)}
              // Green blocks, not another tint: these four figures are the page's opening claim,
              // and set against the pale band underneath they read as the anchor of the hero
              // rather than as a second, weaker copy of it. The red cap and the shadow are
              // what stop four identical rectangles from reading as a table.
              className="hover-lift relative overflow-hidden bg-gradient-to-br from-green to-green-deep rounded-xl px-5 py-7 text-center shadow-[0_14px_30px_-20px_rgba(0,77,57,0.95)]"
            >
              <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-crimson" />
              <span
                aria-hidden
                className="absolute -right-6 -bottom-8 h-24 w-24 rounded-full bg-white/[0.06]"
              />
              {/* The deck runs the class count into its own label — "6 Classes" on one line —
                  and stacks the other three. `inline` carries that difference. */}
              <p className="font-display text-[1.6rem] leading-tight font-semibold text-white">
                {/* `tabular-nums` so a figure counting up to 120 does not jitter its own card. */}
                <CountUp value={s.value} className="tabular-nums" />
                {s.inline && <span className="ml-1.5">{s.label}</span>}
              </p>
              {!s.inline && <p className="mt-0.5 text-[1.05rem] font-bold text-white/85">{s.label}</p>}
              {s.sub && <p className="mt-0.5 text-[12px] text-white/75">{s.sub}</p>}
            </li>
          ))}
        </ul>
      </section>

      {/* ---------------- LP-2 / LP-3 · THE LIVE BOARDS ---------------- */}
      {board && (
        <section className="mx-auto max-w-7xl px-4 mt-12">
          <SchoolStatusBar
            t={t}
            open={board.open}
            liveCount={board.liveCount}
            weekday={stats.school_time_weekday || undefined}
            weekend={stats.school_time_weekend || undefined}
          />
          <OfficeBoard board={board} t={t} />
          <ClassroomBoard board={board} t={t} />
        </section>
      )}

      {/* ---------------- TEACHER PANEL ---------------- */}
      <TeacherPanel t={t} teachers={teachers} />

      {/* ---------------- LP-4 · SCHOOL OVERVIEW ---------------- */}
      <SchoolOverview
        t={t}
        whyBcsk={whyBcsk}
        missionVision={missionVision}
        educationManagement={educationManagement}
        fees={fees}
      />

      {/* ---------------- LP-5 · OPINIONS ---------------- */}
      <OpinionsGrid t={t} available={voicesAvailable} />

      {/* ---------------- LATEST NEWS & EVENTS ---------------- */}
      <LatestNews t={t} lang={lang} news={news} />

      {/* ---------------- LP-6 · STUDENTS LOUNGE + GALLERY ---------------- */}
      <StudentsLounge t={t} albums={albums} />
    </>
  );
}
