"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requirePermission } from "@/lib/auth";
import { academic, files, toActionError } from "@/services";

/**
 * Academic > All General Classes, admin side. Images take the gallery's upload path (public
 * folder, size/MIME/magic bytes checked by the backend) and are stored as `/api/files/...`.
 * Every write expires the `academic` cache tag so the public pages show it at once.
 */

export type CurriculumState = { ok?: boolean; error?: string } | null;

const text = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
/** One item per line in a textarea. */
const lines = (fd: FormData, k: string) => text(fd, k).split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

/** A newly chosen image replaces the stored one; no choice keeps it. */
async function image(fd: FormData, field: string, current: string): Promise<string> {
  const file = fd.get(field);
  if (!(file instanceof File) || file.size === 0) return current;
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) throw new Error("Images must be JPG, PNG or WEBP.");
  const { path } = await files.upload(file, "gallery");
  return `/api/files/${path}`;
}

function refresh(classId?: number) {
  revalidateTag("academic", { expire: 0 });
  revalidatePath("/admin/curriculum");
  if (classId) revalidatePath(`/admin/curriculum/${classId}`);
}

function failure(e: unknown): CurriculumState {
  if (e instanceof Error && !("code" in e)) return { error: e.message };
  return toActionError(e);
}

export async function saveClass(_prev: CurriculumState, fd: FormData): Promise<CurriculumState> {
  await requirePermission("courses:manage");
  const id = Number(fd.get("id") ?? 0);
  let createdId = 0;
  try {
    const input = {
      slug: text(fd, "slug"),
      name: text(fd, "name"),
      ageRange: text(fd, "ageRange"),
      summary: text(fd, "summary"),
      tagline: text(fd, "tagline"),
      intro: text(fd, "intro"),
      highlights: lines(fd, "highlights"),
      color: text(fd, "color") || "green",
      displayOrder: Number(text(fd, "displayOrder") || 100),
      active: fd.get("active") === "on",
      cardImageUrl: await image(fd, "cardImage", text(fd, "cardImageUrl")),
      bannerImageUrl: await image(fd, "bannerImage", text(fd, "bannerImageUrl")),
    };
    if (id) await academic.updateClass(id, input);
    else createdId = (await academic.createClass(input)).id;
  } catch (e) {
    return failure(e);
  }
  refresh(id || undefined);
  // A new class opens on its own page, where its books are added.
  if (createdId) redirect(`/admin/curriculum/${createdId}`);
  return { ok: true };
}

export async function deleteClass(id: number): Promise<CurriculumState> {
  await requirePermission("courses:manage");
  try {
    await academic.deleteClass(id);
  } catch (e) {
    return failure(e);
  }
  refresh();
  redirect("/admin/curriculum");
}

export async function saveSubject(classId: number, _prev: CurriculumState, fd: FormData): Promise<CurriculumState> {
  await requirePermission("courses:manage");
  const id = Number(fd.get("id") ?? 0);
  try {
    const input = {
      title: text(fd, "title"),
      category: text(fd, "category") || "MAIN",
      description: text(fd, "description"),
      outcomes: lines(fd, "outcomes"),
      color: text(fd, "color") || "pink",
      displayOrder: Number(text(fd, "displayOrder") || 100),
      coverImageUrl: await image(fd, "coverImage", text(fd, "coverImageUrl")),
    };
    if (id) await academic.updateSubject(id, input);
    else await academic.addSubject(classId, input);
  } catch (e) {
    return failure(e);
  }
  refresh(classId);
  return { ok: true };
}

export async function deleteSubject(id: number, classId: number): Promise<CurriculumState> {
  await requirePermission("courses:manage");
  try {
    await academic.deleteSubject(id);
  } catch (e) {
    return failure(e);
  }
  refresh(classId);
  return { ok: true };
}
