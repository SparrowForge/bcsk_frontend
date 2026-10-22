import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth";
import { ApiError, structure } from "@/services";
import { ActionForm, field, label } from "@/components/admin/ActionForm";
import {
  assignTeacher, deleteSection, numberRolls, placeStudent, unassignTeacher, updatePlacement, updateSection,
} from "../actions";

const STATUSES = ["ACTIVE", "COMPLETED", "TRANSFERRED", "LEFT"];

/** LMS F1: one section - its details, its students and roll numbers, and who teaches what. */
export default async function SectionPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requirePermission("sections:manage");
  const { id } = await params;
  const sectionId = Number(id);
  const section = await structure.section(sectionId).catch((e) => {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  });
  const canSeeStaff = session.permissions.includes("staff:read");
  const canSeeStudents = session.permissions.includes("students:read");
  const [terms, courses, teachers, unplaced] = await Promise.all([
    structure.terms(),
    structure.levels(),
    canSeeStaff ? structure.teachers() : Promise.resolve([]),
    canSeeStudents ? structure.students({ unplacedInTermId: section.batch.termId }) : Promise.resolve([]),
  ]);
  const term = terms.find((t) => t.id === section.batch.termId);
  const course = courses.find((c) => c.levels.some((l) => l.id === section.batch.courseLevelId));
  const className = `${course?.name ?? ""} - ${course?.levels.find((l) => l.id === section.batch.courseLevelId)?.name ?? ""}`;
  const active = section.students.filter((s) => s.status === "ACTIVE");

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <Link href={`/admin/sections?term=${section.batch.termId}`} className="text-xs font-bold text-green-mid hover:underline">← {term?.name ?? "Classes & Sections"}</Link>
        <h1 className="font-display text-2xl font-semibold text-green mt-1">{className}, section {section.name}</h1>
        <p className="text-xs text-ink-soft mt-1">
          {active.length} students{section.capacity ? ` of ${section.capacity}` : ""}. Subjects come from the class&apos;s list on the{" "}
          <Link href={`/admin/subjects?level=${section.batch.courseLevelId}`} className="text-green-mid font-bold hover:underline">Subjects</Link> page.
        </p>
      </div>

      <section className="bg-white rounded-2xl border border-line p-5">
        <h2 className="font-bold text-green text-sm mb-3">Section details</h2>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <ActionForm action={updateSection} submit="Save">
            <input type="hidden" name="sectionId" value={section.id} />
            <label className={label}>Name<input name="name" defaultValue={section.name} required className={`mt-1 block w-20 ${field}`} /></label>
            <label className={label}>Capacity<input name="capacity" type="number" min={1} defaultValue={section.capacity ?? ""} className={`mt-1 block w-24 ${field}`} /></label>
            <label className={label}>Room<input name="room" defaultValue={section.room ?? ""} placeholder="Online" className={`mt-1 block w-32 ${field}`} /></label>
            {canSeeStaff ? (
              <label className={label}>
                Class teacher
                <select name="classTeacherId" defaultValue={section.classTeacherId ?? ""} className={`mt-1 block ${field}`}>
                  <option value="">None</option>
                  {teachers.map((t) => <option key={t.id} value={t.id}>{t.user.name}</option>)}
                </select>
              </label>
            ) : (
              <input type="hidden" name="classTeacherId" value={section.classTeacherId ?? ""} />
            )}
            <label className="flex items-center gap-1.5 text-xs font-bold text-ink pb-2">
              <input type="checkbox" name="active" defaultChecked={section.active} className="w-4 h-4 accent-green" /> Open
            </label>
          </ActionForm>
          {section.students.length === 0 && (
            <ActionForm action={deleteSection} submit="Delete section" variant="danger" confirm={`Delete section ${section.name}?`}>
              <input type="hidden" name="sectionId" value={section.id} />
            </ActionForm>
          )}
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-line p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-bold text-green text-sm">Teachers</h2>
          <span className="text-xs text-ink-soft">The class teacher reviews leave; subject teachers take attendance and enter marks.</span>
        </div>
        <div className="divide-y divide-line">
          {section.assignments.length === 0 && <p className="text-sm text-ink-soft py-1">No teacher assigned yet.</p>}
          {section.assignments.map((a) => (
            <div key={a.id} className="py-2 flex items-center justify-between gap-3">
              <span className="text-sm"><span className="font-bold text-ink">{a.subject.name}</span> <span className="text-ink-soft">- {a.teacher.user.name}</span></span>
              <ActionForm action={unassignTeacher} submit="Remove" variant="danger" confirm={`Stop ${a.teacher.user.name} teaching ${a.subject.name} here?`}>
                <input type="hidden" name="sectionId" value={section.id} />
                <input type="hidden" name="assignmentId" value={a.id} />
              </ActionForm>
            </div>
          ))}
        </div>
        {canSeeStaff && (
          <ActionForm action={assignTeacher} submit="Assign" resetOnSuccess>
            <input type="hidden" name="sectionId" value={section.id} />
            <label className={label}>
              Subject
              <select name="subjectId" required defaultValue="" className={`mt-1 block ${field}`}>
                <option value="" disabled>Choose…</option>
                {section.curriculum.map((c) => <option key={c.subjectId} value={c.subjectId}>{c.subject.name}</option>)}
              </select>
            </label>
            <label className={label}>
              Teacher
              <select name="teacherProfileId" required defaultValue="" className={`mt-1 block ${field}`}>
                <option value="" disabled>Choose…</option>
                {teachers.map((t) => <option key={t.id} value={t.id}>{t.user.name}</option>)}
              </select>
            </label>
          </ActionForm>
        )}
      </section>

      <section className="bg-white rounded-2xl border border-line p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-bold text-green text-sm">Students</h2>
          {active.length > 0 && (
            <ActionForm action={numberRolls} submit="Number rolls by name" variant="quiet" confirm="Renumber every active student 1, 2, 3… by name?">
              <input type="hidden" name="sectionId" value={section.id} />
            </ActionForm>
          )}
        </div>
        <div className="divide-y divide-line">
          {section.students.length === 0 && <p className="text-sm text-ink-soft py-1">No students placed yet.</p>}
          {section.students.map((s) => (
            <div key={s.id} className={`py-2 flex flex-wrap items-end justify-between gap-3 ${s.status !== "ACTIVE" ? "opacity-60" : ""}`}>
              <span className="text-sm pb-2">
                <span className="font-bold text-ink">{s.student.name}</span>{" "}
                <span className="text-ink-soft text-xs">{s.student.studentProfile?.studentId}</span>
              </span>
              <ActionForm action={updatePlacement} submit="Save" variant="quiet">
                <input type="hidden" name="sectionId" value={section.id} />
                <input type="hidden" name="placementId" value={s.id} />
                <label className={label}>Roll<input name="rollNo" type="number" min={1} defaultValue={s.rollNo ?? ""} className={`mt-1 block w-20 ${field}`} /></label>
                <label className={label}>
                  Status
                  <select name="status" defaultValue={s.status} className={`mt-1 block ${field}`}>
                    {STATUSES.map((x) => <option key={x} value={x}>{x.charAt(0) + x.slice(1).toLowerCase()}</option>)}
                  </select>
                </label>
              </ActionForm>
            </div>
          ))}
        </div>
        {canSeeStudents && (
          <ActionForm action={placeStudent} submit="Place student" resetOnSuccess>
            <input type="hidden" name="sectionId" value={section.id} />
            <label className={label}>
              Student not yet in a class this term ({unplaced.length})
              <select name="studentUserId" required defaultValue="" className={`mt-1 block ${field}`}>
                <option value="" disabled>Choose…</option>
                {unplaced.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.loginId})</option>)}
              </select>
            </label>
            <label className={label}>Roll<input name="rollNo" type="number" min={1} placeholder="next" className={`mt-1 block w-20 ${field}`} /></label>
          </ActionForm>
        )}
      </section>
    </div>
  );
}
