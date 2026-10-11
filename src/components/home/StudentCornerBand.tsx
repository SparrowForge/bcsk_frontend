import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { StudentCornerPost } from "@/services/types";
import { reveal } from "@/lib/motion";
import { SectionBar } from "./SectionBar";

/**
 * The newest Student Corner posts — replaces the Students Lounge band on the homepage at the
 * school's request (October 2026). The full collection lives at /student-corner.
 *
 * Each kind of work keeps one colour for its stripe and its label, so a row of a poem, an
 * artwork and an achievement reads as three different things.
 */
export function StudentCornerBand({ t, posts }: { t: Dictionary; posts: StudentCornerPost[] }) {
  if (posts.length === 0) return null;

  const kinds: Record<string, { label: string; stripe: string; pill: string }> = {
    POEM: { label: t.home.kindPoem, stripe: "bg-green", pill: "bg-green-soft text-green" },
    ARTICLE: { label: t.home.kindArticle, stripe: "bg-ielts", pill: "bg-ielts-soft text-ielts" },
    ARTWORK: { label: t.home.kindArtwork, stripe: "bg-crimson", pill: "bg-crimson-band text-crimson-ink" },
    ACHIEVEMENT: { label: t.home.kindAchievement, stripe: "bg-abacus", pill: "bg-abacus-soft text-abacus-ink" },
  };

  return (
    <section className="logo-shade logo-shade-left mx-auto max-w-7xl px-4 mt-12">
      <SectionBar>{t.nav.studentCorner}</SectionBar>
      <p {...reveal()} className="mx-auto mt-4 max-w-2xl text-center text-[14.5px] text-ink-soft">
        {t.home.studentCornerIntro}
      </p>

      <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.slice(0, 3).map((p, i) => {
          const k = kinds[p.kind] ?? kinds.ARTICLE;
          return (
            <li key={p.id} {...reveal("up", i, 100)}>
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
                  <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-green group-hover:text-green-mid">
                    {p.title}
                  </h3>
                  <p className="mt-2 line-clamp-4 whitespace-pre-line text-[13.5px] leading-relaxed text-ink">{p.body}</p>
                  <p className="mt-auto pt-4 text-xs font-bold text-ink-soft">— {p.studentName}</p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      <p {...reveal()} className="mt-4 text-right">
        <Link
          href="/student-corner"
          className="nudge inline-flex items-center gap-1 text-sm font-bold text-green hover:underline underline-offset-4"
        >
          {t.home.viewAll} <span className="nudge-mark inline-block">→</span>
        </Link>
      </p>
    </section>
  );
}
