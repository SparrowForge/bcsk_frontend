import { requireMenu } from "@/lib/auth";
import { learning } from "@/services";
import { StudentTabs } from "@/components/classroom/StudentTabs";
import { formatDate } from "@/lib/dates";
import { schoolToday } from "@/lib/school-time";

/** LMS F3: the exam schedule of the student's classes this term. */
export default async function StudentExamsPage() {
  await requireMenu("classroom.routine");
  const exams = await learning.exams();
  const today = schoolToday();

  return (
    <div className="max-w-3xl">
      <StudentTabs group="routine" />
      <h1 className="font-display text-2xl font-semibold text-green mb-6">Exam schedule</h1>
      {exams.length === 0 ? (
        <p className="bg-white rounded-2xl border border-line p-6 text-sm text-ink-soft">No exam has been scheduled for your class yet.</p>
      ) : (
        <div className="space-y-6">
          {exams.map((e) => (
            <section key={e.id} className="bg-white rounded-2xl border border-line p-5">
              <h2 className="font-bold text-green">{e.name}</h2>
              {e.instructions && <p className="text-xs text-ink-soft mt-1 whitespace-pre-line">{e.instructions}</p>}
              <div className="overflow-x-auto mt-3">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[11px] uppercase tracking-wide text-ink-soft border-b border-line">
                      <th className="py-2 pr-3">Date</th><th className="py-2 pr-3">Time</th><th className="py-2 pr-3">Subject</th>
                      <th className="py-2 pr-3">Room</th><th className="py-2 text-right">Marks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {e.papers.map((p) => (
                      <tr key={p.id} className={p.date.slice(0, 10) < today ? "text-ink-soft" : ""}>
                        <td className="py-2 pr-3 font-bold">{formatDate(p.date, "en", { weekday: "short", day: "numeric", month: "short" })}</td>
                        <td className="py-2 pr-3">{p.startTime}{p.endTime ? `–${p.endTime}` : ""}</td>
                        <td className="py-2 pr-3">{p.subject.name}</td>
                        <td className="py-2 pr-3">{p.room ?? "—"}</td>
                        <td className="py-2 text-right text-xs">{p.fullMarks} (pass {p.passMarks})</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
