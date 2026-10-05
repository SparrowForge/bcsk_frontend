"use server";

import { redirect } from "next/navigation";
import { admissions, files, toActionError, type CouponCheck, type FeeStructure } from "@/services";

/**
 * FR-ADM-02/03/10: the one registration form.
 *
 * Regular admission, special course and re-admission share this action and the backend's single
 * `ApplicationForm` table. Validation, rate limiting (SEC-8), captcha (SEC-9), the minimum-age
 * rule (GAP-12), the returning-student check and the BCSK-discount claim (SEC-3) are all
 * enforced by the backend. This action moves the photo and the fields across, then hands back
 * the capability token that unlocks payment.
 */

export type ApplyState = { error?: string } | null;

const TYPES = ["REGULAR", "SPECIAL", "RE_ADMISSION"] as const;
export type RegistrationType = (typeof TYPES)[number];

/** Upload the applicant photo first - the application row stores its path, not the bytes. */
async function uploadPhoto(formData: FormData, required: boolean): Promise<string | undefined> {
  const file = formData.get("photo");
  if (!(file instanceof File) || file.size === 0) {
    if (required) throw new Error("A photo upload is required (JPG/PNG, max 1 MB).");
    return undefined;
  }
  const { path } = await files.upload(file, "applications");
  return path;
}

export async function submitApplication(_prev: ApplyState, formData: FormData): Promise<ApplyState> {
  const get = (k: string) => {
    const v = formData.get(k);
    return typeof v === "string" && v.trim() ? v.trim() : undefined;
  };
  const type = get("type") as RegistrationType | undefined;
  if (!type || !TYPES.includes(type)) return { error: "Choose what you are registering for." };

  let created: Awaited<ReturnType<typeof admissions.submit>>;
  try {
    const photoPath = await uploadPhoto(formData, type !== "RE_ADMISSION");
    created = await admissions.submit({
      type,
      applicantName: get("applicantName"),
      dob: get("dob"),
      gender: get("gender"),
      religion: get("religion"),
      phone: get("phone"),
      email: get("email"),
      addressKorea: get("addressKorea"),
      addressBangladesh: get("addressBangladesh"),
      emergencyContact: get("emergencyContact"),
      learningMode: get("learningMode"),
      // A checkbox posts "on" when ticked and nothing when not; the API expects a boolean.
      parentalConsent: formData.get("parentalConsent") === "on",
      recaptchaToken: get("recaptchaToken"),
      photoPath,
      fatherName: get("fatherName"),
      motherName: get("motherName"),
      guardianProfession: get("guardianProfession"),
      guardianEducation: get("guardianEducation"),
      guardianPhone2: get("guardianPhone2"),
      // re-admission
      studentId: get("studentId"),
      // special course
      courseName: get("courseName"),
      // The class (regular, re-admission) or the level/track (special) - one CourseLevel id.
      courseLevelId: Number(get("courseLevelId")) || undefined,
      highestEducation: get("highestEducation"),
      // SEC-3: persisted on the record, and the only thing the fee calculation reads.
      isBcskStudent: formData.get("isBcskStudent") === "on",
      // Only a coupon the family has applied (and seen priced) is sent; the backend re-checks it.
      couponCode: get("couponCode"),
    });
  } catch (e) {
    if (e instanceof Error && !("code" in e)) return { error: e.message };
    return toActionError(e);
  }
  // SEC-7: the token is what opens the payment step. An application id alone is useless.
  redirect(`/apply/payment/${created.applicationId}?t=${created.paymentToken}`);
}

export type CouponState = { coupon: CouponCheck } | { error: string };

/** Would this coupon work for the registration being filled in, and what does it take off? */
export async function checkCoupon(
  code: string,
  type: RegistrationType,
  choice: { courseName?: string; courseLevelId?: number },
): Promise<CouponState> {
  if (!code.trim()) return { error: "Enter a coupon code." };
  if (!TYPES.includes(type)) return { error: "Choose what you are registering for." };
  try {
    return { coupon: await admissions.couponCheck({ code, type, ...choice }) };
  } catch (e) {
    return toActionError(e);
  }
}

export type FeePreviewState = { fee: FeeStructure } | { error: string };

/** The fee table for the grade or course just chosen. Display only - payment is recomputed. */
export async function previewFee(
  type: RegistrationType,
  choice: { courseName?: string; courseLevelId?: number },
): Promise<FeePreviewState> {
  const chosen = type === "SPECIAL" ? choice.courseName : choice.courseLevelId;
  if (!TYPES.includes(type) || !chosen) return { error: "Choose a course to see its fees." };
  try {
    const fee = await admissions.feePreview({ type, ...choice });
    return { fee };
  } catch (e) {
    return toActionError(e);
  }
}
