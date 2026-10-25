import {
  MOTION_CLASS,
  SCENE_CELLS,
  SCENE_COLS,
  SCENE_ROWS,
  SEAT,
  TONE_VARS,
  staticPaths,
} from "./scene";

const PATHS = staticPaths(SCENE_CELLS);
const MOVING = SCENE_CELLS.filter((cell) => cell.motion);

/**
 * The hero's pixel-art desk. Decorative — the character that belongs in it is
 * the page companion itself, perched on the seat element below.
 */
export function HeroIllustration() {
  return (
    <div className="hero-scene" aria-hidden="true">
      <svg
        className="hero-scene-svg"
        viewBox={`0 0 ${SCENE_COLS} ${SCENE_ROWS}`}
        shapeRendering="crispEdges"
        focusable="false"
      >
        {PATHS.map((path) => (
          <path key={path.tone} d={path.d} style={{ fill: TONE_VARS[path.tone] }} />
        ))}
        {MOVING.map((cell) => (
          <rect
            key={cell.motion}
            className={MOTION_CLASS[cell.motion as keyof typeof MOTION_CLASS]}
            x={cell.x}
            y={cell.y}
            width={cell.w}
            height={cell.h}
            style={{ fill: TONE_VARS[cell.tone] }}
          />
        ))}
      </svg>
      <span
        data-companion-anchor="hero-desk"
        className="hero-scene-seat"
        style={{
          left: `${(SEAT.x / SCENE_COLS) * 100}%`,
          top: `${(SEAT.y / SCENE_ROWS) * 100}%`,
          width: `${(SEAT.w / SCENE_COLS) * 100}%`,
        }}
      />
    </div>
  );
}
