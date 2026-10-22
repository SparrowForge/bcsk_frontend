import { requirePermission } from "@/lib/auth";
import { structure } from "@/services";
import { ActionForm, field, label } from "@/components/admin/ActionForm";
import { createTerm, deleteTerm, setCurrentTerm, updateTerm } from "./actions";

const day = (iso: string | null) => (iso ? iso.slice(0, 10) : "");

/** LMS F1: the terms (semesters). Exactly one is current: new admissions are placed into it. */
export default async function TermsPage() {
  await requirePermission("sections:manage");
  const terms = await structure.terms();

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-green">Terms</h1>
        <p className="text-xs text-ink-soft mt-1">
          The current term is where new admissions are placed and what the portals show. A term&apos;s code cannot change once it has classes.
        </p>
      </div>

      <section className="bg-white rounded-2xl border border-line p-5">
        <h2 className="font-bold text-green text-sm mb-3">Add a term</h2>
        <ActionForm action={createTerm} submit="Add" resetOnSuccess>
          <label className={label}>Code<input name="code" required placeholder="2027-1" className={`mt-1 block w-28 ${field}`} /></label>
          <label className={label}>Name<input name="name" required placeholder="Spring 2027" className={`mt-1 block ${field}`} /></label>
          <label className={label}>Starts<input name="startDate" type="date" className={`mt-1 block ${field}`} /></label>
          <label className={label}>Ends<input name="endDate" type="date" className={`mt-1 block ${field}`} /></label>
        </ActionForm>
      </section>

      <section className="bg-white rounded-2xl border border-line divide-y divide-line">
        {terms.length === 0 && <p className="p-5 text-sm text-ink-soft">No terms yet.</p>}
        {terms.map((t) => (
          <div key={t.id} className={`p-4 space-y-3 ${t.isCurrent ? "bg-green/5" : ""}`}>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-bold text-ink">{t.name}</span>
              {t.isCurrent && <span className="text-[11px] font-bold text-white bg-green rounded-full px-2 py-0.5">Current</span>}
              <span className="text-xs text-ink-soft">{t._count.batches} classes</span>
            </div>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <ActionForm action={updateTerm} submit="Save" variant="quiet">
                <input type="hidden" name="id" value={t.id} />
                <label className={label}>Code<input name="code" defaultValue={t.code} required className={`mt-1 block w-28 ${field}`} /></label>
                <label className={label}>Name<input name="name" defaultValue={t.name} required className={`mt-1 block ${field}`} /></label>
                <label className={label}>Starts<input name="startDate" type="date" defaultValue={day(t.startDate)} className={`mt-1 block ${field}`} /></label>
                <label className={label}>Ends<input name="endDate" type="date" defaultValue={day(t.endDate)} className={`mt-1 block ${field}`} /></label>
              </ActionForm>
              <div className="flex items-end gap-2">
                {!t.isCurrent && (
                  <ActionForm action={setCurrentTerm} submit="Make current" variant="quiet" confirm={`Make ${t.name} the current term? New admissions will be placed into it.`}>
                    <input type="hidden" name="id" value={t.id} />
                  </ActionForm>
                )}
                {t._count.batches === 0 && (
                  <ActionForm action={deleteTerm} submit="Delete" variant="danger" confirm={`Delete ${t.name}?`}>
                    <input type="hidden" name="id" value={t.id} />
                  </ActionForm>
                )}
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
