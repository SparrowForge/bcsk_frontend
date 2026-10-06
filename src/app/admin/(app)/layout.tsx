import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { LogoMark } from "@/components/Logo";
import { LogoutButton } from "@/components/portal/LogoutButton";
import { AdminNav } from "./AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();

  // SEC-5: the sidebar is the account's own menus - rows of the Menu table it holds Access on,
  // from its saved grid or its role's defaults - so a visible link and an allowed page never
  // disagree. Dashboard is always open. The two permission screens are super-admin only.
  const nav = [
    { href: "/admin/dashboard", label: "Dashboard" },
    ...session.menus.map((m) => ({ href: m.href, label: m.label })),
    ...(session.permissions.includes("permissions:manage")
      ? [
          { href: "/admin/menus", label: "Menu Entry" },
          { href: "/admin/user-permissions", label: "Menu Permissions" },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen bg-mist flex">
      <aside className="w-60 shrink-0 bg-green text-white min-h-screen sticky top-0 hidden lg:flex flex-col no-print">
        <Link href="/admin/dashboard" className="flex items-center gap-2.5 px-5 h-16 border-b border-white/10">
          <LogoMark size={34} priority />
          <span className="font-display font-semibold text-sm leading-tight">BCSK Admin</span>
        </Link>
        <AdminNav items={nav} />
        <div className="mt-auto p-4 border-t border-white/10 text-xs">
          <p className="font-bold">{session.name}</p>
          <p className="text-white/60 mt-0.5">{session.role.replace(/_/g, " ")}</p>
        </div>
      </aside>
      <div className="flex-1 min-w-0">
        <header className="bg-white border-b border-line sticky top-0 z-40 no-print">
          <div className="h-16 flex items-center justify-between px-4 sm:px-6">
            <div className="lg:hidden flex items-center gap-2">
              <LogoMark size={30} priority />
              <span className="font-display font-semibold text-sm text-green">BCSK Admin</span>
            </div>
            <div className="flex items-center gap-3 ml-auto">
              <Link href="/" className="text-xs font-bold text-ink-soft hover:text-green-mid hidden sm:block">← Public site</Link>
              <LogoutButton dest="/admin" />
            </div>
          </div>
          {/* Below desktop width this row is the only navigation, so it carries every menu on its own
              full-width line and scrolls sideways. It used to sit inside the header row and stop at
              six items, leaving Tickets, CMS, Users, Settings… unreachable on a tablet or phone. */}
          <nav aria-label="Admin navigation (compact)" className="lg:hidden overflow-x-auto flex gap-4 px-4 sm:px-6 pb-3 text-xs font-bold text-ink-soft">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="whitespace-nowrap hover:text-green">{n.label}</Link>
            ))}
          </nav>
        </header>
        <main className="p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
