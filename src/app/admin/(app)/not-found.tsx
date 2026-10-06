import Link from "next/link";

/** A missing record inside the admin panel: stay in the panel instead of falling back to the public 404. */
export default function AdminNotFound() {
  return (
    <div className="max-w-lg">
      <p className="text-xs font-extrabold uppercase tracking-wide text-crimson-ink">404</p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-green">That record doesn&apos;t exist</h1>
      <p className="mt-3 text-sm text-ink-soft leading-relaxed">
        It may have been deleted, or the link is out of date.
      </p>
      <Link
        href="/admin/dashboard"
        className="mt-6 inline-block bg-green hover:bg-green-deep text-white text-sm font-bold rounded-lg px-5 py-2.5 transition-colors"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
