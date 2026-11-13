import { posePaths } from "@/components/companion/sprites";

/**
 * The site mark: the page companion, sitting. It is drawn from the same sprite
 * data the character renders from and in the same theme tokens, so the logo
 * always matches whatever the companion looks like on the page.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {posePaths("sit").map((path) => (
        <path key={path.fill} d={path.d} style={{ fill: path.fill }} />
      ))}
    </svg>
  );
}
