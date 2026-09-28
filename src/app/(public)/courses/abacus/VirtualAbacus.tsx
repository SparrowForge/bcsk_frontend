"use client";

import { useEffect, useRef, useState } from "react";

const ROD_CHOICES = [9, 13, 15] as const;
const BEAD_H = 24;
const HEAVEN_H = BEAD_H * 2 + 6;
const EARTH_H = BEAD_H * 5 + 6;

/** Group a digit string in threes: "0001234" → "1,234". */
function formatDigits(digits: number[]) {
  const s = digits.join("").replace(/^0+(?=\d)/, "");
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function placeName(fromRight: number) {
  const names = ["Ones", "Tens", "Hundreds", "Thousands", "Ten thousands", "Hundred thousands", "Millions"];
  return names[fromRight] ?? `10^${fromRight}`;
}

/**
 * FR-ABC-06: interactive soroban. Each rod holds one digit — one heaven bead worth 5 above the
 * beam and four earth beads worth 1 below it. A bead counts when it touches the beam.
 */
export function VirtualAbacus() {
  const [rods, setRods] = useState<number>(15);
  const [digits, setDigits] = useState<number[]>(() => Array(15).fill(0));
  const [showValue, setShowValue] = useState(true);
  const [entry, setEntry] = useState("");
  const [target, setTarget] = useState<string | null>(null);

  const frame = useRef<HTMLDivElement>(null);

  // On a narrow screen the frame scrolls; start at the ones rod, where every sum begins.
  useEffect(() => {
    const el = frame.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, [rods]);

  const value = formatDigits(digits);
  const solved = target !== null && value === target;

  /** Updates from the previous state, so two quick clicks on one rod never overwrite each other. */
  function updateRod(rod: number, next: (d: number) => number) {
    setDigits((prev) => prev.map((x, i) => (i === rod ? next(x) : x)));
  }
  function toggleHeaven(rod: number) {
    updateRod(rod, (d) => (d >= 5 ? d - 5 : d + 5));
  }
  /** Clicking a lowered earth bead raises it with every bead above it; a raised one drops with those below. */
  function clickEarth(rod: number, k: number) {
    updateRod(rod, (d) => {
      const earth = d % 5;
      return d - earth + (k < earth ? k : k + 1);
    });
  }
  function changeRods(n: number) {
    // Keep the number right-aligned so the ones rod stays the ones rod.
    setDigits((prev) => {
      const padded = [...Array(Math.max(0, n - prev.length)).fill(0), ...prev];
      return padded.slice(padded.length - n);
    });
    setRods(n);
  }
  function showNumber(raw: string) {
    const clean = raw.replace(/\D/g, "").slice(-rods);
    if (!clean) return;
    setDigits(clean.padStart(rods, "0").split("").map(Number));
  }
  function newChallenge() {
    const len = 1 + Math.floor(Math.random() * Math.min(rods, 6));
    let n = String(1 + Math.floor(Math.random() * 9));
    for (let i = 1; i < len; i++) n += String(Math.floor(Math.random() * 10));
    setDigits(Array(rods).fill(0));
    setShowValue(false);
    setTarget(formatDigits(n.split("").map(Number)));
  }

  return (
    <div>
      {/* controls */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div
          className="bg-ink text-abacus font-mono text-2xl sm:text-3xl font-bold rounded-xl px-5 py-2.5 tabular-nums min-w-[9ch] text-center"
          aria-live="polite"
          aria-label={showValue ? `Abacus reads ${value}` : "Value hidden"}
        >
          {showValue ? value : "• • •"}
        </div>
        <button
          onClick={() => setShowValue((s) => !s)}
          className="bg-white border border-line hover:border-green-mid text-green text-xs font-bold rounded-lg px-3.5 py-2.5 transition-colors"
          aria-pressed={!showValue}
        >
          {showValue ? "Hide number" : "Show number"}
        </button>
        <button
          onClick={() => {
            setDigits(Array(rods).fill(0));
            setTarget(null);
          }}
          className="bg-white border border-line hover:border-green-mid text-green text-xs font-bold rounded-lg px-3.5 py-2.5 transition-colors"
        >
          Clear
        </button>
        <label className="flex items-center gap-2 text-xs font-bold text-ink-soft">
          Rods
          <select
            value={rods}
            onChange={(e) => changeRods(Number(e.target.value))}
            className="bg-white border border-line rounded-lg px-2 py-2 text-ink"
          >
            {ROD_CHOICES.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            showNumber(entry);
            setTarget(null);
          }}
          className="flex items-center gap-2"
        >
          <label htmlFor="abacus-set" className="sr-only">Show a number on the abacus</label>
          <input
            id="abacus-set"
            inputMode="numeric"
            placeholder="e.g. 4072"
            value={entry}
            onChange={(e) => setEntry(e.target.value.replace(/\D/g, "").slice(0, rods))}
            className="w-28 bg-white border border-line focus:border-green-mid rounded-lg px-3 py-2 text-sm focus:outline-none"
          />
          <button className="bg-green hover:bg-green-deep text-white text-xs font-bold rounded-lg px-3.5 py-2.5 transition-colors">
            Show on abacus
          </button>
        </form>
      </div>

      {/* challenge */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <button
          onClick={newChallenge}
          className="bg-abacus hover:bg-abacus-deep text-ink text-xs font-extrabold rounded-lg px-4 py-2.5 transition-colors"
        >
          {target ? "New challenge" : "Challenge me!"}
        </button>
        {target && (
          <p className="text-sm font-bold text-ink" aria-live="polite">
            {solved ? (
              <span className="text-green">Correct — that’s {target}! 🎉</span>
            ) : (
              <>Make <span className="font-mono text-lg text-crimson-ink">{target}</span> on the abacus</>
            )}
          </p>
        )}
      </div>

      {/* the soroban */}
      <div ref={frame} className="overflow-x-auto rounded-2xl">
        <div className={`inline-block bg-[#1c1c1c] rounded-2xl p-3 sm:p-4 shadow-xl ${solved ? "ring-4 ring-abacus" : ""}`}>
          <div className="flex bg-[#2a2a2a] rounded-md px-1">
            {digits.map((d, rod) => {
              const fromRight = rods - 1 - rod;
              const heaven = d >= 5;
              const earth = d % 5;
              const place = placeName(fromRight);
              return (
                <div key={rod} className="relative w-[46px] flex flex-col items-center">
                  {/* rod */}
                  <span className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[3px] bg-[#b9b9b9]" aria-hidden />
                  {/* heaven deck */}
                  <div className="relative w-full" style={{ height: HEAVEN_H }}>
                    <button
                      type="button"
                      onClick={() => toggleHeaven(rod)}
                      aria-label={`${place} rod, heaven bead (5) ${heaven ? "counted" : "not counted"}`}
                      aria-pressed={heaven}
                      className="soroban-bead"
                      style={{ transform: `translate(-50%, ${heaven ? HEAVEN_H - BEAD_H - 3 : 3}px)` }}
                    />
                  </div>
                  {/* beam */}
                  <div className="relative w-full h-2.5 bg-[#d9d9d9]" aria-hidden>
                    {fromRight % 3 === 0 && (
                      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#1c1c1c]" />
                    )}
                  </div>
                  {/* earth deck */}
                  <div className="relative w-full" style={{ height: EARTH_H }}>
                    {[0, 1, 2, 3].map((k) => {
                      const raised = k < earth;
                      return (
                        <button
                          type="button"
                          key={k}
                          onClick={() => clickEarth(rod, k)}
                          aria-label={`${place} rod, earth bead ${k + 1} ${raised ? "counted" : "not counted"}`}
                          aria-pressed={raised}
                          className="soroban-bead"
                          style={{ transform: `translate(-50%, ${3 + (raised ? k : k + 1) * BEAD_H}px)` }}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex px-1 mt-1.5" aria-hidden>
            {digits.map((d, rod) => (
              <span key={rod} className="w-[46px] text-center font-mono text-xs font-bold text-white/60 tabular-nums">
                {showValue ? d : ""}
              </span>
            ))}
          </div>
        </div>
      </div>
      <p className="mt-3 text-xs text-ink-soft max-w-2xl">
        Click a lower (earth) bead to push it up to the beam — it’s worth 1. Click the upper (heaven) bead to bring it
        down — it’s worth 5. Click a counted bead again to move it away. The dots on the beam mark the ones,
        thousands and millions rods.
      </p>
    </div>
  );
}
