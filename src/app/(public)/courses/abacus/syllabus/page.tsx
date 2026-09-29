import Link from "next/link";
import type { Metadata } from "next";
import { site } from "@/services";

export const metadata: Metadata = {
  title: "Syllabus",
  description: "The BCSK Abacus syllabus, level by level. Each level takes about one semester and ends with an assessment.",
};

/** FR-ABC-03: Level 0 to Level 7, each opening to its syllabus. */
export default async function AbacusSyllabusPage() {
  const course = await site.course("abacus");
  const levels = course?.levels ?? [];
  const classesPerLevel = new Map<number, number>();
  for (const s of course?.sessions ?? []) {
    if (s.courseLevelId) classesPerLevel.set(s.courseLevelId, (classesPerLevel.get(s.courseLevelId) ?? 0) + 1);
  }

  return (
    <section className="mx-auto max-w-7xl px-4 mt-12">
      <div className="text-center mb-8">
        <h2 className="inline-block bg-abacus text-ink font-display text-2xl sm:text-3xl font-semibold rounded-lg px-5 py-1.5">
          Syllabus
        </h2>
        <p className="mt-3 text-sm text-ink-soft max-w-2xl mx-auto">
          {levels.length} levels. Each takes about one semester and ends with a level assessment before the student
          moves up. Open a level to see what it covers.
        </p>
      </div>

      {levels.length === 0 ? (
        <p className="text-center text-sm text-ink-soft">The syllabus is being prepared.</p>
      ) : (
        <ol className="grid md:grid-cols-2 gap-x-8 gap-y-3 max-w-5xl mx-auto">
          {levels.map((l, i) => {
            const classes = classesPerLevel.get(l.id) ?? 0;
            return (
              <li key={l.id}>
                <details className="group bg-white border border-line open:border-abacus rounded-2xl">
                  <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden px-5 py-4 flex items-center gap-3">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      className="shrink-0 text-ink group-open:rotate-90 transition-transform"
                      aria-hidden
                    >
                      <path d="M5 3l16 9-16 9V3z" fill="currentColor" />
                    </svg>
                    <span className="font-bold text-ink">{l.name}</span>
                    <span className="ml-auto text-xs font-bold text-green-mid">
                      {i === 0 ? "Start here" : i === levels.length - 1 ? "Graduation" : ""}
                    </span>
                  </summary>
                  <div className="px-5 pb-5 pl-[52px]">
                    <p className="text-sm text-ink-soft leading-relaxed">{l.syllabus ?? "Syllabus in preparation."}</p>
                    <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold">
                      <Link href="/courses/abacus/books" className="bg-abacus-soft text-ink rounded-full px-3 py-1.5 hover:bg-abacus transition-colors">
                        📚 Student &amp; Work Book
                      </Link>
                      {classes > 0 && (
                        <Link href="/courses/abacus/online-class" className="bg-green-soft text-green rounded-full px-3 py-1.5 hover:bg-green-band transition-colors">
                          🎥 {classes} online {classes === 1 ? "class" : "classes"}
                        </Link>
                      )}
                    </div>
                  </div>
                </details>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
