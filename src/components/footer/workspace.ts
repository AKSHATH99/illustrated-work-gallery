/** Pixel-cell artwork for the footer's panoramic, theme-aware night landscape. */
import type { SceneCell } from "@/components/hero/scene";

export const LANDSCAPE_COLS = 460;
export const LANDSCAPE_ROWS = 128;
export const LANDSCAPE_WIDE = { x: 0, y: 0, w: LANDSCAPE_COLS, h: LANDSCAPE_ROWS };
/** A deliberate mobile crop that keeps the moon, tree, and companion together. */
export const LANDSCAPE_NARROW = { x: 0, y: 0, w: 236, h: LANDSCAPE_ROWS };

/** Open grassy ledge; its top edge is the companion's precise landing surface. */
export const LANDSCAPE_SEAT = { x: 164, y: 84, w: 16 };

const cells: SceneCell[] = [];

function rect(x: number, y: number, w: number, h: number, tone: SceneCell["tone"], motion?: SceneCell["motion"]) {
  cells.push({ x, y, w, h, tone, ...(motion ? { motion } : {}) });
}

function plot(x: number, y: number, rows: string[], tones: Record<string, SceneCell["tone"]>) {
  rows.forEach((row, rowIndex) => {
    let col = 0;
    while (col < row.length) {
      const key = row[col];
      if (key === "." || !key) {
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

// Quiet stars and a small moon, left open so the page itself remains the sky.
[
  [17, 14], [48, 25], [80, 10], [132, 20], [153, 11], [199, 28], [228, 15],
  [266, 22], [296, 12], [347, 24], [378, 9], [410, 18], [444, 12],
].forEach(([x, y], index) => rect(x, y, index % 3 === 0 ? 2 : 1, index % 3 === 0 ? 2 : 1, index % 2 ? "shade" : "body"));
plot(92, 21, ["..BBBB..", ".BBBBBB.", "BBBBBBBB", "BBBBBBBB", ".BBBBBB.", "..BBBB.."], { B: "body" });
plot(96, 21, ["..DD....", ".DDDD...", "DDDDDD..", "DDDDDD..", ".DDDD...", "..DD...."], { D: "background" });

// Far hills: stepped ridgelines and a distant pine silhouette.
plot(0, 39, [
  ".............DDD...............", "..........DDDDDDDD.............",
  "......DDDDDDDDDDDDDD...........", "...DDDDDDDDDDDDDDDDDDDD.........",
  "DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD", "DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD",
], { D: "distant" });
plot(226, 34, [
  "..................DDD.................", "...............DDDDDDDDD...............",
  "............DDDDDDDDDDDDDDD.............", "........DDDDDDDDDDDDDDDDDDDDDDD..........",
  "...DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD",
], { D: "distant" });
plot(278, 44, ["....D....", "...DDD...", "..DDDDD..", ".DDDDDDD.", "...DDD...", "...DDD...", "..DDDD..."], { D: "mid" });
rect(283, 50, 2, 17, "deep");

// Tiny hillside cottages, softly lit but kept secondary to the landscape.
plot(337, 52, ["..BBBBBB..", ".BBBBBBBB.", "BBBBBBBBBB", "BB..BB..BB", "BB..AA..BB", "BBBBBBBBBB", "..BBBBBB.."], { B: "deep", A: "accent" });
plot(405, 58, ["..BBBBBB..", ".BBBBBBBB.", "BBBBBBBBBB", "BB..BB..BB", "BB..AA..BB", "BBBBBBBBBB", "..BBBBBB.."], { B: "deep", A: "accent" });

// Rolling middle ground, layered in broad pixel steps.
rect(0, 67, 77, 8, "mid"); rect(77, 64, 70, 11, "mid");
rect(147, 68, 69, 7, "mid"); rect(216, 62, 83, 13, "mid");
rect(299, 67, 78, 8, "mid"); rect(377, 63, 83, 12, "mid");
rect(0, 75, 460, 7, "ground");
rect(0, 80, 460, 8, "deep");
// A continuous dark undercut gives the terrain a clear layered edge.
rect(0, 88, 460, 8, "deep");
rect(0, 96, 460, 10, "landscape-stone");

// The foreground grass shelf; keep the companion's landing patch uncluttered.
rect(0, 72, 34, 4, "ground"); rect(31, 69, 31, 7, "ground");
rect(58, 73, 34, 3, "ground"); rect(92, 70, 44, 6, "ground");
rect(136, 76, 27, 8, "ground"); rect(163, 84, 20, 2, "accent");
rect(183, 78, 34, 6, "ground"); rect(217, 74, 44, 10, "ground");
rect(261, 77, 41, 7, "ground"); rect(302, 71, 39, 13, "ground");
rect(341, 75, 50, 9, "ground"); rect(391, 69, 69, 15, "ground");
rect(0, 86, 460, 2, "accent");

// Trees, shrubs and small plants spaced across the rolling meadow.
plot(20, 43, ["...DDD...", "..DDDD...", ".DDDDDD..", "DDDDDDDD.", "DDDDDDDD.", ".DDDDDD..", "..DDDD..."], { D: "mid" });
rect(29, 50, 3, 22, "deep"); rect(24, 56, 13, 2, "deep");
plot(67, 65, ["..DDD..", ".DDDDD.", "DDDDDDD", ".DDDDD."], { D: "mid" });
plot(236, 65, ["..DDD..", ".DDDDD.", "DDDDDDD", ".DDDDD."], { D: "mid" });
plot(365, 62, ["...DDD...", "..DDDDD..", ".DDDDDDD.", "DDDDDDDDD", "..DDDDD.."], { D: "mid" });
rect(368, 72, 3, 8, "deep");

// Pixel flowers, fireflies and stepping stones across the foreground.
[
  [10, 82, "accent"], [43, 78, "body"], [73, 83, "accent"], [109, 80, "shade"],
  [128, 83, "body"], [207, 81, "accent"], [246, 82, "body"], [286, 81, "shade"],
  [326, 82, "accent"], [352, 80, "body"], [397, 82, "shade"], [432, 80, "accent"],
].forEach(([x, y, tone]) => {
  const px = Number(x); const py = Number(y);
  rect(px, py, 2, 2, tone as SceneCell["tone"]);
  rect(px, py + 2, 1, 2, "deep");
});
rect(52, 93, 12, 2, "stone"); rect(68, 99, 8, 2, "stone");
rect(228, 95, 10, 2, "stone"); rect(382, 98, 14, 2, "stone");
rect(178, 59, 2, 2, "accent", "cursor");
rect(311, 55, 2, 2, "body", "steam");

export const LANDSCAPE_CELLS = cells;