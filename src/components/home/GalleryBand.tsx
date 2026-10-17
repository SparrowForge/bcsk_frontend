import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { GalleryAlbum, GalleryItem } from "@/services/types";
import { reveal } from "@/lib/motion";
import { GallerySlider } from "./GallerySlider";

/**
 * "Moments That Inspire" — the photo and video gallery, closing the homepage (October 2026,
 * after the school's two mockups).
 *
 * One card per album: an icon and the album's name, a View All link into that album on the
 * Gallery page, a collage of its first four pictures and a count of its photos and videos.
 * At most three cards share a frame; the rest page in under the arrows and dots. The school
 * asked for it to look like the Student Corner band at about twice the size, so the cards
 * are the same family — white, rounded, lifted — with a picture area twice as tall.
 *
 * Albums come from Admin → Gallery. The category typed there drives the filter chips and the
 * card's icon, so "Sports & Games" gets a trophy without anyone choosing one. An album with
 * nothing in it is left out: an empty card is a broken promise on the homepage.
 */
export function GalleryBand({ t, albums }: { t: Dictionary; albums: GalleryAlbum[] }) {
  const filled = albums.filter((a) => a.items.length > 0);
  if (filled.length === 0) return null;

  const groups = [...new Set(filled.map((a) => a.category?.trim()).filter((c): c is string => !!c))];

  return (
    // `-mb-14` cancels the footer's top margin: the band is the last thing on the page, and
    // its wave runs straight into the footer's green instead of stopping at a strip of white.
    <section className="relative isolate mt-16 -mb-14 overflow-hidden pt-12 pb-24">
      {/* The band: a pale mint wash wall to wall, two outline glyphs (a camera, a player) in
          the top corners as the mockup draws them, and a green wave closing it into the footer. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-green-soft via-white to-green-soft/60" />
        <svg viewBox="0 0 64 64" className="absolute left-[6%] top-10 hidden h-20 w-20 -rotate-12 text-green/20 lg:block" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round">
          <path d="M8 20h10l5-7h18l5 7h10v32H8z" />
          <circle cx="32" cy="35" r="10" />
          <circle cx="32" cy="35" r="4.5" />
        </svg>
        <svg viewBox="0 0 64 64" className="absolute right-[6%] top-12 hidden h-20 w-20 rotate-6 text-green/20 lg:block" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round">
          <rect x="6" y="14" width="44" height="34" rx="5" />
          <path d="M14 8h44v34" />
          <path d="M23 24v14l12-7z" />
        </svg>
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-16 w-full sm:h-20">
          <path d="M0 70c240 40 480 50 720 30s480-60 720-30v50H0z" fill="var(--green-band)" />
          <path d="M0 95c260 25 520 25 760 5s440-30 680-5v25H0z" fill="var(--green)" />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-4">
        <header {...reveal()} className="text-center">
          <p className="flex items-center justify-center gap-3 text-[12px] font-extrabold uppercase tracking-[0.2em] text-green-mid">
            <span aria-hidden className="h-[2px] w-10 rounded-full bg-crimson" />
            {t.home.galleryEyebrow}
            <span aria-hidden className="h-[2px] w-10 rounded-full bg-crimson" />
          </p>
          <h2 className="mt-2 font-display text-[2rem] font-bold leading-tight text-green sm:text-[2.6rem]">
            {t.home.galleryTitle}
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-[14.5px] leading-relaxed text-ink-soft">{t.home.galleryIntro}</p>
        </header>

        <GallerySlider
          label={t.nav.gallery}
          allLabel={t.home.galleryAll}
          prevLabel={t.common.previous}
          nextLabel={t.common.next}
          slideLabel={t.home.gallerySlide}
          groups={groups}
          items={filled.map((a) => ({
            key: String(a.id),
            group: a.category?.trim() || null,
            node: <AlbumCard album={a} t={t} />,
          }))}
        />
      </div>
    </section>
  );
}

function AlbumCard({ album, t }: { album: GalleryAlbum; t: Dictionary }) {
  const photos = album.items.filter((i) => i.type !== "VIDEO").length;
  const videos = album.items.length - photos;
  const href = `/events/gallery#album-${album.id}`;

  return (
    <article className="hover-lift flex h-full flex-col rounded-2xl border border-line bg-white p-4 shadow-[0_18px_40px_-28px_rgba(0,77,57,0.55)]">
      <div className="flex items-center gap-3">
        <span aria-hidden className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-green text-white shadow-[0_8px_16px_-10px_rgba(0,77,57,0.9)]">
          <AlbumIcon name={`${album.category ?? ""} ${album.title}`} />
        </span>
        <h3 className="min-w-0 flex-1 truncate font-display text-[1.15rem] font-bold text-green" title={album.title}>
          {album.title}
        </h3>
        <Link
          href={href}
          className="nudge inline-flex shrink-0 items-center gap-1 rounded-full border border-green/20 px-3 py-1 text-[11.5px] font-bold text-green hover:border-green hover:bg-green-soft"
        >
          {t.home.viewAll}
          <span className="sr-only">: {album.title}</span>
          <span aria-hidden className="nudge-mark inline-block">→</span>
        </Link>
      </div>

      <Link href={href} tabIndex={-1} aria-hidden className="mt-3.5 block">
        <Collage items={album.items} />
      </Link>

      <p className="mt-3.5 flex items-center justify-center gap-3 text-[12px] font-semibold text-ink-soft">
        <span className="inline-flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden>
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <circle cx="9" cy="10" r="2" />
            <path d="m3 17 5-4 4 3 3-2 6 4" />
          </svg>
          {photos} {t.home.galleryPhotos}
        </span>
        {videos > 0 && (
          <>
            <span aria-hidden className="h-3.5 w-px bg-line" />
            <span className="inline-flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden>
                <rect x="3" y="6" width="13" height="12" rx="2" />
                <path d="m16 10 5-3v10l-5-3z" />
              </svg>
              {videos} {t.home.galleryVideos}
            </span>
          </>
        )}
      </p>
    </article>
  );
}

/**
 * The first four pictures, laid out for however many there are: one fills the frame, two sit
 * side by side, three put the first on the left at full height, four make a 2×2. More than
 * four puts a "+N" on the last tile. The frame is the same height whatever the count, so a
 * row of cards stays level.
 */
function Collage({ items }: { items: GalleryItem[] }) {
  const shown = items.slice(0, 4);
  const more = items.length - shown.length;
  const layout =
    shown.length === 1
      ? "grid-cols-1 grid-rows-1"
      : shown.length === 2
        ? "grid-cols-2 grid-rows-1"
        : "grid-cols-2 grid-rows-2";
  return (
    <div className={`grid h-64 gap-2 sm:h-72 ${layout}`}>
      {shown.map((item, i) => (
        <div
          key={item.id}
          className={`relative overflow-hidden rounded-xl bg-mist ${shown.length === 3 && i === 0 ? "row-span-2" : ""}`}
        >
          <Tile item={item} />
          {more > 0 && i === shown.length - 1 && (
            <span className="absolute inset-0 grid place-items-center bg-green-deep/60 font-display text-2xl font-bold text-white">
              +{more}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function Tile({ item }: { item: GalleryItem }) {
  const image = "h-full w-full object-cover transition-transform duration-500 hover:scale-105 motion-reduce:transform-none";
  if (item.type !== "VIDEO") {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={item.url} alt={item.caption ?? ""} loading="lazy" className={image} />;
  }
  // A video shows its first frame where the browser can load one, under a play mark.
  const playable = /\.(mp4|webm|ogg)(\?|$)/i.test(item.url) || item.url.startsWith("/api/files/");
  return (
    <>
      {playable ? (
        <video src={`${item.url}#t=0.1`} preload="metadata" muted playsInline className={image} />
      ) : (
        <span className="block h-full w-full bg-gradient-to-br from-green-deep to-green" />
      )}
      <span aria-hidden className="absolute inset-0 grid place-items-center bg-black/15">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-black/55 text-white ring-2 ring-white/80">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </span>
    </>
  );
}

/** Picks the card's glyph from the words in its category and title. */
function AlbumIcon({ name }: { name: string }) {
  const n = name.toLowerCase();
  const p = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (/seminar|workshop|talk|meeting|conference/.test(n))
    return (
      <svg {...p}>
        <circle cx="12" cy="5.5" r="2.5" />
        <path d="M8 21v-6.5a4 4 0 0 1 8 0V21M4 21h16M6 13h12" />
      </svg>
    );
  if (/sport|game|football|cricket|race|athlet/.test(n))
    return (
      <svg {...p}>
        <path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H5a2 2 0 0 0 0 4h3M16 6h3a2 2 0 0 1 0 4h-3M12 13v4M8.5 20h7l-1-3h-5z" />
      </svg>
    );
  // Word starts, so "Martyrs' Day" is not an art show and "latest" is not an exam.
  if (/\bart|craft|paint|draw|exhibit|creativ/.test(n))
    return (
      <svg {...p}>
        <path d="M12 3a9 9 0 1 0 0 18c1.4 0 2-1 2-2 0-1.5-1.3-2-1.3-3.3 0-1 .8-1.7 1.8-1.7H17a4 4 0 0 0 4-4c0-4-4-7-9-7Z" />
        <circle cx="7.5" cy="11" r="1.2" fill="currentColor" />
        <circle cx="10" cy="7" r="1.2" fill="currentColor" />
        <circle cx="15" cy="7.5" r="1.2" fill="currentColor" />
      </svg>
    );
  if (/exam|\btest|assess|result/.test(n))
    return (
      <svg {...p}>
        <path d="M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 15.5h7M9 19h4" />
      </svg>
    );
  if (/video|film|movie/.test(n))
    return (
      <svg {...p}>
        <rect x="3" y="6" width="13" height="12" rx="2" />
        <path d="m16 10 5-3v10l-5-3z" />
      </svg>
    );
  if (/event|celebrat|day|eid|iftar|festival|program|ekushey|victory|independence/.test(n))
    return (
      <svg {...p}>
        <path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.2l5.9-.9z" />
      </svg>
    );
  if (/class|school|lesson|study|learn/.test(n))
    return (
      <svg {...p}>
        <path d="M12 6.5C10.3 5.2 7.8 4.6 4 4.8v12.9c3.8-.2 6.3.4 8 1.8 1.7-1.4 4.2-2 8-1.8V4.8c-3.8-.2-6.3.4-8 1.7ZM12 6.5v13" />
      </svg>
    );
  return (
    <svg {...p}>
      <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  );
}
