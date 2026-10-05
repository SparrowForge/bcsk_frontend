"use server";

import { leads, toActionError } from "@/services";

export type EnquiryState = { ok: boolean; error?: string } | null;

/**
 * Web-to-lead. Validation, rate limiting and captcha all live in the backend; this only
 * shuttles the form across. The reply is the same whether or not the contact is already known.
 */
export async function submitEnquiry(_prev: EnquiryState, formData: FormData): Promise<EnquiryState> {
  const text = (k: string) => String(formData.get(k) ?? "").trim();
  const id = (k: string) => (text(k) ? Number(text(k)) : null);
  try {
    await leads.enquire({
      name: text("name"),
      email: text("email") || undefined,
      phone: text("phone") || undefined,
      city: text("city") || undefined,
      courseId: id("courseId"),
      sourceId: id("sourceId"),
      message: text("message") || undefined,
      recaptchaToken: text("recaptchaToken") || undefined,
    });
    return { ok: true };
  } catch (e) {
    return { ok: false, ...toActionError(e) };
  }
}
