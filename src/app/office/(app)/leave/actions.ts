"use server";

import { requireMenu } from "@/lib/auth";
import { teaching } from "@/services";
import { attempt } from "@/lib/action-result";
import { id, optText, text } from "@/lib/form-data";
import type { FormState } from "@/components/admin/ActionForm";

/**
 * The class teacher's recommendation on a leave request. Short leave within the institute's
 * limit is decided outright by it (the API decides which); longer leave goes on to the Head Master.
 */
export async function reviewLeave(_p: FormState, fd: FormData): Promise<FormState> {
  await requireMenu("office.classes", "update");
  const recommendation = text(fd, "recommendation") === "REJECT" ? "REJECT" : "APPROVE";
  return attempt(() => teaching.reviewLeave(id(fd, "leaveId"), recommendation, optText(fd, "note")), ["/office/leave"]);
}
