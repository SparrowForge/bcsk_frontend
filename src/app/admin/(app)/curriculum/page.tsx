import Link from "next/link";
import { requirePermission } from "@/lib/auth";
import { academic } from "@/services";
import { paletteFor } from "@/lib/academic-palette";
import { ClassForm } from "./forms";

/** The general classes shown under Academic on the public site. */
export default async function AdminCurriculumPage() {
  await requirePermission("courses:manage");
  const classes = await academic.adminClasses();

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-2xl font-semibold text-green">General Classes</h1>
      <p className="mt-1 text-sm text-ink-soft">
        The class cards on{" "}
        <Link href="/academic/classes" target="_blank" className="font-bold text-green-mid hover:underline">All General Classes</Link>{" "}
        and each class&apos;s page of books.
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-white">
        {classes.length === 0 && <p className="px-5 py-4 text-sm text-ink-soft">No classes yet. Add the first one below.</p>}
        <ul className="divide-y divide-line">
          {classes.map((c) => (
            <li key={c.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5 text-sm">
              <span aria-hidden className="h-3 w-3 rounded-full" style={{ background: paletteFor(c.color).base }} />
              <Link href={`/admin/curriculum/${c.id}`} className="font-bold text-ink hover:text-green-mid">{c.name}</Link>
              <span className="text-xs text-ink-soft">/{c.slug}</span>
              <span className="text-xs text-ink-soft">{c._count.subjects} books</span>
              {!c.active && <span className="rounded-full bg-mist px-2.5 py-0.5 text-[11px] font-bold text-ink-soft">Hidden</span>}
              <Link href={`/admin/curriculum/${c.id}`} className="ml-auto text-xs font-bold text-green-mid hover:underline">Edit →</Link>
            </li>
          ))}
        </ul>
      </div>

      <h2 className="mt-10 mb-3 font-display text-lg font-semibold text-green">Add a class</h2>
      <ClassForm />
    </div>
  );
}
