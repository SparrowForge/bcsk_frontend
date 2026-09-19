import Link from "next/link";
import { getDict } from "@/lib/i18n";
import { cms, site, getSettings } from "@/services";
import { HeroLanguageSlider } from "@/components/site/HeroLanguageSlider";
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
 *   LP-4  school overview: why BCSK, mission, management, tuition
 *   LP-5  six recorded opinions about the school
 *   LP-6  the student shortcuts and the seminar gallery
 *
 * Plus one band the deck does not draw: latest news, between LP-5 and LP-6. The deck drops
 * it, but the school publishes news and the homepage is where families look for it — so it
 * wears the same sage bar as the bands it sits between rather than reading as a bolt-on.
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
    cms.news(3).catch(() => []),
  ]);

  // LP-1: the four figures the school publishes, in the deck's order. Values are
  // admin-editable settings; the fallbacks match the deck so a bare database still states
  // the truth rather than a placeholder.
  const statCards = [
    { label: t.home.stats_students, sub: null, value: stats.stat_total_students || "120+" },
    { label: t.home.stats_classes, sub: t.home.stats_classes_sub, value: stats.stat_total_classes || "6" },
    { label: t.home.stats_special, sub: null, value: stats.stat_special_courses || "8" },
    { label: t.home.stats_teachers, sub: null, value: stats.stat_teachers_staff || "15+" },
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
      <section className="relative mx-auto max-w-7xl px-4 pt-6">
        <div className="absolute -left-2 top-40 w-16 h-8 bg-sunrise rounded-b-full hidden xl:block" aria-hidden />
        <div className="absolute right-6 -top-2 w-20 h-20 border-[6px] border-sky-soft rounded-full hidden xl:block" aria-hidden />

        <div className="relative bg-cream rounded-3xl overflow-hidden">
          <div className="absolute right-8 bottom-8 w-40 h-40 dot-grid opacity-60 hidden md:block" aria-hidden />
          <div className="grid lg:grid-cols-2 gap-8 items-center px-6 sm:px-12 py-12 lg:py-14">
            <div className="relative z-10">
              <h1 className="font-display text-4xl sm:text-5xl xl:text-[3.2rem] leading-[1.12] font-semibold text-ink">
                {hero?.title ?? t.home.firstSchool}
              </h1>
              <div
                className="mt-5 text-ink-soft text-[15px] leading-relaxed max-w-md [&_strong]:text-navy"
                dangerouslySetInnerHTML={{ __html: hero?.html ?? "" }}
              />
              {/* Deck order: Read More first, Apply Now second. */}
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/bcsk/about-us"
                  className="bg-navy hover:bg-navy-deep text-white font-bold rounded-lg px-6 py-3 text-sm transition-colors"
                >
                  {t.common.readMore}
                </Link>
                <Link
                  href="/apply"
                  className="bg-sunrise hover:bg-sunrise-deep text-white font-bold rounded-lg px-6 py-3 text-sm transition-colors shadow-sm inline-flex items-center gap-2"
                >
                  {t.nav.applyNow}
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden>
                    <path d="m7 5 7 7-7 7M14 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            <HeroLanguageSlider images={heroImages} />
          </div>
        </div>
      </section>

      {/* ---------------- LP-1 · STATS BAND (FR-HOME-04) ---------------- */}
      <section className="mx-auto max-w-7xl px-4 mt-6">
        <ul className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s) => (
            <li key={s.label} className="bg-sage rounded-2xl px-6 py-7 text-center">
              <p className="font-display text-3xl font-semibold text-navy">{s.value}</p>
              <p className="mt-1 text-sm font-bold text-navy">{s.label}</p>
              {s.sub && <p className="mt-0.5 text-[11px] text-navy/70">{s.sub}</p>}
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
