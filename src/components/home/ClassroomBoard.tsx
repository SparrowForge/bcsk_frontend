import Link from "next/link";
import type { SchoolBoard } from "@/services/types";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { classLevelLabel } from "@/lib/constants";
import { BoardPanel } from "./SectionBar";
import { formatMinutes } from "./board-format";

/**
 * LP-3 — one card per class the school runs, live or idle.
 *
 * The API groups the timetable into rooms: a regular class is a level whose "current class"
 * is whichever of its subjects is live, a special course is its own card. An idle card shows
 * an em dash for duration and attendees rather than a zero, because nothing is running and
 * "0 attendees" would read as an empty classroom instead of a closed one.
 */
export function ClassroomBoard({ board, t }: { board: SchoolBoard; t: Dictionary }) {
  return (
    <section aria-labelledby="classroom-board" className="mt-12">
      <div className="text-center">
        <h3 id="classroom-board" className="font-display text-2xl font-semibold text-navy">
          {t.home.classroom}
        </h3>
        <p className="mt-1 text-sm font-bold text-ink-soft">
          {t.home.ongoingClass}: {board.liveCount}
        </p>
      </div>

      <div className="mt-4">
        <BoardPanel>
          {board.classes.length === 0 ? (
            <p className="py-8 text-center text-sm text-ink-soft">{t.home.boardEmpty}</p>
          ) : (
            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {board.classes.map((c) => (
                <ClassCard key={c.key} row={c} t={t} />
              ))}
            </ul>
          )}
        </BoardPanel>
      </div>

      {/* The deck puts the three help routes directly under the board — the point at which a
          parent watching a class they cannot join needs them. */}
      <div className="mt-5 flex flex-wrap items-center justify-end gap-2">
        <Link
          href="/classroom/ask-teacher"
          className="inline-flex items-center gap-2 text-sm font-bold text-navy hover:text-sky transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.4 0-8 2.5-8 5.5V22h16v-2.5c0-3-3.6-5.5-8-5.5Z" />
          </svg>
          {t.home.askTeacher}
        </Link>
        <Link
          href="/contact"
          className="rounded-md bg-sunrise hover:bg-sunrise-deep text-white text-[11px] font-bold px-3 py-1.5 transition-colors"
        >
          {t.home.adminSupport}
        </Link>
        <Link
          href="/contact?topic=IT"
          className="rounded-md bg-sunrise hover:bg-sunrise-deep text-white text-[11px] font-bold px-3 py-1.5 transition-colors"
        >
          {t.home.itSupport}
        </Link>
      </div>
    </section>
  );
}

function ClassCard({ row, t }: { row: SchoolBoard["classes"][number]; t: Dictionary }) {
  const label = row.classLevel ? classLevelLabel(row.classLevel) : row.label;
  // Special courses carry the deck's darker header so the regular ladder reads as one block.
  const headerTone = row.courseSlug ? "bg-maroon" : "bg-sunrise";
  const duration = formatMinutes(row.durationMinutes);

  return (
    <li className="rounded-xl border border-sunrise/50 bg-white overflow-hidden flex flex-col">
      <p className={`${headerTone} px-2 py-1.5 text-center text-[12px] font-extrabold text-white truncate`} title={label}>
        {label}
      </p>

      <div className="relative m-2 rounded-md bg-navy/90 aspect-[4/3] flex items-center justify-center overflow-hidden">
        {/* A drawn stand-in for the class screen. Deliberately not a photograph: no real
            child's face should appear on a card that claims to be a live feed. */}
        <svg viewBox="0 0 64 48" className="w-full h-full p-2" aria-hidden>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <g key={i} transform={`translate(${(i % 3) * 21 + 1} ${Math.floor(i / 3) * 23 + 1})`}>
              <rect width="19" height="21" rx="2" fill="#ffffff" opacity="0.14" />
              <circle cx="9.5" cy="8" r="3.6" fill="#ffffff" opacity="0.5" />
              <path d="M3 19c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6z" fill="#ffffff" opacity="0.5" />
            </g>
          ))}
        </svg>
        {row.live && (
          <span className="absolute top-1.5 right-1.5 inline-flex items-center gap-1 rounded-full bg-red-600 px-1.5 py-0.5 text-[9px] font-extrabold text-white">
            <span className="w-1 h-1 rounded-full bg-white animate-pulse" aria-hidden />
            {t.common.live}
          </span>
        )}
      </div>

      <dl className="px-2 pb-2 text-[11px] leading-snug text-ink-soft">
        <div className="flex gap-1">
          <dt>{t.home.currentClass}:</dt>
          <dd className="font-bold text-navy truncate">{row.currentCourseName ?? t.home.noClassNow}</dd>
        </div>
        <div className="flex gap-1">
          <dt>{t.home.duration}:</dt>
          <dd className="font-bold text-ink">{duration ?? "—"}</dd>
        </div>
        <div className="flex gap-1">
          <dt>{t.home.attendees}:</dt>
          <dd className="font-bold text-ink">{row.attendees ?? "—"}</dd>
        </div>
      </dl>
    </li>
  );
}
