import type { Metadata } from "next";
import { recaptchaSiteKey } from "@/lib/recaptcha";
import { PageShell } from "@/components/site/PageShell";
import { leads, site } from "@/services";
import { EnquiryForm } from "./EnquiryForm";

export const metadata: Metadata = {
  title: "Enquire about admission | BCSK",
  description: "Ask Bangladesh Community School, Korea about classes, courses and admission.",
};

export default async function EnquiryPage() {
  // Both reads are cached public data; a failure should show the form, not an error page.
  const [courses, sources] = await Promise.all([
    site.specialCourses().catch(() => []),
    leads.publicSources().catch(() => []),
  ]);

  return (
    <PageShell title="Enquire about admission" eyebrow="BCSK">
      <div className="max-w-xl bg-mist rounded-2xl p-6 sm:p-8">
        <EnquiryForm
          recaptchaSiteKey={recaptchaSiteKey()}
          courses={courses.map((c) => ({ id: c.id, name: c.name }))}
          sources={sources}
        />
      </div>
    </PageShell>
  );
}
