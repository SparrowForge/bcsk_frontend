import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { academic, ApiError } from "@/services";
import { PhotoBanner } from "@/components/site/PhotoBanner";
import { SubjectPanel } from "@/components/academic/SubjectPanel";
import { paletteFor, SUBJECT_CATEGORIES } from "@/lib/academic-palette";

type Props = { params: Promise<{ slug: string }> };

async function load(slug: string) {
  return academic.classPage(slug).catch((e: unknown) => {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = await load((await params).slug);
  return { title: c.name, description: c.summary ?? c.intro ?? undefined };
}

/** Icons for the "What we offer" items, used in turn. Line icons at the site's one weight. */
const OFFER_ICONS = [
  <path key="a" d="M12 6.5C10.3 5.2 7.8 4.6 4 4.8v12.9c3.8-.2 6.3.4 8 1.8 1.7-1.4 4.2-2 8-1.8V4.8c-3.8-.2-6.3.4-8 1.7ZM12 6.5v13" />,
  <path key="b" d="M5 4h14v16H5zM8.5 8h7M8.5 12h1M12 12h1M15 12h.5M8.5 16h1M12 16h1M15 16h.5" />,
  <path key="c" d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.4 1 1.1 1 1.9V16h5v-.2c0-.8.4-1.5 1-1.9A6 6 0 0 0 12 3Z" />,
  <path key="d" d="M12 21s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.6-7 10-7 10Z" />,
  <path key="e" d="M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.5 20a5.5 5.5 0 0 1 11 0M16 11a2.5 2.5 0 1 0 0-5M17.5 20h3a4.5 4.5 0 0 0-4-4.5" />,
  <path key="f" d="M12 3a9 9 0 0 0 0 18c1.1 0 1.6-.9 1.2-1.8-.5-1-.1-2.2 1.2-2.2H17a4 4 0 0 0 4-4c0-5.5-4-10-9-10ZM7.5 12h.01M9.5 8h.01M14.5 8h.01" />,
];
const OFFER_TONES = ["#2563EB", "#DB2777", "#CA8A04", "#DC2626", "#0D9488", "#9333EA"];

/** A class's own page: banner, what the class offers, and every book it uses, by category. */
export default async function ClassPage({ params }: Props) {
  const c = await load((await params).slug);
  const p = paletteFor(c.color);
  const subjects = c.subjects ?? [];
  const groups = SUBJECT_CATEGORIES.map((g) => ({ ...g, items: subjects.filter((s) => s.category === g.key) })).filter(
    (g) => g.items.length > 0,
  );
  // The colour sign builds up down the whole page, not restarting per category.
  let step = 0;

  return (
    <>
      <PhotoBanner image={c.bannerImageUrl ?? "/images/academic/class-banner.jpg"} imagePosition="center 40%">
        <Link href="/academic/classes" className="text-xs font-bold text-ink-soft hover:text-green-mid">
          ← All general classes
        </Link>
        <p className="mt-4">
          <span className="inline-block rounded-full px-3.5 py-1 text-sm font-bold text-white" style={{ background: p.deep }}>
            {c.name}
            {c.ageRange ? ` · ${c.ageRange}` : ""}
          </span>
        </p>
        <h1 className="mt-3 font-display text-5xl font-extrabold leading-none tracking-tight text-green sm:text-6xl">{c.name}</h1>
        {c.tagline && <p className="mt-4 max-w-md text-lg font-semibold leading-snug text-green-mid">{c.tagline}</p>}
      </PhotoBanner>

      {(c.intro || c.highlights.length > 0) && (
        <section className="mx-auto max-w-7xl px-4 mt-10">
          <div className="grid gap-8 rounded-3xl border border-green/15 bg-green-soft/60 p-6 sm:p-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
            <div>
              <h2 className="flex items-center gap-2.5 font-display text-2xl font-semibold text-green">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M5 21c0-9 5-15 15-16-1 10-7 15-15 16ZM5 21l7-7" />
                </svg>
                What we offer in {c.name}
              </h2>
              {c.intro && <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{c.intro}</p>}
            </div>
            {c.highlights.length > 0 && (
              <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {c.highlights.map((h, i) => (
                  <li key={h} className="flex flex-col items-center gap-2 text-center">
                    <span
                      aria-hidden
                      className="grid h-12 w-12 place-items-center rounded-full bg-white shadow-sm"
                      style={{ color: OFFER_TONES[i % OFFER_TONES.length] }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        {OFFER_ICONS[i % OFFER_ICONS.length]}
                      </svg>
                    </span>
                    <span className="text-[13px] font-semibold leading-snug text-ink">{h}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {groups.length === 0 ? (
        <p className="mx-auto mt-12 max-w-7xl px-4 text-ink-soft">The books for this class are being added.</p>
      ) : (
        groups.map((g) => (
          <section key={g.key} className="mx-auto max-w-7xl px-4 mt-14">
            <h2 className="font-display text-3xl font-semibold text-green">{g.label}</h2>
            <div className="mt-6 space-y-5">
              {g.items.map((s) => (
                <SubjectPanel key={s.id} s={s} step={++step} />
              ))}
            </div>
          </section>
        ))
      )}
    </>
  );
}
