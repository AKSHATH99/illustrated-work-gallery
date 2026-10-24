/**
 * Pixel data for the hero's miniature workspace.
 *
 * The grid is 120x60 cells and is rendered `calc(var(--companion-size) * 7.5)`
 * wide, so one cell is exactly 1/16 of the companion sprite: scene and
 * character always share one pixel size, at every breakpoint. Colours are the
 * companion's own tokens, and the monitor's screen is left open so the page
 * shows through it instead of a filled panel.
 *
 * Nothing here draws the character. `SEAT` is the desk edge it sits on — the
 * companion itself takes that spot, which is why the scene has no mascot of its
 * own and can never leave one behind.
 */

export type Tone = "body" | "shade" | "accent";

export type Motion = "cursor" | "leaf" | "steam";

export interface SceneCell {
  x: number;
  y: number;
  w: number;
  h: number;
  tone: Tone;
  /** Cells with a motion are animated individually; everything else is merged. */
  motion?: Motion;
}

export const SCENE_COLS = 120;
export const SCENE_ROWS = 60;

/** Desk edge the companion sits on, exactly one sprite box wide. */
export const SEAT = { x: 72, y: 44, w: 16 };

export const SCENE_CELLS: SceneCell[] = [
  // Desk: a plank thick enough to hide the legs of whatever sits behind it, two
  // legs, and a dashed floor line.
  { x: 14, y: 44, w: 91, h: 2, tone: "body" },
  { x: 14, y: 46, w: 91, h: 1, tone: "shade" },
  { x: 20, y: 47, w: 3, h: 9, tone: "body" },
  { x: 98, y: 47, w: 3, h: 9, tone: "body" },
  { x: 10, y: 56, w: 3, h: 2, tone: "shade" },
  { x: 34, y: 56, w: 3, h: 2, tone: "shade" },
  { x: 58, y: 56, w: 3, h: 2, tone: "shade" },
  { x: 82, y: 56, w: 3, h: 2, tone: "shade" },
  { x: 106, y: 56, w: 3, h: 2, tone: "shade" },

  // Monitor: bezel, stand, foot.
  { x: 32, y: 22, w: 31, h: 2, tone: "body" },
  { x: 32, y: 38, w: 31, h: 2, tone: "body" },
  { x: 32, y: 24, w: 2, h: 14, tone: "body" },
  { x: 61, y: 24, w: 2, h: 14, tone: "body" },
  { x: 44, y: 40, w: 7, h: 2, tone: "body" },
  { x: 39, y: 42, w: 17, h: 2, tone: "body" },

  // Four lines of text, and the cursor that blinks after the last one.
  { x: 37, y: 26, w: 11, h: 2, tone: "shade" },
  { x: 37, y: 29, w: 6, h: 2, tone: "shade" },
  { x: 45, y: 29, w: 7, h: 2, tone: "shade" },
  { x: 37, y: 32, w: 14, h: 2, tone: "shade" },
  { x: 37, y: 35, w: 5, h: 2, tone: "shade" },
  { x: 43, y: 35, w: 2, h: 2, tone: "accent", motion: "cursor" },

  // Plant: pot and three blades, the shortest of which sways.
  { x: 14, y: 39, w: 10, h: 2, tone: "shade" },
  { x: 15, y: 41, w: 8, h: 3, tone: "body" },
  { x: 15, y: 33, w: 2, h: 6, tone: "body", motion: "leaf" },
  { x: 18, y: 29, w: 2, h: 10, tone: "body" },
  { x: 21, y: 31, w: 2, h: 8, tone: "body" },

  // Mug, with one puff of steam that comes and goes.
  { x: 92, y: 38, w: 7, h: 1, tone: "shade" },
  { x: 92, y: 39, w: 6, h: 5, tone: "body" },
  { x: 98, y: 40, w: 2, h: 2, tone: "body" },
  { x: 94, y: 35, w: 2, h: 2, tone: "shade", motion: "steam" },

  // One stray pixel above the desk, like a thought it is having.
  { x: 89, y: 22, w: 2, h: 2, tone: "shade" },
];

export const TONE_VARS: Record<Tone, string> = {
  body: "var(--companion-body)",
  shade: "var(--companion-shade)",
  accent: "var(--accent)",
};

/** Merge the still cells into one path command per colour. */
export function staticPaths(): { tone: Tone; d: string }[] {
  const byTone = new Map<Tone, string[]>();
  for (const cell of SCENE_CELLS) {
    if (cell.motion) continue;
    const parts = byTone.get(cell.tone) ?? [];
    parts.push(`M${cell.x} ${cell.y}h${cell.w}v${cell.h}h-${cell.w}z`);
    byTone.set(cell.tone, parts);
  }
  return [...byTone].map(([tone, parts]) => ({ tone, d: parts.join("") }));
}
