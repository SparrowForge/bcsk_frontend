"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth";
import { admin, files, toActionError } from "@/services";

export type TeacherProfileState = { ok?: boolean; error?: string } | null;

/**
 * A teacher's public profile: what the homepage teacher panel and the Teachers page show.
 * The photo takes the gallery upload path — `POST /files` checks size, MIME and magic bytes
 * and hands back a stored path — and an empty file input leaves the current photo alone.
 */
export async function saveTeacherProfile(_prev: TeacherProfileState, formData: FormData): Promise<TeacherProfileState> {
  await requirePermission("cms:manage");
  const id = Number(formData.get("id") ?? 0);
  if (!id) return { error: "Unknown teacher." };
  const text = (k: string) => String(formData.get(k) ?? "").trim();

  try {
    let photoUrl: string | null | undefined;
    const file = formData.get("photo");
    if (file instanceof File && file.size > 0) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) return { error: "Photo must be JPG, PNG or WEBP." };
      const { path } = await files.upload(file, "gallery");
      photoUrl = `/api/files/${path}`;
    } else if (formData.get("removePhoto") === "on") {
      photoUrl = null;
    }

    await admin.updateTeacherProfile(id, {
      designation: text("designation"),
      subjects: text("subjects"),
      bio: text("bio"),
      isPublic: formData.get("isPublic") === "on",
      displayOrder: Number(formData.get("displayOrder") ?? 100) || 0,
      ...(photoUrl !== undefined ? { photoUrl } : {}),
    });
  } catch (e) {
    return toActionError(e);
  }
  revalidatePath("/admin/cms/teachers");
  revalidatePath("/bcsk/teachers");
  revalidatePath("/");
  return { ok: true };
}
