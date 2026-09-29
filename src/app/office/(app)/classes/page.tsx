import Link from "next/link";
import { requireTeacher } from "@/lib/auth";
import { office } from "@/services";

const WEEK = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const students = (n: number) => `${n} ${n === 1 ? "student" : "students"}`;

/**
 * FR-TCH-02: every class this teacher runs, as a weekly timetable.
 *
 * This route used to redirect to the dashboard, so the "My Classes" menu item landed on
 * Dashboard and never showed as the current page. The dashboard keeps its quick grid; this
 * is the full week, in day and time order, with totals.
 */
export default async function MyClassesPage() {
  await requireTeacher();
  const classes = await office.classes();

  const byDay = WEEK.map((day) => ({
    day,
    sessions: classes
      .filter((c) => c.dayOfWeek === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime)),
  })).filter((d) => d.sessions.length > 0);
  // Anything scheduled on a day the week list does not name still appears, last.
  const other = classes.filter((c) => !WEEK.includes(c.dayOfWeek));
  if (other.length) byDay.push({ day: "Other", sessions: other });

  const total = classes.reduce((n, c) => n + c._count.enrollments, 0);

  return (
    <div className="max-w-4xl">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <h1 className="font-display text-2xl font-semibold text-green">My Classes</h1>
        <p className="text-sm text-ink-soft">
          {classes.length} {classes.length === 1 ? "class" : "classes"} · {students(total)}
        </p>
      </div>

      {classes.length === 0 ? (
        <p className="bg-white rounded-2xl border border-line p-6 text-sm text-ink-soft">
          No classes assigned yet — the admin assigns classes from the Scheduling module.
        </p>
      ) : (
        <div className="space-y-8">
          {byDay.map(({ day, sessions }) => (
            <section key={day}>
              <h2 className="text-xs font-extrabold uppercase tracking-wide text-crimson-ink mb-3">{day}</h2>
              <ul className="bg-white rounded-2xl border border-line divide-y divide-line overflow-hidden">
                {sessions.map((s) => (
                  <li key={s.id}>
                    <Link
                      href={`/office/classes/${s.id}`}
                      className="group flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-4 hover:bg-green-soft/40 transition-colors"
                    >
                      <span className="font-mono text-sm tabular-nums text-ink w-24 shrink-0">
                        {s.startTime}
                        {s.endTime ? `–${s.endTime}` : ""}
                      </span>
                      <span className="font-bold text-green group-hover:text-green-mid min-w-0 flex-1">{s.title}</span>
                      {s.isLive && (
                        <span className="inline-flex items-center gap-1.5 bg-red-600 text-white text-[10px] font-extrabold rounded-full px-2.5 py-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" aria-hidden />
                          LIVE
                        </span>
                      )}
                      <span className="text-xs text-ink-soft">{students(s._count.enrollments)}</span>
                      <span className="text-xs font-bold text-crimson-ink">Manage →</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
