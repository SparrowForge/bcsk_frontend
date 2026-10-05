import { can, requirePermission } from "@/lib/auth";
import { leads } from "@/services";
import { SourceForm } from "./SourceForm";

/** Where leads come from. Sources flagged public appear on the website enquiry form. */
export default async function SourcesPage() {
  const session = await requirePermission("leads:read");
  const canManage = can(session, "leads:manage");
  const sources = await leads.sources();

  return (
    <div className="max-w-3xl space-y-4">
      {canManage && (
        <div className="bg-white rounded-2xl border border-line p-5">
          <h2 className="font-display text-base font-semibold text-green mb-3">Add a source</h2>
          <SourceForm canManage />
        </div>
      )}
      {sources.length === 0 && <p className="bg-white rounded-2xl border border-line p-5 text-sm text-ink-soft">No sources yet.</p>}
      {sources.map((s) => (
        <div key={s.id} className={`bg-white rounded-2xl border border-line p-5 ${s.active ? "" : "opacity-70"}`}>
          <p className="text-xs text-ink-soft mb-3">
            {s._count.leads} lead{s._count.leads === 1 ? "" : "s"}
            {s.isPublic && " · public"}
            {!s.active && " · inactive"}
          </p>
          {canManage ? <SourceForm source={s} canManage /> : <p className="font-bold text-ink">{s.name}</p>}
        </div>
      ))}
    </div>
  );
}
