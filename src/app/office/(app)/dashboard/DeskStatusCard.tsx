"use client";

import { useActionState } from "react";
import { setDeskStatus, type DeskFormState } from "./actions";
import { formatDate } from "@/lib/dates";

const AWAY_CHOICES = [10, 30, 60] as const;

/**
 * What the public office board shows about this teacher.
 *
 * Only two states are settable. "In class" is not offered because it is not stored: the
 * board derives it from a class this teacher actually started, so a teacher cannot appear
 * to be teaching a class that never went live.
 */
export function DeskStatusCard({
  status,
  returnAt,
  deskName,
}: {
  status: "DESK" | "OFFLINE";
  returnAt: string | null;
  deskName: string | null;
}) {
  const [state, action, pending] = useActionState<DeskFormState, FormData>(setDeskStatus, null);
  const atDesk = status === "DESK";
  // An absolute clock time rather than a countdown: a relative "back in 12 min" rendered
  // once on the server goes stale the moment the page is cached, and reading the wall clock
  // during render is exactly the impurity React now rejects.
  const backAt = returnAt ? formatDate(returnAt, "en", { hour: "2-digit", minute: "2-digit" }) : null;

  return (
    <section className="bg-white rounded-2xl border border-line p-5">
      <h2 className="font-display text-lg font-semibold text-navy">Office board</h2>
      <p className="mt-1 text-xs text-ink-soft">
        Shown on the public homepage{deskName ? ` as “${deskName}”` : ""}.
      </p>

      <p className="mt-3 text-sm">
        <span className="text-ink-soft">Right now: </span>
        <span className={`font-bold ${atDesk ? "text-teal" : "text-ink-soft"}`}>
          {atDesk ? "At my desk" : "Offline"}
        </span>
        {!atDesk && backAt && <span className="text-ink-soft"> · back at {backAt}</span>}
      </p>

      <form action={action} className="mt-4 space-y-3">
        {atDesk ? (
          <>
            <input type="hidden" name="status" value="OFFLINE" />
            <div className="flex flex-wrap gap-2">
              {AWAY_CHOICES.map((m) => (
                <button
                  key={m}
                  name="awayMinutes"
                  value={m}
                  disabled={pending}
                  className="bg-cream hover:bg-cream-deep disabled:opacity-60 text-navy text-xs font-bold rounded-lg px-3 py-2 transition-colors"
                >
                  Away {m} min
                </button>
              ))}
              <button
                name="awayMinutes"
                value="0"
                disabled={pending}
                className="bg-navy hover:bg-navy-deep disabled:opacity-60 text-white text-xs font-bold rounded-lg px-3 py-2 transition-colors"
              >
                Go offline
              </button>
            </div>
          </>
        ) : (
          <>
            <input type="hidden" name="status" value="DESK" />
            <button
              disabled={pending}
              className="bg-teal hover:bg-teal/85 disabled:opacity-60 text-white text-xs font-bold rounded-lg px-4 py-2.5 transition-colors"
            >
              I&apos;m at my desk
            </button>
          </>
        )}
        {state?.error && <p className="text-xs font-bold text-red-600">{state.error}</p>}
      </form>
    </section>
  );
}
