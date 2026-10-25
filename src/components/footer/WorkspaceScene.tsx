import { MOTION_CLASS, TONE_VARS, staticPaths } from "@/components/hero/scene";
import { WORKSPACE_CELLS, WORKSPACE_NARROW, WORKSPACE_SEAT, WORKSPACE_WIDE } from "./workspace";

interface Frame {
  x: number;
  y: number;
  w: number;
  h: number;
}

const PATHS = staticPaths(WORKSPACE_CELLS);
const MOVING = WORKSPACE_CELLS.filter((cell) => cell.motion);

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
          left: `${((WORKSPACE_SEAT.x - frame.x) / frame.w) * 100}%`,
          top: `${((WORKSPACE_SEAT.y - frame.y) / frame.h) * 100}%`,
          width: `${(WORKSPACE_SEAT.w / frame.w) * 100}%`,
        }}
      />
    </div>
  );
}

/**
 * The workspace at the end of the page. Decorative, and empty of characters on
 * purpose: the one that belongs here is the page companion, which arrives here
 * once the visitor has scrolled all the way down.
 */
export function WorkspaceScene() {
  return (
    <div aria-hidden="true" className="select-none">
      <Framed frame={WORKSPACE_NARROW} className="workspace-scene-narrow lg:hidden" />
      <Framed frame={WORKSPACE_WIDE} className="workspace-scene-wide hidden lg:block" />
    </div>
  );
}
