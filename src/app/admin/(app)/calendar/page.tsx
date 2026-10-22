import Link from "next/link";
import { requirePermission } from "@/lib/auth";
import { academicCalendar, structure, type CalendarEvent } from "@/services";
import { ActionForm, field, label } from "@/components/admin/ActionForm";
import { createEvent, deleteEvent, updateEvent } from "./actions";

const TYPES = [
  { value: "TERM", label: "Term dates" },
  { value: "HOLIDAY", label: "Holiday" },
  { value: "EXAM", label: "Exam" },
  { value: "EVENT", label: "Event" },
  { value: "MEETING", label: "Meeting" },
];
const AUDIENCES = [
  { value: "ALL", label: "Everyone" },
  { value: "STUDENTS", label: "Students" },
  { value: "TEACHERS", label: "Teachers" },
  { value: "STAFF", label: "Staff only" },
];
const TYPE_STYLE: Record<string, string> = {
  HOLIDAY: "bg-red-50 text-red-800 border-red-200",
  EXAM: "bg-amber-50 text-amber-900 border-amber-200",
  TERM: "bg-green/10 text-green border-green/30",
  EVENT: "bg-sky-50 text-sky-900 border-sky-200",
  MEETING: "bg-mist text-ink border-line",
};

const ymd = (d: Date) => d.toISOString().slice(0, 10);
const monthLabel = (d: Date) => d.toLocaleString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });

/**
 * LMS F1: the academic calendar, a month at a time. Entries stay drafts until published; a
 * published entry shows to its audience in the portals and, for everyone with no class named,
 * on the public website.
 */
export default async function CalendarPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const session = await requirePermission("calendar:manage");
  const { month } = await searchParams;
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul" }).format(new Date());
  const [y, m] = (/^\d{4}-\d{2}$/.test(month ?? "") ? month! : today.slice(0, 7)).split("-").map(Number) as [number, number];
  const first = new Date(Date.UTC(y, m - 1, 1));
  const last = new Date(Date.UTC(y, m, 0));
  const prev = ymd(new Date(Date.UTC(y, m - 2, 1))).slice(0, 7);
  const next = ymd(new Date(Date.UTC(y, m, 1))).slice(0, 7);

  const canSeeStructure = session.permissions.includes("sections:manage");
  const [events, terms, courses] = await Promise.all([
    academicCalendar.events({ from: ymd(first), to: ymd(last) }),
    canSeeStructure ? structure.terms() : Promise.resolve([]),
    canSeeStructure ? structure.levels() : Promise.resolve([]),
  ]);
  const classes = courses.flatMap((c) => c.levels.map((l) => ({ id: l.id, name: `${c.name} - ${l.name}` })));

  const fields = (e?: CalendarEvent) => (
    <>
      <label className={`${label} sm:col-span-2`}>Title<input name="title" required defaultValue={e?.title} className={`mt-1 w-full ${field}`} /></label>
      <label className={label}>
        Type
        <select name="type" defaultValue={e?.type ?? "EVENT"} className={`mt-1 w-full ${field}`}>{TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}</select>
      </label>
      <label className={label}>
        Shown to
        <select name="audience" defaultValue={e?.audience ?? "ALL"} className={`mt-1 w-full ${field}`}>{AUDIENCES.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}</select>
      </label>
      <label className={label}>First day<input name="startDate" type="date" required defaultValue={e?.startDate.slice(0, 10) ?? ymd(first)} className={`mt-1 w-full ${field}`} /></label>
      <label className={label}>Last day<input name="endDate" type="date" defaultValue={e?.endDate.slice(0, 10)} className={`mt-1 w-full ${field}`} /></label>
      {canSeeStructure && (
        <>
          <label className={label}>
            Term
            <select name="termId" defaultValue={e?.termId ?? ""} className={`mt-1 w-full ${field}`}>
              <option value="">None</option>
              {terms.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </label>
          <label className={label}>
            Only for one class
            <select name="courseLevelId" defaultValue={e?.courseLevelId ?? ""} className={`mt-1 w-full ${field}`}>
              <option value="">Every class</option>
              {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
        </>
      )}
      <label className={`${label} sm:col-span-2`}>Details<textarea name="description" rows={2} defaultValue={e?.description ?? ""} className={`mt-1 w-full ${field}`} /></label>
      <label className="flex items-center gap-1.5 text-xs font-bold text-ink">
        <input type="checkbox" name="published" defaultChecked={e?.published ?? false} className="w-4 h-4 accent-green" /> Published
      </label>
    </>
  );

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-green">Academic Calendar</h1>
          <p className="text-xs text-ink-soft mt-1">Drafts are seen only here. Publishing an exam schedule adds its own entry.</p>
        </div>
        <nav className="flex items-center gap-2 text-sm font-bold">
          <Link href={`/admin/calendar?month=${prev}`} className="text-green-mid hover:underline">←</Link>
          <span className="text-ink w-36 text-center">{monthLabel(first)}</span>
          <Link href={`/admin/calendar?month=${next}`} className="text-green-mid hover:underline">→</Link>
        </nav>
      </div>

      <section className="bg-white rounded-2xl border border-line p-5">
        <h2 className="font-bold text-green text-sm mb-3">Add an entry</h2>
        <ActionForm action={createEvent} submit="Add" resetOnSuccess className="grid sm:grid-cols-2 gap-4 items-end">
          {fields()}
        </ActionForm>
      </section>

      <section className="bg-white rounded-2xl border border-line divide-y divide-line">
        {events.length === 0 && <p className="p-5 text-sm text-ink-soft">Nothing in {monthLabel(first)} yet.</p>}
        {events.map((e) => {
          const start = e.startDate.slice(0, 10), end = e.endDate.slice(0, 10);
          return (
            <details key={e.id} className="p-4">
              <summary className="cursor-pointer list-none flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold text-ink w-40">{start === end ? start : `${start} to ${end}`}</span>
                <span className={`text-[11px] font-bold border rounded-full px-2 py-0.5 ${TYPE_STYLE[e.type] ?? ""}`}>{TYPES.find((t) => t.value === e.type)?.label ?? e.type}</span>
                <span className="text-sm font-bold text-ink">{e.title}</span>
                {e.courseLevel && <span className="text-xs text-ink-soft">{e.courseLevel.name} only</span>}
                {!e.published && <span className="text-[11px] font-bold text-ink-soft border border-dashed border-line rounded-full px-2 py-0.5">Draft</span>}
              </summary>
              <div className="pt-4 space-y-3">
                <ActionForm action={updateEvent} submit="Save" className="grid sm:grid-cols-2 gap-4 items-end">
                  <input type="hidden" name="id" value={e.id} />
                  {fields(e)}
                </ActionForm>
                <ActionForm action={deleteEvent} submit="Delete entry" variant="danger" confirm={`Delete "${e.title}"?`}>
                  <input type="hidden" name="id" value={e.id} />
                </ActionForm>
              </div>
            </details>
          );
        })}
      </section>
    </div>
  );
}
