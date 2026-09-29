/**
 * A meta description from sanitised CMS HTML. Pure — no SDK, no request — so it is unit-tested
 * on its own (`tests/unit/meta-description.test.ts`).
 */

const DESCRIPTION_MAX = 155;

/**
 * Plain text from the HTML, cut at a word boundary to snippet length.
 *
 * Headings and tables are dropped first: CMS pages open with their own title, so without this
 * the description repeats it and reads "Academic Calendar 2026 Date Event March 1…". Subheads
 * written as `**Saturday**` (a `<p><strong>`, not an `<h2>`) often label the line after them,
 * so they become "Saturday: …" rather than disappearing. A page that is nothing but headings
 * and tables falls back to all of its text.
 */
export function metaDescription(html: string): string {
  const prose = html
    .replace(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/gi, " ")
    .replace(/<table[^>]*>[\s\S]*?<\/table>/gi, " ")
    .replace(/<p[^>]*>\s*<strong>([\s\S]*?):?\s*<\/strong>\s*<\/p>/gi, " $1: ");
  return snippet(toText(prose)) || snippet(toText(html));
}

function toText(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function snippet(text: string): string {
  if (text.length <= DESCRIPTION_MAX) return text;
  const cut = text.slice(0, DESCRIPTION_MAX);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,;:.—-]+$/, "")}…`;
}
