import { requirePermission } from "@/lib/auth";
import { admin } from "@/services";
import { formatDate } from "@/lib/dates";
import { TicketActions } from "./TicketActions";

/** FR-CONT-01 (admin side): support tickets from the contact form. */
export default async function TicketsPage() {
  await requirePermission("tickets:manage");
  // Open first, then in-progress, then closed — which is what an ascending status sort gives.
  const tickets = (await admin.tickets()).sort(
    (a, b) => a.status.localeCompare(b.status) || b.createdAt.localeCompare(a.createdAt),
  );

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-semibold text-green mb-6">Support Tickets</h1>
      <div className="space-y-4">
        {tickets.length === 0 && (
          <p className="bg-white rounded-2xl border border-line p-6 text-sm text-ink-soft">No tickets.</p>
        )}
        {tickets.map((t) => (
          <div key={t.id} className="bg-white rounded-2xl border border-line p-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase bg-mist rounded-full px-2.5 py-1">{t.category}</span>
              <span className="font-bold text-ink text-sm">{t.subject}</span>
              <span className={`ml-auto text-[11px] font-bold rounded-full px-2.5 py-1 ${
                t.status === "OPEN" ? "bg-amber/15 text-amber-ink" : t.status === "IN_PROGRESS" ? "bg-green-soft text-green" : "bg-green/15 text-green"
              }`}>
                {t.status.replace(/_/g, " ")}
              </span>
            </div>
            <p className="mt-1 text-xs text-ink-soft">
              {t.name} · <a className="text-green-mid hover:underline" href={`mailto:${t.email}`}>{t.email}</a>
              {t.phone ? ` · ${t.phone}` : ""} · {formatDate(t.createdAt)}
            </p>
            <p className="mt-3 text-sm text-ink whitespace-pre-line">{t.message}</p>
            {t.reply && (
              <p className="mt-3 text-sm bg-mist rounded-xl p-4"><b className="text-green">Office reply:</b> {t.reply}</p>
            )}
            <div className="mt-4 border-t border-line pt-4">
              <TicketActions ticketId={t.id} status={t.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
