"use client";

import { useTransition, useState } from "react";
import { markAttendance } from "./actions";

export function AttendanceSheet({
  classSessionId,
  date,
  today,
  students,
  canSave,
}: {
  classSessionId: number;
  date: string;
  /** The school's today: the latest day attendance can be taken for. */
  today: string;
  /** Without Insert on "My Classes" the sheet is shown read-only. */
  canSave: boolean;
  students: { userId: number; name: string; studentId: string; current: string }[];
}) {
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);

  return (
    <section className="bg-white rounded-2xl border border-line p-6">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-1">
        <h2 className="font-display text-lg font-semibold text-green">Attendance — {date === today ? "today" : date}</h2>
        {/* A plain GET form: picking a day reloads the sheet with what was marked then. */}
        <form className="flex items-end gap-2">
          <label className="text-xs font-bold text-ink">
            Day
            <input type="date" name="date" defaultValue={date} max={today} className="mt-1 block rounded-lg border border-line px-2 py-1.5 text-xs" />
          </label>
          <button className="border border-line hover:border-green-mid text-ink text-xs font-bold rounded-lg px-3 py-1.5">Open</button>
        </form>
      </div>
      <p className="text-xs text-ink-soft mb-4">
        {canSave ? "Class roster. Choose a status per student and save." : "Class roster. Your account can view attendance but not record it."}
      </p>
      <form
        action={(formData) => {
          start(async () => {
            await markAttendance(classSessionId, formData);
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
          });
        }}
      >
        <input type="hidden" name="date" value={date} />
        <div className="divide-y divide-line">
          {students.map((s) => (
            <div key={s.userId} className="py-3 flex flex-wrap items-center gap-3">
              <div className="min-w-44">
                <p className="text-sm font-bold text-ink">{s.name}</p>
                <p className="text-[11px] text-ink-soft">{s.studentId}</p>
              </div>
              <select
                name={`att-${s.userId}`}
                defaultValue={s.current || "PRESENT"}
                aria-label={`Attendance for ${s.name}`}
                disabled={!canSave}
                className="ml-auto rounded-lg border border-line px-3 py-2 text-xs font-bold focus:border-green-mid focus:outline-none"
              >
                <option value="PRESENT">Present</option>
                <option value="LATE">Late</option>
                <option value="ABSENT">Absent</option>
                {/* Set by an approved leave request; kept as it is when the sheet is saved. */}
                {s.current === "EXCUSED" && <option value="EXCUSED">Excused (leave)</option>}
              </select>
            </div>
          ))}
        </div>
        {students.length === 0 ? (
          <p className="text-sm text-ink-soft">No students enrolled yet.</p>
        ) : !canSave ? null : (
          <div className="mt-4 flex items-center gap-3">
            <button
              disabled={pending}
              className="bg-green hover:bg-green-deep disabled:opacity-60 text-white text-xs font-bold rounded-lg px-5 py-2.5 transition-colors"
            >
              {pending ? "Saving…" : "Save attendance"}
            </button>
            {saved && <span className="text-xs font-bold text-green">Saved ✓</span>}
          </div>
        )}
      </form>
    </section>
  );
}
