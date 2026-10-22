"use server";

import { requireMenu } from "@/lib/auth";
import { teaching } from "@/services";
import { attempt } from "@/lib/action-result";
import { id, optText, text } from "@/lib/form-data";
import { schoolInstant } from "@/lib/school-time";
import type { FormState } from "@/components/admin/ActionForm";

/** Students see the meeting on their dashboard and routine, so those refresh too. */
const PATHS = ["/office/online-classes", "/classroom/dashboard", "/classroom/routine"];

export async function scheduleOnline(_p: FormState, fd: FormData): Promise<FormState> {
  await requireMenu("office.classes", "insert");
  const day = text(fd, "date");
  return attempt(() => teaching.scheduleOnline(id(fd, "classSessionId"), {
    startsAt: schoolInstant(day, text(fd, "startTime")),
    endsAt: schoolInstant(day, text(fd, "endTime")),
    topic: optText(fd, "topic"),
    joinUrl: optText(fd, "joinUrl"),
  }), PATHS);
}

export async function startOnline(_p: FormState, fd: FormData): Promise<FormState> {
  await requireMenu("office.classes", "update");
  return attempt(() => teaching.startOnline(id(fd, "onlineClassId")), PATHS);
}

export async function endOnline(_p: FormState, fd: FormData): Promise<FormState> {
  await requireMenu("office.classes", "update");
  return attempt(() => teaching.endOnline(id(fd, "onlineClassId"), optText(fd, "recordingUrl")), PATHS);
}

export async function cancelOnline(_p: FormState, fd: FormData): Promise<FormState> {
  await requireMenu("office.classes", "update");
  return attempt(() => teaching.cancelOnline(id(fd, "onlineClassId"), optText(fd, "reason")), PATHS);
}
