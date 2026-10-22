import { NextRequest, NextResponse } from "next/server";
import {
  REFRESH_AHEAD_SECONDS, REFRESH_COOKIE, SESSION_COOKIE, isPortalPath, loginFor, refreshCookie, secondsLeft,
  sessionCookie, type TokenPair,
} from "@/lib/session-cookies";

/**
 * Runs before every request (Next 16's proxy runs on Node by default). Two jobs:
 *
 *  - SEC-8: security headers for every response. The app previously sent none - no CSP, no
 *    HSTS, no framing protection - and there was nothing at all to add them centrally.
 *  - F0: session renewal. Shortly before the access token runs out, swap the refresh token for
 *    a fresh pair (`renew` below), and send a session that has ended to its portal's sign-in.
 *
 * Named `proxy` because Next 16.3 deprecated the `middleware` file convention in favour of
 * `proxy`; the matcher and the nonce contract are unchanged.
 */

/** External origins the app genuinely loads code or data from. */
const TOSS = "https://js.tosspayments.com";
const TOSS_API = "https://api.tosspayments.com";
const RECAPTCHA = "https://www.google.com https://www.gstatic.com";
// PERF-4: /api/files/... redirects here for any upload stored in Cloudinary rather than
// streaming bytes itself (FileService.resolve). The delivery host is always res.cloudinary.com
// regardless of which cloud account backend/.env configures.
const CLOUDINARY_IMG = "https://res.cloudinary.com";

function contentSecurityPolicy(nonce: string, isDev: boolean): string {
  // Next injects inline bootstrap scripts; it picks up this nonce automatically because the
  // policy is also set on the *request* headers below. Dev additionally needs eval for HMR.
  const scriptSrc = [
    "'self'",
    `'nonce-${nonce}'`,
    "'strict-dynamic'",
    TOSS,
    RECAPTCHA,
    isDev ? "'unsafe-eval'" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    // Tailwind compiles to a stylesheet, but Next still emits some inline style attributes.
    // Style nonces buy little here — inline CSS is not an execution sink.
    "style-src 'self' 'unsafe-inline'",
    // next/font self-hosts Google Fonts at build time, so no external font origin is needed.
    "font-src 'self' data:",
    // Uploads are requested from /api/files on our own origin, but a Cloudinary-stored file
    // is a 302 there — the browser's img-src check applies to that redirect target too, not
    // just the initial same-origin URL. QR codes are data URIs.
    `img-src 'self' data: blob: ${CLOUDINARY_IMG}`,
    `connect-src 'self' ${TOSS_API} ${RECAPTCHA}`,
    // Toss opens a payment window and reCAPTCHA renders in an iframe.
    `frame-src 'self' ${TOSS} ${RECAPTCHA}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}

const BACKEND =
  process.env.BACKEND_API_URL?.trim() || process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || "http://localhost:4000/api/v1";

type Renewal =
  | { kind: "none" } // signed out, or the token still has time: nothing to do
  | { kind: "renewed"; pair: TokenPair }
  | { kind: "expired" } // the refresh token was refused: the session is over
  | { kind: "skip" }; // another request is renewing, or the API is unreachable: leave things be

/**
 * F0: renew the session shortly before its access token runs out. Server Components cannot set
 * cookies, so this is the one place a renewal can reach the browser - and it runs before the
 * page renders, so the render already sees the new token.
 */
async function renew(req: NextRequest): Promise<Renewal> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const refreshToken = req.cookies.get(REFRESH_COOKIE)?.value;
  const left = secondsLeft(token);
  if (left != null && left > REFRESH_AHEAD_SECONDS) return { kind: "none" };
  if (!refreshToken) return { kind: "none" };

  const headers: Record<string, string> = { "content-type": "application/json" };
  // The backend rate-limits per visitor; the same trusted-proxy headers as api-client.ts.
  const key = process.env.BACKEND_PROXY_KEY?.trim();
  const ip = (req.headers.get("x-forwarded-for")?.split(",")[0] ?? req.headers.get("x-real-ip") ?? "").trim();
  if (key && ip) Object.assign(headers, { "x-bcsk-proxy-key": key, "x-bcsk-client-ip": ip });

  try {
    const res = await fetch(`${BACKEND}/auth/refresh`, {
      method: "POST",
      headers,
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (res.ok) {
      const body = (await res.json()) as { data?: TokenPair };
      return body.data?.token ? { kind: "renewed", pair: body.data } : { kind: "skip" };
    }
    // 409: a parallel request (the page and its prefetches) is renewing with the same token.
    if (res.status === 401) return { kind: "expired" };
    return { kind: "skip" };
  } catch {
    // An unreachable API must not sign anyone out; the next request tries again.
    return { kind: "skip" };
  }
}

export async function proxy(req: NextRequest) {
  const isDev = process.env.NODE_ENV !== "production";
  const nonce = crypto.randomUUID().replace(/-/g, "");
  const csp = contentSecurityPolicy(nonce, isDev);

  const renewal = await renew(req);
  if (renewal.kind === "renewed") {
    // Updating the request's cookies is what makes this very render use the new token.
    req.cookies.set(SESSION_COOKIE, renewal.pair.token);
    if (renewal.pair.refreshToken) req.cookies.set(REFRESH_COOKIE, renewal.pair.refreshToken);
  } else if (renewal.kind === "expired") {
    req.cookies.delete(SESSION_COOKIE);
    req.cookies.delete(REFRESH_COOKIE);
  }

  // Passing the policy through on the request is what lets Next stamp its own inline
  // scripts with this nonce. Without it, a nonce-based CSP breaks hydration.
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("content-security-policy", csp);

  // An ended session on a portal page goes to that portal's sign-in, which says why. Only page
  // loads are redirected; a form post reaches its action, whose guard redirects in turn.
  const { pathname } = req.nextUrl;
  const res = renewal.kind === "expired" && req.method === "GET" && isPortalPath(pathname)
    ? NextResponse.redirect(new URL(`${loginFor(pathname)}?expired=1`, req.url))
    : NextResponse.next({ request: { headers: requestHeaders } });

  if (renewal.kind === "renewed") {
    res.cookies.set(SESSION_COOKIE, renewal.pair.token, sessionCookie(renewal.pair.expiresIn));
    if (renewal.pair.refreshToken) res.cookies.set(REFRESH_COOKIE, renewal.pair.refreshToken, refreshCookie());
  } else if (renewal.kind === "expired") {
    res.cookies.delete(SESSION_COOKIE);
    res.cookies.delete(REFRESH_COOKIE);
  }

  res.headers.set("content-security-policy", csp);
  res.headers.set("x-content-type-options", "nosniff");
  res.headers.set("x-frame-options", "DENY");
  res.headers.set("referrer-policy", "strict-origin-when-cross-origin");
  // The platform handles no camera/mic/geolocation, so decline them outright.
  res.headers.set(
    "permissions-policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()"
  );
  // HSTS only over TLS — sending it on plain http in dev would poison localhost.
  if (!isDev) {
    res.headers.set("strict-transport-security", "max-age=63072000; includeSubDomains; preload");
  }
  return res;
}

export const config = {
  matcher: [
    /*
     * Every path except Next's own static output and the favicon. Static assets are
     * immutable build artefacts and gain nothing from a per-request policy.
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
