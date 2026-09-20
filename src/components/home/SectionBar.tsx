import { reveal } from "@/lib/motion";

/**
 * The heading bars that separate every band of the homepage (LP-2 … LP-6).
 *
 * The deck uses two weights, and the distinction carries meaning rather than decoration:
 * the **sage** bar marks a whole band ("School Overview", the school banner above the
 * boards), while the lighter **peach** bar marks a panel inside one. Using sage for both
 * flattened the page into a stack of equal-looking strips.
 *
 * Each bar is a real `h2`/`h3`, not a styled div — it is the only thing naming its board,
 * and a reader who skipped it would meet a wall of unlabelled cards. `level` exists because
 * School Overview nests a second row of bars inside a band that already has one.
 */
export function SectionBar({
  children,
  level = 2,
  tone = "peach",
}: {
  children: React.ReactNode;
  level?: 2 | 3;
  tone?: "sage" | "peach";
}) {
  const Tag = level === 2 ? "h2" : "h3";
  return (
    // Every bar reveals itself as the band scrolls in, and a band-level bar takes a single
    // slow highlight across it — the one flourish that says "new section" without a rule.
    <Tag
      {...reveal()}
      className={`sheen rounded-lg px-5 text-center font-bold text-navy ${
        tone === "sage"
          ? "bg-sage py-3.5 font-display text-[1.4rem] font-semibold"
          : "bg-peach py-2 text-[0.95rem]"
      }`}
    >
      {children}
    </Tag>
  );
}

/** The sheet the board cards sit on: white inside a thin sunrise rule, as the deck draws it. */
export function BoardPanel({ children }: { children: React.ReactNode }) {
  // The sheet itself does not animate — the cards inside it do, one after another. Fading
  // the sheet as well would put two overlapping fades on the same pixels and read as haze.
  return <div className="rounded-xl border border-sunrise/40 bg-white p-3 sm:p-4">{children}</div>;
}
