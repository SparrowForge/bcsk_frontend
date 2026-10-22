"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth";
import { structure, toActionError } from "@/services";
import { checked, id, optNum, text } from "@/lib/form-data";
import type { FormState } from "@/components/admin/ActionForm";

const department = (fd: FormData) => ({
  name: text(fd, "name"),
  code: text(fd, "code"),
  displayOrder: optNum(fd, "displayOrder") ?? 100,
  active: checked(fd, "active"),
});

export async function createDepartment(_p: FormState, fd: FormData): Promise<FormState> {
  await requirePermission("departments:manage");
  try {
    await structure.createDepartment({ ...department(fd), active: true });
  } catch (e) {
    return toActionError(e);
  }
  revalidatePath("/admin/departments");
  return { ok: true };
}

export async function updateDepartment(_p: FormState, fd: FormData): Promise<FormState> {
  await requirePermission("departments:manage");
  try {
    await structure.updateDepartment(id(fd, "id"), department(fd));
  } catch (e) {
    return toActionError(e);
  }
  revalidatePath("/admin/departments");
  return { ok: true };
}

export async function deleteDepartment(_p: FormState, fd: FormData): Promise<FormState> {
  await requirePermission("departments:manage");
  try {
    await structure.deleteDepartment(id(fd, "id"));
  } catch (e) {
    return toActionError(e);
  }
  revalidatePath("/admin/departments");
  return { ok: true };
}

/** Which department a course belongs to. Needs `courses:manage`, which the API checks too. */
export async function setCourseDepartment(_p: FormState, fd: FormData): Promise<FormState> {
  await requirePermission("courses:manage");
  try {
    await structure.setCourseDepartment(id(fd, "courseId"), optNum(fd, "departmentId"));
  } catch (e) {
    return toActionError(e);
  }
  revalidatePath("/admin/departments");
  return { ok: true };
}
