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

/** The orange tab bar from the school's Abacus design. */
export function AbacusNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Abacus programme">
      <ul className="grid grid-cols-3 lg:grid-cols-6 gap-2">
        {ABACUS_TABS.map((t) => {
          const active = t.href === BASE ? pathname === BASE : pathname.startsWith(t.href);
          return (
            <li key={t.href}>
              <Link
                href={t.href}
                aria-current={active ? "page" : undefined}
                className={`flex h-full min-h-11 items-center justify-center text-center leading-tight rounded-lg px-2 sm:px-4 py-2 text-xs sm:text-sm font-extrabold transition-colors ${
                  active
                    ? "bg-white text-green shadow-[inset_0_-3px_0_var(--abacus)]"
                    : "bg-abacus text-ink hover:bg-abacus-deep"
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
