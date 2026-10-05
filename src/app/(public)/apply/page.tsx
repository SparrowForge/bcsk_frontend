import Link from "next/link";
import { recaptchaSiteKey } from "@/lib/recaptcha";
import { site } from "@/services";
import { getDict } from "@/lib/i18n";
import { PageShell } from "@/components/site/PageShell";
import { navMetadata } from "@/lib/seo";
import { ApplicationForm } from "./ApplicationForm";

export function generateMetadata() {
  return navMetadata("applyNow", "Apply to BCSK online: the Regular Course from Pre-Primary to Class 5, a special course such as IELTS for Kids, Abacus or Qur'an & Deen, or re-admission for current students.");
}

/** FR-ADM-01: Apply Now - one form for regular admission, special courses and re-admission. */
export default async function ApplyPage({ searchParams }: { searchParams: Promise<{ type?: string; course?: string }> }) {
  const { type, course } = await searchParams;
  const { t } = await getDict();
  const [courses, classes] = await Promise.all([site.specialCourses(), site.regularLevels()]);
  const initialType = course ? "SPECIAL" : type === "special" ? "SPECIAL" : type === "re-admission" ? "RE_ADMISSION" : "REGULAR";

  return (
    <PageShell title={t.nav.applyNow} eyebrow={t.nav.admission}>
      <div className="max-w-2xl bg-white border border-line rounded-3xl p-6 sm:p-8">
        <ApplicationForm
          initialType={initialType}
          classes={classes.map((c) => ({ id: c.id, name: c.name }))}
          courses={courses.map((c) => ({ value: c.slug, label: c.name, levels: c.levels ?? [] }))}
          preselectCourse={course}
          recaptchaSiteKey={recaptchaSiteKey()}
        />
      </div>
      <p className="mt-8 text-sm text-ink-soft max-w-2xl">
        After the form you&apos;ll continue to payment — card or bank transfer. Review the{" "}
        <Link href="/admission/tuition-fee" className="text-green-mid font-bold hover:underline">tuition fee table</Link> and{" "}
        <Link href="/admission/process" className="text-green-mid font-bold hover:underline">admission process</Link> first if
        you haven&apos;t.
      </p>
    </PageShell>
  );
}
