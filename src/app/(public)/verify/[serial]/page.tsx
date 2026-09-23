import { site } from "@/services";
import { formatDate } from "@/lib/dates";
import { PageShell } from "@/components/site/PageShell";
import { getContact } from "@/lib/contact";

/** FR-STU-09: QR verification endpoint for issued certificates and ID cards. */
export default async function VerifyPage({ params }: { params: Promise<{ serial: string }> }) {
  const { serial } = await params;
  const cert = await site.verify(serial);
  // The support address is an admin setting, so a change reaches this sentence too rather
  // than leaving one stale address buried in prose.
  const { email } = await getContact();

  return (
    <PageShell title="Document Verification" eyebrow="BCSK">
      <div className="max-w-md">
        {cert.valid ? (
          <div className="bg-white border border-line rounded-2xl p-8 text-center">
            <div className="mx-auto w-14 h-14 rounded-full bg-green/15 text-green flex items-center justify-center">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6 9 17l-5-5" /></svg>
            </div>
            <h2 className="mt-4 font-display text-xl font-semibold text-green">Valid document</h2>
            <dl className="mt-5 text-sm text-left space-y-2.5">
              <div className="flex justify-between"><dt className="font-bold text-ink-soft">Serial</dt><dd className="font-bold text-ink">{cert.serial}</dd></div>
              <div className="flex justify-between"><dt className="font-bold text-ink-soft">Type</dt><dd>{cert.type.replace(/_/g, " ")}</dd></div>
              <div className="flex justify-between"><dt className="font-bold text-ink-soft">Student</dt><dd>{cert.studentName}</dd></div>
              <div className="flex justify-between"><dt className="font-bold text-ink-soft">Student ID</dt><dd>{cert.studentId ?? "—"}</dd></div>
              <div className="flex justify-between"><dt className="font-bold text-ink-soft">Issued</dt><dd>{formatDate(cert.issuedAt)}</dd></div>
            </dl>
          </div>
        ) : (
          <div className="bg-white border border-line rounded-2xl p-8 text-center">
            <div className="mx-auto w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </div>
            <h2 className="mt-4 font-display text-xl font-semibold text-green">Not found</h2>
            <p className="mt-2 text-sm text-ink-soft">
              No document with serial “{serial}” was issued by BCSK. If you believe this is an error,{" "}
              contact {email}.
            </p>
          </div>
        )}
      </div>
    </PageShell>
  );
}
