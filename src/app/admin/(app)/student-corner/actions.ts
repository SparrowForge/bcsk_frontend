"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth";
import { admin, files, toActionError } from "@/services";

export type CornerState = { ok?: boolean; error?: string } | null;

/**
 * FR-NEWS-03 (admin side): curate student work.
 *
 * The kind is typed, not picked (October 2026): the school adds extra-curricular kinds —
 * handicrafts, science projects — as they come, and the backend turns the text into a stable
 * key. A photo is optional and takes the gallery upload path; an empty file input keeps the
 * current one.
 */
export async function saveCornerPost(_prev: CornerState, formData: FormData): Promise<CornerState> {
  await requirePermission("corner:manage");
  const id = Number(formData.get("id") ?? 0);
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const studentName = String(formData.get("studentName") ?? "").trim();
  if (!title || !body || !studentName) return { error: "Title, body, and student name are required." };

  const kind = String(formData.get("kind") ?? "").trim();
  if (!kind) return { error: "Say what kind of work this is." };

  try {
    let imageUrl: string | null | undefined;
    const file = formData.get("image");
    if (file instanceof File && file.size > 0) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) return { error: "Picture must be JPG, PNG or WEBP." };
      const { path } = await files.upload(file, "gallery");
      imageUrl = `/api/files/${path}`;
    } else if (formData.get("removeImage") === "on") {
      imageUrl = null;
    }

    await admin.saveCornerPost({
      ...(id ? { id } : {}),
      title,
      body,
      studentName,
      kind,
      published: formData.get("published") === "on",
      ...(imageUrl !== undefined ? { imageUrl } : {}),
    });
  } catch (e) {
    return toActionError(e);
  }
  revalidatePath("/student-corner");
  revalidatePath("/admin/student-corner");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteCornerPost(id: number) {
  await requirePermission("corner:manage");
  await admin.deleteCornerPost(id);
  revalidatePath("/student-corner");
  revalidatePath("/admin/student-corner");
  revalidatePath("/");
}
