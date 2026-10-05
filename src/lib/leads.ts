import type { LeadStage } from "@/services/types";

/** CRM display constants. Client-safe: no server-only imports, so forms and boards share them. */

export const STAGES: { key: LeadStage; label: string; tone: string }[] = [
  { key: "NEW", label: "New", tone: "bg-mist text-ink-soft" },
  { key: "CONTACTED", label: "Contacted", tone: "bg-green-soft text-green" },
  { key: "QUALIFIED", label: "Qualified", tone: "bg-amber/15 text-amber-ink" },
  { key: "APPLIED", label: "Applied", tone: "bg-purple-50 text-purple-600" },
  { key: "ADMITTED", label: "Admitted", tone: "bg-green/15 text-green" },
  { key: "ENROLLED", label: "Enrolled", tone: "bg-green text-white" },
  { key: "LOST", label: "Lost", tone: "bg-red-50 text-red-600" },
];

export const OPEN_STAGE_KEYS: LeadStage[] = ["NEW", "CONTACTED", "QUALIFIED", "APPLIED", "ADMITTED"];

export const stageLabel = (s: string) => STAGES.find((x) => x.key === s)?.label ?? s;
export const stageTone = (s: string) => STAGES.find((x) => x.key === s)?.tone ?? "bg-mist";

export const ACTIVITY_TYPES = [
  { key: "CALL", label: "Call" },
  { key: "WHATSAPP", label: "WhatsApp" },
  { key: "EMAIL", label: "Email" },
  { key: "SMS", label: "SMS" },
  { key: "MEETING", label: "Meeting" },
  { key: "CAMPUS_VISIT", label: "Campus visit" },
  { key: "NOTE", label: "Note" },
] as const;

export const ACTIVITY_OUTCOMES = [
  { key: "REACHED", label: "Reached" },
  { key: "NO_ANSWER", label: "No answer" },
  { key: "CALLBACK_REQUESTED", label: "Callback requested" },
  { key: "NOT_INTERESTED", label: "Not interested" },
  { key: "INFORMATION_SENT", label: "Information sent" },
  { key: "COMPLETED", label: "Completed" },
] as const;

export const LOST_REASONS = [
  { key: "NOT_INTERESTED", label: "Not interested" },
  { key: "CHOSE_COMPETITOR", label: "Chose another school" },
  { key: "FEES_TOO_HIGH", label: "Fees too high" },
  { key: "NOT_ELIGIBLE", label: "Not eligible" },
  { key: "COURSE_UNAVAILABLE", label: "Course unavailable" },
  { key: "UNREACHABLE", label: "Unreachable" },
  { key: "DUPLICATE", label: "Duplicate" },
  { key: "OTHER", label: "Other" },
] as const;

export const humanize = (v: string) => v.replace(/_/g, " ").toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
export const lostReasonLabel = (k: string | null) =>
  k ? (LOST_REASONS.find((r) => r.key === k)?.label ?? humanize(k)) : "";

/** A follow-up is overdue once its date has passed and the lead is still open. */
export const isOverdue = (iso: string | null, stage: string) =>
  !!iso && stage !== "ENROLLED" && stage !== "LOST" && new Date(iso).getTime() < Date.now();

/**
 * Follow-up times are wall-clock times at the school, in Korea. The server renders in UTC (and
 * Vercel runs UTC), so reading or writing a `datetime-local` value with the runtime's zone
 * would shift every follow-up by nine hours. Both directions pin the zone instead.
 */
const SCHOOL_TZ = "Asia/Seoul";
const SCHOOL_OFFSET_MS = 9 * 60 * 60 * 1000; // Korea has no DST

/** `<input type="datetime-local">` value for an ISO instant, as school time. */
export function toLocalInput(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Date(d.getTime() + SCHOOL_OFFSET_MS).toISOString().slice(0, 16);
}

/** The ISO instant for a `datetime-local` value typed in school time; null when blank/invalid. */
export function fromLocalInput(value: string): string | null {
  if (!value) return null;
  const d = new Date(`${value.length === 16 ? `${value}:00` : value}+09:00`);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

/** "12 Mar, 14:30" in school time. */
export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-GB", {
    timeZone: SCHOOL_TZ, day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hour12: false,
  });
}
