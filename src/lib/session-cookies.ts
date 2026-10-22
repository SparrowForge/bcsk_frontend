/**
 * The two cookies that hold a web session (F0), shared by the sign-in actions and the proxy so
 * both write them identically.
 *
 *  - `bcsk_session`: the short-lived access token the backend verifies on every call. Its cookie
 *    lives as long as the token itself (`expiresIn` from the backend).
 *  - `bcsk_refresh`: the long-lived refresh token. The proxy swaps it for a fresh pair shortly
 *    before the access token runs out (`src/proxy.ts`), so a signed-in user is never bounced to
 *    the login page mid-term. `SameSite=Lax`, not Strict: a link from an email into the portal
 *    is a cross-site navigation, and Strict would hide the cookie exactly then.
 *
 * Both are httpOnly; the browser's JavaScript never sees either token. No `server-only` import:
 * the proxy uses this module too.
 */
export const SESSION_COOKIE = "bcsk_session";
export const REFRESH_COOKIE = "bcsk_refresh";

/** The backend's refresh tokens live 30 days (`JWT_REFRESH_TTL`); the cookie keeps the same. */
const REFRESH_MAX_AGE = 30 * 24 * 3600;
/** Used only if the backend leaves `expiresIn` out (an older API): its old 8-hour session. */
const FALLBACK_SESSION_MAX_AGE = 8 * 3600;
/** The proxy refreshes when the access token has less than this left. */
export const REFRESH_AHEAD_SECONDS = 5 * 60;

type CookieOptions = { httpOnly: true; sameSite: "lax"; secure: boolean; path: "/"; maxAge: number };
const base = () => ({ httpOnly: true as const, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/" as const });

export const sessionCookie = (expiresIn?: number): CookieOptions => ({ ...base(), maxAge: expiresIn && expiresIn > 0 ? expiresIn : FALLBACK_SESSION_MAX_AGE });
export const refreshCookie = (): CookieOptions => ({ ...base(), maxAge: REFRESH_MAX_AGE });

/** What `/auth/login`, `/auth/refresh` and a password change hand back. */
export type TokenPair = { token: string; refreshToken?: string; expiresIn?: number };

/**
 * Seconds until an access token expires, read from its `exp` claim without verifying it - this
 * only decides *when* to refresh; the backend verifies every token it is shown. Null for
 * anything that is not a readable JWT.
 */
export function secondsLeft(token: string | undefined, now = Date.now()): number | null {
  if (!token) return null;
  const payload = token.split(".")[1];
  if (!payload) return null;
  try {
    const json = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(payload.length / 4) * 4, "=")));
    return typeof json.exp === "number" ? json.exp - Math.floor(now / 1000) : null;
  } catch {
    return null;
  }
}

/** Where to send someone whose session ended on a path, so they sign in to the right portal. */
export function loginFor(pathname: string): string {
  if (pathname.startsWith("/classroom")) return "/classroom";
  if (pathname.startsWith("/office")) return "/office";
  if (pathname.startsWith("/admin")) return "/admin";
  return "/";
}

/** Paths that need a signed-in user: the three portals and the forced password change. */
export function isPortalPath(pathname: string): boolean {
  return /^\/(classroom|office|admin)\/./.test(pathname) || pathname === "/change-password";
}
