"use client";

import { useSyncExternalStore } from "react";
import { prayerTimes, formatHours, SEOUL, type PrayerName } from "@/lib/prayer-times";

type Lang = "bn" | "en";
const ZONE = "Asia/Seoul";

const NAMES: Record<PrayerName, { bn: string; en: string }> = {
  fajr: { bn: "ফজর", en: "Fajr" },
  sunrise: { bn: "সূর্যোদয়", en: "Sunrise" },
  dhuhr: { bn: "যোহর", en: "Dhuhr" },
  asr: { bn: "আসর", en: "Asr" },
  maghrib: { bn: "মাগরিব", en: "Maghrib" },
  isha: { bn: "ইশা", en: "Isha" },
};
const SALAH: PrayerName[] = ["fajr", "dhuhr", "asr", "maghrib", "isha"];

const L = {
  today: { bn: "আজকের তারিখ ও সময়", en: "Today's date & time" },
  schedule: { bn: "নামাজের সময়সূচি (সিউল, দক্ষিণ কোরিয়া)", en: "Prayer times (Seoul, South Korea)" },
  next: { bn: "পরবর্তী নামাজ", en: "Next prayer" },
  tomorrow: { bn: "আগামীকাল", en: "tomorrow" },
  seoulTime: { bn: "সিউলের সময়", en: "Seoul time" },
  method: {
    bn: "হিসাব: করাচি পদ্ধতি (ফজর ও ইশা ১৮°), আসর হানাফী মতে। স্থানীয় মসজিদের সময়সূচির সাথে কয়েক মিনিট পার্থক্য হতে পারে।",
    en: "Calculated for Seoul: Karachi method (Fajr and Isha at 18°), Hanafi Asr. Your local masjid's timetable may differ by a few minutes.",
  },
};

/** The current wall-clock date and time in Seoul, whatever the visitor's own zone. */
function seoulNow(now: Date) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: ZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(now)
      .map((p) => [p.type, p.value]),
  );
  return {
    y: Number(parts.year),
    m: Number(parts.month),
    d: Number(parts.day),
    hours: Number(parts.hour) + Number(parts.minute) / 60 + Number(parts.second) / 3600,
  };
}

/* One shared one-second clock for every subscriber. */
let clock: Date | null = null;
let timer: ReturnType<typeof setInterval> | null = null;
const listeners = new Set<() => void>();
function subscribeClock(onTick: () => void) {
  listeners.add(onTick);
  if (!timer) {
    clock = new Date();
    timer = setInterval(() => {
      clock = new Date();
      listeners.forEach((l) => l());
    }, 1000);
  }
  return () => {
    listeners.delete(onTick);
    if (listeners.size === 0 && timer) {
      clearInterval(timer);
      timer = null;
    }
  };
}
const readClock = () => clock;

/** "18 Rabi' al-Thani 1448 AH" — the browser's own era word ("যুগ") reads oddly, so it is replaced. */
function hijri(now: Date, lang: Lang) {
  const parts = new Intl.DateTimeFormat(`${lang === "bn" ? "bn-BD" : "en-GB"}-u-ca-islamic-umalqura`, {
    timeZone: ZONE,
    day: "numeric",
    month: "long",
    year: "numeric",
  }).formatToParts(now);
  const text = parts
    .filter((p) => p.type !== "era")
    .map((p) => p.value)
    .join("")
    .replace(/[\s ‏,]+$/u, "");
  return `${text} ${lang === "bn" ? "হিজরি" : "AH"}`;
}

function countdown(hours: number) {
  const s = Math.max(0, Math.round(hours * 3600));
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
}

/** FR-DEEN: today's date (Gregorian and Hijri), a live clock, and Seoul's prayer times. */
export function PrayerBoard({ lang }: { lang: Lang }) {
  // Null on the server and during hydration — the server cannot know the visitor's clock.
  const now = useSyncExternalStore(subscribeClock, readClock, () => null);

  const locale = lang === "bn" ? "bn-BD" : "en-GB";
  const s = now ? seoulNow(now) : null;
  const today = s ? prayerTimes(s.y, s.m, s.d, SEOUL) : null;

  let next: { name: PrayerName; at: number; tomorrow: boolean } | null = null;
  if (s && today) {
    const upcoming = SALAH.find((p) => today[p] > s.hours);
    if (upcoming) {
      next = { name: upcoming, at: today[upcoming], tomorrow: false };
    } else {
      const t = new Date(Date.UTC(s.y, s.m - 1, s.d + 1));
      const fajr = prayerTimes(t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate(), SEOUL).fajr;
      next = { name: "fajr", at: fajr + 24, tomorrow: true };
    }
  }

  return (
    <div className="space-y-6">
      {/* panel 1 — date and live time */}
      <div className="bg-white border border-line rounded-3xl p-6 flex flex-col">
        <h3 className="font-display text-xl font-semibold text-green border-l-4 border-crimson-bright pl-3">📅 {L.today[lang]}</h3>
        <div className="flex-1 flex flex-col items-center justify-center text-center pt-5 pb-1">
          <p className="font-display text-xl font-semibold text-green min-h-8">
            {now ? new Intl.DateTimeFormat(locale, { timeZone: ZONE, weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(now) : " "}
          </p>
          <p className="mt-1 text-sm text-ink-soft min-h-5">
            {now
              ? hijri(now, lang)
              : " "}
          </p>
          <p lang="en" className="mt-4 inline-flex items-center gap-2 bg-mist rounded-full px-5 py-2 font-mono text-lg text-ink tabular-nums">
            🕒 {now ? new Intl.DateTimeFormat("en-US", { timeZone: ZONE, hour: "numeric", minute: "2-digit", second: "2-digit" }).format(now) : "--:--:--"}
          </p>
          <p className="mt-2 text-xs text-ink-soft">{L.seoulTime[lang]} (KST)</p>
        </div>
      </div>

      {/* panel 2 — prayer times */}
      <div className="bg-white border border-line rounded-3xl p-6">
        <h3 className="font-display text-xl font-semibold text-green border-l-4 border-crimson-bright pl-3">🕌 {L.schedule[lang]}</h3>
        <ul className="mt-4 divide-y divide-dashed divide-line">
          {(["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"] as PrayerName[]).map((p) => {
            const isNext = next && !next.tomorrow && next.name === p;
            const muted = p === "sunrise";
            return (
              <li
                key={p}
                className={`flex items-center justify-between py-2.5 px-2 rounded-lg ${isNext ? "bg-green-soft" : ""}`}
              >
                <span className={muted ? "text-sm text-ink-soft" : "font-bold text-green"}>
                  {NAMES[p][lang]}
                  {isNext && <span className="ml-2 text-[11px] font-extrabold uppercase text-crimson-ink">{L.next[lang]}</span>}
                </span>
                <span lang="en" className={`font-mono tabular-nums ${muted ? "text-sm text-ink-soft" : "text-ink"}`}>
                  {today ? formatHours(today[p]) : "--:--"}
                </span>
              </li>
            );
          })}
        </ul>
        <div className="mt-4 bg-crimson-band rounded-2xl px-5 py-4 text-center">
          <p className="text-sm font-bold text-crimson-ink">
            ⏰ {L.next[lang]}:{" "}
            {next ? `${NAMES[next.name][lang]}${next.tomorrow ? ` (${L.tomorrow[lang]})` : ""}` : "…"}
          </p>
          <p lang="en" className="mt-1 font-mono text-3xl font-bold text-green tabular-nums" role="timer">
            {next && s ? countdown(next.at - s.hours) : "--:--:--"}
          </p>
        </div>
        <p className="mt-3 text-[11px] text-ink-soft leading-relaxed">{L.method[lang]}</p>
      </div>
    </div>
  );
}
