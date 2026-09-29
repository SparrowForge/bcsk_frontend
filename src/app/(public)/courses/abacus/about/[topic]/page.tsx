import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ABOUT_TOPICS, topicBySlug, type AboutBlock } from "../../content";
import { SorobanDiagram } from "../../SorobanArt";

type Props = { params: Promise<{ topic: string }> };

export function generateStaticParams() {
  return ABOUT_TOPICS.map((t) => ({ topic: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const topic = topicBySlug((await params).topic);
  return topic ? { title: topic.title, description: topic.summary } : { title: "All About Abacus" };
}

function Block({ block }: { block: AboutBlock }) {
  switch (block.kind) {
    case "p":
      return <p className="text-sm text-ink leading-relaxed">{block.text}</p>;
    case "list":
      return (
        <ul className="space-y-2">
          {block.items.map((item) => (
            <li key={item} className="flex gap-2.5 text-sm text-ink leading-relaxed">
              <span className="w-2 h-2 rounded-full bg-abacus mt-1.5 shrink-0" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      );
    case "table":
      return (
        <div className="scroll-fade overflow-x-auto rounded-xl border border-line">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-abacus-soft text-ink text-left">
                {block.head.map((h) => (
                  <th key={h} className="px-4 py-2.5 font-bold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row.join("|")} className="border-t border-line">
                  {row.map((cell, i) => (
                    <td key={i} className={`px-4 py-2.5 ${i === 0 ? "font-bold text-green" : "text-ink"}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "diagram":
      return <SorobanDiagram />;
  }
}

/** One "All About Abacus" topic, with the full list alongside for moving between them. */
export default async function AbacusTopicPage({ params }: Props) {
  const { topic: slug } = await params;
  const topic = topicBySlug(slug);
  if (!topic) notFound();

  const index = ABOUT_TOPICS.indexOf(topic);
  const prev = ABOUT_TOPICS[index - 1];
  const next = ABOUT_TOPICS[index + 1];

  return (
    <section className="mx-auto max-w-7xl px-4 mt-12 grid lg:grid-cols-[260px_1fr] gap-8 items-start">
      <nav aria-label="All About Abacus topics" className="order-last lg:order-none lg:sticky lg:top-24 bg-white border border-line rounded-2xl p-4">
        <Link href="/courses/abacus/about" className="block text-xs font-extrabold uppercase tracking-wide text-green-mid mb-2 px-2">
          All About Abacus
        </Link>
        <ul className="space-y-0.5">
          {ABOUT_TOPICS.map((t) => (
            <li key={t.slug}>
              <Link
                href={`/courses/abacus/about/${t.slug}`}
                aria-current={t.slug === topic.slug ? "page" : undefined}
                className={`flex gap-2 items-center rounded-lg px-2 py-1.5 text-sm transition-colors ${
                  t.slug === topic.slug ? "bg-abacus-soft font-bold text-ink" : "text-ink-soft hover:text-green"
                }`}
              >
                <span aria-hidden className="text-abacus-deep">•</span>
                {t.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <article className="min-w-0 max-w-3xl">
        <p className="text-xs font-extrabold uppercase tracking-wide text-green-mid">
          Topic {index + 1} of {ABOUT_TOPICS.length}
        </p>
        <h2 className="mt-1 font-display text-3xl sm:text-4xl font-semibold text-ink">{topic.title}</h2>
        <p className="mt-2 text-ink-soft">{topic.summary}</p>

        <div className="mt-8 space-y-10">
          {topic.sections.map((s) => (
            <section key={s.heading}>
              <h3 className="font-display text-xl font-semibold text-green mb-3">{s.heading}</h3>
              <div className="space-y-4">
                {s.blocks.map((b, i) => (
                  <Block key={i} block={b} />
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 grid sm:grid-cols-2 gap-3">
          {prev ? (
            <Link href={`/courses/abacus/about/${prev.slug}`} className="bg-white border border-line hover:border-abacus rounded-xl px-4 py-3 transition-colors">
              <span className="block text-xs text-ink-soft">← Previous</span>
              <span className="font-bold text-green">{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/courses/abacus/about/${next.slug}`} className="bg-white border border-line hover:border-abacus rounded-xl px-4 py-3 text-right transition-colors">
              <span className="block text-xs text-ink-soft">Next →</span>
              <span className="font-bold text-green">{next.title}</span>
            </Link>
          ) : (
            <Link href="/courses/abacus" className="bg-abacus hover:bg-abacus-deep rounded-xl px-4 py-3 text-right transition-colors">
              <span className="block text-xs text-ink">Now try it →</span>
              <span className="font-bold text-ink">Virtual Abacus Tool</span>
            </Link>
          )}
        </div>
      </article>
    </section>
  );
}
