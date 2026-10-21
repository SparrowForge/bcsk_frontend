import type { Palette } from "@/lib/academic-palette";

/**
 * The colour sign at the foot of each subject panel (Academic Curriculum design): quarter
 * circles in shades of the subject's colour that build up from one subject to the next, so no
 * two neighbouring panels carry the same mark. The first four make a block with a four-pointed
 * gap at its centre; the next four stack a rounded block on top. Never a whole disc.
 *
 * Each tile is a square with one corner rounded fully - a quarter circle - placed on a 2-wide
 * grid counted from the bottom.
 */
type Corner = "tl" | "tr" | "bl" | "br";
const TILES: { col: 0 | 1; row: 0 | 1 | 2 | 3; corner: Corner; shade: 0 | 1 | 2 | 3 }[] = [
  { col: 1, row: 0, corner: "tl", shade: 0 },
  { col: 0, row: 0, corner: "tr", shade: 1 },
  { col: 0, row: 1, corner: "br", shade: 2 },
  { col: 1, row: 1, corner: "bl", shade: 3 },
  { col: 1, row: 2, corner: "br", shade: 0 },
  { col: 0, row: 2, corner: "bl", shade: 1 },
  { col: 0, row: 3, corner: "tl", shade: 2 },
  { col: 1, row: 3, corner: "tr", shade: 3 },
];

const RADIUS: Record<Corner, string> = {
  tl: "100% 0 0 0",
  tr: "0 100% 0 0",
  br: "0 0 100% 0",
  bl: "0 0 0 100%",
};

const SIZE = 30;

export function QuarterSign({ step, palette }: { step: number; palette: Palette }) {
  const count = ((Math.max(step, 1) - 1) % TILES.length) + 1;
  const tiles = TILES.slice(0, count);
  const rows = Math.max(...tiles.map((t) => t.row)) + 1;
  return (
    <span aria-hidden className="relative block" style={{ width: SIZE * 2, height: SIZE * rows }}>
      {tiles.map((t, i) => (
        <span
          key={i}
          className="absolute"
          style={{
            left: t.col * SIZE,
            bottom: t.row * SIZE,
            width: SIZE,
            height: SIZE,
            background: palette.shades[t.shade],
            borderRadius: RADIUS[t.corner],
          }}
        />
      ))}
    </span>
  );
}
