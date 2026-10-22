import Link from "next/link";
import { requireMenu } from "@/lib/auth";
import { teaching } from "@/services";
import type { LeaveRequest, LeaveStatus } from "@/services/types";
import { ActionForm, field, label } from "@/components/admin/ActionForm";
import { TeachingTabs } from "@/components/office/TeachingTabs";
import { formatDate } from "@/lib/dates";
import { reviewLeave } from "./actions";

const STATUS: Record<LeaveStatus, { label: string; tone: string }> = {
  PENDING: { label: "Waiting for you", tone: "bg-amber-100 text-amber-800" },
  REVIEWED: { label: "With the Head Master", tone: "bg-mist text-ink-soft" },
  APPROVED: { label: "Approved", tone: "bg-green-soft text-green" },
  REJECTED: { label: "Rejected", tone: "bg-red-50 text-red-700" },
  CANCELLED: { label: "Cancelled", tone: "bg-mist text-ink-soft" },
};
const FILTERS: { value: string; label: string }[] = [
  { value: "PENDING", label: "Waiting for you" }, { value: "", label: "All" },
];

/** LMS F2: leave requests from the students of the sections this teacher is class teacher of. */
export default async function TeacherLeavePage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const session = await requireMenu("office.classes");
  const canReview = session.menus.find((m) => m.key === "office.classes")!.flags.update;
  const { status = "PENDING" } = await searchParams;
  const requests = await teaching.leave(status || undefined);

  return (
    <div className="max-w-4xl">
      <TeachingTabs />
      <h1 className="font-display text-2xl font-semibold text-green mb-1">Leave requests</h1>
      <p className="text-sm text-ink-soft mb-4">
        Requests from students of your class-teacher sections. Your recommendation goes to the Head Master, who decides; short leave within
        the school&apos;s limit is settled by you directly. Approved days are marked Excused in attendance.
      </p>
      <nav className="flex gap-2 mb-6" aria-label="Filter">
        {FILTERS.map((f) => (
          <Link
            key={f.label}
            href={f.value ? `/office/leave?status=${f.value}` : "/office/leave?status="}
            className={`text-xs font-bold rounded-full px-3 py-1 border ${status === f.value ? "border-green bg-green text-white" : "border-line text-ink-soft hover:text-green"}`}
          >
            {f.label}
          </Link>
        ))}
      </nav>

      {requests.length === 0 ? (
        <p className="bg-white rounded-2xl border border-line p-6 text-sm text-ink-soft">
          {status === "PENDING" ? "Nothing waiting for your review." : "No leave requests from your sections."}
        </p>
      ) : (
        <ul className="space-y-3">
          {requests.map((r) => <LeaveCard key={r.id} r={r} canReview={canReview} />)}
        </ul>
      )}
    </div>
  );
}

function LeaveCard({ r, canReview }: { r: LeaveRequest; canReview: boolean }) {
  const s = STATUS[r.status] ?? { label: r.status, tone: "bg-mist text-ink-soft" };
  return (
    <li className="bg-white rounded-2xl border border-line p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm">
            <span className="font-bold text-ink">{r.student.name}</span>{" "}
            <span className="text-[11px] text-ink-soft">{r.student.studentProfile?.studentId}</span>
          </p>
          <p className="text-xs text-ink-soft mt-0.5">
            {formatDate(r.fromDate)}{r.toDate !== r.fromDate ? ` to ${formatDate(r.toDate)}` : ""} · {r.days} school {r.days === 1 ? "day" : "days"} · asked {formatDate(r.createdAt)}
          </p>
        </div>
        <span className={`text-[10px] font-extrabold uppercase rounded-full px-2 py-0.5 ${s.tone}`}>{s.label}</span>
      </div>
      <p className="text-sm text-ink mt-3 whitespace-pre-line">{r.reason}</p>
      {r.attachmentUrl && (
        <a href={`/api/files/${r.attachmentUrl}`} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-xs font-bold text-green-mid hover:underline">
          Attached document
        </a>
      )}
      {r.recommendation && (
        <p className="text-xs text-ink-soft mt-3">
          You recommended {r.recommendation === "APPROVE" ? "approval" : "rejection"}{r.reviewNote ? `: ${r.reviewNote}` : ""}.
        </p>
      )}
      {r.decisionNote && <p className="text-xs text-ink-soft mt-1">Decision note: {r.decisionNote}</p>}
      {r.status === "PENDING" && canReview && (
        <ActionForm action={reviewLeave} submit="Send recommendation" className="mt-4 flex flex-wrap items-end gap-3 border-t border-line pt-4">
          <input type="hidden" name="leaveId" value={r.id} />
          <label className={label}>
            Recommendation
            <select name="recommendation" defaultValue="APPROVE" className={`mt-1 block ${field}`}>
              <option value="APPROVE">Approve</option>
              <option value="REJECT">Reject</option>
            </select>
          </label>
          <label className={`${label} flex-1 min-w-48`}>
            Note (optional)
            <input name="note" maxLength={500} className={`mt-1 block w-full ${field}`} />
          </label>
        </ActionForm>
      )}
    </li>
  );
}
