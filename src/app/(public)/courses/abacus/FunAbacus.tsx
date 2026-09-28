"use client";

import { useEffect, useRef, useState } from "react";
import { recordGameScore } from "./actions";
import { GAME_THEMES, difficultyFor, type GameTheme } from "./content";

const QUESTIONS = 10;
const LEVELS = [0, 1, 2, 3, 4, 5, 6, 7];

type Pick = { kind: "theme"; theme: GameTheme } | { kind: "flash" } | null;

/** FR-ABC-07: nine themed chain-sum games plus Flash Race. Scores save for students (FR-ABC-08). */
export function FunAbacus({ loggedIn }: { loggedIn: boolean }) {
  const [pick, setPick] = useState<Pick>(null);
  const [level, setLevel] = useState(1);

  if (pick?.kind === "theme") {
    return <ThemeGame key={pick.theme.id} theme={pick.theme} level={level} loggedIn={loggedIn} onExit={() => setPick(null)} />;
  }
  if (pick?.kind === "flash") {
    return <FlashRace level={level} loggedIn={loggedIn} onExit={() => setPick(null)} />;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8" role="radiogroup" aria-label="Your abacus level">
        <span className="text-xs font-bold text-ink-soft mr-1">Your level:</span>
        {LEVELS.map((l) => (
          <button
            key={l}
            role="radio"
            aria-checked={level === l}
            onClick={() => setLevel(l)}
            className={`w-9 h-9 rounded-full text-sm font-extrabold transition-colors ${
              level === l ? "bg-green text-white" : "bg-white border border-line text-green hover:border-green-mid"
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {GAME_THEMES.map((t) => (
          <li key={t.id}>
            <button
              onClick={() => setPick({ kind: "theme", theme: t })}
              className="group w-full text-left rounded-2xl overflow-hidden border-4 border-[#8cc63f] bg-[#8cc63f] hover:border-abacus transition-colors"
            >
              <div className="relative h-36" style={{ background: t.scene }}>
                <span className="absolute top-2 left-1/2 -translate-x-1/2 bg-white/95 rounded-full px-3 py-0.5 text-xs font-extrabold text-ink tabular-nums">
                  4 + 27 + 2 ?
                </span>
                <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2" aria-hidden>
                  {[33, 31, 35].map((n) => (
                    <TokenShape key={n} theme={t} value={n} size={46} />
                  ))}
                </div>
                <span className="absolute bottom-1 left-2 text-2xl group-hover:scale-110 transition-transform" aria-hidden>
                  {t.token}
                </span>
              </div>
              <div className="bg-white px-4 py-3">
                <span className="block font-bold text-green">{t.name}</span>
                <span className="block text-xs text-ink-soft">{t.tagline}</span>
              </div>
            </button>
          </li>
        ))}
        <li>
          <button
            onClick={() => setPick({ kind: "flash" })}
            className="group w-full h-full text-left rounded-2xl overflow-hidden border-4 border-green bg-green hover:border-abacus transition-colors"
          >
            <div className="h-36 flex items-center justify-center bg-green-deep">
              <span className="font-display text-6xl font-bold text-abacus group-hover:scale-110 transition-transform" aria-hidden>
                7
              </span>
            </div>
            <div className="bg-white px-4 py-3">
              <span className="block font-bold text-green">⚡ Flash Race</span>
              <span className="block text-xs text-ink-soft">Numbers flash one by one — add them on your mental abacus.</span>
            </div>
          </button>
        </li>
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function TokenShape({ theme, value, size }: { theme: GameTheme; value: number; size: number }) {
  const { fill, ink, shape } = theme;
  const stroke = "rgba(0,0,0,0.35)";
  const text = String(value);
  const fontSize = text.length > 3 ? 22 : text.length > 2 ? 26 : 32;
  const textY = shape === "balloon" ? 44 : shape === "heart" ? 44 : shape === "leaf" ? 56 : 52;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden>
      {shape === "hex" && <path d="M50 4 L92 27 L92 73 L50 96 L8 73 L8 27 Z" fill={fill} stroke={stroke} strokeWidth="3" />}
      {shape === "circle" && <circle cx="50" cy="50" r="44" fill={fill} stroke={stroke} strokeWidth="3" />}
      {shape === "box" && <rect x="8" y="14" width="84" height="72" rx="10" fill={fill} stroke={stroke} strokeWidth="3" />}
      {shape === "heart" && (
        <path
          d="M50 92 C20 72 4 54 4 32 C4 16 16 6 30 6 C40 6 47 12 50 20 C53 12 60 6 70 6 C84 6 96 16 96 32 C96 54 80 72 50 92 Z"
          fill={fill}
          stroke={stroke}
          strokeWidth="3"
        />
      )}
      {shape === "star" && (
        <polygon points="50,2 63,35 98,37 70,59 80,95 50,75 20,95 30,59 2,37 37,35" fill={fill} stroke={stroke} strokeWidth="3" />
      )}
      {shape === "balloon" && (
        <>
          <path d="M50 84 Q46 92 52 99" stroke="#57605b" strokeWidth="2" fill="none" />
          <polygon points="45,86 55,86 50,79" fill={fill} />
          <ellipse cx="50" cy="42" rx="36" ry="40" fill={fill} stroke={stroke} strokeWidth="3" />
          <ellipse cx="36" cy="26" rx="7" ry="11" fill="rgba(255,255,255,0.35)" />
        </>
      )}
      {shape === "leaf" && (
        <>
          <path d="M50 96 C24 82 8 58 10 36 C12 20 30 14 50 18 C70 14 88 20 90 36 C92 58 76 82 50 96 Z" fill={fill} stroke={stroke} strokeWidth="3" />
          <path d="M30 20 L50 4 L70 20 L50 26 Z" fill="#2f7d32" />
        </>
      )}
      <text x="50" y={textY} textAnchor="middle" dominantBaseline="middle" fontSize={fontSize} fontWeight="800" fill={ink}>
        {text}
      </text>
    </svg>
  );
}

type Question = { terms: number[]; answer: number; options: number[] };

function makeQuestion(level: number): Question {
  const { terms: n, max, subtract } = difficultyFor(level);
  const rand = (lo: number, hi: number) => lo + Math.floor(Math.random() * (hi - lo + 1));
  const terms = [rand(1, max)];
  let total = terms[0];
  for (let i = 1; i < n; i++) {
    if (subtract && total > 1 && Math.random() < 0.4) {
      const t = rand(1, Math.min(max, total - 1));
      terms.push(-t);
      total -= t;
    } else {
      const t = rand(1, max);
      terms.push(t);
      total += t;
    }
  }
  // Near misses, including the classic slips: off by one, off by a friend, off by a ten.
  const deltas = [1, -1, 2, -2, 5, -5, 10, -10, 3, -3, 4, -4];
  const options = new Set([total]);
  for (const d of deltas.sort(() => Math.random() - 0.5)) {
    if (options.size === 6) break;
    if (total + d >= 0) options.add(total + d);
  }
  return { terms, answer: total, options: [...options].sort(() => Math.random() - 0.5) };
}

function sumText(terms: number[]) {
  return terms.map((t, i) => (i === 0 ? String(t) : t < 0 ? `− ${-t}` : `+ ${t}`)).join(" ");
}

function clock(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

// Where the six answer tokens sit in the scene, as percentages.
const SLOTS = [
  { left: 17, top: 24 },
  { left: 50, top: 18 },
  { left: 83, top: 24 },
  { left: 22, top: 60 },
  { left: 52, top: 54 },
  { left: 80, top: 62 },
];

function ThemeGame({ theme, level, loggedIn, onExit }: { theme: GameTheme; level: number; loggedIn: boolean; onExit: () => void }) {
  const [phase, setPhase] = useState<"ready" | "playing" | "done">("ready");
  const [question, setQuestion] = useState<Question | null>(null);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [missed, setMissed] = useState(false);
  const [marks, setMarks] = useState<Record<number, "right" | "wrong">>({});
  const [seconds, setSeconds] = useState(0);
  const [saved, setSaved] = useState(false);
  const advance = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (phase !== "playing") return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [phase]);
  useEffect(() => () => { if (advance.current) clearTimeout(advance.current); }, []);

  function start() {
    setPhase("playing");
    setIndex(0);
    setScore(0);
    setCorrect(0);
    setSeconds(0);
    setSaved(false);
    setMissed(false);
    setMarks({});
    setQuestion(makeQuestion(level));
  }

  function choose(n: number) {
    if (!question || phase !== "playing" || marks[n] === "right") return;
    if (n !== question.answer) {
      setMissed(true);
      setMarks((m) => ({ ...m, [n]: "wrong" }));
      return;
    }
    // Full marks first time; half marks after a wrong try — so a child can always finish.
    const gained = missed ? 5 : 10;
    const newScore = score + gained;
    setScore(newScore);
    if (!missed) setCorrect((c) => c + 1);
    setMarks((m) => ({ ...m, [n]: "right" }));
    advance.current = setTimeout(() => {
      if (index + 1 >= QUESTIONS) {
        setPhase("done");
        if (loggedIn) recordGameScore(theme.id, level, newScore).then(() => setSaved(true));
        return;
      }
      setIndex(index + 1);
      setMissed(false);
      setMarks({});
      setQuestion(makeQuestion(level));
    }, 550);
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-3 text-xs font-bold text-ink-soft">
        <button onClick={onExit} className="hover:text-green-mid">← All games</button>
        <span>
          {theme.token} {theme.name} · Level {level}
        </span>
      </div>

      <div className="rounded-3xl border-[6px] border-[#8cc63f] overflow-hidden">
        {/* The question sits above the field, never over it: a Level 7 sum wraps to two lines on a phone. */}
        <div className="bg-[#8cc63f] px-2 pb-1.5 min-h-12 flex items-center justify-center">
          <p
            className="bg-white rounded-2xl px-4 py-1 text-center font-display text-lg sm:text-3xl font-bold text-ink tabular-nums"
            aria-live="polite"
          >
            {phase === "playing" && question ? `${sumText(question.terms)} = ?` : "? + ? + ?"}
          </p>
        </div>
        <div className="relative h-[340px] sm:h-[400px]" style={{ background: theme.scene }}>
          {phase === "ready" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 bg-black/25">
              <span className="text-6xl" aria-hidden>{theme.token}</span>
              <h3 className="mt-3 font-display text-3xl font-semibold text-white drop-shadow">{theme.name}</h3>
              <p className="mt-2 text-sm text-white max-w-sm drop-shadow">
                {theme.tagline} Add the numbers on your mental abacus — {QUESTIONS} questions.
              </p>
              <button onClick={start} className="mt-5 bg-abacus hover:bg-abacus-deep text-ink font-extrabold rounded-xl px-8 py-3 text-sm transition-colors">
                Start
              </button>
            </div>
          )}

          {phase === "playing" && question && (
            <>
              {question.options.map((n, i) => (
                <button
                  key={`${index}-${n}`}
                  onClick={() => choose(n)}
                  aria-label={`Answer ${n}`}
                  data-state={marks[n]}
                  disabled={marks[n] === "wrong"}
                  className="game-token absolute -translate-x-1/2 -translate-y-1/2 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-4 focus-visible:outline-white rounded-full"
                  style={{ left: `${SLOTS[i].left}%`, top: `${SLOTS[i].top}%` }}
                >
                  <span className="block w-[70px] sm:w-[88px] [&_svg]:w-full [&_svg]:h-auto">
                    <TokenShape theme={theme} value={n} size={88} />
                  </span>
                </button>
              ))}
              <span className="absolute bottom-2 left-3 text-4xl" aria-hidden>{theme.token}</span>
            </>
          )}

          {phase === "done" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 bg-black/35">
              <span className="text-6xl" aria-hidden>{correct >= 9 ? "🏆" : correct >= 6 ? "🌟" : "💪"}</span>
              <h3 className="mt-3 font-display text-4xl font-semibold text-white drop-shadow">{score} points</h3>
              <p className="mt-1 text-sm text-white drop-shadow">
                {correct} of {QUESTIONS} first time · {clock(seconds)}
              </p>
              {loggedIn ? (
                saved && <p className="mt-1 text-sm font-bold text-abacus drop-shadow">Saved to your progress report ✓</p>
              ) : (
                <p className="mt-1 text-xs text-white/90">Log in as a student to save your scores.</p>
              )}
              <div className="mt-5 flex gap-3">
                <button onClick={start} className="bg-abacus hover:bg-abacus-deep text-ink font-extrabold rounded-xl px-6 py-2.5 text-sm transition-colors">
                  Play again
                </button>
                <button onClick={onExit} className="bg-white hover:bg-mist text-green font-bold rounded-xl px-6 py-2.5 text-sm transition-colors">
                  Other games
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="bg-[#8cc63f] px-4 py-2 flex justify-between text-xs font-extrabold text-ink tabular-nums">
          <span>Question {Math.min(index + 1, QUESTIONS)}/{QUESTIONS}</span>
          <span>Time {clock(seconds)}</span>
          <span>Score {score}</span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function FlashRace({ level, loggedIn, onExit }: { level: number; loggedIn: boolean; onExit: () => void }) {
  const [phase, setPhase] = useState<"ready" | "flashing" | "answer" | "done">("ready");
  const [numbers, setNumbers] = useState<number[]>([]);
  const [current, setCurrent] = useState<number | null>(null);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [input, setInput] = useState("");
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);
  const [saved, setSaved] = useState(false);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timeouts.current.forEach(clearTimeout), []);

  function startRound() {
    const { max } = difficultyFor(level);
    const count = 3 + Math.min(round, 4); // 4..7 numbers
    const top = Math.min(max, 99);
    const nums = Array.from({ length: count }, () => Math.floor(Math.random() * top) + 1);
    setNumbers(nums);
    setPhase("flashing");
    setInput("");
    setLastCorrect(null);
    const speed = Math.max(1000 - round * 100, 500);
    nums.forEach((n, i) => {
      // A blank frame between numbers, so two equal numbers in a row still read as two.
      timeouts.current.push(setTimeout(() => setCurrent(n), i * speed));
      timeouts.current.push(setTimeout(() => setCurrent(null), i * speed + speed * 0.8));
    });
    timeouts.current.push(setTimeout(() => setPhase("answer"), nums.length * speed));
  }

  async function check() {
    const correct = Number(input) === numbers.reduce((a, b) => a + b, 0);
    setLastCorrect(correct);
    const newScore = correct ? score + numbers.length * 10 : score;
    if (correct) setScore(newScore);
    if (round >= 5) {
      setPhase("done");
      if (loggedIn) {
        await recordGameScore("flash-race", level, newScore);
        setSaved(true);
      }
    } else {
      setRound(round + 1);
      setPhase("ready");
    }
  }

  return (
    <div className="max-w-3xl mx-auto bg-white border border-line rounded-3xl p-8 text-center">
      <div className="flex items-center justify-between mb-6 text-xs font-bold text-ink-soft">
        <button onClick={onExit} className="hover:text-green-mid">← All games</button>
        <span>
          Level {level} · Round {Math.min(round, 5)} / 5 · Score {score}
        </span>
      </div>

      {phase === "ready" && (
        <>
          <p className="text-sm text-ink-soft mb-5">
            {round === 1
              ? "Numbers will flash one at a time. Add them in your head!"
              : lastCorrect
                ? "Correct! 🎉 The next round is faster…"
                : `Not quite — it was ${numbers.reduce((a, b) => a + b, 0)}. Next round!`}
          </p>
          <button onClick={startRound} className="bg-green-mid hover:bg-green text-white font-bold rounded-lg px-8 py-3 text-sm transition-colors">
            {round === 1 ? "Start Flash Race" : `Start round ${round}`}
          </button>
        </>
      )}

      {phase === "flashing" && (
        <div className="h-36 flex items-center justify-center">
          <span className="font-display text-7xl font-bold text-green tabular-nums" aria-live="assertive">
            {current ?? ""}
          </span>
        </div>
      )}

      {phase === "answer" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            check();
          }}
          className="flex flex-col items-center gap-4"
        >
          <label htmlFor="flash-answer" className="text-sm font-bold text-ink">What is the total?</label>
          <input
            id="flash-answer"
            autoFocus
            inputMode="numeric"
            value={input}
            onChange={(e) => setInput(e.target.value.replace(/\D/g, ""))}
            className="text-center font-display text-3xl font-bold text-green border-2 border-line focus:border-green-mid rounded-xl px-4 py-2 w-40 focus:outline-none"
          />
          <button className="bg-crimson hover:bg-crimson-deep text-white font-bold rounded-lg px-8 py-2.5 text-sm transition-colors">
            Check ✓
          </button>
        </form>
      )}

      {phase === "done" && (
        <>
          <p className="text-5xl" aria-hidden>{score >= 200 ? "🏆" : score >= 120 ? "🌟" : "💪"}</p>
          <h3 className="mt-3 font-display text-3xl font-semibold text-green">{score} points</h3>
          <p className="mt-2 text-sm text-ink-soft">
            {lastCorrect ? "Finished with a correct answer — brilliant anzan!" : "Great effort — keep training that mental abacus!"}
            {saved && <span className="block mt-1 text-green font-bold">Saved to your progress report ✓</span>}
            {!loggedIn && <span className="block mt-1">Log in as a student to save your scores.</span>}
          </p>
          <button
            onClick={() => { setRound(1); setScore(0); setPhase("ready"); setSaved(false); }}
            className="mt-5 bg-green hover:bg-green-deep text-white text-sm font-bold rounded-lg px-6 py-2.5 transition-colors"
          >
            Play again
          </button>
        </>
      )}
    </div>
  );
}
