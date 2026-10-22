import Link from "next/link";
import { requireMenu } from "@/lib/auth";
import { teaching } from "@/services";
import { TeachingTabs } from "@/components/office/TeachingTabs";

/** LMS F2: the sections this teacher teaches or leads this term. */
export default async function MySectionsPage() {
  await requireMenu("office.classes");
  const sections = await teaching.sections();

  return (
    <div className="max-w-4xl">
      <TeachingTabs />
      <h1 className="font-display text-2xl font-semibold text-green mb-1">My sections</h1>
      <p className="text-sm text-ink-soft mb-6">
        Each section&apos;s students, attendance over a period, and the materials you put up for it.
      </p>

      {sections.length === 0 ? (
        <p className="bg-white rounded-2xl border border-line p-6 text-sm text-ink-soft">
          You don&apos;t teach a section this term yet. The Head Master assigns subjects to teachers on each section&apos;s page.
        </p>
      ) : (
        <ul className="grid sm:grid-cols-2 gap-4">
          {sections.map((s) => (
            <li key={s.id}>
              <Link href={`/office/sections/${s.id}`} className="group block bg-white rounded-2xl border border-line p-5 hover:border-green-mid transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-bold text-green group-hover:text-green-mid">
                    {s.batch.courseLevel.name}, section {s.name}
                  </h2>
                  {s.isClassTeacher && (
                    <span className="shrink-0 text-[10px] font-extrabold uppercase rounded-full bg-green-soft text-green px-2 py-0.5">Class teacher</span>
                  )}
                </div>
                <p className="text-xs text-ink-soft mt-1">
                  {s.batch.term.name} · {s._count.enrollments} {s._count.enrollments === 1 ? "student" : "students"}
                  {s.room ? ` · ${s.room}` : ""}
                </p>
                <p className="text-sm text-ink mt-3">
                  {s.subjects.length > 0 ? s.subjects.map((x) => x.name).join(", ") : "No subject of yours here"}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
