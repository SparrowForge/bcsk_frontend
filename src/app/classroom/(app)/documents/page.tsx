import { requireMenu } from "@/lib/auth";
import { learning } from "@/services";
import { StudentTabs } from "@/components/classroom/StudentTabs";
import { formatDate } from "@/lib/dates";

const KIND: Record<string, string> = {
  COMPLETION: "Completion certificate", CHARACTER: "Character certificate", MARK_SHEET: "Mark sheet",
  TRANSFER_LETTER: "Transfer letter", ENROLLMENT: "Enrollment certificate", ID_CARD: "ID card", RESULT_SHEET: "Result sheet",
};
/** Documents the school issues in the results module are reprinted word for word from their serial. */
const REPRINTABLE = new Set(["COMPLETION", "CHARACTER", "TRANSFER_LETTER"]);

/** FR-STU-05/09: document downloads hub. LMS F3: with every document issued to the student. */
export default async function DocumentsPage() {
  await requireMenu("classroom.documents");
  const issued = await learning.documents();
  const docs = [
    {
      href: "/api/documents/certificate",
      title: "Enrollment Certificate",
      desc: "Official PDF certificate of current enrollment, signed by the Principal.",
      icon: "📜",
    },
    {
      href: "/api/documents/id-card",
      title: "Digital ID Card",
      desc: "Printable student ID card with a QR verification code.",
      icon: "🪪",
    },
    {
      href: "/api/documents/result-sheet",
      title: "Result Sheet",
      desc: "Latest semester result sheet as PDF.",
      icon: "📈",
    },
  ];
  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <StudentTabs group="documents" />
        <h1 className="font-display text-2xl font-semibold text-green mb-6">Documents & Certificates</h1>
        <div className="grid sm:grid-cols-3 gap-4">
          {docs.map((d) => (
            <a key={d.href} href={d.href} className="bg-white rounded-2xl border border-line p-6 hover:shadow-md transition-shadow">
              <span className="text-3xl" aria-hidden>{d.icon}</span>
              <h2 className="mt-3 font-bold text-green">{d.title}</h2>
              <p className="mt-1.5 text-xs text-ink-soft leading-relaxed">{d.desc}</p>
              <span className="inline-block mt-3 text-crimson-ink text-xs font-bold uppercase tracking-wide">Download PDF →</span>
            </a>
          ))}
        </div>
      </div>

      <section>
        <h2 className="font-display text-lg font-semibold text-ink mb-1">Issued to you</h2>
        <p className="text-xs text-ink-soft mb-3">
          Every document the school has issued you, with its serial - anyone can check a serial on the verification page.
          Mark sheets are downloaded from your Results page.
        </p>
        {issued.length === 0 ? (
          <p className="bg-white rounded-2xl border border-line p-6 text-sm text-ink-soft">Nothing issued yet.</p>
        ) : (
          <ul className="bg-white rounded-2xl border border-line divide-y divide-line">
            {issued.map((d) => (
              <li key={d.serial} className={`p-4 flex flex-wrap items-center justify-between gap-3 ${d.revokedAt ? "opacity-60" : ""}`}>
                <div>
                  <p className="text-sm font-bold text-ink">{KIND[d.type] ?? d.type.replace(/_/g, " ")}</p>
                  <p className="text-xs text-ink-soft mt-0.5">
                    {d.serial} · issued {formatDate(d.issuedAt)}
                    {d.revokedAt ? ` · withdrawn ${formatDate(d.revokedAt)}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <a href={`/verify/${d.serial}`} className="text-xs font-bold text-green-mid hover:underline">Verify</a>
                  {!d.revokedAt && REPRINTABLE.has(d.type) && (
                    <a
                      href={`/api/classroom/certificates/${d.serial}`}
                      className="text-xs font-bold text-white bg-green hover:bg-green-deep rounded-lg px-3 py-1.5"
                    >
                      Download PDF
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
