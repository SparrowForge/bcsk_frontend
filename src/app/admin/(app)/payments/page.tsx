import Link from "next/link";
import { requirePermission } from "@/lib/auth";
import { payments as paymentsApi } from "@/services";
import { krw } from "@/lib/format";
import { PaymentRowActions } from "./PaymentRowActions";

const STATUS_STYLE: Record<string, string> = {
  PAID: "bg-green/15 text-green",
  VERIFIED: "bg-green/15 text-green",
  PENDING_VERIFICATION: "bg-amber/15 text-amber-ink",
  PENDING: "bg-mist text-ink-soft",
  REJECTED: "bg-red-50 text-red-600",
  FAILED: "bg-red-50 text-red-600",
  REFUNDED: "bg-green-soft text-green",
};

/** FR-ADMIN-04: payments module — status, receipt preview, verification, refunds, export. */
export default async function AdminPaymentsPage({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  await requirePermission("payments:read");
  const { filter = "all" } = await searchParams;
  // The ledger is one endpoint; the three tabs are a view over it, so the filter and the
  // status-then-date ordering are applied here rather than round-tripped as query state.
  const all = await paymentsApi.list();
  const payments = all
    .filter((p) =>
      filter === "pending"
        ? p.status === "PENDING_VERIFICATION"
        : filter === "confirmed"
        ? ["PAID", "VERIFIED"].includes(p.status)
        : true,
    )
    .sort((a, b) => b.status.localeCompare(a.status) || b.createdAt.localeCompare(a.createdAt));

  const tabs = [
    ["all", "All"],
    ["pending", "Pending verification"],
    ["confirmed", "Confirmed"],
  ] as const;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="font-display text-2xl font-semibold text-green">Payments</h1>
        <a
          href="/api/admin/payments-export"
          className="bg-green hover:bg-green-deep text-white text-xs font-bold rounded-lg px-4 py-2.5 transition-colors"
        >
          Export CSV
        </a>
      </div>
      <div className="flex gap-2 mb-5">
        {tabs.map(([k, label]) => (
          <Link
            key={k}
            href={`/admin/payments?filter=${k}`}
            className={`text-xs font-bold rounded-full px-4 py-2 transition-colors ${
              filter === k ? "bg-green text-white" : "bg-white border border-line text-ink-soft hover:text-green"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      <div className="scroll-fade overflow-x-auto rounded-2xl border border-line">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-mist text-green text-left">
              <th className="px-4 py-3.5 font-bold">#</th>
              <th className="px-4 py-3.5 font-bold">Payer</th>
              <th className="px-4 py-3.5 font-bold">Purpose</th>
              <th className="px-4 py-3.5 font-bold">Method / Ref</th>
              <th className="px-4 py-3.5 font-bold">Amount</th>
              <th className="px-4 py-3.5 font-bold">Status</th>
              <th className="px-4 py-3.5 font-bold">Receipt</th>
              <th className="px-4 py-3.5 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-6 text-ink-soft">No payments in this view.</td></tr>
            )}
            {payments.map((p) => (
              <tr key={p.id} className="border-t border-line align-top">
                <td className="px-4 py-3.5 text-ink-soft">{p.id}</td>
                <td className="px-4 py-3.5">
                  <span className="font-bold text-ink">{p.payer?.name ?? p.application?.applicantName ?? "—"}</span>
                  {p.application && (
                    <Link href={`/admin/admissions/${p.application.id}`} className="block text-[11px] text-green-mid hover:underline">
                      Application #{p.application.id}
                    </Link>
                  )}
                </td>
                <td className="px-4 py-3.5">{p.purpose.replace(/_/g, " ")}</td>
                <td className="px-4 py-3.5">
                  {p.method === "CARD" ? "Card" : "Bank"}
                  {p.virtualRef && <span className="block text-[11px] text-ink-soft">{p.virtualRef}</span>}
                  {p.gatewayTxnId && <span className="block text-[11px] text-ink-soft truncate max-w-36">{p.gatewayTxnId}</span>}
                </td>
                <td className="px-4 py-3.5 font-bold text-ink">{krw(p.amount)}</td>
                <td className="px-4 py-3.5">
                  <span className={`text-[11px] font-bold rounded-full px-2.5 py-1 ${STATUS_STYLE[p.status] ?? "bg-mist"}`}>
                    {p.status.replace(/_/g, " ")}
                  </span>
                  {p.verifiedBy && <span className="block text-[10px] text-ink-soft mt-1">by {p.verifiedBy.name}</span>}
                </td>
                <td className="px-4 py-3.5">
                  {p.receiptUploadUrl ? (
                    <a href={`/api/files/${p.receiptUploadUrl}`} target="_blank" className="text-green-mid text-xs font-bold hover:underline">
                      View upload
                    </a>
                  ) : (
                    <span className="text-xs text-ink-soft">—</span>
                  )}
                  {["PAID", "VERIFIED", "REFUNDED"].includes(p.status) && (
                    <a href={`/api/receipts/${p.id}`} className="block text-xs text-green-mid font-bold hover:underline">PDF receipt</a>
                  )}
                </td>
                <td className="px-4 py-3.5">
                  <PaymentRowActions paymentId={p.id} status={p.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
