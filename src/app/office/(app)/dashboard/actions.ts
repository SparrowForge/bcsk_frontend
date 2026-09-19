"use server";

import { revalidatePath } from "next/cache";
import { office, toActionError } from "@/services";
import { requireTeacher } from "@/lib/auth";

export type DeskFormState = { ok?: boolean; error?: string } | null;

/**
 * A teacher's own desk presence, shown on the homepage office board.
 *
 * The backend re-derives the teacher from the session and updates only their own row, so
 * there is no id to tamper with here. The guard is still re-checked: a Server Action
 * compiles to a public endpoint, and this one writes something the whole public homepage
 * reads.
 */
export async function setDeskStatus(_prev: DeskFormState, formData: FormData): Promise<DeskFormState> {
  await requireTeacher();

  const status = String(formData.get("status") ?? "");
  if (status !== "DESK" && status !== "OFFLINE") return { error: "Choose a desk status." };

  // "Back in N minutes" is what a teacher can actually estimate; the API stores the instant.
  const awayFor = Number(formData.get("awayMinutes") ?? 0);
  const returnAt =
    status === "OFFLINE" && Number.isFinite(awayFor) && awayFor > 0
      ? new Date(Date.now() + awayFor * 60_000).toISOString()
      : undefined;

  try {
    await office.setDeskStatus(status, returnAt);
  } catch (e) {
    return toActionError(e);
  }

  revalidatePath("/office/dashboard");
  revalidatePath("/");
  return { ok: true };
}
