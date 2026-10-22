"use server";

import { requireMenu } from "@/lib/auth";
import { learning, toActionError } from "@/services";

/**
 * Join a live class. The meeting link is handed out only here, so the join is logged and the
 * teacher sees who came; the API refuses a class that has not opened (10 minutes before) or ended.
 * Reading a class is the Routine menu's Access switch - joining asks for nothing more.
 */
export async function joinClass(onlineClassId: number): Promise<{ joinUrl?: string; error?: string }> {
  await requireMenu("classroom.routine", "access");
  try {
    return { joinUrl: (await learning.join(onlineClassId)).joinUrl };
  } catch (e) {
    return toActionError(e);
  }
}
