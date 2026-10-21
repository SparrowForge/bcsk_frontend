import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth";
import { academic, ApiError } from "@/services";
import { SUBJECT_CATEGORIES, paletteFor } from "@/lib/academic-palette";
import { ClassForm, SubjectForm, DeleteButton } from "../forms";

/** One class: its card and banner details, and the books listed on its page. */
export default async function AdminClassPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission("courses:manage");
  const { id } = await params;
  const c = await academic.adminClass(Number(id)).catch((e: unknown) => {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  });
  const subjects = c.subjects ?? [];
  const sectionLabel = (key: string) => SUBJECT_CATEGORIES.find((s) => s.key === key)?.label ?? key;

  return (
    <div className="max-w-4xl">
      <Link href="/admin/curriculum" className="text-xs font-bold text-ink-soft hover:text-green-mid">← All classes</Link>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold text-green">{c.name}</h1>
        <div className="flex items-center gap-3">
          {c.active && (
            <Link href={`/academic/classes/${c.slug}`} target="_blank" className="text-xs font-bold text-green-mid hover:underline">
              View on website ↗
            </Link>
          )}
          <DeleteButton kind="class" id={c.id} classId={c.id} name={c.name} />
        </div>
      </div>

      <div className="mt-6">
        <ClassForm c={c} />
      </div>

      <h2 className="mt-10 font-display text-lg font-semibold text-green">Books ({subjects.length})</h2>
      <p className="mt-1 text-sm text-ink-soft">Lower order numbers show first. Each book appears under its section on the class page.</p>
      <ul className="mt-4 space-y-3">
        {subjects.map((s) => (
          <li key={s.id} className="rounded-2xl border border-line bg-white">
            <details>
              <summary className="flex cursor-pointer flex-wrap items-center gap-3 px-5 py-3.5 text-sm">
                <span aria-hidden className="h-3 w-3 rounded-full" style={{ background: paletteFor(s.color).base }} />
                <span className="font-bold text-ink">{s.title}</span>
                <span className="text-xs text-ink-soft">{sectionLabel(s.category)} · order {s.displayOrder}</span>
                <span className="ml-auto text-xs font-bold text-green-mid">Edit</span>
              </summary>
              <div className="border-t border-line px-5 py-5">
                <SubjectForm classId={c.id} s={s} />
                <div className="mt-4 border-t border-line pt-4">
                  <DeleteButton kind="subject" id={s.id} classId={c.id} name={s.title} />
                </div>
              </div>
            </details>
          </li>
        ))}
      </ul>

      <h2 className="mt-10 mb-3 font-display text-lg font-semibold text-green">Add a book</h2>
      <div className="rounded-2xl border border-line bg-white p-6">
        <SubjectForm classId={c.id} />
      </div>
    </div>
  );
}
