/** Hand-built pixel cells for the footer's layered night landscape. */
import type { SceneCell, Tone } from "@/components/hero/scene";

export const LANDSCAPE_COLS = 480;
export const LANDSCAPE_ROWS = 150;
export const LANDSCAPE_WIDE = { x: 0, y: 0, w: LANDSCAPE_COLS, h: LANDSCAPE_ROWS };
/** Mobile window keeps the moon, layered woodland, and the companion together. */
export const LANDSCAPE_NARROW = { x: 72, y: 0, w: 240, h: LANDSCAPE_ROWS };

/** Clear grassy ledge; the companion's feet land precisely on its top edge. */
export const LANDSCAPE_SEAT = { x: 242, y: 115, w: 18 };

const cells: SceneCell[] = [];

function rect(x: number, y: number, w: number, h: number, tone: Tone, motion?: SceneCell["motion"]) {
  cells.push({ x, y, w, h, tone, ...(motion ? { motion } : {}) });
}

/** Read a small pixel map as runs, keeping the authored shapes crisp and compact. */
function plot(x: number, y: number, rows: string[], tones: Record<string, Tone>) {
  rows.forEach((row, rowIndex) => {
    let col = 0;
    while (col < row.length) {
      const key = row[col];
      if (!key || key === ".") {
        col += 1;
        continue;
      }
      let length = 1;
      while (row[col + length] === key) length += 1;
      const tone = tones[key];
      if (tone) rect(x + col, y + rowIndex, length, 1, tone);
      col += length;
    }
  });
}

// Night sky, with a quiet scatter of stars and a softly cut-out crescent moon.
rect(0, 0, LANDSCAPE_COLS, LANDSCAPE_ROWS, "sky");
[
  [12, 17, 1], [29, 34, 2], [51, 9, 1], [69, 27, 1], [89, 14, 2], [117, 35, 1],
  [139, 11, 1], [158, 28, 2], [187, 18, 1], [210, 7, 1], [275, 16, 2], [296, 36, 1],
  [318, 8, 1], [347, 24, 2], [371, 12, 1], [397, 33, 1], [420, 13, 2], [452, 28, 1],
].forEach(([x, y, size], i) => rect(x, y, size, size, i % 4 === 0 ? "star-bright" : "star"));
plot(91, 27, [
  "....MMMM....",
  "..MMMMMMMM..",
  ".MMMMMMMMMM.",
  "MMMMMMMMMMMM",
  "MMMMMMMMMMMM",
  ".MMMMMMMMMM.",
  "..MMMMMMMM..",
  "....MMMM....",
], { M: "moon" });
plot(42, 39, ["....CCC....", "..CCCCCCC..", ".CCCCCCCCC.", "CCCCCCCCCCC", "..CCCCCCC.."], { C: "cloud" });
plot(345, 43, ["...CCC...", ".CCCCCCC.", "CCCCCCCCC", "..CCCCC.."], { C: "cloud" });

// Blue-green ridges and distant pines create a low, uneven horizon.
plot(0, 51, [
  "....................DDD.................................................",
  ".................DDDDDDDD.............DDD...............................",
  "..............DDDDDDDDDDDDD.........DDDDDDD....................DDD......",
  "...........DDDDDDDDDDDDDDDDDD.....DDDDDDDDDDD...............DDDDDDD....",
  "......DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD..........DDDDDDDDDDD..",
  "..DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD",
], { D: "distant" });
plot(0, 65, [
  "..............................................MMMMM.....................",
  ".................MMMM.................MMMMMMMMMMMMMMMM.................",
  ".............MMMMMMMMMMMM.........MMMMMMMMMMMMMMMMMMMMMMMM..............",
  ".......MMMMMMMMMMMMMMMMMMMMM...MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM.........",
  "..MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM",
], { M: "hill-back" });

// A scattered line of far cottages; their tiny amber windows are the only warmth.
plot(354, 68, ["..WWWWWW..", ".WWWWWWWW.", "WWWWWWWWWW", "WW..WW..WW", "WW..AA..WW", "WWWWWWWWWW", "..WWWWWW.."], { W: "wood", A: "window" });
plot(422, 76, ["..WWWWWW..", ".WWWWWWWW.", "WWWWWWWWWW", "WW..WW..WW", "WW..AA..WW", "WWWWWWWWWW"], { W: "wood", A: "window" });

// Middle hills: layered stepped silhouettes, shaded in bands rather than flat blocks.
plot(0, 77, [
  ".........................HHHH...........................................",
  ".....................HHHHHHHHHHHH.......................HHH.............",
  ".................HHHHHHHHHHHHHHHHHH.................HHHHHHHHHH..........",
  ".............HHHHHHHHHHHHHHHHHHHHHHHH......HHHHHHHHHHHHHHHHHHHH.........",
  ".......HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH......",
  "..HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH",
], { H: "hill" });
plot(0, 86, [
  ".........................LLLL...........................................",
  ".....................LLLLLLLLLLLL.......................LLL.............",
  ".................LLLLLLLLLLLLLLLLLL.................LLLLLLLLLL..........",
  ".............LLLLLLLLLLLLLLLLLLLLLLLL......LLLLLLLLLLLLLLLLLLLL.........",
  ".......LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL......",
], { L: "hill-light" });

// A winding path threads between the cabin and the lower meadow.
plot(0, 101, [
  "........................................................................",
  ".......................................................PPPP.............",
  "..................................................PPPPPPPP..............",
  ".............................................PPPPPPPP...................",
  "........................................PPPPPP..........................",
], { P: "path" });

// Large old tree at left: layered boughs, shaded inner foliage, branch and trunk.
plot(47, 62, [
  ".............FFFFF.............",
  ".........FFFFFFFFFFFFF.........",
  "......FFFFFFFFFFFFFFFFFFF......",
  "....FFFFFFFFFFFFFFFFFFFFFFFF...",
  "..FFFFFFFFFFffffFFFFFFFFFFFFF..",
  ".FFFFFFFFFfffffffFFFFFFFFFFFFF.",
  "FFFFFFFFFfffffffffFFFFFFFFFFFFFF",
  "FFFFFFFFFffffffffFFFFFFFFFFFFFFF",
  ".FFFFFFFffffffffFFFFFFFFFFFFFFF.",
  "...FFFFFfffffffFFFFFFFFFFFFF...",
  "......FFFFFFFFFFFFFFFFFFFF......",
], { F: "foliage", f: "foliage-shade" });
rect(67, 72, 5, 35, "bark");
rect(59, 84, 6, 3, "bark"); rect(73, 79, 8, 3, "bark");
plot(48, 78, ["..SS...SS....", ".SSS..SSS....", "SSSS.SSSS...."], { S: "foliage-light" });

// A slimmer pine, opposite the open landing, breaks the canopy line.
plot(309, 69, [
  "...........PP...........",
  "..........PPPP..........",
  ".........PPPPPP.........",
  "........PPPPPPPP........",
  ".......PPPPPPPPPP.......",
  "......PPPPPPPPPPPP......",
  ".....PPPPPPPPPPPPPP.....",
  "....PPPPPPPPPPPPPPPP....",
  "...PPPPPPPPPPPPPPPPPP...",
], { P: "pine" });
rect(319, 91, 5, 24, "bark");
plot(312, 80, ["...LL....LL...", "..LLL...LLL...", ".LLLLL.LLLLL.."], { L: "foliage-light" });

// Mid-distance shrubs and small clusters soften the hill edges.
plot(104, 93, ["....GGG....", "..GGGGGGG..", ".GGGggGGGGG.", "GGGGgggGGGGG", ".GGGGGGGGGG."], { G: "bush", g: "bush-shade" });
plot(350, 96, ["...GGGG...", ".GGGGGGGG.", "GGGGggGGGG", ".GGGGGGGG."], { G: "bush", g: "bush-shade" });
plot(28, 104, ["..GGG..", ".GGGGG.", "GGGgGGG", ".GGGGG."], { G: "bush", g: "bush-shade" });

// A small woodland cabin with a peaked roof, lit window, door and rising smoke.
plot(383, 87, [
  "........RRRRRR........",
  "......RRRRRRRRRR......",
  "....RRRRRRRRRRRRRR....",
  "..RRRRRRRRRRRRRRRRRR..",
  "..WWWWWWWWWWWWWWWWWW..",
  "..WWWWWWWWWWWWWWWWWW..",
  "..WW..AA..WWWWWWWWWW..",
  "..WW..AA..WWWWDDWWWW..",
  "..WWWWWWWWWWWWDDWWWW..",
  "..WWWWWWWWWWWWDDWWWW..",
], { R: "roof", W: "wood", A: "window", D: "door" });
plot(395, 80, ["....SS..", "...SS...", "....SS.."], { S: "smoke" });
rect(392, 97, 2, 3, "foliage-light"); rect(411, 99, 2, 2, "star-bright");

// Irregular foreground shelves, with an untouched patch reserved for the visitor's companion.
plot(0, 108, [
  "...........GGGGG.........................................................",
  "......GGGGGGGGGGGG..............GGGGG.................................",
  "..GGGGGGGGGGGGGGGGGGG......GGGGGGGGGGGGG.............GGGGGGGGGG........",
  "GGGGGGGGGGGGGGGGGGGGGGGG..GGGGGGGGGGGGGGGGG...GGGGGGGGGGGGGGGGGGGGGGGG",
], { G: "ground" });
plot(0, 115, [
  "...MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM",
  "MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM",
], { M: "meadow" });
// Measured perch: no plant, flower, or texture may cross its top edge.
rect(LANDSCAPE_SEAT.x, LANDSCAPE_SEAT.y, LANDSCAPE_SEAT.w, 2, "meadow-light");
rect(0, 117, 480, 8, "soil");
plot(0, 125, [
  "....TTT............TTTT...............................TTT..............",
  "..TTTTTTT.......TTTTTTTTT..............TTTT........TTTTTTTT............",
  "TTTTTTTTTT....TTTTTTTTTTTT..........TTTTTTTT....TTTTTTTTTTTT...........",
], { T: "soil-light" });
rect(0, 140, 480, 10, "sky");

// Individual grasses, flowers, mushrooms, stones and glints, unevenly grouped.
[
  [13, 112], [38, 115], [93, 109], [119, 114], [145, 111], [285, 110],
  [330, 114], [368, 110], [442, 112], [462, 115],
].forEach(([x, y], i) => {
  rect(x, y, 1, 3 + (i % 2), i % 3 === 0 ? "foliage-light" : "ground-light");
  if (i % 2 === 0) rect(x + 1, y + 1, 1, 2, "foliage-light");
});
[
  [19, 113, "flower-gold"], [55, 116, "flower-red"], [84, 112, "flower-lilac"],
  [132, 116, "flower-gold"], [177, 112, "flower-lilac"], [295, 115, "flower-red"],
  [342, 112, "flower-gold"], [430, 115, "flower-lilac"],
].forEach(([x, y, tone]) => {
  const px = Number(x); const py = Number(y); const color = tone as Tone;
  rect(px, py, 2, 2, color); rect(px + 1, py - 1, 1, 1, "star-bright");
  rect(px, py + 2, 1, 2, "bush-shade");
});
plot(24, 124, ["...MM..", "..MMMM.", ".MMMMMM", "..MMMM."], { M: "mushroom" });
rect(155, 129, 10, 2, "stone"); rect(170, 133, 7, 2, "stone");
rect(301, 130, 12, 2, "stone"); rect(456, 132, 8, 2, "stone");
[
  [77, 99], [167, 75], [236, 102], [282, 88], [338, 57], [465, 91],
].forEach(([x, y], i) => rect(x, y, 1, 1, i % 2 === 0 ? "star-bright" : "window"));

export const LANDSCAPE_CELLS = cells;