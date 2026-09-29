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
        <h3 id="classroom-board" className="font-display text-xl font-semibold text-green">
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
            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
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
          className="group inline-flex items-center gap-1.5 text-[13px] font-bold text-green hover:text-green-mid transition-colors"
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
            className="press rounded bg-crimson hover:bg-crimson-deep text-white text-xs font-bold px-3 py-1.5"
          >
            {t.home.adminSupport}
          </Link>
          <Link
            href="/contact?topic=IT"
            className="press rounded bg-crimson hover:bg-crimson-deep text-white text-xs font-bold px-3 py-1.5"
          >
            {t.home.itSupport}
          </Link>
        </span>
      </div>
    </section>
  );
}

/**
 * One colour per card, cycled: a board of ten identical green cards reads as a table, and a
 * distinct tint is what lets a parent find "their" class again at a glance. Each pairs a pale
 * card with a solid badge of the same hue; every badge holds white text at AA (4.5:1+). The
 * laptop takes the hue too — `frame` is the -800 shade, `screen` the -600 — written as hex
 * because they are SVG fills, not classes. The class names are written out in full because
 * Tailwind only generates the ones it finds literally.
 */
const TONES = [
  { card: "bg-emerald-50 border-emerald-200/70", badge: "bg-green", title: "text-green", frame: "#0b5540", screen: "#12795c" },
  { card: "bg-rose-50 border-rose-200/70", badge: "bg-red-600", title: "text-red-800", frame: "#991b1b", screen: "#dc2626" },
  { card: "bg-teal-50 border-teal-200/70", badge: "bg-teal-700", title: "text-teal-800", frame: "#115e59", screen: "#0d9488" },
  { card: "bg-violet-50 border-violet-200/70", badge: "bg-violet-600", title: "text-violet-800", frame: "#5b21b6", screen: "#7c3aed" },
  { card: "bg-amber-50 border-amber-200/80", badge: "bg-amber-700", title: "text-amber-800", frame: "#92400e", screen: "#d97706" },
  { card: "bg-sky-50 border-sky-200/70", badge: "bg-sky-700", title: "text-sky-800", frame: "#075985", screen: "#0284c7" },
  { card: "bg-pink-50 border-pink-200/70", badge: "bg-pink-700", title: "text-pink-800", frame: "#9d174d", screen: "#db2777" },
  { card: "bg-lime-50 border-lime-200/80", badge: "bg-lime-800", title: "text-lime-900", frame: "#3f6212", screen: "#65a30d" },
];

function ClassCard({
  row,
  index,
  t,
}: {
  row: SchoolBoard["classes"][number];
  /** Position on the board: picks the colour, numbers the badge, and staggers the entrance. */
  index: number;
  t: Dictionary;
}) {
  const label = row.classLevel ? classLevelLabel(row.classLevel) : row.label;
  const tone = TONES[index % TONES.length];

  return (
    <li
      {...reveal("zoom", index, 60)}
      className={`hover-lift rounded-2xl border ${tone.card} p-3 flex flex-col`}
    >
      <div className="flex items-center gap-2">
        <span
          aria-hidden
          className={`${tone.badge} grid h-9 w-9 shrink-0 place-items-center rounded-xl text-[13px] font-extrabold text-white tabular-nums shadow-[0_8px_14px_-10px_rgba(0,0,0,0.6)]`}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <p className={`min-w-0 truncate text-[13px] font-extrabold ${tone.title}`} title={label}>
          {label}
        </p>
      </div>

      <div className="mt-2.5 -mx-1.5">
        <ClassScreen live={row.live} liveLabel={t.common.live} frame={tone.frame} screen={tone.screen} />
      </div>

      <dl className="mt-2 space-y-0.5 text-[11px] leading-tight text-ink-soft">
        <div className="flex gap-1">
          <dt>{t.home.currentClass}:</dt>
          <dd className="font-bold text-ink truncate">{row.currentCourseName ?? "—"}</dd>
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
