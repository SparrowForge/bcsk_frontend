import type { MarkSheetStatus } from "@/services/types";

/** How a mark sheet's state reads to a teacher. LOCKED means the Head Master approved the results. */
export const SHEET: Record<MarkSheetStatus, { label: string; tone: string }> = {
  NOT_STARTED: { label: "Not started", tone: "bg-mist text-ink-soft" },
  DRAFT: { label: "Draft", tone: "bg-amber-100 text-amber-800" },
  SUBMITTED: { label: "Submitted", tone: "bg-green-soft text-green" },
  LOCKED: { label: "Approved", tone: "bg-green text-white" },
};
