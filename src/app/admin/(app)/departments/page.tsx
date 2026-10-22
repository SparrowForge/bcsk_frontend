import { requirePermission } from "@/lib/auth";
import { structure } from "@/services";
import { ActionForm, field, label } from "@/components/admin/ActionForm";
import { createDepartment, deleteDepartment, setCourseDepartment, updateDepartment } from "./actions";

/** LMS F1: departments, and which courses and subjects sit under each. */
export default async function DepartmentsPage() {
  const session = await requirePermission("departments:manage");
  // The course list comes from the structure API (`sections:manage`); the change needs `courses:manage`.
  const canAssignCourses = session.permissions.includes("courses:manage") && session.permissions.includes("sections:manage");
  const [departments, courses] = await Promise.all([
    structure.departments(),
    canAssignCourses ? structure.levels() : Promise.resolve([]),
  ]);

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-green">Departments</h1>
        <p className="text-xs text-ink-soft mt-1">Group courses and subjects, for example General Education and Islamic Studies.</p>
      </div>

      <section className="bg-white rounded-2xl border border-line p-5">
        <h2 className="font-bold text-green text-sm mb-3">Add a department</h2>
        <ActionForm action={createDepartment} submit="Add" resetOnSuccess>
          <label className={label}>Name<input name="name" required className={`mt-1 block ${field}`} /></label>
          <label className={label}>Code<input name="code" required placeholder="GEN" className={`mt-1 block w-28 ${field}`} /></label>
          <label className={label}>Order<input name="displayOrder" type="number" defaultValue={100} className={`mt-1 block w-24 ${field}`} /></label>
        </ActionForm>
      </section>

      <section className="bg-white rounded-2xl border border-line divide-y divide-line">
        {departments.length === 0 && <p className="p-5 text-sm text-ink-soft">No departments yet.</p>}
        {departments.map((d) => (
          <div key={d.id} className="p-4 flex flex-wrap items-end justify-between gap-3">
            <ActionForm action={updateDepartment} submit="Save" variant="quiet">
              <input type="hidden" name="id" value={d.id} />
              <label className={label}>Name<input name="name" defaultValue={d.name} required className={`mt-1 block ${field}`} /></label>
              <label className={label}>Code<input name="code" defaultValue={d.code} required className={`mt-1 block w-28 ${field}`} /></label>
              <label className={label}>Order<input name="displayOrder" type="number" defaultValue={d.displayOrder} className={`mt-1 block w-20 ${field}`} /></label>
              <label className="flex items-center gap-1.5 text-xs font-bold text-ink pb-2">
                <input type="checkbox" name="active" defaultChecked={d.active} className="w-4 h-4 accent-green" /> Active
              </label>
            </ActionForm>
            <div className="flex items-end gap-3">
              <span className="text-xs text-ink-soft pb-2">{d._count.courses} courses · {d._count.subjects} subjects</span>
              <ActionForm action={deleteDepartment} submit="Delete" variant="danger" confirm={`Delete ${d.name}? Its courses and subjects stay, with no department.`}>
                <input type="hidden" name="id" value={d.id} />
              </ActionForm>
            </div>
          </div>
        ))}
      </section>

      {canAssignCourses && (
        <section className="bg-white rounded-2xl border border-line p-5">
          <h2 className="font-bold text-green text-sm mb-3">Courses by department</h2>
          <div className="divide-y divide-line">
            {courses.map((c) => (
              <div key={c.id} className="py-2.5 flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm font-semibold text-ink">{c.name}{!c.active && <span className="text-ink-soft font-normal"> (inactive)</span>}</span>
                <ActionForm action={setCourseDepartment} submit="Save" variant="quiet" className="flex items-center gap-2">
                  <input type="hidden" name="courseId" value={c.id} />
                  <select name="departmentId" defaultValue={c.department?.id ?? ""} className={field}>
                    <option value="">No department</option>
                    {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </ActionForm>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
