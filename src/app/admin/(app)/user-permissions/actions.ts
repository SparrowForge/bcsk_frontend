"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth";
import { toActionError, userPermissions } from "@/services";
import type { MenuGrid, UserGrid } from "@/services/types";

export type GridLoad = { ok: true; custom: boolean; grid: Record<string, MenuGrid> } | { ok: false; error: string };
export type SaveResult = { ok: true; message: string } | { ok: false; error: string };

/**
 * Menu permissions are super-admin only (`permissions:manage`). Each action re-checks it - a
 * Server Action is a public endpoint - and the backend refuses the call independently.
 */
export async function loadUserGrid(userId: number): Promise<GridLoad> {
  await requirePermission("permissions:manage");
  try {
    const r: UserGrid = await userPermissions.forUser(userId);
    return { ok: true, custom: r.custom, grid: r.grid };
  } catch (e) {
    return { ok: false, ...toActionError(e) };
  }
}

export async function loadRoleGrid(role: string): Promise<GridLoad> {
  await requirePermission("permissions:manage");
  try {
    const r = await userPermissions.forRole(role);
    return { ok: true, custom: false, grid: r.grid };
  } catch (e) {
    return { ok: false, ...toActionError(e) };
  }
}

export async function saveGrid(userIds: number[], grid: Record<string, MenuGrid>): Promise<SaveResult> {
  await requirePermission("permissions:manage");
  if (userIds.length === 0) return { ok: false, error: "Select at least one user." };
  try {
    const r = await userPermissions.save(userIds, grid);
    revalidatePath("/admin/user-permissions");
    return { ok: true, message: `Saved for ${r.updated} user${r.updated === 1 ? "" : "s"}. It applies from their next request.` };
  } catch (e) {
    return { ok: false, ...toActionError(e) };
  }
}

export async function revertUsers(userIds: number[]): Promise<SaveResult> {
  await requirePermission("permissions:manage");
  if (userIds.length === 0) return { ok: false, error: "Select at least one user." };
  try {
    const r = await userPermissions.clear(userIds);
    revalidatePath("/admin/user-permissions");
    return { ok: true, message: `${r.cleared} user${r.cleared === 1 ? "" : "s"} back on role defaults.` };
  } catch (e) {
    return { ok: false, ...toActionError(e) };
  }
}
