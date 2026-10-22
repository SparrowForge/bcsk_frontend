/**
 * Reading a submitted form in a Server Action. Everything arrives as text; these turn it into
 * what the API expects. The API validates again - these only shape the request.
 */
export const text = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();

/** Text, or null when left blank - for optional fields the API stores as null. */
export const optText = (fd: FormData, key: string) => text(fd, key) || null;

/** A number, or null when blank or not a number. */
export function optNum(fd: FormData, key: string): number | null {
  const raw = text(fd, key);
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

/** A required id: 0 when missing, which the API refuses with a clear message. */
export const id = (fd: FormData, key: string) => optNum(fd, key) ?? 0;

/** A checkbox: present means on. */
export const checked = (fd: FormData, key: string) => fd.get(key) === "on";
