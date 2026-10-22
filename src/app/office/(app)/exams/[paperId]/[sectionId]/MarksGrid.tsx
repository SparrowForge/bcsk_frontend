"use client";

import { useRef, useState, useTransition, type KeyboardEvent } from "react";
import { btn, btnQuiet, type FormState } from "@/components/admin/ActionForm";
import { saveMarks, submitMarks } from "../../actions";

type Row = { userId: number; name: string; studentId: string; rollNo: number | null; obtained: number | null; isAbsent: boolean };
type Cell = { value: string; absent: boolean };

/** What the API accepts: halves at the finest, 0 to the paper's full marks. */
function problem(value: string, fullMarks: number): string | null {
  if (value.trim() === "") return null;
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return "Enter a number from 0.";
  if (n > fullMarks) return `More than ${fullMarks}.`;
  if (Math.round(n * 2) !== n * 2) return "Halves at the finest.";
  return null;
}

/**
 * The marks grid (LMS F2). Built for typing a whole section in one go: Enter or the down arrow
 * moves to the next student, up goes back, and "a" in a mark box marks that student absent.
 * Mistakes are flagged as they are typed; the API checks everything again on save.
 */
export function MarksGrid({
  paperId, sectionId, fullMarks, passMarks, editable, students,
}: {
  paperId: number; sectionId: number; fullMarks: number; passMarks: number; editable: boolean; students: Row[];
}) {
  const [cells, setCells] = useState<Record<number, Cell>>(() =>
    Object.fromEntries(students.map((s) => [s.userId, { value: s.obtained == null ? "" : String(s.obtained), absent: s.isAbsent }])),
  );
  const [dirty, setDirty] = useState(false);
  const [state, setState] = useState<FormState>(null);
  const [pending, start] = useTransition();
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const set = (userId: number, next: Partial<Cell>) => {
    setCells((c) => ({ ...c, [userId]: { ...c[userId]!, ...next } }));
    setDirty(true);
    setState(null);
  };
  const focus = (i: number) => inputs.current[Math.max(0, Math.min(students.length - 1, i))]?.focus();
  const onKey = (i: number, userId: number) => (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "ArrowDown") { e.preventDefault(); focus(i + 1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); focus(i - 1); }
    else if (e.key.toLowerCase() === "a") { e.preventDefault(); set(userId, { absent: true, value: "" }); focus(i + 1); }
  };

  const rows = students.map((s) => ({ ...s, cell: cells[s.userId]!, error: cells[s.userId]!.absent ? null : problem(cells[s.userId]!.value, fullMarks) }));
  const errors = rows.filter((r) => r.error).length;
  const done = rows.filter((r) => r.cell.absent || r.cell.value.trim() !== "").length;
  const marks = rows.filter((r) => !r.cell.absent && r.cell.value.trim() !== "" && !r.error).map((r) => Number(r.cell.value));
  const below = marks.filter((m) => m < passMarks).length;

  const entries = () => rows.map((r) => ({
    studentUserId: r.userId,
    obtained: r.cell.absent || r.cell.value.trim() === "" ? null : Number(r.cell.value),
    isAbsent: r.cell.absent,
  }));
  const run = (fn: typeof saveMarks) => start(async () => {
    const res = await fn(paperId, sectionId, entries());
    setState(res);
    if (res?.ok) setDirty(false);
  });

  if (students.length === 0) return <p className="bg-white rounded-2xl border border-line p-6 text-sm text-ink-soft">No students are placed in this section.</p>;

  return (
    <section className="bg-white rounded-2xl border border-line p-5 space-y-4">
      <p className="text-xs text-ink-soft">
        {done} of {students.length} entered
        {marks.length > 0 && ` · highest ${Math.max(...marks)} · ${below} below the pass mark`}
        {editable && " · Enter moves down, A marks absent"}
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wide text-ink-soft border-b border-line">
              <th className="py-2 pr-3 w-14">Roll</th><th className="py-2 pr-3">Student</th>
              <th className="py-2 pr-3 w-36">Marks / {fullMarks}</th><th className="py-2 w-24">Absent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((r, i) => (
              <tr key={r.userId} className={r.cell.absent ? "bg-mist/40" : ""}>
                <td className="py-1.5 pr-3 text-ink-soft">{r.rollNo ?? "—"}</td>
                <td className="py-1.5 pr-3">
                  <span className="font-bold text-ink">{r.name}</span> <span className="text-[11px] text-ink-soft">{r.studentId}</span>
                </td>
                <td className="py-1.5 pr-3">
                  <input
                    ref={(el) => { inputs.current[i] = el; }}
                    inputMode="decimal"
                    aria-label={`Marks for ${r.name}`}
                    aria-invalid={r.error ? true : undefined}
                    value={r.cell.absent ? "" : r.cell.value}
                    placeholder={r.cell.absent ? "absent" : ""}
                    disabled={!editable || r.cell.absent}
                    onChange={(e) => set(r.userId, { value: e.target.value })}
                    onKeyDown={onKey(i, r.userId)}
                    className={`w-24 rounded-lg border px-2 py-1.5 text-sm text-right focus:outline-none ${
                      r.error ? "border-red-400 focus:border-red-600" : "border-line focus:border-green-mid"
                    } ${!r.cell.absent && r.cell.value !== "" && !r.error && Number(r.cell.value) < passMarks ? "text-red-700 font-bold" : ""}`}
                  />
                  {r.error && <span className="block text-[11px] font-semibold text-red-700" role="alert">{r.error}</span>}
                </td>
                <td className="py-1.5">
                  <input
                    type="checkbox"
                    aria-label={`${r.name} absent`}
                    checked={r.cell.absent}
                    disabled={!editable}
                    onChange={(e) => set(r.userId, { absent: e.target.checked, value: e.target.checked ? "" : r.cell.value })}
                    className="w-4 h-4 accent-green"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editable && (
        <div className="flex flex-wrap items-center gap-3 border-t border-line pt-4">
          <button type="button" disabled={pending || errors > 0} onClick={() => run(saveMarks)} className={btnQuiet}>
            {pending ? "Saving…" : "Save draft"}
          </button>
          <button
            type="button"
            disabled={pending || errors > 0 || done < students.length}
            onClick={() => {
              if (window.confirm("Submit these marks? After that only the Head Master can reopen them.")) run(submitMarks);
            }}
            className={btn}
            title={done < students.length ? "Every student needs marks or an absence first." : undefined}
          >
            Submit marks
          </button>
          {dirty && !pending && <span className="text-xs text-amber-800">Unsaved changes</span>}
          {state?.ok && !pending && <span className="text-xs font-bold text-green" role="status">Saved</span>}
          {state?.error && !pending && <span className="text-xs font-semibold text-red-700" role="alert">{state.error}</span>}
        </div>
      )}
    </section>
  );
}
