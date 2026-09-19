import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { FeeConfig } from "@/services/types";
import type { CmsPageResponse } from "@/services";
import { SectionBar } from "./SectionBar";

const krw = (n: number) => `₩${n.toLocaleString("en-US")}`;

/**
 * LP-4 — the four panels a parent reads before deciding.
 *
 * The first three are admin-authored CMS pages and a missing one drops its panel rather
 * than showing an empty frame. The fourth is *not* prose: tuition is money, so it comes
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
  const regular = fees.filter((f) => f.kind === "REGULAR_CLASS").slice(0, 8);
  const special = fees.filter((f) => f.kind === "SPECIAL_COURSE").slice(0, 8);
  if (!whyBcsk && !missionVision && !educationManagement && fees.length === 0) return null;

  return (
    <section id="school-overview" className="mx-auto max-w-7xl px-4 mt-14 scroll-mt-24">
      <SectionBar>{t.home.overview}</SectionBar>

      <div className="mt-5 space-y-5">
        {(whyBcsk || missionVision) && (
          <div className="grid lg:grid-cols-2 gap-5">
            {whyBcsk && <Panel title={t.home.whyBcsk} html={whyBcsk.html} />}
            {missionVision && <Panel title={t.home.missionVision} html={missionVision.html} />}
          </div>
        )}

        {educationManagement && (
          <Panel title={t.home.educationManagement} html={educationManagement.html} wide>
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
            <SectionBar level={3} tone="soft">
              {t.home.tuitionFeeOthers}
            </SectionBar>
            <div className="mt-3 grid lg:grid-cols-2 gap-5">
              <FeeTable title={t.nav.regularCourse} rows={regular} t={t} />
              <FeeTable title={t.nav.specialCourse} rows={special} t={t} />
            </div>
            <p className="mt-3 text-right">
              <Link
                href="/admission/tuition-fee"
                className="text-sky text-sm font-bold hover:underline underline-offset-4"
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
  wide,
  children,
}: {
  title: string;
  html: string;
  wide?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <SectionBar level={3} tone="soft">
        {title}
      </SectionBar>
      <div className="mt-3 rounded-2xl border border-line bg-white p-5">
        <div
          className={`prose-bcsk text-[14px] text-ink-soft leading-relaxed [&_h2]:text-base [&_h3]:text-sm ${
            wide ? "lg:columns-2 lg:gap-8" : ""
          }`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
        {children}
      </div>
    </div>
  );
}

function FeeTable({ title, rows, t }: { title: string; rows: FeeConfig[]; t: Dictionary }) {
  if (rows.length === 0) return null;
  return (
    <div className="rounded-2xl border border-line bg-white overflow-hidden">
      <p className="bg-cream px-4 py-2.5 text-sm font-bold text-navy">{title}</p>
      <table className="w-full text-[13px]">
        <thead className="sr-only">
          <tr>
            <th>{title}</th>
            <th>{t.common.fee}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((f) => (
            <tr key={f.id} className="border-t border-line">
              <td className="px-4 py-2 text-ink-soft">{f.label}</td>
              <td className="px-4 py-2 text-right font-bold text-navy whitespace-nowrap">
                {krw(f.semesterFee || f.bcskPrice || f.nonBcskPrice || 0)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
