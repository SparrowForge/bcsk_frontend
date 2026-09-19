/**
 * The sage heading bar that separates every band of the homepage (LP-2 … LP-6).
 *
 * It is a heading, not a decoration, so it renders a real `h2`/`h3` — the bar is the only
 * thing naming each board, and a screen reader that skipped it would meet a wall of
 * unlabelled cards. `level` exists because the School Overview band nests two rows of these
 * inside one section and an `h3` under an `h3` would break the outline.
 */
export function SectionBar({
  children,
  level = 2,
  tone = "sage",
}: {
  children: React.ReactNode;
  level?: 2 | 3;
  tone?: "sage" | "soft";
}) {
  const Tag = level === 2 ? "h2" : "h3";
  return (
    <Tag
      className={`rounded-xl px-5 py-3 text-center font-display font-semibold text-navy ${
        tone === "sage" ? "bg-sage text-[1.35rem]" : "bg-sage-soft text-[1.05rem]"
      }`}
    >
      {children}
    </Tag>
  );
}

/** The panel the cards sit in: a cream sheet inside a thin sunrise rule, as the deck draws it. */
export function BoardPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-sunrise/40 bg-cream/60 p-4 sm:p-5">{children}</div>
  );
}
