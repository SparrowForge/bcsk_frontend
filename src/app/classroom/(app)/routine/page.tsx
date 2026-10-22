import { requireMenu } from "@/lib/auth";
import { learning } from "@/services";
import { StudentTabs } from "@/components/classroom/StudentTabs";

const DAY_ORDER = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

/** FR-STU-05: class routine. LMS F3: with the student's class, section, roll and subject teachers. */
export default async function RoutinePage() {
  await requireMenu("classroom.routine");
  const [week, places] = await Promise.all([learning.week(), learning.places()]);
  const sessions = [...week].sort(
    (a, b) =>
      DAY_ORDER.indexOf(a.dayOfWeek) - DAY_ORDER.indexOf(b.dayOfWeek) ||
      a.startTime.localeCompare(b.startTime),
  );
  const term = places[0]?.term;

  return (
    <div className="max-w-3xl">
      <StudentTabs group="routine" />
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold text-green">Class Routine</h1>
        {term && (
          <span className="text-xs font-bold text-ink-soft bg-white border border-line rounded-full px-3 py-1.5">{term.name}</span>
        )}
      </div>

      {places.map((p) => (
        <section key={p.sectionId} className="bg-white rounded-2xl border border-line p-5 mb-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-bold text-green">{p.class}, section {p.section}</h2>
            <p className="text-xs text-ink-soft">
              {p.rollNo ? `Roll ${p.rollNo}` : "Roll not given yet"}
              {p.room ? ` · ${p.room}` : ""}
              {p.classTeacher ? ` · class teacher ${p.classTeacher}` : ""}
            </p>
          </div>
          {p.subjects.length > 0 && (
            <ul className="mt-3 grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
              {p.subjects.map((s) => (
                <li key={s.id} className="flex justify-between gap-3">
                  <span className="text-ink">{s.name}{s.isOptional ? <span className="text-[11px] text-ink-soft"> (optional)</span> : null}</span>
                  <span className="text-xs text-ink-soft">{s.teachers.join(", ") || "—"}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

      {sessions.length === 0 ? (
        <p className="bg-white rounded-2xl border border-line p-6 text-sm text-ink-soft">No classes on your routine yet.</p>
      ) : (
        <div className="scroll-fade overflow-x-auto rounded-2xl border border-line">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-mist text-green text-left">
                <th className="px-5 py-3.5 font-bold">Day</th>
                <th className="px-5 py-3.5 font-bold">Time</th>
                <th className="px-5 py-3.5 font-bold">Class</th>
                <th className="px-5 py-3.5 font-bold">Teacher</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s.id} className="border-t border-line">
                  <td className="px-5 py-3.5 font-bold text-ink">{s.dayOfWeek}</td>
                  <td className="px-5 py-3.5">{s.startTime}{s.endTime ? `–${s.endTime}` : ""}</td>
                  <td className="px-5 py-3.5">
                    {s.subject?.name ?? s.title}
                    {s.room ? <span className="text-xs text-ink-soft"> · {s.room}</span> : null}
                    {s.notice ? <span className="block text-xs text-crimson-ink">{s.notice}</span> : null}
                  </td>
                  <td className="px-5 py-3.5 text-ink-soft">{s.teacher?.user.name ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
