import type { Dictionary } from "@/lib/i18n/dictionaries";

/**
 * Durations for the two boards.
 *
 * Both return `null` for `null` rather than "0 min", because the boards distinguish "this
 * class has been running for no time yet" from "nothing is running" — the caller prints an
 * em dash for the second, and a zero would read as the first.
 */
export function formatMinutes(minutes: number | null): string | null {
  if (minutes === null) return null;
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} h` : `${h} h ${String(m).padStart(2, "0")} m`;
}

/** What the "Return" line on a desk card says, given the desk's own status. */
export function returnLabel(
  status: "IN_CLASS" | "DESK" | "OFFLINE",
  minutes: number | null,
  t: Dictionary,
): string {
  if (status === "DESK") return t.home.deskReturnNow;
  const formatted = formatMinutes(minutes);
  return formatted ?? "—";
}
