"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * The teaching area of the teacher portal (LMS F2). Every page here sits behind the one
 * "My Classes" menu, as every route behind it does on the API, so they share a tab bar rather
 * than each needing a sidebar entry of its own.
 */
const TABS = [
  { href: "/office/classes", label: "My week" },
  { href: "/office/sections", label: "Sections" },
  { href: "/office/online-classes", label: "Online classes" },
  { href: "/office/exams", label: "Exams & marks" },
  { href: "/office/leave", label: "Leave" },
];

export function TeachingTabs() {
  const pathname = usePathname();
  return (
    <nav aria-label="Teaching" className="flex gap-1 overflow-x-auto border-b border-line mb-6 no-print">
      {TABS.map((t) => {
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
