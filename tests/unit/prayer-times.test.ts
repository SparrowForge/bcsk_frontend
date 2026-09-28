import { describe, it, expect } from "vitest";
import { prayerTimes, formatHours, SEOUL } from "@/lib/prayer-times";

/** Minutes between two decimal-hour times. */
const gap = (a: number, b: number) => Math.abs(a - b) * 60;
const hm = (h: number, m: number) => h + m / 60;

/**
 * Reference values are Seoul's published sunrise/sunset for 2026 (KASI / timeanddate). Sunrise
 * and sunset are the anchors because they are the least disputed; the other prayers are
 * checked for order and plausible spacing, since their exact minute depends on the method.
 */
describe("prayer times — Seoul", () => {
  it("matches the June solstice sunrise and sunset", () => {
    const t = prayerTimes(2026, 6, 21, SEOUL);
    expect(gap(t.sunrise, hm(5, 11))).toBeLessThan(4);
    expect(gap(t.maghrib, hm(19, 57))).toBeLessThan(4);
  });

  it("matches the December solstice sunrise and sunset", () => {
    const t = prayerTimes(2026, 12, 21, SEOUL);
    expect(gap(t.sunrise, hm(7, 43))).toBeLessThan(4);
    expect(gap(t.maghrib, hm(17, 17))).toBeLessThan(4);
  });

  it("puts Dhuhr at Seoul's solar noon, about half an hour after 12:00", () => {
    for (const [m, d] of [[3, 20], [6, 21], [9, 28], [12, 21]]) {
      const { dhuhr } = prayerTimes(2026, m, d, SEOUL);
      expect(dhuhr).toBeGreaterThan(hm(12, 10));
      expect(dhuhr).toBeLessThan(hm(12, 50));
    }
  });

  it("keeps the prayers in order every day of the year", () => {
    const names = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"] as const;
    for (let doy = 0; doy < 365; doy++) {
      const date = new Date(Date.UTC(2026, 0, 1 + doy));
      const t = prayerTimes(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate(), SEOUL);
      for (let i = 1; i < names.length; i++) expect(t[names[i]]).toBeGreaterThan(t[names[i - 1]]);
    }
  });

  it("makes the Hanafi Asr later than the standard Asr", () => {
    const hanafi = prayerTimes(2026, 9, 28, { ...SEOUL, asrFactor: 2 });
    const standard = prayerTimes(2026, 9, 28, { ...SEOUL, asrFactor: 1 });
    expect(hanafi.asr - standard.asr).toBeGreaterThan(0.5);
  });
});

describe("formatHours", () => {
  it("rounds to the minute and pads", () => {
    expect(formatHours(5.5)).toBe("05:30");
    expect(formatHours(hm(18, 59.6))).toBe("19:00");
    expect(formatHours(hm(23, 59.9))).toBe("00:00");
  });
});
