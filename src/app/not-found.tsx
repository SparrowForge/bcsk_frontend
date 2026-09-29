import type { Metadata } from "next";
import Link from "next/link";
import { TopBar } from "@/components/site/TopBar";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { getDict } from "@/lib/i18n";

export const metadata: Metadata = { title: "Page not found" };

/**
 * The site's 404 — for unmatched URLs and for every `notFound()` a page throws.
 *
 * It lives at the root, not in `(public)/`, because only the root boundary sees an unmatched
 * URL. That also puts it *outside* the public layout, so it brings the top bar, header and
 * footer itself: before this file existed the fallback was Next's bare white "404" with no
 * way back into the site. The shortcuts are the pages a family arriving from an old link is
 * most likely to have been looking for.
 */
export default async function NotFound() {
  const { t } = await getDict();
  const shortcuts = [
    { label: t.nav.aboutUs, href: "/bcsk/about-us" },
    { label: t.nav.admissionProcess, href: "/admission/process" },
    { label: t.nav.tuitionFee, href: "/admission/tuition-fee" },
    { label: t.nav.latestNews, href: "/events/news" },
    { label: t.nav.contact, href: "/contact" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 pt-6">
          <div className="relative bg-mist rounded-3xl px-6 sm:px-12 py-14 sm:py-20 overflow-hidden text-center">
            <div className="absolute left-8 top-8 w-32 h-32 dot-grid opacity-60 hidden md:block" aria-hidden />
            <div className="absolute -right-8 -bottom-12 w-40 h-40 rounded-full bg-green-soft" aria-hidden />
            <p className="relative text-xs font-extrabold tracking-wide uppercase text-crimson-ink">
              {t.errors.notFoundEyebrow}
            </p>
            <h1 className="relative mt-2 font-display text-3xl sm:text-4xl font-semibold text-ink">
              {t.errors.notFoundTitle}
            </h1>
            <p className="relative mt-4 mx-auto max-w-xl text-ink-soft leading-relaxed">{t.errors.notFoundBody}</p>
            <div className="relative mt-7 flex flex-wrap justify-center gap-3">
              <Link
                href="/"
                className="press bg-green hover:bg-green-deep text-white font-bold rounded-lg px-6 py-2.5 text-sm transition-colors"
              >
                {t.errors.backHome}
              </Link>
              <Link
                href="/search"
                className="press bg-white hover:bg-green-soft text-green font-bold rounded-lg border-2 border-green/15 px-6 py-2.5 text-sm transition-colors"
              >
                {t.errors.searchSite}
              </Link>
            </div>
            <ul className="relative mt-8 flex flex-wrap justify-center gap-2">
              {shortcuts.map((s) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    className="inline-block rounded-full bg-white px-4 py-2 text-sm font-semibold text-green-mid hover:text-green hover:bg-green-soft transition-colors"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
