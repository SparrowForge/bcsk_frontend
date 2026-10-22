import Link from "next/link";
import { requirePermission } from "@/lib/auth";
import { structure } from "@/services";
import { ActionForm, field, label } from "@/components/admin/ActionForm";
import { addClassToTerm, addSection, removeBatch } from "./actions";

/**
 * LMS F1: a term's classes and their sections. A class joins a term as a batch; its sections
 * divide the students. Each section opens to its students, roll numbers and teachers.
 */
export default async function SectionsPage({ searchParams }: { searchParams: Promise<{ term?: string }> }) {
  await requirePermission("sections:manage");
  const { term } = await searchParams;
  const terms = await structure.terms();
  const current = terms.find((t) => t.id === Number(term)) ?? terms.find((t) => t.isCurrent) ?? terms[0];

  if (!current) {
    return (
      <div className="max-w-3xl">
        <h1 className="font-display text-2xl font-semibold text-green mb-2">Classes &amp; Sections</h1>
        <p className="text-sm text-ink-soft">
          Add a term first on the <Link href="/admin/terms" className="text-green-mid font-bold hover:underline">Terms</Link> page.
        </p>
      </div>
    );
  }

  const [batches, courses] = await Promise.all([structure.batches(current.id), structure.levels()]);
  const inTerm = new Set(batches.map((b) => b.courseLevelId));
  const classes = courses.flatMap((c) => c.levels.map((l) => ({ id: l.id, name: `${c.name} - ${l.name}` })));

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-green">Classes &amp; Sections</h1>
          <p className="text-xs text-ink-soft mt-1">{batches.length} classes in {current.name}{current.isCurrent ? " (current term)" : ""}.</p>
        </div>
        <nav className="flex flex-wrap gap-1.5">
          {terms.map((t) => (
            <Link key={t.id} href={`/admin/sections?term=${t.id}`}
              className={`text-[11px] font-bold rounded-full px-2.5 py-1 border ${t.id === current.id ? "bg-green text-white border-green" : "border-line text-ink hover:border-green-mid"}`}>
              {t.code}
            </Link>
          ))}
        </nav>
      </div>

      <section className="bg-white rounded-2xl border border-line p-5">
        <h2 className="font-bold text-green text-sm mb-3">Add a class to this term</h2>
        <ActionForm action={addClassToTerm} submit="Add class">
          <input type="hidden" name="termId" value={current.id} />
          <label className={label}>
            Class
            <select name="courseLevelId" required defaultValue="" className={`mt-1 block ${field}`}>
              <option value="" disabled>Choose…</option>
              {classes.filter((c) => !inTerm.has(c.id)).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
        </ActionForm>
      </section>

      <div className="grid md:grid-cols-2 gap-4">
        {batches.map((b) => {
          const students = b.sections.reduce((t, s) => t + s._count.enrollments, 0);
          return (
            <section key={b.id} className="bg-white rounded-2xl border border-line p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="font-bold text-ink text-sm">{b.courseLevel.course.name} - {b.courseLevel.name}</h2>
                  <p className="text-xs text-ink-soft">{students} students in {b.sections.length} section{b.sections.length === 1 ? "" : "s"}</p>
                </div>
                {students === 0 && (
                  <ActionForm action={removeBatch} submit="Remove" variant="danger" confirm={`Remove ${b.courseLevel.name} from ${current.code}, with its empty sections?`}>
                    <input type="hidden" name="batchId" value={b.id} />
                  </ActionForm>
                )}
              </div>
              <ul className="divide-y divide-line border-y border-line">
                {b.sections.map((s) => (
                  <li key={s.id}>
                    <Link href={`/admin/sections/${s.id}`} className="flex items-center justify-between py-2 text-sm hover:text-green-mid">
                      <span className="font-bold">Section {s.name}{!s.active && <span className="text-ink-soft font-normal"> (closed)</span>}</span>
                      <span className="text-xs text-ink-soft">{s._count.enrollments}{s.capacity ? ` / ${s.capacity}` : ""} students →</span>
                    </Link>
                  </li>
                ))}
                {b.sections.length === 0 && <li className="py-2 text-xs text-ink-soft">No sections yet.</li>}
              </ul>
              <ActionForm action={addSection} submit="Add section" variant="quiet" resetOnSuccess>
                <input type="hidden" name="batchId" value={b.id} />
                <label className={label}>Name<input name="name" required placeholder="B" className={`mt-1 block w-20 ${field}`} /></label>
                <label className={label}>Capacity<input name="capacity" type="number" min={1} className={`mt-1 block w-24 ${field}`} /></label>
              </ActionForm>
            </section>
          );
        })}
      </div>
    </div>
  );
}
