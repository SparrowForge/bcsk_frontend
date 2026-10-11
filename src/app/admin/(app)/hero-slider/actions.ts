"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth";
import { admin, files, toActionError } from "@/services";

export type HeroSliderState = { ok?: boolean; error?: string } | null;

/** A blank order field means "put it last"; anything else must be a whole number. */
function readOrder(formData: FormData): number | undefined | "invalid" {
  const raw = String(formData.get("displayOrder") ?? "").trim();
  if (!raw) return undefined;
  const n = Number(raw);
  return Number.isInteger(n) && n >= 0 && n <= 9999 ? n : "invalid";
}

function refresh() {
  revalidatePath("/admin/hero-slider");
  revalidatePath("/");
}

/**
 * The homepage hero slider. Same upload path as the gallery — `POST /files` with an
 * allowlisted folder, backend checks size/MIME/magic bytes and hands back a stored path. The
 * limits (`AdminService.HERO_ACTIVE_LIMIT` active, `HERO_IMAGE_LIMIT` stored) are enforced
 * server-side, not just by this form.
 */
export async function addHeroImage(_prev: HeroSliderState, formData: FormData): Promise<HeroSliderState> {
  await requirePermission("slider:manage");
  const caption = String(formData.get("caption") ?? "").trim() || null;
  const displayOrder = readOrder(formData);
  if (displayOrder === "invalid") return { error: "Order must be a whole number (1 shows first)." };
  const active = formData.get("active") === "on";
  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) return { error: "Choose an image." };
  if (file.type === "application/pdf") return { error: "JPG, PNG, or WEBP only." };

  try {
    const { path } = await files.upload(file, "gallery");
    await admin.addHeroImage(`/api/files/${path}`, caption, { displayOrder, active });
  } catch (e) {
    return toActionError(e);
  }
  refresh();
  return { ok: true };
}

/** Caption, order and active/inactive for one image already in the slider. */
export async function updateHeroImage(_prev: HeroSliderState, formData: FormData): Promise<HeroSliderState> {
  await requirePermission("slider:manage");
  const id = Number(formData.get("id") ?? 0);
  if (!id) return { error: "Unknown image." };
  const displayOrder = readOrder(formData);
  if (displayOrder === "invalid") return { error: "Order must be a whole number (1 shows first)." };

  try {
    await admin.updateHeroImage(id, {
      caption: String(formData.get("caption") ?? "").trim() || null,
      ...(displayOrder !== undefined ? { displayOrder } : {}),
      active: formData.get("active") === "on",
    });
  } catch (e) {
    return toActionError(e);
  }
  refresh();
  return { ok: true };
}

export async function deleteHeroImage(id: number) {
  await requirePermission("slider:manage");
  await admin.deleteHeroImage(id);
  refresh();
}
