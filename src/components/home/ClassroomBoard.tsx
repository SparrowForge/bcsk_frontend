import Link from "next/link";
import type { SchoolBoard } from "@/services/types";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { classLevelLabel } from "@/lib/constants";
import { reveal } from "@/lib/motion";
import { BoardPanel } from "./SectionBar";
import { ClassScreen } from "./ClassScreen";
import { formatMinutes } from "./board-format";

/**
 * LP-3 — one card per class the school runs, live or idle.
 *
 * The API groups the timetable into rooms: a regular class is a level whose "current class"
 * is whichever of its subjects is live, a special course is its own card. An idle card
 * shows an em dash for duration and attendees rather than a zero, because nothing is
 * running and "0 attendees" would read as an empty classroom instead of a closed one.
 */
export function ClassroomBoard({ board, t }: { board: SchoolBoard; t: Dictionary }) {
  return (
    <section aria-labelledby="classroom-board" className="mt-10">
      <div {...reveal()} className="text-center">
        <h3 id="classroom-board" className="font-display text-xl font-semibold text-navy">
          {t.home.classroom}
        </h3>
        <p className="mt-0.5 text-[13px] font-bold text-ink-soft">
          {t.home.ongoingClass}: {board.liveCount}
        </p>
      </div>

      <div className="mt-3">
        <BoardPanel>
          {board.classes.length === 0 ? (
            <p className="py-8 text-center text-sm text-ink-soft">{t.home.boardEmpty}</p>
          ) : (
            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {board.classes.map((c, i) => (
                <ClassCard key={c.key} row={c} index={i} t={t} />
              ))}
            </ul>
          )}
        </BoardPanel>
      </div>

      {/* The deck puts the three help routes directly under the board — the point at which a
          parent watching a class they cannot join needs them. */}
      <div {...reveal("right")} className="mt-4 flex flex-col items-end gap-1.5">
        <Link
          href="/classroom/ask-teacher"
          className="group inline-flex items-center gap-1.5 text-[13px] font-bold text-navy hover:text-sky transition-colors"
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="transition-transform duration-200 group-hover:scale-110 motion-reduce:transform-none"
            aria-hidden
          >
            <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.4 0-8 2.5-8 5.5V22h16v-2.5c0-3-3.6-5.5-8-5.5Z" />
          </svg>
          {t.home.askTeacher}
        </Link>
        <span className="flex gap-1.5">
          <Link
            href="/contact"
            className="press rounded bg-sunrise hover:bg-sunrise-deep text-white text-[9px] font-bold px-2 py-1"
          >
            {t.home.adminSupport}
          </Link>
          <Link
            href="/contact?topic=IT"
            className="press rounded bg-sunrise hover:bg-sunrise-deep text-white text-[9px] font-bold px-2 py-1"
          >
            {t.home.itSupport}
          </Link>
        </span>
      </div>
    </section>
  );
}

function ClassCard({
  row,
  index,
  t,
}: {
  row: SchoolBoard["classes"][number];
  /** Position in the row, so the classes deal in from the left rather than all at once. */
  index: number;
  t: Dictionary;
}) {
  const label = row.classLevel ? classLevelLabel(row.classLevel) : row.label;
  // Special courses carry the deck's darker header so the regular ladder reads as one block.
  const headerTone = row.courseSlug ? "bg-maroon" : "bg-sunrise";

  return (
    <li
      {...reveal("zoom", index, 60)}
      className="hover-lift rounded-lg border border-sunrise/50 hover:border-sunrise bg-white overflow-hidden flex flex-col"
    >
      <p className={`${headerTone} px-2 py-1 text-center text-[11px] font-extrabold text-white truncate`} title={label}>
        {label}
      </p>

      <ClassScreen live={row.live} liveLabel={t.common.live} />

      <dl className="px-2 py-2 text-[10.5px] leading-tight text-ink-soft">
        <div className="flex gap-1">
          <dt>{t.home.currentClass}:</dt>
          <dd className="font-bold text-navy truncate">{row.currentCourseName ?? "—"}</dd>
        </div>
        <div className="flex gap-1">
          <dt>{t.home.duration}:</dt>
          <dd className="font-bold text-ink">{formatMinutes(row.durationMinutes) ?? "—"}</dd>
        </div>
        <div className="flex gap-1">
          <dt>{t.home.attendees}:</dt>
          <dd className="font-bold text-ink">{row.attendees ?? "—"}</dd>
        </div>
      </dl>
    </li>
  );
}
