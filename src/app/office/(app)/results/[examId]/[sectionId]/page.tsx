import Link from "next/link";
import { notFound } from "next/navigation";
import { requireMenu } from "@/lib/auth";
import { ApiError, teaching } from "@/services";
import { TeachingTabs } from "@/components/office/TeachingTabs";

const STATE: Record<string, string> = {
  PROCESSED: "Processed, awaiting the Head Master's approval",
  APPROVED: "Approved, not yet published to students",
  PUBLISHED: "Published to students",
};

/**
 * LMS F2: a section's results for one exam, read-only, for its teachers - once processed, so a
 * class teacher can check them before the Head Master approves. Downloads go to the API's
 * tabulation sheet (PDF) and its spreadsheet copy (CSV).
 */
export default async function SectionResultsPage({ params }: { params: Promise<{ examId: string; sectionId: string }> }) {
  await requireMenu("office.classes");
  const { examId, sectionId } = await params;
  let report: Awaited<ReturnType<typeof teaching.sectionResults>> | null = null;
  let notReady: string | null = null;
  try {
    report = await teaching.sectionResults(Number(examId), Number(sectionId));
  } catch (e) {
    if (e instanceof ApiError && e.status === 403) notFound();
    // Not processed yet (404), or returned to the teachers (422): say so instead of failing.
    if (e instanceof ApiError && [404, 422].includes(e.status)) notReady = e.status === 404 ? "These results have not been processed yet." : e.message;
    else throw e;
  }

  return (
    <div className="max-w-6xl space-y-6">
      <TeachingTabs />
      <Link href="/office/exams" className="text-xs font-bold text-green-mid hover:underline">← Exams & marks</Link>
      {!report ? (
        <p className="bg-white rounded-2xl border border-line p-6 text-sm text-ink-soft">{notReady}</p>
      ) : (
        <>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl font-semibold text-green">{report.exam.name}: {report.className}, section {report.section}</h1>
              <p className="text-xs text-ink-soft mt-1">{report.exam.term.name} · {STATE[report.status] ?? report.status}</p>
            </div>
            <div className="flex gap-2">
              <a href={`/api/office/results/${examId}/${sectionId}/tabulation.pdf`} className="border border-line hover:border-green-mid text-ink text-xs font-bold rounded-lg px-3 py-1.5">Tabulation (PDF)</a>
              <a href={`/api/office/results/${examId}/${sectionId}/tabulation.csv`} className="border border-line hover:border-green-mid text-ink text-xs font-bold rounded-lg px-3 py-1.5">Spreadsheet (CSV)</a>
            </div>
          </div>
          <section className="bg-white rounded-2xl border border-line p-5 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wide text-ink-soft border-b border-line">
                  <th className="py-2 pr-3">Roll</th><th className="py-2 pr-3">Student</th>
                  {report.subjects.map((s) => <th key={s} className="py-2 pr-3 text-right">{s}</th>)}
                  <th className="py-2 pr-3 text-right">Total</th>
                  <th className="py-2 pr-3 text-right">{report.exam.gradingScheme.kind === "GPA" ? "GPA" : "Grade"}</th>
                  <th className="py-2 text-right">Place</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {report.summaries.map((r) => (
                  <tr key={r.id} className={r.passed ? "" : "bg-red-50/50"}>
                    <td className="py-1.5 pr-3 text-ink-soft">{r.rollNo ?? "—"}</td>
                    <td className="py-1.5 pr-3">
                      <Link href={`/office/students/${r.studentUserId}`} className="font-bold text-ink hover:text-green-mid">{r.student.name}</Link>
                      {r.withheld && <span className="ml-1 text-[10px] font-extrabold uppercase text-amber-800">withheld</span>}
                    </td>
                    {report.subjects.map((s) => {
                      const l = r.lines.find((x) => x.subjectName === s);
                      return (
                        <td key={s} className={`py-1.5 pr-3 text-right ${l && !l.passed ? "text-red-700 font-bold" : ""}`}>
                          {!l ? "" : l.isAbsent ? "Abs" : l.obtained}{l ? <span className="text-[10px] text-ink-soft"> {l.grade}</span> : null}
                        </td>
                      );
                    })}
                    <td className="py-1.5 pr-3 text-right">{r.totalObtained}</td>
                    <td className="py-1.5 pr-3 text-right font-bold">{r.gpa != null ? r.gpa.toFixed(2) : r.grade}</td>
                    <td className="py-1.5 text-right">{r.sectionPosition ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      )}
    </div>
  );
}
