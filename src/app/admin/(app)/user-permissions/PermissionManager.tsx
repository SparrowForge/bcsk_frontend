"use client";

import { useMemo, useState, useTransition } from "react";
import type { MenuFlag, MenuGrid, PermissionMenu, PermissionUser } from "@/services/types";
import { loadRoleGrid, loadUserGrid, revertUsers, saveGrid } from "./actions";

const FLAGS: { key: MenuFlag; label: string }[] = [
  { key: "access", label: "Access" },
  { key: "insert", label: "Insert" },
  { key: "update", label: "Update" },
  { key: "delete", label: "Delete" },
];

const ROLES = [
  { value: "ADMIN_SUPPORT", label: "Admin Support" },
  { value: "IT_SUPPORT", label: "IT Support" },
  { value: "SUPER_ADMIN", label: "Super Admin (everything)" },
];

const blank = (): MenuGrid => ({ access: false, insert: false, update: false, delete: false });
const emptyGrid = (menus: PermissionMenu[]) => Object.fromEntries(menus.map((m) => [m.key, blank()]));
const field =
  "rounded-lg border border-line bg-white px-3 py-2 text-sm focus:border-green-mid focus:outline-none";

type Notice = { tone: "ok" | "error"; text: string } | null;

export function PermissionManager({ users, menus }: { users: PermissionUser[]; menus: PermissionMenu[] }) {
  const [assigned, setAssigned] = useState<PermissionUser[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [pick, setPick] = useState("");
  const [grid, setGrid] = useState<Record<string, MenuGrid>>(() => emptyGrid(menus));
  const [moduleFilter, setModuleFilter] = useState("");
  const [search, setSearch] = useState("");
  const [importRole, setImportRole] = useState("");
  const [notice, setNotice] = useState<Notice>(null);
  const [pending, start] = useTransition();

  const modules = useMemo(() => [...new Set(menus.map((m) => m.module))], [menus]);
  const visible = menus.filter(
    (m) =>
      (!moduleFilter || m.module === moduleFilter) &&
      (!search.trim() || `${m.label} ${m.module} ${m.note ?? ""}`.toLowerCase().includes(search.trim().toLowerCase())),
  );
  const available = users.filter((u) => !assigned.some((a) => a.id === u.id));
  const chosenIds = assigned.filter((u) => selected.has(u.id)).map((u) => u.id);
  const allChecked = assigned.length > 0 && assigned.every((u) => selected.has(u.id));

  const fail = (text: string) => setNotice({ tone: "error", text });

  /* ------------------------------------------------------------------ users */
  function addUser() {
    const user = available.find((u) => String(u.id) === pick);
    if (!user) return;
    setNotice(null);
    const first = assigned.length === 0;
    setAssigned((a) => [...a, user]);
    setSelected((s) => new Set(s).add(user.id));
    setPick("");
    // The grid starts from the first user added; adding more keeps what is on screen so one
    // grid can be applied to the whole group.
    if (first) {
      start(async () => {
        const r = await loadUserGrid(user.id);
        if (r.ok) setGrid({ ...emptyGrid(menus), ...r.grid });
        else fail(r.error);
      });
    }
  }

  function toggleUser(id: number, on: boolean) {
    setSelected((s) => {
      const n = new Set(s);
      if (on) n.add(id);
      else n.delete(id);
      return n;
    });
  }

  function removeUser(id: number) {
    setAssigned((a) => a.filter((u) => u.id !== id));
    setSelected((s) => {
      const n = new Set(s);
      n.delete(id);
      return n;
    });
  }

  /* ------------------------------------------------------------------- grid */
  function setCell(key: string, flag: MenuFlag, on: boolean) {
    const menu = menus.find((m) => m.key === key)!;
    setGrid((g) => {
      const row = { ...(g[key] ?? blank()) };
      row[flag] = on;
      // A menu you can edit but not open is unreachable, and closing it closes everything under it.
      if (on && flag !== "access" && menu.offers.access) row.access = true;
      if (!on && flag === "access") {
        row.insert = false;
        row.update = false;
        row.delete = false;
      }
      return { ...g, [key]: row };
    });
  }

  function setRow(key: string, on: boolean) {
    const menu = menus.find((m) => m.key === key)!;
    setGrid((g) => ({
      ...g,
      [key]: {
        access: on && menu.offers.access,
        insert: on && menu.offers.insert,
        update: on && menu.offers.update,
        delete: on && menu.offers.delete,
      },
    }));
  }

  function setColumn(flag: MenuFlag, on: boolean) {
    visible.filter((m) => m.offers[flag]).forEach((m) => setCell(m.key, flag, on));
  }

  const rowAll = (m: PermissionMenu) => FLAGS.every((f) => !m.offers[f.key] || grid[m.key]?.[f.key]);
  const colAll = (flag: MenuFlag) => {
    const rows = visible.filter((m) => m.offers[flag]);
    return rows.length > 0 && rows.every((m) => grid[m.key]?.[flag]);
  };

  /* ---------------------------------------------------------------- actions */
  function importFromRole() {
    if (!importRole) return;
    setNotice(null);
    start(async () => {
      const r = await loadRoleGrid(importRole);
      if (r.ok) {
        setGrid({ ...emptyGrid(menus), ...r.grid });
        setNotice({ tone: "ok", text: "Role defaults loaded. Adjust them, then press Update to save." });
      } else fail(r.error);
    });
  }

  function clearAll() {
    setAssigned([]);
    setSelected(new Set());
    setGrid(emptyGrid(menus));
    setImportRole("");
    setNotice(null);
  }

  function update() {
    setNotice(null);
    if (chosenIds.length === 0) return fail("Select at least one user.");
    if (!confirm(`Replace the menu permissions of ${chosenIds.length} user${chosenIds.length === 1 ? "" : "s"} with this grid?`)) return;
    start(async () => {
      const r = await saveGrid(chosenIds, grid);
      setNotice(r.ok ? { tone: "ok", text: r.message } : { tone: "error", text: r.error });
      if (r.ok) setAssigned((a) => a.map((u) => (chosenIds.includes(u.id) ? { ...u, custom: true } : u)));
    });
  }

  function revert() {
    setNotice(null);
    if (chosenIds.length === 0) return fail("Select at least one user.");
    if (!confirm("Put the selected users back on their role's default permissions?")) return;
    start(async () => {
      const r = await revertUsers(chosenIds);
      setNotice(r.ok ? { tone: "ok", text: r.message } : { tone: "error", text: r.error });
      if (r.ok) setAssigned((a) => a.map((u) => (chosenIds.includes(u.id) ? { ...u, custom: false } : u)));
    });
  }

  const th = "px-3 py-3 text-xs font-bold text-green text-left";
  const checkbox = "w-4 h-4 accent-green";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="rounded-2xl bg-green px-6 py-4 text-white">
          <h1 className="font-display text-xl font-semibold text-amber">User Menu Permission</h1>
          <p className="text-xs text-white/85 mt-0.5">Assign menu access directly to one or more staff accounts</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={clearAll} disabled={pending} className="rounded-lg bg-mist px-5 py-2.5 text-sm font-bold text-green hover:bg-mist-deep disabled:opacity-60">
            Clear
          </button>
          <button onClick={update} disabled={pending} className="rounded-lg bg-green px-5 py-2.5 text-sm font-bold text-white hover:bg-green-deep disabled:opacity-60">
            {pending ? "Working…" : "Update"}
          </button>
        </div>
      </div>

      {notice && (
        <p
          role={notice.tone === "error" ? "alert" : "status"}
          className={`rounded-xl px-4 py-3 text-sm font-semibold ${notice.tone === "error" ? "bg-red-50 text-red-600" : "bg-green-soft text-green"}`}
        >
          {notice.text}
        </p>
      )}

      <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,8fr)] gap-6 items-start">
        {/* ------------------------------------------------------------ users */}
        <div className="space-y-6">
          <section className="rounded-2xl border border-line bg-white p-5">
            <h2 className="text-sm font-bold text-ink">User Selection</h2>
            <label htmlFor="pick-user" className="mt-3 block text-xs font-bold text-green">User</label>
            <div className="mt-1.5 flex gap-2">
              <select id="pick-user" value={pick} onChange={(e) => setPick(e.target.value)} className={`${field} flex-1 min-w-0`}>
                <option value="">Select user…</option>
                {available.map((u) => (
                  <option key={u.id} value={u.id}>{u.name} ({u.loginId})</option>
                ))}
              </select>
              <button onClick={addUser} disabled={!pick || pending} className="shrink-0 rounded-lg bg-green px-4 text-xs font-bold text-white hover:bg-green-deep disabled:opacity-50">
                Add User
              </button>
            </div>
            {users.length === 0 && <p className="mt-3 text-xs text-ink-soft">There are no office admin or IT support accounts yet.</p>}
            <p className="mt-3 text-[11px] text-ink-soft">
              Office admin and IT support accounts only. Super admins always have full access.
            </p>
          </section>

          <section className="rounded-2xl border border-line bg-white overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4">
              <h2 className="text-sm font-bold text-ink">Assigned User Table</h2>
              <label className="flex items-center gap-2 text-xs text-ink-soft">
                <input
                  type="checkbox"
                  className={checkbox}
                  checked={allChecked}
                  disabled={assigned.length === 0}
                  onChange={(e) => setSelected(e.target.checked ? new Set(assigned.map((u) => u.id)) : new Set())}
                />
                Check All Users
              </label>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-mist">
                  <th className={th}>User Name</th>
                  <th className={th}>Name</th>
                  <th className={th}>Source</th>
                  <th className={`${th} text-right`}>Select</th>
                </tr>
              </thead>
              <tbody>
                {assigned.length === 0 && (
                  <tr><td colSpan={4} className="px-4 py-5 text-xs text-ink-soft">No users added yet.</td></tr>
                )}
                {assigned.map((u) => (
                  <tr key={u.id} className="border-t border-line">
                    <td className="px-3 py-3 font-bold text-ink">{u.loginId}</td>
                    <td className="px-3 py-3">{u.name}</td>
                    <td className="px-3 py-3 text-xs">
                      <span className={`rounded-full px-2 py-0.5 font-bold ${u.custom ? "bg-amber/15 text-amber-ink" : "bg-mist text-ink-soft"}`}>
                        {u.custom ? "Custom" : "Role default"}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <input
                        type="checkbox"
                        className={checkbox}
                        aria-label={`Select ${u.name}`}
                        checked={selected.has(u.id)}
                        onChange={(e) => toggleUser(u.id, e.target.checked)}
                      />
                      <button onClick={() => removeUser(u.id)} aria-label={`Remove ${u.name}`} className="ml-3 text-xs font-bold text-ink-soft hover:text-red-600">✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {assigned.length > 0 && (
              <div className="border-t border-line px-5 py-3">
                <button onClick={revert} disabled={pending} className="text-xs font-bold text-green-mid hover:underline disabled:opacity-60">
                  Put selected users back on role defaults
                </button>
              </div>
            )}
          </section>
        </div>

        {/* ------------------------------------------------------------- grid */}
        <section className="rounded-2xl border border-line bg-white">
          <div className="p-5">
            <h2 className="text-sm font-bold text-ink">Module &amp; Menu Permission</h2>
            <div className="mt-3 flex flex-wrap items-end gap-3">
              <label className="text-xs font-bold text-green">
                Module
                <select value={moduleFilter} onChange={(e) => setModuleFilter(e.target.value)} className={`${field} mt-1.5 block`}>
                  <option value="">All modules</option>
                  {modules.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </label>
              <div className="flex items-end gap-2">
                <label className="text-xs font-bold text-green">
                  Import Role
                  <select value={importRole} onChange={(e) => setImportRole(e.target.value)} className={`${field} mt-1.5 block`}>
                    <option value="">Select role…</option>
                    {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </label>
                <button onClick={importFromRole} disabled={!importRole || pending} className="rounded-lg bg-green px-4 py-2.5 text-xs font-bold text-white hover:bg-green-deep disabled:opacity-50">
                  Import
                </button>
              </div>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search menus…"
                aria-label="Search menus"
                className={`${field} ml-auto w-full sm:w-64`}
              />
            </div>
          </div>

          <div className="scroll-fade overflow-x-auto border-t border-line">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-mist">
                  <th className={th}>Module</th>
                  <th className={th}>Menu Name</th>
                  <th className="px-3 py-3 text-center text-xs font-bold text-green">All</th>
                  {FLAGS.map((f) => (
                    <th key={f.key} className="px-3 py-3 text-center text-xs font-bold text-green">
                      <label className="flex flex-col items-center gap-1 cursor-pointer">
                        {f.label}
                        <input
                          type="checkbox"
                          className={checkbox}
                          aria-label={`${f.label} for all shown menus`}
                          checked={colAll(f.key)}
                          onChange={(e) => setColumn(f.key, e.target.checked)}
                        />
                      </label>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-6 text-xs text-ink-soft">No menus match.</td></tr>
                )}
                {visible.map((m) => (
                  <tr key={m.key} className="border-t border-line">
                    <td className="px-3 py-3 text-xs text-ink-soft">{m.module}</td>
                    <td className="px-3 py-3">
                      <span className="font-bold text-ink">{m.label}</span>
                      {m.note && <span className="block text-[11px] text-ink-soft max-w-xs">{m.note}</span>}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <input
                        type="checkbox"
                        className={checkbox}
                        aria-label={`All permissions for ${m.label}`}
                        checked={rowAll(m)}
                        onChange={(e) => setRow(m.key, e.target.checked)}
                      />
                    </td>
                    {FLAGS.map((f) => (
                      <td key={f.key} className="px-3 py-3 text-center">
                        {m.offers[f.key] ? (
                          <input
                            type="checkbox"
                            className={checkbox}
                            aria-label={`${f.label} - ${m.label}`}
                            checked={!!grid[m.key]?.[f.key]}
                            onChange={(e) => setCell(m.key, f.key, e.target.checked)}
                          />
                        ) : (
                          <span className="text-ink-soft/50" title="This menu has no separate permission for this action" aria-label="Not applicable">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="border-t border-line px-5 py-3 text-[11px] text-ink-soft">
            A dash means the menu has no separate permission for that action. Menus with a single &ldquo;manage&rdquo;
            permission are all-or-nothing through Access.
          </p>
        </section>
      </div>
    </div>
  );
}
