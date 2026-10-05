"use client";

import { useActionState } from "react";
import type { Lead, LeadCourseOption } from "@/services/types";
import { toLocalInput } from "@/lib/leads";
import { createLead, updateLead, type LeadState } from "./actions";

const input =
  "w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm focus:border-green-mid focus:outline-none";

type Props = {
  /** Present when editing; absent when creating. */
  lead?: Lead;
  sources: { id: number; name: string }[];
  courses: LeadCourseOption[];
  assignees?: { id: number; name: string }[];
};

/** One form for both create and edit; the two differ only in the action and a few fields. */
export function LeadForm({ lead, sources, courses, assignees }: Props) {
  const [state, action, pending] = useActionState<LeadState, FormData>(lead ? updateLead : createLead, null);

  return (
    <form action={action} className="space-y-4">
      {lead && <input type="hidden" name="id" value={lead.id} />}
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block sm:col-span-2">
          <span className="text-xs font-bold text-ink">Full name *</span>
          <input name="name" required minLength={2} defaultValue={lead?.name} className={`mt-1.5 ${input}`} />
        </label>
        <label className="block">
          <span className="text-xs font-bold text-ink">Phone</span>
          <input name="phone" defaultValue={lead?.phone ?? ""} className={`mt-1.5 ${input}`} />
        </label>
        <label className="block">
          <span className="text-xs font-bold text-ink">Email</span>
          <input name="email" type="email" defaultValue={lead?.email ?? ""} className={`mt-1.5 ${input}`} />
        </label>
        <label className="block">
          <span className="text-xs font-bold text-ink">Alternate phone</span>
          <input name="alternatePhone" defaultValue={lead?.alternatePhone ?? ""} className={`mt-1.5 ${input}`} />
        </label>
        <label className="block">
          <span className="text-xs font-bold text-ink">City / area</span>
          <input name="city" defaultValue={lead?.city ?? ""} className={`mt-1.5 ${input}`} />
        </label>
        <label className="block">
          <span className="text-xs font-bold text-ink">Gender</span>
          <select name="gender" defaultValue={lead?.gender ?? ""} className={`mt-1.5 ${input}`}>
            <option value="">—</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-bold text-ink">Interested in</span>
          <select name="courseId" defaultValue={lead?.courseId ?? ""} className={`mt-1.5 ${input}`}>
            <option value="">—</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-bold text-ink">Source</span>
          <select name="sourceId" defaultValue={lead?.sourceId ?? ""} className={`mt-1.5 ${input}`}>
            <option value="">—</option>
            {sources.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-bold text-ink">Campaign / event</span>
          <input name="campaign" defaultValue={lead?.campaign ?? ""} className={`mt-1.5 ${input}`} />
        </label>
        <label className="block">
          <span className="text-xs font-bold text-ink">Referred by</span>
          <input name="referredBy" defaultValue={lead?.referredBy ?? ""} className={`mt-1.5 ${input}`} />
        </label>
        {assignees && (
          <label className="block">
            <span className="text-xs font-bold text-ink">Owner</span>
            <select name="assignedToUserId" defaultValue="" className={`mt-1.5 ${input}`}>
              <option value="">Unassigned</option>
              {assignees.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </label>
        )}
        <label className="block">
          <span className="text-xs font-bold text-ink">Next follow-up (Korea time)</span>
          <input
            name="nextFollowUpAt"
            type="datetime-local"
            defaultValue={toLocalInput(lead?.nextFollowUpAt)}
            className={`mt-1.5 ${input}`}
          />
        </label>
      </div>
      <label className="block">
        <span className="text-xs font-bold text-ink">Notes</span>
        <textarea name="remarks" rows={3} defaultValue={lead?.remarks ?? ""} className={`mt-1.5 ${input}`} />
      </label>
      {state?.error && <p role="alert" className="text-sm font-semibold text-red-600">{state.error}</p>}
      {state?.ok && <p className="text-sm font-semibold text-green">Saved ✓</p>}
      <button
        disabled={pending}
        className="bg-green hover:bg-green-deep disabled:opacity-60 text-white font-bold rounded-lg px-6 py-2.5 text-sm transition-colors"
      >
        {pending ? "Saving…" : lead ? "Save changes" : "Create lead"}
      </button>
    </form>
  );
}
