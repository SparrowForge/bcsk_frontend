import type { Metadata } from "next";
import { cms } from "@/services";
import { getDict, getLang } from "@/lib/i18n";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { metaDescription } from "@/lib/meta-description";

/**
 * Per-page `<title>` and meta description.
 *
 * Before this, every page without its own `metadata` export fell back to the root layout's,
 * so ~50 pages shared one title and one description — to a search engine, copies of the
 * homepage. The root layout's `template` ("%s | BCSK") still wraps whatever these return.
 */

/**
 * Title and description for a `CmsPage`, from the same cached read the page itself makes.
 * A missing page returns nothing here and lets the page's own `notFound()` answer.
 */
export async function cmsMetadata(slug: string): Promise<Metadata> {
  try {
    const page = await cms.page(slug, await getLang());
    const description = metaDescription(page.html);
    return { title: page.title, ...(description && { description }) };
  } catch {
    return {};
  }
}

/** A page titled by its navigation label, so the tab follows the visitor's language. */
export async function navMetadata(key: keyof Dictionary["nav"], description: string): Promise<Metadata> {
  const { t } = await getDict();
  return { title: t.nav[key], description };
}
