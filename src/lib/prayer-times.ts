/**
 * Daily prayer times, computed locally from the sun's position — no API, so nothing to add
 * to the CSP and nothing to go stale. This is the standard astronomical method used by
 * PrayTimes.org and most mosque timetables.
 *
 * Defaults suit BCSK's families: University of Islamic Sciences, Karachi angles (Fajr and
 * Isha at 18°) and the Hanafi Asr (shadow twice the object's length). A local mosque's printed
 * table may differ by a few minutes because some add a safety margin (ihtiyat).
 */

export type PrayerName = "fajr" | "sunrise" | "dhuhr" | "asr" | "maghrib" | "isha";

export type PrayerOptions = {
  latitude: number;
  longitude: number;
  /** Hours east of UTC for the place — not the viewer's zone. */
  timezone: number;
  fajrAngle?: number;
  ishaAngle?: number;
  /** 1 = Shafi'i/Maliki/Hanbali, 2 = Hanafi. */
  asrFactor?: 1 | 2;
};

export const SEOUL: PrayerOptions = { latitude: 37.5665, longitude: 126.978, timezone: 9 };

const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;
const fix = (a: number, b: number) => {
  const r = a - b * Math.floor(a / b);
  return r < 0 ? r + b : r;
};
const fixHour = (h: number) => fix(h, 24);

function julianDay(year: number, month: number, day: number) {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const a = Math.floor(year / 100);
  const b = 2 - a + Math.floor(a / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + b - 1524.5;
}

/** Declination (degrees) and equation of time (hours) for a Julian day. */
function sunPosition(jd: number) {
  const d = jd - 2451545.0;
  const g = fix(357.529 + 0.98560028 * d, 360);
  const q = fix(280.459 + 0.98564736 * d, 360);
  const l = fix(q + 1.915 * Math.sin(rad(g)) + 0.02 * Math.sin(rad(2 * g)), 360);
  const e = 23.439 - 0.00000036 * d;
  const ra = fixHour(deg(Math.atan2(Math.cos(rad(e)) * Math.sin(rad(l)), Math.cos(rad(l)))) / 15);
  return {
    declination: deg(Math.asin(Math.sin(rad(e)) * Math.sin(rad(l)))),
    equation: q / 15 - ra,
  };
}

/**
 * Prayer times for one calendar date at the given place, as decimal hours in that place's
 * local time (e.g. 12.5 = 12:30). Month is 1-based.
 */
export function prayerTimes(year: number, month: number, day: number, opts: PrayerOptions): Record<PrayerName, number> {
  const { latitude: lat, longitude: lng, timezone } = opts;
  const fajrAngle = opts.fajrAngle ?? 18;
  const ishaAngle = opts.ishaAngle ?? 18;
  const asrFactor = opts.asrFactor ?? 2;
  const jDate = julianDay(year, month, day) - lng / (15 * 24);

  const midDay = (t: number) => fixHour(12 - sunPosition(jDate + t).equation);
  const sunAngleTime = (angle: number, t: number, before: boolean) => {
    const { declination } = sunPosition(jDate + t);
    const noon = midDay(t);
    const cos =
      (-Math.sin(rad(angle)) - Math.sin(rad(declination)) * Math.sin(rad(lat))) /
      (Math.cos(rad(declination)) * Math.cos(rad(lat)));
    // Beyond the polar circle the sun may never reach the angle; clamp rather than return NaN.
    const h = deg(Math.acos(Math.max(-1, Math.min(1, cos)))) / 15;
    return noon + (before ? -h : h);
  };
  const asrTime = (t: number) => {
    const { declination } = sunPosition(jDate + t);
    const angle = -deg(Math.atan(1 / (asrFactor + Math.tan(rad(Math.abs(lat - declination))))));
    return sunAngleTime(angle, t, false);
  };

  // One refinement pass: first guesses as day fractions, as PrayTimes does.
  const guess = { fajr: 5, sunrise: 6, dhuhr: 12, asr: 13, maghrib: 18, isha: 18 };
  const p = (h: number) => h / 24;
  const raw = {
    fajr: sunAngleTime(fajrAngle, p(guess.fajr), true),
    sunrise: sunAngleTime(0.833, p(guess.sunrise), true),
    dhuhr: midDay(p(guess.dhuhr)),
    asr: asrTime(p(guess.asr)),
    maghrib: sunAngleTime(0.833, p(guess.maghrib), false),
    isha: sunAngleTime(ishaAngle, p(guess.isha), false),
  };

  const shift = timezone - lng / 15;
  const out = {} as Record<PrayerName, number>;
  for (const k of Object.keys(raw) as PrayerName[]) out[k] = fixHour(raw[k] + shift);
  return out;
}

/** 5.5 → "05:30" (rounded to the nearest minute). */
export function formatHours(h: number) {
  const total = Math.round(h * 60) % (24 * 60);
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}
