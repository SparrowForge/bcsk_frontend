"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth";
import { toActionError, userPermissions } from "@/services";

export type MenuState = { ok?: boolean; error?: string } | null;

const text = (f: FormData, k: string) => String(f.get(k) ?? "").trim();

/**
 * Menu entry. Super admin only (`permissions:manage`); each action re-checks it because a Server
 * Action is a public endpoint, and the backend refuses the call independently.
 *
 * Create (no `id`) or update one row of the Menu table. `key` and `panel` are fixed once a menu
 * exists, so an update sends only the editable fields.
 */
export async function saveMenu(_prev: MenuState, formData: FormData): Promise<MenuState> {
  await requirePermission("permissions:manage");
  const id = Number(text(formData, "id")) || null;
  const actions = formData.getAll("actions").map(String);
  const common = {
    module: text(formData, "module"),
    label: text(formData, "label"),
    href: text(formData, "href"),
    note: text(formData, "note") || null,
    displayOrder: Number(text(formData, "displayOrder") || 0),
    active: formData.get("active") === "on",
  };
  try {
    if (id) {
      // Switches of an admin menu come from the capabilities it grants, so the form does not send them.
      await userPermissions.updateMenu(id, { ...common, ...(actions.length ? { actions } : {}) });
    } else {
      await userPermissions.createMenu({ ...common, key: text(formData, "key"), panel: text(formData, "panel"), actions: actions.length ? actions : ["access"] });
    }
  } catch (e) {
    return toActionError(e);
  }
  revalidatePath("/admin/menus");
  revalidatePath("/admin/user-permissions");
  return { ok: true };
}

export async function deleteMenu(id: number): Promise<MenuState> {
  await requirePermission("permissions:manage");
  try {
    await userPermissions.removeMenu(id);
  } catch (e) {
    return toActionError(e);
  }
  revalidatePath("/admin/menus");
  return { ok: true };
}
