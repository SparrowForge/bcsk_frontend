"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/admin/leads", label: "Leads", exact: false },
  { href: "/admin/leads/pipeline", label: "Pipeline" },
  { href: "/admin/leads/follow-ups", label: "Follow-ups" },
  { href: "/admin/leads/sources", label: "Sources" },
  { href: "/admin/leads/reports", label: "Reports" },
];

export function LeadsTabs() {
  const path = usePathname();
  // "Leads" owns the list and every lead's detail page; the others are exact sections.
  const isActive = (href: string) =>
    href === "/admin/leads"
      ? path === href || (path.startsWith("/admin/leads/") && !TABS.slice(1).some((t) => path.startsWith(t.href)))
      : path.startsWith(href);

  return (
    <nav aria-label="CRM sections" className="flex gap-1 overflow-x-auto border-b border-line mb-6">
      {TABS.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          aria-current={isActive(t.href) ? "page" : undefined}
          className={`whitespace-nowrap px-4 py-2.5 text-sm font-bold border-b-2 -mb-px transition-colors ${
            isActive(t.href) ? "border-green text-green" : "border-transparent text-ink-soft hover:text-green-mid"
          }`}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
