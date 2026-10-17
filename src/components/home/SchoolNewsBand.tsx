import Image from "next/image";
import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { EventNews } from "@/services/types";
import { SCHOOL, type Lang } from "@/lib/constants";
import { formatDate, isoAttr } from "@/lib/dates";
import { reveal } from "@/lib/motion";

/**
 * School status and News & Events, side by side in one band — the school asked for the two
 * to share a section so the homepage loses one band (October 2026).
 *
 * Left: who we are, when we open, and whether a class is live right now. "Open" means a class
 * is actually running — the same `isLive` flag the classroom board reads — so this card cannot
 * call the school open above a board showing every room idle. The two time strings are admin
 * settings; a school that has not filled them in gets no row rather than invented hours.
 *
 * Right: the latest news, the first item large and the rest as a list. Every item has a
 * picture slot, a bold date and its description (October 2026): an item the office has not
 * given a photo yet shows a branded card in its type's colour rather than an empty box.
 */
export function SchoolNewsBand({
  t,
  lang,
  open,
  liveCount,
  weekday,
  weekend,
  news,
}: {
  t: Dictionary;
  lang: Lang;
  open: boolean;
  liveCount: number;
  weekday?: string;
  weekend?: string;
  news: EventNews[];
}) {
  const [featured, ...rest] = news;
  const schoolName = lang === "bn" ? SCHOOL.nameBn : lang === "ko" ? SCHOOL.nameKo : SCHOOL.name;

  return (
    <section className="mx-auto max-w-7xl px-4 mt-12">
      {/* `grid-cols-1` is `minmax(0, 1fr)`: without it the phone's single implicit column
          grew to fit a long one-line news title and pushed the band 120px off screen. */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        {/* ---- the school ---- */}
        <div {...reveal("left")} className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white">
          <div className="p-5 sm:p-6">
            <div className="flex items-center gap-3.5">
              <Image src="/images/bcsk-logo.png" alt="" width={64} height={64} className="h-16 w-16 shrink-0 rounded-full" />
              <div className="min-w-0">
                <h2 className="font-display text-lg font-semibold leading-tight text-green sm:text-xl">{schoolName}</h2>
                {lang !== "en" && <p className="text-[13px] font-bold text-green-mid">{SCHOOL.name}</p>}
                <p className="mt-0.5 text-xs text-ink-soft">{t.home.schoolMotto}</p>
              </div>
            </div>

            {(weekday || weekend) && (
              <>
                <h3 className="mt-6 flex items-center gap-2.5 font-display text-lg font-semibold text-green">
                  <span aria-hidden className="grid h-8 w-8 place-items-center rounded-full bg-green text-white">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                      <circle cx="12" cy="12" r="8.5" />
                      <path d="M12 7.5V12l3 2" />
                    </svg>
                  </span>
                  {t.home.schoolTime}:
                </h3>
                <dl className="mt-3 space-y-2.5">
                  {weekday && <TimeRow label={t.home.weekday} value={weekday} />}
                  {weekend && <TimeRow label={t.home.weekend} value={weekend} />}
                </dl>
              </>
            )}

            <div
              className={`mt-4 flex items-center gap-4 rounded-xl px-4 py-4 ${open ? "bg-green-soft" : "bg-crimson-band"}`}
              role="status"
            >
              <StatusSign open={open} label={open ? t.home.statusOpen : t.home.statusClosed} />
              <div className={`border-l pl-4 ${open ? "border-green/25" : "border-crimson/25"}`}>
                <p className="font-display text-[15px] font-semibold text-green">{t.home.currentStatus}:</p>
                <p className={`font-display text-3xl font-extrabold leading-none ${open ? "text-green" : "text-crimson"}`}>
                  {open ? t.home.statusOpen : t.home.statusClosed}
                </p>
                {open && (
                  <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-crimson px-2 py-0.5 text-[10px] font-extrabold text-white">
                    <span aria-hidden className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                    {t.common.live} · {liveCount}
                  </span>
                )}
              </div>
            </div>
          </div>
          <SchoolScene />
        </div>

        {/* ---- news & events ---- */}
        <div {...reveal("right")} className="rounded-2xl border border-line bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2.5 font-display text-xl font-semibold text-green sm:text-[1.7rem]">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M3 10v4a1 1 0 0 0 1 1h2l5 4V5L6 9H4a1 1 0 0 0-1 1Zm11.5-2.5a1 1 0 0 1 1.4 0 6.4 6.4 0 0 1 0 9 1 1 0 1 1-1.4-1.4 4.4 4.4 0 0 0 0-6.2 1 1 0 0 1 0-1.4Z" />
              </svg>
              <span className="relative">
                {t.home.newsEvents}
                <span aria-hidden className="absolute -bottom-1.5 left-0 h-[3px] w-16 rounded-full bg-crimson" />
              </span>
            </h2>
            <Link
              href="/events/news"
              className="nudge inline-flex shrink-0 items-center gap-1 rounded-lg border-2 border-green/20 px-3 py-1.5 text-xs font-bold text-green hover:border-green"
            >
              {t.home.viewAll} <span className="nudge-mark inline-block">→</span>
            </Link>
          </div>

          {featured ? (
            <>
              <Link
                href={`/events/news/${featured.id}`}
                className="hover-lift group mt-6 grid overflow-hidden rounded-xl border border-line sm:grid-cols-2"
              >
                <NewsPicture item={featured} t={t} className="aspect-[16/10] h-full w-full" />
                <div className="flex flex-col p-4">
                  <NewsDate date={featured.date} lang={lang} />
                  <h3 className="mt-1.5 font-display text-lg font-semibold leading-snug text-green group-hover:text-green-mid">
                    {featured.title}
                  </h3>
                  <p className="mt-2 line-clamp-4 text-[13px] leading-relaxed text-ink-soft">{featured.body}</p>
                  <span aria-hidden className="mt-auto self-end pt-2 text-green">→</span>
                </div>
              </Link>
              {rest.length > 0 && (
                <ul className="mt-3 space-y-3">
                  {rest.map((n) => (
                    <li key={n.id}>
                      <Link
                        href={`/events/news/${n.id}`}
                        className="group flex items-start gap-3 rounded-xl border border-line p-3 transition-colors hover:border-green/40 hover:bg-green-soft/40"
                      >
                        <NewsPicture item={n} t={t} compact className="h-[4.5rem] w-24 shrink-0 rounded-lg sm:h-20 sm:w-28" />
                        <div className="min-w-0 flex-1">
                          <NewsDate date={n.date} lang={lang} small />
                          <h3 className="mt-0.5 line-clamp-2 text-[14px] font-bold leading-snug text-green group-hover:text-green-mid">{n.title}</h3>
                          <p className="mt-0.5 line-clamp-2 text-[12.5px] leading-relaxed text-ink-soft">{n.body}</p>
                        </div>
                        <span aria-hidden className="shrink-0 self-center text-green">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <p className="mt-6 rounded-xl bg-mist px-4 py-10 text-center text-sm text-ink-soft">{t.home.newsEmpty}</p>
          )}
        </div>
      </div>
    </section>
  );
}

function TimeRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3.5 rounded-xl bg-green-soft/70 px-4 py-3">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="1.7" strokeLinecap="round" aria-hidden className="shrink-0">
        <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
        <path d="M3.5 10h17M8 3v4M16 3v4M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01" />
      </svg>
      <div>
        <dt className="text-[13px] font-bold text-green">{label}:</dt>
        <dd className="text-[13.5px] text-ink">{value}</dd>
      </div>
    </div>
  );
}

/** The date in bold, as the school asked: a reader scans news by when it happened. */
function NewsDate({ date, lang, small }: { date: string; lang: Lang; small?: boolean }) {
  return (
    <time
      dateTime={isoAttr(date)}
      className={`inline-flex items-center gap-1.5 font-extrabold text-crimson-ink ${small ? "text-[11.5px]" : "text-[13px]"}`}
    >
      <svg width={small ? 12 : 14} height={small ? 12 : 14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
        <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
        <path d="M3.5 10h17M8 3v4M16 3v4" />
      </svg>
      {formatDate(date, lang)}
    </time>
  );
}

/**
 * A news item's picture. Until the office uploads one (Admin → News & Events), the slot holds
 * a card in the item's type colour — its icon, its type, and the school badge — so a list of
 * items without photos still reads as a list of pictures rather than of missing ones.
 */
function NewsPicture({
  item,
  t,
  compact,
  className = "",
}: {
  item: EventNews;
  t: Dictionary;
  compact?: boolean;
  className?: string;
}) {
  if (item.imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={item.imageUrl} alt="" loading="lazy" className={`object-cover ${className}`} />
    );
  }
  const look =
    item.type === "SEMINAR"
      ? { bg: "from-ielts to-ielts-deep", label: t.home.newsTypeSeminar, icon: <path d="M3 5h18v11H3zM8 21h8M12 16v5M7 9h6M7 12h10" /> }
      : item.type === "EVENT"
        ? { bg: "from-green-mid to-green-deep", label: t.home.newsTypeEvent, icon: <path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.2l5.9-.9z" /> }
        : { bg: "from-crimson to-crimson-deep", label: t.home.newsTypeNews, icon: <path d="M4 5h13v14H6a2 2 0 0 1-2-2zM17 9h3v8a2 2 0 0 1-2 2M8 9h5M8 12.5h5M8 16h3" /> };
  return (
    <div aria-hidden className={`relative isolate grid place-items-center overflow-hidden bg-gradient-to-br text-white ${look.bg} ${className}`}>
      <span className="dot-grid absolute inset-0 -z-10 opacity-25" />
      <Image
        src="/images/bcsk-logo.png"
        alt=""
        width={160}
        height={160}
        className={`absolute -z-10 opacity-15 ${compact ? "-right-4 -bottom-5 h-16 w-16" : "-right-8 -bottom-10 h-40 w-40"}`}
      />
      <span className="flex flex-col items-center gap-1.5">
        <svg width={compact ? 22 : 40} height={compact ? 22 : 40} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          {look.icon}
        </svg>
        <span className={`font-extrabold uppercase tracking-wider ${compact ? "text-[9px]" : "text-[11px]"}`}>{look.label}</span>
      </span>
    </div>
  );
}

/** The hanging OPEN / CLOSED sign the school's mockup draws beside the status. */
function StatusSign({ open, label }: { open: boolean; label: string }) {
  const color = open ? "var(--green)" : "var(--crimson)";
  return (
    <svg width="78" height="56" viewBox="0 0 78 56" aria-hidden className="shrink-0">
      <path d="M39 4 18 22M39 4l21 18" stroke={color} strokeWidth="2.5" fill="none" />
      <circle cx="39" cy="4" r="3" fill={color} />
      <g transform="rotate(-8 39 36)">
        <rect x="6" y="20" width="66" height="30" rx="5" fill={color} />
        <text x="39" y="40.5" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="800">
          {label}
        </text>
      </g>
    </svg>
  );
}

/** A school building among trees on green hills with the flag's red at the foot — decoration. */
function SchoolScene() {
  return (
    <svg aria-hidden viewBox="0 0 480 140" preserveAspectRatio="xMidYMax slice" className="mt-auto block h-36 w-full">
      <g fill="#dfe8e4">
        <rect x="40" y="40" width="34" height="70" rx="2" />
        <rect x="80" y="55" width="26" height="55" rx="2" />
        <rect x="372" y="36" width="30" height="74" rx="2" />
        <rect x="408" y="52" width="38" height="58" rx="2" />
      </g>
      {/* the building */}
      <rect x="150" y="62" width="180" height="56" fill="#fff" stroke="#cbd8d2" strokeWidth="2" />
      <rect x="214" y="48" width="52" height="70" fill="#fff" stroke="#cbd8d2" strokeWidth="2" />
      <path d="M208 50h64l-32-16-32 16Z" fill="var(--green)" />
      <circle cx="240" cy="62" r="6" fill="#fff" stroke="var(--green)" strokeWidth="2" />
      <g fill="#7fb3c9">
        {[160, 180, 280, 300].map((x) => (
          <g key={x}>
            <rect x={x} y="72" width="12" height="12" rx="1.5" />
            <rect x={x} y="92" width="12" height="12" rx="1.5" />
          </g>
        ))}
      </g>
      <rect x="230" y="92" width="20" height="26" fill="var(--green-deep)" />
      {/* the flag */}
      <path d="M240 34V12" stroke="#555" strokeWidth="2" />
      <rect x="241" y="12" width="22" height="13" fill="var(--green)" />
      <circle cx="250" cy="18.5" r="4" fill="var(--crimson)" />
      {/* trees */}
      <g fill="#3f9a6e">
        {[118, 136, 344, 362, 98, 384].map((x, i) => (
          <circle key={x} cx={x} cy={i > 3 ? 100 : 96} r={i > 3 ? 11 : 14} />
        ))}
      </g>
      {/* hills and the red swoosh */}
      <path d="M0 140V112c90-22 170-10 240-2s160 8 240-8v38H0Z" fill="var(--green)" />
      <path d="M0 140v-14c70-18 140-18 200-8-60 4-120 12-200 22Z" fill="var(--crimson)" />
    </svg>
  );
}
