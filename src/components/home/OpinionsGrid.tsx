import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { SectionBar } from "./SectionBar";

/**
 * LP-5 — six voices about the school.
 *
 * The school has not recorded these yet, and the deck draws them as empty players, so each
 * card is an honest placeholder rather than a stock video. The two roles that *do* have a
 * published message behind them link to it: a visitor who wants the chairman's view can
 * read it today instead of meeting six dead tiles.
 */
export function OpinionsGrid({
  t,
  available,
}: {
  t: Dictionary;
  /** Slugs of `/bcsk/*` messages that actually exist, so a tile only links when it leads somewhere. */
  available: Set<string>;
}) {
  const roles = [
    { label: t.home.roleChairman, slug: "message-chairman" },
    { label: t.home.rolePrincipal, slug: "message-principal" },
    { label: t.home.roleAmbassador, slug: null },
    { label: t.home.roleGoverningBody, slug: "governing-body" },
    { label: t.home.roleGuardians, slug: null },
    { label: t.home.roleCommunityLeader, slug: null },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 mt-14">
      <SectionBar>{t.home.opinions}</SectionBar>

      <ul className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
        {roles.map((r) => {
          const href = r.slug && available.has(r.slug) ? `/bcsk/${r.slug}` : null;
          const frame = (
            <span className="rounded-lg border-[3px] border-ink/80 bg-white aspect-[4/3] flex items-center justify-center">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="currentColor" className="text-ink/80" aria-hidden>
                <path d="M8 5.5v13l11-6.5-11-6.5Z" />
              </svg>
            </span>
          );
          return (
            <li key={r.label}>
              <p className="mb-2 text-center">
                <span className="inline-block rounded-md bg-sunrise px-4 py-1 text-xs font-extrabold text-white">
                  {r.label}
                </span>
              </p>
              {href ? (
                <Link href={href} className="group block">
                  {frame}
                  <span className="mt-2 block text-center text-xs font-bold text-sky group-hover:underline underline-offset-4">
                    {t.common.readFullMessage} →
                  </span>
                </Link>
              ) : (
                <>
                  {frame}
                  <span className="mt-2 block text-center text-xs text-ink-soft">{t.home.opinionsSoon}</span>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
