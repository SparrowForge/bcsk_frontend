import { requireMenu } from "@/lib/auth";
import { learning } from "@/services";
import { StudentTabs } from "@/components/classroom/StudentTabs";
import { schoolClock, schoolDateTime } from "@/lib/school-time";
import { JoinButton } from "./JoinButton";

/** LMS F3: the student's coming online classes; Join opens 10 minutes before the start. */
export default async function StudentOnlineClassesPage() {
  await requireMenu("classroom.routine");
  const classes = await learning.onlineClasses();

  return (
    <div className="max-w-3xl">
      <StudentTabs group="routine" />
      <h1 className="font-display text-2xl font-semibold text-green mb-1">Online classes</h1>
      <p className="text-sm text-ink-soft mb-6">The Join button appears 10 minutes before a class starts. Times are Korea time.</p>
      {classes.length === 0 ? (
        <p className="bg-white rounded-2xl border border-line p-6 text-sm text-ink-soft">No online class is scheduled for you.</p>
      ) : (
        <ul className="bg-white rounded-2xl border border-line divide-y divide-line">
          {classes.map((c) => (
            <li key={c.id} className={`p-4 flex flex-wrap items-center justify-between gap-3 ${c.status === "CANCELLED" ? "opacity-60" : ""}`}>
              <div>
                <p className="text-sm">
                  <span className="font-bold text-ink">{c.classSession.subject?.name ?? c.classSession.title}</span>
                  {c.topic ? <span className="text-ink-soft"> · {c.topic}</span> : null}
                </p>
                <p className="text-xs text-ink-soft mt-0.5">
                  {schoolDateTime(c.startsAt)}–{schoolClock(c.endsAt)}
                  {c.classSession.teacher ? ` · ${c.classSession.teacher.user.name}` : ""}
                </p>
              </div>
              {c.status === "CANCELLED" ? (
                <span className="text-[10px] font-extrabold uppercase rounded-full bg-mist text-ink-soft px-2 py-0.5">Cancelled</span>
              ) : c.canJoin ? (
                <JoinButton onlineClassId={c.id} live={c.status === "LIVE"} />
              ) : (
                <span className="text-[10px] font-extrabold uppercase rounded-full bg-mist text-ink-soft px-2 py-0.5">Not open yet</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
