import { requireMenu } from "@/lib/auth";
import { learning } from "@/services";
import type { CalendarEventType } from "@/services/types";
import { StudentTabs } from "@/components/classroom/StudentTabs";
import { formatDate } from "@/lib/dates";
import { addDays, schoolToday } from "@/lib/school-time";

const TONE: Record<CalendarEventType, string> = {
  HOLIDAY: "bg-red-50 text-red-700", EXAM: "bg-amber-100 text-amber-800", TERM: "bg-green-soft text-green",
  EVENT: "bg-mist text-ink", MEETING: "bg-mist text-ink",
};
const SHORT = { weekday: "short", day: "numeric", month: "short" } as const;

/** LMS F3: the academic calendar as it concerns this student, from a month back to a year ahead. */
export default async function StudentCalendarPage() {
  await requireMenu("classroom.routine");
  const today = schoolToday();
  const events = await learning.calendar({ from: addDays(today, -30), to: addDays(today, 365) });
  const months = [...new Map(events.map((e) => [e.startDate.slice(0, 7), e.startDate])).entries()];

  return (
    <div className="max-w-3xl">
      <StudentTabs group="routine" />
      <h1 className="font-display text-2xl font-semibold text-green mb-6">Academic calendar</h1>
      {events.length === 0 ? (
        <p className="bg-white rounded-2xl border border-line p-6 text-sm text-ink-soft">Nothing on the calendar yet.</p>
      ) : (
        <div className="space-y-6">
          {months.map(([month, first]) => (
            <section key={month}>
              <h2 className="text-xs font-extrabold uppercase tracking-wide text-crimson-ink mb-2">
                {formatDate(first, "en", { month: "long", year: "numeric" })}
              </h2>
              <ul className="bg-white rounded-2xl border border-line divide-y divide-line">
                {events.filter((e) => e.startDate.startsWith(month)).map((e) => (
                  <li key={e.id} className={`p-4 flex flex-wrap items-start justify-between gap-3 ${e.endDate.slice(0, 10) < today ? "opacity-60" : ""}`}>
                    <div>
                      <p className="text-sm font-bold text-ink">{e.title}</p>
                      <p className="text-xs text-ink-soft mt-0.5">
                        {formatDate(e.startDate, "en", SHORT)}
                        {e.endDate.slice(0, 10) !== e.startDate.slice(0, 10) ? ` to ${formatDate(e.endDate, "en", SHORT)}` : ""}
                      </p>
                      {e.description && <p className="text-xs text-ink mt-1 whitespace-pre-line">{e.description}</p>}
                    </div>
                    <span className={`text-[10px] font-extrabold uppercase rounded-full px-2 py-0.5 ${TONE[e.type] ?? "bg-mist text-ink"}`}>
                      {e.type.charAt(0) + e.type.slice(1).toLowerCase()}
                    </span>
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
