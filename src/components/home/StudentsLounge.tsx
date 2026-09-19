import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { GalleryAlbum } from "@/services/types";
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
        {tiles.map((tile) => (
          <li key={tile.label}>
            <Link
              href={tile.href}
              className="block rounded bg-peach hover:bg-sunrise hover:text-white text-navy text-center text-[11px] font-bold px-3 py-2 transition-colors"
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
            {photos.map((p) => (
              <li key={p.id}>
                <Link href="/events/gallery" className="group block rounded overflow-hidden border border-line">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.url}
                    alt={p.caption ?? p.album}
                    loading="lazy"
                    className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform"
                  />
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-right">
            <Link href="/events/gallery" className="text-sky text-sm font-bold hover:underline underline-offset-4">
              {t.home.viewAll} →
            </Link>
          </p>
        </>
      )}
    </section>
  );
}
