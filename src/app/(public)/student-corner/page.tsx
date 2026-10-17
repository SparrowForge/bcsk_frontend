import { site } from "@/services";
import { getDict } from "@/lib/i18n";
import { kindLook } from "@/lib/corner-kinds";
import { PageShell } from "@/components/site/PageShell";
import { navMetadata } from "@/lib/seo";

export function generateMetadata() {
  return navMetadata("studentCorner", "Writing, artwork, handicrafts and achievements from BCSK students, curated by their teachers.");
}

/**
 * FR-NEWS-03: curated student work. Kinds are open-ended (October 2026) — handicrafts and any
 * other activity the school adds — so labels and colours come from `kindLook`, which the
 * homepage band shares.
 */
export default async function StudentCornerPage() {
  const { t } = await getDict();
  const posts = await site.studentCorner();

  return (
    <PageShell title={t.nav.studentCorner} eyebrow={t.nav.studentLounge}>
      <div className="max-w-4xl">
        <p className="text-sm text-ink-soft mb-8 max-w-2xl">{t.home.studentCornerIntro}</p>
        <div className="grid sm:grid-cols-2 gap-6">
          {posts.map((p) => {
            const k = kindLook(p.kind, t);
            return (
              <article key={p.id} className="bg-white border border-line rounded-2xl overflow-hidden flex flex-col">
                {p.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.imageUrl} alt="" loading="lazy" className="aspect-[16/10] w-full object-cover" />
                )}
                <div className="p-6 flex flex-1 flex-col">
                  <span className={`self-start text-[10px] font-extrabold uppercase tracking-wider rounded-full px-2.5 py-1 ${k.solid}`}>
                    {k.label}
                  </span>
                  <h2 className="mt-3 font-display text-xl font-semibold text-green leading-snug">{p.title}</h2>
                  <div className="mt-3 text-sm text-ink leading-relaxed whitespace-pre-line">{p.body}</div>
                  <p className="mt-auto pt-4 text-xs font-bold text-ink-soft">— {p.studentName}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}
