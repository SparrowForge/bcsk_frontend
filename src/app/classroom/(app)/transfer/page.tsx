import { requireMenu } from "@/lib/auth";
import { learning } from "@/services";
import type { TransferStatus } from "@/services/types";
import { ActionForm, field, label } from "@/components/admin/ActionForm";
import { StudentTabs } from "@/components/classroom/StudentTabs";
import { formatDate } from "@/lib/dates";
import { schoolToday } from "@/lib/school-time";
import { applyTransfer, cancelTransfer } from "./actions";

const STATUS: Record<TransferStatus, { label: string; tone: string }> = {
  SUBMITTED: { label: "With the office", tone: "bg-amber-100 text-amber-800" },
  VERIFIED: { label: "With the Head Master", tone: "bg-amber-100 text-amber-800" },
  APPROVED: { label: "Approved", tone: "bg-green-soft text-green" },
  REJECTED: { label: "Not approved", tone: "bg-red-50 text-red-700" },
  CANCELLED: { label: "Cancelled", tone: "bg-mist text-ink-soft" },
};

/**
 * LMS F3: leaving BCSK for another school. The office checks dues and library books, the Head
 * Master decides, and an approved request comes with a transfer letter whose serial anyone can verify.
 */
export default async function StudentTransferPage() {
  await requireMenu("classroom.documents");
  const requests = await learning.transfers();
  const inProgress = requests.some((r) => r.status === "SUBMITTED" || r.status === "VERIFIED");
  const approved = requests.find((r) => r.status === "APPROVED" && r.letterSerial);

  return (
    <div className="max-w-3xl space-y-6">
      <StudentTabs group="documents" />
      <div>
        <h1 className="font-display text-2xl font-semibold text-green mb-1">Transfer to another school</h1>
        <p className="text-sm text-ink-soft">
          The office first checks that fees are paid and library books returned; then the Head Master decides. Once approved you can
          download your transfer letter here.
        </p>
      </div>

      {approved && (
        <section className="bg-green-soft/50 rounded-2xl border border-green/30 p-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-bold text-green">Your transfer letter is ready</p>
            <p className="text-xs text-ink-soft mt-0.5">Serial {approved.letterSerial} · approved {formatDate(approved.decidedAt)}</p>
          </div>
          <a href="/api/classroom/transfers/letter" className="bg-green hover:bg-green-deep text-white text-xs font-bold rounded-lg px-4 py-2">Download letter (PDF)</a>
        </section>
      )}

      {!inProgress && !approved && (
        <section className="bg-white rounded-2xl border border-line p-5">
          <h2 className="font-bold text-green text-sm mb-3">Request a transfer</h2>
          <ActionForm action={applyTransfer} submit="Send request" resetOnSuccess className="grid sm:grid-cols-2 gap-3 items-end">
            <label className={label}>New school<input name="destination" required minLength={2} maxLength={200} className={`mt-1 block w-full ${field}`} /></label>
            <label className={label}>Leaving from<input type="date" name="effectiveDate" required defaultValue={schoolToday()} className={`mt-1 block w-full ${field}`} /></label>
            <label className={`${label} sm:col-span-2`}>
              Reason
              <textarea name="reason" required minLength={5} maxLength={1000} rows={3} className={`mt-1 block w-full ${field}`} />
            </label>
          </ActionForm>
        </section>
      )}

      {requests.length > 0 && (
        <section>
          <h2 className="text-xs font-extrabold uppercase tracking-wide text-crimson-ink mb-3">Your requests</h2>
          <ul className="space-y-3">
            {requests.map((r) => {
              const s = STATUS[r.status] ?? { label: r.status, tone: "bg-mist text-ink-soft" };
              return (
                <li key={r.id} className="bg-white rounded-2xl border border-line p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <p className="text-sm">
                      <span className="font-bold text-ink">{r.destination}</span>
                      <span className="text-ink-soft"> · from {formatDate(r.effectiveDate)} · asked {formatDate(r.createdAt)}</span>
                    </p>
                    <span className={`text-[10px] font-extrabold uppercase rounded-full px-2 py-0.5 ${s.tone}`}>{s.label}</span>
                  </div>
                  <p className="text-sm text-ink mt-2 whitespace-pre-line">{r.reason}</p>
                  {r.status !== "SUBMITTED" && r.status !== "CANCELLED" && (
                    <p className="text-xs text-ink-soft mt-2">
                      Fees {r.duesCleared ? "cleared" : "not cleared"} · library {r.libraryCleared ? "cleared" : "not cleared"}
                      {r.verifyNote ? ` · ${r.verifyNote}` : ""}
                    </p>
                  )}
                  {r.decisionNote && <p className="text-xs text-ink-soft mt-1">Note from the Head Master: {r.decisionNote}</p>}
                  {(r.status === "SUBMITTED" || r.status === "VERIFIED") && (
                    <ActionForm action={cancelTransfer} submit="Cancel request" variant="danger" confirm="Cancel this transfer request?" className="mt-3">
                      <input type="hidden" name="transferId" value={r.id} />
                    </ActionForm>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
