"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Tab bars of the student portal (LMS F3). The new pages hang off menus the student already has -
 * the API checks the same menu for each route - so they are reached through these tabs rather
 * than new sidebar entries: the week under Routine, applications under Documents.
 */
const GROUPS = {
  routine: [
    { href: "/classroom/routine", label: "My week" },
    { href: "/classroom/online-classes", label: "Online classes" },
    { href: "/classroom/exams", label: "Exams" },
    { href: "/classroom/calendar", label: "Calendar" },
  ],
  documents: [
    { href: "/classroom/documents", label: "Documents" },
    { href: "/classroom/leave", label: "Leave" },
    { href: "/classroom/transfer", label: "Transfer" },
  ],
};

export function StudentTabs({ group }: { group: keyof typeof GROUPS }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Sections of this page" className="flex gap-1 overflow-x-auto border-b border-line mb-6 no-print">
      {GROUPS[group].map((t) => {
        const active = pathname === t.href || pathname.startsWith(`${t.href}/`);
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={active ? "page" : undefined}
            className={`whitespace-nowrap text-xs font-bold px-3 py-2 border-b-2 -mb-px transition-colors ${
              active ? "border-green text-green" : "border-transparent text-ink-soft hover:text-green"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
