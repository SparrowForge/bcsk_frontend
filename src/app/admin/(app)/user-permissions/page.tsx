import { requirePermission } from "@/lib/auth";
import { userPermissions } from "@/services";
import { PermissionManager } from "./PermissionManager";

/** Super admin: give one or more staff accounts their own menu-by-menu permissions. */
export default async function UserPermissionsPage() {
  await requirePermission("permissions:manage");
  const [users, menus] = await Promise.all([userPermissions.users(), userPermissions.menus()]);
  return <PermissionManager users={users} menus={menus} />;
}
