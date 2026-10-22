"use server";

import { requireMenu } from "@/lib/auth";
import { files, learning } from "@/services";
import { attempt } from "@/lib/action-result";
import { id, text } from "@/lib/form-data";
import type { FormState } from "@/components/admin/ActionForm";

/*
 * Leave applications sit under the Documents menu with its Access switch, as their API routes do:
 * applying is a request to the school, so it asks for nothing beyond reaching the page.
 */
const PATHS = ["/classroom/leave"];

export async function applyLeave(_p: FormState, fd: FormData): Promise<FormState> {
  await requireMenu("classroom.documents", "access");
  const fromDate = text(fd, "fromDate");
  return attempt(async () => {
    const note = fd.get("attachment");
    const attachmentUrl = note instanceof File && note.size > 0 ? (await files.upload(note, "leave")).path : null;
    await learning.applyLeave({ fromDate, toDate: text(fd, "toDate") || fromDate, reason: text(fd, "reason"), attachmentUrl });
  }, PATHS);
}

export async function cancelLeave(_p: FormState, fd: FormData): Promise<FormState> {
  await requireMenu("classroom.documents", "access");
  return attempt(() => learning.cancelLeave(id(fd, "leaveId")), PATHS);
}
