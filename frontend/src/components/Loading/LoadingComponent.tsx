/**
 * Route fallback. Deliberately in-flow and un-animated.
 *
 * This used to be a position:fixed, inset-0, #0f0f0f overlay that faded in over
 * 0.5s — it blacked out the entire viewport on every first navigation, and a
 * fallback that animates its own entrance guarantees a visible flash even when
 * the chunk arrives quickly. Keeping framer-motion out of it also keeps it off
 * the critical-path chunk.
 */
const RouteFallback = () => (
  <div
    className="flex-grow flex items-center justify-center pt-nav min-h-[60vh]"
    role="status"
    aria-live="polite"
  >
    <span className="spec text-fg-muted">YÜKLENİYOR</span>
  </div>
);

export default RouteFallback;
