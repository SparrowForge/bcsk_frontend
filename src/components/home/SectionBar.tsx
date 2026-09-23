import { reveal } from "@/lib/motion";

/**
 * The heading bars that separate every band of the homepage (LP-2 … LP-6).
 *
 * The bar is **green**: a band heading is the loudest thing in its band, and a tint could not
 * carry that against the white page — the pale peach it used to wear read as a placeholder
 * rather than as a title. Green also ties the headings to the stat blocks and the footer, so
 * one colour runs top to bottom instead of a different tint per band.
 *
 * `tone="green-band"` keeps a pale green bar for anywhere a heading should stay quiet, and
 * the warm `PanelHead` below marks a panel *inside* a band — the level under this one.
 *
 * Each bar is a real `h2`/`h3`, not a styled div — it is the only thing naming its board,
 * and a reader who skipped it would meet a wall of unlabelled cards. `level` exists because
 * the Students Lounge names its gallery inside a band that already has a heading.
 */
export function SectionBar({
  children,
  level = 2,
  tone = "green",
}: {
  children: React.ReactNode;
  level?: 2 | 3;
  tone?: "green" | "green-band";
}) {
  const Tag = level === 2 ? "h2" : "h3";
  return (
    // Every bar reveals itself as the band scrolls in, and a band-level bar takes a single
    // slow highlight across it — the one flourish that says "new section" without a rule.
    <Tag
      {...reveal()}
      className={`sheen rounded-xl px-5 text-center font-bold ${
        tone === "green-band"
          ? "bg-green-band text-green"
          : "bg-gradient-to-r from-green-deep via-green to-green-deep text-white shadow-[0_10px_24px_-18px_rgba(0,77,57,0.9)]"
      } ${
        level === 2 ? "py-4 font-display text-[1.45rem] font-semibold" : "py-2.5 text-[0.95rem]"
      }`}
    >
      {/* The red rule is the one warm mark on a green bar: it stops a row of dark
          rectangles from reading as a set of dividers and says "this is a title". */}
      <span className="relative inline-block">
        {children}
        <span
          aria-hidden
          className={`absolute left-1/2 -translate-x-1/2 rounded-full bg-crimson ${
            level === 2 ? "-bottom-2 h-[3px] w-12" : "-bottom-1.5 h-[2px] w-8"
          }`}
        />
      </span>
    </Tag>
  );
}

/**
 * The head of a panel *card* — flush inside the card's own border rather than floating
 * above it.
 *
 * A bar drawn on the sheet only reads as a heading when the thing it heads is visibly
 * separate; stacked four deep on a tinted sheet, as School Overview had them, they turn the
 * whole band into stripes. Giving each panel a white card and running its bar edge to edge
 * inside it restores that separation, and matches the fee tables, which were already built
 * this way.
 *
 * Green, like the band bar above it, so the page runs on one colour; the two stay apart by
 * weight rather than by hue — the band bar is larger, lit by a gradient and underlined in
 * red, this one is flat, small and quiet.
 */
export function PanelHead({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="bg-green px-4 py-2.5 text-[13px] font-bold text-white text-center">{children}</h3>
  );
}

/** The sheet the board cards sit on: white inside a thin green rule, as the deck draws it. */
export function BoardPanel({ children }: { children: React.ReactNode }) {
  // The sheet itself does not animate — the cards inside it do, one after another. Fading
  // the sheet as well would put two overlapping fades on the same pixels and read as haze.
  return <div className="rounded-xl border border-green-mid/25 bg-white p-3 sm:p-4">{children}</div>;
}
