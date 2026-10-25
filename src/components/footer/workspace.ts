/**
 * Pixel data for the footer's expanded workspace — the hero's little desk grown
 * up into a room.
 *
 * The grid unit is deliberately the same one the hero scene uses: a cell is
 * 1/16 of the companion sprite, so the character that starts at the hero desk
 * lands on this one at exactly its own scale, at every breakpoint. The plank is
 * three cells thick for the same reason — that is how far its legs dangle.
 *
 * One drawing, two framings. `WORKSPACE_WIDE` is the whole room;
 * `WORKSPACE_NARROW` crops in on the desk, the monitor and the character's own
 * corner, which is the composition small screens get. Nothing is drawn twice.
 *
 * The screen and the window are left open, so the page shows through them as it
 * does in the hero: the artwork carries no background of its own and blends into
 * either theme.
 */

import type { SceneCell } from "@/components/hero/scene";

export const WORKSPACE_COLS = 376;
export const WORKSPACE_ROWS = 144;

/** Framings as a box in grid units. */
export const WORKSPACE_WIDE = { x: 0, y: 0, w: 376, h: 144 };
export const WORKSPACE_NARROW = { x: 0, y: 8, w: 200, h: 136 };

/** The bare stretch of plank the character lands on, beside the monitor. */
export const WORKSPACE_SEAT = { x: 166, y: 100, w: 16 };

/** Top edge of the desk surface, in grid units. */
export const DESK_SURFACE_Y = 100;

export const WORKSPACE_CELLS: SceneCell[] = [
  // Desk: the long plank, its front edge, two legs, and the dashed floor.
  { x: 14, y: 100, w: 288, h: 2, tone: "body" },
  { x: 14, y: 102, w: 288, h: 1, tone: "shade" },
  { x: 20, y: 103, w: 4, h: 35, tone: "body" },
  { x: 292, y: 103, w: 4, h: 35, tone: "body" },
  { x: 8, y: 138, w: 3, h: 2, tone: "shade" },
  { x: 46, y: 138, w: 3, h: 2, tone: "shade" },
  { x: 84, y: 138, w: 3, h: 2, tone: "shade" },
  { x: 122, y: 138, w: 3, h: 2, tone: "shade" },
  { x: 160, y: 138, w: 3, h: 2, tone: "shade" },
  { x: 198, y: 138, w: 3, h: 2, tone: "shade" },
  { x: 236, y: 138, w: 3, h: 2, tone: "shade" },
  { x: 274, y: 138, w: 3, h: 2, tone: "shade" },
  { x: 312, y: 138, w: 3, h: 2, tone: "shade" },
  { x: 350, y: 138, w: 3, h: 2, tone: "shade" },

  // Window onto the night: frame, two mullions, a sill, and a moon worn on one
  // side. Stars and a few distant lights are the only things out there. It sits
  // high on the wall on purpose — the bare band between the sill and the top of
  // the monitor is what puts the screen in front of it.
  { x: 44, y: 10, w: 132, h: 2, tone: "body" },
  { x: 44, y: 50, w: 132, h: 2, tone: "body" },
  { x: 44, y: 12, w: 2, h: 38, tone: "body" },
  { x: 174, y: 12, w: 2, h: 38, tone: "body" },
  { x: 108, y: 12, w: 2, h: 38, tone: "body" },
  { x: 46, y: 30, w: 128, h: 2, tone: "body" },
  { x: 40, y: 52, w: 136, h: 2, tone: "shade" },
  { x: 148, y: 16, w: 4, h: 1, tone: "body" },
  { x: 148, y: 17, w: 2, h: 1, tone: "body" },
  { x: 147, y: 18, w: 2, h: 2, tone: "body" },
  { x: 148, y: 20, w: 2, h: 1, tone: "body" },
  { x: 148, y: 21, w: 4, h: 1, tone: "body" },
  { x: 60, y: 18, w: 2, h: 2, tone: "shade" },
  { x: 92, y: 14, w: 2, h: 2, tone: "shade" },
  { x: 78, y: 24, w: 2, h: 2, tone: "shade" },
  { x: 124, y: 20, w: 2, h: 2, tone: "shade" },
  { x: 66, y: 38, w: 2, h: 2, tone: "shade" },
  { x: 160, y: 36, w: 2, h: 2, tone: "shade" },
  { x: 118, y: 44, w: 4, h: 6, tone: "shade" },
  { x: 128, y: 46, w: 5, h: 4, tone: "shade" },

  // Monitor: bezel, four lines of something, and the cursor still blinking on
  // the last one.
  { x: 56, y: 68, w: 48, h: 2, tone: "body" },
  { x: 56, y: 92, w: 48, h: 2, tone: "body" },
  { x: 56, y: 70, w: 2, h: 22, tone: "body" },
  { x: 102, y: 70, w: 2, h: 22, tone: "body" },
  { x: 62, y: 74, w: 18, h: 2, tone: "shade" },
  { x: 62, y: 79, w: 10, h: 2, tone: "shade" },
  { x: 76, y: 79, w: 13, h: 2, tone: "shade" },
  { x: 66, y: 84, w: 22, h: 2, tone: "shade" },
  { x: 62, y: 88, w: 8, h: 2, tone: "shade" },
  { x: 72, y: 88, w: 2, h: 2, tone: "accent", motion: "cursor" },
  { x: 76, y: 94, w: 6, h: 2, tone: "body" },
  { x: 66, y: 96, w: 26, h: 4, tone: "body" },

  // Books under the window, and the keyboard and mouse within reach of the
  // character's own corner of the desk. Everything here ends on y=100: the top
  // of the plank, so nothing floats above the surface it rests on.
  { x: 20, y: 97, w: 24, h: 3, tone: "body" },
  { x: 22, y: 94, w: 20, h: 3, tone: "shade" },
  { x: 21, y: 91, w: 22, h: 3, tone: "body" },
  { x: 110, y: 96, w: 36, h: 4, tone: "body" },
  { x: 110, y: 99, w: 36, h: 1, tone: "shade" },
  { x: 152, y: 97, w: 6, h: 3, tone: "body" },
  { x: 152, y: 99, w: 6, h: 1, tone: "shade" },

  // Mug, still steaming, and the lamp switched on for nobody.
  { x: 206, y: 92, w: 8, h: 1, tone: "shade" },
  { x: 206, y: 93, w: 7, h: 7, tone: "body" },
  { x: 213, y: 95, w: 2, h: 3, tone: "body" },
  { x: 208, y: 88, w: 2, h: 2, tone: "shade", motion: "steam" },
  { x: 230, y: 96, w: 16, h: 4, tone: "body" },
  { x: 236, y: 74, w: 3, h: 22, tone: "body" },
  { x: 228, y: 70, w: 8, h: 2, tone: "body" },
  { x: 225, y: 72, w: 14, h: 2, tone: "body" },
  { x: 222, y: 74, w: 20, h: 2, tone: "body" },
  { x: 230, y: 76, w: 4, h: 2, tone: "accent" },

  // Shelf: a few books, something with a light on it that is definitely a
  // server and not a coffee warmer, and one small plant trying to be a tree.
  { x: 200, y: 46, w: 86, h: 2, tone: "body" },
  { x: 200, y: 48, w: 86, h: 1, tone: "shade" },
  { x: 206, y: 34, w: 3, h: 12, tone: "body" },
  { x: 210, y: 32, w: 2, h: 14, tone: "shade" },
  { x: 213, y: 36, w: 4, h: 10, tone: "body" },
  { x: 218, y: 33, w: 2, h: 13, tone: "shade" },
  { x: 246, y: 36, w: 26, h: 2, tone: "body" },
  { x: 246, y: 44, w: 26, h: 2, tone: "body" },
  { x: 246, y: 38, w: 2, h: 6, tone: "body" },
  { x: 270, y: 38, w: 2, h: 6, tone: "body" },
  { x: 250, y: 40, w: 2, h: 2, tone: "accent", motion: "cursor" },
  { x: 256, y: 40, w: 2, h: 2, tone: "shade" },
  { x: 272, y: 40, w: 8, h: 6, tone: "body" },
  { x: 274, y: 32, w: 2, h: 8, tone: "body", motion: "leaf" },
  { x: 278, y: 35, w: 2, h: 5, tone: "body" },

  // The desk plant, from the same family as the hero's: same three blades, same
  // stubby proportions, so it reads as the same species rather than a hedge.
  { x: 252, y: 92, w: 14, h: 2, tone: "shade" },
  { x: 254, y: 94, w: 10, h: 6, tone: "body" },
  { x: 256, y: 84, w: 2, h: 8, tone: "body", motion: "leaf" },
  { x: 259, y: 80, w: 2, h: 12, tone: "body" },
  { x: 262, y: 83, w: 2, h: 9, tone: "body" },

  // Chair, pushed in at the right end of the desk: its seat slips under the
  // plank's tip and its legs land beside the desk's, so the two read as one
  // piece of furniture rather than a stranger standing nearby.
  { x: 300, y: 103, w: 30, h: 3, tone: "body" },
  { x: 300, y: 106, w: 30, h: 1, tone: "shade" },
  { x: 324, y: 85, w: 6, h: 18, tone: "body" },
  { x: 322, y: 83, w: 10, h: 3, tone: "body" },
  { x: 303, y: 107, w: 3, h: 31, tone: "body" },
  { x: 325, y: 107, w: 3, h: 31, tone: "body" },
];
