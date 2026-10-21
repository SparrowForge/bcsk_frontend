/**
 * The single-line divider the curriculum design asks for between the snapshot and the programme
 * cards: a rule either side of a small mark. The design's placeholder was a circle; this uses
 * three diamonds in the flag's colours instead, as the brief allowed.
 */
export function SectionDivider() {
  return (
    <div aria-hidden className="mx-auto mt-16 flex max-w-7xl items-center gap-4 px-4">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-green/40 to-green/60" />
      <span className="flex items-center gap-1.5">
        <span className="h-2 w-2 rotate-45 bg-green/60" />
        <span className="h-3 w-3 rotate-45 bg-crimson" />
        <span className="h-2 w-2 rotate-45 bg-green/60" />
      </span>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-green/40 to-green/60" />
    </div>
  );
}
