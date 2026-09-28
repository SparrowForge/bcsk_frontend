import { notFound } from "next/navigation";
import { cms, ApiError } from "@/services";
import { getDict } from "@/lib/i18n";
import { formatDate, isoAttr } from "@/lib/dates";
import { PageShell } from "@/components/site/PageShell";
import { SideCard } from "@/components/site/SideCard";

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { lang } = await getDict();
  // "/events/news/abc" is a page that does not exist, not a server error: without this the API
  // rejects NaN with a 400, which is not the 404 handled below, and the visitor gets a 500.
  const newsId = Number(id);
  if (!Number.isInteger(newsId) || newsId <= 0) notFound();
  let item: Awaited<ReturnType<typeof cms.newsItem>>;
  try {
    item = await cms.newsItem(newsId);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }

  return (
    <PageShell title={item.title} eyebrow={item.type}>
      <div className="grid lg:grid-cols-[1fr_280px] gap-10">
        <article className="max-w-3xl">
          <time className="text-xs font-bold text-ink-soft" dateTime={isoAttr(item.date)}>
            {formatDate(item.date, lang)}
          </time>
          <div className="mt-4 text-[15px] text-ink leading-relaxed prose-bcsk" dangerouslySetInnerHTML={{ __html: item.html }} />
        </article>
        <SideCard />
      </div>
    </PageShell>
  );
}
