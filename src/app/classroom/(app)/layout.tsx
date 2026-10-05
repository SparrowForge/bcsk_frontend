import Link from "next/link";
import { requireStudent } from "@/lib/auth";
import { Logo } from "@/components/Logo";
import { LogoutButton } from "@/components/portal/LogoutButton";
import { PortalNav } from "@/components/portal/PortalNav";

export default async function ClassroomLayout({ children }: { children: React.ReactNode }) {
  const session = await requireStudent();

  // The sidebar is the account's own menus (Menu table, minus any a super admin has switched off
  // for them); the dashboard is always open.
  const links = [
    { href: "/classroom/dashboard", label: "Dashboard" },
    ...session.menus.map((m) => ({ href: m.href, label: m.label })),
  ];

  return (
    <div className="min-h-screen bg-mist/50 flex flex-col">
      <header className="bg-white border-b border-line sticky top-0 z-40 no-print">
        <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between gap-4">
          <Logo href="/classroom/dashboard" />
          <div className="flex items-center gap-3">
            <Link href="/" className="hidden sm:block text-xs font-bold text-ink-soft hover:text-green-mid">
              ← Public site
            </Link>
            <span className="text-sm font-bold text-green hidden sm:block">{session.name}</span>
            <LogoutButton dest="/classroom" />
          </div>
        </div>
        <PortalNav links={links} />
      </header>
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8">{children}</main>
    </div>
  );
}
