/**
 * A static soroban drawn in SVG — the hero illustration and the labelled "Parts of Abacus"
 * diagram. The interactive tool is `VirtualAbacus`; this one only shows a number.
 */

const PITCH = 40; // rod spacing
const FRAME = 14;
const BEAD_H = 20;
const BEAM_Y = FRAME + 50;
const EARTH_Y = BEAM_Y + 8;
const HEIGHT = EARTH_Y + 110 + FRAME;

function Bead({ cx, y, fill }: { cx: number; y: number; fill: string }) {
  return (
    <polygon
      points={`${cx - 17},${y + 10} ${cx - 8},${y} ${cx + 8},${y} ${cx + 17},${y + 10} ${cx + 8},${y + BEAD_H} ${cx - 8},${y + BEAD_H}`}
      fill={fill}
      stroke="#5c0a0a"
      strokeWidth="1"
    />
  );
}

function Rods({ digits, idPrefix }: { digits: number[]; idPrefix: string }) {
  const width = digits.length * PITCH + FRAME * 2;
  const fill = `url(#${idPrefix}-bead)`;
  return (
    <>
      <defs>
        <linearGradient id={`${idPrefix}-bead`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff7a45" />
          <stop offset="0.5" stopColor="#e2261b" />
          <stop offset="1" stopColor="#8f1111" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width={width} height={HEIGHT} rx="10" fill="#1c1c1c" />
      <rect x={FRAME - 4} y={FRAME - 4} width={width - FRAME * 2 + 8} height={HEIGHT - FRAME * 2 + 8} rx="4" fill="#2a2a2a" />
      {digits.map((d, i) => {
        const cx = FRAME + PITCH / 2 + i * PITCH;
        const heaven = d >= 5;
        const earth = d % 5;
        return (
          <g key={i}>
            <line x1={cx} y1={FRAME - 4} x2={cx} y2={HEIGHT - FRAME + 4} stroke="#b9b9b9" strokeWidth="2.5" />
            <Bead cx={cx} y={heaven ? BEAM_Y - BEAD_H - 1 : FRAME + 2} fill={fill} />
            {[0, 1, 2, 3].map((k) => (
              <Bead key={k} cx={cx} y={EARTH_Y + 1 + (k < earth ? k : k + 1) * BEAD_H} fill={fill} />
            ))}
          </g>
        );
      })}
      <rect x={FRAME - 4} y={BEAM_Y} width={width - FRAME * 2 + 8} height="8" fill="#d9d9d9" />
      {digits.map((_, i) =>
        (digits.length - 1 - i) % 3 === 0 ? (
          <circle key={i} cx={FRAME + PITCH / 2 + i * PITCH} cy={BEAM_Y + 4} r="2.2" fill="#1c1c1c" />
        ) : null,
      )}
    </>
  );
}

function digitsOf(value: number, rods: number) {
  return value.toString().padStart(rods, "0").slice(-rods).split("").map(Number);
}

export function SorobanArt({ value, rods, className }: { value: number; rods: number; className?: string }) {
  const width = rods * PITCH + FRAME * 2;
  return (
    <svg viewBox={`0 0 ${width} ${HEIGHT}`} className={className} role="img" aria-label={`A soroban showing ${value.toLocaleString("en-US")}`}>
      <Rods digits={digitsOf(value, rods)} idPrefix={`art${rods}`} />
    </svg>
  );
}

/** "Parts of Abacus Tool": a seven-rod soroban reading 1,234,567, with callouts. */
export function SorobanDiagram() {
  const digits = digitsOf(1234567, 7);
  const width = digits.length * PITCH + FRAME * 2;
  const right = width + 14;
  const labels: { text: string; x: number; y: number; to: [number, number]; side: "l" | "r" }[] = [
    { text: "Heaven bead (5)", x: -14, y: 26, to: [17, 26], side: "l" },
    { text: "Unit marker", x: -14, y: 68, to: [34, 68], side: "l" },
    { text: "Earth beads (1)", x: -14, y: 123, to: [17, 123], side: "l" },
    { text: "Frame", x: -14, y: 176, to: [4, 176], side: "l" },
    { text: "Rod", x: right, y: 26, to: [FRAME + PITCH / 2 + 6 * PITCH, 26], side: "r" },
    { text: "Beam", x: right, y: 68, to: [width - FRAME + 4, 68], side: "r" },
    { text: "Ones rod", x: right, y: 150, to: [FRAME + PITCH / 2 + 6 * PITCH + 17, 143], side: "r" },
  ];
  return (
    <figure className="bg-white border border-line rounded-2xl p-4 sm:p-6">
      <svg
        viewBox={`-130 -8 ${width + 250} ${HEIGHT + 34}`}
        className="w-full h-auto"
        role="img"
        aria-labelledby="soroban-diagram-title"
      >
        <title id="soroban-diagram-title">
          Labelled soroban: frame, beam with unit markers, rods, one heaven bead and four earth beads per rod
        </title>
        <Rods digits={digits} idPrefix="diagram" />
        {labels.map((l) => (
          <g key={l.text}>
            <line x1={l.side === "l" ? l.x + 4 : l.x - 4} y1={l.y} x2={l.to[0]} y2={l.to[1]} stroke="#006a4e" strokeWidth="1.2" />
            <circle cx={l.to[0]} cy={l.to[1]} r="2.5" fill="#006a4e" />
            <text
              x={l.x}
              y={l.y + 4}
              textAnchor={l.side === "l" ? "end" : "start"}
              fontSize="11"
              fontWeight="700"
              fill="#171717"
            >
              {l.text}
            </text>
          </g>
        ))}
        <text x={width / 2} y={HEIGHT + 20} textAnchor="middle" fontSize="11" fill="#57605b">
          Reads 1,234,567 — each rod is one digit
        </text>
      </svg>
    </figure>
  );
}
