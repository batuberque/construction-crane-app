/**
 * Working-radius arcs.
 *
 * Every mobile crane's spec sheet carries a radius/capacity diagram: concentric
 * arcs struck from the slew centre, each one a distance the boom can reach.
 * That diagram is the structural motif of this site — the arcs are anchored to
 * the bottom-left corner (the slew centre sits off-canvas) and sweep across.
 *
 * Decorative only: aria-hidden, and it draws itself once on mount via CSS
 * (no framer-motion, so it stays off the critical-path chunk).
 */

const VIEW_W = 1200;
const VIEW_H = 800;
const RADII = [300, 480, 660, 840, 1020, 1200];
const QUARTER = Math.PI / 2;

type Props = {
  className?: string;
  /** Index of the arc drawn in hazard yellow. Others are hairline. */
  accentIndex?: number;
  /**
   * Hairline colour. Defaults to translucent white because these sit over
   * photography — a solid token colour disappears into the dark half of the
   * image and the whole diagram reads as one stray line.
   */
  hairline?: string;
};

const RadiusArcs = ({
  className = '',
  accentIndex = 2,
  hairline = 'rgba(244,243,240,0.22)',
}: Props) => (
  <svg
    className={className}
    viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
    preserveAspectRatio="xMinYMax slice"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    {RADII.map((r, i) => (
      <path
        key={r}
        className="arc"
        // Quarter arc from the baseline round to the left edge.
        d={`M ${r} ${VIEW_H} A ${r} ${r} 0 0 0 0 ${VIEW_H - r}`}
        stroke={i === accentIndex ? 'var(--hazard)' : hairline}
        strokeWidth={i === accentIndex ? 1.5 : 1}
        vectorEffect="non-scaling-stroke"
        style={{
          ['--arc-len' as string]: QUARTER * r,
          animationDelay: `${120 + i * 90}ms`,
        }}
      />
    ))}
  </svg>
);

export default RadiusArcs;
