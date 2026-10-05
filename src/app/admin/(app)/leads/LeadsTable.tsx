"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { Lead } from "@/services/types";
import { formatDateTime, isOverdue, stageLabel, stageTone } from "@/lib/leads";
import { bulkAssignLeads, type LeadState } from "./actions";

/** The lead list with row selection, so a counsellor lead can hand a batch to a colleague. */
export function LeadsTable({
  leads,
  assignees,
  canManage,
}: {
  leads: Lead[];
  assignees: { id: number; name: string }[];
  canManage: boolean;
}) {
  const [state, action, pending] = useActionState<LeadState, FormData>(bulkAssignLeads, null);

  return (
    <form action={action}>
      {canManage && (
        <div className="flex flex-wrap items-center gap-3 mb-3 text-sm">
          <span className="font-bold text-ink">With selected:</span>
          <select name="assignedToUserId" defaultValue="" aria-label="Assign selected leads to" className="rounded-lg border border-line bg-white px-3 py-2 text-sm">
            <option value="">Unassign</option>
            {assignees.map((a) => (
              <option key={a.id} value={a.id}>Assign to {a.name}</option>
            ))}
          </select>
          <button disabled={pending} className="bg-green hover:bg-green-deep disabled:opacity-60 text-white text-xs font-bold rounded-lg px-4 py-2.5">
            {pending ? "Saving…" : "Apply"}
          </button>
          {state?.error && <span role="alert" className="text-xs font-semibold text-red-600">{state.error}</span>}
          {state?.ok && <span className="text-xs font-semibold text-green">Updated ✓</span>}
        </div>
      )}
      <div className="scroll-fade overflow-x-auto rounded-2xl border border-line">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-mist text-green text-left">
              {canManage && <th className="px-4 py-3.5 w-8"></th>}
              <th className="px-4 py-3.5 font-bold">Lead</th>
              <th className="px-4 py-3.5 font-bold">Contact</th>
              <th className="px-4 py-3.5 font-bold">Interest</th>
              <th className="px-4 py-3.5 font-bold">Stage</th>
              <th className="px-4 py-3.5 font-bold">Owner</th>
              <th className="px-4 py-3.5 font-bold">Next follow-up</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 && (
              <tr><td colSpan={canManage ? 7 : 6} className="px-4 py-6 text-ink-soft">No leads match.</td></tr>
            )}
            {leads.map((l) => (
              <tr key={l.id} className="border-t border-line">
                {canManage && (
                  <td className="px-4 py-3.5">
                    <input type="checkbox" name="leadId" value={l.id} aria-label={`Select ${l.name}`} className="w-4 h-4 accent-green" />
                  </td>
                )}
                <td className="px-4 py-3.5">
                  <Link href={`/admin/leads/${l.id}`} className="font-bold text-ink hover:text-green-mid">{l.name}</Link>
                  <p className="text-xs text-ink-soft">{l.leadNo}</p>
                </td>
                <td className="px-4 py-3.5 text-ink-soft">
                  {l.phone ?? "—"}
                  {l.email && <p className="text-xs">{l.email}</p>}
                </td>
                <td className="px-4 py-3.5">{l.course?.name ?? "—"}</td>
                <td className="px-4 py-3.5">
                  <span className={`text-[11px] font-bold rounded-full px-2.5 py-1 ${stageTone(l.stage)}`}>{stageLabel(l.stage)}</span>
                </td>
                <td className="px-4 py-3.5">{l.assignedTo?.name ?? <span className="text-ink-soft">Unassigned</span>}</td>
                <td className={`px-4 py-3.5 ${isOverdue(l.nextFollowUpAt, l.stage) ? "text-red-600 font-bold" : "text-ink-soft"}`}>
                  {formatDateTime(l.nextFollowUpAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </form>
  );
}
