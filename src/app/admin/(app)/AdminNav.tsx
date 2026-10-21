"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export type NavItem = { key: string; href: string; label: string };
export type NavGroup = { module: string | null; items: NavItem[] };

/**
 * Line icons for the built-in menus, one stroke weight. A menu created on the Menu Entry
 * screen has no entry here and takes the generic square.
 */
const ICONS: Record<string, React.ReactNode> = {
  dashboard: <path d="M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z" />,
  admissions: <path d="M9 4h6M9 4a2 2 0 0 0-2 2v0H5v15h14V6h-2a2 2 0 0 0-2-2M8.5 12.5l2.5 2.5 4.5-5" />,
  payments: <path d="M3 7h18v10H3zM3 11h18M7 15h3" />,
  fees: <path d="M12 3v18M16.5 7.5c0-1.7-2-3-4.5-3s-4.5 1.3-4.5 3 2 2.6 4.5 3 4.5 1.3 4.5 3-2 3-4.5 3-4.5-1.3-4.5-3" />,
  coupons: <path d="M4 7a2 2 0 0 0 2-2h12a2 2 0 0 0 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 0-2 2H6a2 2 0 0 0-2-2v-3a2 2 0 0 0 0-4zM10 9l4 6M10 9h.01M14 15h.01" />,
  leads: <path d="M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.5 20a5.5 5.5 0 0 1 11 0M16 11a2.5 2.5 0 1 0 0-5M17.5 20h3a4.5 4.5 0 0 0-4-4.5" />,
  tickets: <path d="M4 5h16v11H8l-4 4zM8 9h8M8 12h5" />,
  cms: <path d="M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 16h7" />,
  news: <path d="M4 5h13v14H6a2 2 0 0 1-2-2zM17 9h3v8a2 2 0 0 1-2 2M7 9h7M7 13h7M7 16h4" />,
  gallery: <path d="M4 5h16v14H4zM4 15l4-4 4 4 3-3 5 5M15 9h.01" />,
  slider: <path d="M6 6h12v12H6zM2 9v6M22 9v6" />,
  corner: <path d="M12 3 3 8l9 5 9-5-9-5ZM7 10.5V15c0 1.4 2.2 3 5 3s5-1.6 5-3v-4.5" />,
  governing: <path d="M4 20h16M6 20V10M10 20V10M14 20V10M18 20V10M3 10l9-6 9 6" />,
  courses: <path d="M12 6.5C10.3 5.2 7.8 4.6 4 4.8v12.9c3.8-.2 6.3.4 8 1.8 1.7-1.4 4.2-2 8-1.8V4.8c-3.8-.2-6.3.4-8 1.7ZM12 6.5v13" />,
  curriculum: <path d="m2.5 9 9.5-4.5L21.5 9 12 13.5 2.5 9ZM6.5 11v4.2c0 1.5 2.5 2.8 5.5 2.8s5.5-1.3 5.5-2.8V11" />,
  scheduling: <path d="M4 6h16v14H4zM4 10h16M8 3v5M16 3v5M8 14h3M8 17h6" />,
  reports: <path d="M5 20V10M10 20V4M15 20v-7M20 20v-4" />,
  users: <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0" />,
  settings: <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />,
  audit: <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6zM8.5 12l2.5 2.5 4.5-5" />,
  menus: <path d="M4 6h16M4 12h16M4 18h10" />,
  "user-permissions": <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6zM12 8v4M12 15h.01" />,
};
const FALLBACK = <path d="M5 5h14v14H5z" />;

/** The open page is the menu whose link is the longest prefix of the path. */
function activeHref(pathname: string, groups: NavGroup[]): string | null {
  let best: string | null = null;
  for (const g of groups) {
    for (const i of g.items) {
      const hit = pathname === i.href || pathname.startsWith(`${i.href}/`);
      if (hit && (!best || i.href.length > best.length)) best = i.href;
    }
  }
  return best;
}

/**
 * The admin sidebar: the account's menus under their module headings, in Menu-table order.
 * Only menus the account holds Access on ever reach this component (built in the layout from
 * `session.menus`), so a link is shown exactly when its page would open.
 */
export function AdminNav({ groups, onNavigate }: { groups: NavGroup[]; onNavigate?: () => void }) {
  const pathname = usePathname();
  const current = activeHref(pathname, groups);
  return (
    <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Admin navigation">
      {groups.map((g, gi) => (
        <div key={g.module ?? `top-${gi}`} className={gi > 0 ? "mt-5" : undefined}>
          {g.module && (
            <p className="px-3 pb-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-white/45">{g.module}</p>
          )}
          <ul className="space-y-0.5">
            {g.items.map((n) => {
              const active = n.href === current;
              return (
                <li key={n.key}>
                  <Link
                    href={n.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-semibold transition-colors ${
                      active ? "bg-white text-green shadow-sm" : "text-white/75 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                      className="shrink-0"
                    >
                      {ICONS[n.key] ?? FALLBACK}
                    </svg>
                    <span className="truncate">{n.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

/**
 * Below desktop width: a menu button that slides the same sidebar in from the left. It replaces
 * a sideways-scrolling row of links that hid most menus off screen.
 */
export function AdminMobileNav({ groups, header }: { groups: NavGroup[]; header: React.ReactNode }) {
  // Open only on the page it was opened from, so any navigation - a link, Back - closes it.
  const pathname = usePathname();
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (v: boolean) => setOpenOn(v ? pathname : null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenOn(null);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className="lg:hidden grid h-10 w-10 place-items-center rounded-lg text-green hover:bg-mist"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Admin menu">
          <button type="button" aria-label="Close menu" onClick={() => setOpen(false)} className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-green text-white shadow-xl">
            <div className="flex h-16 items-center justify-between border-b border-white/10 pl-5 pr-3">
              {header}
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="grid h-9 w-9 place-items-center rounded-lg text-white/80 hover:bg-white/10"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>
            <AdminNav groups={groups} onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
