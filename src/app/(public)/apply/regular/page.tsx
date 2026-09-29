import { recaptchaSiteKey } from "@/lib/recaptcha";
import { getDict } from "@/lib/i18n";
import { PageShell } from "@/components/site/PageShell";
import { RegularForm } from "./RegularForm";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getDict();
  return {
    title: `${t.nav.regularCourse} — Application`,
    description: "Online application for the BCSK Regular Course, Pre-Primary to Class 5.",
  };
}

export default async function RegularApplyPage() {
  const siteKey = recaptchaSiteKey();

  const { t } = await getDict();
  return (
    <PageShell title={`${t.nav.regularCourse} — Application`} eyebrow={t.nav.applyNow}>
      <div className="max-w-2xl bg-white border border-line rounded-3xl p-6 sm:p-8">
        <RegularForm recaptchaSiteKey={siteKey} />
      </div>
    </PageShell>
  );
}
