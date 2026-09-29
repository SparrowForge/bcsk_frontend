import Link from "next/link";
import type { Metadata } from "next";
import { ABOUT_TOPICS } from "../content";

export const metadata: Metadata = {
  title: "All About Abacus",
  description: "Everything a parent or student needs to know about the abacus: what it is, its history, its parts and how mental arithmetic works.",
};

/** FR-ABC-02: the seven "All About Abacus" topics. */
export default function AbacusAboutPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 mt-12">
      <div className="text-center mb-8">
        <h2 className="inline-block bg-abacus text-ink font-display text-2xl sm:text-3xl font-semibold rounded-lg px-5 py-1.5">
          All About Abacus
        </h2>
        <p className="mt-3 text-sm text-ink-soft max-w-2xl mx-auto">
          Everything a parent or student needs to know about the soroban — pick a topic to read.
        </p>
      </div>
      <ol className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
        {ABOUT_TOPICS.map((t, i) => (
          <li key={t.slug}>
            <Link
              href={`/courses/abacus/about/${t.slug}`}
              className="group flex gap-4 h-full bg-white border border-line hover:border-abacus rounded-2xl p-5 transition-colors"
            >
              <span className="shrink-0 w-9 h-9 rounded-full bg-green text-white font-bold text-sm flex items-center justify-center">
                {i + 1}
              </span>
              <span>
                <span className="block font-bold text-green group-hover:text-green-mid">{t.title}</span>
                <span className="block mt-1 text-xs text-ink-soft leading-relaxed">{t.summary}</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
