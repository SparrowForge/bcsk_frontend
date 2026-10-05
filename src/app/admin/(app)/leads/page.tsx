import Link from "next/link";
import { can, requirePermission } from "@/lib/auth";
import { leads } from "@/services";
import { STAGES } from "@/lib/leads";
import { LeadsTable } from "./LeadsTable";
import { LeadForm } from "./LeadForm";

type Search = {
  q?: string; stage?: string; sourceId?: string; assignedToUserId?: string;
  filter?: string; cursor?: string; new?: string;
};

const field = "rounded-lg border border-line bg-white px-3 py-2 text-sm focus:border-green-mid focus:outline-none";

/** CRM lead list: filters are plain GET params, so every view is linkable and needs no client state. */
export default async function LeadsPage({ searchParams }: { searchParams: Promise<Search> }) {
  const session = await requirePermission("leads:read");
  const sp = await searchParams;
  const canManage = can(session, "leads:manage");

  const [page, sources, assignees, courses] = await Promise.all([
    leads.list({
      search: sp.q,
      stage: sp.stage,
      sourceId: sp.sourceId,
      assignedToUserId: sp.assignedToUserId,
      unassigned: sp.filter === "unassigned" ? 1 : undefined,
      followUpDue: sp.filter === "due" ? 1 : undefined,
      cursor: sp.cursor,
      limit: 25,
    }),
    leads.sources(),
    leads.assignees(),
    canManage && sp.new ? leads.courses() : Promise.resolve([]),
  ]);

  // Keep the active filters when paging to older leads.
  const keep = new URLSearchParams(
    Object.entries({ q: sp.q, stage: sp.stage, sourceId: sp.sourceId, assignedToUserId: sp.assignedToUserId, filter: sp.filter })
      .filter(([, v]) => v) as [string, string][],
  );
  const olderHref = page.nextCursor ? `/admin/leads?${new URLSearchParams([...keep, ["cursor", page.nextCursor]])}` : null;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <form className="flex flex-wrap items-center gap-2" action="/admin/leads">
          <input name="q" defaultValue={sp.q} placeholder="Search name, phone, email, LD-…" aria-label="Search leads" className={`${field} w-64`} />
          <select name="stage" defaultValue={sp.stage ?? ""} aria-label="Stage" className={field}>
            <option value="">All stages</option>
            {STAGES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
          <select name="sourceId" defaultValue={sp.sourceId ?? ""} aria-label="Source" className={field}>
            <option value="">All sources</option>
            {sources.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select name="assignedToUserId" defaultValue={sp.assignedToUserId ?? ""} aria-label="Owner" className={field}>
            <option value="">Any owner</option>
            {assignees.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
          <select name="filter" defaultValue={sp.filter ?? ""} aria-label="Quick filter" className={field}>
            <option value="">No quick filter</option>
            <option value="unassigned">Unassigned</option>
            <option value="due">Follow-up overdue</option>
          </select>
          <button className="bg-green hover:bg-green-deep text-white text-xs font-bold rounded-lg px-4 py-2.5">Filter</button>
          <Link href="/admin/leads" className="text-xs font-bold text-ink-soft hover:text-green-mid">Reset</Link>
        </form>
        {canManage && (
          <Link
            href={sp.new ? "/admin/leads" : "/admin/leads?new=1"}
            className="ml-auto bg-green hover:bg-green-deep text-white text-xs font-bold rounded-lg px-4 py-2.5"
          >
            {sp.new ? "Close" : "+ New lead"}
          </Link>
        )}
      </div>

      {canManage && sp.new && (
        <div className="bg-white rounded-2xl border border-line p-6 mb-6 max-w-3xl">
          <h2 className="font-display text-lg font-semibold text-green mb-4">New lead</h2>
          <LeadForm sources={sources.filter((s) => s.active)} courses={courses} assignees={assignees} />
        </div>
      )}

      <LeadsTable leads={page.items} assignees={assignees} canManage={canManage} />

      {olderHref && (
        <div className="mt-4">
          <Link href={olderHref} className="text-sm font-bold text-green-mid hover:underline">Older leads →</Link>
        </div>
      )}
    </div>
  );
}
