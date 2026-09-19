import type { SchoolBoard } from "@/services/types";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { classLevelLabel } from "@/lib/constants";
import { BoardPanel } from "./SectionBar";
import { returnLabel } from "./board-format";

/**
 * LP-2 — who is at their desk right now.
 *
 * Every value is state a teacher set about themselves: `DESK` / `OFFLINE` from their own
 * dashboard, and `IN_CLASS`, which the API derives from a class they actually started.
 * Nothing here is guessed from the timetable, so an empty board means nobody has signed in
 * yet rather than that the widget is broken — which is what `boardEmpty` says instead of
 * rendering a grid of placeholder people.
 */
export function OfficeBoard({ board, t }: { board: SchoolBoard; t: Dictionary }) {
  return (
    <section aria-labelledby="office-board" className="mt-8">
      <div className="text-center">
        <h3 id="office-board" className="font-display text-2xl font-semibold text-navy inline-flex items-center gap-2">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-sunrise" aria-hidden>
            <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-5h6v5" />
          </svg>
          {t.home.office}
        </h3>
        <p className="mt-1 text-sm font-bold text-ink-soft">
          {t.home.availableTeacher}: {board.availableTeachers} · {t.home.inClass}: {board.inClassTeachers}
        </p>
      </div>

      <div className="mt-4">
        <BoardPanel>
          {board.desks.length === 0 ? (
            <p className="py-8 text-center text-sm text-ink-soft">{t.home.boardEmpty}</p>
          ) : (
            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-3">
              {board.desks.map((d) => (
                <DeskCard key={d.id} desk={d} t={t} />
              ))}
            </ul>
          )}
        </BoardPanel>
      </div>
    </section>
  );
}

function DeskCard({ desk, t }: { desk: SchoolBoard["desks"][number]; t: Dictionary }) {
  const inClass = desk.status === "IN_CLASS";
  // A desk card reports one of three things, and the status line is the only place the
  // distinction lives: the class they are teaching, "Desk", or "Offline".
  const statusText = inClass
    ? desk.classLabel
      ? classLevelLabel(desk.classLabel)
      : t.home.inClass
    : desk.status === "DESK"
      ? t.home.deskDesk
      : t.home.deskOffline;

  return (
    <li className="rounded-xl border border-sunrise/50 bg-white overflow-hidden flex flex-col">
      <div className="bg-peach px-2 py-1 text-center">
        <span className="text-[10px] font-extrabold uppercase tracking-wide text-sunrise-deep">
          {t.home.deskDesk}
        </span>
      </div>
      <div className="px-2 pt-2 text-center">
        <p className="font-bold text-[13px] text-navy leading-tight truncate" title={desk.deskName}>
          {desk.deskName}
        </p>
      </div>
      <div className="relative mx-auto mt-2">
        {desk.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={desk.photoUrl}
            alt={desk.teacherName}
            className="w-12 h-12 rounded-full object-cover border border-line"
          />
        ) : (
          <span
            className="w-12 h-12 rounded-full bg-sky-soft text-navy flex items-center justify-center"
            aria-hidden
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.4 0-8 2.5-8 5.5V22h16v-2.5c0-3-3.6-5.5-8-5.5Z" />
            </svg>
          </span>
        )}
        {/* The live dot is the same signal the classroom board shows, from the same flag. */}
        {inClass && (
          <span
            className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-red-600 ring-2 ring-white animate-pulse"
            aria-hidden
          />
        )}
      </div>
      <div className="px-2 py-2 mt-1 text-center text-[11px] leading-snug">
        <p className="text-ink-soft">
          {t.common.status}:{" "}
          <span className={`font-bold ${inClass ? "text-red-600" : desk.status === "DESK" ? "text-teal" : "text-ink-soft"}`}>
            {statusText}
          </span>
        </p>
        <p className="text-ink-soft">
          {t.home.deskReturn}:{" "}
          <span className="font-bold text-ink">{returnLabel(desk.status, desk.returnInMinutes, t)}</span>
        </p>
        <p className="sr-only">{desk.teacherName}</p>
      </div>
    </li>
  );
}
