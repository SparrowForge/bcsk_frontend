import { requirePermission } from "@/lib/auth";
import { userPermissions } from "@/services";
import type { MenuEntry, Panel } from "@/services/types";
import { MenuForm } from "./MenuForm";

const PANEL_TITLE: Record<Panel, string> = { ADMIN: "Admin panel", TEACHER: "Teacher panel", STUDENT: "Student panel" };

/** Menu entry: every menu of the admin, teacher and student panels, grouped by panel and module. */
export default async function MenusPage() {
  await requirePermission("permissions:manage");
  const menus = await userPermissions.entries();

  const byPanel = (["ADMIN", "TEACHER", "STUDENT"] as Panel[]).map((panel) => {
    const rows = menus.filter((m) => m.panel === panel);
    const modules = [...new Set(rows.map((m) => m.module))].map((module) => ({ module, rows: rows.filter((m) => m.module === module) }));
    return { panel, modules, count: rows.length };
  });

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-green">Menu Entry</h1>
        <p className="mt-1 text-sm text-ink-soft">
          The menus of the admin, teacher and student panels. Each sidebar is built from these rows, and
          <b> Menu Permissions</b> grants them to accounts one by one.
        </p>
      </div>

      <section className="bg-white rounded-2xl border border-line p-6">
        <h2 className="font-display text-lg font-semibold text-green mb-4">Add a menu</h2>
        <MenuForm />
        <p className="mt-3 text-[11px] text-ink-soft">
          Admin menus are tied to capabilities in code, so they cannot be added here, only renamed, moved to another module or
          reordered.
        </p>
      </section>

      {byPanel.map(({ panel, modules, count }) => (
        <section key={panel} className="space-y-3">
          <h2 className="font-display text-lg font-semibold text-green">
            {PANEL_TITLE[panel]} <span className="text-sm font-normal text-ink-soft">· {count} menus</span>
          </h2>
          {modules.map(({ module, rows }) => (
            <div key={module} className="bg-white rounded-2xl border border-line overflow-hidden">
              <h3 className="bg-mist px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-green">{module}</h3>
              <ul className="divide-y divide-line">
                {rows.map((m: MenuEntry) => (
                  <li key={m.id} className="px-5 py-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-bold text-ink">{m.label}</span>
                      <span className="font-mono text-xs text-ink-soft">{m.href}</span>
                      {!m.active && <span className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-bold text-red-600">Off</span>}
                      {!m.builtIn && <span className="rounded-full bg-amber/15 px-2 py-0.5 text-[11px] font-bold text-amber-ink">Added here</span>}
                      <span className="ml-auto text-xs text-ink-soft">
                        {m.offers.join(" · ") || "no switches"} · order {m.displayOrder} · {m.assigned} saved
                      </span>
                    </div>
                    <details className="mt-2">
                      <summary className="cursor-pointer text-xs font-bold text-green-mid">Edit</summary>
                      <div className="mt-3 border-t border-line pt-4">
                        <MenuForm menu={m} />
                      </div>
                    </details>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}
