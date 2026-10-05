"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requirePermission } from "@/lib/auth";
import { fromLocalInput } from "@/lib/leads";
import { leads, toActionError } from "@/services";

export type LeadState = { ok?: boolean; error?: string } | null;

/**
 * CRM mutations. Each one re-checks `leads:manage` (a Server Action is a public endpoint) and
 * makes exactly one SDK call; the backend owns every rule - stage moves, duplicates, scoring.
 */

const text = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const optional = (f: FormData, k: string) => text(f, k) || null;
const optId = (f: FormData, k: string) => {
  const v = text(f, k);
  return v ? Number(v) : null;
};
/** `datetime-local` has no zone: it is school (Korea) time, see `fromLocalInput`. */
const optDate = (f: FormData, k: string) => fromLocalInput(text(f, k));

const refresh = (id?: number) => {
  revalidatePath("/admin/leads", "layout");
  if (id) revalidatePath(`/admin/leads/${id}`);
};

export async function createLead(_prev: LeadState, formData: FormData): Promise<LeadState> {
  await requirePermission("leads:manage");
  let id: number;
  try {
    const lead = await leads.create({
      name: text(formData, "name"),
      email: optional(formData, "email"),
      phone: optional(formData, "phone"),
      alternatePhone: optional(formData, "alternatePhone"),
      city: optional(formData, "city"),
      gender: optional(formData, "gender"),
      sourceId: optId(formData, "sourceId"),
      courseId: optId(formData, "courseId"),
      campaign: optional(formData, "campaign"),
      referredBy: optional(formData, "referredBy"),
      assignedToUserId: optId(formData, "assignedToUserId"),
      nextFollowUpAt: optDate(formData, "nextFollowUpAt"),
      remarks: optional(formData, "remarks"),
    });
    id = lead.id;
  } catch (e) {
    return toActionError(e);
  }
  refresh();
  redirect(`/admin/leads/${id}`);
}

export async function updateLead(_prev: LeadState, formData: FormData): Promise<LeadState> {
  await requirePermission("leads:manage");
  const id = Number(formData.get("id"));
  try {
    await leads.update(id, {
      name: text(formData, "name"),
      email: optional(formData, "email"),
      phone: optional(formData, "phone"),
      alternatePhone: optional(formData, "alternatePhone"),
      city: optional(formData, "city"),
      gender: optional(formData, "gender"),
      sourceId: optId(formData, "sourceId"),
      courseId: optId(formData, "courseId"),
      campaign: optional(formData, "campaign"),
      referredBy: optional(formData, "referredBy"),
      nextFollowUpAt: optDate(formData, "nextFollowUpAt"),
      remarks: optional(formData, "remarks"),
    });
  } catch (e) {
    return toActionError(e);
  }
  refresh(id);
  return { ok: true };
}

export async function changeStage(_prev: LeadState, formData: FormData): Promise<LeadState> {
  await requirePermission("leads:manage");
  const id = Number(formData.get("id"));
  const stage = text(formData, "stage");
  if (stage === "LOST" && !text(formData, "lostReason")) return { error: "Choose why the lead was lost." };
  try {
    await leads.setStage(id, {
      stage,
      lostReason: optional(formData, "lostReason") ?? undefined,
      lostNote: optional(formData, "lostNote"),
      note: optional(formData, "note"),
    });
  } catch (e) {
    return toActionError(e);
  }
  refresh(id);
  return { ok: true };
}

/** One-click move on the pipeline board. Marking a lead lost needs a reason, so it is not offered here. */
export async function moveLeadStage(id: number, stage: string): Promise<LeadState> {
  await requirePermission("leads:manage");
  if (stage === "LOST" || stage === "ENROLLED") return { error: "Open the lead to do that." };
  try {
    await leads.setStage(id, { stage });
  } catch (e) {
    return toActionError(e);
  }
  refresh(id);
  return { ok: true };
}

export async function assignLead(_prev: LeadState, formData: FormData): Promise<LeadState> {
  await requirePermission("leads:manage");
  const id = Number(formData.get("id"));
  try {
    await leads.assign(id, { assignedToUserId: optId(formData, "assignedToUserId") });
  } catch (e) {
    return toActionError(e);
  }
  refresh(id);
  return { ok: true };
}

export async function bulkAssignLeads(_prev: LeadState, formData: FormData): Promise<LeadState> {
  await requirePermission("leads:manage");
  const ids = formData.getAll("leadId").map(Number).filter((n) => Number.isInteger(n) && n > 0);
  if (ids.length === 0) return { error: "Tick at least one lead." };
  try {
    await leads.bulkAssign(ids, optId(formData, "assignedToUserId"));
  } catch (e) {
    return toActionError(e);
  }
  refresh();
  return { ok: true };
}

export async function logLeadActivity(_prev: LeadState, formData: FormData): Promise<LeadState> {
  await requirePermission("leads:manage");
  const id = Number(formData.get("id"));
  const done = formData.get("done") === "on";
  try {
    await leads.logActivity(id, {
      type: text(formData, "type"),
      subject: text(formData, "subject"),
      notes: optional(formData, "notes"),
      outcome: optional(formData, "outcome"),
      scheduledAt: optDate(formData, "scheduledAt"),
      // "Done now" stamps completion and counts as contact; leaving it off logs a planned task.
      completedAt: done ? new Date().toISOString() : null,
      nextFollowUpAt: optDate(formData, "nextFollowUpAt") ?? undefined,
    });
  } catch (e) {
    return toActionError(e);
  }
  refresh(id);
  revalidatePath("/admin/leads/follow-ups");
  return { ok: true };
}

export async function deleteLeadActivity(leadId: number, activityId: number) {
  await requirePermission("leads:manage");
  await leads.removeActivity(activityId);
  refresh(leadId);
}

export async function convertLead(_prev: LeadState, formData: FormData): Promise<LeadState> {
  await requirePermission("leads:manage");
  const id = Number(formData.get("id"));
  let applicationId: number;
  try {
    const res = await leads.convert(id, {
      type: optional(formData, "type") ?? undefined,
      courseLevelId: optId(formData, "courseLevelId"),
      note: optional(formData, "note"),
    });
    applicationId = res.applicationId;
  } catch (e) {
    return toActionError(e);
  }
  refresh(id);
  revalidatePath("/admin/admissions");
  redirect(`/admin/admissions/${applicationId}`);
}

export async function deleteLead(_prev: LeadState, formData: FormData): Promise<LeadState> {
  await requirePermission("leads:manage");
  const id = Number(formData.get("id"));
  try {
    await leads.remove(id);
  } catch (e) {
    return toActionError(e);
  }
  refresh();
  redirect("/admin/leads");
}

/* --------------------------------- sources --------------------------------- */

export async function saveSource(_prev: LeadState, formData: FormData): Promise<LeadState> {
  await requirePermission("leads:manage");
  const id = optId(formData, "id");
  const input = {
    name: text(formData, "name"),
    code: optional(formData, "code"),
    description: optional(formData, "description"),
    isPublic: formData.get("isPublic") === "on",
    active: formData.get("active") === "on" || id === null,
  };
  try {
    if (id) await leads.updateSource(id, input);
    else await leads.createSource(input);
  } catch (e) {
    return toActionError(e);
  }
  revalidatePath("/admin/leads/sources");
  return { ok: true };
}

export async function deleteSource(id: number) {
  await requirePermission("leads:manage");
  await leads.removeSource(id);
  revalidatePath("/admin/leads/sources");
}
