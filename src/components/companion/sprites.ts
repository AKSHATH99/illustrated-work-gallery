/**
 * Pixel-art data for the page companion.
 *
 * Every pose is drawn on the same 16x16 grid with the same proportions, so a
 * pose change never alters the silhouette's size or its perch line. Rows are
 * merged into horizontal runs and emitted as one path per colour.
 *
 * Grid map: "." empty · "B" body · "S" shade · "E" eye
 */

export type PoseKey =
  "stand" | "blink" | "look" | "walkA" | "walkB" | "air" | "squash" | "sit" | "sitSway" | "rest";

export type Facing = "left" | "right";

export const GRID_SIZE = 16;

const PALETTE: Record<string, string> = {
  B: "var(--companion-body)",
  S: "var(--companion-shade)",
  E: "var(--companion-eye)",
};

const BLANK = "................";
const EAR = "....BB....BB....";

/** Rows 4-9 — head with two 2x2 eyes (cols 5-6, 9-10) and a mouth (cols 7-8). */
const HEAD_TOP = "....BBBBBBBB....";
const HEAD_EYES = "....BEEBBEEB....";
const HEAD_SHUT = "....BSBBBBSB....";
const HEAD_MOUTH = "....BBBSSBBB....";
/** Glance to the side: eyes and mouth pushed toward the facing edge. */
const HEAD_LOOK_EYES = "....BBBBEBEB....";
const HEAD_LOOK_MOUTH = "....BBBBBSSB....";

/** Rows 10-12 — shoulders, torso, hips. */
const BODY_SHOULDERS = "....BBBBBBBB....";
const BODY_TORSO = ".....BBBBBB.....";
const BODY_SIT_ARMS = "....SBBBBBBS....";

/** Rows 13-15 — legs and feet. */
const LEGS_STAND = [".....BB..BB.....", ".....BB..BB.....", ".....SS..SS....."];
const LEGS_DANGLE = ["......BB..BB....", "......BB..BB....", "......SS..SS...."];
const LEGS_SWAY = [".....BB...BB....", ".....BB...BB....", ".....SS...SS...."];
const LEGS_WIDE = ["....BB....BB....", "....BB....BB....", "....SS....SS...."];
const LEGS_TOGETHER = ["......BBBB......", "......BB.BB.....", "......SS.SS....."];
const LEGS_TUCKED = ["....BB....BB....", "....SS....SS....", BLANK];

/** Mid-jump arms (wider shoulders). */
const BODY_AIR = [BODY_SHOULDERS, "...BBBBBBBBBB...", BODY_TORSO];

/** Landing squash: ears flattened, everything wider and four rows shorter. */
const SQUASH = [
  BLANK,
  BLANK,
  BLANK,
  EAR,
  "...BBBBBBBBBB...",
  "...BEEBBBEEBB...",
  "...BBBBBBBBBB...",
  "...BBBSSSSBBB...",
  "..BBBBBBBBBBBB..",
  "...BBBBBBBBBB...",
  "...BB......BB...",
  "...BB......BB...",
  "...SS......SS...",
  BLANK,
  BLANK,
  BLANK,
];

function head(mouth: string, eyes: string): string[] {
  return [HEAD_TOP, HEAD_TOP, eyes, eyes, mouth, HEAD_TOP];
}

function body(arms: string = BODY_SHOULDERS): string[] {
  return [arms, BODY_TORSO, BODY_TORSO];
}

function frame(
  legs: string[],
  opts?: { eyes?: string; mouth?: string; arms?: string; body?: string[] },
): string[] {
  return [
    BLANK,
    BLANK,
    EAR,
    EAR,
    ...head(opts?.mouth ?? HEAD_MOUTH, opts?.eyes ?? HEAD_EYES),
    ...(opts?.body ?? body(opts?.arms)),
    ...legs,
  ];
}

export interface Pose {
  rows: string[];
  /** Grid row that rests on the perch: feet for most poses, hips when sitting. */
  anchorRow: number;
}

export const POSES: Record<PoseKey, Pose> = {
  stand: { rows: frame(LEGS_STAND), anchorRow: 15 },
  blink: { rows: frame(LEGS_STAND, { eyes: HEAD_SHUT }), anchorRow: 15 },
  look: {
    rows: frame(LEGS_STAND, { eyes: HEAD_LOOK_EYES, mouth: HEAD_LOOK_MOUTH }),
    anchorRow: 15,
  },
  walkA: { rows: frame(LEGS_WIDE), anchorRow: 15 },
  walkB: { rows: frame(LEGS_TOGETHER), anchorRow: 15 },
  air: {
    rows: [BLANK, BLANK, EAR, EAR, ...head(HEAD_MOUTH, HEAD_EYES), ...BODY_AIR, ...LEGS_TUCKED],
    anchorRow: 14,
  },
  squash: { rows: SQUASH, anchorRow: 12 },
  sit: { rows: frame(LEGS_DANGLE, { arms: BODY_SIT_ARMS }), anchorRow: 12 },
  sitSway: { rows: frame(LEGS_SWAY, { arms: BODY_SIT_ARMS }), anchorRow: 12 },
  rest: { rows: frame(LEGS_DANGLE, { arms: BODY_SIT_ARMS, eyes: HEAD_SHUT }), anchorRow: 12 },
};

export interface PosePath {
  fill: string;
  d: string;
}

const cache = new Map<PoseKey, PosePath[]>();

/** Merge each pose's pixels into one path command per colour. */
export function posePaths(pose: PoseKey): PosePath[] {
  const cached = cache.get(pose);
  if (cached) return cached;

  const runs = new Map<string, string[]>();
  POSES[pose].rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const pixel = row[x] as string;
      const fill = pixel === "." ? undefined : PALETTE[pixel];
      if (!fill) {
        x += 1;
        continue;
      }
      let run = 1;
      while (row[x + run] === pixel) run += 1;
      const list = runs.get(fill) ?? [];
      list.push(`M${x} ${y}h${run}v1h-${run}z`);
      runs.set(fill, list);
      x += run;
    }
  });

  const paths = [...runs].map(([fill, parts]) => ({ fill, d: parts.join("") }));
  cache.set(pose, paths);
  return paths;
}
