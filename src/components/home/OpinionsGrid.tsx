import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { SectionBar } from "./SectionBar";

/**
 * LP-5 — six voices about the school.
 *
 * The school has not recorded these yet and the deck draws them as empty players, so each
 * tile is an honest placeholder rather than a stock video. The roles that *do* have
 * published content link to it: a visitor who wants the chairman's view can read it today
 * instead of meeting six dead tiles.
 */
export function OpinionsGrid({
  t,
  available,
}: {
  t: Dictionary;
  /** Slugs of `/bcsk/*` pages that actually exist, so a tile only links when it leads somewhere. */
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
    <section className="mx-auto max-w-7xl px-4 mt-12">
      <SectionBar>{t.home.opinions}</SectionBar>

      <ul className="mt-6 grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8 justify-items-center">
        {roles.map((r) => {
          const href = r.slug && available.has(r.slug) ? `/bcsk/${r.slug}` : null;
          return (
            <li key={r.label} className="w-full max-w-[220px] text-center">
              <p className="mb-2">
                <span className="inline-block rounded bg-sunrise px-5 py-1 text-[11px] font-extrabold text-white">
                  {r.label}
                </span>
              </p>
              {href ? (
                <Link href={href} className="group block">
                  <PlayerGlyph />
                  <span className="mt-1.5 block text-[11px] font-bold text-sky group-hover:underline underline-offset-4">
                    {t.common.readFullMessage} →
                  </span>
                </Link>
              ) : (
                <>
                  <PlayerGlyph />
                  <span className="mt-1.5 block text-[11px] text-ink-soft">{t.home.opinionsSoon}</span>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/**
 * The deck's empty-player mark: a heavy outlined screen, a play triangle, and the scrubber
 * bar beneath it. Drawn rather than an icon font so the stroke weight matches the deck at
 * this size.
 */
function PlayerGlyph() {
  return (
    <svg viewBox="0 0 100 86" className="w-full text-ink/85" aria-hidden>
      <rect x="3" y="3" width="94" height="80" rx="7" fill="none" stroke="currentColor" strokeWidth="6" />
      <rect x="15" y="15" width="70" height="42" rx="3" fill="none" stroke="currentColor" strokeWidth="5" />
      <path d="M41 26.5 62 36 41 45.5Z" fill="currentColor" />
      <rect x="15" y="66" width="70" height="6" rx="3" fill="currentColor" />
    </svg>
  );
}
