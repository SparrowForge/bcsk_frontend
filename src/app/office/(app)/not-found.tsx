import Link from "next/link";

/** A class or record that doesn't exist (or isn't this teacher's): stay inside the teacher panel. */
export default function OfficeNotFound() {
  return (
    <div className="max-w-lg">
      <p className="text-xs font-extrabold uppercase tracking-wide text-crimson-ink">404</p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-green">We couldn&apos;t find that</h1>
      <p className="mt-3 text-sm text-ink-soft leading-relaxed">
        It may not be one of your classes, or the link is out of date.
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
