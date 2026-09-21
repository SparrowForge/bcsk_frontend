import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { GalleryAlbum } from "@/services/types";
import { reveal } from "@/lib/motion";
import { SectionBar } from "./SectionBar";

/**
 * LP-6 — the twelve shortcuts a family actually uses, then the seminar photographs.
 *
 * Every tile points at a page that exists. Four of them (payment report, ID card, result
 * sheet, certificate) live behind the student login, which is correct rather than broken:
 * the classroom layout sends a signed-out visitor to the login and back. "NCTB Book pdf"
 * and "Book List" are two names the school's families use for the same page, and the deck
 * lists both, so both are here pointing at it.
 */
export function StudentsLounge({ t, albums }: { t: Dictionary; albums: GalleryAlbum[] }) {
  const tiles = [
    { label: t.nav.classroom, href: "/classroom" },
    { label: t.nav.syllabus, href: "/academic/syllabus" },
    { label: t.home.loungeClassRoutine, href: "/academic/class-schedule" },
    { label: t.home.loungeNctb, href: "/academic/book-list" },
    { label: t.nav.bookList, href: "/academic/book-list" },
    { label: t.home.adminSupport, href: "/contact" },
    { label: t.home.loungePaymentReport, href: "/classroom/payments" },
    { label: t.nav.reAdmission, href: "/admission/re-admission" },
    { label: t.home.loungeDigitalId, href: "/classroom/documents" },
    { label: t.home.loungeResultSheet, href: "/classroom/results" },
    { label: t.home.loungeEnrollmentCert, href: "/classroom/documents" },
    { label: t.home.itSupport, href: "/contact?topic=IT" },
  ];

  // The deck shows twelve photographs; more than that belongs on the gallery page itself.
  const photos = albums.flatMap((a) => a.items.map((i) => ({ ...i, album: a.title }))).slice(0, 12);

  return (
    <section className="mx-auto max-w-7xl px-4 mt-12">
      <SectionBar>{t.home.studentsLounge}</SectionBar>

      <ul className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {tiles.map((tile, i) => (
          <li key={tile.label} {...reveal("zoom", i, 45)}>
            <Link
              href={tile.href}
              // Navy tiles under a navy bar: twelve shortcuts are a block of one thing, and
              // the marigold hover is what picks the one under the pointer out of the block.
              className="hover-pop block rounded-lg bg-navy text-white hover:bg-sunrise hover:text-navy text-center text-[11.5px] font-bold px-3 py-2.5 shadow-[0_6px_14px_-10px_rgba(29,43,100,0.9)]"
            >
              {tile.label}
            </Link>
          </li>
        ))}
      </ul>

      {photos.length > 0 && (
        <>
          <div className="mt-6">
            <SectionBar level={3}>
              {t.home.seminarGallery}
            </SectionBar>
          </div>
          <ul className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {photos.map((p, i) => (
              <li key={p.id} {...reveal("fade", i, 50)}>
                <Link
                  href="/events/gallery"
                  className="group block rounded overflow-hidden border border-line hover:border-sky/50 transition-colors"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.url}
                    alt={p.caption ?? p.album}
                    loading="lazy"
                    className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-110 motion-reduce:transform-none"
                  />
                </Link>
              </li>
            ))}
          </ul>
          <p {...reveal()} className="mt-4 text-right">
            <Link
              href="/events/gallery"
              className="nudge inline-flex items-center gap-1 text-sky text-sm font-bold hover:underline underline-offset-4"
            >
              {t.home.viewAll} <span className="nudge-mark inline-block">→</span>
            </Link>
          </p>
        </>
      )}
    </section>
  );
}
