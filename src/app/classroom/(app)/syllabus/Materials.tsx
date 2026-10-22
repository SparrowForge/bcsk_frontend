import type { CourseMaterial } from "@/services/types";

const KIND = { FILE: "File", LINK: "Link", VIDEO: "Video" } as const;

/**
 * LMS F3: course materials for the student's sections - notes, worksheets, links and videos their
 * teachers and the Head Master put up - grouped by subject.
 */
export function Materials({ materials }: { materials: CourseMaterial[] }) {
  if (materials.length === 0) return null;
  const subjects = [...new Map(materials.map((m) => [m.subject.id, m.subject.name])).entries()];
  return (
    <section className="mb-8 space-y-4">
      <h2 className="font-display text-lg font-semibold text-ink">Class materials</h2>
      {subjects.map(([subjectId, name]) => (
        <div key={subjectId} className="bg-white rounded-2xl border border-line p-5">
          <h3 className="font-bold text-green text-sm mb-2">{name}</h3>
          <ul className="divide-y divide-line">
            {materials.filter((m) => m.subject.id === subjectId).map((m) => {
              const href = m.kind === "FILE" ? (m.fileUrl ? `/api/files/${m.fileUrl}` : null) : m.linkUrl;
              return (
                <li key={m.id} className="py-2 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-ink">{m.title}</p>
                    {m.description && <p className="text-xs text-ink-soft mt-0.5 whitespace-pre-line">{m.description}</p>}
                  </div>
                  {href && (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-green-mid hover:underline">
                      Open {KIND[m.kind].toLowerCase()} →
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </section>
  );
}
