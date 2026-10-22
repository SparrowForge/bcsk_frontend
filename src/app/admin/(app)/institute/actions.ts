"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth";
import { institute, toActionError } from "@/services";
import { optNum, optText, text } from "@/lib/form-data";
import type { FormState } from "@/components/admin/ActionForm";

/** The institute's own profile: the name and contacts printed on every report and certificate. */
export async function saveProfile(_p: FormState, fd: FormData): Promise<FormState> {
  await requirePermission("institute:manage");
  try {
    await institute.update({
      name: text(fd, "name"),
      nameBn: optText(fd, "nameBn"),
      nameKo: optText(fd, "nameKo"),
      address: optText(fd, "address"),
      phone: optText(fd, "phone"),
      email: optText(fd, "email"),
      website: optText(fd, "website"),
      headMasterName: optText(fd, "headMasterName"),
    });
  } catch (e) {
    return toActionError(e);
  }
  revalidatePath("/admin/institute");
  return { ok: true };
}

/** How results rank ties, and how much leave a class teacher may approve alone. */
export async function saveSettings(_p: FormState, fd: FormData): Promise<FormState> {
  await requirePermission("institute:manage");
  try {
    await institute.setRankTies(text(fd, "rankTies") === "SPLIT" ? "SPLIT" : "SHARED");
    await institute.setLeaveTeacherMaxDays(optNum(fd, "leaveTeacherMaxDays") ?? 0);
  } catch (e) {
    return toActionError(e);
  }
  revalidatePath("/admin/institute");
  return { ok: true };
}
