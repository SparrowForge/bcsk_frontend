import Link from "next/link";
import { LogoMark } from "@/components/Logo";
import { SCHOOL } from "@/lib/constants";
import { getDict } from "@/lib/i18n";
import { getContact } from "@/lib/contact";

/**
 * The site footer, as the school's design deck draws it (LP-6): one light band — badge and
 * name on the left, the ways to reach the school in the middle, the two calls to action on
 * the right.
 *
 * Every contact line is an **admin setting** with the `SCHOOL` constant as its fallback, so
 * the office can correct a phone number without a deploy. That matters more here than
 * anywhere else on the site: these are the details a family actually uses, and the deck's
 * own values are mock-ups.
 *
 * The deck stops at that band. The thin rule beneath it is deliberate and is not decoration
 * — NFR-LEGAL-02 requires the privacy and refund policies to be reachable from every page,
 * and this footer is on every page.
 */
export async function Footer() {
  const { t } = await getDict();
  const year = new Date().getFullYear();
  const c = await getContact();

  const phones = [c.phone, c.phone2].filter(Boolean);
  const email = c.email;
  const hours = c.hours;
  const fbHandle = c.facebookHandle;

  return (
    <footer className="bg-cream/50 border-t border-line mt-14">
      <div className="mx-auto max-w-7xl px-4 py-8 grid gap-7 lg:grid-cols-[auto_1fr_auto] lg:gap-10 lg:items-center">
        <Link href="/" className="flex items-center gap-3.5" aria-label="BCSK — Home">
          <LogoMark size={58} />
          <span className="leading-tight">
            <span className="block font-display text-[17px] sm:text-xl font-semibold text-navy">
              {SCHOOL.name}
            </span>
            <span className="block text-[17px] sm:text-xl font-bold text-navy" lang="bn">
              {SCHOOL.nameBn}
            </span>
          </span>
        </Link>

        <ul className="space-y-1.5 text-[13px] text-ink-soft">
          {phones.length > 0 && (
            <li className="flex gap-2.5 items-center">
              <Icon>
                <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.9.5 2.9.6a2 2 0 0 1 1.7 2Z" />
              </Icon>
              <span>
                {phones.join(", ")}
                {hours && <span className="text-ink-soft/80"> ({hours})</span>}
              </span>
            </li>
          )}
          <li className="flex gap-2.5 items-center">
            <Icon>
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m2 7 10 6L22 7" />
            </Icon>
            <a href={`mailto:${email}`} className="hover:text-sky">
              {email}
            </a>
          </li>
          <li className="flex gap-2.5 items-center">
            <span className="shrink-0 text-navy" aria-hidden>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z" />
              </svg>
            </span>
            <a href={c.facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-sky">
              {fbHandle}
            </a>
          </li>
          <li className="flex gap-2.5 items-start">
            <Icon className="mt-0.5">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </Icon>
            <span>
              <span className="font-bold text-ink">{t.footer.address}:</span>{" "}
              <span lang="ko">{c.addressKo}</span>
            </span>
          </li>
        </ul>

        <div className="flex flex-col items-start lg:items-end gap-2">
          <Link
            href="/apply"
            className="bg-sunrise hover:bg-sunrise-deep text-white font-bold rounded px-5 py-2 text-[13px] transition-colors inline-flex items-center gap-1.5"
          >
            {t.nav.applyNow}
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden>
              <path d="m7 5 7 7-7 7M14 5l7 7-7 7" />
            </svg>
          </Link>
          <div className="flex gap-1.5">
            <Link
              href="/contact"
              className="rounded bg-sunrise hover:bg-sunrise-deep text-white text-[9px] font-bold px-2 py-1 transition-colors"
            >
              {t.home.adminSupport}
            </Link>
            <Link
              href="/contact?topic=IT"
              className="rounded bg-sunrise hover:bg-sunrise-deep text-white text-[9px] font-bold px-2 py-1 transition-colors"
            >
              {t.home.itSupport}
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto max-w-7xl px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-ink-soft">
          <p>
            © {year} {SCHOOL.name}. {t.footer.rights}
          </p>
          <div className="flex gap-4">
            {/* NFR-LEGAL-02: policy links on every page */}
            <Link href="/privacy-policy" className="hover:text-sky">
              {t.footer.privacy}
            </Link>
            <Link href="/refund-policy" className="hover:text-sky">
              {t.footer.refund}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/** The footer's contact glyphs — one stroke weight, one size, set from the list's text colour. */
function Icon({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={`shrink-0 text-navy ${className}`}
      aria-hidden
    >
      {children}
    </svg>
  );
}
