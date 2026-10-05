"use client";

import { useActionState, useState, useTransition } from "react";
import { useKeptForm } from "@/components/forms/keep-form";
import type { Lead, LeadCourseOption } from "@/services/types";
import { ACTIVITY_OUTCOMES, ACTIVITY_TYPES, LOST_REASONS, OPEN_STAGE_KEYS, stageLabel, toLocalInput } from "@/lib/leads";
import {
  assignLead, changeStage, convertLead, deleteLead, deleteLeadActivity, logLeadActivity, type LeadState,
} from "../actions";

const input =
  "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm focus:border-green-mid focus:outline-none";
const primary =
  "bg-green hover:bg-green-deep disabled:opacity-60 text-white text-xs font-bold rounded-lg px-4 py-2.5 transition-colors";

function Msg({ state }: { state: LeadState }) {
  if (state?.error) return <p role="alert" className="text-xs font-semibold text-red-600">{state.error}</p>;
  if (state?.ok) return <p className="text-xs font-semibold text-green">Saved ✓</p>;
  return null;
}

export function StagePanel({ lead }: { lead: Lead }) {
  const [state, action, pending] = useActionState<LeadState, FormData>(changeStage, null);
  const kept = useKeptForm(action, state);
  const [stage, setStage] = useState<string>(lead.stage === "ENROLLED" ? "" : lead.stage);

  if (lead.stage === "ENROLLED") {
    return <p className="text-sm text-ink-soft">Converted to an application, so the stage is locked.</p>;
  }
  const choices = [...OPEN_STAGE_KEYS, "LOST"];
  return (
    <form {...kept} className="space-y-3">
      <input type="hidden" name="id" value={lead.id} />
      <select name="stage" value={stage} onChange={(e) => setStage(e.target.value)} aria-label="Stage" className={input}>
        {choices.map((s) => (
          <option key={s} value={s}>{stageLabel(s)}</option>
        ))}
      </select>
      {stage === "LOST" && (
        <>
          <select name="lostReason" required defaultValue={lead.lostReason ?? ""} aria-label="Reason lost" className={input}>
            <option value="">Why was it lost? *</option>
            {LOST_REASONS.map((r) => <option key={r.key} value={r.key}>{r.label}</option>)}
          </select>
          <input name="lostNote" defaultValue={lead.lostNote ?? ""} placeholder="Detail (optional)" className={input} />
        </>
      )}
      <input name="note" placeholder="Note for the timeline (optional)" className={input} />
      <div className="flex items-center gap-3">
        <button disabled={pending || stage === lead.stage} className={primary}>{pending ? "Saving…" : "Update stage"}</button>
        <Msg state={state} />
      </div>
    </form>
  );
}

export function AssignPanel({ lead, assignees }: { lead: Lead; assignees: { id: number; name: string }[] }) {
  const [state, action, pending] = useActionState<LeadState, FormData>(assignLead, null);
  const kept = useKeptForm(action, state);
  return (
    <form {...kept} className="flex flex-wrap items-center gap-3">
      <input type="hidden" name="id" value={lead.id} />
      <select name="assignedToUserId" defaultValue={lead.assignedToUserId ?? ""} aria-label="Owner" className={`${input} flex-1 min-w-40`}>
        <option value="">Unassigned</option>
        {assignees.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
      </select>
      <button disabled={pending} className={primary}>{pending ? "Saving…" : "Assign"}</button>
      <Msg state={state} />
    </form>
  );
}

export function ActivityForm({ lead }: { lead: Lead }) {
  const [state, action, pending] = useActionState<LeadState, FormData>(logLeadActivity, null);
  const kept = useKeptForm(action, state, { resetOnSuccess: true });
  // React 19 resets an uncontrolled form once its action settles, so no manual clearing.
  return (
    <form {...kept} className="space-y-3">
      <input type="hidden" name="id" value={lead.id} />
      <div className="grid sm:grid-cols-2 gap-3">
        <select name="type" defaultValue="CALL" aria-label="Type" className={input}>
          {ACTIVITY_TYPES.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
        </select>
        <select name="outcome" defaultValue="" aria-label="Outcome" className={input}>
          <option value="">Outcome (if any)</option>
          {ACTIVITY_OUTCOMES.map((o) => <option key={o.key} value={o.key}>{o.label}</option>)}
        </select>
      </div>
      <input name="subject" required placeholder="What happened or is planned? *" className={input} />
      <textarea name="notes" rows={2} placeholder="Notes" className={input} />
      <div className="grid sm:grid-cols-2 gap-3">
        <label className="block text-xs font-bold text-ink">
          Schedule for (Korea time)
          <input name="scheduledAt" type="datetime-local" className={`mt-1 ${input}`} />
        </label>
        <label className="block text-xs font-bold text-ink">
          Next follow-up (Korea time)
          <input name="nextFollowUpAt" type="datetime-local" defaultValue={toLocalInput(lead.nextFollowUpAt)} className={`mt-1 ${input}`} />
        </label>
      </div>
      <label className="flex items-center gap-2 text-xs font-bold text-ink">
        <input type="checkbox" name="done" defaultChecked className="w-4 h-4 accent-green" />
        Already done (counts as contact)
      </label>
      <div className="flex items-center gap-3">
        <button disabled={pending} className={primary}>{pending ? "Saving…" : "Log activity"}</button>
        <Msg state={state} />
      </div>
    </form>
  );
}

export function DeleteActivity({ leadId, activityId }: { leadId: number; activityId: number }) {
  const [pending, start] = useTransition();
  return (
    <button
      disabled={pending}
      onClick={() => start(() => deleteLeadActivity(leadId, activityId))}
      className="text-[11px] font-bold text-ink-soft hover:text-red-600"
    >
      Delete
    </button>
  );
}

export function ConvertPanel({ lead, courses }: { lead: Lead; courses: LeadCourseOption[] }) {
  const [state, action, pending] = useActionState<LeadState, FormData>(convertLead, null);
  const kept = useKeptForm(action, state);
  const isSpecial = lead.course?.type === "SPECIAL";
  const [type, setType] = useState<"REGULAR" | "SPECIAL">(isSpecial ? "SPECIAL" : "REGULAR");

  const regular = courses.find((c) => c.slug === "regular-course");
  const levels = type === "SPECIAL" ? (courses.find((c) => c.id === lead.courseId)?.levels ?? []) : (regular?.levels ?? []);

  return (
    <form {...kept} className="space-y-3">
      <input type="hidden" name="id" value={lead.id} />
      <p className="text-xs text-ink-soft">
        Creates an admission application prefilled from this lead. The family still completes consent and payment.
      </p>
      <select name="type" value={type} onChange={(e) => setType(e.target.value as "REGULAR" | "SPECIAL")} aria-label="Application type" className={input}>
        <option value="REGULAR">Regular course (class)</option>
        <option value="SPECIAL" disabled={!isSpecial}>Special course{isSpecial ? ` - ${lead.course?.name}` : " (set one on the lead)"}</option>
      </select>
      <select name="courseLevelId" required={type === "REGULAR"} defaultValue="" aria-label="Class or level" className={input}>
        <option value="">{type === "REGULAR" ? "Class *" : "Level / track (optional)"}</option>
        {levels.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
      </select>
      <input name="note" placeholder="Note for the timeline (optional)" className={input} />
      <div className="flex items-center gap-3">
        <button disabled={pending} className={primary}>{pending ? "Converting…" : "Convert to application"}</button>
        <Msg state={state} />
      </div>
    </form>
  );
}

export function DeletePanel({ leadId }: { leadId: number }) {
  const [state, action, pending] = useActionState<LeadState, FormData>(deleteLead, null);
  const kept = useKeptForm(action, state);
  return (
    <form {...kept} onSubmit={(e) => { if (confirm("Delete this lead?")) kept.onSubmit(e); else e.preventDefault(); }} className="flex items-center gap-3">
      <input type="hidden" name="id" value={leadId} />
      <button disabled={pending} className="text-xs font-bold text-red-600 hover:underline">Delete lead</button>
      <Msg state={state} />
    </form>
  );
}
