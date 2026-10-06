import Link from "next/link";

/** Rendered inside the teacher panel when `requireMenu()` rejects a page this account may not open. */
export default function Forbidden() {
  return (
    <div className="max-w-lg">
      <p className="text-xs font-extrabold uppercase tracking-wide text-crimson-ink">403</p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-green">This page isn&apos;t available to you</h1>
      <p className="mt-3 text-sm text-ink-soft leading-relaxed">
        Your account doesn&apos;t have access to this menu. If you need it, ask a Super Admin to review your menu
        permissions.
      </p>
      <Link
        href="/office/dashboard"
        className="mt-6 inline-block bg-green hover:bg-green-deep text-white text-sm font-bold rounded-lg px-5 py-2.5 transition-colors"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
