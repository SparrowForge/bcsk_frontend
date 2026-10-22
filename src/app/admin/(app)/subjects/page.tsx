import Link from "next/link";
import { requirePermission } from "@/lib/auth";
import { structure } from "@/services";
import { ActionForm, field, label } from "@/components/admin/ActionForm";
import { createSubject, deleteSubject, removeCurriculum, setCurriculum, updateSubject } from "./actions";

/**
 * LMS F1: the subjects of the institute, and what each class studies - with the full and pass
 * marks its exams use. A subject must be in a class's list before a teacher can be assigned it.
 */
export default async function SubjectsPage({ searchParams }: { searchParams: Promise<{ level?: string }> }) {
  const session = await requirePermission("subjects:manage");
  const canPickClass = session.permissions.includes("sections:manage");
  const { level } = await searchParams;
  const [subjects, departments, courses] = await Promise.all([
    structure.subjects(),
    session.permissions.includes("departments:manage") ? structure.departments() : Promise.resolve([]),
    canPickClass ? structure.levels() : Promise.resolve([]),
  ]);
  const classes = courses.flatMap((c) => c.levels.map((l) => ({ id: l.id, name: `${c.name} - ${l.name}` })));
  const levelId = Number(level) || classes[0]?.id;
  const curriculum = levelId ? await structure.curriculum(levelId) : [];
  const studied = new Set(curriculum.map((c) => c.subjectId));

  const departmentSelect = (value: number | null) => (
    <label className={label}>
      Department
      <select name="departmentId" defaultValue={value ?? ""} className={`mt-1 block ${field}`}>
        <option value="">None</option>
        {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
      </select>
    </label>
  );

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-green">Subjects</h1>
        <p className="text-xs text-ink-soft mt-1">A subject in use cannot be deleted; switch it off instead.</p>
      </div>

      <section className="bg-white rounded-2xl border border-line p-5">
        <h2 className="font-bold text-green text-sm mb-3">Add a subject</h2>
        <ActionForm action={createSubject} submit="Add" resetOnSuccess>
          <label className={label}>Code<input name="code" required placeholder="BAN" className={`mt-1 block w-28 ${field}`} /></label>
          <label className={label}>Name<input name="name" required className={`mt-1 block ${field}`} /></label>
          <label className={label}>
            Type
            <select name="type" className={`mt-1 block ${field}`}><option value="THEORY">Theory</option><option value="PRACTICAL">Practical</option></select>
          </label>
          {departments.length > 0 && departmentSelect(null)}
        </ActionForm>
      </section>

      <section className="bg-white rounded-2xl border border-line divide-y divide-line">
        {subjects.map((s) => (
          <div key={s.id} className="p-4 flex flex-wrap items-end justify-between gap-3">
            <ActionForm action={updateSubject} submit="Save" variant="quiet">
              <input type="hidden" name="id" value={s.id} />
              <label className={label}>Code<input name="code" defaultValue={s.code} required className={`mt-1 block w-32 ${field}`} /></label>
              <label className={label}>Name<input name="name" defaultValue={s.name} required className={`mt-1 block ${field}`} /></label>
              <label className={label}>
                Type
                <select name="type" defaultValue={s.type} className={`mt-1 block ${field}`}><option value="THEORY">Theory</option><option value="PRACTICAL">Practical</option></select>
              </label>
              {departments.length > 0 ? departmentSelect(s.departmentId) : <input type="hidden" name="departmentId" value={s.departmentId ?? ""} />}
              <label className="flex items-center gap-1.5 text-xs font-bold text-ink pb-2">
                <input type="checkbox" name="active" defaultChecked={s.active} className="w-4 h-4 accent-green" /> Active
              </label>
            </ActionForm>
            <div className="flex items-end gap-3">
              <span className="text-xs text-ink-soft pb-2">{s._count.curriculum} classes · {s._count.assignments} teachers</span>
              {s._count.curriculum + s._count.assignments === 0 && (
                <ActionForm action={deleteSubject} submit="Delete" variant="danger" confirm={`Delete ${s.name}?`}>
                  <input type="hidden" name="id" value={s.id} />
                </ActionForm>
              )}
            </div>
          </div>
        ))}
      </section>

      {canPickClass && (
        <section className="bg-white rounded-2xl border border-line p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-bold text-green text-sm">What each class studies</h2>
            <nav className="flex flex-wrap gap-1.5">
              {classes.map((c) => (
                <Link key={c.id} href={`/admin/subjects?level=${c.id}`}
                  className={`text-[11px] font-bold rounded-full px-2.5 py-1 border ${c.id === levelId ? "bg-green text-white border-green" : "border-line text-ink hover:border-green-mid"}`}>
                  {c.name}
                </Link>
              ))}
            </nav>
          </div>

          {levelId && (
            <>
              <div className="divide-y divide-line">
                {curriculum.length === 0 && <p className="text-sm text-ink-soft py-2">No subjects in this class yet.</p>}
                {curriculum.map((c) => (
                  <div key={c.id} className="py-2.5 flex flex-wrap items-end justify-between gap-3">
                    <ActionForm action={setCurriculum} submit="Save" variant="quiet">
                      <input type="hidden" name="levelId" value={levelId} />
                      <input type="hidden" name="subjectId" value={c.subjectId} />
                      <span className="text-sm font-bold text-ink w-48 pb-2">{c.subject.name}</span>
                      <label className={label}>Full marks<input name="fullMarks" type="number" min={1} defaultValue={c.fullMarks} className={`mt-1 block w-24 ${field}`} /></label>
                      <label className={label}>Pass marks<input name="passMarks" type="number" min={0} defaultValue={c.passMarks} className={`mt-1 block w-24 ${field}`} /></label>
                      <label className={label}>Order<input name="displayOrder" type="number" defaultValue={c.displayOrder} className={`mt-1 block w-20 ${field}`} /></label>
                      <label className="flex items-center gap-1.5 text-xs font-bold text-ink pb-2">
                        <input type="checkbox" name="isOptional" defaultChecked={c.isOptional} className="w-4 h-4 accent-green" /> Optional
                      </label>
                    </ActionForm>
                    <ActionForm action={removeCurriculum} submit="Remove" variant="danger" confirm={`Remove ${c.subject.name} from this class?`}>
                      <input type="hidden" name="levelId" value={levelId} />
                      <input type="hidden" name="subjectId" value={c.subjectId} />
                    </ActionForm>
                  </div>
                ))}
              </div>
              <ActionForm action={setCurriculum} submit="Add to class" resetOnSuccess>
                <input type="hidden" name="levelId" value={levelId} />
                <label className={label}>
                  Subject
                  <select name="subjectId" required defaultValue="" className={`mt-1 block ${field}`}>
                    <option value="" disabled>Choose…</option>
                    {subjects.filter((s) => s.active && !studied.has(s.id)).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </label>
                <label className={label}>Full marks<input name="fullMarks" type="number" min={1} defaultValue={100} className={`mt-1 block w-24 ${field}`} /></label>
                <label className={label}>Pass marks<input name="passMarks" type="number" min={0} defaultValue={33} className={`mt-1 block w-24 ${field}`} /></label>
                <label className="flex items-center gap-1.5 text-xs font-bold text-ink pb-2">
                  <input type="checkbox" name="isOptional" className="w-4 h-4 accent-green" /> Optional
                </label>
              </ActionForm>
            </>
          )}
        </section>
      )}
    </div>
  );
}
