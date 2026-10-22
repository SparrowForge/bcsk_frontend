import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "@/proxy";
import {
  REFRESH_AHEAD_SECONDS, isPortalPath, loginFor, refreshCookie, secondsLeft, sessionCookie,
} from "@/lib/session-cookies";

/** An unsigned JWT with the given expiry - the proxy only reads `exp`, the backend verifies. */
const jwt = (expInSeconds: number) => {
  const b64 = (o: object) => Buffer.from(JSON.stringify(o)).toString("base64url");
  return `${b64({ alg: "HS256" })}.${b64({ sub: "7", exp: Math.floor(Date.now() / 1000) + expInSeconds })}.sig`;
};
const request = (path: string, cookies: Record<string, string>, method = "GET") =>
  new NextRequest(`http://localhost:3000${path}`, {
    method,
    headers: { cookie: Object.entries(cookies).map(([k, v]) => `${k}=${v}`).join("; ") },
  });
const backend = (status: number, body: unknown) =>
  vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } }));

afterEach(() => vi.restoreAllMocks());

describe("session cookie helpers", () => {
  it("reads how long an access token has left, and nothing from a non-token", () => {
    expect(secondsLeft(jwt(600))).toBeGreaterThan(590);
    expect(secondsLeft(jwt(-10))).toBeLessThan(0);
    expect(secondsLeft("not-a-token")).toBeNull();
    expect(secondsLeft(undefined)).toBeNull();
  });
  it("keeps the session cookie as long as the token, and the refresh cookie 30 days", () => {
    expect(sessionCookie(1800)).toMatchObject({ httpOnly: true, sameSite: "lax", path: "/", maxAge: 1800 });
    expect(sessionCookie(undefined).maxAge).toBe(8 * 3600); // an older API without expiresIn
    expect(refreshCookie()).toMatchObject({ httpOnly: true, sameSite: "lax", maxAge: 30 * 24 * 3600 });
  });
  it("knows which portal a path signs in to, and which paths need a session", () => {
    expect(loginFor("/office/classes/3")).toBe("/office");
    expect(loginFor("/change-password")).toBe("/");
    expect(isPortalPath("/admin/dashboard")).toBe(true);
    expect(isPortalPath("/admin")).toBe(false); // the sign-in page itself
    expect(isPortalPath("/events/news")).toBe(false);
  });
});

describe("silent refresh in the proxy", () => {
  it("leaves a token with time to spare alone, calling nothing", async () => {
    const fetchSpy = backend(200, {});
    const res = await proxy(request("/classroom/dashboard", { bcsk_session: jwt(REFRESH_AHEAD_SECONDS + 600), bcsk_refresh: "r1" }));
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(res.cookies.get("bcsk_session")).toBeUndefined();
  });

  it("renews a token about to run out, for the browser and for this render", async () => {
    const fresh = jwt(1800);
    const fetchSpy = backend(200, { data: { token: fresh, refreshToken: "r2", expiresIn: 1800 } });
    const res = await proxy(request("/classroom/dashboard", { bcsk_session: jwt(60), bcsk_refresh: "r1" }));
    expect(fetchSpy).toHaveBeenCalledWith(expect.stringMatching(/\/auth\/refresh$/), expect.objectContaining({ method: "POST", body: JSON.stringify({ refreshToken: "r1" }) }));
    expect(res.cookies.get("bcsk_session")).toMatchObject({ value: fresh, httpOnly: true, maxAge: 1800 });
    expect(res.cookies.get("bcsk_refresh")).toMatchObject({ value: "r2", httpOnly: true });
    // The render downstream sees the new token through the request headers Next passes on.
    expect(res.headers.get("x-middleware-request-cookie") ?? res.headers.get("x-middleware-override-headers")).toBeTruthy();
    expect(res.status).toBe(200);
  });

  it("renews when the access cookie has already gone but the refresh token remains", async () => {
    backend(200, { data: { token: jwt(1800), refreshToken: "r2", expiresIn: 1800 } });
    const res = await proxy(request("/office/dashboard", { bcsk_refresh: "r1" }));
    expect(res.cookies.get("bcsk_session")?.value).toBeTruthy();
  });

  it("sends an ended session to its portal's sign-in with the notice, clearing both cookies", async () => {
    backend(401, { error: { code: "UNAUTHENTICATED", message: "Your session has expired." } });
    const res = await proxy(request("/office/classes/3", { bcsk_session: jwt(-30), bcsk_refresh: "r1" }));
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("http://localhost:3000/office?expired=1");
    expect(res.cookies.get("bcsk_session")?.value).toBe("");
    expect(res.cookies.get("bcsk_refresh")?.value).toBe("");
  });

  it("does not redirect a form post or a public page; it only clears the cookies", async () => {
    backend(401, {});
    const post = await proxy(request("/office/classes/3", { bcsk_refresh: "r1" }, "POST"));
    expect(post.status).toBe(200);
    const pub = await proxy(request("/events/news", { bcsk_refresh: "r1" }));
    expect(pub.status).toBe(200);
    expect(pub.cookies.get("bcsk_refresh")?.value).toBe("");
  });

  it("changes nothing while a parallel request renews, or when the API is down", async () => {
    backend(409, { error: { code: "CONFLICT", message: "This session is already being refreshed." } });
    const racing = await proxy(request("/classroom/dashboard", { bcsk_session: jwt(60), bcsk_refresh: "r1" }));
    expect(racing.cookies.getAll()).toEqual([]);
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("ECONNREFUSED"));
    const down = await proxy(request("/classroom/dashboard", { bcsk_session: jwt(60), bcsk_refresh: "r1" }));
    expect(down.cookies.getAll()).toEqual([]);
    expect(down.status).toBe(200);
  });

  it("keeps the security headers on every response", async () => {
    backend(401, {});
    const res = await proxy(request("/admin/users", { bcsk_refresh: "r1" }));
    expect(res.headers.get("content-security-policy")).toContain("default-src 'self'");
    expect(res.headers.get("x-frame-options")).toBe("DENY");
  });
});
