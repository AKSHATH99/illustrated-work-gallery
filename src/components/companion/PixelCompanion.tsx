import { useCallback, useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { prefersReducedMotion, useCompanion, type ActiveChangeReason } from "./useCompanion";
import { BUBBLE_MESSAGES, GREETING, navSpot, sectionSpot, type SpotConfig } from "./spots";
import { GRID_SIZE, POSES, posePaths, type Facing, type PoseKey } from "./sprites";

/** A spot tied to one of the platforms its anchor selector matched. */
interface Placement {
  config: SpotConfig;
  sectionId: string;
  index: number;
}

interface Point {
  x: number;
  y: number;
}

interface Flight {
  peak: number;
  duration: number;
  fade?: "in" | "out";
}

interface SpriteState {
  pose: PoseKey;
  facing: Facing;
}

/**
 * Why a move stopped. `superseded` matters separately from `no-perch`: a move a
 * newer activation has already replaced must not hand off to the next leg.
 */
type Outcome = "moved" | "superseded" | "no-perch";

const CROUCH_MS = 90;
const LAND_MS = 130;
/**
 * The reading line. A platform whose top edge has passed this far down the
 * viewport owns its section, so the character sits where the visitor is looking
 * rather than where it happened to be sitting last.
 */
const FOCUS_LINE = 0.38;
/** Damping for self-initiated moves: a perch is only reconsidered this often. */
const REFOCUS_MS = 650;
/** Past this distance a hop reads as a lunge, so the character jumps instead. */
const JUMP_MIN_PX = 150;
/** The beat before the character makes its entrance on a fresh page load. */
const ENTRANCE_DELAY_MS = 420;
/** Length of the fall onto the desk. */
const DROP_MS = 640;
/** How long a remark stays on screen. */
const BUBBLE_MS = 4000;
/** The entrance happens once per page load, not once per mount. */
let entranceDone = false;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });

/** A superseded flight gets cancelled, and a cancelled animation rejects `finished`. */
const settled = (animation: Animation) =>
  animation.finished.then(
    () => undefined,
    () => undefined,
  );

/** Every in-layout platform the spot's selector matches, in DOM order. */
const platforms = (selector: string): Element[] =>
  Array.from(document.querySelectorAll(selector)).filter(
    (node) => node.getClientRects().length > 0,
  );

/** The page scrolled away from the character, or the character from the page. */
const since = (at: number, ms: number) => Date.now() - at > ms;

/**
 * How far below the top of the window a perch has to sit. Small screens carry a
 * sticky header, and a character perched under it reads as a rendering glitch.
 */
function topClearance(): number {
  const bar = document.querySelector("header.sticky");
  if (!bar) return 6;
  const box = bar.getBoundingClientRect();
  return box.height > 0 ? Math.max(6, box.bottom + 6) : 6;
}

/** The sprite box lives in the stylesheet, so themes and breakpoints stay in one place. */
function readCompanionSize(): number {
  const declared = Number.parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue("--companion-size"),
  );
  return Number.isFinite(declared) && declared > 0 ? declared : 32;
}

/**
 * The page companion: one small pixel creature that lives at the desk in the
 * hero and moves to whatever the visitor is reading — the project card or
 * timeline entry under their eyes as they scroll, or, after a sidebar click,
 * first along to the selected nav item and then into the section. Every
 * position is measured from real element boxes, so the layout stays the source
 * of truth at any viewport size.
 */
export function PixelCompanion() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const enabled = pathname === "/";

  const layerRef = useRef<HTMLDivElement | null>(null);
  const xTrackRef = useRef<HTMLDivElement | null>(null);
  const yTrackRef = useRef<HTMLDivElement | null>(null);

  const [ready, setReady] = useState(false);
  const [size, setSize] = useState(0);
  const [sprite, setSprite] = useState<SpriteState>({ pose: "sit", facing: "right" });
  const [bubble, setBubble] = useState<string | null>(null);
  const [bubbleBelow, setBubbleBelow] = useState(false);

  const sizeRef = useRef(0);
  const pointRef = useRef<Point | null>(null);
  const placeRef = useRef<Placement | null>(null);
  /** The section the character currently answers to, shared with the tracker. */
  const activeRef = useRef<string | null>(null);
  const busyRef = useRef(false);
  const visibleRef = useRef(false);
  /** When the character last started moving, so scrolling cannot spam it. */
  const lastMoveRef = useRef(0);
  const sequenceRef = useRef(0);
  const timersRef = useRef<number[]>([]);
  const flightsRef = useRef<Animation[]>([]);
  const bubbleTurnRef = useRef(0);
  const bubbleTimerRef = useRef(0);
  // The scroll refresh and the landing settle refer to each other; the ref
  // breaks the cycle without either one capturing a stale closure.
  const refreshRef = useRef<() => void>(() => {});

  /** Write the sprite box position straight to the DOM: animations need it synchronously. */
  const moveTo = useCallback((point: Point) => {
    pointRef.current = point;
    const layer = layerRef.current;
    if (layer) {
      layer.style.left = `${point.x}px`;
      layer.style.top = `${point.y}px`;
    }
  }, []);

  const setVisible = useCallback((on: boolean) => {
    visibleRef.current = on;
    layerRef.current?.classList.toggle("is-visible", on);
  }, []);

  const show = useCallback(
    (next: SpriteState) => {
      // Putting a pose on the character is the same as putting it back on screen.
      setVisible(true);
      setSprite(next);
    },
    [setVisible],
  );

  const later = useCallback((ms: number, token: number, fn: () => void) => {
    const id = window.setTimeout(() => {
      timersRef.current = timersRef.current.filter((pending) => pending !== id);
      if (token === sequenceRef.current) fn();
    }, ms);
    timersRef.current.push(id);
  }, []);

  /** Put a remark next to the character for a moment, above or below as fits. */
  const say = useCallback((message: string) => {
    setBubble(message);
    setBubbleBelow((pointRef.current?.y ?? 0) < 80);
    window.clearTimeout(bubbleTimerRef.current);
    bubbleTimerRef.current = window.setTimeout(() => setBubble(null), BUBBLE_MS);
  }, []);

  const cancelMotion = useCallback(() => {
    flightsRef.current.forEach((animation) => animation.cancel());
    flightsRef.current = [];
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
    layerRef.current?.classList.remove("is-crouch");
  }, []);

  /**
   * Geometry only: where the sprite box would sit on one platform element. Null
   * when the character has no room to rest on it right now — it has scrolled
   * out of view, or out of the section it belongs to.
   */
  const pointFor = useCallback((config: SpotConfig, raw: Element): Point | null => {
    const box = raw.getBoundingClientRect();
    if (box.width <= 0 || box.height <= 0) return null;

    // The platform has to be in front of the visitor and inside the section it
    // is perched in — a card scrolled past is not a place to sit.
    const host = raw.closest("section");
    const hostBox = host && host !== raw ? host.getBoundingClientRect() : null;
    const cell = sizeRef.current / GRID_SIZE;
    const anchor = POSES[config.pose].anchorRow;
    const dangling = GRID_SIZE - 1 - anchor;
    const perchY = config.edge === "top" ? box.top : box.bottom;
    const abovePerch = (anchor + 1) * cell;
    // The whole body has to fit on screen, not just the strip it stands on: a
    // platform at the edge of the viewport would clip the character.
    if (perchY - abovePerch < topClearance()) return null;
    const bodyHeight = config.edge === "top" ? abovePerch : abovePerch - dangling * cell;
    // The strip has to be inside the viewport as well as inside its section, or
    // a platform scrolled past would still read as "available".
    const top = Math.max(hostBox ? hostBox.top : 0, perchY - bodyHeight, 0);
    const bottom = Math.min(
      hostBox ? hostBox.bottom : window.innerHeight,
      perchY,
      window.innerHeight,
    );
    if (bottom - top < 6) return null;

    const width = sizeRef.current;
    const align = config.alignX;
    let x: number;
    if (align === "center") x = box.left + box.width / 2 - width / 2 + config.offsetX;
    else if (align === "end") x = box.right - width + config.offsetX;
    else if (align === "outside-end") x = box.right + config.offsetX;
    else x = box.left + config.offsetX;

    // Clamped to the viewport, so the companion can never add horizontal overflow.
    const margin = 6;
    return {
      x: clamp(x, margin, Math.max(margin, window.innerWidth - width - margin)),
      y: clamp(perchY - abovePerch, margin, Math.max(margin, window.innerHeight - width - margin)),
    };
  }, []);

  /** Measure a placement, falling back to the spot's own fallback platform. */
  const measure = useCallback(
    (placement: Placement): Point | null => {
      const nodes = platforms(placement.config.anchor);
      const raw = nodes[clamp(placement.index, 0, Math.max(nodes.length - 1, 0))];
      const point = raw ? pointFor(placement.config, raw) : null;
      if (point) return point;

      const fallback = placement.config.fallback;
      return fallback && fallback.id !== placement.config.id
        ? measure({ config: fallback, sectionId: placement.sectionId, index: 0 })
        : null;
    },
    [pointFor],
  );

  /**
   * The platform the visitor has actually read to: the last one in the section
   * whose top edge has passed the reading line, ties going to the one nearest
   * the start of a row. Derived from position alone, so scrolling back up walks
   * the choices in reverse without any memory of where it sat before.
   */
  const focusPlacement = useCallback(
    (config: SpotConfig, sectionId: string): Placement | null => {
      const nodes = platforms(config.anchor);
      const line = window.innerHeight * FOCUS_LINE;
      let nearest = -1;
      let entered = -1;
      let enteredTop = 0;
      let enteredLeft = 0;

      for (let index = 0; index < nodes.length; index += 1) {
        const raw = nodes[index];
        if (!raw || !pointFor(config, raw)) continue;
        if (nearest < 0) nearest = index;
        const box = raw.getBoundingClientRect();
        if (box.top > line) continue;
        const tie = Math.abs(box.top - enteredTop) <= 0.5 && box.left < enteredLeft;
        if (entered < 0 || box.top > enteredTop + 0.5 || tie) {
          entered = index;
          enteredTop = box.top;
          enteredLeft = box.left;
        }
      }

      const index = entered >= 0 ? entered : nearest;
      return index < 0 ? null : { config, sectionId, index };
    },
    [pointFor],
  );

  /**
   * Pick the platform a spot wants right now. Position-derived, so the same
   * layout always gives the same answer and no move is ever a coin toss.
   */
  const resolve = useCallback(
    (config: SpotConfig, sectionId: string): Placement | null => {
      const candidate = { config, sectionId, index: 0 };
      const placement =
        config.pick === "focus"
          ? focusPlacement(config, sectionId)
          : measure(candidate)
            ? candidate
            : null;
      if (placement) return placement;

      const fallback = config.fallback;
      return fallback && fallback.id !== config.id ? resolve(fallback, sectionId) : null;
    },
    [focusPlacement, measure],
  );

  /** Park the character at a spot with no animation. */
  const park = useCallback(
    (config: SpotConfig, sectionId: string): Outcome => {
      const placement = resolve(config, sectionId);
      if (!placement) return "no-perch";
      const point = measure(placement);
      if (!point) return "no-perch";
      placeRef.current = placement;
      moveTo(point);
      show({ pose: config.pose, facing: config.facing });
      return "moved";
    },
    [measure, moveTo, resolve, show],
  );

  /**
   * Animate the sprite box along an arc. Horizontal and vertical movement run on
   * separate tracks, so a jump can rise quickly and fall with weight.
   */
  const fly = useCallback(
    (from: Point, to: Point, flight: Flight): Promise<void> => {
      const xTrack = xTrackRef.current;
      const yTrack = yTrackRef.current;
      if (!xTrack || !yTrack) return Promise.resolve();

      moveTo(to);
      const dx = from.x - to.x;
      const dy = from.y - to.y;
      const apex = Math.min(dy, 0) - flight.peak;
      const fill = flight.fade ? "forwards" : "none";

      const horizontal = xTrack.animate(
        [{ transform: `translate3d(${dx}px, 0, 0)` }, { transform: "translate3d(0px, 0, 0)" }],
        { duration: flight.duration, easing: "cubic-bezier(.32,.62,.48,1)", fill },
      );

      const arc: Keyframe[] = [
        { transform: `translate3d(0, ${dy}px, 0)`, easing: "cubic-bezier(.18,.72,.42,1)" },
        {
          offset: 0.5,
          transform: `translate3d(0, ${apex}px, 0)`,
          easing: "cubic-bezier(.55,.05,.78,.42)",
        },
        { transform: "translate3d(0, 0, 0)" },
      ];
      if (flight.fade === "out") {
        arc[0] = { ...arc[0], opacity: 1 };
        arc[1] = { ...arc[1], opacity: 1 };
        arc[2] = { ...arc[2], opacity: 0 };
      } else if (flight.fade === "in") {
        arc[0] = { ...arc[0], opacity: 0 };
        arc[1] = { ...arc[1], opacity: 1 };
      }

      const vertical = yTrack.animate(arc, { duration: flight.duration, fill });
      flightsRef.current.push(horizontal, vertical);

      return Promise.race([
        Promise.all([settled(horizontal), settled(vertical)]),
        sleep(flight.duration + 250),
      ]).then(() => undefined);
    },
    [moveTo],
  );

  /**
   * A way in that gravity does most of: fall from off screen, bounce twice on
   * the landing spot and settle. The track is an offset from the destination, so
   * the last keyframe is exactly where the character was measured to sit.
   */
  const dropIn = useCallback((height: number): Promise<void> => {
    const yTrack = yTrackRef.current;
    if (!yTrack) return Promise.resolve();

    const animation = yTrack.animate(
      [
        { transform: `translate3d(0, ${-height}px, 0)`, easing: "cubic-bezier(.36,0,.82,.44)" },
        { offset: 0.6, transform: "translate3d(0, 0, 0)", easing: "cubic-bezier(.3,.5,.4,1)" },
        {
          offset: 0.72,
          transform: "translate3d(0, -16px, 0)",
          easing: "cubic-bezier(.5,.05,.7,.4)",
        },
        { offset: 0.86, transform: "translate3d(0, 0, 0)", easing: "cubic-bezier(.3,.5,.4,1)" },
        { offset: 0.93, transform: "translate3d(0, -5px, 0)" },
        { transform: "translate3d(0, 0, 0)" },
      ],
      { duration: DROP_MS },
    );
    flightsRef.current.push(animation);

    return Promise.race([settled(animation), sleep(DROP_MS + 250)]).then(() => undefined);
  }, []);

  /**
   * Take ownership of the character's movement. Claiming before measuring means
   * a move that turns out to have nowhere to go still retires the one it
   * replaced, instead of leaving the character stuck mid-flight forever.
   */
  const claim = useCallback(() => {
    const token = ++sequenceRef.current;
    busyRef.current = true;
    lastMoveRef.current = Date.now();
    cancelMotion();
    return token;
  }, [cancelMotion]);

  /** Settle on a landing: the pose, then whatever the page did underneath. */
  const land = useCallback(
    (placement: Placement, config: SpotConfig, token: number) => {
      placeRef.current = placement;
      show({ pose: "squash", facing: config.facing });
      // Still busy until the squash has settled: repositioning mid-landing
      // would yank the character off the platform it is arriving on.
      later(LAND_MS, token, () => {
        show({ pose: config.pose, facing: config.facing });
        busyRef.current = false;
        // The page may still have been scrolling underneath the landing.
        refreshRef.current();
      });
    },
    [later, show],
  );

  /**
   * The signature move: crouch, jump along an arc sized to the distance between
   * the two places, land with a squash, then settle into the spot's pose.
   */
  const jumpTo = useCallback(
    async (config: SpotConfig, sectionId: string, kind: "jump" | "hop"): Promise<Outcome> => {
      const token = claim();
      const placement = resolve(config, sectionId);
      const to = placement ? measure(placement) : null;
      const from = pointRef.current;
      if (!placement || !to || !from || !layerRef.current || prefersReducedMotion()) {
        const outcome = park(config, sectionId);
        busyRef.current = false;
        return outcome;
      }

      const distance = Math.hypot(to.x - from.x, to.y - from.y);
      const peak =
        kind === "jump" ? clamp(10 + distance * 0.28, 14, 34) : clamp(6 + distance * 0.12, 8, 12);
      const duration =
        kind === "jump"
          ? clamp(380 + distance * 0.55, 380, 540)
          : clamp(210 + distance * 0.25, 210, 320);

      show({ pose: "stand", facing: config.facing });
      layerRef.current.classList.add("is-crouch");
      await sleep(CROUCH_MS);
      if (token !== sequenceRef.current) return "superseded";
      layerRef.current.classList.remove("is-crouch");

      show({ pose: "air", facing: config.facing });
      await fly(from, to, { peak, duration });
      if (token !== sequenceRef.current) return "superseded";

      land(placement, config, token);
      return "moved";
    },
    [claim, fly, land, measure, park, resolve, show],
  );

  /**
   * The long way between two places: out of sight at the old one, back in above
   * the new one. Used when the character crosses sections — a ballistic arc
   * that far would read as a flight, not a hop — and on its own when it has no
   * visible position to leave from, which is how it arrives on a section the
   * visitor has just scrolled into.
   */
  const travelTo = useCallback(
    async (config: SpotConfig, sectionId: string): Promise<Outcome> => {
      const token = claim();
      const placement = resolve(config, sectionId);
      const to = placement ? measure(placement) : null;
      const from = visibleRef.current ? pointRef.current : null;
      if (!placement || !to || !layerRef.current || prefersReducedMotion()) {
        const outcome = park(config, sectionId);
        busyRef.current = false;
        return outcome;
      }

      const sideways = from ? (to.x >= from.x ? 1 : -1) : config.facing === "right" ? 1 : -1;
      if (from) {
        show({ pose: "air", facing: sideways > 0 ? "right" : "left" });
        await fly(
          from,
          { x: from.x + sideways * 20, y: from.y + 14 },
          {
            peak: 9,
            duration: 190,
            fade: "out",
          },
        );
        if (token !== sequenceRef.current) return "superseded";
      }

      show({ pose: "air", facing: config.facing });
      await fly({ x: to.x - sideways * 24, y: to.y - 18 }, to, {
        peak: 6,
        duration: 240,
        fade: "in",
      });
      if (token !== sequenceRef.current) return "superseded";

      land(placement, config, token);
      return "moved";
    },
    [claim, fly, land, measure, park, resolve, show],
  );

  /**
   * The scroll entry point: get the character onto a content perch using the
   * least dramatic move that fits. Nearby → a hop; further within the same
   * section → a jump; another section, or nowhere in sight to jump from → the
   * staged travel.
   */
  const relocate = useCallback(
    (config: SpotConfig, sectionId: string): Promise<Outcome> => {
      const placement = resolve(config, sectionId);
      const to = placement ? measure(placement) : null;
      const from = visibleRef.current ? pointRef.current : null;
      if (!to || !from) return travelTo(config, sectionId);
      if (placeRef.current?.sectionId !== sectionId) return travelTo(config, sectionId);
      const distance = Math.hypot(to.x - from.x, to.y - from.y);
      return jumpTo(config, sectionId, distance > JUMP_MIN_PX ? "jump" : "hop");
    },
    [jumpTo, measure, resolve, travelTo],
  );

  /**
   * The entrance, once per page load: after a beat the character falls in from
   * above, bounces twice on the desk and says hello. Only ever runs when the
   * desk is where it is about to land, so a page opened lower down just places
   * it normally.
   */
  const enter = useCallback(
    async (config: SpotConfig, sectionId: string) => {
      const token = claim();
      const placement = resolve(config, sectionId);
      const to = placement ? measure(placement) : null;
      if (!placement || !to || !yTrackRef.current || prefersReducedMotion()) {
        const outcome = park(config, sectionId);
        busyRef.current = false;
        setVisible(outcome === "moved");
        // No fall under a reduced-motion preference, but the hello still stands.
        if (outcome === "moved" && prefersReducedMotion()) say(GREETING);
        return;
      }

      // Positioned at the destination, but off screen until the fall begins.
      placeRef.current = placement;
      moveTo(to);
      await sleep(ENTRANCE_DELAY_MS);
      if (token !== sequenceRef.current) return;

      setSprite({ pose: "air", facing: config.facing });
      setVisible(true);
      // The track is an offset from the destination, so this starts the drop
      // just above the top edge of the window however far down the desk is.
      await dropIn(to.y + sizeRef.current + 8);
      if (token !== sequenceRef.current) return;

      show({ pose: "squash", facing: config.facing });
      await sleep(LAND_MS);
      if (token !== sequenceRef.current) return;

      // Two little jumps of welcome before it settles down to work.
      for (const peak of [18, 11]) {
        show({ pose: "air", facing: config.facing });
        await fly(to, to, { peak, duration: 260 });
        if (token !== sequenceRef.current) return;
        show({ pose: "squash", facing: config.facing });
        await sleep(120);
        if (token !== sequenceRef.current) return;
      }

      show({ pose: config.pose, facing: config.facing });
      busyRef.current = false;
      say(GREETING);
      refreshRef.current();
    },
    [claim, dropIn, fly, measure, moveTo, park, resolve, say, setVisible, show],
  );

  /**
   * Keep the character honest about the real layout: glued to its platform as
   * the page moves under it, hopping to whichever platform the visitor has read
   * on to, and back out of sight when there is nothing left to stand on.
   */
  const refresh = useCallback(() => {
    if (busyRef.current) return;
    const sectionId = activeRef.current;
    if (!sectionId) return;
    const current = placeRef.current;

    // Already where it belongs: follow the platform, then ask whether the
    // visitor has meaningfully moved on to a different one.
    if (current && current.sectionId === sectionId) {
      const point = measure(current);
      if (point) {
        // A sidebar perch is only ever a rest stop. The moment the section
        // itself has somewhere to sit, the character leaves the rail for it.
        if (current.config.temporary && since(lastMoveRef.current, REFOCUS_MS)) {
          const section = sectionSpot(sectionId);
          if (section && resolve(section, sectionId)) {
            void travelTo(section, sectionId);
            return;
          }
        }
        moveTo(point);
        setVisible(true);
        if (
          current.config.pick === "focus" &&
          since(lastMoveRef.current, REFOCUS_MS) &&
          !prefersReducedMotion()
        ) {
          const next = focusPlacement(current.config, sectionId);
          if (next && next.index !== current.index) void relocate(current.config, sectionId);
        }
        return;
      }
    }

    // The resting place is gone, or belongs to a section the visitor has left.
    // The section's own perch claims the character; if even that is out of
    // view, it waits rather than hovering over content.
    const section = sectionSpot(sectionId);
    const placement = section ? resolve(section, sectionId) : null;
    if (!section || !placement) {
      placeRef.current = null;
      setVisible(false);
      return;
    }
    if (since(lastMoveRef.current, REFOCUS_MS)) {
      void relocate(section, sectionId);
      return;
    }
    setVisible(park(section, sectionId) === "moved");
  }, [focusPlacement, measure, moveTo, park, relocate, resolve, setVisible, travelTo]);

  useEffect(() => {
    refreshRef.current = refresh;
  }, [refresh]);

  const onActiveChange = useCallback(
    async (next: string, reason: ActiveChangeReason) => {
      const section = sectionSpot(next);

      // Nowhere in the current layout for the character to sit: it goes away
      // rather than hovering over body text, but keeps answering to the section,
      // so the next scroll frame can place it as soon as a perch is reachable.
      const retreat = () => {
        placeRef.current = null;
        setVisible(false);
      };

      if (reason === "click") {
        // Jump along the sidebar first, then settle into the section itself.
        const jumped = await jumpTo(navSpot(next), next, "jump");
        if (jumped === "superseded") return;
        const outcome = section ? await travelTo(section, next) : jumped;
        if (outcome === "no-perch") retreat();
        return;
      }

      // Scrolling goes straight to the content the visitor is looking at — the
      // sidebar is theirs to read, not a stop on the way.
      if (section) {
        const outcome = await relocate(section, next);
        if (outcome !== "no-perch") return;
      }
      // Nothing in this section is in reach yet — the hero desk is usually a
      // screen above. Wait out of sight for the next frame instead of parking
      // on the sidebar, where there would be no reason to leave from.
      retreat();
    },
    [jumpTo, relocate, setVisible, travelTo],
  );

  useCompanion({
    enabled,
    activeRef,
    onActiveChange,
    onIdleBeat: useCallback(() => {
      const current = placeRef.current;
      const point = pointRef.current;
      if (!current || !point || busyRef.current) return;

      const sitting = current.config.pose === "sit" || current.config.pose === "rest";
      const resting: SpriteState = {
        pose: sitting ? "sit" : "stand",
        facing: current.config.facing,
      };
      const roll = Math.random();
      const token = ++sequenceRef.current;

      if (roll < 0.45) {
        // A blink, or one lazy swing of the legs while perched on an edge.
        show({ ...resting, pose: sitting ? "sitSway" : "blink" });
        later(sitting ? 620 : 150, token, () => show(resting));
      } else if (roll < 0.75) {
        // Glance toward whatever the visitor is reading.
        show({ ...resting, pose: "look" });
        later(1100, token, () => show(resting));
      } else {
        // Sink deeper into the perch, then come back.
        show({ ...resting, pose: sitting ? "rest" : "blink" });
        later(1400, token, () => show(resting));
      }
    }, [later, show]),
  });

  useEffect(() => {
    if (!enabled) return;
    const measured = readCompanionSize();
    sizeRef.current = measured;
    setSize(measured);
    setReady(true);
  }, [enabled]);

  // First appearance: the character is part of the hero scene, so on a page
  // opened at the top it arrives there by falling in; anywhere else it settles
  // onto the section it opened in, or the sidebar perch.
  useEffect(() => {
    if (!ready || placeRef.current || entranceDone) return;
    entranceDone = true;
    const sectionId = activeRef.current ?? "home";
    const desk = sectionSpot("home");
    if (sectionId === "home" && desk && resolve(desk, "home")) {
      void enter(desk, "home");
      return;
    }
    const section = sectionSpot(sectionId);
    const placed =
      (section ? park(section, sectionId) === "moved" : false) ||
      park(navSpot(sectionId), sectionId) === "moved";
    setVisible(placed);
  }, [activeRef, enter, park, ready, resolve, setVisible]);

  // The perch follows the real layout: scrolling, resizing, fonts and images
  // arriving late.
  useEffect(() => {
    if (!enabled) return;
    let frame = 0;
    let settle = 0;
    const remeasure = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const measured = readCompanionSize();
        sizeRef.current = measured;
        setSize(measured);
        refresh();
      });
      // Scrolling can stop between two of the character's positions without
      // ever giving it a frame where the next perch is reachable.
      window.clearTimeout(settle);
      settle = window.setTimeout(() => refresh(), 220);
    };
    window.addEventListener("resize", remeasure, { passive: true });
    window.addEventListener("scroll", remeasure, { passive: true });
    const observer = new ResizeObserver(remeasure);
    observer.observe(document.body);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(settle);
      window.removeEventListener("resize", remeasure);
      window.removeEventListener("scroll", remeasure);
      observer.disconnect();
    };
  }, [enabled, refresh]);

  useEffect(() => () => cancelMotion(), [cancelMotion]);

  if (!enabled || !ready || size <= 0) return null;

  const activate = () => {
    if (busyRef.current) return;
    const message = BUBBLE_MESSAGES[bubbleTurnRef.current % BUBBLE_MESSAGES.length] as string;
    bubbleTurnRef.current += 1;
    say(message);

    const current = placeRef.current;
    if (!current || prefersReducedMotion()) return;

    const resting: SpriteState = { pose: current.config.pose, facing: current.config.facing };
    const token = ++sequenceRef.current;
    if (bubbleTurnRef.current % 2 === 0) {
      // A couple of happy little steps.
      show({ pose: "walkA", facing: resting.facing });
      later(150, token, () => show({ pose: "walkB", facing: resting.facing }));
      later(300, token, () => show({ pose: "walkA", facing: resting.facing }));
      later(450, token, () => show(resting));
    } else {
      show({ pose: "look", facing: resting.facing });
      later(1200, token, () => show(resting));
    }
  };

  return (
    <div ref={layerRef} className="companion" style={{ width: `${size}px`, height: `${size}px` }}>
      <div ref={xTrackRef} className="companion-track">
        <div ref={yTrackRef} className="companion-track">
          <button
            type="button"
            className="companion-body"
            aria-label="Pixel companion — say hello"
            onClick={activate}
          >
            <span className="companion-pose">
              <svg
                className="companion-sprite"
                viewBox={`0 0 ${GRID_SIZE} ${GRID_SIZE}`}
                shapeRendering="crispEdges"
                style={{ transform: sprite.facing === "left" ? "scaleX(-1)" : "none" }}
                aria-hidden="true"
                focusable="false"
              >
                {posePaths(sprite.pose).map((path) => (
                  <path key={path.fill} d={path.d} style={{ fill: path.fill }} />
                ))}
              </svg>
            </span>
            {bubble ? (
              <span className={`companion-bubble${bubbleBelow ? " is-below" : ""}`}>{bubble}</span>
            ) : null}
          </button>
        </div>
      </div>
    </div>
  );
}
