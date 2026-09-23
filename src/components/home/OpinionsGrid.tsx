import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { reveal } from "@/lib/motion";
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

  // Three soft tints: enough to make a row of six read as a set of distinct cards rather
  // than as one grey block, without inventing a colour per role.
  //
  // The colours run diagonally, and that takes two rotations rather than one: this grid is
  // two columns below `lg` and three at `lg`, and a rotation that steps diagonally across
  // three columns stacks the same tint twice in a column of two.
  //
  // Over two columns a plain `i % 3` already steps diagonally, because 2 and 3 share no
  // factor. Over three columns it does not — it gives every column one fixed colour — so
  // that grid adds a one-tile shift per row. Each tile therefore carries both: the base
  // class for the two-column grid and an `lg:` class for the three-column one. The arrays
  // hold the class names in full because Tailwind scans the source for literals; a name
  // assembled from a prefix and a variable would never be generated.
  const tints = ["bg-green-soft", "bg-green-soft", "bg-crimson-band"];
  const lgTints = ["lg:bg-green-soft", "lg:bg-green-soft", "lg:bg-crimson-band"];
  const tintFor = (i: number) => `${tints[i % 3]} ${lgTints[(i + Math.floor(i / 3)) % 3]}`;

  return (
    <section className="mx-auto max-w-7xl px-4 mt-12">
      <SectionBar>{t.home.opinions}</SectionBar>

      <ul className="mt-6 grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8 justify-items-center">
        {roles.map((r, i) => {
          const href = r.slug && available.has(r.slug) ? `/bcsk/${r.slug}` : null;
          return (
            <li key={r.label} {...reveal("up", i, 80)} className="w-full max-w-[220px] text-center">
              <p className="mb-2">
                <span className="inline-block rounded bg-crimson px-5 py-1 text-[11px] font-extrabold text-white">
                  {r.label}
                </span>
              </p>
              {href ? (
                // Only a tile that leads somewhere responds to the pointer — the placeholder
                // ones stay inert, which is the honest signal that there is nothing to play.
                <Link href={href} className="group block">
                  <div className={`hover-lift rounded-2xl p-5 ${tintFor(i)}`}>
                    <PlayerGlyph interactive />
                  </div>
                  <span className="mt-2 block text-[11px] font-bold text-green-mid group-hover:underline underline-offset-4">
                    {t.common.readFullMessage} →
                  </span>
                </Link>
              ) : (
                <>
                  <div className={`rounded-2xl p-5 ${tintFor(i)}`}>
                    <PlayerGlyph />
                  </div>
                  <span className="mt-2 block text-[11px] text-ink-soft">{t.home.opinionsSoon}</span>
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
function PlayerGlyph({ interactive }: { interactive?: boolean }) {
  return (
    <svg
      viewBox="0 0 100 86"
      className={`w-full text-green/75 ${
        interactive
          ? "transition-[transform,color] duration-300 group-hover:-translate-y-1 group-hover:text-green motion-reduce:transform-none"
          : ""
      }`}
      aria-hidden
    >
      <rect x="3" y="3" width="94" height="80" rx="7" fill="none" stroke="currentColor" strokeWidth="6" />
      <rect x="15" y="15" width="70" height="42" rx="3" fill="none" stroke="currentColor" strokeWidth="5" />
      {/* The play triangle leans forward under the pointer — the glyph's one moving part. */}
      <path
        d="M41 26.5 62 36 41 45.5Z"
        fill="currentColor"
        className={interactive ? "origin-center transition-transform duration-300 group-hover:scale-125 motion-reduce:transform-none" : ""}
      />
      <rect x="15" y="66" width="70" height="6" rx="3" fill="currentColor" />
    </svg>
  );
}
