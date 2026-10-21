import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { LogoMark } from "@/components/Logo";
import { LogoutButton } from "@/components/portal/LogoutButton";
import { AdminNav, AdminMobileNav, type NavGroup } from "./AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();

  // SEC-5: the sidebar is the account's own menus - rows of the Menu table it holds Access on,
  // from its saved grid or its role's defaults - so a visible link and an allowed page never
  // disagree. They are grouped under their module, in Menu-table order. Dashboard is always
  // open; the two permission screens are super-admin only and join the Administration group.
  const groups: NavGroup[] = [{ module: null, items: [{ key: "dashboard", href: "/admin/dashboard", label: "Dashboard" }] }];
  const groupFor = (module: string) => {
    let g = groups.find((x) => x.module === module);
    if (!g) groups.push((g = { module, items: [] }));
    return g;
  };
  for (const m of session.menus) groupFor(m.module || "Other").items.push({ key: m.key, href: m.href, label: m.label });
  if (session.permissions.includes("permissions:manage")) {
    groupFor("Administration").items.push(
      { key: "menus", href: "/admin/menus", label: "Menu Entry" },
      { key: "user-permissions", href: "/admin/user-permissions", label: "Menu Permissions" },
    );
  }

  const brand = (size: number) => (
    <Link href="/admin/dashboard" className="flex items-center gap-2.5">
      <LogoMark size={size} priority />
      <span className="font-display font-semibold text-sm leading-tight">BCSK Admin</span>
    </Link>
  );

  return (
    <div className="min-h-screen bg-mist flex">
      <aside className="w-64 shrink-0 bg-green text-white h-screen sticky top-0 hidden lg:flex flex-col no-print">
        <div className="flex h-16 items-center border-b border-white/10 px-5">{brand(34)}</div>
        <AdminNav groups={groups} />
        <div className="mt-auto p-4 border-t border-white/10 text-xs">
          <p className="font-bold">{session.name}</p>
          <p className="text-white/60 mt-0.5">{session.role.replace(/_/g, " ")}</p>
        </div>
      </aside>
      <div className="flex-1 min-w-0">
        <header className="bg-white border-b border-line sticky top-0 z-40 no-print">
          <div className="h-16 flex items-center justify-between px-4 sm:px-6">
            <div className="lg:hidden flex items-center gap-1">
              <AdminMobileNav groups={groups} header={brand(30)} />
              <span className="font-display font-semibold text-sm text-green">BCSK Admin</span>
            </div>
            <div className="flex items-center gap-3 ml-auto">
              <Link href="/" className="text-xs font-bold text-ink-soft hover:text-green-mid hidden sm:block">← Public site</Link>
              <LogoutButton dest="/admin" />
            </div>
          </div>
        </header>
        <main className="p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
