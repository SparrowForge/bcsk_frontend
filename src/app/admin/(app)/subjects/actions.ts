"use server";

import { requirePermission } from "@/lib/auth";
import { structure } from "@/services";
import { attempt } from "@/lib/action-result";
import { checked, id, optNum, text } from "@/lib/form-data";
import type { FormState } from "@/components/admin/ActionForm";

const PATHS = ["/admin/subjects"];
const subject = (fd: FormData) => ({
  code: text(fd, "code"),
  name: text(fd, "name"),
  type: text(fd, "type") === "PRACTICAL" ? "PRACTICAL" : "THEORY",
  departmentId: optNum(fd, "departmentId"),
  displayOrder: optNum(fd, "displayOrder") ?? 100,
  active: checked(fd, "active"),
});
const marks = (fd: FormData) => ({
  fullMarks: optNum(fd, "fullMarks") ?? 100,
  passMarks: optNum(fd, "passMarks") ?? 33,
  isOptional: checked(fd, "isOptional"),
  displayOrder: optNum(fd, "displayOrder") ?? 100,
});

export async function createSubject(_p: FormState, fd: FormData): Promise<FormState> {
  await requirePermission("subjects:manage");
  return attempt(() => structure.createSubject({ ...subject(fd), active: true }), PATHS);
}

export async function updateSubject(_p: FormState, fd: FormData): Promise<FormState> {
  await requirePermission("subjects:manage");
  return attempt(() => structure.updateSubject(id(fd, "id"), subject(fd)), PATHS);
}

export async function deleteSubject(_p: FormState, fd: FormData): Promise<FormState> {
  await requirePermission("subjects:manage");
  return attempt(() => structure.deleteSubject(id(fd, "id")), PATHS);
}

/** Add a subject to a class, or change its marks rules there. */
export async function setCurriculum(_p: FormState, fd: FormData): Promise<FormState> {
  await requirePermission("subjects:manage");
  return attempt(() => structure.setCurriculum(id(fd, "levelId"), id(fd, "subjectId"), marks(fd)), PATHS);
}

export async function removeCurriculum(_p: FormState, fd: FormData): Promise<FormState> {
  await requirePermission("subjects:manage");
  return attempt(() => structure.removeCurriculum(id(fd, "levelId"), id(fd, "subjectId")), PATHS);
}
