/**
 * The school's clock. The school is in Korea, but the web server runs in UTC, so "today" and
 * any time of day must be read in Asia/Seoul explicitly - the UTC date is still yesterday until
 * 09:00 KST, and a meeting at 18:30 would print as 09:30.
 */
export const SCHOOL_TZ = "Asia/Seoul";
/** Korea has no daylight saving time, so the offset is fixed. */
const OFFSET = "+09:00";

/** Today's date at the school, as YYYY-MM-DD. */
export const schoolToday = (now = new Date()) => new Intl.DateTimeFormat("en-CA", { timeZone: SCHOOL_TZ }).format(now);

/** A date some days from a YYYY-MM-DD day, as YYYY-MM-DD. */
export function addDays(day: string, days: number): string {
  const d = new Date(`${day}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** The school weekday of a YYYY-MM-DD day: "Monday" ... */
export const weekdayOf = (day: string) =>
  new Date(`${day}T00:00:00Z`).toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" });

/** A date and a 24-hour HH:MM typed at the school, as the ISO instant the API expects. */
export const schoolInstant = (day: string, time: string) => `${day}T${time}:00${OFFSET}`;

/** An instant from the API as the school reads it: "Sat 7 Nov, 18:30". */
export function schoolDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    timeZone: SCHOOL_TZ, weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hour12: false,
  });
}

/** Just the school's time of day of an instant: "18:30". */
export const schoolClock = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-GB", { timeZone: SCHOOL_TZ, hour: "2-digit", minute: "2-digit", hour12: false });
