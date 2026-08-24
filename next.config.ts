import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pins the workspace root so Next cannot infer a parent directory from a stray lockfile and
  // resolve modules against the wrong node_modules — which once shipped an empty <title>.
  // The E2E title assertion is the guard; keep this even though the root package.json is gone.
  turbopack: { root: __dirname },
  // Phase G: emits a self-contained server plus only the node_modules actually used,
  // which is what the Docker runtime stage copies (see Dockerfile).
  //
  // **Off on Vercel, deliberately.** `standalone` is a self-hosting feature — Vercel builds
  // and packages the app itself — and with Next 16.3.x it makes Vercel's post-build
  // `onBuildComplete` step die on a missing `.next/next-server.js.nft.json`. The build and
  // static generation both succeed first, so the failure looks unrelated to this setting.
  // Vercel sets VERCEL=1 in its build environment; a Docker build does not, and still gets
  // `.next/standalone`.
  output: process.env.VERCEL ? undefined : "standalone",
  experimental: {
    // SEC-4.1: enables forbidden(), so a permission denial renders a real 403 boundary
    // instead of a silent redirect that would hide genuine authorisation bugs.
    // Contained to requirePermission() in src/lib/auth.ts if this flag ever changes.
    authInterrupts: true,
  },
};

/**
 * Gallery and upload URLs stored in the database point at `/api/files/...`. Rewriting them
 * to the backend keeps that data valid without the frontend serving files itself — and
 * without a migration over every stored URL.
 */
const API = process.env.BACKEND_API_URL?.trim() || "http://localhost:4000/api/v1";
nextConfig.rewrites = async () => [
  { source: "/api/files/:path*", destination: `${API}/files/:path*` },
  { source: "/api/receipts/:id", destination: `${API}/receipts/:id` },
  { source: "/api/documents/:type", destination: `${API}/documents/:type` },
  { source: "/api/admin/documents/:userId/:type", destination: `${API}/admin/documents/:userId/:type` },
  { source: "/api/admin/payments-export", destination: `${API}/admin/payments-export` },
];

export default nextConfig;
