import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { StudentCornerPost } from "@/services/types";
import { kindLook } from "@/lib/corner-kinds";
import { reveal } from "@/lib/motion";
import { SectionBar } from "./SectionBar";
import { FilteredSlider } from "./FilteredSlider";

/** The most the homepage strip carries; the rest are one click away on /student-corner. */
const MAX_POSTS = 12;

/**
 * The newest Student Corner posts — replaces the Students Lounge band on the homepage at the
 * school's request (October 2026). The full collection lives at /student-corner.
 *
 * Second round of changes (October 2026):
 *   - **Its own background.** It sat on the same green logo shade as the Opinions band above
 *     it, so the two read as one. It had a warm pink band for a while; at the school's request
 *     it now sits on the plain white page, which is what separates it from Opinions.
 *   - **Any kind of work.** Kinds are typed by the admin, not picked from four, so arts,
 *     handicrafts and whatever activity comes next appear without a deploy. Each kind keeps
 *     one colour for its stripe, its label and its filter chip (`lib/corner-kinds.ts`).
 *   - **A slider**, three posts at a time on a desktop, with a chip per kind to filter it.
 */
export function StudentCornerBand({ t, posts }: { t: Dictionary; posts: StudentCornerPost[] }) {
  if (posts.length === 0) return null;
  const shown = posts.slice(0, MAX_POSTS);

  // One chip per kind present, in order of first appearance (newest first).
  const groups = [...new Set(shown.map((p) => p.kind))].map((key) => {
    const look = kindLook(key, t);
    return { key, label: look.label, active: look.solid };
  });

  return (
    <section className="mx-auto max-w-7xl px-4 mt-16 pb-2">
      <SectionBar>{t.nav.studentCorner}</SectionBar>
      <p {...reveal()} className="mx-auto mt-4 max-w-2xl text-center text-[14.5px] text-ink-soft">
        {t.home.studentCornerIntro}
      </p>

      <FilteredSlider
        t={t}
        label={t.nav.studentCorner}
        allLabel={t.home.cornerAll}
        groups={groups}
        basis="basis-full sm:basis-1/2 lg:basis-1/3"
        items={shown.map((p) => ({ key: String(p.id), group: p.kind, node: <CornerCard post={p} t={t} /> }))}
        footer={
          <Link
            href="/student-corner"
            className="nudge inline-flex items-center gap-1 text-sm font-bold text-crimson-ink hover:underline underline-offset-4"
          >
            {t.home.viewAll} <span className="nudge-mark inline-block">→</span>
          </Link>
        }
      />
    </section>
  );
}

function CornerCard({ post: p, t }: { post: StudentCornerPost; t: Dictionary }) {
  const k = kindLook(p.kind, t);
  return (
    <Link
      href="/student-corner"
      className="hover-lift group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white"
    >
      <span aria-hidden className={`absolute inset-x-0 top-0 z-10 h-1.5 ${k.stripe}`} />
      {p.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={p.imageUrl} alt="" loading="lazy" className="aspect-[16/9] w-full object-cover" />
      )}
      <div className="flex flex-1 flex-col p-5 pt-6">
        <span className={`self-start rounded-full px-2.5 py-1 text-[10.5px] font-extrabold uppercase tracking-wider ${k.pill}`}>
          {k.label}
        </span>
        <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-green group-hover:text-green-mid">{p.title}</h3>
        <p className={`mt-2 whitespace-pre-line text-[13.5px] leading-relaxed text-ink ${p.imageUrl ? "line-clamp-2" : "line-clamp-5"}`}>
          {p.body}
        </p>
        <p className="mt-auto pt-4 text-xs font-bold text-ink-soft">— {p.studentName}</p>
      </div>
    </Link>
  );
}
