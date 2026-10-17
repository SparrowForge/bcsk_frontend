import type { Dictionary } from "@/lib/i18n/dictionaries";

/**
 * What a Student Corner kind looks like: its label and its colour, used by the homepage band,
 * the Student Corner page and the admin editor alike.
 *
 * The set of kinds is open (October 2026): the school asked to add extra-curricular work —
 * handicrafts and whatever comes next — without waiting for a deploy, so the admin types the
 * kind and the backend stores it as a key ("Handy crafts" → `HANDY_CRAFTS`). The kinds below
 * have a translated label and a fixed colour; any other key is shown title-cased in its own
 * language as typed, and takes a colour from the spare palette by a stable hash, so the same
 * kind keeps the same colour on every page and every visit.
 *
 * Every `solid` fill here takes white text at AA.
 */
export type KindLook = { label: string; stripe: string; pill: string; solid: string };

const KNOWN = {
  POEM: { stripe: "bg-green", pill: "bg-green-soft text-green", solid: "bg-green text-white" },
  ARTICLE: { stripe: "bg-ielts", pill: "bg-ielts-soft text-ielts", solid: "bg-ielts text-white" },
  ARTWORK: { stripe: "bg-crimson", pill: "bg-crimson-band text-crimson-ink", solid: "bg-crimson text-white" },
  ACHIEVEMENT: { stripe: "bg-abacus", pill: "bg-abacus-soft text-abacus-ink", solid: "bg-abacus-ink text-white" },
  HANDICRAFT: { stripe: "bg-deen", pill: "bg-deen-soft text-deen", solid: "bg-deen text-white" },
  ACTIVITY: { stripe: "bg-green-mid", pill: "bg-green-band text-green-deep", solid: "bg-green-mid text-white" },
} as const;

const SPARE = [
  { stripe: "bg-teal-600", pill: "bg-teal-50 text-teal-800", solid: "bg-teal-700 text-white" },
  { stripe: "bg-sky-600", pill: "bg-sky-50 text-sky-800", solid: "bg-sky-700 text-white" },
  { stripe: "bg-pink-600", pill: "bg-pink-50 text-pink-800", solid: "bg-pink-700 text-white" },
  { stripe: "bg-lime-600", pill: "bg-lime-50 text-lime-900", solid: "bg-lime-800 text-white" },
  { stripe: "bg-violet-600", pill: "bg-violet-50 text-violet-800", solid: "bg-violet-700 text-white" },
];

/** The kinds the admin editor suggests. Anything else may still be typed. */
export const SUGGESTED_KINDS = ["Article", "Poem", "Artwork", "Handicraft", "Achievement", "Activity"];

function knownLabel(key: string, t: Dictionary): string | null {
  switch (key) {
    case "POEM":
      return t.home.kindPoem;
    case "ARTICLE":
      return t.home.kindArticle;
    case "ARTWORK":
      return t.home.kindArtwork;
    case "ACHIEVEMENT":
      return t.home.kindAchievement;
    case "HANDICRAFT":
      return t.home.kindHandicraft;
    case "ACTIVITY":
      return t.home.kindActivity;
    default:
      return null;
  }
}

/** "HANDY_CRAFTS" → "Handy Crafts". Scripts without case (Bangla, Korean) pass through. */
export function kindTitle(key: string): string {
  return key
    .split("_")
    .filter(Boolean)
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(" ");
}

export function kindLook(key: string, t: Dictionary): KindLook {
  const known = KNOWN[key as keyof typeof KNOWN];
  if (known) return { label: knownLabel(key, t) ?? kindTitle(key), ...known };
  let h = 0;
  for (const ch of key) h = (h * 31 + ch.codePointAt(0)!) >>> 0;
  return { label: kindTitle(key), ...SPARE[h % SPARE.length] };
}
