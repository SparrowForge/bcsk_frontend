"use server";

import { requireMenu } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { office } from "@/services";

export async function toggleTask(taskId: number, done: boolean) {
  await requireMenu("office.tasks", "update");
  // Ownership is checked server-side; a task id from the client is only a claim.
  await office.toggleTask(taskId, done);
  revalidatePath("/office/tasks");
}
