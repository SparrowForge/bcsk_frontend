"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const BASE = "/courses/abacus";

export const ABACUS_TABS = [
  { href: BASE, label: "Home" },
  { href: `${BASE}/about`, label: "All About Abacus" },
  { href: `${BASE}/syllabus`, label: "Syllabus" },
  { href: `${BASE}/books`, label: "Book" },
  { href: `${BASE}/online-class`, label: "Online Class" },
  { href: `${BASE}/fun`, label: "Fun Abacus" },
] as const;

/**
 * The programme's own menu. The October 2026 mockup draws it as a row of green links with the
 * current one underlined, so it reads as navigation rather than as six orange buttons.
 */
export function AbacusNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Abacus programme" className="rounded-2xl border border-line bg-white p-1.5">
      <ul className="grid grid-cols-3 gap-1 lg:grid-cols-6">
        {ABACUS_TABS.map((t) => {
          const active = t.href === BASE ? pathname === BASE : pathname.startsWith(t.href);
          return (
            <li key={t.href}>
              <Link
                href={t.href}
                aria-current={active ? "page" : undefined}
                className={`flex h-full min-h-11 items-center justify-center rounded-xl px-2 py-2 text-center text-xs font-bold leading-tight transition-colors sm:px-4 sm:text-sm ${
                  active
                    ? "bg-green-soft text-green shadow-[inset_0_-3px_0_var(--green)]"
                    : "text-ink-soft hover:bg-mist hover:text-green"
                }`}
              >
                {t.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
