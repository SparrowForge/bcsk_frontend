import Link from "next/link";
import { forbidden } from "next/navigation";
import { requirePermission } from "@/lib/auth";
import { routine, structure } from "@/services";
import { ActionForm } from "@/components/admin/ActionForm";
import { AddSlotForm, DAYS, EditSlotForm } from "./SlotForms";
import { removeSlot } from "./actions";

/**
 * LMS F1: the class routine, one section's week at a time. Each slot is a subject taught to
 * the section by an assigned teacher; the API refuses a slot that puts a teacher, a section or a
 * room in two places at once.
 */
export default async function RoutinePage({ searchParams }: { searchParams: Promise<{ term?: string; section?: string }> }) {
  const session = await requirePermission("scheduling:manage");
  // Sections and their teachers come from the structure API.
  if (!session.permissions.includes("sections:manage")) forbidden();
  const { term, section } = await searchParams;
  const terms = await structure.terms();
  const current = terms.find((t) => t.id === Number(term)) ?? terms.find((t) => t.isCurrent) ?? terms[0];
  const batches = current ? await structure.batches(current.id) : [];
  const sections = batches.flatMap((b) => b.sections.map((s) => ({ id: s.id, name: `${b.courseLevel.name} ${s.name}`, course: b.courseLevel.course.name })));
  const sectionId = Number(section) || sections[0]?.id;

  const [detail, slots] = sectionId
    ? await Promise.all([structure.section(sectionId), routine.slots({ termId: current?.id, sectionId })])
    : [null, []];
  const assignments = (detail?.assignments ?? []).map((a) => ({ subjectId: a.subject.id, teacherProfileId: a.teacher.id, teacherName: a.teacher.user.name }));
  const subjects = (detail?.curriculum ?? []).map((c) => ({ id: c.subjectId, name: c.subject.name }));
  const href = (q: Record<string, number | undefined>) =>
    `/admin/routine?${new URLSearchParams(Object.entries(q).filter(([, v]) => v).map(([k, v]) => [k, String(v)])).toString()}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-green">Class Routine</h1>
          <p className="text-xs text-ink-soft mt-1">
            {current ? `${current.name}.` : "Add a term first."} Teachers are those assigned to the subject on the section&apos;s page.
          </p>
        </div>
        <nav className="flex flex-wrap gap-1.5">
          {terms.map((t) => (
            <Link key={t.id} href={href({ term: t.id })}
              className={`text-[11px] font-bold rounded-full px-2.5 py-1 border ${t.id === current?.id ? "bg-green text-white border-green" : "border-line text-ink hover:border-green-mid"}`}>
              {t.code}
            </Link>
          ))}
        </nav>
      </div>

      {sections.length === 0 ? (
        <p className="text-sm text-ink-soft">
          No sections in this term yet. Set them up on <Link href="/admin/sections" className="text-green-mid font-bold hover:underline">Classes &amp; Sections</Link>.
        </p>
      ) : (
        <>
          <nav className="flex flex-wrap gap-1.5">
            {sections.map((s) => (
              <Link key={s.id} href={href({ term: current?.id, section: s.id })} title={s.course}
                className={`text-xs font-bold rounded-lg px-3 py-1.5 border ${s.id === sectionId ? "bg-green/10 text-green border-green" : "border-line text-ink hover:border-green-mid"}`}>
                {s.name}
              </Link>
            ))}
          </nav>

          {detail && (
            <section className="bg-white rounded-2xl border border-line p-5">
              <h2 className="font-bold text-green text-sm mb-3">Add a class to this section&apos;s week</h2>
              {subjects.length === 0 ? (
                <p className="text-sm text-ink-soft">This class studies no subjects yet. Add them on the Subjects page.</p>
              ) : (
                <AddSlotForm sectionId={detail.id} subjects={subjects} assignments={assignments} />
              )}
            </section>
          )}

          <div className="scroll-fade overflow-x-auto">
            <div className="grid grid-cols-7 gap-3 min-w-[980px]">
              {DAYS.map((day) => (
                <div key={day} className="bg-white rounded-2xl border border-line p-3 min-h-40">
                  <h3 className="text-xs font-bold text-green mb-2">{day}</h3>
                  <div className="space-y-2">
                    {slots.filter((s) => s.dayOfWeek === day).map((s) => (
                      <details key={s.id} className="rounded-lg border border-line bg-mist/40 p-2 text-xs">
                        <summary className="cursor-pointer list-none">
                          <span className="block font-bold text-ink">{s.startTime}-{s.endTime ?? ""}</span>
                          <span className="block text-ink">{s.subject?.name ?? s.title}</span>
                          <span className="block text-ink-soft">{s.teacher?.user.name ?? "No teacher"}{s.room ? ` · ${s.room}` : ""}</span>
                        </summary>
                        <EditSlotForm slot={s} assignments={assignments} />
                        <div className="pt-2">
                          <ActionForm action={removeSlot} submit="Remove from routine" variant="danger" confirm="Take this class off the routine? Its attendance and assignments stay.">
                            <input type="hidden" name="slotId" value={s.id} />
                          </ActionForm>
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
