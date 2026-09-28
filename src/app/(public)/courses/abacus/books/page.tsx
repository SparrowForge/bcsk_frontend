import Link from "next/link";
import type { Metadata } from "next";
import { site } from "@/services";

export const metadata: Metadata = { title: "Books" };

function BookCover({ level, kind }: { level: string; kind: "Student Book" | "Work Book" }) {
  return (
    <div className="relative aspect-[3/4] rounded-r-xl rounded-l-sm bg-green shadow-[4px_6px_14px_rgba(0,0,0,0.18)] overflow-hidden">
      {/* spine */}
      <span className="absolute inset-y-0 left-0 w-2.5 bg-green-deep" aria-hidden />
      {/* beads motif */}
      <div className="absolute top-4 inset-x-5 flex justify-center gap-1.5" aria-hidden>
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className="flex flex-col gap-1 items-center">
            <span className="w-3 h-2 rounded-full bg-[#e2261b]" />
            <span className="w-3 h-0.5 bg-white/60" />
            {Array.from({ length: (i % 4) + 1 }).map((_, j) => (
              <span key={j} className="w-3 h-2 rounded-full bg-[#e2261b]" />
            ))}
          </span>
        ))}
      </div>
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-abacus px-3 py-3 text-center">
        <p className="text-[13px] font-extrabold text-ink leading-tight">Abacus {level.replace("Level ", "Level - ")}</p>
        <p className="text-xs font-bold text-ink leading-tight">{kind}</p>
      </div>
      <p className="absolute bottom-3 inset-x-0 text-center text-[10px] font-extrabold tracking-[0.2em] text-white/80">BCSK</p>
    </div>
  );
}

/** FR-ABC-04: a Student Book and a Work Book per level — downloads for enrolled students only. */
export default async function AbacusBooksPage() {
  const [course, slugs] = await Promise.all([site.course("abacus"), site.enrolledCourseSlugs()]);
  const enrolled = slugs.includes("abacus");
  const books = (course?.levels ?? []).flatMap((l) => [
    { id: `${l.id}-s`, level: l.name, kind: "Student Book" as const, url: l.studentBookUrl },
    { id: `${l.id}-w`, level: l.name, kind: "Work Book" as const, url: l.workBookUrl },
  ]);

  return (
    <section className="mx-auto max-w-7xl px-4 mt-12">
      <div className="text-center mb-8">
        <h2 className="inline-block bg-abacus text-ink font-display text-2xl sm:text-3xl font-semibold rounded-lg px-5 py-1.5">
          Book
        </h2>
        <p className="mt-3 text-sm text-ink-soft max-w-2xl mx-auto">
          BCSK’s own Abacus books: a Student Book for the lessons and a Work Book for practice, at every level.{" "}
          {enrolled ? (
            "Download yours below."
          ) : (
            <>
              Enrolled students can download the PDFs —{" "}
              <Link href="/classroom" className="font-bold text-green-mid hover:underline">log in</Link> to get yours.
            </>
          )}
        </p>
      </div>

      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8 max-w-4xl mx-auto">
        {books.map((b) => (
          <li key={b.id} className="flex flex-col">
            <BookCover level={b.level} kind={b.kind} />
            <div className="mt-3 text-center text-xs">
              {b.url && enrolled ? (
                <a
                  href={`/api/files/${b.url}`}
                  className="inline-block bg-green hover:bg-green-deep text-white font-bold rounded-lg px-3.5 py-2 transition-colors"
                  aria-label={`Download ${b.level} ${b.kind} (PDF)`}
                >
                  Download PDF
                </a>
              ) : b.url ? (
                <span className="text-ink-soft">Enrolled students only</span>
              ) : (
                <span className="text-ink-soft">In preparation</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
