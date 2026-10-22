"use client";

import { useState, useTransition } from "react";
import { joinClass } from "./actions";

/** Asks for the link at the moment of joining, then opens the meeting in a new tab. */
export function JoinButton({ onlineClassId, live }: { onlineClassId: number; live: boolean }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          // Open the tab inside the click, or a pop-up blocker stops it once the request returns.
          const tab = window.open("about:blank", "_blank");
          start(async () => {
            const res = await joinClass(onlineClassId);
            if (res.joinUrl && tab) {
              tab.opener = null;
              tab.location.href = res.joinUrl;
            } else {
              tab?.close();
              setError(res.error ?? "The class could not be opened.");
            }
          });
        }}
        className={`${live ? "bg-red-600 hover:bg-red-700" : "bg-green hover:bg-green-deep"} disabled:opacity-60 text-white text-xs font-bold rounded-lg px-4 py-2`}
      >
        {pending ? "Opening…" : live ? "Join now" : "Join"}
      </button>
      {error && <span className="text-xs font-semibold text-red-700" role="alert">{error}</span>}
    </span>
  );
}
