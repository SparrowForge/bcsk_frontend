import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { FeeConfig } from "@/services/types";
import type { CmsPageResponse } from "@/services";
import { reveal } from "@/lib/motion";
import { PanelHead, SectionBar } from "./SectionBar";

const krw = (n: number) => `₩${n.toLocaleString("en-US")}`;

/**
 * LP-4 — the four panels a parent reads before deciding, inside one sheet.
 *
 * The deck draws them as panels *within* a single band, not as four free-floating cards: one
 * cool band bar names the section, one sheet holds everything, and each panel is a white card
 * under a warm head. The sheet is white rather than tinted — with a cream sheet behind them
 * the cream heads had nothing to sit against and the whole band read as one beige block.
 *
 * The first three are admin-authored CMS pages and a missing one drops its panel rather
 * than leaving an empty frame. The fourth is *not* prose: tuition is money, so it comes
 * from `FeeConfig` — the same rows the admission flow charges against — and a figure typed
 * into a CMS page could drift from what a family is actually billed.
 */
export function SchoolOverview({
  t,
  whyBcsk,
  missionVision,
  educationManagement,
  fees,
}: {
  t: Dictionary;
  whyBcsk: CmsPageResponse | null;
  missionVision: CmsPageResponse | null;
  educationManagement: CmsPageResponse | null;
  fees: FeeConfig[];
}) {
  const regular = fees.filter((f) => f.kind === "REGULAR_CLASS");
  const special = fees.filter((f) => f.kind === "SPECIAL_COURSE");
  if (!whyBcsk && !missionVision && !educationManagement && fees.length === 0) return null;

  return (
    <section id="school-overview" className="mx-auto max-w-7xl px-4 mt-12 scroll-mt-24">
      <SectionBar>{t.home.overview}</SectionBar>

      <div className="mt-4 rounded-xl bg-white border border-line p-4 sm:p-5 space-y-5">
        {(whyBcsk || missionVision) && (
          // The two side-by-side panels come in from their own sides — the only place on the
          // page where the motion tells you the pair is one row rather than two stacked bands.
          <div className="grid lg:grid-cols-2 gap-5">
            {whyBcsk && <Panel title={t.home.whyBcsk} html={whyBcsk.html} from="left" />}
            {missionVision && <Panel title={t.home.missionVision} html={missionVision.html} from="right" />}
          </div>
        )}

        {educationManagement && (
          <Panel title={t.home.educationManagement} html={educationManagement.html} columns>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold">
              <Link href="/bcsk/teachers" className="text-sky hover:underline underline-offset-4">
                {t.home.viewTeachers} →
              </Link>
              <Link href="/academic/class-schedule" className="text-sky hover:underline underline-offset-4">
                {t.home.viewSchedule} →
              </Link>
            </div>
          </Panel>
        )}

        {fees.length > 0 && (
          <div>
            {/* The fee pair is two cards with their own heads, so the group above them is a
                plain heading and a rule — a fifth bar here would just be another stripe. */}
            <h3
              {...reveal()}
              className="font-display text-[15px] font-semibold text-navy border-t border-line pt-4"
            >
              {t.home.tuitionFeeOthers}
            </h3>
            <div className="mt-3 grid lg:grid-cols-2 gap-5">
              <FeeTable title={t.nav.regularCourse} rows={regular} from="left" t={t} />
              <FeeTable title={t.nav.specialCourse} rows={special} from="right" t={t} />
            </div>
            <p {...reveal()} className="mt-3 text-right">
              <Link
                href="/admission/tuition-fee"
                className="text-sky text-xs font-bold hover:underline underline-offset-4"
              >
                {t.home.tuitionFeesLink} →
              </Link>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function Panel({
  title,
  html,
  columns,
  from,
  children,
}: {
  title: string;
  html: string;
  /** The deck sets Education Management in two columns; the narrower panels stay single. */
  columns?: boolean;
  /** Which side this panel slides in from; the full-width ones just rise. */
  from?: "left" | "right";
  children?: React.ReactNode;
}) {
  return (
    <div {...reveal(from ?? "up", 1, 90)} className="rounded-lg border border-line bg-white overflow-hidden h-full">
      <PanelHead>{title}</PanelHead>
      <div className="px-4 py-3.5">
        {/* An admin writing a CMS page may head a section with any level; inside a panel they
            all take the panel's own size, or a stray `#` renders at browser-default h1. */}
        <div
          className={`prose-bcsk text-[13px] text-ink leading-relaxed [&_h1]:!text-[14px] [&_h2]:!text-[14px] [&_h3]:!text-[13px] [&_:is(h1,h2,h3)]:!mt-3.5 [&_:is(h1,h2,h3):first-child]:!mt-0 [&_p]:my-1 [&_ul]:my-1 [&_li]:my-0.5 ${
            columns ? "lg:columns-2 lg:gap-10" : ""
          }`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
        {children}
      </div>
    </div>
  );
}

function FeeTable({
  title,
  rows,
  from,
  t,
}: {
  title: string;
  rows: FeeConfig[];
  from: "left" | "right";
  t: Dictionary;
}) {
  if (rows.length === 0) return null;
  return (
    <div {...reveal(from)} className="rounded-lg border border-line bg-white overflow-hidden">
      <PanelHead>{title}</PanelHead>
      <table className="w-full text-[12.5px]">
        <thead className="sr-only">
          <tr>
            <th>{title}</th>
            <th>{t.common.fee}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((f) => (
            // A fee row is the line a parent traces with a finger; the tint follows the pointer.
            <tr key={f.id} className="border-t border-line transition-colors hover:bg-sky-soft/60">
              <td className="px-4 py-1.5 text-ink">{f.label}</td>
              <td className="px-4 py-1.5 text-right font-bold text-navy whitespace-nowrap">
                {krw(f.semesterFee || f.bcskPrice || f.nonBcskPrice || 0)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
