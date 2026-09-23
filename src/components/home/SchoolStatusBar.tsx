import type { Dictionary } from "@/lib/i18n/dictionaries";
import { SCHOOL } from "@/lib/constants";
import { reveal } from "@/lib/motion";

/**
 * The banner above both boards (LP-2): who we are, when we open, and whether anything
 * is happening right now.
 *
 * "Open" here means a class is actually live, not that the clock is inside opening hours —
 * the same `isLive` flag the two boards below it read, so the banner cannot claim the
 * school is open above a board showing every room idle. The two time strings are admin
 * settings; a school that has not filled them in gets no line rather than invented hours.
 */
export function SchoolStatusBar({
  t,
  open,
  liveCount,
  weekday,
  weekend,
}: {
  t: Dictionary;
  open: boolean;
  liveCount: number;
  weekday?: string;
  weekend?: string;
}) {
  return (
    <div {...reveal()} className="sheen rounded-lg bg-green-band px-5 py-4 text-center">
      <h2 className="font-display text-xl sm:text-2xl font-semibold text-green">{SCHOOL.name}</h2>

      {(weekday || weekend) && (
        <>
          <p className="mt-1.5 text-[12px] font-bold text-green">{t.home.schoolTime}:</p>
          <p className="text-[12px] text-green/85">
            {weekday && (
              <span className="whitespace-nowrap">
                {t.home.weekday}: {weekday}
              </span>
            )}
            {weekday && weekend && ", "}
            {weekend && (
              <span className="whitespace-nowrap">
                {t.home.weekend}: {weekend}
              </span>
            )}
          </p>
        </>
      )}

      <p className="mt-1 flex flex-wrap items-center justify-center gap-1.5 text-[12px]">
        <span className="font-bold text-green">{t.home.currentStatus}:</span>
        <span className={`font-extrabold ${open ? "text-green" : "text-ink-soft"}`}>
          {open ? t.home.statusOpen : t.home.statusClosed}
        </span>
        {open && (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-600 px-2 py-0.5 text-[9px] font-extrabold text-white">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" aria-hidden />
            {t.common.live} · {liveCount}
          </span>
        )}
      </p>
    </div>
  );
}
