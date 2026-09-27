import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { SectionBar } from "./SectionBar";
import { CardSlider } from "./CardSlider";

/**
 * LP-5 — six voices about the school, as an auto-advancing strip like the Teacher Panel.
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

  // Three soft tints: enough to make a strip of six read as a set of distinct cards rather
  // than as one grey block, without inventing a colour per role. A strip has one row, so a
  // plain rotation never stacks two of the same tint next to each other.
  const tints = ["bg-green-soft", "bg-crimson-band", "bg-green-band"];

  return (
    <section className="logo-shade mx-auto max-w-7xl px-4 mt-12">
      <SectionBar>{t.home.opinions}</SectionBar>
      <CardSlider
        t={t}
        label={t.home.opinions}
        basis="basis-full min-[420px]:basis-1/2 md:basis-1/3 lg:basis-1/4"
        items={roles.map((r, i) => {
          const href = r.slug && available.has(r.slug) ? `/bcsk/${r.slug}` : null;
          const card = (
            <>
              <p className="mb-4">
                <span className="inline-block rounded-full bg-crimson px-5 py-1.5 text-[11.5px] font-extrabold text-white">
                  {r.label}
                </span>
              </p>
              <div className="mx-auto w-full max-w-[200px] rounded-2xl bg-white/70 p-5">
                <PlayerGlyph interactive={!!href} />
              </div>
            </>
          );
          const shell = `flex h-full flex-col items-center rounded-2xl border border-green-mid/10 px-5 pt-6 pb-5 text-center ${tints[i % 3]}`;
          return {
            key: r.label,
            node: href ? (
              // Only a card that leads somewhere responds to the pointer — the placeholder
              // ones stay inert, which is the honest signal that there is nothing to play.
              <Link href={href} className={`group hover-lift ${shell}`}>
                {card}
                <span className="mt-auto pt-4 text-[12px] font-bold text-green group-hover:underline underline-offset-4">
                  {t.common.readFullMessage} →
                </span>
              </Link>
            ) : (
              <div className={shell}>
                {card}
                <span className="mt-auto pt-4 text-[12px] text-ink-soft">{t.home.opinionsSoon}</span>
              </div>
            ),
          };
        })}
      />
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
