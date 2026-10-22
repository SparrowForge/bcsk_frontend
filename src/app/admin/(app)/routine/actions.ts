"use server";

import { requirePermission } from "@/lib/auth";
import { routine } from "@/services";
import { attempt } from "@/lib/action-result";
import { id, optNum, optText, text } from "@/lib/form-data";
import type { FormState } from "@/components/admin/ActionForm";

/** The routine also shows on the student routine and the teacher dashboard. */
const PATHS = ["/admin/routine", "/classroom/routine", "/office/dashboard"];
const times = (fd: FormData) => ({
  teacherProfileId: optNum(fd, "teacherProfileId"),
  dayOfWeek: text(fd, "dayOfWeek"),
  startTime: text(fd, "startTime"),
  endTime: text(fd, "endTime"),
  room: optText(fd, "room"),
  zoomLink: optText(fd, "zoomLink"),
});

/**
 * The routine builder. A clash (the teacher, the section or the room already busy then) comes
 * back from the API as a 409 naming the other class; it is shown on the form as written.
 */
export async function createSlot(_p: FormState, fd: FormData): Promise<FormState> {
  await requirePermission("scheduling:manage");
  return attempt(() => routine.create({ sectionId: id(fd, "sectionId"), subjectId: id(fd, "subjectId"), ...times(fd) }), PATHS);
}

export async function updateSlot(_p: FormState, fd: FormData): Promise<FormState> {
  await requirePermission("scheduling:manage");
  return attempt(() => routine.update(id(fd, "slotId"), { ...times(fd), notice: optText(fd, "notice") }), PATHS);
}

export async function removeSlot(_p: FormState, fd: FormData): Promise<FormState> {
  await requirePermission("scheduling:manage");
  return attempt(() => routine.remove(id(fd, "slotId")), PATHS);
}
