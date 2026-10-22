import { formatDate } from "@/lib/dates";
import { requireMenu } from "@/lib/auth";
import { classroom, learning } from "@/services";

/** FR-STU-05: attendance report. */
export default async function AttendancePage() {
  const session = await requireMenu("classroom.attendance");
  const [records, summary] = await Promise.all([classroom.attendance(), learning.attendance()]);
  const present = records.filter((r) => r.status === "PRESENT").length;
  const total = records.length;
  // LMS F3: the school's own rate, in which an excused day (approved leave) counts for nothing.
  const rate = summary.overall.rate;

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-semibold text-green mb-6">Attendance Report</h1>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-line p-5 text-center">
          <p className="font-display text-3xl font-semibold text-green">{total}</p>
          <p className="text-xs font-bold text-ink-soft uppercase mt-1">Sessions</p>
        </div>
        <div className="bg-white rounded-2xl border border-line p-5 text-center">
          <p className="font-display text-3xl font-semibold text-green">{present}</p>
          <p className="text-xs font-bold text-ink-soft uppercase mt-1">Present</p>
        </div>
        <div className="bg-white rounded-2xl border border-line p-5 text-center">
          <p className="font-display text-3xl font-semibold text-crimson-ink">{rate != null ? `${rate}%` : "—"}</p>
          <p className="text-xs font-bold text-ink-soft uppercase mt-1">Attendance</p>
        </div>
      </div>
      {summary.classes.some((c) => c.total > 0) && (
        <section className="bg-white rounded-2xl border border-line p-5 mb-6">
          <h2 className="font-bold text-green text-sm mb-3">By class this term</h2>
          <ul className="divide-y divide-line text-sm">
            {summary.classes.filter((c) => c.total > 0).map((c) => (
              <li key={c.classSessionId} className="py-2 flex flex-wrap items-center justify-between gap-3">
                <span className="font-bold text-ink">{c.subject ?? c.title}</span>
                <span className="text-xs text-ink-soft">
                  {c.present} present · {c.late} late · {c.absent} absent{c.excused ? ` · ${c.excused} excused` : ""}
                  <span className={`ml-3 font-bold ${c.rate != null && c.rate < 75 ? "text-red-700" : "text-green"}`}>{c.rate != null ? `${c.rate}%` : "—"}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="text-[11px] text-ink-soft mt-2">Excused days are approved leave and do not count against your attendance.</p>
        </section>
      )}
      <div className="scroll-fade overflow-x-auto rounded-2xl border border-line">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-mist text-green text-left">
              <th className="px-5 py-3.5 font-bold">Date</th>
              <th className="px-5 py-3.5 font-bold">Class</th>
              <th className="px-5 py-3.5 font-bold">Status</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 && (
              <tr><td colSpan={3} className="px-5 py-6 text-ink-soft">No attendance recorded yet.</td></tr>
            )}
            {records.map((r) => (
              <tr key={r.id} className="border-t border-line">
                <td className="px-5 py-3">{formatDate(r.date)}</td>
                <td className="px-5 py-3">{r.classSession.title}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs font-bold rounded-full px-3 py-1 ${
                    r.status === "PRESENT" ? "bg-green/15 text-green" : r.status === "LATE" ? "bg-amber/15 text-amber-ink" : r.status === "EXCUSED" ? "bg-mist text-ink-soft" : "bg-red-50 text-red-600"
                  }`}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
