import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { EventNews } from "@/services/types";
import type { Lang } from "@/lib/constants";
import { formatDate, isoAttr } from "@/lib/dates";
import { reveal } from "@/lib/motion";
import { SectionBar } from "./SectionBar";

/**
 * Latest news and events.
 *
 * Not one of the deck's six bands — it sits between the opinions and the seminar gallery
 * because that is where the page turns from what the school *is* to what it has been doing.
 * It wears the same band bar as the sections around it so the addition does not read as a
 * bolted-on strip.
 *
 * Renders nothing at all when the school has published nothing: an empty "Latest News"
 * heading above three blank cards is worse than no section.
 */
export function LatestNews({ t, lang, news }: { t: Dictionary; lang: Lang; news: EventNews[] }) {
  if (news.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 mt-12">
      <SectionBar>{t.home.latestNews}</SectionBar>

      <ul className="mt-5 grid sm:grid-cols-3 gap-4">
        {news.map((n, i) => (
          <li key={n.id} {...reveal("up", i, 110)}>
            <Link
              href={`/events/news/${n.id}`}
              className="hover-lift group h-full flex flex-col rounded-2xl border border-line hover:border-sky/40 bg-white overflow-hidden relative"
            >
              {/* One warm edge at the top: without it three white rectangles in a row read as
                  a table of text rather than as three things worth opening. */}
              <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-sunrise z-10" />
              {n.imageUrl && (
                <div className="overflow-hidden">
                  {/* The photograph pushes in slightly under the pointer while the frame holds
                      its shape — the card reads as a door rather than a picture that moved. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={n.imageUrl}
                    alt=""
                    loading="lazy"
                    className="w-full aspect-[16/9] object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none"
                  />
                </div>
              )}
              <div className="p-5 flex flex-col flex-1">
                <p className="text-[11px] font-extrabold uppercase tracking-wide text-sunrise-ink">{n.type}</p>
                <h3 className="mt-1.5 font-display text-lg font-semibold text-navy group-hover:text-sky transition-colors leading-snug">
                  {n.title}
                </h3>
                <p className="mt-2 text-sm text-ink-soft leading-relaxed line-clamp-3">{n.body}</p>
                <time className="block mt-auto pt-3 text-xs text-ink-soft" dateTime={isoAttr(n.date)}>
                  {formatDate(n.date, lang)}
                </time>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <p {...reveal()} className="mt-4 text-right">
        <Link
          href="/events/news"
          className="nudge inline-flex items-center gap-1 text-sky text-sm font-bold hover:underline underline-offset-4"
        >
          {t.home.viewAll} <span className="nudge-mark inline-block">→</span>
        </Link>
      </p>
    </section>
  );
}
