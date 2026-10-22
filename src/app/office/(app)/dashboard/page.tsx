import { formatDate } from "@/lib/dates";
import Link from "next/link";
import { requireTeacher } from "@/lib/auth";
import { office, site, teaching } from "@/services";
import { schoolToday, weekdayOf } from "@/lib/school-time";
import { getDict } from "@/lib/i18n";
import { OfficeBoard } from "@/components/home/OfficeBoard";
import { SEMESTER_CURRENT, classLevelLabel } from "@/lib/constants";
import { DeskStatusCard } from "./DeskStatusCard";

/** FR-TCH-02/05: teacher profile, assigned classes grid, notifications panel. */
export default async function TeacherDashboard() {
  const session = await requireTeacher();
  // A teacher without the "My Classes" menu still sees their timetable here, but not a link into a
  // page that would refuse them.
  const canManage = session.menus.some((m) => m.key === "office.classes");
  const [{ profile, sessions, notifications, openQuestions }, board, { t }, desk] = await Promise.all([
    office.dashboard(),
    // The office board left the homepage in October 2026: who is at their desk and who is
    // teaching is for staff, so it lives here. A failed read drops the board, not the page.
    site.schoolBoard().catch(() => null),
    getDict(),
    // LMS F2: today's routine and what is waiting on the teacher. A failed read drops the card.
    canManage ? teachingDesk().catch(() => null) : Promise.resolve(null),
  ]);

  return (
    <div className="space-y-8">
      <section className="bg-white rounded-3xl border border-line p-6 sm:p-8 flex flex-wrap items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-green flex items-center justify-center text-3xl font-display font-semibold text-white">
          {session.name.split(" ").slice(-1)[0][0]}
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold text-green">{session.name}</h1>
          <p className="text-sm text-ink-soft mt-1">
            <span className="font-bold text-ink">{profile?.teacherId}</span>
            {profile?.designation ? ` · ${profile.designation}` : ""}
            {profile?.guideClass ? ` · Guide teacher: ${classLevelLabel(profile.guideClass)}` : ""}
          </p>
        </div>
        <div className="ml-auto text-right">
          <p className="font-display text-3xl font-semibold text-crimson-ink">{openQuestions}</p>
          <p className="text-xs font-bold text-ink-soft uppercase">Questions waiting</p>
        </div>
      </section>

      {board && (
        <div className="-mt-6">
          <OfficeBoard board={board} t={t} animate={false} />
        </div>
      )}

      {desk && (
        <section className="bg-white rounded-3xl border border-line p-6 grid sm:grid-cols-[1fr_auto] gap-6">
          <div>
            <h2 className="font-display text-lg font-semibold text-green">Today · {desk.weekday}</h2>
            {desk.today.length === 0 ? (
              <p className="text-sm text-ink-soft mt-2">No class on your routine today.</p>
            ) : (
              <ul className="mt-2 divide-y divide-line">
                {desk.today.map((c) => (
                  <li key={c.id}>
                    <Link href={`/office/classes/${c.id}`} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-2 hover:text-green-mid">
                      <span className="font-mono text-sm tabular-nums w-24">{c.startTime}{c.endTime ? `–${c.endTime}` : ""}</span>
                      <span className="font-bold text-ink flex-1">{c.title}</span>
                      {c.room && <span className="text-xs text-ink-soft">{c.room}</span>}
                      <span className="text-xs font-bold text-crimson-ink">Attendance →</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex sm:flex-col gap-3">
            <Link href="/office/exams" className="rounded-2xl border border-line px-4 py-3 hover:border-green-mid min-w-36">
              <p className="font-display text-2xl font-semibold text-crimson-ink">{desk.sheetsToDo}</p>
              <p className="text-[11px] font-bold text-ink-soft uppercase">Mark sheets to finish</p>
            </Link>
            <Link href="/office/leave" className="rounded-2xl border border-line px-4 py-3 hover:border-green-mid min-w-36">
              <p className="font-display text-2xl font-semibold text-crimson-ink">{desk.leaveWaiting}</p>
              <p className="text-[11px] font-bold text-ink-soft uppercase">Leave to review</p>
            </Link>
          </div>
        </section>
      )}

      <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
        <section>
          <h2 className="font-display text-xl font-semibold text-ink mb-4">My Classes — Semester {SEMESTER_CURRENT}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {sessions.map((s) => {
              const body = (
              <>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-green group-hover:text-green-mid transition-colors leading-snug">{s.title}</h3>
                  {s.isLive && (
                    <span className="shrink-0 inline-flex items-center gap-1.5 bg-red-600 text-white text-[10px] font-extrabold rounded-full px-2.5 py-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" aria-hidden />
                      LIVE
                    </span>
                  )}
                </div>
                <p className="mt-1.5 text-xs text-ink-soft">
                  {s.dayOfWeek} · {s.startTime}{s.endTime ? `–${s.endTime}` : ""} · {s._count.enrollments} {s._count.enrollments === 1 ? "student" : "students"}
                </p>
                {canManage && (
                  <span className="inline-block mt-3 text-crimson-ink text-xs font-bold uppercase tracking-wide">
                    Manage class →
                  </span>
                )}
              </>
              );
              return canManage ? (
                <Link
                  key={s.id}
                  href={`/office/classes/${s.id}`}
                  className="group bg-white rounded-2xl border border-line p-5 hover:shadow-md transition-shadow"
                >
                  {body}
                </Link>
              ) : (
                <div key={s.id} className="group bg-white rounded-2xl border border-line p-5">
                  {body}
                </div>
              );
            })}
            {sessions.length === 0 && (
              <p className="bg-white rounded-2xl border border-line p-6 text-sm text-ink-soft sm:col-span-2">
                No classes assigned yet — the admin assigns classes from the Scheduling module.
              </p>
            )}
          </div>
        </section>

        <aside className="space-y-6">
          {profile && (
            <DeskStatusCard
              status={profile.deskStatus}
              returnAt={profile.returnAt}
              deskName={profile.deskName}
            />
          )}

          <div className="bg-white rounded-2xl border border-line p-5">
            <h2 className="font-display text-lg font-semibold text-green">Notifications</h2>
            <ul className="mt-3 space-y-3">
              {notifications.length === 0 && <li className="text-sm text-ink-soft">Nothing new.</li>}
              {notifications.map((n) => (
                <li key={n.id} className="border-l-2 border-green-mid pl-3">
                  {n.link ? (
                    <Link href={n.link} className="text-sm font-bold text-ink hover:text-green-mid leading-snug">{n.title}</Link>
                  ) : (
                    <p className="text-sm font-bold text-ink leading-snug">{n.title}</p>
                  )}
                  {n.body && <p className="text-xs text-ink-soft mt-0.5">{n.body}</p>}
                  <time className="text-[10px] text-ink-soft">
                    {formatDate(n.createdAt)}
                  </time>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

/** Today's classes from the routine, mark sheets of papers already sat, and leave waiting. */
async function teachingDesk() {
  const day = schoolToday();
  const weekday = weekdayOf(day);
  const [week, papers, leave] = await Promise.all([teaching.week(), teaching.papers(), teaching.leave("PENDING")]);
  return {
    weekday,
    today: week.filter((s) => s.active && s.dayOfWeek === weekday),
    sheetsToDo: papers
      .filter((p) => p.date.slice(0, 10) <= day)
      .reduce((n, p) => n + p.sections.filter((s) => s.status === "NOT_STARTED" || s.status === "DRAFT").length, 0),
    leaveWaiting: leave.length,
  };
}
