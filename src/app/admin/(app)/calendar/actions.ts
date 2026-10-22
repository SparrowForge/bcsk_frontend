"use server";

import { requirePermission } from "@/lib/auth";
import { academicCalendar } from "@/services";
import { attempt } from "@/lib/action-result";
import { checked, id, optNum, optText, text } from "@/lib/form-data";
import type { FormState } from "@/components/admin/ActionForm";

const PATHS = ["/admin/calendar", "/academic/calendar"];
const event = (fd: FormData) => {
  const startDate = text(fd, "startDate");
  return {
    title: text(fd, "title"),
    description: optText(fd, "description"),
    type: text(fd, "type"),
    audience: text(fd, "audience") || "ALL",
    startDate,
    // A one-day entry may leave the end blank.
    endDate: text(fd, "endDate") || startDate,
    termId: optNum(fd, "termId"),
    courseLevelId: optNum(fd, "courseLevelId"),
    published: checked(fd, "published"),
  };
};

export async function createEvent(_p: FormState, fd: FormData): Promise<FormState> {
  await requirePermission("calendar:manage");
  return attempt(() => academicCalendar.create(event(fd)), PATHS);
}

export async function updateEvent(_p: FormState, fd: FormData): Promise<FormState> {
  await requirePermission("calendar:manage");
  return attempt(() => academicCalendar.update(id(fd, "id"), event(fd)), PATHS);
}

export async function deleteEvent(_p: FormState, fd: FormData): Promise<FormState> {
  await requirePermission("calendar:manage");
  return attempt(() => academicCalendar.remove(id(fd, "id")), PATHS);
}
