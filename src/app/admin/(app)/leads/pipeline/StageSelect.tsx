"use client";

import { useState, useTransition } from "react";
import { OPEN_STAGE_KEYS, stageLabel } from "@/lib/leads";
import { moveLeadStage } from "../actions";

export function StageSelect({ leadId, stage }: { leadId: number; stage: string }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="mt-3">
      <select
        value={stage}
        disabled={pending}
        aria-label="Move to stage"
        onChange={(e) =>
          start(async () => {
            const res = await moveLeadStage(leadId, e.target.value);
            setError(res?.error ?? null);
          })
        }
        className="w-full rounded-lg border border-line bg-mist px-2.5 py-1.5 text-xs font-bold disabled:opacity-60"
      >
        {OPEN_STAGE_KEYS.map((s) => <option key={s} value={s}>{stageLabel(s)}</option>)}
      </select>
      {error && <p role="alert" className="mt-1 text-[11px] font-semibold text-red-600">{error}</p>}
    </div>
  );
}
