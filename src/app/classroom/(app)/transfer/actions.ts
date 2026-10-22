"use server";

import { requireMenu } from "@/lib/auth";
import { learning } from "@/services";
import { attempt } from "@/lib/action-result";
import { id, text } from "@/lib/form-data";
import type { FormState } from "@/components/admin/ActionForm";

/* Under the Documents menu with its Access switch, as the API routes are (see ../leave/actions.ts). */
const PATHS = ["/classroom/transfer"];

export async function applyTransfer(_p: FormState, fd: FormData): Promise<FormState> {
  await requireMenu("classroom.documents", "access");
  return attempt(() => learning.applyTransfer({
    destination: text(fd, "destination"),
    reason: text(fd, "reason"),
    effectiveDate: text(fd, "effectiveDate"),
  }), PATHS);
}

export async function cancelTransfer(_p: FormState, fd: FormData): Promise<FormState> {
  await requireMenu("classroom.documents", "access");
  return attempt(() => learning.cancelTransfer(id(fd, "transferId")), PATHS);
}
