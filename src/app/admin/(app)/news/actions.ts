"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth";
import { admin, files, toActionError } from "@/services";

export type NewsState = { ok?: boolean; error?: string } | null;

/**
 * FR-NEWS-01 (admin side): one endpoint creates or updates, keyed on the presence of an id.
 *
 * Every item carries a picture on the homepage (October 2026). The photo takes the gallery
 * upload path — `POST /files` checks size, MIME and magic bytes — and an empty file input
 * leaves the current photo alone, so editing a title never drops the picture.
 */
export async function saveNews(_prev: NewsState, formData: FormData): Promise<NewsState> {
  await requirePermission("news:manage");
  const id = Number(formData.get("id") ?? 0);
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  if (!title || !body) return { error: "Title and body are required." };

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

    await admin.saveNews({
      ...(id ? { id } : {}),
      type: String(formData.get("type") ?? "NEWS"),
      title,
      body,
      date: String(formData.get("date") ?? "") || new Date().toISOString().slice(0, 10),
      published: formData.get("published") === "on",
      ...(imageUrl !== undefined ? { imageUrl } : {}),
    });
  } catch (e) {
    return toActionError(e);
  }
  revalidatePath("/events/news");
  revalidatePath("/admin/news");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteNews(id: number) {
  await requirePermission("news:manage");
  await admin.deleteNews(id);
  revalidatePath("/events/news");
  revalidatePath("/admin/news");
  revalidatePath("/");
}
