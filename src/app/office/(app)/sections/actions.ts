"use server";

import { requireMenu } from "@/lib/auth";
import { files, teaching } from "@/services";
import { attempt } from "@/lib/action-result";
import { checked, id, optNum, optText, text } from "@/lib/form-data";
import type { FormState } from "@/components/admin/ActionForm";

const paths = (sectionId: number) => [`/office/sections/${sectionId}`, "/classroom/materials"];

/** A material's fields. A FILE carries an uploaded path, a LINK or VIDEO an https link. */
async function material(fd: FormData) {
  const kind = text(fd, "kind") || "LINK";
  let fileUrl: string | null = optText(fd, "currentFile");
  const file = fd.get("file");
  if (kind === "FILE" && file instanceof File && file.size > 0) fileUrl = (await files.upload(file, "materials")).path;
  return {
    subjectId: id(fd, "subjectId"),
    title: text(fd, "title"),
    description: optText(fd, "description"),
    kind,
    fileUrl: kind === "FILE" ? fileUrl : null,
    linkUrl: kind === "FILE" ? null : optText(fd, "linkUrl"),
    published: checked(fd, "published"),
    displayOrder: optNum(fd, "displayOrder") ?? 100,
  };
}

export async function createMaterial(_p: FormState, fd: FormData): Promise<FormState> {
  await requireMenu("office.classes", "insert");
  const sectionId = id(fd, "sectionId");
  return attempt(async () => teaching.createMaterial(sectionId, await material(fd)), paths(sectionId));
}

export async function updateMaterial(_p: FormState, fd: FormData): Promise<FormState> {
  await requireMenu("office.classes", "update");
  return attempt(async () => teaching.updateMaterial(id(fd, "materialId"), await material(fd)), paths(id(fd, "sectionId")));
}

export async function deleteMaterial(_p: FormState, fd: FormData): Promise<FormState> {
  await requireMenu("office.classes", "update");
  return attempt(() => teaching.deleteMaterial(id(fd, "materialId")), paths(id(fd, "sectionId")));
}
