import { reveal } from "@/lib/motion";

/**
 * The heading bars that separate every band of the homepage (LP-2 … LP-6).
 *
 * At the school's request the heading has **no fill**: green text straight on the band, with
 * the red rule under it. The solid green bars it used to wear made every band open with a
 * dark slab; a green title carries the same colour without the weight.
 *
 * `tone="green-band"` keeps a pale green bar for anywhere a heading should sit on a tint.
 *
 * Each bar is a real `h2`/`h3`, not a styled div — it is the only thing naming its board,
 * and a reader who skipped it would meet a wall of unlabelled cards. `level={3}` is for a
 * heading inside a band that already has one.
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
    // Every heading reveals itself as the band scrolls in. The sheen it used to take needs a
    // fill to sweep across; on a bare heading it would read as a glitch, so it is gone.
    <Tag
      {...reveal()}
      className={`rounded-xl px-5 text-center font-bold text-green ${tone === "green-band" ? "bg-green-band" : ""} ${
        // Larger than when the heading sat on a green bar: with the fill gone, size is what
        // tells a band heading from the copy under it.
        level === 2 ? "py-4 font-display text-[1.8rem] sm:text-[2.1rem] leading-tight font-semibold" : "py-2.5 text-[1.15rem]"
      }`}
    >
      {/* The red rule is the one warm mark under a green title: it says "this is a title"
          rather than one more line of copy. */}
      <span className="relative inline-block">
        {children}
        <span
          aria-hidden
          className={`absolute left-1/2 -translate-x-1/2 rounded-full bg-crimson ${
            level === 2 ? "-bottom-2.5 h-[3px] w-14" : "-bottom-1.5 h-[2px] w-9"
          }`}
        />
      </span>
    </Tag>
  );
}

/** The sheet the board cards sit on: white inside a thin green rule, as the deck draws it. */
export function BoardPanel({ children }: { children: React.ReactNode }) {
  // The sheet itself does not animate — the cards inside it do, one after another. Fading
  // the sheet as well would put two overlapping fades on the same pixels and read as haze.
  return <div className="rounded-xl border border-green-mid/25 bg-white p-3 sm:p-4">{children}</div>;
}
