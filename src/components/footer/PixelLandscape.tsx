import { useEffect, useLayoutEffect, useMemo, useState } from "react";

/**
 * Pixel landscape — the panoramic countryside that closes the page.
 *
 * Night brings the moon, twinkling stars, glowing windows, a lit lantern and
 * fireflies; day brings the sun, light shafts, birds, tea pickers, a kid with a
 * kite and butterflies. The sky is left transparent so the page's own
 * background shows through, and the bottom rows dither out into whatever sits
 * below the strip.
 *
 * The artwork is one flat grid: a scene cell is one SVG unit, so the art stays
 * crisp at any strip height. Nothing here draws the companion — the landing
 * rect marks the grass surface it stands on (see `data-companion-anchor`).
 */

const W = 480;
const H = 75;
const GROUND = 61;
const ORB = { x: 250, y: 29, r: 8 };
const SEED = 7;

/** Flat, unobstructed patch of grass reserved for the companion (scene units). */
const LANDING_ZONE = { x: 226, y: GROUND, width: 28 };

type SceneMode = "dark" | "light";
type ModeSetting = SceneMode | "auto" | "system";

interface Palette {
  orbHi: string;
  orb: string;
  orbShade: string;
  orbDetail: string;
  orbHalo: string;
  cloudHi: string;
  cloud: string;
  cloudLo: string;
  farHi: string;
  far: string;
  farPine: string;
  farPineHi: string;
  midHi: string;
  mid: string;
  midLo: string;
  nearHi: string;
  near: string;
  nearLo: string;
  tea: string;
  teaHi: string;
  teaLo: string;
  grassTip: string;
  grassHi: string;
  grass: string;
  grassLo: string;
  grassDk: string;
  soil: string;
  soilLo: string;
  soilDk: string;
  pebble: string;
  leaf: string[];
  leafFar: string[];
  trunkHi: string;
  trunk: string;
  trunkLo: string;
  wallHi: string;
  wall: string;
  wallLo: string;
  roofHi: string;
  roof: string;
  roofLo: string;
  stone: string;
  stoneLo: string;
  win: string;
  winHi: string;
  winLo: string;
  door: string;
  iron: string;
  wood: string;
  woodHi: string;
  woodLo: string;
  rock: string;
  rockHi: string;
  rockLo: string;
  smoke: string;
  sparkle: string;
}

const PALETTES: Record<SceneMode, Palette> = {
  dark: {
    orbHi: "#fffbe6",
    orb: "#efe7c8",
    orbShade: "#d2c8a5",
    orbDetail: "#bdb38f",
    orbHalo: "rgba(240,232,200,0.14)",
    cloudHi: "#2b4b3c",
    cloud: "#213e31",
    cloudLo: "#193226",
    farHi: "#1e3e31",
    far: "#17332a",
    farPine: "#122a22",
    farPineHi: "#1a382c",
    midHi: "#27543e",
    mid: "#1c4231",
    midLo: "#163728",
    nearHi: "#307049",
    near: "#204f37",
    nearLo: "#19402d",
    tea: "#2d6846",
    teaHi: "#3d8458",
    teaLo: "#15352a",
    grassTip: "#7ccb86",
    grassHi: "#52a668",
    grass: "#3b8653",
    grassLo: "#2b6840",
    grassDk: "#1e4f31",
    soil: "#173b28",
    soilLo: "#112f20",
    soilDk: "#0c2518",
    pebble: "#2b4c3a",
    leaf: ["#0e2d1f", "#194831", "#246342", "#347e54", "#4c9b66", "#73bd80"],
    leafFar: ["#11301f", "#173d2c", "#1d4936", "#245640", "#2c654b", "#2c654b"],
    trunkHi: "#70513a",
    trunk: "#4f3827",
    trunkLo: "#33251b",
    wallHi: "#3c4762",
    wall: "#2d364c",
    wallLo: "#222939",
    roofHi: "#4b5b76",
    roof: "#2b3347",
    roofLo: "#1c2231",
    stone: "#3b4253",
    stoneLo: "#2a2f3c",
    win: "#f6c453",
    winHi: "#ffe8a3",
    winLo: "#c98f2c",
    door: "#4b3425",
    iron: "#26303a",
    wood: "#5c4231",
    woodHi: "#7d5c42",
    woodLo: "#3a2a1f",
    rock: "#4c5b53",
    rockHi: "#6c7d73",
    rockLo: "#34413b",
    smoke: "rgba(180,198,188,0.55)",
    sparkle: "#f4e27a",
  },
  light: {
    orbHi: "#fff8d6",
    orb: "#ffd75e",
    orbShade: "#f5b83d",
    orbDetail: "#ffe58f",
    orbHalo: "rgba(255,214,102,0.30)",
    cloudHi: "#ffffff",
    cloud: "#f2f6f1",
    cloudLo: "#d5e2d8",
    farHi: "#9ccca4",
    far: "#86ba91",
    farPine: "#6ea57c",
    farPineHi: "#8fc296",
    midHi: "#78b882",
    mid: "#62a36d",
    midLo: "#54925f",
    nearHi: "#6bb874",
    near: "#47935a",
    nearLo: "#3c834e",
    tea: "#57a865",
    teaHi: "#86cb8b",
    teaLo: "#337342",
    grassTip: "#c2ec8f",
    grassHi: "#97d673",
    grass: "#72bd5d",
    grassLo: "#5aa24b",
    grassDk: "#438543",
    soil: "#6e5236",
    soilLo: "#5c442c",
    soilDk: "#4b3724",
    pebble: "#8d6e4f",
    leaf: ["#235c34", "#2f7a43", "#3f9652", "#57ad62", "#7cc77a", "#a9e19b"],
    leafFar: ["#4f8d5f", "#5d9c6b", "#6baa77", "#79b783", "#87c28f", "#87c28f"],
    trunkHi: "#a37b52",
    trunk: "#7c583a",
    trunkLo: "#573c27",
    wallHi: "#d2a575",
    wall: "#ad8055",
    wallLo: "#875d3d",
    roofHi: "#dc735c",
    roof: "#b8503f",
    roofLo: "#8a382d",
    stone: "#a3a9b0",
    stoneLo: "#80868e",
    win: "#cfe8f5",
    winHi: "#ffffff",
    winLo: "#93b8cc",
    door: "#6b4a30",
    iron: "#3a4148",
    wood: "#9b7350",
    woodHi: "#c49c70",
    woodLo: "#6e4f35",
    rock: "#9aa59e",
    rockHi: "#c6cec8",
    rockLo: "#77837c",
    smoke: "rgba(120,130,125,0.40)",
    sparkle: "#fff7cc",
  },
};

/** Colours shared by both modes — the things that are the same colour by day. */
const SHARED = {
  capRed: "#c8443a",
  capHi: "#ea6b5c",
  spot: "#f5ecd6",
  stem: "#e6dcc2",
  stemLo: "#bfb293",
  berry: "#d64545",
  berryHi: "#ff7a6b",
  skin: ["#f1c7a0", "#c68e5f", "#8d5a3b"],
  shirt: ["#d9534f", "#3f7fbf", "#e0b040", "#8a5cc2", "#f4f4f0", "#3aa17e"],
  pants: ["#3b4a6b", "#5a4632", "#2f3640"],
  hair: ["#3a2a1f", "#1f1f24", "#8a5a2e", "#d9b35a"],
  straw: "#e3c06a",
  basket: "#8a6238",
  bird: "#33403b",
  dog: "#b07a48",
  dogLo: "#7d5330",
  kite: "#e5534b",
  kiteHi: "#ffd166",
  string: "rgba(70,70,70,0.55)",
};

const PETALS: [string, string][] = [
  ["#e5735a", "#f2c14e"],
  ["#f2c14e", "#fff3c4"],
  ["#a78bdb", "#f2c14e"],
  ["#eef0e2", "#f2c14e"],
  ["#e98aa6", "#fff3c4"],
];

const FLOWER_SPRITES = [
  [".a.", "aba", ".a.", ".s.", "ss."],
  ["a.a", "aba", ".s.", ".ss"],
  [".a.", "aaa", "a.a", ".s."],
  ["b", "a", "s", "s"],
];

const MUSHROOM = [".hrr.", "hwrwr", "rrrrr", ".SsS.", "..s.."];
const MUSHROOM_SMALL = [".h...", "hrr..", ".s.h.", ".shrr", "...s."];
const ROCK = ["..hh..", ".hrrr.", "hrrrrl", "rrrrll"];
const LANTERN = [".k.", "kkk", "kwk", "kWk", "kkk"];

/** People and animals (day only). h hair/hat, s skin, c shirt, p pants, b basket. */
const PERSON = [".hh.", ".ss.", "cccc", "sccs", ".pp.", ".pp."];
const FARMER = [".hh..", "hhhh.", ".ss..", "cccb.", "sccbb", ".pp..", ".pp.."];
const SITTER = [".hh.", ".ss.", "cccc", "scc.", ".ppp", "...p"];
const KID = ["..hh", "..ss", "sccc", "..cc", "..pp"];
const DOG = ["....dd", "tdddd.", ".D..D."];
const KITE = ["..a..", ".aba.", "aabaa", ".aba.", "..a..", "..t..", "...t.", "..t.."];
const WALK_A = [".hh.", ".ss.", ".cc.", "scc.", ".pp.", "p..p"];
const WALK_B = [".hh.", ".ss.", ".cc.", ".ccs", ".pp.", ".pp."];
const BIRD_UP = ["x...x", ".x.x.", "..x.."];
const BIRD_DOWN = [".....", ".xxx.", "x...x"];
const BUTTERFLY_A = ["a.a", ".b."];
const BUTTERFLY_B = ["...", "aba"];

/** One merged run of same-coloured cells. */
interface SceneRect {
  x: number;
  y: number;
  w: number;
  h: number;
  c: string;
}

interface Pixel {
  x: number;
  y: number;
  c: string;
}

interface Star {
  x: number;
  y: number;
  big: boolean;
  delay: string;
}

interface Sparkle {
  x: number;
  y: number;
  delay: string;
}

interface LitWindow {
  x: number;
  y: number;
  s: number;
}

interface Point {
  x: number;
  y: number;
}

interface Ray {
  rects: { x: number; y: number; w: number }[];
  delay: string;
}

interface Bird {
  dx: number;
  dy: number;
  phase: string;
}

interface Flock {
  y: number;
  dur: number;
  delay: number;
  birds: Bird[];
}

interface Butterfly {
  x: number;
  y: number;
  a: string;
  delay: string;
}

/** Sprite letters — h hair, s skin, c shirt, p pants, b basket — to colours. */
interface PersonPalette {
  [letter: string]: string;
  h: string;
  s: string;
  c: string;
  p: string;
  b: string;
}

interface Walker {
  y: number;
  key: PersonPalette;
}

interface Scene {
  rects: SceneRect[];
  palette: Palette;
  stars: Star[];
  sparkles: Sparkle[];
  windows: LitWindow[];
  smoke: Point[];
  lamps: Point[];
  rays: Ray[];
  birds: Flock[];
  butterflies: Butterfly[];
  walkers: Walker[];
}

/** Indexed lookup that keeps the scatter readable under `noUncheckedIndexedAccess`. */
const at = <T,>(items: readonly T[], index: number): T => items[index] as T;

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Sprite rows -> list of single pixels, for the animated overlays. */
function spritePixels(rows: readonly string[], key: Record<string, string>): Pixel[] {
  const px: Pixel[] = [];
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const colour = key[row[x] ?? ""];
      if (row[x] !== "." && colour) px.push({ x, y, c: colour });
    }
  });
  return px;
}

const hillFar = (x: number) => 35 + 3.5 * Math.sin(x * 0.021 + 1) + 2.5 * Math.sin(x * 0.057 + 2);
const hillMid = (x: number) => 46 + 3.5 * Math.sin(x * 0.017 + 4) + 2 * Math.sin(x * 0.049);
const hillNear = (x: number) =>
  59 - 24 / (1 + ((x - 388) / 72) ** 4) - 7 * Math.exp(-(((x - 40) / 45) ** 2));

function buildScene(seed: number, mode: SceneMode): Scene {
  const C = PALETTES[mode];
  const day = mode === "light";
  // `rand` drives the layout and is consumed identically in both modes, so the
  // scene keeps the same shape when the theme flips. Day-only extras use `extra`.
  const rand = mulberry32(seed);
  const extra = mulberry32(seed + 101);
  const buf = new Array<null | string>(W * H).fill(null);
  const fx = {
    stars: [] as Star[],
    sparkles: [] as Sparkle[],
    windows: [] as LitWindow[],
    smoke: [] as Point[],
    lamps: [] as Point[],
    rays: [] as Ray[],
    birds: [] as Flock[],
    butterflies: [] as Butterfly[],
    walkers: [] as Walker[],
  };

  const set = (x: number, y: number, colour: null | string | undefined) => {
    const cx = Math.round(x);
    const cy = Math.round(y);
    if (colour && cx >= 0 && cx < W && cy >= 0 && cy < H) buf[cy * W + cx] = colour;
  };
  const sprite = (x: number, y: number, rows: readonly string[], key: Record<string, string>) =>
    rows.forEach((row, j) => {
      for (let i = 0; i < row.length; i++) {
        const ch = row[i];
        const colour = ch ? key[ch] : undefined;
        if (ch !== "." && colour) set(x + i, y + j, colour);
      }
    });
  const inClearing = (x: number, pad = 0) =>
    x >= LANDING_ZONE.x - pad && x < LANDING_ZONE.x + LANDING_ZONE.width + pad;
  const groundTop = (x: number) =>
    inClearing(x, 3)
      ? GROUND
      : GROUND - (Math.sin(x * 0.11) + Math.sin(x * 0.037 + 1) > 1.1 ? 1 : 0);
  const pickPerson = (): PersonPalette => ({
    h: at(SHARED.hair, Math.floor(extra() * SHARED.hair.length)),
    s: at(SHARED.skin, Math.floor(extra() * SHARED.skin.length)),
    c: at(SHARED.shirt, Math.floor(extra() * SHARED.shirt.length)),
    p: at(SHARED.pants, Math.floor(extra() * SHARED.pants.length)),
    b: SHARED.basket,
  });

  /* ---------- sky ---------- */
  for (let i = 0; i < 75; i++) {
    const star: Star = {
      x: Math.floor(rand() * W),
      y: Math.floor(rand() * 32),
      big: rand() < 0.14,
      delay: (rand() * 4).toFixed(2),
    };
    if (!day) fx.stars.push(star);
  }

  /* moon by night, sun by day */
  const { x: ox, y: oy, r: R } = ORB;
  for (let y = -R - 4; y <= R + 4; y++) {
    for (let x = -R - 4; x <= R + 4; x++) {
      const d = Math.hypot(x, y);
      if (d <= R + 0.3) {
        const s = (x + y) / R;
        let colour = C.orb;
        if (s < -0.8) colour = C.orbHi;
        else if (s > 0.75) colour = C.orbShade;
        else if (s > 0.4 && (x + y) % 2 === 0) colour = C.orbShade;
        set(ox + x, oy + y, colour);
      } else if (d > R + 1 && d <= R + 3.6 && (x + y) % 2 === 0) {
        set(ox + x, oy + y, C.orbHalo);
      }
    }
  }
  if (day) {
    for (let a = 0; a < 16; a++) {
      const angle = (a / 16) * Math.PI * 2;
      const len = a % 2 ? 2 : 4;
      for (let d = R + 3; d < R + 3 + len; d++)
        set(ox + Math.cos(angle) * d, oy + Math.sin(angle) * d, a % 2 ? C.orbShade : C.orb);
    }
    for (let y = -2; y <= 2; y++)
      for (let x = -2; x <= 2; x++)
        if (Math.hypot(x, y) <= 1.6) set(ox - 3 + x, oy - 3 + y, C.orbDetail);
  } else {
    (
      [
        [-3, -2, 1.6],
        [3, 1, 1.2],
        [-1, 4, 1],
        [2, -5, 0.8],
        [5, -2, 0.7],
      ] as const
    ).forEach(([cx, cy, r]) => {
      for (let y = -2; y <= 2; y++)
        for (let x = -2; x <= 2; x++)
          if (Math.hypot(x, y) <= r)
            set(ox + cx + x, oy + cy + y, x + y < 0 ? C.orbDetail : C.orbShade);
    });
  }

  const cloud = (cx: number, cy: number, w: number) => {
    const n = Math.max(3, Math.round(w / 6));
    const puffs: [number, number, number][] = [];
    for (let i = 0; i < n; i++) {
      const edge = i === 0 || i === n - 1;
      puffs.push([
        cx - w / 2 + (i + 0.5) * (w / n),
        cy - (edge ? 0 : 1 + rand() * 2),
        edge ? 2.5 : 3 + rand() * 2,
      ]);
    }
    const inside = (x: number, y: number) =>
      puffs.some(([px, py, r]) => Math.hypot(x - px, (y - py) * 1.35) <= r);
    for (let y = cy - 9; y <= cy + 1; y++) {
      for (let x = Math.round(cx - w / 2 - 5); x <= cx + w / 2 + 5; x++) {
        if (!inside(x, y)) continue;
        const top = !inside(x, y - 1);
        set(x, y, y >= cy ? C.cloudLo : top ? C.cloudHi : C.cloud);
      }
    }
  };
  cloud(60, 12, 30);
  cloud(178, 6, 20);
  cloud(395, 10, 34);
  cloud(470, 20, 14);

  /* ---------- hills ---------- */
  const hill = (
    fn: (x: number) => number,
    colorAt: (x: number, y: number, depth: number) => string,
  ) => {
    for (let x = 0; x < W; x++) {
      const top = Math.round(fn(x));
      for (let y = top; y < H; y++) set(x, y, colorAt(x, y, y - top));
    }
  };

  const pine = (x: number, by: number, h: number, colour: string, hi: string) => {
    for (let j = 0; j < h; j++) {
      const half = Math.max(0, Math.floor((j + 1) / 2) - (j % 3 === 2 ? 1 : 0));
      for (let i = -half; i <= half; i++)
        set(x + i, by - h + j, i === -half && half > 0 ? hi : colour);
    }
    set(x, by, colour);
  };

  hill(hillFar, (x, _y, d) => (d === 0 || (d === 1 && x % 2 === 0) ? C.farHi : C.far));
  for (let i = 0; i < 30; i++) {
    const x = Math.floor(rand() * W);
    pine(x, Math.round(hillFar(x)) + 1, 3 + Math.floor(rand() * 4), C.farPine, C.farPineHi);
  }

  hill(hillMid, (x, y, d) => {
    if (d === 0 || (d === 1 && x % 2 === 0)) return C.midHi;
    if (d > 2 && (x * 7 + y * 13) % 11 === 0) return C.midHi;
    if (d > 2 && (x * 5 + y * 3) % 9 === 0) return C.midLo;
    return C.mid;
  });

  /* ---------- foliage ---------- */
  const foliage = (blobs: [number, number, number][], pal: string[]) => {
    let x0 = Infinity;
    let x1 = -Infinity;
    let y0 = Infinity;
    let y1 = -Infinity;
    blobs.forEach(([bx, by, r]) => {
      x0 = Math.min(x0, bx - r);
      x1 = Math.max(x1, bx + r);
      y0 = Math.min(y0, by - r);
      y1 = Math.max(y1, by + r);
    });
    const blobAt = (x: number, y: number) => {
      for (let i = blobs.length - 1; i >= 0; i--) {
        const blob = blobs[i];
        if (!blob) continue;
        const [bx, by, r] = blob;
        if ((x - bx) ** 2 + (y - by) ** 2 <= r * r) return blob;
      }
      return null;
    };
    const painted: [number, number, number][] = [];
    for (let y = Math.floor(y0); y <= Math.ceil(y1); y++) {
      for (let x = Math.floor(x0); x <= Math.ceil(x1); x++) {
        const blob = blobAt(x, y);
        if (!blob) continue;
        const [bx, by, r] = blob;
        const local = -((x - bx) * 0.55 + (y - by) * 0.85) / r;
        const v = local * 0.85 + (rand() - 0.5) * 0.35;
        let idx = v > 0.72 ? 5 : v > 0.32 ? 4 : v > -0.05 ? 3 : v > -0.45 ? 2 : 1;
        if (!blobAt(x, y + 1)) idx = 0;
        else if (!blobAt(x + 1, y) && idx > 1) idx = 1;
        else if (!blobAt(x, y - 1) && idx < 3) idx = 3;
        set(x, y, at(pal, idx));
        painted.push([x, y, idx]);
      }
    }
    return painted;
  };

  const tree = (cx: number, gy: number, R: number, pal: string[] = C.leaf) => {
    const trunkH = Math.round(R * 1.1);
    const tw = R >= 9 ? 3 : 2;
    const tx = cx - Math.floor(tw / 2);
    for (let y = gy - trunkH - Math.round(R * 0.5); y <= gy; y++) {
      for (let i = 0; i < tw; i++) {
        let colour = i === 0 ? C.trunkHi : i === tw - 1 ? C.trunkLo : C.trunk;
        if ((y * 3 + i) % 7 === 0) colour = C.trunkLo;
        set(tx + i, y, colour);
      }
    }
    set(tx - 1, gy, C.trunkLo);
    set(tx + tw, gy, C.trunkLo);
    set(tx - 1, gy - trunkH * 0.6, C.trunk);
    set(tx - 2, gy - trunkH * 0.6 - 1, C.trunkHi);
    set(tx + tw, gy - trunkH * 0.75, C.trunkLo);
    const fy = gy - trunkH - R * 0.55;
    const j = () => (rand() - 0.5) * R * 0.2;
    return foliage(
      [
        [cx - R * 0.75 + j(), fy + R * 0.35 + j(), R * 0.62],
        [cx + R * 0.8 + j(), fy + R * 0.4 + j(), R * 0.6],
        [cx + j(), fy + j(), R * 0.85],
        [cx - R * 0.4 + j(), fy - R * 0.55 + j(), R * 0.6],
        [cx + R * 0.45 + j(), fy - R * 0.5 + j(), R * 0.55],
        [cx + j(), fy - R * 0.95 + j(), R * 0.45],
      ],
      pal,
    );
  };

  const bush = (cx: number, gy: number, w: number, h: number, berries = false) => {
    const painted = foliage(
      [
        [cx - w * 0.3, gy - h * 0.4, h * 0.55],
        [cx + w * 0.3, gy - h * 0.4, h * 0.55],
        [cx, gy - h * 0.6, h * 0.62],
      ],
      C.leaf,
    );
    if (berries) {
      painted
        .filter(([, , idx]) => idx >= 2 && rand() < 0.12)
        .forEach(([x, y]) => {
          set(x, y, SHARED.berry);
          set(x, y - 1, SHARED.berryHi);
        });
    }
  };

  /* ---------- cabins ---------- */
  const cabin = (x: number, w: number, wallH: number, groundFn: (x: number) => number) => {
    const base = Math.round(groundFn(x + w / 2)) + 1;
    for (let i = x - 1; i <= x + w; i++)
      for (let y = base + 1; y <= Math.round(groundFn(i)) + 1; y++)
        set(i, y, (i + y) % 3 ? C.stone : C.stoneLo);

    const top = base - wallH + 1;
    for (let y = top; y <= base; y++) {
      for (let i = x; i < x + w; i++) {
        let colour = (y - top) % 3 === 2 ? C.wallLo : C.wall;
        if (i === x) colour = C.wallHi;
        if (i === x + w - 1) colour = C.wallLo;
        if (y === base) colour = C.stoneLo;
        set(i, y, colour);
      }
    }

    for (let k = 0; ; k++) {
      const l = x - 2 + k * 2;
      const r = x + w + 1 - k * 2;
      if (r - l < 2) break;
      const y = top - 1 - k;
      for (let i = l; i <= r; i++) {
        let colour = (i + y) % 4 === 0 ? C.roofLo : C.roof;
        if (k === 0) colour = C.roofLo;
        if (i <= l + 1) colour = C.roofHi;
        if (r - l < 6) colour = C.roofHi;
        set(i, y, colour);
      }
    }

    const chx = x + w - 5;
    for (let y = top - 6; y <= top - 2; y++) {
      set(chx, y, C.stone);
      set(chx + 1, y, C.stoneLo);
    }
    set(chx - 1, top - 6, C.stoneLo);
    set(chx + 2, top - 6, C.stoneLo);
    fx.smoke.push({ x: chx, y: top - 8 });

    const ws = w >= 14 ? 3 : 2;
    const winXs = w >= 14 ? [x + 2, x + w - 2 - ws] : [x + 2];
    winXs.forEach((wx) => {
      const wy = top + 2;
      for (let j = 0; j < ws; j++) for (let i = 0; i < ws; i++) set(wx + i, wy + j, C.win);
      set(wx, wy, C.winHi);
      set(wx + ws - 1, wy + ws - 1, C.winLo);
      for (let i = -1; i <= ws; i++) set(wx + i, wy + ws, C.wallHi);
      if (!day) fx.windows.push({ x: wx, y: wy, s: ws });
    });

    const dx = w >= 14 ? x + Math.floor(w / 2) - 1 : x + w - 4;
    for (let y = top + 3; y < base; y++) {
      set(dx, y, C.door);
      set(dx + 1, y, C.woodLo);
    }
    set(dx + 1, base - 2, C.winLo);
    return { base };
  };

  for (const x of [143, 172, 268, 296]) {
    tree(x, Math.round(hillMid(x)) + 1, 3 + rand() * 1.5, C.leafFar);
  }
  cabin(156, 10, 5, hillMid);

  hill(hillNear, (x, _y, d) => {
    if (d === 0) return C.nearHi;
    if (d === 1) return x % 2 === 0 ? C.nearHi : C.near;
    if (d >= 3) {
      const row = d % 3;
      const on = (x + Math.floor(d / 3) * 2) % 5 < 3;
      if (row === 0 && on) return (x + d) % 5 === 0 ? C.teaHi : C.tea;
      if (row === 1 && on) return C.teaLo;
    }
    return C.near;
  });

  /* tea pickers working the hill rows */
  if (day) {
    for (const x of [357, 428]) {
      const key = { ...pickPerson(), h: SHARED.straw };
      sprite(x, Math.round(hillNear(x)) + 6 - FARMER.length + 1, FARMER, key);
    }
  }

  for (const x of [318, 352, 362, 446, 470, 25, 58]) {
    pine(x, Math.round(hillNear(x)) + 1, 6 + Math.floor(rand() * 4), at(C.leaf, 1), at(C.leaf, 3));
  }
  for (const x of [372, 437, 312]) tree(x, Math.round(hillNear(x)) + 1, 3.5 + rand());

  const { base: cabinBase } = cabin(330, 16, 8, hillNear);
  cabin(410, 14, 7, hillNear);
  if (day) sprite(348, cabinBase - PERSON.length + 1, PERSON, pickPerson());

  /* ---------- ground ---------- */
  for (let x = 0; x < W; x++) {
    const top = groundTop(x);
    for (let y = top; y < H; y++) {
      const d = y - top;
      const k = y - (H - 4);
      if (k === 1 && (x + y) % 4 === 0) continue;
      if (k === 2 && (x + y) % 2 === 0) continue;
      if (k === 3 && !(x % 4 === 0 && y % 2 === 1)) continue;
      let colour: string;
      if (d === 0) colour = rand() < 0.08 ? C.grass : C.grassHi;
      else if (d === 1) colour = x % 3 === 0 ? C.grassHi : C.grass;
      else if (d <= 3)
        colour = (x + y) % 4 === 0 ? C.grass : rand() < 0.05 ? C.grassTip : C.grassLo;
      else if (d <= 5) colour = (x + y) % 2 ? C.grassDk : C.grassLo;
      else if (d <= 8) colour = (x * 3 + y) % 7 === 0 ? C.pebble : (x + y) % 2 ? C.soil : C.grassDk;
      else colour = (x * 5 + y * 3) % 11 === 0 ? C.pebble : (x + y) % 2 ? C.soilLo : C.soil;
      if (k >= 0) colour = C.soilDk;
      set(x, y, colour);
    }
  }

  /* back bushes */
  bush(60, GROUND, 12, 6);
  bush(350, GROUND, 14, 6);
  bush(440, GROUND, 12, 5);

  /* trees */
  tree(18, GROUND, 8);
  tree(100, GROUND, 11);
  tree(186, GROUND, 7);
  tree(302, GROUND, 9);
  tree(392, GROUND, 10);
  tree(462, GROUND, 7);

  /* fence */
  for (let x = 118; x <= 166; x += 6) {
    for (let y = GROUND - 6; y <= GROUND; y++) {
      set(x, y, C.woodHi);
      set(x + 1, y, C.woodLo);
    }
    set(x, GROUND - 7, C.wood);
  }
  for (let x = 118; x <= 167; x++) {
    set(x, GROUND - 5, x % 6 < 2 ? null : C.wood);
    set(x, GROUND - 2, x % 6 < 2 ? null : C.woodLo);
  }
  for (let x = 118; x <= 166; x += 6) {
    set(x, GROUND - 5, C.woodHi);
    set(x, GROUND - 2, C.woodHi);
  }

  /* front bushes */
  bush(208, GROUND, 11, 7, true);
  bush(276, GROUND, 9, 5);
  bush(140, GROUND, 8, 4);
  bush(476, GROUND, 10, 5, true);

  /* lantern next to the landing spot */
  const lx = 262;
  for (let y = GROUND - 11; y <= GROUND; y++) set(lx, y, C.iron);
  set(lx - 1, GROUND, C.iron);
  set(lx + 1, GROUND, C.iron);
  sprite(lx - 1, GROUND - 16, LANTERN, { k: C.iron, w: C.winHi, W: C.win });
  if (!day) fx.lamps.push({ x: lx, y: GROUND - 13 });

  /* rocks */
  for (const x of [48, 176, 338, 452])
    sprite(x, GROUND - 3, ROCK, { h: C.rockHi, r: C.rock, l: C.rockLo });

  /* day: kid with a kite, someone on the fence, a walk with the dog */
  if (day) {
    const kx = 68;
    sprite(kx, GROUND - KID.length, KID, pickPerson());
    const kite = { x: 38, y: 13 };
    sprite(kite.x, kite.y, KITE, { a: SHARED.kite, b: SHARED.kiteHi, t: SHARED.kiteHi });
    const [sx, sy, ex, ey] = [kx, GROUND - 3, kite.x + 2, kite.y + 4];
    const steps = Math.max(Math.abs(ex - sx), Math.abs(ey - sy));
    for (let i = 0; i <= steps; i += 1) {
      const t = i / steps;
      // slight sag in the string
      set(sx + (ex - sx) * t, sy + (ey - sy) * t + Math.sin(t * Math.PI) * 3, SHARED.string);
    }

    sprite(150, GROUND - 10, SITTER, pickPerson());
    sprite(420, GROUND - PERSON.length, PERSON, pickPerson());
    sprite(425, GROUND - DOG.length, DOG, { d: SHARED.dog, t: SHARED.dog, D: SHARED.dogLo });
  }

  /* grass blades */
  for (let x = 0; x < W; x++) {
    const top = groundTop(x);
    if (inClearing(x, 1)) {
      if (rand() < 0.35) set(x, top - 1, C.grassHi);
      continue;
    }
    const r = rand();
    const h = r < 0.08 ? 4 : r < 0.25 ? 3 : r < 0.55 ? 2 : r < 0.85 ? 1 : 0;
    for (let k = 1; k <= h; k++)
      set(x, top - k, k === h ? C.grassTip : k === h - 1 ? C.grassHi : C.grass);
    if (h >= 3 && rand() < 0.4) set(x + (rand() < 0.5 ? -1 : 1), top - h, C.grassTip);
  }

  /* flowers */
  for (let i = 0; i < 48; i++) {
    const x = Math.floor(rand() * (W - 4));
    const rows = at(FLOWER_SPRITES, Math.floor(rand() * FLOWER_SPRITES.length));
    const [a, b] = at(PETALS, Math.floor(rand() * PETALS.length));
    if (inClearing(x, 4) || (x > 258 && x < 266)) continue;
    sprite(x, groundTop(x) - rows.length + 1, rows, { a, b, s: C.grassLo });
  }

  /* mushrooms */
  const shroom = {
    h: SHARED.capHi,
    r: SHARED.capRed,
    w: SHARED.spot,
    s: SHARED.stem,
    S: SHARED.stemLo,
  };
  for (const x of [90, 112, 314, 404]) sprite(x, GROUND - 4, MUSHROOM, shroom);
  for (const x of [133, 290, 470]) sprite(x, GROUND - 4, MUSHROOM_SMALL, shroom);

  /* fireflies by night, floating light motes by day */
  for (let i = 0; i < 14; i++) {
    fx.sparkles.push({
      x: Math.floor(rand() * W),
      y: GROUND - 4 - Math.floor(rand() * 12),
      delay: (rand() * 5).toFixed(2),
    });
  }

  /* ---------- day-only animated extras ---------- */
  if (day) {
    // light shafts fanning down from the sun onto the land
    [-4, -2.3, -1.1, -0.3, 0.6, 1.6, 3.2].forEach((slope, i) => {
      const rects: { x: number; y: number; w: number }[] = [];
      for (let y = oy + R + 2; y < GROUND + 3; y += 2) {
        const t = y - oy;
        const w = Math.round(1 + t * 0.22);
        rects.push({ x: Math.round(ox + t * slope - w / 2), y, w });
      }
      fx.rays.push({ rects, delay: (i * 0.85).toFixed(2) });
    });

    // flocks of birds crossing the sky
    (
      [
        { y: 9, dur: 38, delay: 0, n: 3 },
        { y: 17, dur: 52, delay: -22, n: 2 },
        { y: 5, dur: 46, delay: -36, n: 1 },
      ] as const
    ).forEach((flock) => {
      const birds: Bird[] = [];
      for (let i = 0; i < flock.n; i++)
        birds.push({
          dx: -i * 7,
          dy: i * 3 * (i % 2 ? 1 : -1) * 0.6,
          phase: (extra() * 0.6).toFixed(2),
        });
      fx.birds.push({ ...flock, birds });
    });

    // butterflies near the flowers
    for (let i = 0; i < 6; i++) {
      let x = Math.floor(extra() * W);
      if (inClearing(x, 6)) x += 40;
      fx.butterflies.push({
        x,
        y: GROUND - 5 - Math.floor(extra() * 8),
        a: at(["#ffffff", "#ffd166", "#f4a259", "#c7b0f0"], i % 4),
        delay: (extra() * 5).toFixed(2),
      });
    }

    // someone strolling along the left path
    fx.walkers.push({ y: GROUND - WALK_A.length, key: pickPerson() });
  }

  /* ---------- pixels -> merged runs ---------- */
  const rects: SceneRect[] = [];
  const open = new Map<string, SceneRect>();
  for (let y = 0; y < H; y++) {
    let x = 0;
    while (x < W) {
      const colour = buf[y * W + x];
      if (!colour) {
        x++;
        continue;
      }
      let x2 = x + 1;
      while (x2 < W && buf[y * W + x2] === colour) x2++;
      const key = `${x},${x2 - x},${colour}`;
      const prev = open.get(key);
      if (prev && prev.y + prev.h === y) prev.h++;
      else {
        const rect: SceneRect = { x, y, w: x2 - x, h: 1, c: colour };
        rects.push(rect);
        open.set(key, rect);
      }
      x = x2;
    }
  }

  return { rects, palette: C, ...fx };
}

/* ---------- theme ---------- */

/** The site keeps its theme as `dark` on <html>; `data-theme` is honoured too. */
function readDocumentMode(): SceneMode {
  const root = document.documentElement;
  return root.classList.contains("dark") || root.getAttribute("data-theme") === "dark"
    ? "dark"
    : "light";
}

/** Effects never run on the server, but the layout one must not warn there either. */
const useBrowserLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Resolve the scene to draw. A fixed mode is taken as given; `auto` follows the
 * class the theme toggle flips, and `system` follows the OS preference.
 *
 * The first render is the day scene on both the server and the client, so
 * hydration matches; the real theme is applied before the first paint after
 * that, and the strip only appears once the scene is settled.
 */
function useSceneMode(mode: ModeSetting): { mode: SceneMode; ready: boolean } {
  const fixed = mode === "dark" || mode === "light";
  const [resolved, setResolved] = useState<SceneMode>("light");
  const [ready, setReady] = useState(false);

  useBrowserLayoutEffect(() => {
    if (fixed) {
      setReady(true);
      return;
    }
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const read = () => {
      setResolved(mode === "system" ? (media.matches ? "dark" : "light") : readDocumentMode());
      setReady(true);
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ["class", "data-theme"] });
    const onSystemChange = () => {
      if (mode === "system") read();
    };
    media.addEventListener("change", onSystemChange);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", onSystemChange);
    };
  }, [mode, fixed]);

  return { mode: fixed ? mode : resolved, ready };
}

/* ---------- rendering ---------- */

const Pixels = ({ pixels, ox = 0, oy = 0 }: { pixels: Pixel[]; ox?: number; oy?: number }) =>
  pixels.map((pixel, i) => (
    <rect key={i} x={ox + pixel.x} y={oy + pixel.y} width="1" height="1" fill={pixel.c} />
  ));

interface PixelLandscapeProps {
  /** `auto` follows the theme toggle; `dark` / `light` pin a scene. */
  mode?: ModeSetting;
  /** Extra classes on the strip (the height comes from the stylesheet). */
  className?: string;
  /** Changes the grass, flower and star scatter. */
  seed?: number;
}

export function PixelLandscape({
  mode = "auto",
  className = "",
  seed = SEED,
}: PixelLandscapeProps) {
  const scene = useSceneMode(mode);
  const {
    rects,
    palette,
    stars,
    birds,
    rays,
    windows,
    lamps,
    smoke,
    walkers,
    butterflies,
    sparkles,
  } = useMemo(() => buildScene(seed, scene.mode), [seed, scene.mode]);
  const day = scene.mode === "light";

  const birdUp = useMemo(() => spritePixels(BIRD_UP, { x: SHARED.bird }), []);
  const birdDown = useMemo(() => spritePixels(BIRD_DOWN, { x: SHARED.bird }), []);

  return (
    <div
      className={`pixel-landscape ${className}`.trim()}
      data-mode={scene.mode}
      aria-hidden="true"
    >
      {scene.ready ? (
        <svg
          key={scene.mode}
          className="pl-fade"
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMax slice"
          shapeRendering="crispEdges"
          focusable="false"
        >
          <g>
            {stars.map((star, i) =>
              star.big ? (
                <g key={i} className="pl-twinkle" style={{ animationDelay: `${star.delay}s` }}>
                  <rect
                    x={star.x}
                    y={star.y}
                    width="1"
                    height="1"
                    style={{ fill: "var(--pl-star, #eef4e6)" }}
                  />
                  <rect
                    x={star.x - 1}
                    y={star.y}
                    width="3"
                    height="1"
                    style={{ fill: "var(--pl-star, #eef4e6)", opacity: 0.45 }}
                  />
                  <rect
                    x={star.x}
                    y={star.y - 1}
                    width="1"
                    height="3"
                    style={{ fill: "var(--pl-star, #eef4e6)", opacity: 0.45 }}
                  />
                </g>
              ) : (
                <rect
                  key={i}
                  x={star.x}
                  y={star.y}
                  width="1"
                  height="1"
                  className={i % 3 === 0 ? "pl-twinkle" : undefined}
                  style={{
                    fill: "var(--pl-star, #eef4e6)",
                    opacity: 0.75,
                    animationDelay: `${star.delay}s`,
                  }}
                />
              ),
            )}
            {birds.map((flock, i) => (
              <g
                key={i}
                className="pl-fly"
                style={{ animationDuration: `${flock.dur}s`, animationDelay: `${flock.delay}s` }}
              >
                {flock.birds.map((bird, j) => (
                  <g key={j}>
                    <g className="pl-frame-a" style={{ animationDelay: `${bird.phase}s` }}>
                      <Pixels pixels={birdUp} ox={bird.dx} oy={flock.y + bird.dy} />
                    </g>
                    <g className="pl-frame-b" style={{ animationDelay: `${bird.phase}s` }}>
                      <Pixels pixels={birdDown} ox={bird.dx} oy={flock.y + bird.dy} />
                    </g>
                  </g>
                ))}
              </g>
            ))}
          </g>

          <g>
            {rects.map((rect, i) => (
              <rect key={i} x={rect.x} y={rect.y} width={rect.w} height={rect.h} fill={rect.c} />
            ))}
          </g>

          <g>
            {rays.map((ray, i) => (
              <g key={i} className="pl-ray" style={{ animationDelay: `${ray.delay}s` }}>
                {ray.rects.map((rect, j) => (
                  <rect
                    key={j}
                    x={rect.x}
                    y={rect.y}
                    width={rect.w}
                    height="2"
                    fill="rgba(255,247,190,0.38)"
                  />
                ))}
              </g>
            ))}
            {windows.map((window, i) => (
              <rect
                key={i}
                x={window.x - 1}
                y={window.y - 1}
                width={window.s + 2}
                height={window.s + 2}
                fill="rgba(255,200,90,0.28)"
                className="pl-flicker"
                style={{ animationDelay: `${i * 0.9}s` }}
              />
            ))}
            {lamps.map((lamp, i) => (
              <g key={i} className="pl-flicker">
                <rect
                  x={lamp.x - 3}
                  y={lamp.y - 3}
                  width="7"
                  height="7"
                  fill="rgba(255,205,110,0.16)"
                />
                <rect
                  x={lamp.x - 2}
                  y={lamp.y - 2}
                  width="5"
                  height="5"
                  fill="rgba(255,205,110,0.18)"
                />
                <rect
                  x={LANDING_ZONE.x + 4}
                  y={GROUND}
                  width={lamp.x - LANDING_ZONE.x + 2}
                  height="1"
                  fill="rgba(255,215,130,0.18)"
                />
              </g>
            ))}
            {smoke.flatMap((puff, i) =>
              [0, 1.3, 2.6].map((delay, j) => (
                <rect
                  key={`${i}-${j}`}
                  x={puff.x}
                  y={puff.y}
                  width={j === 0 ? 2 : 1}
                  height={j === 0 ? 2 : 1}
                  fill={palette.smoke}
                  className="pl-smoke"
                  style={{ animationDelay: `${delay + i * 0.4}s` }}
                />
              )),
            )}
            {walkers.map((walker, i) => (
              <g key={i} className="pl-walk">
                <g className="pl-frame-a">
                  <Pixels pixels={spritePixels(WALK_A, walker.key)} oy={walker.y} />
                </g>
                <g className="pl-frame-b">
                  <Pixels pixels={spritePixels(WALK_B, walker.key)} oy={walker.y} />
                </g>
              </g>
            ))}
            {butterflies.map((butterfly, i) => (
              <g
                key={i}
                className="pl-drift"
                style={{ animationDelay: `${butterfly.delay}s`, animationDuration: "7s" }}
              >
                <g className="pl-frame-a">
                  <Pixels
                    pixels={spritePixels(BUTTERFLY_A, { a: butterfly.a, b: "#3a3a3a" })}
                    ox={butterfly.x}
                    oy={butterfly.y}
                  />
                </g>
                <g className="pl-frame-b">
                  <Pixels
                    pixels={spritePixels(BUTTERFLY_B, { a: butterfly.a, b: "#3a3a3a" })}
                    ox={butterfly.x}
                    oy={butterfly.y}
                  />
                </g>
              </g>
            ))}
            {sparkles.map((sparkle, i) => (
              <rect
                key={i}
                x={sparkle.x}
                y={day ? sparkle.y - 10 : sparkle.y}
                width="1"
                height="1"
                fill={palette.sparkle}
                className="pl-drift"
                style={{ animationDelay: `${sparkle.delay}s` }}
              />
            ))}
          </g>

          {/* The landing: top edge is the grass surface, centre is the clear patch.
              The companion measures this rect and sits on it. */}
          <rect
            data-companion-anchor="footer-grass"
            x={LANDING_ZONE.x}
            y={LANDING_ZONE.y}
            width={LANDING_ZONE.width}
            height="1"
            fill="none"
          />
        </svg>
      ) : null}
    </div>
  );
}
