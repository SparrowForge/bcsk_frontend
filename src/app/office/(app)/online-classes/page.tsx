import Link from "next/link";
import { requireMenu } from "@/lib/auth";
import { ApiError, teaching } from "@/services";
import type { OnlineClassStatus, TeacherOnlineClass } from "@/services/types";
import { ActionForm, field, label } from "@/components/admin/ActionForm";
import { TeachingTabs } from "@/components/office/TeachingTabs";
import { addDays, schoolClock, schoolDateTime, schoolToday } from "@/lib/school-time";
import { cancelOnline, endOnline, scheduleOnline, startOnline } from "./actions";

const STATUS: Record<OnlineClassStatus, { label: string; tone: string }> = {
  SCHEDULED: { label: "Scheduled", tone: "bg-mist text-ink-soft" },
  LIVE: { label: "Live", tone: "bg-red-600 text-white" },
  ENDED: { label: "Ended", tone: "bg-green-soft text-green" },
  CANCELLED: { label: "Cancelled", tone: "bg-mist text-ink-soft line-through" },
};

/**
 * LMS F2: the teacher's online meetings - schedule one for a routine class, start it (students
 * see the join button from then), end it with an optional recording link, and see who joined.
 */
export default async function OnlineClassesPage({ searchParams }: { searchParams: Promise<{ joins?: string }> }) {
  const session = await requireMenu("office.classes");
  const flags = session.menus.find((m) => m.key === "office.classes")!.flags;
  const { joins } = await searchParams;
  const today = schoolToday();
  const [classes, week, attendance] = await Promise.all([
    teaching.onlineClasses({ from: addDays(today, -14), to: addDays(today, 60) }),
    teaching.week(),
    joins ? teaching.onlineJoins(Number(joins)).catch((e) => (e instanceof ApiError && [403, 404].includes(e.status) ? null : Promise.reject(e))) : null,
  ]);
  const slots = week.filter((s) => s.active);
  const upcoming = classes.filter((c) => c.status === "SCHEDULED" || c.status === "LIVE");
  const past = classes.filter((c) => c.status === "ENDED" || c.status === "CANCELLED").reverse();

  return (
    <div className="max-w-4xl space-y-6">
      <TeachingTabs />
      <div>
        <h1 className="font-display text-2xl font-semibold text-green mb-1">Online classes</h1>
        <p className="text-sm text-ink-soft">
          Meetings for your routine classes. Students get the join link once you start the class; times are Korea time.
        </p>
      </div>

      {flags.insert && slots.length > 0 && (
        <section className="bg-white rounded-2xl border border-line p-5">
          <h2 className="font-bold text-green text-sm mb-3">Schedule a meeting</h2>
          <ActionForm action={scheduleOnline} submit="Schedule" resetOnSuccess className="grid sm:grid-cols-3 gap-3 items-end">
            <label className={`${label} sm:col-span-3`}>
              Class
              <select name="classSessionId" required defaultValue="" className={`mt-1 block w-full ${field}`}>
                <option value="" disabled>Choose a routine class…</option>
                {slots.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} · {s.dayOfWeek} {s.startTime}{s.endTime ? `–${s.endTime}` : ""}
                  </option>
                ))}
              </select>
            </label>
            <label className={label}>Date<input type="date" name="date" required min={today} defaultValue={today} className={`mt-1 block w-full ${field}`} /></label>
            <label className={label}>Starts<input type="time" name="startTime" required className={`mt-1 block w-full ${field}`} /></label>
            <label className={label}>Ends<input type="time" name="endTime" required className={`mt-1 block w-full ${field}`} /></label>
            <label className={`${label} sm:col-span-2`}>Topic (optional)<input name="topic" maxLength={200} className={`mt-1 block w-full ${field}`} /></label>
            <label className={label}>Meeting link<input name="joinUrl" type="url" placeholder="the class's Zoom link" className={`mt-1 block w-full ${field}`} /></label>
          </ActionForm>
        </section>
      )}
      {slots.length === 0 && (
        <p className="bg-white rounded-2xl border border-line p-5 text-sm text-ink-soft">
          You have no class on the routine this term, so there is nothing to schedule a meeting for.
        </p>
      )}

      <section>
        <h2 className="text-xs font-extrabold uppercase tracking-wide text-crimson-ink mb-3">Coming up</h2>
        {upcoming.length === 0 ? (
          <p className="bg-white rounded-2xl border border-line p-5 text-sm text-ink-soft">No meeting scheduled.</p>
        ) : (
          <ul className="bg-white rounded-2xl border border-line divide-y divide-line">
            {upcoming.map((c) => <MeetingRow key={c.id} c={c} canControl={flags.update} />)}
          </ul>
        )}
      </section>

      {attendance && (
        <section className="bg-white rounded-2xl border border-line p-5" id="joins">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h2 className="font-bold text-green text-sm">Who joined · {schoolDateTime(attendance.onlineClass.startsAt)}</h2>
            <Link href="/office/online-classes" className="text-xs font-bold text-green-mid hover:underline">Close</Link>
          </div>
          <p className="text-xs text-ink-soft mb-2">
            {attendance.people.filter((p) => p.joinedAt).length} of {attendance.people.filter((p) => p.role === "STUDENT").length} students joined.
            This is the join log only - attendance is still taken on the class page.
          </p>
          <ul className="divide-y divide-line text-sm">
            {attendance.people.map((p) => (
              <li key={p.id} className="py-1.5 flex justify-between gap-3">
                <span><span className="font-bold text-ink">{p.name}</span> <span className="text-[11px] text-ink-soft">{p.studentProfile?.studentId}</span></span>
                <span className={p.joinedAt ? "text-green font-bold" : "text-ink-soft"}>{p.joinedAt ? `joined ${schoolClock(p.joinedAt)}` : "did not join"}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="text-xs font-extrabold uppercase tracking-wide text-crimson-ink mb-3">Last two weeks</h2>
        {past.length === 0 ? (
          <p className="bg-white rounded-2xl border border-line p-5 text-sm text-ink-soft">Nothing yet.</p>
        ) : (
          <ul className="bg-white rounded-2xl border border-line divide-y divide-line">
            {past.map((c) => <MeetingRow key={c.id} c={c} canControl={false} />)}
          </ul>
        )}
      </section>
    </div>
  );
}

function MeetingRow({ c, canControl }: { c: TeacherOnlineClass; canControl: boolean }) {
  const s = STATUS[c.status];
  return (
    <li className="p-4 space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm">
            <span className="font-bold text-ink">{c.classSession.title}</span>
            {c.topic ? <span className="text-ink-soft"> · {c.topic}</span> : null}
          </p>
          <p className="text-xs text-ink-soft mt-0.5">
            {schoolDateTime(c.startsAt)}–{schoolClock(c.endsAt)} · {c._count.joins} joined
            {c.recordingUrl ? <> · <a href={c.recordingUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-green-mid hover:underline">recording</a></> : null}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-extrabold uppercase rounded-full px-2 py-0.5 ${s.tone}`}>{s.label}</span>
          {c.status !== "CANCELLED" && (
            <Link href={`/office/online-classes?joins=${c.id}#joins`} className="text-xs font-bold text-green-mid hover:underline">Who joined</Link>
          )}
        </div>
      </div>
      {canControl && (
        <div className="flex flex-wrap items-end gap-3">
          {c.joinUrl && <a href={c.joinUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-green-mid hover:underline pb-2">Open meeting</a>}
          {c.status === "SCHEDULED" && (
            <>
              <ActionForm action={startOnline} submit="Start class">
                <input type="hidden" name="onlineClassId" value={c.id} />
              </ActionForm>
              <ActionForm action={cancelOnline} submit="Cancel" variant="danger" confirm="Cancel this meeting? Students are told it won't happen.">
                <input type="hidden" name="onlineClassId" value={c.id} />
                <label className={label}>Reason<input name="reason" maxLength={300} className={`mt-1 block ${field}`} /></label>
              </ActionForm>
            </>
          )}
          {c.status === "LIVE" && (
            <ActionForm action={endOnline} submit="End class">
              <input type="hidden" name="onlineClassId" value={c.id} />
              <label className={label}>Recording link (optional)<input name="recordingUrl" type="url" placeholder="https://" className={`mt-1 block ${field}`} /></label>
            </ActionForm>
          )}
        </div>
      )}
    </li>
  );
}
