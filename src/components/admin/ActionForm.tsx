"use client";

import { useActionState, type ReactNode } from "react";
import { useKeptForm } from "@/components/forms/keep-form";

/** What every academic-setup action returns, as `useActionState` expects. */
export type FormState = { ok?: boolean; error?: string } | null;

export const btn =
  "bg-green hover:bg-green-deep disabled:opacity-60 text-white text-xs font-bold rounded-lg px-4 py-2 transition-colors";
export const btnQuiet =
  "border border-line hover:border-green-mid disabled:opacity-60 text-ink text-xs font-bold rounded-lg px-3 py-1.5 transition-colors";
export const btnDanger =
  "border border-red-200 hover:bg-red-50 disabled:opacity-60 text-red-700 text-xs font-bold rounded-lg px-3 py-1.5 transition-colors";
export const field =
  "rounded-lg border border-line bg-white px-3 py-2 text-sm focus:border-green-mid focus:outline-none";
export const label = "block text-xs font-bold text-ink";

/**
 * A form posting to one Server Action (LMS F1). What was typed is kept when the API refuses it
 * (a clash, a duplicate code), and the API's own message is shown beside the button - the
 * backend's wording is written for the person, so it is passed through rather than rephrased.
 * `confirm` asks before a destructive submit.
 */
export function ActionForm({
  action,
  children,
  submit,
  pendingLabel = "Saving…",
  className = "flex flex-wrap items-end gap-3",
  resetOnSuccess = false,
  variant = "primary",
  confirm,
}: {
  action: (prev: FormState, data: FormData) => Promise<FormState>;
  children?: ReactNode;
  submit: string;
  pendingLabel?: string;
  className?: string;
  resetOnSuccess?: boolean;
  variant?: "primary" | "quiet" | "danger";
  confirm?: string;
}) {
  const [state, dispatch, pending] = useActionState<FormState, FormData>(action, null);
  const { ref, onSubmit: submitKept } = useKeptForm(dispatch, state, { resetOnSuccess });
  const onSubmit: typeof submitKept = (e) => {
    if (confirm && !window.confirm(confirm)) {
      e.preventDefault();
      return;
    }
    submitKept(e);
  };
  return (
    <form ref={ref} onSubmit={onSubmit} className={className}>
      {children}
      <div className="flex items-center gap-2">
        <button disabled={pending} className={variant === "danger" ? btnDanger : variant === "quiet" ? btnQuiet : btn}>
          {pending ? pendingLabel : submit}
        </button>
        {state?.ok && !pending && <span className="text-xs font-bold text-green" role="status">Saved</span>}
        {state?.error && !pending && <span className="text-xs font-semibold text-red-700" role="alert">{state.error}</span>}
      </div>
    </form>
  );
}
