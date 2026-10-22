import Link from "next/link";
import { notFound } from "next/navigation";
import { requireMenu } from "@/lib/auth";
import { ApiError, teaching } from "@/services";
import type { CourseMaterial } from "@/services/types";
import { ActionForm, btnQuiet, field, label } from "@/components/admin/ActionForm";
import { TeachingTabs } from "@/components/office/TeachingTabs";
import { addDays, schoolToday } from "@/lib/school-time";
import { formatDate } from "@/lib/dates";
import { createMaterial, deleteMaterial, updateMaterial } from "../actions";

const pct = (rate: number | null) => (rate == null ? "—" : `${rate}%`);

/**
 * LMS F2: one of the teacher's sections - its students, their attendance over a period, and the
 * materials for the subjects the teacher teaches here.
 */
export default async function TeacherSectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const session = await requireMenu("office.classes");
  const flags = session.menus.find((m) => m.key === "office.classes")!.flags;
  const { id } = await params;
  const sectionId = Number(id);
  const sp = await searchParams;
  const today = schoolToday();
  const range = { from: sp.from || addDays(today, -30), to: sp.to || today };

  const sections = await teaching.sections();
  const section = sections.find((s) => s.id === sectionId);
  if (!section) notFound();
  const [roster, report, allMaterials] = await Promise.all([
    teaching.roster(sectionId),
    teaching.attendanceReport(sectionId, range).catch((e) => {
      if (e instanceof ApiError && e.status === 422) return null;
      throw e;
    }),
    teaching.materials(),
  ]);
  const materials = allMaterials.filter(
    (m) => m.sectionId === sectionId || (m.sectionId == null && m.courseLevelId === section.batch.courseLevel.id && section.subjects.some((s) => s.id === m.subject.id)),
  );
  const byStudent = new Map(report?.students.map((s) => [s.student.id, s]) ?? []);

  return (
    <div className="max-w-5xl space-y-6">
      <TeachingTabs />
      <div>
        <Link href="/office/sections" className="text-xs font-bold text-green-mid hover:underline">← My sections</Link>
        <h1 className="font-display text-2xl font-semibold text-green mt-1">
          {section.batch.courseLevel.name}, section {section.name}
        </h1>
        <p className="text-xs text-ink-soft mt-1">
          {section.batch.term.name}
          {section.isClassTeacher ? " · you are the class teacher" : ""}
          {section.subjects.length ? ` · you teach ${section.subjects.map((s) => s.name).join(", ")}` : ""}
        </p>
      </div>

      <section className="bg-white rounded-2xl border border-line p-5 space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-bold text-green text-sm">Students and attendance</h2>
            <p className="text-xs text-ink-soft mt-0.5">
              Every class of this section, {formatDate(range.from)} to {formatDate(range.to)}. Excused days (approved leave) do not count against the rate.
            </p>
          </div>
          <form className="flex flex-wrap items-end gap-2">
            <label className={label}>From<input type="date" name="from" defaultValue={range.from} max={today} className={`mt-1 block ${field}`} /></label>
            <label className={label}>To<input type="date" name="to" defaultValue={range.to} max={today} className={`mt-1 block ${field}`} /></label>
            <button className={btnQuiet}>Show</button>
          </form>
        </div>
        {report && (
          <p className="text-sm">
            <span className="font-bold text-ink">{pct(report.overall.rate)}</span>{" "}
            <span className="text-ink-soft">
              attendance over {report.days.length} {report.days.length === 1 ? "day" : "days"} · {report.overall.absent} absences · {report.overall.late} late · {report.overall.excused} excused
            </span>
          </p>
        )}
        {roster.students.length === 0 ? (
          <p className="text-sm text-ink-soft">No students placed in this section yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wide text-ink-soft border-b border-line">
                  <th className="py-2 pr-3">Roll</th><th className="py-2 pr-3">Student</th>
                  <th className="py-2 pr-3 text-right">Present</th><th className="py-2 pr-3 text-right">Late</th>
                  <th className="py-2 pr-3 text-right">Absent</th><th className="py-2 pr-3 text-right">Excused</th>
                  <th className="py-2 pr-3 text-right">Rate</th><th className="py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {roster.students.map((r) => {
                  const t = byStudent.get(r.student.id);
                  return (
                    <tr key={r.student.id}>
                      <td className="py-2 pr-3 text-ink-soft">{r.rollNo ?? "—"}</td>
                      <td className="py-2 pr-3">
                        <span className="font-bold text-ink">{r.student.name}</span>{" "}
                        <span className="text-[11px] text-ink-soft">{r.student.studentProfile?.studentId}</span>
                      </td>
                      <td className="py-2 pr-3 text-right">{t?.present ?? 0}</td>
                      <td className="py-2 pr-3 text-right">{t?.late ?? 0}</td>
                      <td className={`py-2 pr-3 text-right ${t?.absent ? "text-red-700 font-bold" : ""}`}>{t?.absent ?? 0}</td>
                      <td className="py-2 pr-3 text-right">{t?.excused ?? 0}</td>
                      <td className={`py-2 pr-3 text-right font-bold ${t?.rate != null && t.rate < 75 ? "text-red-700" : "text-ink"}`}>{pct(t?.rate ?? null)}</td>
                      <td className="py-2 text-right">
                        <Link href={`/office/students/${r.student.id}`} className="text-xs font-bold text-green-mid hover:underline">Results</Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="bg-white rounded-2xl border border-line p-5 space-y-4">
        <div>
          <h2 className="font-bold text-green text-sm">Materials</h2>
          <p className="text-xs text-ink-soft mt-0.5">
            Notes, worksheets and links for this section&apos;s students. Ones the Head Master put up for the whole class show here too; you can change only your own.
          </p>
        </div>
        <div className="divide-y divide-line">
          {materials.length === 0 && <p className="text-sm text-ink-soft py-1">Nothing put up yet.</p>}
          {materials.map((m) => (
            <MaterialRow key={m.id} m={m} sectionId={sectionId} subjects={section.subjects} mine={m.uploadedById === session.userId && m.sectionId === sectionId} flags={flags} />
          ))}
        </div>
        {flags.insert && section.subjects.length > 0 && (
          <div className="border-t border-line pt-4">
            <h3 className="text-xs font-bold text-ink mb-2">Put up a material</h3>
            <ActionForm action={createMaterial} submit="Put up" resetOnSuccess className="grid sm:grid-cols-2 gap-3 items-end">
              <MaterialFields sectionId={sectionId} subjects={section.subjects} />
            </ActionForm>
          </div>
        )}
      </section>
    </div>
  );
}

function MaterialFields({ sectionId, subjects, m }: { sectionId: number; subjects: { id: number; name: string }[]; m?: CourseMaterial }) {
  return (
    <>
      <input type="hidden" name="sectionId" value={sectionId} />
      {m?.fileUrl && <input type="hidden" name="currentFile" value={m.fileUrl} />}
      <label className={label}>
        Subject
        <select name="subjectId" required defaultValue={m?.subject.id ?? (subjects.length === 1 ? subjects[0]!.id : "")} className={`mt-1 block w-full ${field}`}>
          {subjects.length > 1 && <option value="" disabled>Choose…</option>}
          {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </label>
      <label className={label}>Title<input name="title" required minLength={2} maxLength={160} defaultValue={m?.title} className={`mt-1 block w-full ${field}`} /></label>
      <label className={`${label} sm:col-span-2`}>
        Description
        <textarea name="description" rows={2} maxLength={2000} defaultValue={m?.description ?? ""} className={`mt-1 block w-full ${field}`} />
      </label>
      <label className={label}>
        Kind
        <select name="kind" defaultValue={m?.kind ?? "LINK"} className={`mt-1 block w-full ${field}`}>
          <option value="LINK">Link</option>
          <option value="VIDEO">Video link</option>
          <option value="FILE">File (PDF or image, up to 30 MB)</option>
        </select>
      </label>
      <label className={label}>Link (for a link or video)<input name="linkUrl" type="url" placeholder="https://" defaultValue={m?.linkUrl ?? ""} className={`mt-1 block w-full ${field}`} /></label>
      <label className={label}>
        File (for a file{m?.fileUrl ? "; leave empty to keep the current one" : ""})
        <input name="file" type="file" accept="application/pdf,image/jpeg,image/png,image/webp" className="mt-1 block w-full text-xs" />
      </label>
      <div className="flex items-end gap-3">
        <label className={label}>Order<input name="displayOrder" type="number" min={0} max={9999} defaultValue={m?.displayOrder ?? 100} className={`mt-1 block w-24 ${field}`} /></label>
        <label className="flex items-center gap-1.5 text-xs font-bold text-ink pb-2">
          <input type="checkbox" name="published" defaultChecked={m?.published ?? true} className="w-4 h-4 accent-green" /> Visible to students
        </label>
      </div>
    </>
  );
}

function MaterialRow({
  m, sectionId, subjects, mine, flags,
}: {
  m: CourseMaterial; sectionId: number; subjects: { id: number; name: string }[]; mine: boolean; flags: { update: boolean };
}) {
  const href = m.kind === "FILE" ? (m.fileUrl ? `/api/files/${m.fileUrl}` : null) : m.linkUrl;
  return (
    <div className="py-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm">
            <span className="font-bold text-ink">{m.title}</span>{" "}
            <span className="text-xs text-ink-soft">
              {m.subject.name} · {m.kind === "FILE" ? "file" : m.kind === "VIDEO" ? "video" : "link"}
              {m.sectionId == null ? " · whole class" : ""}
              {!m.published ? " · hidden" : ""}
            </span>
          </p>
          {m.description && <p className="text-xs text-ink-soft mt-0.5 whitespace-pre-line">{m.description}</p>}
        </div>
        {href && <a href={href} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-green-mid hover:underline">Open</a>}
      </div>
      {mine && flags.update && (
        <details className="mt-2">
          <summary className="text-xs font-bold text-green-mid cursor-pointer">Change or remove</summary>
          <div className="mt-3 space-y-3">
            <ActionForm action={updateMaterial} submit="Save changes" className="grid sm:grid-cols-2 gap-3 items-end">
              <input type="hidden" name="materialId" value={m.id} />
              <MaterialFields sectionId={sectionId} subjects={subjects} m={m} />
            </ActionForm>
            <ActionForm action={deleteMaterial} submit="Remove" variant="danger" confirm={`Remove "${m.title}"? Students will no longer see it.`}>
              <input type="hidden" name="sectionId" value={sectionId} />
              <input type="hidden" name="materialId" value={m.id} />
            </ActionForm>
          </div>
        </details>
      )}
    </div>
  );
}
