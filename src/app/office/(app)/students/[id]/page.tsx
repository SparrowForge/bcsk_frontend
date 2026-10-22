import Link from "next/link";
import { notFound } from "next/navigation";
import { requireMenu } from "@/lib/auth";
import { ApiError, teaching } from "@/services";
import { TeachingTabs } from "@/components/office/TeachingTabs";

const STATE: Record<string, string> = {
  PROCESSED: "Awaiting approval", APPROVED: "Approved, not yet published", PUBLISHED: "Published",
};

/**
 * LMS F2: one student's results across exams, for a teacher who teaches them now. Results show
 * from processing on, so a teacher sees them before the students do.
 */
export default async function StudentResultsPage({ params }: { params: Promise<{ id: string }> }) {
  await requireMenu("office.classes");
  const { id } = await params;
  const data = await teaching.performance(Number(id)).catch((e) => {
    if (e instanceof ApiError && [403, 404].includes(e.status)) notFound();
    throw e;
  });

  return (
    <div className="max-w-4xl space-y-6">
      <TeachingTabs />
      <div>
        <Link href="/office/sections" className="text-xs font-bold text-green-mid hover:underline">← My sections</Link>
        <h1 className="font-display text-2xl font-semibold text-green mt-1">{data.student.name}</h1>
        <p className="text-xs text-ink-soft mt-1">{data.student.studentId ?? "No student ID"} · results from every exam processed so far</p>
      </div>

      {data.results.length === 0 ? (
        <p className="bg-white rounded-2xl border border-line p-6 text-sm text-ink-soft">No results have been processed for this student yet.</p>
      ) : (
        data.results.map((r) => (
          <section key={r.id} className="bg-white rounded-2xl border border-line p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-bold text-green">{r.exam.name}</h2>
                <p className="text-xs text-ink-soft mt-0.5">
                  {r.exam.term.name} · {STATE[r.status] ?? r.status}
                  {r.withheld ? ` · withheld${r.withheldReason ? `: ${r.withheldReason}` : ""}` : ""}
                </p>
              </div>
              <div className="text-right">
                <p className={`font-display text-2xl font-semibold ${r.passed ? "text-green" : "text-red-700"}`}>
                  {r.gpa != null ? r.gpa.toFixed(2) : r.grade}
                </p>
                <p className="text-[11px] font-bold text-ink-soft uppercase">
                  {r.gpa != null ? `GPA · ${r.grade}` : "Grade"} · {r.passed ? "passed" : `${r.failedSubjects} failed`}
                </p>
              </div>
            </div>
            <p className="text-sm text-ink mt-2">
              {r.totalObtained} of {r.totalFull} ({r.percent.toFixed(1)}%)
              {r.sectionPosition ? ` · ${ordinal(r.sectionPosition)} in section` : ""}
              {r.classPosition ? ` · ${ordinal(r.classPosition)} in class` : ""}
            </p>
            <div className="overflow-x-auto mt-3">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wide text-ink-soft border-b border-line">
                    <th className="py-1.5 pr-3">Subject</th><th className="py-1.5 pr-3 text-right">Marks</th>
                    <th className="py-1.5 pr-3 text-right">Grade</th><th className="py-1.5 text-right">Point</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {r.lines.map((l) => (
                    <tr key={l.id} className={l.passed ? "" : "text-red-700"}>
                      <td className="py-1.5 pr-3">{l.subjectName}{l.isOptional ? <span className="text-[11px] text-ink-soft"> (optional)</span> : null}</td>
                      <td className="py-1.5 pr-3 text-right">{l.isAbsent ? "Absent" : `${l.obtained} / ${l.fullMarks}`}</td>
                      <td className="py-1.5 pr-3 text-right font-bold">{l.grade}</td>
                      <td className="py-1.5 text-right">{l.gradePoint ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))
      )}
    </div>
  );
}

function ordinal(n: number) {
  const s = n % 100 >= 11 && n % 100 <= 13 ? "th" : ({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[n % 10] ?? "th";
  return `${n}${s}`;
}
