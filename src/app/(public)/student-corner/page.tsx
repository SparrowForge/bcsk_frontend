import { site } from "@/services";
import { getDict } from "@/lib/i18n";
import { PageShell } from "@/components/site/PageShell";

/** Each pill carries its own label colour: every fill here is dark enough to take white. */
const KIND_COLORS: Record<string, string> = {
  POEM: "bg-green text-white",
  ARTICLE: "bg-green-mid text-white",
  ARTWORK: "bg-crimson text-white",
  ACHIEVEMENT: "bg-green-deep text-white",
};

/** FR-NEWS-03: curated student articles, poems, artwork, achievements. */
export default async function StudentCornerPage() {
  const { t } = await getDict();
  const posts = await site.studentCorner();

  return (
    <PageShell title={t.nav.studentCorner} eyebrow={t.nav.studentLounge}>
      <div className="max-w-4xl">
        <p className="text-sm text-ink-soft mb-8 max-w-2xl">
          Writing, poetry, artwork, and achievements from BCSK students — curated by our teachers. Students can
          submit their work through their class teacher.
        </p>
        <div className="grid sm:grid-cols-2 gap-6">
          {posts.map((p) => (
            <article key={p.id} className="bg-white border border-line rounded-2xl p-6 flex flex-col">
              <span className={`self-start text-[10px] font-extrabold uppercase tracking-wider rounded-full px-2.5 py-1 ${KIND_COLORS[p.kind] ?? "bg-green text-white"}`}>
                {p.kind}
              </span>
              <h2 className="mt-3 font-display text-xl font-semibold text-green leading-snug">{p.title}</h2>
              <div className="mt-3 text-sm text-ink leading-relaxed whitespace-pre-line">{p.body}</div>
              <p className="mt-auto pt-4 text-xs font-bold text-ink-soft">— {p.studentName}</p>
            </article>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
