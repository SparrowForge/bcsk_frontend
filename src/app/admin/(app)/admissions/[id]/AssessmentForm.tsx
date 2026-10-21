"use client";

import { useActionState } from "react";
import { keepForm } from "@/components/forms/keep-form";
import { saveAssessment, type DecisionResult } from "./actions";

const textareaCls =
  "mt-1.5 w-full rounded-lg border border-line px-3.5 py-2.5 text-sm focus:border-green-mid focus:outline-none";

/** The office's half of the school's admission form: the assessor's comment and payment notes. */
export function AssessmentForm({
  applicationId,
  assessorComment,
  paymentNote,
}: {
  applicationId: number;
  assessorComment: string;
  paymentNote: string;
}) {
  const [state, action, pending] = useActionState<DecisionResult | null, FormData>(
    saveAssessment.bind(null, applicationId),
    null,
  );

  return (
    <form onSubmit={keepForm(action)} className="mt-8 bg-white rounded-2xl border border-line p-6 space-y-4">
      <h2 className="font-display text-lg font-semibold text-green">Assessment</h2>
      <label className="block">
        <span className="text-xs font-bold text-ink">Assessor&apos;s comment</span>
        <textarea name="assessorComment" rows={2} defaultValue={assessorComment} maxLength={1000} className={textareaCls} />
      </label>
      <label className="block">
        <span className="text-xs font-bold text-ink">Payment notes</span>
        <textarea name="paymentNote" rows={2} defaultValue={paymentNote} maxLength={1000} className={textareaCls} />
      </label>
      <div className="flex items-center gap-3">
        <button disabled={pending} className="bg-green hover:bg-green/85 disabled:opacity-60 text-white text-sm font-bold rounded-lg px-5 py-2.5 transition-colors">
          {pending ? "Saving…" : "Save notes"}
        </button>
        {state?.ok && <span className="text-xs font-semibold text-green">Saved.</span>}
        {state?.error && <span role="alert" className="text-xs font-semibold text-red-600">{state.error}</span>}
      </div>
    </form>
  );
}
