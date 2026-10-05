"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth";
import { coupons, toActionError } from "@/services";

export type CouponState = { ok?: boolean; error?: string } | null;

const text = (f: FormData, k: string) => String(f.get(k) ?? "").trim();

/** Dates are school (Korea) calendar days: a coupon runs from 00:00 on the first to 23:59 on the last. */
const dayStart = (d: string) => (d ? new Date(`${d}T00:00:00+09:00`).toISOString() : null);
const dayEnd = (d: string) => (d ? new Date(`${d}T23:59:59+09:00`).toISOString() : null);

/** Create (no `id`) or update one coupon. The backend owns every rule: code format, 1-99%, dates. */
export async function saveCoupon(_prev: CouponState, formData: FormData): Promise<CouponState> {
  await requirePermission("coupons:manage");
  const id = Number(text(formData, "id")) || null;
  const input = {
    code: text(formData, "code"),
    description: text(formData, "description") || null,
    discountType: text(formData, "discountType"),
    value: text(formData, "value"),
    appliesTo: text(formData, "appliesTo") || "ALL",
    maxUses: text(formData, "maxUses") || null,
    validFrom: dayStart(text(formData, "validFrom")),
    validUntil: dayEnd(text(formData, "validUntil")),
    active: id ? formData.get("active") === "on" : true,
  };
  try {
    if (id) await coupons.update(id, input);
    else await coupons.create(input);
  } catch (e) {
    return toActionError(e);
  }
  revalidatePath("/admin/coupons");
  return { ok: true };
}

export async function deleteCoupon(id: number) {
  await requirePermission("coupons:manage");
  await coupons.remove(id);
  revalidatePath("/admin/coupons");
}

export async function setCouponActive(id: number, active: boolean) {
  await requirePermission("coupons:manage");
  await coupons.update(id, { active });
  revalidatePath("/admin/coupons");
}
