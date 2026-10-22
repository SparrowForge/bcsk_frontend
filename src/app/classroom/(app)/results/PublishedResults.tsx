import type { PublishedResult } from "@/services/types";

const ordinal = (n: number) =>
  `${n}${n % 100 >= 11 && n % 100 <= 13 ? "th" : ({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[n % 10] ?? "th"}`;

/**
 * LMS F3: the student's published exam results - one card per exam, with the subjects, the GPA or
 * grade, places, and the mark sheet as a PDF whose serial anyone can verify.
 */
export function PublishedResults({ results }: { results: PublishedResult[] }) {
  if (results.length === 0) return null;
  return (
    <section className="space-y-4">
      <h2 className="font-display text-lg font-semibold text-ink">Exam results</h2>
      {results.map((r) => (
        <article key={r.id} className="bg-white rounded-2xl border border-line p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-bold text-green">{r.exam.name}</h3>
              <p className="text-xs text-ink-soft mt-0.5">
                {r.exam.term.name} · {r.totalObtained} of {r.totalFull} ({r.percent.toFixed(1)}%)
                {r.sectionPosition ? ` · ${ordinal(r.sectionPosition)} in section` : ""}
                {r.classPosition ? ` · ${ordinal(r.classPosition)} in class` : ""}
              </p>
            </div>
            <div className="text-right">
              <p className={`font-display text-2xl font-semibold ${r.passed ? "text-green" : "text-red-700"}`}>
                {r.gpa != null ? r.gpa.toFixed(2) : r.grade}
              </p>
              <p className="text-[11px] font-bold text-ink-soft uppercase">{r.gpa != null ? `GPA · ${r.grade}` : "Grade"}</p>
            </div>
          </div>
          <div className="scroll-fade overflow-x-auto mt-3">
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
          <a
            href={`/api/classroom/exam-results/${r.exam.id}/mark-sheet`}
            className="inline-block mt-4 text-xs font-bold text-white bg-green hover:bg-green-deep rounded-lg px-4 py-2 transition-colors"
          >
            Download mark sheet (PDF)
          </a>
        </article>
      ))}
    </section>
  );
}
