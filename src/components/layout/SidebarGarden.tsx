/**
 * A garden bed along the sidebar's footer rule: two round bushes standing in a
 * thin strip of meadow.
 *
 * The rule is the ground. A two-cell lawn runs its whole width, its edge broken
 * by the odd taller blade, and two bushes sit in it at uneven intervals. Each
 * bush is three overlapping clumps shaded with the same light the footer scenery
 * uses — an index ramp along the top-left light, a dark base and a shaded right
 * side — so it reads as leaves rather than one flat mass. Two flowers grow out of
 * every crown.
 *
 * Every tone comes from the theme's landscape palette, so the bed follows the
 * site theme on its own — and keeps its colour while the theme sheet covers the
 * page, so it never changes in view.
 */

/** The leaf ramp, darkest at the base to brightest at the crown. */
const LEAF = [
  "var(--landscape-foliage-shade)",
  "var(--landscape-foliage)",
  "var(--landscape-bush)",
  "var(--landscape-foliage-light)",
  "var(--landscape-meadow-light)",
];

/** Grass, stem and petal tones, all from the palette in src/styles.css. */
const TONES: Record<string, string> = {
  s: "var(--landscape-bush-shade)",
  g: "var(--landscape-meadow)",
  G: "var(--landscape-meadow-light)",
  x: "var(--landscape-soil-light)",
  y: "var(--landscape-flower-gold)",
  Y: "var(--landscape-moon)",
  r: "var(--landscape-flower-red)",
  R: "var(--landscape-flower-gold)",
  i: "var(--landscape-flower-lilac)",
  I: "var(--landscape-flower-gold)",
};

const COLUMNS = 78;
const ROWS = 14;
const BASE = ROWS - 1;
/** The lawn is the last two rows; the row above them is where blades may reach. */
const LAWN = BASE - 1;

/** Deterministic scatter, so the bed is drawn the same on every render. */
function scatter(n: number) {
  const value = Math.sin(n * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

/** The two bushes: where they stand and which flowers grow out of them. */
const BUSHES = [
  {
    cx: 21,
    flowers: [
      { dx: -2, row: 1, petal: "y", centre: "Y" },
      { dx: 2, row: 2, petal: "r", centre: "R" },
    ],
  },
  {
    cx: 57,
    flowers: [
      { dx: -3, row: 2, petal: "i", centre: "I" },
      { dx: 1, row: 1, petal: "y", centre: "Y" },
    ],
  },
] as const;

type Blob = readonly [cx: number, cy: number, r: number];

/**
 * Two side clumps under a taller middle one, as the footer bushes are built.
 * The seed nudges the clumps a little, so the two bushes are never twins.
 */
function blobs(cx: number, seed: number): Blob[] {
  const nudge = (n: number) => (scatter(seed * 17 + n) - 0.5) * 0.7;
  return [
    [cx - 3.2 + nudge(1), 9.8 + nudge(2) * 0.5, 4 + nudge(3) * 0.4],
    [cx + 3.2 + nudge(4), 9.8 + nudge(5) * 0.5, 4 + nudge(6) * 0.4],
    [cx + nudge(7) * 0.6, 8.4 + nudge(8) * 0.5, 4.6 + nudge(9) * 0.4],
  ];
}

function blobAt(blobs: Blob[], x: number, y: number): Blob | null {
  for (let i = blobs.length - 1; i >= 0; i -= 1) {
    const blob = blobs[i];
    if (!blob) continue;
    const [bx, by, r] = blob;
    if ((x - bx) ** 2 + (y - by) ** 2 <= r * r) return blob;
  }
  return null;
}

/**
 * Every leaf cell with its ramp step. Light falls from the top-left, so a cell
 * is brighter the further it faces that way; the base is set dark, the right
 * edge shaded and the top lit, which is what makes the clumps read as leaves.
 */
const LEAVES = new Map<string, number>();
BUSHES.forEach((bush, index) => {
  const clumps = blobs(bush.cx, index + 1);
  for (let y = 0; y <= LAWN; y += 1) {
    for (let x = bush.cx - 8; x <= bush.cx + 8; x += 1) {
      const blob = blobAt(clumps, x, y);
      if (!blob) continue;
      const [bx, by, r] = blob;
      const facing = -((x - bx) * 0.55 + (y - by) * 0.85) / r;
      const value = facing * 0.85 + (scatter(x * 7.13 + y * 31.7) - 0.5) * 0.4;
      let step = value > 0.6 ? 4 : value > 0.15 ? 3 : value > -0.2 ? 2 : value > -0.6 ? 1 : 0;
      if (!blobAt(clumps, x, y + 1)) step = 0;
      else if (!blobAt(clumps, x + 1, y) && step > 1) step = 1;
      else if (!blobAt(clumps, x, y - 1) && step < 3) step = 3;
      LEAVES.set(`${x},${y}`, step);
    }
  }
});

/** Topmost leaf in a column, or `LAWN` where no bush stands. */
function bushTop(x: number) {
  for (let y = 0; y < LAWN; y += 1) if (LEAVES.has(`${x},${y}`)) return y;
  return LAWN;
}

/** The lawn's own edge: flat, with the odd blade standing a row or two proud. */
function lawnTop(x: number) {
  const tall = scatter(x + 31);
  if (tall > 0.93 && scatter(x) > 0.5) return LAWN - 2;
  if (tall > 0.8) return LAWN - 1;
  return LAWN;
}

/** Cells painted over the bushes: a short stem, then the flower that tops it. */
function buildMarks() {
  const marks = new Map<string, string>();
  for (const bush of BUSHES) {
    for (const flower of bush.flowers) {
      const x = bush.cx + flower.dx;
      for (let y = flower.row + 2; y <= bushTop(x) - 1; y += 1) marks.set(`${x},${y}`, "s");
      marks.set(`${x},${flower.row - 1}`, flower.petal);
      marks.set(`${x - 1},${flower.row}`, flower.petal);
      marks.set(`${x},${flower.row}`, flower.centre);
      marks.set(`${x + 1},${flower.row}`, flower.petal);
      marks.set(`${x},${flower.row + 1}`, flower.petal);
    }
  }
  return marks;
}

function buildSprite() {
  const marks = buildMarks();

  return Array.from({ length: ROWS }, (_, y) =>
    Array.from({ length: COLUMNS }, (_, x) => {
      const mark = marks.get(`${x},${y}`);
      if (mark) return mark;

      const leaf = LEAVES.get(`${x},${y}`);
      if (leaf !== undefined) return String(leaf);

      const edge = lawnTop(x);
      if (y >= edge) {
        if (y === BASE) return "x";
        return y === edge && edge < LAWN ? "G" : "g";
      }

      return ".";
    }).join(""),
  );
}

const SPRITE = buildSprite();

function toneOf(cell: string) {
  return /^[0-9]$/.test(cell) ? LEAF[Number(cell)] : TONES[cell];
}

type Run = { x: number; y: number; width: number; fill: string };

/** One rect per stretch of one tone, so the bed stays a light DOM. */
const RUNS: Run[] = SPRITE.flatMap((row, y) => {
  const runs: Run[] = [];
  let x = 0;
  while (x < row.length) {
    const fill = toneOf(row[x] ?? "");
    if (!fill) {
      x += 1;
      continue;
    }
    let end = x + 1;
    while (end < row.length && toneOf(row[end] ?? "") === fill) end += 1;
    runs.push({ x, y, width: end - x, fill });
    x = end;
  }
  return runs;
});

export function SidebarGarden({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={`0 0 ${COLUMNS} ${ROWS}`}
      shapeRendering="crispEdges"
      className={className}
    >
      {RUNS.map((run) => (
        <rect
          key={`${run.x}-${run.y}`}
          x={run.x}
          y={run.y}
          width={run.width}
          height="1"
          fill={run.fill}
        />
      ))}
    </svg>
  );
}
