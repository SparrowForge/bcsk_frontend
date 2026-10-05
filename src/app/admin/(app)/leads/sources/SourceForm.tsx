"use client";

import { useActionState, useTransition } from "react";
import { useKeptForm } from "@/components/forms/keep-form";
import type { LeadSource } from "@/services/types";
import { deleteSource, saveSource, type LeadState } from "../actions";

const input =
  "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm focus:border-green-mid focus:outline-none";

/** Create (no `source`) or edit one lead source. */
export function SourceForm({ source, canManage }: { source?: LeadSource; canManage: boolean }) {
  const [state, action, pending] = useActionState<LeadState, FormData>(saveSource, null);
  const kept = useKeptForm(action, state, { resetOnSuccess: true });
  const [removing, startRemove] = useTransition();

  if (!canManage) return null;
  return (
    <form {...kept} className="space-y-3">
      {source && <input type="hidden" name="id" value={source.id} />}
      <div className="grid sm:grid-cols-3 gap-3">
        <input name="name" required minLength={2} defaultValue={source?.name} placeholder="Name *" aria-label="Name" className={input} />
        <input name="code" defaultValue={source?.code ?? ""} placeholder="Code" aria-label="Code" className={input} />
        <input name="description" defaultValue={source?.description ?? ""} placeholder="Description" aria-label="Description" className={input} />
      </div>
      <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-ink">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="isPublic" defaultChecked={source?.isPublic} className="w-4 h-4 accent-green" />
          Offer on the public enquiry form
        </label>
        {source && (
          <label className="flex items-center gap-2">
            <input type="checkbox" name="active" defaultChecked={source.active} className="w-4 h-4 accent-green" />
            Active
          </label>
        )}
        <button disabled={pending} className="bg-green hover:bg-green-deep disabled:opacity-60 text-white rounded-lg px-4 py-2 transition-colors">
          {pending ? "Saving…" : source ? "Save" : "Add source"}
        </button>
        {source && (
          <button
            type="button"
            disabled={removing}
            onClick={() => {
              const used = source._count.leads > 0;
              if (confirm(used ? "This source has leads, so it will be deactivated instead of deleted. Continue?" : "Delete this source?")) {
                startRemove(() => deleteSource(source.id));
              }
            }}
            className="text-red-600 hover:underline"
          >
            {source._count.leads > 0 ? "Deactivate" : "Delete"}
          </button>
        )}
        {state?.error && <span role="alert" className="text-red-600">{state.error}</span>}
        {state?.ok && <span className="text-green">Saved ✓</span>}
      </div>
    </form>
  );
}
