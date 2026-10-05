import { requirePermission } from "@/lib/auth";
import { leads } from "@/services";
import { STAGES, lostReasonLabel } from "@/lib/leads";

const field = "rounded-lg border border-line bg-white px-3 py-2 text-sm focus:border-green-mid focus:outline-none";

/** Funnel, source performance and loss reasons, optionally for one course and date range. */
export default async function CrmReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ courseId?: string; from?: string; to?: string }>;
}) {
  await requirePermission("leads:read");
  const sp = await searchParams;
  const [f, courses] = await Promise.all([
    leads.funnel({
      courseId: sp.courseId,
      from: sp.from ? new Date(`${sp.from}T00:00:00+09:00`).toISOString() : undefined,
      // Inclusive of the chosen end day.
      to: sp.to ? new Date(`${sp.to}T23:59:59+09:00`).toISOString() : undefined,
    }),
    leads.courses(),
  ]);

  const max = Math.max(1, ...f.byStage.map((s) => s.count));
  const tile = "bg-white rounded-2xl border border-line p-5";

  return (
    <div className="space-y-8 max-w-4xl">
      <form className="flex flex-wrap items-end gap-3" action="/admin/leads/reports">
        <label className="text-xs font-bold text-ink">
          Course
          <select name="courseId" defaultValue={sp.courseId ?? ""} className={`mt-1 block ${field}`}>
            <option value="">All courses</option>
            {courses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>
        <label className="text-xs font-bold text-ink">
          From
          <input type="date" name="from" defaultValue={sp.from} className={`mt-1 block ${field}`} />
        </label>
        <label className="text-xs font-bold text-ink">
          To
          <input type="date" name="to" defaultValue={sp.to} className={`mt-1 block ${field}`} />
        </label>
        <button className="bg-green hover:bg-green-deep text-white text-xs font-bold rounded-lg px-4 py-2.5">Apply</button>
      </form>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className={tile}><p className="text-xs text-ink-soft">Total leads</p><p className="text-2xl font-bold text-green">{f.total}</p></div>
        <div className={tile}><p className="text-xs text-ink-soft">Open</p><p className="text-2xl font-bold text-green">{f.open}</p></div>
        <div className={tile}><p className="text-xs text-ink-soft">Converted</p><p className="text-2xl font-bold text-green">{f.enrolled}</p></div>
        <div className={tile}><p className="text-xs text-ink-soft">Conversion rate</p><p className="text-2xl font-bold text-green">{f.conversionRate}%</p></div>
      </div>

      <section className={tile}>
        <h2 className="font-display text-base font-semibold text-green mb-4">Funnel</h2>
        <ul className="space-y-2.5">
          {f.byStage.map((s) => {
            const meta = STAGES.find((x) => x.key === s.stage)!;
            return (
              <li key={s.stage} className="flex items-center gap-3 text-sm">
                <span className="w-24 shrink-0 font-bold text-ink">{meta.label}</span>
                <div className="flex-1 h-5 rounded bg-mist overflow-hidden" role="img" aria-label={`${meta.label}: ${s.count}`}>
                  <div className="h-full bg-green-mid" style={{ width: `${(s.count / max) * 100}%` }} />
                </div>
                <span className="w-10 text-right tabular-nums text-ink-soft">{s.count}</span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className={tile}>
        <h2 className="font-display text-base font-semibold text-green mb-4">By source</h2>
        <div className="scroll-fade overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-green"><th className="py-2 pr-4 font-bold">Source</th><th className="py-2 pr-4 font-bold">Leads</th><th className="py-2 pr-4 font-bold">Converted</th><th className="py-2 font-bold">Rate</th></tr>
            </thead>
            <tbody>
              {f.bySource.length === 0 && <tr><td colSpan={4} className="py-3 text-ink-soft">No data.</td></tr>}
              {f.bySource.map((s) => (
                <tr key={s.sourceId ?? "none"} className="border-t border-line">
                  <td className="py-2.5 pr-4 font-bold text-ink">{s.sourceName}</td>
                  <td className="py-2.5 pr-4 tabular-nums">{s.count}</td>
                  <td className="py-2.5 pr-4 tabular-nums">{s.enrolled}</td>
                  <td className="py-2.5 tabular-nums">{s.count ? Math.round((s.enrolled / s.count) * 1000) / 10 : 0}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={tile}>
        <h2 className="font-display text-base font-semibold text-green mb-4">Why leads were lost</h2>
        {f.lostReasons.length === 0 ? (
          <p className="text-sm text-ink-soft">No lost leads in this range.</p>
        ) : (
          <ul className="space-y-1.5 text-sm">
            {f.lostReasons.map((r) => (
              <li key={r.reason} className="flex justify-between border-b border-line py-1.5">
                <span>{lostReasonLabel(r.reason)}</span><span className="tabular-nums font-bold">{r.count}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
