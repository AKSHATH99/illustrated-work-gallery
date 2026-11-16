import { MOTION_CLASS, TONE_VARS, staticPaths } from "@/components/hero/scene";
import { LANDSCAPE_CELLS, LANDSCAPE_NARROW, LANDSCAPE_SEAT, LANDSCAPE_WIDE } from "./workspace";

interface Frame {
  x: number;
  y: number;
  w: number;
  h: number;
}

const PATHS = staticPaths(LANDSCAPE_CELLS);
const MOVING = LANDSCAPE_CELLS.filter((cell) => cell.motion);

/** One framing of the drawing, with the perch measured against that framing. */
function Framed({ frame, className }: { frame: Frame; className: string }) {
  return (
    <div className={`workspace-scene ${className}`}>
      <svg
        viewBox={`${frame.x} ${frame.y} ${frame.w} ${frame.h}`}
        shapeRendering="crispEdges"
        focusable="false"
      >
        {PATHS.map((path) => (
          <path key={path.tone} d={path.d} style={{ fill: TONE_VARS[path.tone] }} />
        ))}
        {MOVING.map((cell) => (
          <rect
            key={`${cell.motion}-${cell.x}`}
            className={MOTION_CLASS[cell.motion as keyof typeof MOTION_CLASS]}
            x={cell.x}
            y={cell.y}
            width={cell.w}
            height={cell.h}
            style={{ fill: TONE_VARS[cell.tone] }}
          />
        ))}
      </svg>
      {/* The landing: the character's hips rest on this element's top edge, which
          is the desk surface itself. Only the framing on screen has client rects,
          so the other one can never be chosen. */}
      <span
        data-companion-anchor="footer-desk"
        className="workspace-scene-seat"
        style={{
          left: `${((LANDSCAPE_SEAT.x - frame.x) / frame.w) * 100}%`,
          top: `${((LANDSCAPE_SEAT.y - frame.y) / frame.h) * 100}%`,
          width: `${(LANDSCAPE_SEAT.w / frame.w) * 100}%`,
        }}
      />
    </div>
  );
}

/**
 * The night landscape at the very end of the page. The page companion arrives
 * on its open grassy perch once the visitor reaches the footer.
 */
export function WorkspaceScene() {
  return (
    <div aria-hidden="true" className="select-none">
      <Framed frame={LANDSCAPE_NARROW} className="workspace-scene-narrow lg:hidden" />
      <Framed frame={LANDSCAPE_WIDE} className="workspace-scene-wide hidden lg:block" />
    </div>
  );
}
