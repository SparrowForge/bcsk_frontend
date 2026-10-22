"use server";

import { redirect } from "next/navigation";
import { requirePermission } from "@/lib/auth";
import { structure } from "@/services";
import { attempt } from "@/lib/action-result";
import { checked, id, optNum, optText, text } from "@/lib/form-data";
import type { FormState } from "@/components/admin/ActionForm";

const paths = (sectionId?: number) => ["/admin/sections", ...(sectionId ? [`/admin/sections/${sectionId}`] : [])];

/** `editing`: the form carries an Open checkbox, whose absence means unticked. */
const section = (fd: FormData, editing = false) => ({
  name: text(fd, "name"),
  capacity: optNum(fd, "capacity"),
  room: optText(fd, "room"),
  classTeacherId: optNum(fd, "classTeacherId"),
  active: editing ? checked(fd, "active") : true,
});

/* the term overview */

export async function addClassToTerm(_p: FormState, fd: FormData): Promise<FormState> {
  await requirePermission("sections:manage");
  return attempt(() => structure.createBatch({ courseLevelId: id(fd, "courseLevelId"), termId: id(fd, "termId") }), paths());
}

export async function removeBatch(_p: FormState, fd: FormData): Promise<FormState> {
  await requirePermission("sections:manage");
  return attempt(() => structure.deleteBatch(id(fd, "batchId")), paths());
}

export async function addSection(_p: FormState, fd: FormData): Promise<FormState> {
  await requirePermission("sections:manage");
  return attempt(() => structure.createSection({ batchId: id(fd, "batchId"), ...section(fd) }), paths());
}

/* one section */

export async function updateSection(_p: FormState, fd: FormData): Promise<FormState> {
  await requirePermission("sections:manage");
  const sectionId = id(fd, "sectionId");
  return attempt(() => structure.updateSection(sectionId, section(fd, true)), paths(sectionId));
}

/** Deleting happens on the section's own page, so a success leaves it for the term overview. */
export async function deleteSection(_p: FormState, fd: FormData): Promise<FormState> {
  await requirePermission("sections:manage");
  const result = await attempt(() => structure.deleteSection(id(fd, "sectionId")), paths());
  if (result.ok) redirect("/admin/sections");
  return result;
}

export async function placeStudent(_p: FormState, fd: FormData): Promise<FormState> {
  await requirePermission("sections:manage");
  const sectionId = id(fd, "sectionId");
  return attempt(() => structure.placeStudent(sectionId, id(fd, "studentUserId"), optNum(fd, "rollNo")), paths(sectionId));
}

export async function numberRolls(_p: FormState, fd: FormData): Promise<FormState> {
  await requirePermission("sections:manage");
  const sectionId = id(fd, "sectionId");
  return attempt(() => structure.numberRolls(sectionId), paths(sectionId));
}

export async function updatePlacement(_p: FormState, fd: FormData): Promise<FormState> {
  await requirePermission("sections:manage");
  const sectionId = id(fd, "sectionId");
  return attempt(() => structure.updatePlacement(id(fd, "placementId"), { rollNo: optNum(fd, "rollNo"), status: text(fd, "status") }), paths(sectionId));
}

export async function assignTeacher(_p: FormState, fd: FormData): Promise<FormState> {
  await requirePermission("sections:manage");
  const sectionId = id(fd, "sectionId");
  return attempt(() => structure.assignTeacher(sectionId, id(fd, "teacherProfileId"), id(fd, "subjectId")), paths(sectionId));
}

export async function unassignTeacher(_p: FormState, fd: FormData): Promise<FormState> {
  await requirePermission("sections:manage");
  const sectionId = id(fd, "sectionId");
  return attempt(() => structure.unassignTeacher(id(fd, "assignmentId")), paths(sectionId));
}
