import Link from "next/link";
import { requirePermission } from "@/lib/auth";
import { leads } from "@/services";
import { formatDateTime, humanize, stageLabel, stageTone } from "@/lib/leads";

/** Everything overdue: leads whose follow-up date has passed, and planned activities not yet done. */
export default async function FollowUpsPage({ searchParams }: { searchParams: Promise<{ mine?: string }> }) {
  await requirePermission("leads:read");
  const mine = (await searchParams).mine === "1";
  const [due, activities] = await Promise.all([leads.dueFollowUps(mine), leads.dueActivities(mine)]);

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex gap-2 text-xs font-bold">
        <Link href="/admin/leads/follow-ups" className={`rounded-full px-3 py-1.5 ${!mine ? "bg-green text-white" : "bg-mist text-ink-soft"}`}>Everyone</Link>
        <Link href="/admin/leads/follow-ups?mine=1" className={`rounded-full px-3 py-1.5 ${mine ? "bg-green text-white" : "bg-mist text-ink-soft"}`}>Mine</Link>
      </div>

      <section>
        <h2 className="font-display text-lg font-semibold text-green mb-3">Leads to contact ({due.length})</h2>
        <div className="space-y-3">
          {due.length === 0 && <p className="bg-white rounded-2xl border border-line p-5 text-sm text-ink-soft">Nothing overdue.</p>}
          {due.map((l) => (
            <Link key={l.id} href={`/admin/leads/${l.id}`} className="block bg-white rounded-2xl border border-line p-4 hover:border-green-mid transition-colors">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-ink">{l.name}</span>
                <span className={`text-[11px] font-bold rounded-full px-2.5 py-1 ${stageTone(l.stage)}`}>{stageLabel(l.stage)}</span>
                <span className="ml-auto text-xs font-bold text-red-600">Due {formatDateTime(l.nextFollowUpAt)}</span>
              </div>
              <p className="text-xs text-ink-soft mt-1">
                {l.phone ?? l.email ?? "No contact"} · {l.course?.name ?? "No course"} · {l.assignedTo?.name ?? "Unassigned"}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-lg font-semibold text-green mb-3">Planned activities due ({activities.length})</h2>
        <div className="space-y-3">
          {activities.length === 0 && <p className="bg-white rounded-2xl border border-line p-5 text-sm text-ink-soft">Nothing planned and overdue.</p>}
          {activities.map((a) => (
            <Link key={a.id} href={`/admin/leads/${a.lead.id}`} className="block bg-white rounded-2xl border border-line p-4 hover:border-green-mid transition-colors">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase bg-mist rounded-full px-2 py-0.5">{humanize(a.type)}</span>
                <span className="font-bold text-ink text-sm">{a.subject}</span>
                <span className="ml-auto text-xs font-bold text-red-600">{formatDateTime(a.scheduledAt)}</span>
              </div>
              <p className="text-xs text-ink-soft mt-1">{a.lead.name} · {a.lead.leadNo}{a.lead.phone ? ` · ${a.lead.phone}` : ""}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
