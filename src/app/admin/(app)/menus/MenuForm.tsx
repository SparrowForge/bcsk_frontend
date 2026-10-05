"use client";

import { useActionState, useState, useTransition } from "react";
import { useKeptForm } from "@/components/forms/keep-form";
import type { MenuEntry, MenuFlag, Panel } from "@/services/types";
import { deleteMenu, saveMenu, type MenuState } from "./actions";

const input =
  "w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm focus:border-green-mid focus:outline-none";

const PANELS: { value: Panel; label: string; prefix: string }[] = [
  { value: "TEACHER", label: "Teacher panel", prefix: "/office/" },
  { value: "STUDENT", label: "Student panel", prefix: "/classroom/" },
];
const SWITCHES: { key: MenuFlag; label: string }[] = [
  { key: "access", label: "Access" },
  { key: "insert", label: "Insert" },
  { key: "update", label: "Update" },
  { key: "delete", label: "Delete" },
];

/** Add a teacher or student menu, or edit any existing one (`menu`). */
export function MenuForm({ menu }: { menu?: MenuEntry }) {
  const [state, action, pending] = useActionState<MenuState, FormData>(saveMenu, null);
  const kept = useKeptForm(action, state);
  const [panel, setPanel] = useState<Panel>(menu?.panel ?? "STUDENT");
  const [removing, startRemove] = useTransition();
  const [removeError, setRemoveError] = useState<string | null>(null);

  const isAdmin = menu?.panel === "ADMIN";
  const prefix = (menu ? PANELS.find((p) => p.value === menu.panel)?.prefix ?? "/admin/" : PANELS.find((p) => p.value === panel)!.prefix);

  return (
    <form {...kept} className="space-y-4">
      {menu && <input type="hidden" name="id" value={menu.id} />}

      <div className="grid sm:grid-cols-3 gap-4">
        {menu ? (
          <>
            <div>
              <span className="text-xs font-bold text-ink">Key</span>
              <p className="mt-1.5 font-mono text-sm text-ink-soft">{menu.key}</p>
            </div>
            <div>
              <span className="text-xs font-bold text-ink">Panel</span>
              <p className="mt-1.5 text-sm text-ink-soft">{menu.panel.charAt(0) + menu.panel.slice(1).toLowerCase()}</p>
            </div>
          </>
        ) : (
          <>
            <label className="block">
              <span className="text-xs font-bold text-ink">Panel *</span>
              <select name="panel" value={panel} onChange={(e) => setPanel(e.target.value as Panel)} className={`mt-1.5 ${input}`}>
                {PANELS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-bold text-ink">Key *</span>
              <input name="key" required minLength={2} placeholder={panel === "STUDENT" ? "classroom.library" : "office.reports"} className={`mt-1.5 ${input} font-mono`} />
            </label>
          </>
        )}
        <label className="block">
          <span className="text-xs font-bold text-ink">Module name *</span>
          <input name="module" required minLength={2} defaultValue={menu?.module} placeholder="Learning" className={`mt-1.5 ${input}`} />
        </label>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <label className="block">
          <span className="text-xs font-bold text-ink">Menu name *</span>
          <input name="label" required minLength={2} defaultValue={menu?.label} className={`mt-1.5 ${input}`} />
        </label>
        <label className="block">
          <span className="text-xs font-bold text-ink">Page link *</span>
          <input name="href" required defaultValue={menu?.href} placeholder={`${prefix}page`} className={`mt-1.5 ${input} font-mono`} />
        </label>
        <label className="block">
          <span className="text-xs font-bold text-ink">Order</span>
          <input name="displayOrder" type="number" min={0} defaultValue={menu?.displayOrder ?? 0} className={`mt-1.5 ${input}`} />
        </label>
      </div>

      <label className="block">
        <span className="text-xs font-bold text-ink">Note (shown under the name in the permission grid)</span>
        <input name="note" maxLength={200} defaultValue={menu?.note ?? ""} className={`mt-1.5 ${input}`} />
      </label>

      {isAdmin ? (
        <p className="text-xs text-ink-soft">
          Switches offered: <b>{menu!.offers.join(", ") || "none"}</b>. They come from the capabilities this admin menu grants, so they
          are not editable here.
        </p>
      ) : (
        <fieldset>
          <legend className="text-xs font-bold text-ink mb-1.5">Switches this menu offers</legend>
          <div className="flex flex-wrap gap-4">
            {SWITCHES.map((s) => (
              <label key={s.key} className="flex items-center gap-2 text-xs font-bold text-ink">
                <input
                  type="checkbox"
                  name="actions"
                  value={s.key}
                  defaultChecked={menu ? menu.actions.includes(s.key) : s.key === "access"}
                  className="w-4 h-4 accent-green"
                />
                {s.label}
              </label>
            ))}
          </div>
          <p className="mt-1.5 text-[11px] text-ink-soft">
            A teacher or student menu takes effect once a page or route is wired to its key. Access opens it; Insert is
            for creating or submitting, Update for editing, Delete for removing.
          </p>
        </fieldset>
      )}

      {menu && (
        <label className="flex items-center gap-2 text-xs font-bold text-ink">
          <input type="checkbox" name="active" defaultChecked={menu.active} disabled={isAdmin} className="w-4 h-4 accent-green" />
          Active{isAdmin ? " (admin menus stay on)" : " (hidden from sidebars and blocked when off)"}
          {isAdmin && <input type="hidden" name="active" value="on" />}
        </label>
      )}
      {!menu && <input type="hidden" name="active" value="on" />}

      {state?.error && <p role="alert" className="text-sm font-semibold text-red-600">{state.error}</p>}
      {state?.ok && <p className="text-sm font-semibold text-green">Saved ✓</p>}
      {removeError && <p role="alert" className="text-sm font-semibold text-red-600">{removeError}</p>}

      <div className="flex flex-wrap items-center gap-4">
        <button disabled={pending} className="bg-green hover:bg-green-deep disabled:opacity-60 text-white font-bold rounded-lg px-6 py-2.5 text-sm transition-colors">
          {pending ? "Saving…" : menu ? "Save changes" : "Add menu"}
        </button>
        {menu && !menu.builtIn && (
          <button
            type="button"
            disabled={removing}
            onClick={() => {
              if (!confirm(`Delete the menu "${menu.label}"? Permissions saved for it are removed too.`)) return;
              startRemove(async () => setRemoveError((await deleteMenu(menu.id))?.error ?? null));
            }}
            className="text-xs font-bold text-red-600 hover:underline disabled:opacity-60"
          >
            Delete menu
          </button>
        )}
      </div>
    </form>
  );
}
