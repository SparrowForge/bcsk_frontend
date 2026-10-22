"use server";

import { requireMenu } from "@/lib/auth";
import { teaching } from "@/services";
import { attempt } from "@/lib/action-result";
import type { FormState } from "@/components/admin/ActionForm";

type Entry = { studentUserId: number; obtained: number | null; isAbsent: boolean };

const paths = (paperId: number, sectionId: number) => [`/office/exams/${paperId}/${sectionId}`, "/office/exams"];

/** Save the grid as a draft. Out-of-range marks and strangers are refused by the API, by name. */
export async function saveMarks(paperId: number, sectionId: number, entries: Entry[]): Promise<FormState> {
  await requireMenu("office.classes", "insert");
  return attempt(() => teaching.saveMarks(paperId, sectionId, entries), paths(paperId, sectionId));
}

/** Save what is on screen, then submit the sheet - so nothing typed since the last save is lost. */
export async function submitMarks(paperId: number, sectionId: number, entries: Entry[]): Promise<FormState> {
  await requireMenu("office.classes", "insert");
  return attempt(async () => {
    await teaching.saveMarks(paperId, sectionId, entries);
    await teaching.submitMarks(paperId, sectionId);
  }, paths(paperId, sectionId));
}
