import { requireMenu } from "@/lib/auth";
import { learning } from "@/services";
import type { LeaveStatus } from "@/services/types";
import { ActionForm, field, label } from "@/components/admin/ActionForm";
import { StudentTabs } from "@/components/classroom/StudentTabs";
import { formatDate } from "@/lib/dates";
import { addDays, schoolToday } from "@/lib/school-time";
import { applyLeave, cancelLeave } from "./actions";

const STATUS: Record<LeaveStatus, { label: string; tone: string }> = {
  PENDING: { label: "With your class teacher", tone: "bg-amber-100 text-amber-800" },
  REVIEWED: { label: "With the Head Master", tone: "bg-amber-100 text-amber-800" },
  APPROVED: { label: "Approved", tone: "bg-green-soft text-green" },
  REJECTED: { label: "Not approved", tone: "bg-red-50 text-red-700" },
  CANCELLED: { label: "Cancelled", tone: "bg-mist text-ink-soft" },
};

/**
 * LMS F3: apply for leave and follow it. The class teacher reviews, the Head Master decides
 * (short leave may be settled by the class teacher), and approved school days are marked Excused.
 */
export default async function StudentLeavePage() {
  await requireMenu("classroom.documents");
  const requests = await learning.leave();
  const today = schoolToday();

  return (
    <div className="max-w-3xl space-y-6">
      <StudentTabs group="documents" />
      <div>
        <h1 className="font-display text-2xl font-semibold text-green mb-1">Leave</h1>
        <p className="text-sm text-ink-soft">
          Ask for days off school - in advance, or up to 30 days after. Your class teacher reviews it and the Head Master decides;
          you get a notification either way. Approved days are excused in your attendance.
        </p>
      </div>

      <section className="bg-white rounded-2xl border border-line p-5">
        <h2 className="font-bold text-green text-sm mb-3">Apply for leave</h2>
        <ActionForm action={applyLeave} submit="Send application" resetOnSuccess className="grid sm:grid-cols-2 gap-3 items-end">
          <label className={label}>From<input type="date" name="fromDate" required min={addDays(today, -30)} defaultValue={today} className={`mt-1 block w-full ${field}`} /></label>
          <label className={label}>To (leave empty for one day)<input type="date" name="toDate" min={addDays(today, -30)} className={`mt-1 block w-full ${field}`} /></label>
          <label className={`${label} sm:col-span-2`}>
            Reason
            <textarea name="reason" required minLength={5} maxLength={1000} rows={3} className={`mt-1 block w-full ${field}`} />
          </label>
          <label className={`${label} sm:col-span-2`}>
            Doctor&apos;s note or letter (optional; PDF or image, up to 5 MB)
            <input type="file" name="attachment" accept="application/pdf,image/jpeg,image/png,image/webp" className="mt-1 block w-full text-xs" />
          </label>
        </ActionForm>
      </section>

      <section>
        <h2 className="text-xs font-extrabold uppercase tracking-wide text-crimson-ink mb-3">Your applications</h2>
        {requests.length === 0 ? (
          <p className="bg-white rounded-2xl border border-line p-6 text-sm text-ink-soft">You have not applied for leave.</p>
        ) : (
          <ul className="space-y-3">
            {requests.map((r) => {
              const s = STATUS[r.status] ?? { label: r.status, tone: "bg-mist text-ink-soft" };
              return (
                <li key={r.id} className="bg-white rounded-2xl border border-line p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <p className="text-sm font-bold text-ink">
                      {formatDate(r.fromDate)}{r.toDate !== r.fromDate ? ` to ${formatDate(r.toDate)}` : ""}
                      <span className="font-normal text-ink-soft"> · {r.days} school {r.days === 1 ? "day" : "days"}</span>
                    </p>
                    <span className={`text-[10px] font-extrabold uppercase rounded-full px-2 py-0.5 ${s.tone}`}>{s.label}</span>
                  </div>
                  <p className="text-sm text-ink mt-2 whitespace-pre-line">{r.reason}</p>
                  {r.decisionNote && <p className="text-xs text-ink-soft mt-2">Note from the school: {r.decisionNote}</p>}
                  {r.status === "APPROVED" && r.excusedMarks > 0 && (
                    <p className="text-xs text-green mt-1">{r.excusedMarks} class {r.excusedMarks === 1 ? "record" : "records"} marked excused.</p>
                  )}
                  {(r.status === "PENDING" || r.status === "REVIEWED") && (
                    <ActionForm action={cancelLeave} submit="Cancel application" variant="danger" confirm="Cancel this leave application?" className="mt-3">
                      <input type="hidden" name="leaveId" value={r.id} />
                    </ActionForm>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
