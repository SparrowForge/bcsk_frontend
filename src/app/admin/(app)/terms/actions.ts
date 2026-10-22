"use server";

import { requirePermission } from "@/lib/auth";
import { structure } from "@/services";
import { attempt } from "@/lib/action-result";
import { id, optText, text } from "@/lib/form-data";
import type { FormState } from "@/components/admin/ActionForm";

const PATHS = ["/admin/terms", "/admin/sections"];
const term = (fd: FormData) => ({
  code: text(fd, "code"),
  name: text(fd, "name"),
  startDate: optText(fd, "startDate"),
  endDate: optText(fd, "endDate"),
});

export async function createTerm(_p: FormState, fd: FormData): Promise<FormState> {
  await requirePermission("sections:manage");
  return attempt(() => structure.createTerm(term(fd)), PATHS);
}

export async function updateTerm(_p: FormState, fd: FormData): Promise<FormState> {
  await requirePermission("sections:manage");
  return attempt(() => structure.updateTerm(id(fd, "id"), term(fd)), PATHS);
}

export async function setCurrentTerm(_p: FormState, fd: FormData): Promise<FormState> {
  await requirePermission("sections:manage");
  return attempt(() => structure.setCurrentTerm(id(fd, "id")), PATHS);
}

export async function deleteTerm(_p: FormState, fd: FormData): Promise<FormState> {
  await requirePermission("sections:manage");
  return attempt(() => structure.deleteTerm(id(fd, "id")), PATHS);
}
