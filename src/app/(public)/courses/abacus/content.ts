/**
 * Static copy for the Abacus mini-site (FR-ABC-02). Levels, books and class sessions come from
 * the API; this is the reading material that does not change per semester.
 */

export type AboutBlock =
  | { kind: "p"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "table"; head: string[]; rows: string[][] }
  | { kind: "diagram" };

export type AboutTopic = {
  slug: string;
  title: string;
  summary: string;
  sections: { heading: string; blocks: AboutBlock[] }[];
};

/** The seven topics in the order the school's design lists them. */
export const ABOUT_TOPICS: AboutTopic[] = [
  {
    slug: "what-is-abacus",
    title: "What is Abacus",
    summary: "A frame of rods and sliding beads — the calculator children can see and touch.",
    sections: [
      {
        heading: "A calculator made of beads",
        blocks: [
          {
            kind: "p",
            text: "An abacus is a counting frame: a set of vertical rods held in a frame, with beads that slide up and down each rod. Every rod stands for one place value — ones, tens, hundreds and so on — and the beads on it show a single digit. Moving beads towards the centre bar adds value; moving them away takes it off.",
          },
          {
            kind: "p",
            text: "At BCSK we teach the Japanese soroban. Each rod carries one upper bead worth 5 and four lower beads worth 1 each, so any digit from 0 to 9 can be shown with a single, unambiguous pattern. Children read a number on the soroban exactly the way they write it — left to right.",
          },
        ],
      },
      {
        heading: "More than a tool",
        blocks: [
          {
            kind: "p",
            text: "The physical abacus is only the first stage. As children practise, they begin to picture the beads in their mind and calculate without touching anything — mental arithmetic. The abacus is the bridge that turns abstract numbers into something a child can see, and then into something they can imagine.",
          },
          {
            kind: "list",
            items: [
              "Makes place value concrete: a child sees why 40 and 4 are different.",
              "Uses both hands and both eyes, so learning is physical as well as mental.",
              "Works for every age — our Level 0 starts at five years old.",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "mental-arithmetic",
    title: "What is Mental Arithmetic",
    summary: "Calculating with an imagined abacus — known in Japanese as anzan.",
    sections: [
      {
        heading: "The abacus in your mind",
        blocks: [
          {
            kind: "p",
            text: "Mental arithmetic (anzan, 暗算) is calculation using a visualised abacus. After enough hands-on practice, a student stops needing the real tool: they picture the soroban, move its beads in their imagination, and read the answer off the mental image.",
          },
          {
            kind: "p",
            text: "Because the mental image follows exactly the same rules as the physical beads, the method is reliable — students are not guessing or estimating, they are running the same procedure they practised with their fingers, only faster.",
          },
        ],
      },
      {
        heading: "How students get there",
        blocks: [
          {
            kind: "list",
            items: [
              "Bead work — calculating on the real abacus with correct finger technique.",
              "Shadow practice — moving the fingers in the air as if the abacus were there.",
              "Visualisation — closing the eyes and seeing the beads move.",
              "Flash anzan — adding numbers that flash on a screen, entirely in the head.",
            ],
          },
          {
            kind: "p",
            text: "Our Fun Abacus games are built around this last stage: numbers appear, and the child keeps the running total on their mental abacus.",
          },
        ],
      },
    ],
  },
  {
    slug: "history",
    title: "History of Abacus",
    summary: "From lines in the sand to the Japanese soroban — 4,000 years of counting.",
    sections: [
      {
        heading: "Counting boards",
        blocks: [
          {
            kind: "p",
            text: "The earliest abacuses were counting boards: lines drawn in sand or carved in stone, with pebbles moved between them. Traders in Mesopotamia used them around 2,500 BCE, and the Greeks and Romans followed. The Latin word for a pebble, calculus, gives us the word ‘calculate’.",
          },
        ],
      },
      {
        heading: "From China to Japan",
        blocks: [
          {
            kind: "table",
            head: ["When", "Where", "What changed"],
            rows: [
              ["c. 2500 BCE", "Mesopotamia", "Counting boards with lines and pebbles"],
              ["c. 300 BCE", "Greece & Rome", "Grooved metal boards with sliding counters"],
              ["c. 1200 CE", "China", "The suanpan: 2 upper and 5 lower beads per rod"],
              ["c. 1600 CE", "Japan", "The soroban arrives from China"],
              ["1930s", "Japan", "Modern soroban: 1 upper and 4 lower beads — the one we teach"],
            ],
          },
          {
            kind: "p",
            text: "The Japanese removed the beads that were never strictly needed. With one 5-bead and four 1-beads, every digit has exactly one representation, which makes the soroban faster to operate and far easier to picture in the mind.",
          },
        ],
      },
      {
        heading: "The abacus today",
        blocks: [
          {
            kind: "p",
            text: "Electronic calculators replaced the abacus in shops, but not in classrooms. Across Japan, Korea, China, India and beyond, the soroban is taught to children for what it does to their thinking — concentration, memory and number sense — rather than as a way to get an answer.",
          },
        ],
      },
    ],
  },
  {
    slug: "why-abacus",
    title: "Why Abacus",
    summary: "Speed with numbers is the visible result; focus and confidence are the real ones.",
    sections: [
      {
        heading: "What children gain",
        blocks: [
          {
            kind: "list",
            items: [
              "Concentration — a bead moved carelessly gives a wrong answer, so attention is trained every minute.",
              "Memory — holding a mental abacus exercises working memory directly.",
              "Visualisation — picturing beads builds the same skill used in geometry and science.",
              "Speed and accuracy — trained students add long columns of numbers in seconds.",
              "Confidence — mastering something that looks like magic changes how a child feels about maths.",
              "Listening skills — dictation sums require careful listening and quick response.",
            ],
          },
        ],
      },
      {
        heading: "Why it suits BCSK families",
        blocks: [
          {
            kind: "p",
            text: "Numbers are the same in Bangla, English and Korean. The abacus gives children growing up between languages a shared, visual way of understanding maths that supports their school work in both Korea and the Bangladeshi NCTB curriculum.",
          },
        ],
      },
    ],
  },
  {
    slug: "features",
    title: "Features of Abacus",
    summary: "What makes the soroban simple enough for a five-year-old and powerful enough for an adult.",
    sections: [
      {
        heading: "Designed for clarity",
        blocks: [
          {
            kind: "list",
            items: [
              "One heaven bead (5) and four earth beads (1) per rod — every digit 0–9 has one pattern.",
              "Place value by position — each rod to the left is worth ten times more.",
              "Unit markers on the beam every third rod — for reading thousands and millions at a glance.",
              "Bicone (diamond-edged) beads — they stop firmly and are easy to flick with a fingertip.",
              "A clear ‘zero’ — when all beads rest away from the beam, the rod reads 0.",
              "Works for all four operations, and for decimals and square roots at higher levels.",
            ],
          },
        ],
      },
      {
        heading: "Our programme",
        blocks: [
          {
            kind: "list",
            items: [
              "Eight levels, Level 0 to Level 7, each with a Student Book and a Work Book.",
              "Weekly online classes with a dedicated abacus teacher.",
              "A virtual abacus and Fun Abacus games for practice at home.",
              "Game scores saved to each student’s progress report.",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "calculation-techniques",
    title: "Abacus Calculation Techniques",
    summary: "Finger technique, small friends, big friends — the building blocks of every sum.",
    sections: [
      {
        heading: "Finger technique",
        blocks: [
          {
            kind: "table",
            head: ["Movement", "Finger"],
            rows: [
              ["Push earth beads up (add 1–4)", "Thumb"],
              ["Pull earth beads down (take away 1–4)", "Index finger"],
              ["Move the heaven bead down or up (add or take away 5)", "Index finger"],
            ],
          },
          {
            kind: "p",
            text: "Using the right finger for each movement from the very first lesson is what later makes the mental abacus fast — the hand and the picture learn the same habits.",
          },
        ],
      },
      {
        heading: "Small friends (partners of 5)",
        blocks: [
          {
            kind: "p",
            text: "When there are not enough earth beads to add a number directly, use its small friend: add 5 and take away the friend. To add 4 to 3, you cannot push up four more earth beads, so bring down the heaven bead (+5) and remove one earth bead (−1).",
          },
          {
            kind: "table",
            head: ["Add", "Small friend", "Do this"],
            rows: [
              ["+1", "4", "+5 −4"],
              ["+2", "3", "+5 −3"],
              ["+3", "2", "+5 −2"],
              ["+4", "1", "+5 −1"],
            ],
          },
        ],
      },
      {
        heading: "Big friends (partners of 10)",
        blocks: [
          {
            kind: "p",
            text: "When a rod cannot hold the result, carry to the next rod on the left: add 10 there and take away the big friend here. To add 7 to 5, take away 3 on this rod and add 1 on the tens rod.",
          },
          {
            kind: "table",
            head: ["Add", "Big friend", "Do this"],
            rows: [
              ["+9", "1", "−1 +10"],
              ["+8", "2", "−2 +10"],
              ["+7", "3", "−3 +10"],
              ["+6", "4", "−4 +10"],
              ["+5", "5", "−5 +10"],
            ],
          },
          {
            kind: "p",
            text: "Subtraction uses the same friends in reverse. Once small and big friends are automatic, multi-digit addition and subtraction are just the same moves on more rods — and multiplication and division follow at Levels 3 and 4.",
          },
        ],
      },
    ],
  },
  {
    slug: "parts-of-abacus",
    title: "Parts of Abacus Tool",
    summary: "Frame, beam, rods, heaven beads, earth beads and unit markers.",
    sections: [
      {
        heading: "The soroban, labelled",
        blocks: [{ kind: "diagram" }],
      },
      {
        heading: "What each part does",
        blocks: [
          {
            kind: "table",
            head: ["Part", "What it does"],
            rows: [
              ["Frame", "Holds the rods; the base the abacus rests on."],
              ["Beam (reckoning bar)", "The horizontal bar. A bead counts only when it touches the beam."],
              ["Rods", "One rod per place value: ones, tens, hundreds… increasing to the left."],
              ["Heaven bead", "The single bead above the beam, worth 5."],
              ["Earth beads", "The four beads below the beam, worth 1 each."],
              ["Unit markers", "Dots on the beam every third rod, marking ones, thousands and millions."],
            ],
          },
          {
            kind: "p",
            text: "To clear the abacus, tilt it towards you so all beads fall down, lay it flat, then run the index finger along the beam from left to right to push every heaven bead up. Every rod now reads zero.",
          },
        ],
      },
    ],
  },
];

export function topicBySlug(slug: string) {
  return ABOUT_TOPICS.find((t) => t.slug === slug) ?? null;
}

/**
 * Fun Abacus themes (FR-ABC-07). Every theme runs the same chain-sum engine — the school's
 * design shows nine scenes around one "4 + 27 + 2 ?" question — so a theme is purely visual.
 * `id` is what `GameScore.game` stores; `balloon-pop` and `treasure-hunt` predate this page and
 * are kept so existing scores still group correctly.
 */
export type GameTheme = {
  id: string;
  name: string;
  tagline: string;
  token: string;
  /** CSS background for the play field. */
  scene: string;
  /** Answer-token fill and number colour — every pair clears 4.5:1. */
  fill: string;
  ink: string;
  shape: "hex" | "circle" | "heart" | "star" | "balloon" | "leaf" | "box";
};

export const GAME_THEMES: GameTheme[] = [
  {
    id: "honey-hive",
    name: "Honey Hive",
    tagline: "Land the bee on the honeycomb with the answer.",
    token: "🐝",
    scene: "linear-gradient(180deg,#8a5a2b 0%,#6b4220 100%)",
    fill: "#f7c948",
    ink: "#171717",
    shape: "hex",
  },
  {
    id: "fish-pond",
    name: "Fish Pond",
    tagline: "Catch the fish swimming with the right total.",
    token: "🐟",
    scene: "radial-gradient(ellipse at 50% 55%,#bfe9f7 0%,#7cc6e6 45%,#3f8f5a 46%,#2f6f45 100%)",
    fill: "#ffffff",
    ink: "#171717",
    shape: "circle",
  },
  {
    id: "choco-bar",
    name: "Choco Bar",
    tagline: "Pick the chocolate square that matches.",
    token: "🍫",
    scene: "linear-gradient(180deg,#e7843a 0%,#b5541c 100%)",
    fill: "#5a2d17",
    ink: "#ffffff",
    shape: "box",
  },
  {
    id: "football",
    name: "Football Goal",
    tagline: "Kick the ball with the right number into the net.",
    token: "⚽",
    scene: "repeating-linear-gradient(90deg,#3f9b3f 0 48px,#378c37 48px 96px)",
    fill: "#8f3f0c",
    ink: "#ffffff",
    shape: "circle",
  },
  {
    id: "star-lake",
    name: "Star Lake",
    tagline: "Grab the golden star floating on the lake.",
    token: "⭐",
    scene: "linear-gradient(180deg,#9fd8f0 0%,#9fd8f0 40%,#5aa9d6 41%,#3d8fc0 100%)",
    fill: "#f7c948",
    ink: "#171717",
    shape: "star",
  },
  {
    id: "heart-cookies",
    name: "Heart Cookies",
    tagline: "Choose the cookie with the answer baked in.",
    token: "🍪",
    scene: "linear-gradient(180deg,#bfe6f5 0%,#bfe6f5 45%,#7cbf5a 46%,#5ea343 100%)",
    fill: "#6b3a1f",
    ink: "#ffffff",
    shape: "heart",
  },
  {
    id: "balloon-pop",
    name: "Balloon Pop",
    tagline: "Pop the balloon carrying the total.",
    token: "🎈",
    scene: "linear-gradient(180deg,#7fd0f5 0%,#bfe9fb 70%,#8cc63f 71%,#6aa92c 100%)",
    fill: "#e01f35",
    ink: "#ffffff",
    shape: "balloon",
  },
  {
    id: "treasure-hunt",
    name: "Treasure Hunt",
    tagline: "Open the treasure chest with the right code.",
    token: "💰",
    scene: "linear-gradient(180deg,#d9a35b 0%,#a8702f 100%)",
    fill: "#4a2a10",
    ink: "#f7c948",
    shape: "box",
  },
  {
    id: "strawberry-patch",
    name: "Strawberry Patch",
    tagline: "Pick the ripe strawberry with the answer.",
    token: "🍓",
    scene: "linear-gradient(180deg,#fbe36b 0%,#f6c94a 100%)",
    fill: "#e01f35",
    ink: "#ffffff",
    shape: "leaf",
  },
];

export function difficultyFor(level: number) {
  // Terms per question and the largest number that may appear, by abacus level.
  const terms = Math.min(2 + Math.floor((level + 1) / 2), 6);
  const max = level < 1 ? 9 : level < 3 ? 30 : level < 5 ? 99 : 999;
  return { terms, max, subtract: level >= 1 };
}
